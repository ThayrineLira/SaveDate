/* =========================================================
   CATEGORIA.JS — RENDERIZA AS PÁGINAS DE CATEGORIA
   Lê o slug de <body data-categoria="..."> e monta os cards
   a partir da fonte única (js/dados.js).
========================================================= */

function obterSlugCategoria() {
  return (document.body.dataset.categoria || "").toLowerCase().trim();
}

function precoTexto(lugar) {
  return lugar.preco === 0 ? "Grátis" : `R$ ${lugar.preco}`;
}

function montarCardCategoria(lugar) {
  const metas = [lugar.categoria, ...(lugar.tags || [])]
    .slice(0, 3)
    .map((tag) => `<span>${tag}</span>`)
    .join("");

  const emojiVisual = `<div class="card-emoji">${lugar.emoji || "📍"}</div>`;

  const patrocinado = (typeof ehPatrocinado === "function") && ehPatrocinado(lugar);
  const seloPatrocinado = patrocinado
    ? '<span class="selo-patrocinado">★ Patrocinado</span>'
    : "";
  const badgeAberto = typeof badgeAbertoHTML === "function" ? badgeAbertoHTML(lugar.horario) : "";

  const article = document.createElement("article");
  article.className = "card-categoria" + (patrocinado ? " patrocinado" : "");
  article.innerHTML = `
    ${seloPatrocinado}
    ${emojiVisual}
    <div class="card-corpo">
      <div class="card-topo">
        <h3>${lugar.nome}</h3>
        <span class="tag-preco">${precoTexto(lugar)}</span>
      </div>
      <p>${lugar.descricao || "Confira os detalhes e veja se combina com o seu rolê."}</p>
      ${badgeAberto ? `<div class="card-extra-cat">${badgeAberto}</div>` : ""}
      <div class="meta-card">${metas}</div>
      <div class="card-acoes">
        <a href="detalhes.html?id=${lugar.id}" class="card-link">Ver detalhes</a>
        <a href="mapa.html" class="card-link secundario">Mapa</a>
      </div>
    </div>
  `;

  // Usa a imagem quando existir; se falhar ao carregar, mantém o emoji.
  if (lugar.imagem) {
    const img = document.createElement("img");
    img.src = lugar.imagem;
    img.alt = lugar.nome;
    img.onerror = () => img.replaceWith(article.querySelector(".card-emoji") || criarEmoji(lugar));
    const slot = article.querySelector(".card-emoji");
    if (slot) slot.replaceWith(img);
  }

  return article;
}

function criarEmoji(lugar) {
  const div = document.createElement("div");
  div.className = "card-emoji";
  div.textContent = lugar.emoji || "📍";
  return div;
}

function renderizarCategoria() {
  const grade = document.querySelector(".grade-cards");
  if (!grade) return;

  const slug = obterSlugCategoria();
  const lugares = typeof lugaresPorCategoriaSlug === "function"
    ? lugaresPorCategoriaSlug(slug)
    : [];

  grade.innerHTML = "";

  if (!lugares.length) {
    grade.innerHTML = `
      <p style="grid-column:1/-1;color:var(--texto-suave);">
        Ainda não há lugares cadastrados nesta categoria.
        <a href="explorar.html" style="color:var(--primaria-escura);font-weight:800;">Explore tudo</a>.
      </p>
    `;
    return;
  }

  // Patrocinados primeiro, preservando a ordem do restante.
  const ordenados = (typeof ehPatrocinado === "function")
    ? [...lugares].sort((a, b) => ehPatrocinado(b) - ehPatrocinado(a))
    : lugares;

  ordenados.forEach((lugar) => grade.appendChild(montarCardCategoria(lugar)));
}

document.addEventListener("DOMContentLoaded", renderizarCategoria);
