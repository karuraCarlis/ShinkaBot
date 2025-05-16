function sendMessage() {
  const input = document.getElementById("user-input");
  const chatBox = document.getElementById("chat-box");
  const userMessage = input.value.trim();

  if (userMessage === "") return;

  chatBox.innerHTML += `<p><strong>You:</strong> ${userMessage}</p>`;

  const lower = userMessage.toLowerCase();
  let reply = "I'm sorry, I didn't understand. Please ask about Shinkansen routes or travel times.";

  if (lower.includes("tokyo") && lower.includes("osaka")) {
    reply = "The Shinkansen from Tokyo to Osaka takes about 2.5 to 3 hours. Nozomi is the fastest.";
  } else if (lower.includes("jr pass")) {
    reply = "The JR Pass is valid on Hikari and Kodama trains, but not on Nozomi.";
  }

  chatBox.innerHTML += `<p><strong>Bot:</strong> ${reply}</p>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;
}