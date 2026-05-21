/* =========================================================
   DADOS DE LUGARES (MESMO QUE EM EXPLORAR.JS)
========================================================= */

const lugaresData = [
  {
    id: 1,
    nome: "Família Mancini",
    categoria: "Restaurante",
    emoji: "🍽️",
    preco: 95,
    avaliacoes: 4.8,
    countAvaliacao: 567,
    localizacao: "Zona sul, São Paulo",
    tags: ["Família", "Casal"],
    descricao: "Restaurante italiano clássico com massas artesanais e ambiente acolhedor para toda a família.",
    endereco: "Rua Exemplo, 123 - São Paulo, SP",
    telefone: "(11) 3333-3333",
    horario: "11h30 - 23h",
    diferenciais: ["Massas artesanais", "Ambiente acolhedor", "Ar condicionado", "Estacionamento", "Diversos vinhos importados"],
  },
  {
    id: 2,
    nome: "O Bar do Seu Zé",
    categoria: "Bar",
    emoji: "🍺",
    preco: 45,
    avaliacoes: 4.6,
    countAvaliacao: 324,
    localizacao: "Vila Mariana",
    tags: ["Amigos", "Casal"],
    descricao: "Bar tradicional com cervejas artesanais, drinks clássicos e uma vibe descontraída. Perfeito para encontros informais.",
    endereco: "Avenida Paulista, 456 - São Paulo, SP",
    telefone: "(11) 2222-2222",
    horario: "17h - 02h",
    diferenciais: ["Cervejas artesanais", "Happy hour diário", "Música ao vivo", "Petiscos"],
  },
  {
    id: 3,
    nome: "Gourmet Burguer",
    categoria: "Lanchonete",
    emoji: "🍔",
    preco: 35,
    avaliacoes: 4.5,
    countAvaliacao: 412,
    localizacao: "Pinheiros",
    tags: ["Amigos", "Família"],
    descricao: "Hambúrgueria gourmet com carnes selecionadas, pães caseiros e combinações criativas. Atendimento rápido e eficiente.",
    endereco: "Rua dos Pinheiros, 789 - São Paulo, SP",
    telefone: "(11) 4444-4444",
    horario: "11h - 22h",
    diferenciais: ["Carnes selecionadas", "Pães caseiros", "Batatas artesanais", "Atendimento rápido"],
  },
  {
    id: 4,
    nome: "Pizzaria do Bairro",
    categoria: "Pizzaria",
    emoji: "🍕",
    preco: 60,
    avaliacoes: 4.7,
    countAvaliacao: 598,
    localizacao: "Mooca",
    tags: ["Família", "Casal", "Amigos"],
    descricao: "Pizzaria tradicional com forno a lenha, ingredientes frescos e receitas que remetem à Itália. Experiência autêntica.",
    endereco: "Rua da Mooca, 321 - São Paulo, SP",
    telefone: "(11) 5555-5555",
    horario: "12h - 23h",
    diferenciais: ["Forno a lenha", "Ingredientes importados", "Pizzas gigantes", "Rodízio"],
  },
  {
    id: 5,
    nome: "Café Aconchego",
    categoria: "Café",
    emoji: "☕",
    preco: 25,
    avaliacoes: 4.9,
    countAvaliacao: 876,
    localizacao: "Vila Madalena",
    tags: ["Casal"],
    descricao: "Café aconchegante com bebidas artesanais, doces caseiros e espaço perfeito para trabalhar ou relaxar.",
    endereco: "Rua Vila Madalena, 654 - São Paulo, SP",
    telefone: "(11) 6666-6666",
    horario: "07h - 19h",
    diferenciais: ["Café especial", "Doces caseiros", "Wi-Fi grátis", "Ambiente aconchegante"],
  },
  {
    id: 6,
    nome: "Shopping Center VillaGe",
    categoria: "Shopping",
    emoji: "🛍️",
    preco: 0,
    avaliacoes: 4.4,
    countAvaliacao: 1200,
    localizacao: "Zona norte",
    tags: ["Família", "Amigos"],
    descricao: "Shopping completo com diversas lojas, restaurantes e entretenimento para toda a família.",
    endereco: "Rodovia Anhanguera, Km 25 - São Paulo, SP",
    telefone: "(11) 7777-7777",
    horario: "10h - 22h",
    diferenciais: ["Múltiplas lojas", "Food court", "Cinema", "Estacionamento gratuito"],
  },
  {
    id: 7,
    nome: "Parque da Independência",
    categoria: "Parque",
    emoji: "🌳",
    preco: 0,
    avaliacoes: 4.6,
    countAvaliacao: 445,
    localizacao: "Ipiranga",
    tags: ["Família", "Casal"],
    descricao: "Parque histórico com trilhas, lagos e muita natureza. Ideal para caminhadas, piqueniques e contato com a natureza.",
    endereco: "Avenida Nazaré, 1000 - São Paulo, SP",
    telefone: "(11) 8888-8888",
    horario: "06h - 22h",
    diferenciais: ["Trilhas naturais", "Lagos para observação", "Áreas de piquenique", "Monumento histórico"],
  },
  {
    id: 8,
    nome: "Sorveteria Gelato",
    categoria: "Sorveteria",
    emoji: "🧁",
    preco: 20,
    avaliacoes: 4.8,
    countAvaliacao: 567,
    localizacao: "Consolação",
    tags: ["Amigos", "Família", "Casal"],
    descricao: "Sorveteria artesanal com sabores únicos e receitas italianas tradicionais. Gelato cremoso e saboroso.",
    endereco: "Avenida Consolação, 111 - São Paulo, SP",
    telefone: "(11) 9999-9999",
    horario: "12h - 22h",
    diferenciais: ["Gelato artesanal", "Sabores sazonais", "Sorvetão italiano", "Açaí natural"],
  },
  {
    id: 9,
    nome: "Beer & Vibes",
    categoria: "Bar",
    emoji: "🍺",
    preco: 50,
    avaliacoes: 4.5,
    countAvaliacao: 289,
    localizacao: "Bom Retiro",
    tags: ["Amigos"],
    descricao: "Bar moderno com cervejas artesanais internacionais, ambiente descontraído e decoração moderna.",
    endereco: "Rua Bom Retiro, 222 - São Paulo, SP",
    telefone: "(11) 1010-1010",
    horario: "17h - 03h",
    diferenciais: ["Cervejas internacionais", "DJ ao vivo", "Ambiente moderno", "Food truck na porta"],
  },
];

/* =========================================================
   OBTER PARÂMETROS DA URL
========================================================= */

function obterIdDaUrl() {
  const params = new URLSearchParams(window.location.search);
  return parseInt(params.get("id"));
}

/* =========================================================
   CARREGAR DETALHES DO LUGAR
========================================================= */

function carregarDetalhes() {
  const id = obterIdDaUrl();
  const lugar = lugaresData.find((l) => l.id === id);

  if (!lugar) {
    document.body.innerHTML =
      '<div style="text-align:center; padding:40px;"><h2>Lugar não encontrado</h2><a href="explorar.html">Voltar</a></div>';
    return;
  }

  // Banner e emoji
  document.getElementById("banner-emoji").textContent = lugar.emoji;
  document.title = `Save Date – ${lugar.nome}`;

  // Título e rating
  document.getElementById("nome-lugar").textContent = lugar.nome;
  document.getElementById("rating").textContent = `⭐ ${lugar.avaliacoes.toFixed(1)}`;
  document.getElementById("reviews").textContent = `(${lugar.countAvaliacao} avaliações)`;
  document.getElementById("price").textContent =
    lugar.preco === 0 ? "Grátis" : "$".repeat(Math.ceil(lugar.preco / 50));

  // Descrição e info
  document.getElementById("descricao").textContent = lugar.descricao;
  document.getElementById("endereco").textContent = lugar.endereco;
  document.getElementById("telefone").textContent = lugar.telefone;
  document.getElementById("horario").textContent = lugar.horario;
  document.getElementById("media").textContent =
    lugar.preco === 0 ? "Grátis" : `R$${lugar.preco}`;

  // Tags
  const tagsContainer = document.getElementById("tags-container");
  tagsContainer.innerHTML = "";

  // Adiciona categoria como tag
  const tagCategoria = document.createElement("span");
  tagCategoria.className = "tag highlight";
  tagCategoria.textContent = lugar.categoria;
  tagsContainer.appendChild(tagCategoria);

  // Adiciona outras tags
  lugar.tags.forEach((tag) => {
    const tagElement = document.createElement("span");
    tagElement.className = "tag";
    tagElement.textContent = tag;
    tagsContainer.appendChild(tagElement);
  });

  // Sobre
  document.getElementById("sobre-text").textContent = lugar.descricao;

  // Diferenciais
  const diferenciaisList = document.getElementById("diferenciais-list");
  diferenciaisList.innerHTML = "";
  lugar.diferenciais.forEach((diff) => {
    const li = document.createElement("li");
    li.textContent = diff;
    diferenciaisList.appendChild(li);
  });

  // Verificar se está nos favoritos
  verificarFavorito(lugar.id);
}

/* =========================================================
   FAVORITOS
========================================================= */

function verificarFavorito(id) {
  const salvos = JSON.parse(localStorage.getItem("lugareSalvos") || "[]");
  const favBtn = document.getElementById("fav-btn");

  if (salvos.includes(id)) {
    favBtn.classList.add("active");
  } else {
    favBtn.classList.remove("active");
  }
}

function toggleFavorito() {
  const id = obterIdDaUrl();
  const salvos = JSON.parse(localStorage.getItem("lugareSalvos") || "[]");
  const favBtn = document.getElementById("fav-btn");

  if (salvos.includes(id)) {
    const index = salvos.indexOf(id);
    salvos.splice(index, 1);
    favBtn.classList.remove("active");
  } else {
    salvos.push(id);
    favBtn.classList.add("active");
  }

  localStorage.setItem("lugareSalvos", JSON.stringify(salvos));
}

/* =========================================================
   ABAS
========================================================= */

function mostrarTab(tabName) {
  // Remove active de todos os tabs
  document.querySelectorAll(".tab-content").forEach((tab) => {
    tab.classList.remove("active");
  });

  document.querySelectorAll(".tab").forEach((tab) => {
    tab.classList.remove("active");
  });

  // Ativa o tab clicado
  document.getElementById(`tab-${tabName}`).classList.add("active");
  event.target.classList.add("active");
}

/* =========================================================
   AÇÕES
========================================================= */

function abrirMapa() {
  const id = obterIdDaUrl();
  const lugar = lugaresData.find((l) => l.id === id);
  const mapsUrl = `https://www.google.com/maps/search/${encodeURIComponent(lugar.endereco)}`;
  window.open(mapsUrl, "_blank");
}

function ligar() {
  const id = obterIdDaUrl();
  const lugar = lugaresData.find((l) => l.id === id);
  window.location.href = `tel:${lugar.telefone.replace(/\D/g, "")}`;
}

/* =========================================================
   INICIAR
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  carregarDetalhes();
});
