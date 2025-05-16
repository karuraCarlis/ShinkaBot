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

  if (message.toLowerCase().includes("donate") || message.toLowerCase().includes("apoyar")) {
    response = "💖 You can support ShinkaBot via PayPal, Ko-fi or Buy Me a Coffee. Links below! 💖";
  } else if (currentLanguage === 'en') {
    response = `You asked in English: "${message}". I'm still learning, but happy to help!`;
  } else if (currentLanguage === 'es') {
    response = `Has preguntado en Español: "${message}". ¡Todavía estoy aprendiendo, pero feliz de ayudarte!`;
  } else if (currentLanguage === 'jp') {
    response = `日本語で質問しましたね：「${message}」。まだ勉強中ですが、助けたいです！`;
  }

  addMessage(response, 'bot');
}
