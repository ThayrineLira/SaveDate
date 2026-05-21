/* =========================================================
   DADOS DE LUGARES (DUPLICADO PARA REFERÊNCIA)
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
   RENDERIZAR CARDS SALVOS
========================================================= */

function renderCardsSalvos(lugares) {
  const grid = document.getElementById("cards-grid");
  grid.innerHTML = "";

  if (lugares.length === 0) {
    grid.innerHTML = `
      <div class="empty" style="grid-column: 1/-1;">
        <i class="ti ti-heart"></i>
        <p>Você ainda não salvou nenhum lugar</p>
        <p style="font-size: 12px; color: #888; margin-top: 8px;">
          Vá para <a href="explorar.html" style="color: #ff6b35; text-decoration: underline;">Explorar</a> e adicione seus favoritos
        </p>
      </div>
    `;
    return;
  }

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

  // Recarrega a página para atualizar a contagem
  renderSalvos();
}

/* =========================================================
   RENDERIZAR SALVOS
========================================================= */

function renderSalvos() {
  const salvos = JSON.parse(localStorage.getItem("lugareSalvos") || "[]");
  const lugaresCardsSalvos = lugaresData.filter((lugar) =>
    salvos.includes(lugar.id)
  );

  // Atualiza o contador
  document.getElementById("count").textContent = lugaresCardsSalvos.length;

  // Renderiza os cards
  renderCardsSalvos(lugaresCardsSalvos);
}

/* =========================================================
   INICIAR PÁGINA
========================================================= */

document.addEventListener("DOMContentLoaded", function () {
  // Carrega e mostra os lugares salvos
  renderSalvos();
});
