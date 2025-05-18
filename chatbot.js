let currentLanguage = 'en';
let shinkansenData = {};


fetch('data.json')
  .then(response => response.json())
  .then(data => {
    shinkansenData = data;
  });

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
  let msg = message.toLowerCase();
  let response = '';

    const routes = shinkansenData.routes;
    const fares = shinkansenData.fares;

  if (msg.includes("tokyo") && msg.includes("osaka")) {
    response = routes["tokyo-osaka"][currentLanguage];
  } else if (msg.includes("osaka") && msg.includes("fuji")) {
    response = routes["osaka-fuji"][currentLanguage];
  } else if (msg.includes("fuji") && msg.includes("nagano")) {
    response = routes["fuji-nagano"][currentLanguage];
  } else if (msg.includes("tokyo") && msg.includes("nagano")) {
    response = routes["tokyo-nagano"][currentLanguage];
  } else if (msg.includes("child") || msg.includes("niño") || msg.includes("子供")) {
    response = fares.children[currentLanguage];
  } else {
      response = {
        en: "❓ I’m still learning! Please try a different question about the Shinkansen.",
        es: "❓ ¡Todavía estoy aprendiendo! Prueba con otra pregunta sobre el Shinkansen.",
        jp: "❓ まだ勉強中です！新幹線に関する別の質問を試してください。"
      }[currentLanguage];
    }


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
