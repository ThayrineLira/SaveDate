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
    diferenciais: ["Massas artesanais", "Ambiente acolhedor", "Ar condicionado", "Estacionamento", "Vinhos importados"]
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
    descricao: "Bar tradicional com cervejas artesanais, drinks clássicos e uma vibe descontraída.",
    endereco: "Avenida Paulista, 456 - São Paulo, SP",
    telefone: "(11) 2222-2222",
    horario: "17h - 02h",
    diferenciais: ["Cervejas artesanais", "Happy hour diário", "Música ao vivo", "Petiscos"]
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
    descricao: "Hamburgueria com carnes selecionadas, pães caseiros e combinações criativas.",
    endereco: "Rua dos Pinheiros, 789 - São Paulo, SP",
    telefone: "(11) 4444-4444",
    horario: "11h - 22h",
    diferenciais: ["Carnes selecionadas", "Pães caseiros", "Batatas artesanais", "Atendimento rápido"]
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
    descricao: "Pizzaria tradicional com forno a lenha, ingredientes frescos e clima informal.",
    endereco: "Rua da Mooca, 321 - São Paulo, SP",
    telefone: "(11) 5555-5555",
    horario: "12h - 23h",
    diferenciais: ["Forno a lenha", "Ingredientes frescos", "Pizzas grandes", "Bom para grupos"]
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
    descricao: "Café aconchegante com bebidas artesanais, doces caseiros e espaço tranquilo.",
    endereco: "Rua Vila Madalena, 654 - São Paulo, SP",
    telefone: "(11) 6666-6666",
    horario: "07h - 19h",
    diferenciais: ["Café especial", "Doces caseiros", "Wi-Fi grátis", "Ambiente acolhedor"]
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
    descricao: "Shopping completo com lojas, restaurantes e entretenimento para toda a família.",
    endereco: "Rodovia Anhanguera, Km 25 - São Paulo, SP",
    telefone: "(11) 7777-7777",
    horario: "10h - 22h",
    diferenciais: ["Múltiplas lojas", "Praça de alimentação", "Cinema", "Estacionamento"]
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
    descricao: "Parque histórico com áreas verdes, caminhada e espaço para piquenique.",
    endereco: "Avenida Nazaré, 1000 - São Paulo, SP",
    telefone: "(11) 8888-8888",
    horario: "06h - 22h",
    diferenciais: ["Áreas verdes", "Piquenique", "Monumento histórico", "Caminhada"]
  },
  {
    id: 8,
    nome: "Sorveteria Gelato",
    categoria: "Sorveteria",
    emoji: "🍨",
    preco: 20,
    avaliacoes: 4.8,
    countAvaliacao: 567,
    localizacao: "Consolação",
    tags: ["Amigos", "Família", "Casal"],
    descricao: "Sorveteria artesanal com sabores variados e receitas italianas tradicionais.",
    endereco: "Avenida Consolação, 111 - São Paulo, SP",
    telefone: "(11) 9999-9999",
    horario: "12h - 22h",
    diferenciais: ["Gelato artesanal", "Sabores sazonais", "Opções leves", "Bom custo-benefício"]
  },
  {
    id: 9,
    nome: "Beer & Vibes",
    categoria: "Bar",
    emoji: "🍻",
    preco: 50,
    avaliacoes: 4.5,
    countAvaliacao: 289,
    localizacao: "Bom Retiro",
    tags: ["Amigos"],
    descricao: "Bar moderno com cervejas artesanais, música e ambiente descontraído.",
    endereco: "Rua Bom Retiro, 222 - São Paulo, SP",
    telefone: "(11) 1010-1010",
    horario: "17h - 03h",
    diferenciais: ["Cervejas artesanais", "DJ ao vivo", "Ambiente moderno", "Petiscos"]
  }
];

function obterIdDaUrl() {
  return parseInt(new URLSearchParams(window.location.search).get("id"), 10);
}

function obterSalvos() {
  try {
    return JSON.parse(localStorage.getItem("lugareSalvos") || "[]");
  } catch (erro) {
    return [];
  }
}

function salvarSalvos(salvos) {
  localStorage.setItem("lugareSalvos", JSON.stringify(salvos));
}

function carregarDetalhes() {
  const id = obterIdDaUrl();
  const lugar = lugaresData.find((item) => item.id === id);

  if (!lugar) {
    document.body.innerHTML =
      '<div style="text-align:center; padding:40px;"><h2>Lugar não encontrado</h2><a href="explorar.html">Voltar</a></div>';
    return;
  }

  document.getElementById("banner-emoji").textContent = lugar.emoji;
  document.title = `Save Date | ${lugar.nome}`;
  document.getElementById("nome-lugar").textContent = lugar.nome;
  document.getElementById("rating").textContent = `⭐ ${lugar.avaliacoes.toFixed(1)}`;
  document.getElementById("reviews").textContent = `(${lugar.countAvaliacao} avaliações)`;
  document.getElementById("price").textContent = lugar.preco === 0 ? "Grátis" : "$".repeat(Math.ceil(lugar.preco / 50));
  document.getElementById("descricao").textContent = lugar.descricao;
  document.getElementById("endereco").textContent = lugar.endereco;
  document.getElementById("telefone").textContent = lugar.telefone;
  document.getElementById("horario").textContent = lugar.horario;
  document.getElementById("media").textContent = lugar.preco === 0 ? "Grátis" : `R$${lugar.preco}`;
  document.getElementById("sobre-text").textContent = lugar.descricao;

  const tagsContainer = document.getElementById("tags-container");
  tagsContainer.innerHTML = "";

  [lugar.categoria, ...lugar.tags].forEach((tag, index) => {
    const tagElement = document.createElement("span");
    tagElement.className = index === 0 ? "tag highlight" : "tag";
    tagElement.textContent = tag;
    tagsContainer.appendChild(tagElement);
  });

  const diferenciaisList = document.getElementById("diferenciais-list");
  diferenciaisList.innerHTML = "";

  lugar.diferenciais.forEach((diff) => {
    const li = document.createElement("li");
    li.textContent = diff;
    diferenciaisList.appendChild(li);
  });

  verificarFavorito(lugar.id);
}

function verificarFavorito(id) {
  const salvos = obterSalvos();
  const favBtn = document.getElementById("fav-btn");
  favBtn.classList.toggle("active", salvos.includes(id));
}

function toggleFavorito() {
  const id = obterIdDaUrl();
  const salvos = obterSalvos();
  const index = salvos.indexOf(id);

  if (index >= 0) {
    salvos.splice(index, 1);
  } else {
    salvos.push(id);
  }

  salvarSalvos(salvos);
  verificarFavorito(id);
}

function mostrarTab(tabName, botao) {
  document.querySelectorAll(".tab-content").forEach((tab) => tab.classList.remove("active"));
  document.querySelectorAll(".tab").forEach((tab) => tab.classList.remove("active"));
  document.getElementById(`tab-${tabName}`).classList.add("active");
  botao?.classList.add("active");
}

function abrirMapa() {
  const lugar = lugaresData.find((item) => item.id === obterIdDaUrl());
  if (!lugar) return;
  window.open(`https://www.google.com/maps/search/${encodeURIComponent(lugar.endereco)}`, "_blank");
}

function ligar() {
  const lugar = lugaresData.find((item) => item.id === obterIdDaUrl());
  if (!lugar) return;
  window.location.href = `tel:${lugar.telefone.replace(/\D/g, "")}`;
}

document.addEventListener("DOMContentLoaded", carregarDetalhes);
