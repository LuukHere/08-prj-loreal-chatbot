/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Cloudflare Worker URL
const workerUrl = "https://beauty-bot.crops1023.workers.dev/";

// Show the bot's opening message as a chat bubble
chatWindow.innerHTML = `<div class="msg ai">👋 Hello! I'm L'Oreal's Beauty-Bot. I can help you with all your beauty and L'Oreal questions! What is something I can help you with?</div>`;

// Store chat history as an array of messages
let messages = [
  {
    role: "system",
    // This system prompt tells the AI to only answer questions about L'Oreal and makeup.
    content:
      "You are a helpful assistant. Only answer questions related to L'Oreal products and makeup. If asked about anything else, politely say you can only help with L'Oreal and makeup questions.",
  },
];

// Listen for form submit
chatForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  // Get user's question
  const question = userInput.value.trim();
  if (!question) return;

  // Add user's message to messages array
  messages.push({ role: "user", content: question });

  // Show user's message in chat window
  chatWindow.innerHTML += `<div class="msg user">${question}</div>`;

  // Clear input box
  userInput.value = "";

  // Send messages to Cloudflare Worker and get response
  try {
    // Add temperature to the request body for more creative answers
    const requestBody = {
      messages,
      temperature: 0.5, // 0 = more focused, 1 = more creative
    };

    const response = await fetch(workerUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(requestBody),
    });
    const data = await response.json();

    // Get the assistant's reply
    const aiReply = data.choices[0].message.content;

    // Show reply in console
    console.log("AI response:", aiReply);

    // Show reply below user's message in chat window
    chatWindow.innerHTML += `<div class="msg ai">${aiReply}</div>`;

    // Add assistant's reply to messages array
    messages.push({ role: "assistant", content: aiReply });
  } catch (err) {
    // Show error message in chat window
    chatWindow.innerHTML += `<div class="msg ai">Sorry, Beauty-Bot isn't available right now! Please try again later.</div>`;
    console.error("Error fetching AI response:", err);
  }
});
