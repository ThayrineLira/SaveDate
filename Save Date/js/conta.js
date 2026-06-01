const lugaresConta = [
  { id: 1, nome: "Família Mancini", categoria: "Restaurante" },
  { id: 2, nome: "O Bar do Seu Zé", categoria: "Bar" },
  { id: 3, nome: "Gourmet Burguer", categoria: "Lanchonete" },
  { id: 4, nome: "Pizzaria do Bairro", categoria: "Pizzaria" },
  { id: 5, nome: "Café Aconchego", categoria: "Café" },
  { id: 6, nome: "Shopping Center VillaGe", categoria: "Shopping" },
  { id: 7, nome: "Parque da Independência", categoria: "Parque" },
  { id: 8, nome: "Sorveteria Gelato", categoria: "Sorveteria" },
  { id: 9, nome: "Beer & Vibes", categoria: "Bar" }
];

function obterDadosConta() {
  const tipo = localStorage.getItem("usuarioTipo") || "usuario";
  const nome =
    localStorage.getItem("nomeUsuario") ||
    localStorage.getItem("usuarioCadastroNome") ||
    localStorage.getItem("estabelecimentoCadastroNome") ||
    "Usuário";

  const email =
    localStorage.getItem("usuarioCadastroEmail") ||
    localStorage.getItem("estabelecimentoCadastroEmail") ||
    localStorage.getItem("email") ||
    "E-mail não informado";

  return { tipo, nome, email };
}

function obterSalvos() {
  try {
    return JSON.parse(localStorage.getItem("lugareSalvos") || "[]");
  } catch (erro) {
    return [];
  }
}

function atualizarMensagem(texto) {
  const mensagem = document.getElementById("mensagem-conta");
  if (!mensagem) return;

  mensagem.textContent = texto;
  setTimeout(() => {
    mensagem.textContent = "";
  }, 2600);
}

function renderizarConta() {
  if (localStorage.getItem("usuarioLogado") !== "true") {
    window.location.href = "login.html";
    return;
  }

  const dados = obterDadosConta();
  const salvos = obterSalvos();
  const lugaresSalvos = lugaresConta.filter((lugar) => salvos.includes(lugar.id));
  const inicial = dados.nome.trim().charAt(0).toUpperCase() || "U";

  document.getElementById("avatar-conta").textContent = inicial;
  document.getElementById("nome-conta").textContent = dados.nome;
  document.getElementById("tipo-conta").textContent =
    dados.tipo === "estabelecimento" ? "Estabelecimento" : "Usuário";
  document.getElementById("email-conta").textContent = dados.email;
  document.getElementById("tipo-detalhe").textContent =
    dados.tipo === "estabelecimento" ? "Conta de estabelecimento" : "Conta de visitante";
  document.getElementById("nome-input").value = dados.nome;
  document.getElementById("salvos-count").textContent = lugaresSalvos.length;
  document.getElementById("tipo-count").textContent =
    dados.tipo === "estabelecimento" ? "Local" : "Pessoa";

  const lista = document.getElementById("lista-salvos-conta");
  lista.innerHTML = "";

  if (!lugaresSalvos.length) {
    lista.innerHTML = '<p class="mensagem-vazia">Nenhum lugar salvo ainda.</p>';
    return;
  }

  lugaresSalvos.forEach((lugar) => {
    const item = document.createElement("a");
    item.className = "salvo-item";
    item.href = `detalhes.html?id=${lugar.id}`;
    item.innerHTML = `
      <span>${lugar.nome}</span>
      <strong>${lugar.categoria}</strong>
    `;
    lista.appendChild(item);
  });
}

function salvarNome(event) {
  event.preventDefault();

  const input = document.getElementById("nome-input");
  const nome = input.value.trim();

  if (!nome) {
    atualizarMensagem("Digite um nome para salvar.");
    return;
  }

  localStorage.setItem("nomeUsuario", nome);
  renderizarConta();
  atualizarMensagem("Nome atualizado.");
}

function limparFavoritos() {
  localStorage.removeItem("lugareSalvos");
  renderizarConta();
  atualizarMensagem("Favoritos removidos.");
}

function sairConta() {
  localStorage.removeItem("usuarioLogado");
  localStorage.removeItem("nomeUsuario");
  localStorage.removeItem("usuarioTipo");
  localStorage.removeItem("usuarioLogadoEmail");
  localStorage.removeItem("estabelecimentoCadastroEmail");
  localStorage.removeItem("estabelecimentoCadastroSenha");
  localStorage.removeItem("estabelecimentoCadastroNome");
  localStorage.removeItem("estabelecimentoCadastroEndereco");
  localStorage.removeItem("estabelecimentoCadastroComplemento");
  localStorage.removeItem("estabelecimentoCadastroTelefone");
  localStorage.removeItem("usuarioPremium");
  window.location.href = "home.html";
}

document.addEventListener("DOMContentLoaded", function () {
  renderizarConta();

  document.getElementById("form-conta")?.addEventListener("submit", salvarNome);
  document.getElementById("btn-limpar-salvos")?.addEventListener("click", limparFavoritos);
  document.getElementById("btn-sair-conta")?.addEventListener("click", sairConta);
});
