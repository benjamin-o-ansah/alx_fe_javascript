// ==========================
// Dynamic Quote Generator with Web Storage & JSON Import/Export
// ==========================

// Load quotes from localStorage or set default quotes
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

// Save quotes to localStorage
function saveQuotes() {
  localStorage.setItem("quotes", JSON.stringify(quotes));
}

// Show a random quote
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

  // Save last viewed quote in sessionStorage
  sessionStorage.setItem("lastQuote", JSON.stringify(randomQuote));
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

  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

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
