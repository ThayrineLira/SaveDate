/* =========================================================
   CONFIGURAÇÕES — Save Date
   Lê e grava preferências em localStorage. Tudo salva sozinho.
========================================================= */

/* ----- Toast ----- */
function mostrarToast(mensagem, tipo = "sucesso", duracao = 2400) {
  const container = document.getElementById("toast-container");
  if (!container) return;

  const toast = document.createElement("div");
  toast.className = `toast toast-${tipo}`;
  const icones = { erro: "⚠️", info: "💡", sucesso: "✅" };
  toast.innerHTML = `<span>${icones[tipo] ?? "ℹ️"}</span><span>${mensagem}</span>`;
  container.appendChild(toast);

  requestAnimationFrame(() => requestAnimationFrame(() => toast.classList.add("show")));
  setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => toast.remove(), 380);
  }, duracao);
}

/* ----- Chaves e padrões ----- */
const PADROES = {
  configTema: "auto",
  configTamanhoFonte: "normal",
  configReduzirAnimacoes: "0",
  configNotifNovidades: "1",
  configNotifLembretes: "1",
  configNotifResumo: "0",
  configLocalizacaoAuto: "0",
  configOrcamentoPadrao: "120",
  configDistanciaPadrao: "5",
};

function lerConfig(chave) {
  const valor = localStorage.getItem(chave);
  return valor === null ? PADROES[chave] : valor;
}

function gravarConfig(chave, valor) {
  localStorage.setItem(chave, valor);
}

/* ----- Perfil rápido ----- */
function preencherPerfil() {
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

  const nomeEl = document.getElementById("config-nome");
  const emailEl = document.getElementById("config-email");
  const avatarEl = document.getElementById("config-avatar");

  if (nomeEl) nomeEl.textContent = nome;
  if (emailEl) emailEl.textContent = email;
  if (avatarEl) avatarEl.textContent = (nome.trim().charAt(0) || "U").toUpperCase();
}

/* ----- Tema ----- */
function aplicarTema(tema) {
  const escuroSistema =
    window.matchMedia && window.matchMedia("(prefers-color-scheme: dark)").matches;
  const usarEscuro = tema === "escuro" || (tema === "auto" && escuroSistema);
  document.documentElement.setAttribute("data-tema", usarEscuro ? "escuro" : "claro");

  document.querySelectorAll(".seg-btn[data-tema]").forEach((btn) => {
    btn.classList.toggle("ativo", btn.dataset.tema === tema);
  });
}

function aplicarTamanhoFonte(tamanho) {
  const valor = ["menor", "normal", "maior"].includes(tamanho) ? tamanho : "normal";

  if (valor === "normal") {
    document.documentElement.removeAttribute("data-fonte");
  } else {
    document.documentElement.setAttribute("data-fonte", valor);
  }

  document.querySelectorAll(".fonte-btn").forEach((btn) => {
    btn.classList.toggle("ativo", btn.dataset.fonte === valor);
  });
}

function aplicarAnimacoes(reduzido) {
  if (reduzido) {
    document.documentElement.setAttribute("data-anim", "reduzido");
  } else {
    document.documentElement.removeAttribute("data-anim");
  }
}

/* ----- Carregar valores nos controles ----- */
function carregarControles() {
  // Tema
  aplicarTema(lerConfig("configTema"));
  aplicarTamanhoFonte(lerConfig("configTamanhoFonte"));

  // Toggles
  const mapaToggles = {
    "cfg-animacoes": "configReduzirAnimacoes",
    "cfg-novidades": "configNotifNovidades",
    "cfg-lembretes": "configNotifLembretes",
    "cfg-resumo": "configNotifResumo",
    "cfg-localizacao": "configLocalizacaoAuto",
  };
  Object.entries(mapaToggles).forEach(([id, chave]) => {
    const el = document.getElementById(id);
    if (el) el.checked = lerConfig(chave) === "1";
  });

  // Ranges
  const orcamento = document.getElementById("cfg-orcamento");
  const distancia = document.getElementById("cfg-distancia");
  orcamento.value = lerConfig("configOrcamentoPadrao");
  distancia.value = lerConfig("configDistanciaPadrao");
  atualizarLabelOrcamento(orcamento.value);
  atualizarLabelDistancia(distancia.value);

  // Favoritos
  atualizarTotalFavoritos();
}

function atualizarLabelOrcamento(valor) {
  document.getElementById("cfg-orcamento-valor").textContent =
    Number(valor) >= 250 ? "Até R$ 250+" : `Até R$ ${valor}`;
}

function atualizarLabelDistancia(valor) {
  document.getElementById("cfg-distancia-valor").textContent = `${valor} km`;
}

function atualizarTotalFavoritos() {
  const total = typeof obterSalvos === "function" ? obterSalvos().length : 0;
  document.getElementById("cfg-total-favoritos").textContent = total;
}

/* ----- Ligações de eventos ----- */
function ligarEventos() {
  // Tema (segmented)
  document.querySelectorAll(".seg-btn[data-tema]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const tema = btn.dataset.tema;
      gravarConfig("configTema", tema);
      aplicarTema(tema);
      const nomes = { claro: "Claro", escuro: "Escuro", auto: "Automático" };
      mostrarToast(`Tema: ${nomes[tema]}`);
    });
  });

  // Tamanho das letras
  document.querySelectorAll(".fonte-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      const fonte = btn.dataset.fonte || "normal";
      gravarConfig("configTamanhoFonte", fonte);
      aplicarTamanhoFonte(fonte);
      const nomes = { menor: "menores", normal: "normais", maior: "maiores" };
      mostrarToast(`Letras ${nomes[fonte] || "normais"}`);
    });
  });

  // Reduzir animações
  document.getElementById("cfg-animacoes").addEventListener("change", function () {
    gravarConfig("configReduzirAnimacoes", this.checked ? "1" : "0");
    aplicarAnimacoes(this.checked);
    mostrarToast(this.checked ? "Animações reduzidas" : "Animações normais");
  });

  // Toggles de notificação + localização
  const toggles = [
    { id: "cfg-novidades", chave: "configNotifNovidades", on: "Novidades ativadas", off: "Novidades desativadas" },
    { id: "cfg-lembretes", chave: "configNotifLembretes", on: "Lembretes ativados", off: "Lembretes desativados" },
    { id: "cfg-resumo", chave: "configNotifResumo", on: "Resumo semanal ativado", off: "Resumo semanal desativado" },
    { id: "cfg-localizacao", chave: "configLocalizacaoAuto", on: "Localização automática ativada", off: "Localização automática desativada" },
  ];
  toggles.forEach(({ id, chave, on, off }) => {
    document.getElementById(id).addEventListener("change", function () {
      gravarConfig(chave, this.checked ? "1" : "0");
      mostrarToast(this.checked ? on : off);
    });
  });

  // Range orçamento
  const orcamento = document.getElementById("cfg-orcamento");
  orcamento.addEventListener("input", function () {
    atualizarLabelOrcamento(this.value);
  });
  orcamento.addEventListener("change", function () {
    gravarConfig("configOrcamentoPadrao", this.value);
    mostrarToast("Orçamento padrão salvo");
  });

  // Range distância
  const distancia = document.getElementById("cfg-distancia");
  distancia.addEventListener("input", function () {
    atualizarLabelDistancia(this.value);
  });
  distancia.addEventListener("change", function () {
    gravarConfig("configDistanciaPadrao", this.value);
    mostrarToast("Distância padrão salva");
  });

  // Limpar favoritos
  document.getElementById("cfg-limpar-favoritos").addEventListener("click", function () {
    if (typeof obterSalvos === "function" && obterSalvos().length === 0) {
      mostrarToast("Você não tem favoritos.", "info");
      return;
    }
    if (!confirm("Remover todos os lugares favoritados?")) return;
    if (window.SaveDateStorage) SaveDateStorage.limparSalvos();
    atualizarTotalFavoritos();
    mostrarToast("Favoritos removidos");
  });

  // Redefinir configurações
  document.getElementById("cfg-redefinir").addEventListener("click", function () {
    if (!confirm("Voltar todas as configurações para o padrão?")) return;
    Object.keys(PADROES).forEach((chave) => localStorage.removeItem(chave));
    aplicarAnimacoes(false);
    carregarControles();
    mostrarToast("Configurações redefinidas");
  });

  // Apagar dados locais e sair
  document.getElementById("cfg-apagar-tudo").addEventListener("click", function () {
    if (!confirm("Isso apaga favoritos, preferências e encerra a sessão neste navegador. Continuar?")) return;
    localStorage.clear();
    mostrarToast("Dados apagados. Saindo...", "info");
    setTimeout(() => (window.location.href = "home.html"), 900);
  });

  // Sair da conta
  document.getElementById("cfg-sair").addEventListener("click", function () {
    if (typeof sairLogin === "function") {
      sairLogin();
      return;
    }
    ["usuarioLogado", "nomeUsuario", "usuarioTipo", "usuarioLogadoEmail"].forEach((k) =>
      localStorage.removeItem(k)
    );
    window.location.href = "home.html";
  });

  // Acompanhar mudança de tema do sistema quando estiver em "Auto"
  if (window.matchMedia) {
    window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", () => {
      if (lerConfig("configTema") === "auto") aplicarTema("auto");
    });
  }
}

/* ----- Início ----- */
document.addEventListener("DOMContentLoaded", function () {
  if (localStorage.getItem("usuarioLogado") !== "true") {
    window.location.href = "login.html";
    return;
  }

  preencherPerfil();
  carregarControles();
  ligarEventos();
});
