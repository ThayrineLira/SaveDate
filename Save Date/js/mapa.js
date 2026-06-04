
2const lugaresMapa = [
  {
    id: 1,
    nome: "Família Mancini",
    categoria: "restaurantes",
    tipo: "Restaurante",
    emoji: "🍽️",
    nota: 4.8,
    endereco: "Zona Sul, São Paulo",
    lat: -23.5596,
    lon: -46.6562
  },
  {
    id: 2,
    nome: "O Bar do Seu Zé",
    categoria: "bares",
    tipo: "Bar",
    emoji: "🍺",
    nota: 4.6,
    endereco: "Vila Mariana, São Paulo",
    lat: -23.5897,
    lon: -46.6346
  },
  {
    id: 6,
    nome: "Shopping Center VillaGe",
    categoria: "shopping",
    tipo: "Shopping",
    emoji: "🛍️",
    nota: 4.4,
    endereco: "Zona Norte, São Paulo",
    lat: -23.5039,
    lon: -46.6247
  },
  {
    id: 7,
    nome: "Parque da Independência",
    categoria: "parques",
    tipo: "Parque",
    emoji: "🌳",
    nota: 4.6,
    endereco: "Ipiranga, São Paulo",
    lat: -23.5856,
    lon: -46.6096
  },
  {
    id: 9,
    nome: "Beer & Vibes",
    categoria: "bares",
    tipo: "Bar",
    emoji: "🍻",
    nota: 4.5,
    endereco: "Bom Retiro, São Paulo",
    lat: -23.5255,
    lon: -46.6395
  },
  {
    id: null,
    nome: "Casa de Eventos Aurora",
    categoria: "festas",
    tipo: "Salão de festas",
    emoji: "🎉",
    nota: 4.7,
    endereco: "Pinheiros, São Paulo",
    lat: -23.5666,
    lon: -46.6864
  },
  {
    id: 10,
    nome: "Restaurante Rio Sabor",
    categoria: "restaurantes",
    tipo: "Restaurante",
    emoji: "🍽️",
    nota: 4.7,
    endereco: "Zona Sul, Rio de Janeiro",
    lat: -22.9656,
    lon: -43.1822
  },
  {
    id: 11,
    nome: "Bar Recife em Boa",
    categoria: "bares",
    tipo: "Bar",
    emoji: "🍺",
    nota: 4.6,
    endereco: "Boa Viagem, Recife",
    lat: -8.1120,
    lon: -34.8960
  },
  {
    id: 12,
    nome: "Parque das Laranjeiras",
    categoria: "parques",
    tipo: "Parque",
    emoji: "🌳",
    nota: 4.5,
    endereco: "Centro, Salvador",
    lat: -12.9777,
    lon: -38.5016
  },
  {
    id: 13,
    nome: "Shopping da Bahia",
    categoria: "shopping",
    tipo: "Shopping",
    emoji: "🛍️",
    nota: 4.4,
    endereco: "Salvador Shopping",
    lat: -12.9292,
    lon: -38.4369
  },
  {
    id: 14,
    nome: "Café Centro Histórico",
    categoria: "restaurantes",
    tipo: "Café",
    emoji: "☕",
    nota: 4.8,
    endereco: "Centro Histórico, Fortaleza",
    lat: -3.7305,
    lon: -38.5266
  },
  {
    id: 15,
    nome: "Pizzaria Belém & Alegria",
    categoria: "restaurantes",
    tipo: "Pizzaria",
    emoji: "🍕",
    nota: 4.6,
    endereco: "Belém, PA",
    lat: -1.4558,
    lon: -48.4902
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
  }).setView([-23.5505, -46.6333], 12);

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
      <a href="${link}">Ver detalhes</a>
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
