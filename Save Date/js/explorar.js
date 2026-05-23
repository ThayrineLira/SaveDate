/* =========================================================
   DADOS DE LUGARES
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
  },
];

/* =========================================================
   VARIÁVEIS GLOBAIS
========================================================= */

let filtroAtivo = "Todos";
let chipAtivo = "Todos";
let orcamentoBuscado = 200;
let termoBusca = "";

/* =========================================================
   SELECIONAR CHIP (TIPO DE ENCONTRO)
========================================================= */

function selectChip(element) {
  // Remove active de todos
  document.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.remove("active");
  });

  // Adiciona active no clicado
  element.classList.add("active");

  // Salva qual chip foi selecionado
  chipAtivo = element.textContent.split(" ").slice(1).join(" ");

  // Refiltra os cards
  filtrarCards();
}

/* =========================================================
   SELECIONAR CATEGORIA
========================================================= */

function selectCat(element, categoria) {
  // Remove active de todos
  document.querySelectorAll(".cat").forEach((cat) => {
    cat.classList.remove("active");
  });

  // Adiciona active no clicado
  element.classList.add("active");

  // Salva qual categoria foi selecionada
  filtroAtivo = categoria;

  // Refiltra os cards
  filtrarCards();
}

/* =========================================================
   ATUALIZAR ORÇAMENTO
========================================================= */

function updateBudget(value) {
  const labels = ["R$10", "R$50", "R$100", "R$200+"];
  const budgetVal = document.getElementById("budget-val");

  orcamentoBuscado = parseInt(value);

  if (value == 10) {
    budgetVal.textContent = "R$10";
  } else if (value == 50) {
    budgetVal.textContent = "R$50";
  } else if (value == 100) {
    budgetVal.textContent = "R$100";
  } else {
    budgetVal.textContent = "R$200+";
  }

  // Também ajusta o background do slider
  const range = document.getElementById("budget-range");
  const pct = (value / 200) * 100;
  range.style.setProperty("--pct", pct + "%");

  filtrarCards();
}

/* =========================================================
   FILTRAR CARDS
========================================================= */

function filtrarCards() {
  // Filtra os dados baseado no que foi selecionado
  let resultados = lugaresData;

  // Filtro por categoria
  if (filtroAtivo !== "Todos") {
    resultados = resultados.filter((lugar) => lugar.categoria === filtroAtivo);
  }

  // Filtro por chip (tipo de encontro)
  if (chipAtivo !== "Todos") {
    resultados = resultados.filter((lugar) =>
      lugar.tags.includes(chipAtivo)
    );
  }

  // Filtro por orçamento
  resultados = resultados.filter(
    (lugar) => lugar.preco === 0 || lugar.preco <= orcamentoBuscado
  );

  // Filtro por busca de texto
  if (termoBusca) {
    resultados = resultados.filter(
      (lugar) =>
        lugar.nome.toLowerCase().includes(termoBusca.toLowerCase()) ||
        lugar.localizacao.toLowerCase().includes(termoBusca.toLowerCase())
    );
  }

  // Atualiza o contador
  document.getElementById("count").textContent = resultados.length;

  // Renderiza os cards
  renderCards(resultados);
}

/* =========================================================
   RENDERIZAR CARDS
========================================================= */

function renderCards(lugares) {
  const grid = document.getElementById("cards-grid");
  grid.innerHTML = "";

  if (lugares.length === 0) {
    grid.innerHTML = `
      <div class="empty" style="grid-column: 1/-1;">
        <i class="ti ti-search"></i>
        <p>Nenhum lugar encontrado</p>
      </div>
    `;
    return;
  }

  // Carrega salvos uma vez
  const salvos = JSON.parse(localStorage.getItem("lugareSalvos") || "[]");

  lugares.forEach((lugar) => {
    const precotexto =
      lugar.preco === 0 ? "Grátis" : `R$${lugar.preco}`;

    const isSaved = salvos.includes(lugar.id);
    const heartClass = isSaved ? "saved" : "";
    const heartText = isSaved ? "♥" : "♡";

    const card = document.createElement("a");
    card.href = `detalhes.html?id=${lugar.id}`;
    card.className = "card";
    card.innerHTML = `
      <div class="card-img">
        <span style="font-size: 60px;">${lugar.emoji}</span>
        <div class="card-badge">${lugar.categoria}</div>
        <div class="card-price">${precotexto}</div>
        <button class="card-heart ${heartClass}" onclick="toggleSalvo(event, ${lugar.id})">${heartText}</button>
      </div>
      <div class="card-body">
        <div class="card-name">${lugar.nome}</div>
        <div class="card-row">
          <div class="card-loc">
            <i class="ti ti-map-pin"></i> ${lugar.localizacao}
          </div>
          <div class="card-rating">
            ⭐ ${lugar.avaliacoes.toFixed(1)}
          </div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

/* =========================================================
   SALVAR/REMOVER DOS FAVORITOS
========================================================= */

function toggleSalvo(event, id) {
  event.stopPropagation();

  const btn = event.target;
  const salvos = JSON.parse(localStorage.getItem("lugareSalvos") || "[]");

  if (salvos.includes(id)) {
    // Remove se já está salvo
    const index = salvos.indexOf(id);
    salvos.splice(index, 1);
    btn.classList.remove("saved");
    btn.textContent = "♡";
  } else {
    // Adiciona se não está salvo
    salvos.push(id);
    btn.classList.add("saved");
    btn.textContent = "♥";
  }

  localStorage.setItem("lugareSalvos", JSON.stringify(salvos));
}

/* =========================================================
   BUSCAR LUGARES POR TEXTO
========================================================= */

function buscarLugar() {
  const input = document.getElementById("search-input");
  termoBusca = input.value;
  filtrarCards();
}

/* =========================================================
   INICIAR PÁGINA
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  // Inicializa com todos os lugares
  filtrarCards();

  // Evento de busca em tempo real
  const searchInput = document.getElementById("search-input");
  if (searchInput) {
    searchInput.addEventListener("input", buscarLugar);
  }

  // Setup inicial do orçamento
  updateBudget(200);
});

/* =========================================================
   NAVEGAÇÃO - CORREÇÃO PARA LINKS
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  // Corrige os links de navegação
  const navLinks = document.querySelectorAll(".nav-link");
  navLinks.forEach((link) => {
    const a = link.querySelector("a");
    if (a) {
      a.addEventListener("click", function (e) {
        e.stopPropagation();
      });
    }
  });
});
