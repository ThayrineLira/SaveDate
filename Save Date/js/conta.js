/* Os dados dos lugares vêm de js/dados.js (lugaresData global). */
const lugaresConta = (typeof lugaresData !== "undefined") ? lugaresData : [];

function obterDadosConta() {
  const tipo =
    typeof premiumTipoConta === "function"
      ? premiumTipoConta()
      : (localStorage.getItem("usuarioTipo") || "usuario");
  const nome =
    localStorage.getItem("nomeUsuario") ||
    localStorage.getItem("usuarioCadastroNome") ||
    localStorage.getItem("estabelecimentoCadastroNome") ||
    "Usuário";

  const email =
    localStorage.getItem("usuarioLogadoEmail") ||
    localStorage.getItem("usuarioCadastroEmail") ||
    localStorage.getItem("estabelecimentoCadastroEmail") ||
    localStorage.getItem("email") ||
    "E-mail não informado";

  return { tipo, nome, email };
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

  atualizarPremiumConta();

  const lista = document.getElementById("lista-salvos-conta");
  lista.innerHTML = "";

  if (!lugaresSalvos.length) {
    lista.innerHTML = '<p class="mensagem-vazia">Nenhum lugar salvo ainda.</p>';
    return;
  }

  const fragmento = document.createDocumentFragment();

  lugaresSalvos.forEach((lugar) => {
    const item = document.createElement("a");
    item.className = "salvo-item";
    item.href = `detalhes.html?id=${lugar.id}`;

    const nome = document.createElement("span");
    nome.textContent = lugar.nome;

    const categoria = document.createElement("strong");
    categoria.textContent = lugar.categoria;

    item.appendChild(nome);
    item.appendChild(categoria);
    fragmento.appendChild(item);
  });

  lista.appendChild(fragmento);
}

function atualizarPremiumConta() {
  const badge = document.getElementById("badge-premium");
  const link = document.getElementById("link-premium");
  const btnCancelar = document.getElementById("btn-cancelar-premium");
  const ehPremium = typeof temPremiumAtivo === "function" && temPremiumAtivo();
  const ehAdmin = typeof premiumEhAdmin === "function" && premiumEhAdmin();
  // O acesso do admin é liberado por gestão, não é uma assinatura cancelável.
  const podeCancelar = ehPremium && !ehAdmin;

  if (badge) badge.style.display = ehPremium ? "inline-flex" : "none";

  if (link) {
    if (ehPremium) {
      link.textContent = "Premium ativo ✓";
      link.classList.add("secundario");
      link.removeAttribute("href");
    } else {
      link.textContent = "Seja Premium ★";
      link.classList.remove("secundario");
      link.href = "premium.html";
    }
  }

  if (btnCancelar) btnCancelar.style.display = podeCancelar ? "inline-flex" : "none";
}

/* Benefícios do plano atual (para mostrar o que se perde ao cancelar). */
function beneficiosDoPlanoAtual() {
  const planoId = localStorage.getItem("premiumPlanoAtual") || "";
  const plano =
    typeof PLANOS_PREMIUM !== "undefined" ? PLANOS_PREMIUM[planoId] : null;

  if (plano && Array.isArray(plano.beneficios) && plano.beneficios.length) {
    return { nome: plano.nome, beneficios: plano.beneficios };
  }

  const publico =
    typeof premiumPublicoAtual === "function" ? premiumPublicoAtual() : "usuario";
  return publico === "estabelecimento"
    ? {
        nome: "Premium",
        beneficios: [
          "Destaque nas buscas da plataforma",
          "Estatísticas de visitas e salvamentos",
          "Responder e moderar avaliações",
          "Selo de parceiro no perfil"
        ]
      }
    : {
        nome: "Premium",
        beneficios: [
          "Lugares salvos ilimitados",
          "Filtros avançados de busca",
          "Roteiro de date completo",
          "Navegação sem anúncios",
          "Selo no seu perfil"
        ]
      };
}

/*
   Fluxo de cancelamento com retenção em etapas: a ideia é segurar o
   usuário mostrando o que ele perde antes de liberar o cancelamento de fato.
   1) o que você perde   2) apelo para ficar   3) confirmação com aceite.
*/
function abrirFluxoCancelamento() {
  if (typeof cancelarPremium !== "function") return;

  const info = beneficiosDoPlanoAtual();
  const limite =
    typeof LIMITE_SALVOS_GRATIS !== "undefined" ? LIMITE_SALVOS_GRATIS : 5;
  const listaPerdas = info.beneficios
    .map((b) => `<li>${b}</li>`)
    .join("");

  const overlay = document.createElement("div");
  overlay.className = "cancel-overlay";
  overlay.innerHTML =
    '<div class="cancel-modal" role="dialog" aria-modal="true" aria-labelledby="cancel-titulo"></div>';
  document.body.appendChild(overlay);

  const modal = overlay.querySelector(".cancel-modal");
  const fechar = () => overlay.remove();

  // Fechar ao clicar fora do card (mas isso mantém o Premium — caminho "fácil").
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) fechar();
  });

  function efetivarCancelamento() {
    const publico =
      typeof premiumPublicoAtual === "function" ? premiumPublicoAtual() : "";
    cancelarPremium(publico);
    fechar();
    renderizarConta();
    atualizarMensagem("Assinatura cancelada.");
  }

  function passo1() {
    modal.innerHTML = `
      <span class="cancel-tag">★ ${info.nome}</span>
      <h2 id="cancel-titulo">Tem certeza que quer cancelar?</h2>
      <p class="cancel-sub">Cancelando agora, você perde <strong>imediatamente</strong>:</p>
      <ul class="cancel-perdas">${listaPerdas}</ul>
      <div class="cancel-acoes">
        <button class="btn cancel-manter" type="button" id="cancel-manter-1">Manter meu Premium</button>
        <button class="cancel-link" type="button" id="cancel-seguir-1">Ainda quero cancelar</button>
      </div>`;
    modal.querySelector("#cancel-manter-1").addEventListener("click", fechar);
    modal.querySelector("#cancel-seguir-1").addEventListener("click", passo2);
  }

  function passo2() {
    modal.innerHTML = `
      <span class="cancel-tag">Espera um pouco 🙏</span>
      <h2 id="cancel-titulo">A gente não quer te ver ir embora</h2>
      <p class="cancel-sub">
        Enquanto você é Premium, seus rolês continuam saindo sem limite.
        Sem o plano, seus lugares salvos voltam ao limite de <strong>${limite}</strong>
        e você perde o acesso às ferramentas exclusivas.
      </p>
      <p class="cancel-sub">Que tal continuar aproveitando?</p>
      <div class="cancel-acoes">
        <button class="btn cancel-manter" type="button" id="cancel-manter-2">Quero continuar aproveitando</button>
        <button class="cancel-link" type="button" id="cancel-seguir-2">Não, quero cancelar mesmo assim</button>
      </div>`;
    modal.querySelector("#cancel-manter-2").addEventListener("click", fechar);
    modal.querySelector("#cancel-seguir-2").addEventListener("click", passo3);
  }

  function passo3() {
    modal.innerHTML = `
      <span class="cancel-tag">Última etapa</span>
      <h2 id="cancel-titulo">Confirmar cancelamento</h2>
      <p class="cancel-sub">O cancelamento é imediato. Para confirmar, marque a opção abaixo.</p>
      <label class="cancel-check">
        <input type="checkbox" id="cancel-aceite" />
        <span>Entendo que vou perder todos os benefícios Premium agora mesmo.</span>
      </label>
      <div class="cancel-acoes">
        <button class="btn cancel-manter" type="button" id="cancel-voltar-3">Mudei de ideia, manter Premium</button>
        <button class="btn perigo" type="button" id="cancel-confirmar-3" disabled>Confirmar cancelamento</button>
      </div>`;
    const check = modal.querySelector("#cancel-aceite");
    const btnConfirmar = modal.querySelector("#cancel-confirmar-3");
    check.addEventListener("change", () => {
      btnConfirmar.disabled = !check.checked;
    });
    modal.querySelector("#cancel-voltar-3").addEventListener("click", fechar);
    btnConfirmar.addEventListener("click", () => {
      if (check.checked) efetivarCancelamento();
    });
  }

  passo1();
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
  SaveDateStorage.limparSalvos();
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
  // Remove as chaves globais legadas de premium para não vazar entre contas.
  localStorage.removeItem("clientePremiumAtivo");
  localStorage.removeItem("usuarioPremium");
  window.location.href = "home.html";
}

document.addEventListener("DOMContentLoaded", function () {
  renderizarConta();

  document.getElementById("form-conta")?.addEventListener("submit", salvarNome);
  document.getElementById("btn-limpar-salvos")?.addEventListener("click", limparFavoritos);
  document.getElementById("btn-cancelar-premium")?.addEventListener("click", abrirFluxoCancelamento);
  document.getElementById("btn-sair-conta")?.addEventListener("click", sairConta);
});
