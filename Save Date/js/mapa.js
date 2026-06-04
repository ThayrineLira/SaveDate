const lugaresMapa = [
  {
    id: 1,
    nome: "Garota de Ipanema",
    categoria: "restaurantes",
    tipo: "Restaurante",
    emoji: "🍽️",
    nota: 4.8,
    endereco: "Ipanema, Rio de Janeiro",
    lat: -22.9839,
    lon: -43.2052
  },
  {
    id: 2,
    nome: "Bar Lagoa",
    categoria: "bares",
    tipo: "Bar",
    emoji: "🍺",
    nota: 4.6,
    endereco: "Lagoa, Rio de Janeiro",
    lat: -22.9716,
    lon: -43.2052
  },
  {
    id: 6,
    nome: "NorteShopping",
    categoria: "shopping",
    tipo: "Shopping",
    emoji: "🛍️",
    nota: 4.4,
    endereco: "Cachambi, Rio de Janeiro",
    lat: -22.8869,
    lon: -43.2769
  },
  {
    id: 7,
    nome: "Quinta da Boa Vista",
    categoria: "parques",
    tipo: "Parque",
    emoji: "🌳",
    nota: 4.6,
    endereco: "São Cristóvão, Rio de Janeiro",
    lat: -22.9050,
    lon: -43.2227
  },
  {
    id: 9,
    nome: "Jobi",
    categoria: "bares",
    tipo: "Bar",
    emoji: "🍻",
    nota: 4.5,
    endereco: "Leblon, Rio de Janeiro",
    lat: -22.9840,
    lon: -43.2218
  },
  {
    id: 16,
    nome: "Casa de Festas Lapa",
    categoria: "festas",
    tipo: "Salão de festas",
    emoji: "🎉",
    nota: 4.4,
    endereco: "Lapa, Rio de Janeiro",
    lat: -22.9118,
    lon: -43.1796
  }
];

let mapa;
let grupoMarcadores;
let categoriaAtiva = "todos";
let marcadorSelecionado = null;

function criarMapa() {
  if (typeof L === "undefined") {
    document.getElementById("lista-lugares").innerHTML = `
      <div class="estado-vazio">
        <div class="icone">⚠️</div>
        Não foi possível carregar o mapa. Verifique sua conexão.
      </div>
    `;
    return;
  }

  mapa = L.map("mapa", {
    zoomControl: true
  }).setView([-22.9711, -43.1822], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap"
  }).addTo(mapa);

  grupoMarcadores = L.layerGroup().addTo(mapa);
  renderizarMapa();
}

function filtrarLugares() {
  const termo = document.getElementById("input-local")?.value.trim().toLowerCase() || "";

  return lugaresMapa.filter((lugar) => {
    const combinaCategoria = categoriaAtiva === "todos" || lugar.categoria === categoriaAtiva;
    const texto = `${lugar.nome} ${lugar.tipo} ${lugar.endereco}`.toLowerCase();
    return combinaCategoria && (!termo || texto.includes(termo));
  });
}

function popupLugar(lugar) {
  const link = lugar.id ? `detalhes.html?id=${lugar.id}` : "sugestoes.html";
  return `
    <div class="popup-save">
      <strong>${lugar.emoji} ${lugar.nome}</strong>
      <p>${lugar.tipo} · ${lugar.endereco}</p>
      <p>⭐ ${lugar.nota.toFixed(1)}</p>
      <a href="${link}" onclick="if (!estaLogado()) { event.preventDefault(); protegerFuncionalidade(); }">Ver detalhes</a>
    </div>
  `;
}

function renderizarMapa() {
  if (!mapa || typeof L === "undefined") {
    return;
  }

  const lugares = filtrarLugares();
  const lista = document.getElementById("lista-lugares");
  const painelSub = document.getElementById("painel-sub");

  lista.innerHTML = "";
  grupoMarcadores?.clearLayers();

  if (painelSub) {
    painelSub.textContent = `${lugares.length} lugar(es) encontrado(s)`;
  }

  if (!lugares.length) {
    lista.innerHTML = `
      <div class="estado-vazio">
        <div class="icone">🔎</div>
        Nenhum lugar encontrado para esse filtro.
      </div>
    `;
    return;
  }

  const bounds = [];

  lugares.forEach((lugar) => {
    const marcador = L.marker([lugar.lat, lugar.lon]).bindPopup(popupLugar(lugar));
    marcador.addTo(grupoMarcadores);
    bounds.push([lugar.lat, lugar.lon]);

    const botao = document.createElement("button");
    botao.type = "button";
    botao.className = "card-lugar";
    botao.innerHTML = `
      <span class="card-lugar-icone">${lugar.emoji}</span>
      <span class="card-lugar-info">
        <span class="card-lugar-nome">${lugar.nome}</span>
        <span class="card-lugar-tipo">${lugar.tipo}</span>
        <span class="card-lugar-nota">⭐ ${lugar.nota.toFixed(1)}</span>
        <span class="card-lugar-dist">${lugar.endereco}</span>
      </span>
    `;

    botao.addEventListener("click", () => {
      // Verificar se está logado
      if (!estaLogado()) {
        protegerFuncionalidade();
        return;
      }
      
      document.querySelectorAll(".card-lugar").forEach((card) => card.classList.remove("selecionado"));
      botao.classList.add("selecionado");
      marcadorSelecionado = marcador;
      mapa.setView([lugar.lat, lugar.lon], 15);
      marcador.openPopup();
    });

    lista.appendChild(botao);
  });

  if (bounds.length > 1) {
    mapa.fitBounds(bounds, { padding: [42, 42] });
  } else if (bounds.length === 1) {
    mapa.setView(bounds[0], 14);
  }
}

function buscarNoMapa() {
  renderizarMapa();
}

function configurarCategorias() {
  document.querySelectorAll(".cat-btn").forEach((botao) => {
    botao.addEventListener("click", () => {
      document.querySelectorAll(".cat-btn").forEach((item) => item.classList.remove("ativo"));
      botao.classList.add("ativo");
      categoriaAtiva = botao.dataset.categoria || "todos";
      renderizarMapa();
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  criarMapa();
  configurarCategorias();

  document.getElementById("input-local")?.addEventListener("keydown", (event) => {
    if (event.key === "Enter") {
      buscarNoMapa();
    }
  });
});
