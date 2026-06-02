/* Os dados dos lugares vêm de js/dados.js (lugaresData global). */

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

function obterImagemLugar(lugar) {
  return typeof lugar.imagem === "string" && lugar.imagem.trim()
    ? lugar.imagem.trim()
    : "";
}

function atualizarBanner(lugar) {
  const banner = document.querySelector(".banner");
  const emoji = document.getElementById("banner-emoji");
  const imagem = obterImagemLugar(lugar);

  if (emoji) {
    emoji.textContent = lugar.emoji;
  }

  if (!banner) {
    return;
  }

  if (imagem) {
    banner.classList.add("banner-com-foto");
    banner.style.backgroundImage = `linear-gradient(180deg, rgba(0,0,0,0.08), rgba(0,0,0,0.45)), url("${imagem}")`;
  } else {
    banner.classList.remove("banner-com-foto");
    banner.style.backgroundImage = "";
  }
}

function renderizarFotos(lugar) {
  const grid = document.getElementById("fotos-grid");
  const imagem = obterImagemLugar(lugar);

  if (!grid) {
    return;
  }

  if (!imagem) {
    grid.innerHTML = `
      <div class="foto-placeholder">
        <span>${lugar.emoji}</span>
        <strong>Fotos em breve</strong>
        <small>Este lugar ainda não possui galeria cadastrada.</small>
      </div>
    `;
    return;
  }

  grid.innerHTML = `
    <img class="foto-real foto-principal" src="${imagem}" alt="Foto de ${lugar.nome}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.classList.add('foto-placeholder-expandida');" />
    <div class="foto-placeholder foto-mini">
      <span>${lugar.emoji}</span>
      <strong>Mais fotos em breve</strong>
    </div>
  `;
}

function carregarDetalhes() {
  const id = obterIdDaUrl();
  const lugar = lugaresData.find((item) => item.id === id);

  if (!lugar) {
    document.body.innerHTML =
      '<div style="text-align:center; padding:40px;"><h2>Lugar não encontrado</h2><a href="explorar.html">Voltar</a></div>';
    return;
  }

  atualizarBanner(lugar);
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

  renderizarFotos(lugar);
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
    if (typeof podeAdicionarSalvo === "function" && !podeAdicionarSalvo(salvos.length)) {
      premiumAvisoLimite();
      return;
    }
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
