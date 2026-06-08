/* Shared card rendering helpers. Requires js/storage.js for favorite state. */
(function () {
  const HEART_SAVED = "\u2665";
  const HEART_EMPTY = "\u2661";
  const PIN = "\ud83d\udccd";

  function criarElemento(tag, classe, texto) {
    const elemento = document.createElement(tag);
    if (classe) elemento.className = classe;
    if (texto !== undefined && texto !== null) elemento.textContent = texto;
    return elemento;
  }

  function obterImagemLugar(lugar) {
    return typeof lugar?.imagem === "string" && lugar.imagem.trim()
      ? lugar.imagem.trim()
      : "";
  }

  function precoTexto(lugar) {
    return lugar.preco === 0 ? "Gr\u00e1tis" : `R$${lugar.preco}`;
  }

  function criarFallback(lugar, classeExtra) {
    const fallback = criarElemento(
      "div",
      `card-fallback${classeExtra ? ` ${classeExtra}` : ""}`
    );
    fallback.setAttribute("aria-label", `Foto de ${lugar.nome}`);

    fallback.appendChild(criarElemento("span", "card-emoji", lugar.emoji || "\ud83d\udccd"));
    fallback.appendChild(criarElemento("span", "card-fallback-text", "Imagem em breve"));
    return fallback;
  }

  function criarMidiaCard(lugar) {
    const fragmento = document.createDocumentFragment();
    const imagem = obterImagemLugar(lugar);

    if (!imagem) {
      fragmento.appendChild(criarFallback(lugar));
      return fragmento;
    }

    const img = criarElemento("img", "card-photo");
    img.src = imagem;
    img.alt = `Foto de ${lugar.nome}`;
    img.loading = "lazy";
    img.decoding = "async";
    img.onerror = function () {
      this.style.display = "none";
      const fallback = this.nextElementSibling;
      if (fallback) fallback.style.display = "flex";
    };

    const fallback = criarFallback(lugar, "card-fallback-backup");
    const overlay = criarElemento("span", "card-emoji card-emoji-overlay", lugar.emoji || "");
    overlay.setAttribute("aria-hidden", "true");

    fragmento.appendChild(img);
    fragmento.appendChild(fallback);
    fragmento.appendChild(overlay);
    return fragmento;
  }

  function criarCardLugar(lugar, opcoes) {
    const config = opcoes || {};
    const salvos = Array.isArray(config.salvos)
      ? config.salvos
      : (window.SaveDateStorage?.obterSalvos() || []);
    const patrocinado = Boolean(config.patrocinado);
    const isSaved = salvos.includes(lugar.id);

    const card = criarElemento("a", `card${patrocinado ? " patrocinado" : ""}`);
    card.href = `detalhes.html?id=${lugar.id}`;

    const imagem = criarElemento("div", "card-img");

    if (patrocinado) {
      imagem.appendChild(criarElemento("span", "selo-patrocinado", "\u2605 Patrocinado"));
    }

    imagem.appendChild(criarMidiaCard(lugar));
    imagem.appendChild(criarElemento("div", "card-badge", lugar.categoria));
    imagem.appendChild(criarElemento("div", "card-price", precoTexto(lugar)));

    const botao = criarElemento("button", `card-heart${isSaved ? " saved" : ""}`, isSaved ? HEART_SAVED : HEART_EMPTY);
    botao.type = "button";
    botao.setAttribute("aria-label", isSaved ? "Remover dos favoritos" : "Salvar favorito");
    botao.addEventListener("click", (event) => {
      if (typeof config.onToggleSalvo === "function") {
        config.onToggleSalvo(event, lugar.id);
      }
    });
    imagem.appendChild(botao);

    const corpo = criarElemento("div", "card-body");
    corpo.appendChild(criarElemento("div", "card-name", lugar.nome));

    const linha = criarElemento("div", "card-row");
    const local = criarElemento("div", "card-loc");
    const icon = criarElemento("i", "ti ti-map-pin");
    local.appendChild(icon);
    local.appendChild(document.createTextNode(` ${lugar.localizacao}`));
    linha.appendChild(local);
    linha.appendChild(criarElemento("div", "card-rating", `\u2b50 ${Number(lugar.avaliacoes || 0).toFixed(1)}`));
    corpo.appendChild(linha);

    if (config.badgeAberto || config.distanciaTexto) {
      const extra = criarElemento("div", "card-extra");
      if (config.badgeAberto) extra.insertAdjacentHTML("beforeend", config.badgeAberto);
      if (config.distanciaTexto) {
        extra.appendChild(criarElemento("span", "card-dist", `${PIN} ${config.distanciaTexto}`));
      }
      corpo.appendChild(extra);
    }

    card.appendChild(imagem);
    card.appendChild(corpo);
    return card;
  }

  function atualizarBotaoFavorito(botao, salvo) {
    if (!botao) return;
    botao.classList.toggle("saved", salvo);
    botao.textContent = salvo ? HEART_SAVED : HEART_EMPTY;
    botao.setAttribute("aria-label", salvo ? "Remover dos favoritos" : "Salvar favorito");
  }

  window.SaveDateCards = {
    HEART_SAVED,
    HEART_EMPTY,
    obterImagemLugar,
    precoTexto,
    criarCardLugar,
    atualizarBotaoFavorito
  };
})();
