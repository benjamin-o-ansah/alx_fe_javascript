//  Define an array of quote objects
let quotes = [
  { text: "The best way to get started is to quit talking and begin doing.", category: "Motivation" },
  { text: "Your limitation—it’s only your imagination.", category: "Inspiration" },
  { text: "Push yourself, because no one else is going to do it for you.", category: "Motivation" },
  { text: "Success is not in what you have, but who you are.", category: "Wisdom" }
];

// Select DOM elements
const quoteDisplay = document.getElementById("quoteDisplay");
const newQuoteButton = document.getElementById("newQuote");

// Function to show a random quote
function showRandomQuote() {
  if (quotes.length === 0) {
    quoteDisplay.textContent = "No quotes available. Add one below!";
    return;
  }

  // Pick a random quote object
  const randomIndex = Math.floor(Math.random() * quotes.length);
  const randomQuote = quotes[randomIndex];

  // Display the quote text and category
  quoteDisplay.innerHTML = `
    <p>"${randomQuote.text}"</p>
    <small>— ${randomQuote.category}</small>
  `;
}

// Create a form dynamically for adding new quotes
function createAddQuoteForm() {
  // Create a wrapper div
  const formDiv = document.createElement("div");

  // Create input for quote text
  const quoteInput = document.createElement("input");
  quoteInput.type = "text";
  quoteInput.id = "newQuoteText";
  quoteInput.placeholder = "Enter a new quote";

  // Create input for category
  const categoryInput = document.createElement("input");
  categoryInput.type = "text";
  categoryInput.id = "newQuoteCategory";
  categoryInput.placeholder = "Enter quote category";

  // Create add button
  const addButton = document.createElement("button");
  addButton.textContent = "Add Quote";
  addButton.onclick = addQuote;

  // Append all elements to the form div
  formDiv.appendChild(quoteInput);
  formDiv.appendChild(categoryInput);
  formDiv.appendChild(addButton);

  // Append the form to the body (or below the quote section)
  document.body.appendChild(formDiv);
}

// Function to add a new quote
function addQuote() {
  const quoteText = document.getElementById("newQuoteText").value.trim();
  const quoteCategory = document.getElementById("newQuoteCategory").value.trim();

  // Validate inputs
  if (quoteText === "" || quoteCategory === "") {
    alert("Please enter both a quote and a category.");
    return;
  }

  // Add the new quote object to the quotes array
  quotes.push({ text: quoteText, category: quoteCategory });

  // Clear inputs
  document.getElementById("newQuoteText").value = "";
  document.getElementById("newQuoteCategory").value = "";

  alert("New quote added successfully!");
  showRandomQuote(); // Optionally refresh to show the newly added quote
}

// Event listener for showing new random quotes
newQuoteButton.addEventListener("click", showRandomQuote);

// Initialize the app when the page loads
document.addEventListener("DOMContentLoaded", () => {
  showRandomQuote();
  createAddQuoteForm();
});
