/* Os dados dos lugares vem de js/dados.js (lugaresData global). */

function renderCardsSalvos(lugares) {
  const grid = document.getElementById("cards-grid");
  grid.innerHTML = "";

  if (!lugares.length) {
    const logado = typeof estaLogado === "function" && estaLogado();
    const titulo = logado
      ? "Voc\u00ea ainda n\u00e3o salvou nenhum lugar"
      : "Entre para guardar seus favoritos";
    const texto = logado
      ? "Use o cora\u00e7\u00e3o nos cards para montar sua lista antes de sair."
      : "Com uma conta, voc\u00ea consegue salvar lugares e retomar seu planejamento depois.";

    grid.innerHTML = `
      <div class="empty">
        <i class="ti ti-heart"></i>
        <h2 class="empty-title">${titulo}</h2>
        <p class="empty-hint">${texto}</p>
        <div class="empty-actions">
          <a class="empty-btn primary" href="${logado ? "explorar.html" : "login.html"}">
            ${logado ? "Explorar lugares" : "Entrar na conta"}
          </a>
          <a class="empty-btn" href="suporte.html">Preciso de ajuda</a>
        </div>
      </div>
    `;
    return;
  }

  const salvos = obterSalvos();
  const fragmento = document.createDocumentFragment();

  lugares.forEach((lugar) => {
    fragmento.appendChild(
      SaveDateCards.criarCardLugar(lugar, {
        salvos,
        patrocinado: typeof ehPatrocinado === "function" && ehPatrocinado(lugar),
        badgeAberto: typeof badgeAbertoHTML === "function" ? badgeAbertoHTML(lugar.horario) : "",
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
    renderSalvos();
  }
}

function renderSalvos() {
  const salvos = obterSalvos();
  const lugaresCardsSalvos = lugaresData.filter((lugar) => salvos.includes(lugar.id));

  document.getElementById("count").textContent = lugaresCardsSalvos.length;
  renderCardsSalvos(lugaresCardsSalvos);
}

document.addEventListener("DOMContentLoaded", renderSalvos);
