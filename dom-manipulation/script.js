// ==========================
// Dynamic Quote Generator with Web Storage & JSON Import/Export
// ==========================

// Initialize the quotes array (load from localStorage if available)
let quotes = JSON.parse(localStorage.getItem("quotes") || "[]");

// Provide default quotes if none exist yet
if (quotes.length === 0) {
  quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Your limitation—it’s only your imagination.", category: "Inspiration" },
    { text: "Push yourself, because no one else is going to do it for you.", category: "Motivation" },
    { text: "Success is not in what you have, but who you are.", category: "Wisdom" }
  ];
  saveQuotes();
}

// Select DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

// Function to save quotes to Local Storage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote and store it in Session Storage
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Add one below!";
    return;
  }

  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>— ${randomQuote.category}</small>
  `;

  // Save last viewed quote to Session Storage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

//  Create form for adding quotes dynamically
function createAddQuoteForm() {
  const formDiv = document.createElement("div");

  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);

  document.body.appendChild(formDiv);
}

// Add new quote and update Local Storage
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });
  saveQuotes(); // Update Local Storage

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("New quote added successfully!");
  showRandomQuote();
}

// Create buttons for JSON import/export
function createImportExportButtons() {
  const controlsDiv = document.createElement("div");

  // Export button
  const exportBtn = document.createElement("button");
  exportBtn.textContent = "Export Quotes (JSON)";
  exportBtn.onclick = exportToJsonFile;

  // Import file input
  const importInput = document.createElement("input");
  importInput.type = "file";
  importInput.id = "importFile";
  importInput.accept = ".json";
  importInput.onchange = importFromJsonFile;

  controlsDiv.appendChild(exportBtn);
  controlsDiv.appendChild(importInput);

  document.body.appendChild(controlsDiv);
}

// Export quotes as JSON file
function exportToJsonFile() {
  const dataStr = JSON.stringify(quotes, null, 2);
  const blob = new Blob([dataStr], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = "quotes.json";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

// Import quotes from a JSON file
function importFromJsonFile(event) {
  const fileReader = new FileReader();
  fileReader.onload = function (e) {
    try {
      const importedQuotes = JSON.parse(e.target.result);
      if (!Array.isArray(importedQuotes)) {
        alert("Invalid file format. Must be a JSON array.");
        return;
      }
      quotes.push(...importedQuotes);
      saveQuotes();
      alert("Quotes imported successfully!");
      showRandomQuote();
    } catch {
      alert("Error reading file. Ensure it's valid JSON.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize the app on page load
document.addEventListener("DOMContentLoaded", () => {
  // Restore last viewed quote if available
  const lastQuote = JSON.parse(sessionStorage.getItem("lastQuote"));
  if (lastQuote) {
    quoteDisplay.innerHTML = `
      <p>"${lastQuote.text}"</p>
      <small>— ${lastQuote.category}</small>
    `;
  } else {
    showRandomQuote();
  }

  createAddQuoteForm();
  createImportExportButtons();
  newQuoteButton.addEventListener("click", showRandomQuote);
});
