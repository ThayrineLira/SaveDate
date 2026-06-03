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

  const badgeEl = document.getElementById("badge-aberto-detalhe");
  if (badgeEl && typeof badgeAbertoHTML === "function") {
    badgeEl.innerHTML = badgeAbertoHTML(lugar.horario);
  }

  renderizarFotos(lugar);
  verificarFavorito(lugar.id);

  configurarEstrelas();
  renderResumoAvaliacoes(lugar);
  renderAvaliacoesUsuario(lugar.id);
}

/* =========================================================
   AVALIAÇÕES DE USUÁRIO (guardadas no navegador via dados.js)
========================================================= */
let notaSelecionadaAval = 0;

function escaparHtml(txt) {
  return String(txt == null ? "" : txt)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatarDataAval(iso) {
  try {
    return new Date(iso).toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "short",
      year: "numeric"
    });
  } catch (e) {
    return "";
  }
}

function estrelasTexto(nota) {
  const n = Math.max(0, Math.min(5, Math.round(Number(nota) || 0)));
  return "★★★★★".slice(0, n) + "☆☆☆☆☆".slice(0, 5 - n);
}

function configurarEstrelas() {
  const grupo = document.getElementById("aval-estrelas");
  if (!grupo) return;
  const estrelas = Array.from(grupo.querySelectorAll(".estrela"));
  const pintar = (n) => estrelas.forEach((e, i) => e.classList.toggle("ativa", i < n));

  estrelas.forEach((e) => {
    e.addEventListener("mouseenter", () => pintar(Number(e.dataset.valor)));
    e.addEventListener("click", () => {
      notaSelecionadaAval = Number(e.dataset.valor);
      pintar(notaSelecionadaAval);
    });
  });
  grupo.addEventListener("mouseleave", () => pintar(notaSelecionadaAval));
}

function renderResumoAvaliacoes(lugar) {
  const el = document.getElementById("aval-resumo");
  if (!el) return;
  const resumo = mediaAvaliacaoUsuario(lugar.id);

  if (!resumo) {
    el.innerHTML = `
      <div class="aval-resumo-box">
        <strong>Nota do guia: ⭐ ${lugar.avaliacoes.toFixed(1)}</strong>
        <span>Seja o primeiro a avaliar este lugar!</span>
      </div>`;
    return;
  }

  el.innerHTML = `
    <div class="aval-resumo-box">
      <strong>⭐ ${resumo.media.toFixed(1)} <span class="aval-stars-mini">${estrelasTexto(resumo.media)}</span></strong>
      <span>${resumo.total} avaliação(ões) de usuários · nota do guia ${lugar.avaliacoes.toFixed(1)}</span>
    </div>`;
}

function renderAvaliacoesUsuario(id) {
  const lista = document.getElementById("avaliacoes-list");
  if (!lista) return;
  const itens = getAvaliacoesUsuario(id);

  if (!itens.length) {
    lista.innerHTML =
      '<p class="aval-vazio">Ainda não há avaliações de usuários. Que tal deixar a sua?</p>';
    return;
  }

  lista.innerHTML = itens
    .map(
      (a) => `
      <div class="avaliacao-item">
        <div class="avaliacao-header">
          <strong>${escaparHtml(a.autor)}</strong>
          <span class="stars">${estrelasTexto(a.nota)}</span>
        </div>
        ${a.comentario ? `<p class="avaliacao-texto">${escaparHtml(a.comentario)}</p>` : ""}
        <small class="avaliacao-data">${formatarDataAval(a.data)}</small>
      </div>`
    )
    .join("");
}

function enviarAvaliacao(event) {
  event.preventDefault();
  const id = obterIdDaUrl();

  if (!notaSelecionadaAval) {
    alert("Escolha de 1 a 5 estrelas para avaliar.");
    return;
  }

  const texto = document.getElementById("aval-texto").value;
  const autor = document.getElementById("aval-autor").value;
  addAvaliacaoUsuario(id, notaSelecionadaAval, texto, autor);

  notaSelecionadaAval = 0;
  document.getElementById("aval-texto").value = "";
  document.getElementById("aval-autor").value = "";
  document
    .querySelectorAll("#aval-estrelas .estrela")
    .forEach((e) => e.classList.remove("ativa"));

  const lugar = lugaresData.find((l) => l.id === id);
  if (lugar) renderResumoAvaliacoes(lugar);
  renderAvaliacoesUsuario(id);
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
