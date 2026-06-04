/* Os dados dos lugares vêm de js/dados.js (lugaresData global). */

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

function renderCardsSalvos(lugares) {
  const grid = document.getElementById("cards-grid");
  grid.innerHTML = "";

  if (!lugares.length) {
    grid.innerHTML = `
      <div class="empty">
        <i class="ti ti-heart"></i>
        <p>Você ainda não salvou nenhum lugar</p>
        <p style="font-size: 12px; color: #888; margin-top: 8px;">
          Vá para <a href="explorar.html" style="color: #ff6b35; text-decoration: underline;">Explorar</a> e adicione seus favoritos
        </p>
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
        <span style="font-size: 60px;">${lugar.emoji}</span>
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

  // Verificar se está logado
  if (!estaLogado()) {
    protegerFuncionalidade();
    return;
  }

  const salvos = obterSalvos();

  if (salvos.includes(id)) {
    salvos.splice(salvos.indexOf(id), 1);
  } else {
    if (typeof podeAdicionarSalvo === "function" && !podeAdicionarSalvo(salvos.length)) {
      premiumAvisoLimite();
      return;
    }
    salvos.push(id);
  }

  salvarSalvos(salvos);
  renderSalvos();
}

function renderSalvos() {
  const salvos = obterSalvos();
  const lugaresCardsSalvos = lugaresData.filter((lugar) => salvos.includes(lugar.id));

  document.getElementById("count").textContent = lugaresCardsSalvos.length;
  renderCardsSalvos(lugaresCardsSalvos);
}

document.addEventListener("DOMContentLoaded", renderSalvos);
