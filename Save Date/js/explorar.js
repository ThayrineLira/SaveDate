/* Os dados dos lugares vêm de js/dados.js (lugaresData global). */

let filtroAtivo = "Todos";
let chipAtivo = "Todos";
let orcamentoBuscado = 200;
let termoBusca = "";
let ordenarPor = "relevancia";
let bairroAtivo = "Todos";
let somenteAberto = false;

function limparFiltrosExplorar() {
  filtroAtivo = "Todos";
  chipAtivo = "Todos";
  termoBusca = "";
  ordenarPor = "relevancia";
  bairroAtivo = "Todos";
  somenteAberto = false;

  const busca = document.getElementById("search-input");
  const ordenar = document.getElementById("ordenar");
  const bairro = document.getElementById("bairro");
  const rangeOrcamento = document.getElementById("budget-range");

  if (busca) busca.value = "";
  if (ordenar) ordenar.value = "relevancia";
  if (bairro) bairro.value = "Todos";
  if (rangeOrcamento) rangeOrcamento.value = "200";

  document.getElementById("toggle-aberto")?.classList.remove("ativo");

  const btnPerto = document.getElementById("btn-perto");
  if (btnPerto) {
    btnPerto.classList.remove("ativo");
    btnPerto.textContent = "Perto de mim";
  }

  document.querySelectorAll(".chip").forEach((chip) => {
    chip.classList.toggle("active", chip.dataset.chip === "Todos");
  });

  document.querySelectorAll(".cat").forEach((cat) => {
    const label = cat.querySelector(".cat-label")?.textContent.trim();
    cat.classList.toggle("active", label === "Todos");
  });

  updateBudget(200);
  window.SaveDateUI?.toast("Filtros limpos.", "sucesso");
}

function bairroDe(lugar) {
  return typeof bairroDeLugar === "function"
    ? bairroDeLugar(lugar)
    : (lugar.localizacao || "").split(",")[0].trim();
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
    if (window.SaveDateUI?.botaoCarregando) {
      window.SaveDateUI.botaoCarregando(btn, true, "Localizando...");
    } else {
      btn.disabled = true;
      btn.textContent = "Localizando...";
    }
  }
  obterPosicaoUsuario()
    .then(() => {
      ordenarPor = "distancia";
      const sel = document.getElementById("ordenar");
      if (sel) sel.value = "distancia";
      if (btn) {
        if (window.SaveDateUI?.botaoCarregando) {
          window.SaveDateUI.botaoCarregando(btn, false);
        } else {
          btn.disabled = false;
        }
        btn.textContent = "Perto de mim OK";
        btn.classList.add("ativo");
      }
      window.SaveDateUI?.toast("Lugares ordenados por distancia.", "sucesso");
      filtrarCards();
    })
    .catch((err) => {
      if (btn) {
        if (window.SaveDateUI?.botaoCarregando) {
          window.SaveDateUI.botaoCarregando(btn, false);
        } else {
          btn.disabled = false;
        }
        btn.textContent = "Perto de mim";
      }
      const motivo = err && err.message ? err.message : "permiss\u00e3o negada";
      window.SaveDateUI?.toast(
        `N\u00e3o consegui acessar sua localiza\u00e7\u00e3o (${motivo}). Use o filtro de bairro ou tente novamente.`,
        "erro",
        5200
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
        <h2 class="empty-title">Nenhum lugar encontrado</h2>
        <p class="empty-hint">
          Ajuste or&ccedil;amento, bairro, categoria ou texto da busca para ampliar os resultados.
        </p>
        <div class="empty-actions">
          <button type="button" class="empty-btn primary" data-empty-action="limpar-filtros">Limpar filtros</button>
          <a class="empty-btn" href="suporte.html">Avisar um problema</a>
        </div>
      </div>
    `;
    grid.querySelector("[data-empty-action='limpar-filtros']")
      ?.addEventListener("click", limparFiltrosExplorar);
    return;
  }

  const salvos = obterSalvos();
  const fragmento = document.createDocumentFragment();

  lugares.forEach((lugar) => {
    const dist = distanciaDoUsuario(lugar);
    const distanciaFormatada =
      typeof formatarDistancia === "function" ? formatarDistancia(dist) : `${dist.toFixed(1)} km`;

    fragmento.appendChild(
      SaveDateCards.criarCardLugar(lugar, {
        salvos,
        patrocinado: patrocinado(lugar),
        badgeAberto: typeof badgeAbertoHTML === "function" ? badgeAbertoHTML(lugar.horario) : "",
        distanciaTexto: Number.isFinite(dist) ? distanciaFormatada : "",
        onToggleSalvo: toggleSalvo
      })
    );
  });

  grid.appendChild(fragmento);
}

function toggleSalvo(event, id) {
  event.preventDefault();
  event.stopPropagation();

  // Verificar se está logado
  if (!estaLogado()) {
    protegerFuncionalidade();
    return;
  }

  const resultado = SaveDateStorage.alternarSalvo(id, {
    podeAdicionar: typeof podeAdicionarSalvo === "function" ? podeAdicionarSalvo : null,
    onLimite: typeof premiumAvisoLimite === "function" ? premiumAvisoLimite : null
  });

  if (resultado.alterado) {
    SaveDateCards.atualizarBotaoFavorito(event.currentTarget, resultado.salvo);
  }
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
