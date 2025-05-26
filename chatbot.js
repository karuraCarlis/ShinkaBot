let currentLanguage = 'en';
let shinkansenData = {};
let stationData = {};
let map;
      // Llamar al cargar la página:
  window.onload = () => {
    initMap();
  };
let cityList = [];

  const translations = {
    en: {
      ask: "Enter a city or region to find the nearest Shinkansen station:",
      notFound: "Sorry, I couldn't find a nearby station for that location.",
      result: "Nearest station: "
    },
    es: {
      ask: "Ingresa una ciudad o región para encontrar la estación de Shinkansen más cercana:",
      notFound: "Lo siento, no encontré una estación cercana para ese lugar.",
      result: "Estación más cercana: "
    },
    jp: {
      ask: "新幹線の最寄り駅を探すには、都市または地域を入力してください：",
      notFound: "申し訳ありませんが、その場所の近くの駅が見つかりませんでした。",
      result: "最寄り駅："
    }
  };

fetch('data.json')
  .then(response => response.json())
  .then(data => {
    shinkansenData = data;
  });

// Cargar estaciones desde ,  ojo stationData = json

fetch('stations.json')
  .then(res => res.json())
  .then(json => {
    stationData = json;
    cityList = Object.keys(json); // muy útil para autocomplete
    setLanguage(currentLanguage); // Mostrar el mensaje inicial
  })
    .catch((err) => {
      console.error("Error loading station data:", err);
    });

function setLanguage(lang) {
  currentLanguage = lang;

  // Mostrar el mensaje inicial
  document.getElementById("ask-text").textContent = translations[lang].ask;
    document.getElementById("cityInput").placeholder =
      lang === 'es' ? "Ej. Osaka, Nagano" :
      lang === 'jp' ? "例：大阪、長野" : "e.g. Osaka, Nagano";
    document.getElementById("response").textContent = ""
  
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

  if (msg.includes("tokyo") || msg.includes("tokio") && msg.includes("osaka")) {
    response = routes["tokyo-osaka"][currentLanguage];
  } else if (msg.includes("osaka") && msg.includes("fuji")) {
    response = routes["osaka-fuji"][currentLanguage];
  } else if (msg.includes("fuji") && msg.includes("nagano")) {
    response = routes["fuji-nagano"][currentLanguage];
  } else if (msg.includes("tokyo") && msg.includes("nagano")) {
    response = routes["tokyo-nagano"][currentLanguage];
  } else if (msg.includes("child") || msg.includes("niño") || msg.includes("子供")) {
    response = fares.children[currentLanguage];
  } else if (msg.includes("donate") || msg.includes("apoyar")) {
    response = "💖 You can support ShinkaBot via PayPal or Ko-fi. Links below! 💖";
  } else if (currentLanguage === 'en') {
    response = `You asked in English: "${message}". I'm still learning, but happy to help!Please try a different question about the Shinkansen.`;
  } else if (currentLanguage === 'es') {
    response = `Has preguntado en Español: "${message}". ¡Todavía estoy aprendiendo, pero feliz de ayudarte!Prueba con otra pregunta sobre el Shinkansen.`;
  } else if (currentLanguage === 'jp') {
    response = `日本語で質問しましたね：「${message}」。まだ勉強中ですが、助けたいです！新幹線に関する別の質問を試してください。`;
  } else {
      response = {
        en: "❓ I’m still learning! Please try a different question about the Shinkansen.",
        es: "❓ ¡Todavía estoy aprendiendo! Prueba con otra pregunta sobre el Shinkansen.",
        jp: "❓ まだ勉強中です！新幹線に関する別の質問を試してください。"
      }[currentLanguage];
    }


  addMessage(response, 'bot');
}

function initMap(lat = 35.6812, lng = 139.7671) {
  const center = { lat, lng };
  const map = new google.maps.Map(document.getElementById('map'), {
    zoom: 10,
    center
  });
  return map;
}

function findStation() {
    const input = document.getElementById("cityInput").value.trim().toLowerCase();
    const station = stationData[input];
    const response = document.getElementById("response");
    document.getElementById("suggestions").style.display = "none";

    if (station) {
      const coords = { lat: station.lat, lng: station.lon };
      map.setCenter(coords);
      new google.maps.Marker({ position: coords, map });
      
      response.textContent = translations[currentLanguage].result + station[currentLanguage];
    } else {
      response.textContent = translations[currentLanguage].notFound;
    }
  }

function showSuggestions() {
    const input = document.getElementById("cityInput").value.toLowerCase();
    const suggestions = document.getElementById("suggestions");
    suggestions.innerHTML = '';

    if (!input) {
      suggestions.style.display = "none";
      return;
    }

    const matches = cityList.filter(city => city.includes(input));
    if (matches.length === 0) {
      suggestions.style.display = "none";
      return;
    }

    matches.forEach(city => {
      const li = document.createElement('li');
      li.textContent = city;
      li.style.padding = '5px';
      li.style.cursor = 'pointer';
      li.onclick = () => {
        document.getElementById("cityInput").value = city;
        suggestions.style.display = "none";
      };
      suggestions.appendChild(li);
    });

    suggestions.style.display = "block";
  }


function findNearestByGeo() {
  if (!navigator.geolocation) {
    alert('Geolocation no está disponible en tu navegador');
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    const { latitude, longitude } = pos.coords;
    // Aquí llamas a tu lógica para buscar la estación más cercana
    // Por simplicidad, compara con un array de coordenadas en stations.json
    const nearest = calcularMasCercana(latitude, longitude);
    mostrarResultado(nearest);
  }, err => {
    alert('No se pudo obtener tu ubicación: ' + err.message);
  });
}





// Luego, cuando se determina la estación más cercana:
function mostrarResultado(est) {
  const coords = { lat: est.lat, lng: est.lon };
  map.setCenter(coords);
  new google.maps.Marker({ position: coords, map });
  // y muestra el texto en tu div #response...
}
