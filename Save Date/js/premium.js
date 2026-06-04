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
function premiumEmailLogado() {
  return (
    localStorage.getItem("usuarioLogadoEmail") ||
    localStorage.getItem("estabelecimentoCadastroEmail") ||
    localStorage.getItem("email") ||
    ""
  ).toLowerCase();
}

function premiumTipoConta() {
  return (localStorage.getItem("usuarioTipo") || "usuario").toLowerCase();
}

function premiumEstaLogado() {
  return localStorage.getItem("usuarioLogado") === "true";
}

/* Chave de armazenamento por público + e-mail. */
function premiumChave(publico, email) {
  const alvo = email || premiumEmailLogado() || "anonimo";
  return publico === "estabelecimento"
    ? `estabelecimentoPremium_${alvo}`
    : `clientePremium_${alvo}`;
}

/* O estabelecimento logado tem premium ativo? */
function estabelecimentoTemPremium() {
  const email = premiumEmailLogado();
  return (
    localStorage.getItem("usuarioPremium") === "true" ||
    (email && localStorage.getItem(`estabelecimentoPremium_${email}`) === "true")
  );
}

/* O usuário comum logado tem premium ativo? */
function usuarioTemPremium() {
  const email = premiumEmailLogado();
  return (
    localStorage.getItem("clientePremiumAtivo") === "true" ||
    (email && localStorage.getItem(`clientePremium_${email}`) === "true")
  );
}

/* Tem premium considerando o tipo de conta atual. */
function temPremiumAtivo() {
  return premiumTipoConta() === "estabelecimento"
    ? estabelecimentoTemPremium()
    : usuarioTemPremium();
}

/* ---------------------------------------------------------
   ATIVAR / CANCELAR (simulação de pagamento confirmado)
--------------------------------------------------------- */
function ativarPremium(planoId) {
  const plano = PLANOS_PREMIUM[planoId];
  if (!plano) return false;

  const email = premiumEmailLogado();
  localStorage.setItem(premiumChave(plano.publico, email), "true");

  if (plano.publico === "estabelecimento") {
    localStorage.setItem("usuarioPremium", "true");
  } else {
    localStorage.setItem("clientePremiumAtivo", "true");
  }

  localStorage.setItem("premiumPlanoAtual", plano.id);
  localStorage.setItem("premiumDataAtivacao", new Date().toISOString());
  return true;
}

function cancelarPremium(publico) {
  const alvo = publico || premiumTipoConta();
  const email = premiumEmailLogado();
  localStorage.removeItem(premiumChave(alvo, email));

  if (alvo === "estabelecimento") {
    localStorage.removeItem("usuarioPremium");
  } else {
    localStorage.removeItem("clientePremiumAtivo");
  }
  localStorage.removeItem("premiumPlanoAtual");
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
  window.estabelecimentoTemPremium = estabelecimentoTemPremium;
  window.usuarioTemPremium = usuarioTemPremium;
  window.temPremiumAtivo = temPremiumAtivo;
  window.ativarPremium = ativarPremium;
  window.cancelarPremium = cancelarPremium;
  window.podeAdicionarSalvo = podeAdicionarSalvo;
  window.premiumAvisoLimite = premiumAvisoLimite;
}
