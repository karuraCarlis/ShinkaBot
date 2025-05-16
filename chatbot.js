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

let currentLanguage = 'en';

function setLanguage(lang) {
  currentLanguage = lang;
  addMessage(`Language set to ${lang === 'en' ? 'English' : lang === 'es' ? 'Español' : '日本語'}`, 'bot');
  clearChat();
}

function clearChat() {
  document.getElementById('chat-box').innerHTML = '';
}

function sendMessage() {
  const input = document.getElementById('user-input');
  const message = input.value.trim();
  if (!message) return;
  addMessage(message, 'user');
  input.value = '';
  setTimeout(() => {
    respond(message);
  }, 500);
}

function addMessage(message, sender) {
  const chatBox = document.getElementById('chat-box');
  const messageElem = document.createElement('div');
  messageElem.className = sender;
  messageElem.textContent = message;
  chatBox.appendChild(messageElem);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function respond(message) {
  let response = '';
  if (currentLanguage === 'en') {
    response = `You asked in English: "${message}". Sorry, I am still learning!`;
  } else if (currentLanguage === 'es') {
    response = `Has preguntado en Español: "${message}". ¡Estoy aprendiendo aún!`;
  } else if (currentLanguage === 'jp') {
    response = `日本語で質問しましたね：「${message}」。まだ勉強中です！`;
  }
  addMessage(response, 'bot');
}
