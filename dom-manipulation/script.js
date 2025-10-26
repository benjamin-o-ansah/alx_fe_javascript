// ===============================
// Dynamic Quote Generator with Filtering, Storage, Import/Export, and Server Sync
// ===============================

let quotes = JSON.parse(localStorage.getItem("quotes") || "[]");

if (quotes.length === 0) {
  quotes = [
    { id: 1, text: "The best way to get started is to quit talking and begin doing.", category: "Motivation", updatedAt: Date.now() },
    { id: 2, text: "Your limitation—it’s only your imagination.", category: "Inspiration", updatedAt: Date.now() }
  ];
  saveQuotes();
}

// Select DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const exportButton = document.getElementById("exportQuotes");
const syncButton = document.getElementById("syncQuotes");
const importInput = document.getElementById("importFile");
const addQuoteButton = document.getElementById("addQuoteBtn");
const categoryFilter = document.getElementById("categoryFilter");
const notification = document.getElementById("notification");

// ===============================
// Utility & Storage Functions
// ===============================
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

function notify(message, duration = 3000) {
  notification.textContent = message;
  notification.style.display = "block";
  setTimeout(() => (notification.style.display = "none"), duration);
}

// ===============================
// Category Handling
// ===============================
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';
  categories.forEach(cat => {
    const opt = document.createElement("option");
    opt.value = cat;
    opt.textContent = cat;
    categoryFilter.appendChild(opt);
  });
  const last = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = last;
}

// ===============================
// Quote Display
// ===============================
function showRandomQuote() {
  const selected = categoryFilter.value;
  const filtered = selected === "all" ? quotes : quotes.filter(q => q.category === selected);
  if (filtered.length === 0) {
    quoteDisplay.textContent = "No quotes for this category.";
    return;
  }
  const randomQuote = filtered[Math.floor(Math.random() * filtered.length)];
  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>— ${randomQuote.category}</small>
  `;
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

function filterQuotes() {
  const selected = categoryFilter.value;
  localStorage.setItem("selectedCategory", selected);
  showRandomQuote();
}

// ===============================
// Add, Import & Export Quotes
// ===============================
function addQuote() {
  const text = document.getElementById("newQuoteText").value.trim();
  const cat = document.getElementById("newQuoteCategory").value.trim();
  if (!text || !cat) return alert("Enter both a quote and category.");

  const newQuote = { id: Date.now(), text, category: cat, updatedAt: Date.now() };
  quotes.push(newQuote);
  saveQuotes();
  populateCategories();
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";
  notify("Quote added locally.");

  // 🚀 Push this new quote to the server
  pushQuoteToServer(newQuote);

  showRandomQuote();
}

function exportToJsonFile() {
  const blob = new Blob([JSON.stringify(quotes, null, 2)], { type: "application/json" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  link.click();
  URL.revokeObjectURL(url);
}

function importFromJsonFile(event) {
  const reader = new FileReader();
  reader.onload = e => {
    try {
      const imported = JSON.parse(e.target.result);
      quotes.push(...imported);
      saveQuotes();
      populateCategories();
      notify("Quotes imported successfully.");
    } catch {
      alert("Invalid file format.");
    }
  };
  reader.readAsText(event.target.files[0]);
}

async function fetchQuotesFromServer() {
  const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // mock API
  try {
    const response = await fetch(SERVER_URL);
    const serverData = await response.json();
    
    // Convert server posts into quote format
    const serverQuotes = serverData.slice(0, 5).map((post, i) => ({
      id: i + 100,
      text: post.title,
      category: "Server",
      updatedAt: Date.now()
    }));

    return serverQuotes;
  } catch (err) {
    console.error("Error fetching server quotes:", err);
    notify("Failed to fetch quotes from server.");
    return [];
  }
}

// ===============================
// Server Sync Simulation
// ===============================
const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // Simulated endpoint

async function syncWithServer() {
  notify("Syncing with server...");

  const serverQuotes = await fetchQuotesFromServer();

  if (!serverQuotes.length) return; // nothing to merge

  // Merge logic: server data takes precedence
  serverQuotes.forEach(sq => {
    const local = quotes.find(q => q.id === sq.id);
    if (!local) {
      quotes.push(sq);
    } else if (sq.updatedAt > local.updatedAt) {
      Object.assign(local, sq);
    }
  });

  saveQuotes();
  populateCategories();
  notify("Quotes synced with server!"); // ✅ exact string required
  showRandomQuote();
}


async function pushQuoteToServer(quote) {
  try {
    const SERVER_URL = "https://jsonplaceholder.typicode.com/posts"; // mock API
    const response = await fetch(SERVER_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(quote)
    });

    if (!response.ok) throw new Error("Failed to push quote to server.");

    const result = await response.json();
    console.log("Quote pushed to server:", result);
    notify("Quote synced to server successfully!");
  } catch (err) {
    console.error(err);
    notify("Failed to sync quote to server.");
  }
}


// ===============================
// Initialization
// ===============================
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();
  const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (lastQuote) {
    quoteDisplay.innerHTML = `<p>"${lastQuote.text}"</p><small>— ${lastQuote.category}</small>`;
  } else {
    showRandomQuote();
  }

  // Event listeners
  newQuoteButton.addEventListener("click", showRandomQuote);
  addQuoteButton.addEventListener("click", addQuote);
  exportButton.addEventListener("click", exportToJsonFile);
  importInput.addEventListener("change", importFromJsonFile);
  syncButton.addEventListener("click", syncWithServer);

  // Periodic background sync (every 60 seconds)
  setInterval(syncWithServer, 60000);
});
