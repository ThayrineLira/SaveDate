/* Os dados dos lugares vêm de js/dados.js (lugaresData global). */

let filtroAtivo = "Todos";
let chipAtivo = "Todos";
let orcamentoBuscado = 200;
let termoBusca = "";

function obterImagemLugar(lugar) {
  return typeof lugar.imagem === "string" && lugar.imagem.trim()
    ? lugar.imagem.trim()
    : "";
}

function renderMidiaCard(lugar) {
  const imagem = obterImagemLugar(lugar);
  const alt = `Foto de ${lugar.nome}`;

  if (imagem) {
    return `
      <img class="card-photo" src="${imagem}" alt="${alt}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />
      <div class="card-fallback card-fallback-backup" aria-label="${alt}">
        <span class="card-emoji" aria-hidden="true">${lugar.emoji}</span>
        <span class="card-fallback-text">Imagem em breve</span>
      </div>
      <span class="card-emoji card-emoji-overlay" aria-hidden="true">${lugar.emoji}</span>
    `;
  }

  return `
    <div class="card-fallback" aria-label="${alt}">
      <span class="card-emoji" aria-hidden="true">${lugar.emoji}</span>
      <span class="card-fallback-text">Imagem em breve</span>
    </div>
  `;
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

function selectChip(element) {
  document.querySelectorAll(".chip").forEach((chip) => chip.classList.remove("active"));
  element.classList.add("active");
  chipAtivo = element.dataset.chip || element.textContent.trim().replace(/^[^\wÀ-ÿ]+/, "").trim();
  filtrarCards();
}

function selectCat(element, categoria) {
  document.querySelectorAll(".cat").forEach((cat) => cat.classList.remove("active"));
  element.classList.add("active");
  filtroAtivo = categoria;
  filtrarCards();
}

function updateBudget(value) {
  const budgetVal = document.getElementById("budget-val");
  const valor = parseInt(value, 10);

  orcamentoBuscado = Number.isNaN(valor) ? 200 : valor;
  budgetVal.textContent = orcamentoBuscado >= 200 ? "R$200+" : `R$${orcamentoBuscado}`;

  const range = document.getElementById("budget-range");
  const pct = (orcamentoBuscado / 200) * 100;
  range?.style.setProperty("--pct", `${pct}%`);

  filtrarCards();
}

function filtrarCards() {
  let resultados = [...lugaresData];

  if (filtroAtivo !== "Todos") {
    resultados = resultados.filter((lugar) => lugar.categoria === filtroAtivo);
  }

  if (chipAtivo !== "Todos") {
    resultados = resultados.filter((lugar) => lugar.tags.includes(chipAtivo));
  }

  resultados = resultados.filter((lugar) => lugar.preco === 0 || lugar.preco <= orcamentoBuscado);

  if (termoBusca) {
    const termo = termoBusca.toLowerCase();
    resultados = resultados.filter((lugar) => {
      return (
        lugar.nome.toLowerCase().includes(termo) ||
        lugar.localizacao.toLowerCase().includes(termo) ||
        lugar.categoria.toLowerCase().includes(termo)
      );
    });
  }

  document.getElementById("count").textContent = resultados.length;
  renderCards(resultados);
}

function renderCards(lugares) {
  const grid = document.getElementById("cards-grid");
  grid.innerHTML = "";

  if (!lugares.length) {
    grid.innerHTML = `
      <div class="empty">
        <i class="ti ti-search"></i>
        <p>Nenhum lugar encontrado</p>
      </div>
    `;
    return;
  }

  const salvos = obterSalvos();

  lugares.forEach((lugar) => {
    const precoTexto = lugar.preco === 0 ? "Grátis" : `R$${lugar.preco}`;
    const isSaved = salvos.includes(lugar.id);
    const heartClass = isSaved ? "saved" : "";
    const heartText = isSaved ? "♥" : "♡";
    const card = document.createElement("a");

    card.href = `detalhes.html?id=${lugar.id}`;
    card.className = "card";
    card.innerHTML = `
      <div class="card-img">
        ${renderMidiaCard(lugar)}
        <div class="card-badge">${lugar.categoria}</div>
        <div class="card-price">${precoTexto}</div>
        <button class="card-heart ${heartClass}" type="button" onclick="toggleSalvo(event, ${lugar.id})">${heartText}</button>
      </div>
      <div class="card-body">
        <div class="card-name">${lugar.nome}</div>
        <div class="card-row">
          <div class="card-loc">
            <i class="ti ti-map-pin"></i> ${lugar.localizacao}
          </div>
          <div class="card-rating">⭐ ${lugar.avaliacoes.toFixed(1)}</div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function toggleSalvo(event, id) {
  event.preventDefault();
  event.stopPropagation();

  const btn = event.currentTarget;
  const salvos = obterSalvos();

  if (salvos.includes(id)) {
    salvos.splice(salvos.indexOf(id), 1);
    btn.classList.remove("saved");
    btn.textContent = "♡";
  } else {
    if (typeof podeAdicionarSalvo === "function" && !podeAdicionarSalvo(salvos.length)) {
      premiumAvisoLimite();
      return;
    }
    salvos.push(id);
    btn.classList.add("saved");
    btn.textContent = "♥";
  }

  salvarSalvos(salvos);
}

function buscarLugar() {
  termoBusca = document.getElementById("search-input").value.trim();
  filtrarCards();
}

function aplicarCategoriaDaUrl() {
  const params = new URLSearchParams(window.location.search);
  const categoria = params.get("categoria");

  if (!categoria) return;

  const alvo = Array.from(document.querySelectorAll(".cat")).find((cat) => {
    return cat.textContent.toLowerCase().includes(categoria.toLowerCase());
  });

  if (alvo) {
    const label = alvo.querySelector(".cat-label")?.textContent.trim() || "Todos";
    selectCat(alvo, label);
  }
}

document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("search-input")?.addEventListener("input", buscarLugar);
  updateBudget(200);
  aplicarCategoriaDaUrl();
  filtrarCards();
});
