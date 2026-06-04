/* Os dados dos lugares vêm de js/dados.js (lugaresData global). */

let filtroAtivo = "Todos";
let chipAtivo = "Todos";
let orcamentoBuscado = 200;
let termoBusca = "";
let ordenarPor = "relevancia";
let bairroAtivo = "Todos";
let somenteAberto = false;

function bairroDe(lugar) {
  return typeof bairroDeLugar === "function"
    ? bairroDeLugar(lugar)
    : (lugar.localizacao || "").split(",")[0].trim();
}

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

  if (bairroAtivo !== "Todos") {
    resultados = resultados.filter((lugar) => bairroDe(lugar) === bairroAtivo);
  }

  if (somenteAberto) {
    resultados = resultados.filter((lugar) => estaAbertoAgora(lugar.horario) === true);
  }

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

  resultados = ordenarLugares(resultados);

  document.getElementById("count").textContent = resultados.length;
  renderCards(resultados);
}

function patrocinado(lugar) {
  return typeof ehPatrocinado === "function" && ehPatrocinado(lugar);
}

function distanciaDoUsuario(lugar) {
  const coords =
    typeof coordenadasDeLugar === "function"
      ? coordenadasDeLugar(lugar)
      : lugar.lat != null && lugar.lon != null
        ? { lat: lugar.lat, lon: lugar.lon }
        : null;

  if (!posicaoUsuario || !coords || typeof distanciaKm !== "function") return Infinity;
  return distanciaKm(posicaoUsuario.lat, posicaoUsuario.lon, coords.lat, coords.lon);
}

function ordenarLugares(lista) {
  const arr = [...lista];
  switch (ordenarPor) {
    case "preco-asc":
      arr.sort((a, b) => a.preco - b.preco);
      break;
    case "preco-desc":
      arr.sort((a, b) => b.preco - a.preco);
      break;
    case "nota":
      arr.sort((a, b) => b.avaliacoes - a.avaliacoes);
      break;
    case "distancia":
      arr.sort((a, b) => distanciaDoUsuario(a) - distanciaDoUsuario(b));
      break;
    default: // relevância: patrocinados primeiro, depois melhor avaliados
      arr.sort((a, b) => {
        const p = (patrocinado(b) ? 1 : 0) - (patrocinado(a) ? 1 : 0);
        return p !== 0 ? p : b.avaliacoes - a.avaliacoes;
      });
  }
  return arr;
}

function setOrdenar(valor) {
  ordenarPor = valor;
  if (valor === "distancia" && !posicaoUsuario) {
    ativarPertoDeMim();
    return;
  }
  filtrarCards();
}

function setBairro(valor) {
  bairroAtivo = valor;
  filtrarCards();
}

function toggleAberto() {
  somenteAberto = !somenteAberto;
  document.getElementById("toggle-aberto")?.classList.toggle("ativo", somenteAberto);
  filtrarCards();
}

function ativarPertoDeMim() {
  const btn = document.getElementById("btn-perto");
  if (btn) {
    btn.disabled = true;
    btn.textContent = "📍 Localizando...";
  }
  obterPosicaoUsuario()
    .then(() => {
      ordenarPor = "distancia";
      const sel = document.getElementById("ordenar");
      if (sel) sel.value = "distancia";
      if (btn) {
        btn.disabled = false;
        btn.textContent = "📍 Perto de mim ✓";
        btn.classList.add("ativo");
      }
      filtrarCards();
    })
    .catch((err) => {
      if (btn) {
        btn.disabled = false;
        btn.textContent = "📍 Perto de mim";
      }
      alert(
        "Não consegui acessar sua localização (" +
          (err && err.message ? err.message : "permissão negada") +
          ").\nAtive a localização do navegador e tente novamente."
      );
    });
}

function popularBairros() {
  const sel = document.getElementById("bairro");
  if (!sel) return;
  const bairros = [...new Set(lugaresData.map(bairroDe).filter(Boolean))].sort((a, b) =>
    a.localeCompare(b, "pt")
  );
  bairros.forEach((b) => {
    const opt = document.createElement("option");
    opt.value = b;
    opt.textContent = b;
    sel.appendChild(opt);
  });
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

    const ehPatro = patrocinado(lugar);
    const seloPatrocinado = ehPatro
      ? '<span class="selo-patrocinado">★ Patrocinado</span>'
      : "";

    const badgeAberto = typeof badgeAbertoHTML === "function" ? badgeAbertoHTML(lugar.horario) : "";
    const dist = distanciaDoUsuario(lugar);
    const distanciaFormatada =
      typeof formatarDistancia === "function" ? formatarDistancia(dist) : `${dist.toFixed(1)} km`;
    const distTexto = Number.isFinite(dist)
      ? `<span class="card-dist">📍 ${distanciaFormatada}</span>`
      : "";

    card.href = `detalhes.html?id=${lugar.id}`;
    card.className = "card" + (ehPatro ? " patrocinado" : "");
    
    // Adicionar proteção de login ao clicar no card
    card.addEventListener('click', function(e) {
      if (!estaLogado()) {
        e.preventDefault();
        protegerFuncionalidade();
        return false;
      }
    });
    
    card.innerHTML = `
      <div class="card-img">
        ${seloPatrocinado}
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
        <div class="card-extra">
          ${badgeAberto}
          ${distTexto}
        </div>
      </div>
    `;

    grid.appendChild(card);
  });
}

function toggleSalvo(event, id) {
  event.preventDefault();
  event.stopPropagation();

  // Verificar se está logado
  if (!estaLogado()) {
    protegerFuncionalidade();
    return;
  }

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
  popularBairros();
  updateBudget(200);
  aplicarCategoriaDaUrl();
  filtrarCards();
});
