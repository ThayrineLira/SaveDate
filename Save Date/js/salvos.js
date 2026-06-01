const lugaresData = [
  { id: 1, nome: "Família Mancini", categoria: "Restaurante", emoji: "🍽️", preco: 95, avaliacoes: 4.8, localizacao: "Zona sul, São Paulo" },
  { id: 2, nome: "O Bar do Seu Zé", categoria: "Bar", emoji: "🍺", preco: 45, avaliacoes: 4.6, localizacao: "Vila Mariana" },
  { id: 3, nome: "Gourmet Burguer", categoria: "Lanchonete", emoji: "🍔", preco: 35, avaliacoes: 4.5, localizacao: "Pinheiros" },
  { id: 4, nome: "Pizzaria do Bairro", categoria: "Pizzaria", emoji: "🍕", preco: 60, avaliacoes: 4.7, localizacao: "Mooca" },
  { id: 5, nome: "Café Aconchego", categoria: "Café", emoji: "☕", preco: 25, avaliacoes: 4.9, localizacao: "Vila Madalena" },
  { id: 6, nome: "Shopping Center VillaGe", categoria: "Shopping", emoji: "🛍️", preco: 0, avaliacoes: 4.4, localizacao: "Zona norte" },
  { id: 7, nome: "Parque da Independência", categoria: "Parque", emoji: "🌳", preco: 0, avaliacoes: 4.6, localizacao: "Ipiranga" },
  { id: 8, nome: "Sorveteria Gelato", categoria: "Sorveteria", emoji: "🍨", preco: 20, avaliacoes: 4.8, localizacao: "Consolação" },
  { id: 9, nome: "Beer & Vibes", categoria: "Bar", emoji: "🍻", preco: 50, avaliacoes: 4.5, localizacao: "Bom Retiro" }
];

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

  const salvos = obterSalvos();

  if (salvos.includes(id)) {
    salvos.splice(salvos.indexOf(id), 1);
  } else {
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
