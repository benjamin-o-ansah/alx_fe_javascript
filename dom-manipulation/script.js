// ===============================
// Dynamic Quote Generator with Web Storage, Import/Export & Filtering
// ===============================

// Load quotes from localStorage or set defaults
let quotes = JSON.parse(localStorage.getItem("quotes") || "[]");
if (quotes.length === 0) {
  quotes = [
    { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
    { text: "Your limitation—it’s only your imagination.", category: "Inspiration" },
    { text: "Push yourself, because no one else is going to do it for you.", category: "Motivation" },
    { text: "Success is not in what you have, but who you are.", category: "Wisdom" }
  ];
  saveQuotes();
}

// Select elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");
const exportButton = document.getElementById("exportQuotes");
const importInput = document.getElementById("importFile");
const addQuoteButton = document.getElementById("addQuoteBtn");
const categoryFilter = document.getElementById("categoryFilter");

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Populate dropdown with unique categories
function populateCategories() {
  const categories = [...new Set(quotes.map(q => q.category))];
  categoryFilter.innerHTML = '<option value="all">All Categories</option>';

  categories.forEach(cat => {
    const option = document.createElement("option");
    option.value = cat;
    option.textContent = cat;
    categoryFilter.appendChild(option);
  });

  // Restore last selected category from localStorage
  const lastCategory = localStorage.getItem("selectedCategory") || "all";
  categoryFilter.value = lastCategory;
}

// Show a random quote (filtered by category if applicable)
function showRandomQuote() {
  const selectedCategory = categoryFilter.value;
  const filteredQuotes =
    selectedCategory === "all"
      ? quotes
      : quotes.filter(q => q.category === selectedCategory);

  if (filteredQuotes.length === 0) {
    quoteDisplay.textContent = "No quotes available for this category.";
    return;
  }

  const randomIndex = Math.floor(Math.random() * filteredQuotes.length);
  const randomQuote = filteredQuotes[randomIndex];

  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>— ${randomQuote.category}</small>
  `;

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
}

// Filter quotes based on selected category
function filterQuotes() {
  const selectedCategory = categoryFilter.value;
  localStorage.setItem("selectedCategory", selectedCategory);
  showRandomQuote();
}

// Add a new quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  quotes.push({ text: quoteText, category: quoteCategory });
  saveQuotes();

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  // Refresh categories dynamically
  populateCategories();

  alert("New quote added successfully!");
  showRandomQuote();
}

// Export quotes to JSON file
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
        alert("Invalid file format. Please upload a valid JSON array.");
        return;
      }
      quotes.push(...importedQuotes);
      saveQuotes();
      populateCategories();
      alert("Quotes imported successfully!");
      showRandomQuote();
    } catch {
      alert("Error reading file. Ensure it's valid JSON.");
    }
  };
  fileReader.readAsText(event.target.files[0]);
}

// Initialize on page load
document.addEventListener("DOMContentLoaded", () => {
  populateCategories();

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

  // Event listeners
  newQuoteButton.addEventListener("click", showRandomQuote);
  addQuoteButton.addEventListener("click", addQuote);
  exportButton.addEventListener("click", exportToJsonFile);
  importInput.addEventListener("change", importFromJsonFile);
});
