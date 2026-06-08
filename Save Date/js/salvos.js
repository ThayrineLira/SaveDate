/* Os dados dos lugares vem de js/dados.js (lugaresData global). */

function renderCardsSalvos(lugares) {
  const grid = document.getElementById("cards-grid");
  grid.innerHTML = "";

  if (!lugares.length) {
    grid.innerHTML = `
      <div class="empty">
        <i class="ti ti-heart"></i>
        <p>Voc&ecirc; ainda n&atilde;o salvou nenhum lugar</p>
        <p class="empty-hint">
          V&aacute; para <a href="explorar.html">Explorar</a> e adicione seus favoritos
        </p>
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
