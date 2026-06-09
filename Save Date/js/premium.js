/* =========================================================
   PREMIUM.JS — MÓDULO CENTRAL DE ASSINATURAS
   Controla os planos e o estado Premium tanto do
   USUÁRIO comum quanto do ESTABELECIMENTO.
   Tudo é simulado em localStorage (protótipo).
========================================================= */

/* ---------------------------------------------------------
   PLANOS DISPONÍVEIS
   publico: "usuario" ou "estabelecimento"
--------------------------------------------------------- */
const PLANOS_PREMIUM = {
  plus: {
    id: "plus",
    nome: "Save Date Plus",
    publico: "usuario",
    nivel: 1,
    destaque: true,
    preco: 9.9,
    precoLabel: "R$ 9,90",
    periodo: "/mês",
    resumo: "Para quem sai bastante e quer planejar tudo sem limite.",
    beneficios: [
      "Lugares salvos ilimitados",
      "Filtros avançados (preço, distância e clima)",
      "Roteiro de date: monte um rolê completo",
      "Recomendações personalizadas",
      "Navegação sem anúncios",
      "Selo Plus no seu perfil"
    ]
  },
  duo: {
    id: "duo",
    nome: "Save Date Duo",
    publico: "usuario",
    nivel: 2,
    preco: 14.9,
    precoLabel: "R$ 14,90",
    periodo: "/mês",
    resumo: "O Plus para o casal: planejem os rolês juntos, numa conta só.",
    beneficios: [
      "Tudo do plano Plus",
      "Até 2 perfis vinculados na mesma assinatura",
      "Lista de favoritos e roteiros compartilhados",
      "Sugestões de date a dois personalizadas",
      "Selo Duo no perfil do casal"
    ]
  },
  plus_anual: {
    id: "plus_anual",
    nome: "Save Date Plus Anual",
    publico: "usuario",
    nivel: 3,
    economia: true,
    preco: 99,
    precoLabel: "R$ 99,00",
    periodo: "/ano",
    resumo: "Todos os benefícios do Plus com 2 meses grátis.",
    beneficios: [
      "Tudo do plano Plus",
      "Equivale a R$ 8,25/mês (2 meses grátis)",
      "Cobrança única anual, sem reajuste no período",
      "Prioridade em novos recursos para usuários",
      "Selo Plus no seu perfil"
    ]
  },

  /* ---------- PLANOS PARA ESTABELECIMENTOS (em níveis) ---------- */
  essencial: {
    id: "essencial",
    nome: "Parceiro Essencial",
    publico: "estabelecimento",
    nivel: 1,
    preco: 29.9,
    precoLabel: "R$ 29,90",
    periodo: "/mês",
    resumo: "O começo ideal para colocar seu restaurante no mapa.",
    beneficios: [
      "Perfil completo com fotos do estabelecimento",
      "Editar o cardápio completo",
      "Aparecer nas buscas por categoria",
      "Perfil verificado com selo de parceiro",
      "Horário de funcionamento e contato em destaque"
    ]
  },
  parceiro: {
    id: "parceiro",
    nome: "Parceiro Premium",
    publico: "estabelecimento",
    nivel: 2,
    destaque: true,
    preco: 50,
    precoLabel: "R$ 50,00",
    periodo: "/mês",
    resumo: "Para o seu restaurante aparecer mais e vender melhor.",
    beneficios: [
      "Tudo do plano Essencial",
      "Destaque nas buscas da plataforma",
      "Remover comentários indevidos (até 10)",
      "Responder às avaliações dos clientes",
      "Publicar eventos e promoções no perfil",
      "Estatísticas de visitas e salvamentos",
      "Selo Premium no seu perfil"
    ]
  },
  pro: {
    id: "pro",
    nome: "Parceiro Pro",
    publico: "estabelecimento",
    nivel: 3,
    preco: 99.9,
    precoLabel: "R$ 99,90",
    periodo: "/mês",
    resumo: "Máxima visibilidade para quem quer lotar o salão.",
    beneficios: [
      "Tudo do plano Premium",
      "Topo dos resultados de busca da região",
      "Banner em destaque na página inicial",
      "Remoção ilimitada de comentários indevidos",
      "Relatórios avançados de desempenho",
      "Campanhas e anúncios patrocinados",
      "Gerente de conta e suporte prioritário"
    ]
  },
  parceiro_anual: {
    id: "parceiro_anual",
    nome: "Parceiro Premium Anual",
    publico: "estabelecimento",
    nivel: 2,
    economia: true,
    preco: 500,
    precoLabel: "R$ 500,00",
    periodo: "/ano",
    resumo: "Todos os benefícios do Premium com 2 meses grátis.",
    beneficios: [
      "Tudo do plano Premium",
      "Equivale a R$ 41,66/mês (2 meses grátis)",
      "Cobrança única anual, sem reajuste no período",
      "Prioridade em novos recursos para parceiros",
      "Selo Premium no seu perfil"
    ]
  }
};

/* ---------------------------------------------------------
   ESTADO DO USUÁRIO
--------------------------------------------------------- */
function normalizarPremiumTexto(valor) {
  return String(valor || "").trim().toLowerCase();
}

function premiumEmailLogado() {
  const tipo = premiumTipoConta();
  const email =
    localStorage.getItem("usuarioLogadoEmail") ||
    (tipo === "estabelecimento"
      ? localStorage.getItem("estabelecimentoCadastroEmail")
      : localStorage.getItem("usuarioCadastroEmail")) ||
    localStorage.getItem("estabelecimentoCadastroEmail") ||
    localStorage.getItem("usuarioCadastroEmail") ||
    localStorage.getItem("email") ||
    "";

  return normalizarPremiumTexto(email);
}

function premiumTipoConta() {
  const tipo = normalizarPremiumTexto(localStorage.getItem("usuarioTipo") || "usuario");
  return tipo === "cliente" ? "usuario" : tipo;
}

function premiumEstaLogado() {
  return localStorage.getItem("usuarioLogado") === "true";
}

/* O admin tem acesso liberado a todos os recursos premium (para testes/gestão). */
function premiumEhAdmin() {
  return premiumEstaLogado() && premiumTipoConta() === "admin";
}

/* Chave de armazenamento por público + e-mail. */
function premiumChave(publico, email) {
  const alvo = normalizarPremiumTexto(email || premiumEmailLogado() || "anonimo");
  return publico === "estabelecimento"
    ? `estabelecimentoPremium_${alvo}`
    : `clientePremium_${alvo}`;
}

function premiumPublicoDoPlano(planoId) {
  const plano = PLANOS_PREMIUM[planoId];
  return plano ? plano.publico : "";
}

function premiumPublicoAtual() {
  const tipo = premiumTipoConta();
  if (tipo === "estabelecimento") return "estabelecimento";
  if (tipo === "usuario") return "usuario";
  return "";
}

function premiumPlanoCombinaComConta(planoId) {
  const publicoPlano = premiumPublicoDoPlano(planoId);
  return Boolean(publicoPlano && publicoPlano === premiumPublicoAtual());
}

/*
   O premium é estritamente POR E-MAIL LOGADO.
   Antes existia um atalho por chaves globais (clientePremiumAtivo /
   usuarioPremium) e por migração anônima — mas elas não eram vinculadas
   ao e-mail e sobreviviam ao logout, então um usuário sem premium herdava
   o premium de quem havia logado antes nesse navegador. A única fonte de
   verdade agora é a chave por e-mail (clientePremium_<email> /
   estabelecimentoPremium_<email>).
*/
function premiumAtivoPorPublico(publico) {
  if (!premiumEstaLogado()) return false;

  const email = premiumEmailLogado();
  if (!email) return false;

  return localStorage.getItem(premiumChave(publico, email)) === "true";
}

function sincronizarPremiumContaAtual() {
  const publico = premiumPublicoAtual();
  return publico ? premiumAtivoPorPublico(publico) : false;
}

/* O estabelecimento logado tem premium ativo? (admin sempre tem) */
function estabelecimentoTemPremium() {
  return premiumEhAdmin() || premiumAtivoPorPublico("estabelecimento");
}

/* O usuário comum logado tem premium ativo? (admin sempre tem) */
function usuarioTemPremium() {
  return premiumEhAdmin() || premiumAtivoPorPublico("usuario");
}

/* Tem premium considerando o tipo de conta atual. */
function temPremiumAtivo() {
  if (premiumEhAdmin()) return true;
  const publico = premiumPublicoAtual();
  if (publico === "estabelecimento") return estabelecimentoTemPremium();
  if (publico === "usuario") return usuarioTemPremium();
  return false;
}

/* ---------------------------------------------------------
   ACESSO A RECURSOS PREMIUM POR PÁGINA
   Centraliza a regra usada nas páginas: precisa estar logado
   e ser do público certo com premium ativo — ou ser admin.
--------------------------------------------------------- */
function podeAcessarRecursoUsuario() {
  if (!premiumEstaLogado()) return false;
  if (premiumEhAdmin()) return true;
  return premiumPublicoAtual() === "usuario" && usuarioTemPremium();
}

function podeAcessarRecursoEstabelecimento() {
  if (!premiumEstaLogado()) return false;
  if (premiumEhAdmin()) return true;
  return premiumPublicoAtual() === "estabelecimento" && estabelecimentoTemPremium();
}

/* ---------------------------------------------------------
   ATIVAR / CANCELAR (simulação de pagamento confirmado)
--------------------------------------------------------- */
function ativarPremium(planoId) {
  const plano = PLANOS_PREMIUM[planoId];
  if (!plano) return false;
  if (!premiumEstaLogado() || !premiumPlanoCombinaComConta(planoId)) return false;

  const email = premiumEmailLogado();
  if (!email) return false;
  localStorage.setItem(premiumChave(plano.publico, email), "true");

  localStorage.setItem("premiumPlanoAtual", plano.id);
  localStorage.setItem("premiumPublicoAtual", plano.publico);
  localStorage.setItem("premiumEmailAtivacao", email);
  localStorage.setItem("premiumDataAtivacao", new Date().toISOString());
  return true;
}

function cancelarPremium(publico) {
  const alvo = publico || premiumTipoConta();
  const email = premiumEmailLogado();
  localStorage.removeItem(premiumChave(alvo, email));

  // Limpa também as chaves globais legadas, caso tenham ficado de versões antigas.
  localStorage.removeItem("usuarioPremium");
  localStorage.removeItem("clientePremiumAtivo");
  localStorage.removeItem("premiumPlanoAtual");
  localStorage.removeItem("premiumPublicoAtual");
  localStorage.removeItem("premiumEmailAtivacao");
  localStorage.removeItem("premiumDataAtivacao");
}

/* Limite de lugares salvos no plano gratuito do usuário. */
const LIMITE_SALVOS_GRATIS = 5;

/* Pode adicionar mais um favorito? (estabelecimento e premium são ilimitados) */
function podeAdicionarSalvo(qtdAtual) {
  if (premiumTipoConta() === "estabelecimento") return true;
  if (usuarioTemPremium()) return true;
  return qtdAtual < LIMITE_SALVOS_GRATIS;
}

/* Aviso flutuante com convite para assinar o Premium. */
function premiumAvisoLimite() {
  if (document.getElementById("premium-aviso-limite")) return;

  const banner = document.createElement("div");
  banner.id = "premium-aviso-limite";
  banner.style.cssText =
    "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);" +
    "background:#1f2937;color:#fff;padding:16px 20px;border-radius:14px;" +
    "box-shadow:0 12px 30px rgba(0,0,0,.25);z-index:9999;max-width:340px;" +
    "text-align:center;font-family:Inter,Arial,sans-serif;";
  banner.innerHTML =
    `<div style="font-weight:800;margin-bottom:8px;">Limite de ${LIMITE_SALVOS_GRATIS} favoritos atingido</div>` +
    `<div style="font-size:.9rem;opacity:.85;margin-bottom:12px;">Assine o Save Date Plus para salvar lugares ilimitados.</div>` +
    `<a href="premium.html" style="display:inline-block;background:#f4a261;color:#fff;` +
    `font-weight:900;text-decoration:none;padding:10px 16px;border-radius:10px;">Ver Premium</a>`;
  document.body.appendChild(banner);

  setTimeout(() => banner.remove(), 6000);
}

/* Disponibiliza no escopo global. */
if (typeof window !== "undefined") {
  window.PLANOS_PREMIUM = PLANOS_PREMIUM;
  window.LIMITE_SALVOS_GRATIS = LIMITE_SALVOS_GRATIS;
  window.premiumEmailLogado = premiumEmailLogado;
  window.premiumTipoConta = premiumTipoConta;
  window.premiumEstaLogado = premiumEstaLogado;
  window.premiumEhAdmin = premiumEhAdmin;
  window.premiumPublicoAtual = premiumPublicoAtual;
  window.premiumPlanoCombinaComConta = premiumPlanoCombinaComConta;
  window.sincronizarPremiumContaAtual = sincronizarPremiumContaAtual;
  window.estabelecimentoTemPremium = estabelecimentoTemPremium;
  window.usuarioTemPremium = usuarioTemPremium;
  window.temPremiumAtivo = temPremiumAtivo;
  window.podeAcessarRecursoUsuario = podeAcessarRecursoUsuario;
  window.podeAcessarRecursoEstabelecimento = podeAcessarRecursoEstabelecimento;
  window.ativarPremium = ativarPremium;
  window.cancelarPremium = cancelarPremium;
  window.podeAdicionarSalvo = podeAdicionarSalvo;
  window.premiumAvisoLimite = premiumAvisoLimite;
}
