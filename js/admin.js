function lerJSON(chave, fallback) {
  try {
    const valor = JSON.parse(localStorage.getItem(chave) || JSON.stringify(fallback));
    return Array.isArray(fallback) && !Array.isArray(valor) ? fallback : valor;
  } catch (erro) {
    return fallback;
  }
}

function salvarJSON(chave, valor) {
  localStorage.setItem(chave, JSON.stringify(valor));
}

function protegerAdmin() {
  const logado = localStorage.getItem("usuarioLogado") === "true";
  const tipo = (localStorage.getItem("usuarioTipo") || "").toLowerCase();

  if (!logado || tipo !== "admin") {
    localStorage.setItem("adminDestinoPendente", "admin.html");
    window.location.href = "login.html";
    return false;
  }

  return true;
}

function escaparHTML(texto) {
  return String(texto == null ? "" : texto)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function mostrarToast(mensagem) {
  const toast = document.getElementById("admin-toast");
  if (!toast) return;

  toast.textContent = mensagem;
  toast.classList.add("ativo");
  clearTimeout(mostrarToast.timer);
  mostrarToast.timer = setTimeout(() => toast.classList.remove("ativo"), 2400);
}

function obterDadosAdmin() {
  return {
    usuarios: lerJSON("cadastrosUsuarios", []),
    estabelecimentos: lerJSON("cadastrosEstabelecimentos", []),
    catalogo: lerJSON("estabelecimentosCatalogo", [])
  };
}

function contarPremiumAtivos() {
  const clientes = new Set();
  const estabelecimentos = new Set();

  for (let i = 0; i < localStorage.length; i += 1) {
    const chave = localStorage.key(i) || "";
    const valor = localStorage.getItem(chave);
    if (valor !== "true") continue;

    if (chave.startsWith("clientePremium_")) {
      clientes.add(chave.replace("clientePremium_", ""));
    }

    if (chave.startsWith("estabelecimentoPremium_")) {
      estabelecimentos.add(chave.replace("estabelecimentoPremium_", ""));
    }
  }

  // O premium é contado pelas chaves por e-mail (clientePremium_<email> /
  // estabelecimentoPremium_<email>) já varridas acima. As chaves globais
  // legadas não são mais usadas para não contar uma conta sem premium.

  const clientesQtd = clientes.size;
  const estabelecimentosQtd = estabelecimentos.size;
  const receitaClientes = clientesQtd * 9.9;
  const receitaEstabelecimentos = estabelecimentosQtd * 50;
  const receitaMensal = receitaClientes + receitaEstabelecimentos;
  const totalPremium = clientesQtd + estabelecimentosQtd;

  return {
    clientesQtd,
    estabelecimentosQtd,
    totalPremium,
    receitaMensal,
    receitaAnual: receitaMensal * 12,
    ticketMedio: totalPremium ? receitaMensal / totalPremium : 0
  };
}

function formatarMoeda(valor) {
  return `R$ ${Number(valor || 0).toFixed(2).replace(".", ",")}`;
}

function statusEstabelecimento(estabelecimento, catalogo) {
  const email = (estabelecimento.email || "").toLowerCase();
  const item = catalogo.find((registro) => {
    const id = String(registro.id || "").toLowerCase();
    const regEmail = String(registro.email || "").toLowerCase();
    return id === email || regEmail === email;
  });

  return (item && item.status) || estabelecimento.status || "Ativo";
}

function renderizarAdmin() {
  const { usuarios, estabelecimentos, catalogo } = obterDadosAdmin();
  const premium = contarPremiumAtivos();
  const usuariosComuns = usuarios.filter((usuario) => (usuario.tipo || "usuario") !== "admin");

  document.getElementById("kpi-usuarios").textContent = usuariosComuns.length;
  document.getElementById("kpi-estabelecimentos").textContent = estabelecimentos.length;
  document.getElementById("kpi-catalogo").textContent = catalogo.length;
  document.getElementById("kpi-premium").textContent = premium.totalPremium;
  document.getElementById("kpi-receita-mensal").textContent = formatarMoeda(premium.receitaMensal);
  document.getElementById("kpi-receita-anual").textContent = formatarMoeda(premium.receitaAnual);

  document.getElementById("financeiro-clientes-premium").textContent = premium.clientesQtd;
  document.getElementById("financeiro-estabelecimentos-premium").textContent = premium.estabelecimentosQtd;
  document.getElementById("financeiro-ticket-medio").textContent = formatarMoeda(premium.ticketMedio);
  document.getElementById("financeiro-mrr").textContent = formatarMoeda(premium.receitaMensal);

  renderizarUsuarios(usuarios);
  renderizarEstabelecimentos(estabelecimentos, catalogo);
}

function renderizarUsuarios(usuarios) {
  const tbody = document.getElementById("tabela-usuarios");
  if (!tbody) return;

  if (!usuarios.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-row">Nenhum usuario cadastrado.</td></tr>';
    return;
  }

  tbody.innerHTML = usuarios
    .map((usuario) => {
      const email = usuario.email || "";
      const adminProtegido = String(email).toLowerCase() === "admin@savedate.com";
      return `
        <tr>
          <td>${escaparHTML(usuario.nome || "Sem nome")}</td>
          <td>${escaparHTML(email)}</td>
          <td>${escaparHTML(usuario.tipo || "usuario")}</td>
          <td>
            <div class="acoes">
              ${
                adminProtegido
                  ? '<span class="status-pill">Protegido</span>'
                  : `<button type="button" class="btn-acao perigo" data-admin-acao="remover-usuario" data-email="${escaparHTML(email)}">Remover</button>`
              }
            </div>
          </td>
        </tr>`;
    })
    .join("");
}

function renderizarEstabelecimentos(estabelecimentos, catalogo) {
  const tbody = document.getElementById("tabela-estabelecimentos");
  if (!tbody) return;

  if (!estabelecimentos.length) {
    tbody.innerHTML = '<tr><td colspan="4" class="empty-row">Nenhum estabelecimento cadastrado.</td></tr>';
    return;
  }

  tbody.innerHTML = estabelecimentos
    .map((estabelecimento) => {
      const email = estabelecimento.email || "";
      const status = statusEstabelecimento(estabelecimento, catalogo);
      const inativo = status === "Inativo";

      return `
        <tr>
          <td>${escaparHTML(estabelecimento.nome || "Sem nome")}</td>
          <td>${escaparHTML(email)}</td>
          <td><span class="status-pill ${inativo ? "inativo" : ""}">${escaparHTML(status)}</span></td>
          <td>
            <div class="acoes">
              <button type="button" class="btn-acao" data-admin-acao="toggle-estabelecimento" data-email="${escaparHTML(email)}">${inativo ? "Ativar" : "Inativar"}</button>
              <button type="button" class="btn-acao perigo" data-admin-acao="remover-estabelecimento" data-email="${escaparHTML(email)}">Remover</button>
            </div>
          </td>
        </tr>`;
    })
    .join("");
}

function removerUsuario(email) {
  const alvo = String(email || "").toLowerCase();
  if (alvo === "admin@savedate.com") {
    mostrarToast("A conta admin principal nao pode ser removida.");
    return;
  }

  const usuarios = lerJSON("cadastrosUsuarios", []).filter(
    (usuario) => String(usuario.email || "").toLowerCase() !== alvo
  );

  salvarJSON("cadastrosUsuarios", usuarios);
  mostrarToast("Usuario removido.");
  renderizarAdmin();
}

function removerEstabelecimento(email) {
  const alvo = String(email || "").toLowerCase();
  const estabelecimentos = lerJSON("cadastrosEstabelecimentos", []).filter(
    (item) => String(item.email || "").toLowerCase() !== alvo
  );
  const catalogo = lerJSON("estabelecimentosCatalogo", []).filter((item) => {
    const id = String(item.id || "").toLowerCase();
    const regEmail = String(item.email || "").toLowerCase();
    return id !== alvo && regEmail !== alvo;
  });

  salvarJSON("cadastrosEstabelecimentos", estabelecimentos);
  salvarJSON("estabelecimentosCatalogo", catalogo);
  mostrarToast("Estabelecimento removido do cadastro e do catalogo.");
  renderizarAdmin();
}

function alternarStatusEstabelecimento(email) {
  const alvo = String(email || "").toLowerCase();
  const estabelecimentos = lerJSON("cadastrosEstabelecimentos", []);
  const catalogo = lerJSON("estabelecimentosCatalogo", []);

  let novoStatus = "Inativo";

  estabelecimentos.forEach((item) => {
    if (String(item.email || "").toLowerCase() === alvo) {
      novoStatus = item.status === "Inativo" ? "Ativo" : "Inativo";
      item.status = novoStatus;
    }
  });

  catalogo.forEach((item) => {
    const id = String(item.id || "").toLowerCase();
    const regEmail = String(item.email || "").toLowerCase();
    if (id === alvo || regEmail === alvo) {
      item.status = novoStatus;
    }
  });

  salvarJSON("cadastrosEstabelecimentos", estabelecimentos);
  salvarJSON("estabelecimentosCatalogo", catalogo);
  mostrarToast(`Estabelecimento ${novoStatus.toLowerCase()}.`);
  renderizarAdmin();
}

function iniciarEventosAdmin() {
  document.addEventListener("click", (event) => {
    const botao = event.target.closest("[data-admin-acao]");
    if (!botao) return;

    const acao = botao.dataset.adminAcao;
    const email = botao.dataset.email;

    if (acao === "remover-usuario") removerUsuario(email);
    if (acao === "remover-estabelecimento") removerEstabelecimento(email);
    if (acao === "toggle-estabelecimento") alternarStatusEstabelecimento(email);
  });

  document.getElementById("btn-admin-atualizar")?.addEventListener("click", renderizarAdmin);

  document.getElementById("btn-admin-sair")?.addEventListener("click", () => {
    localStorage.removeItem("usuarioLogado");
    localStorage.removeItem("usuarioTipo");
    localStorage.removeItem("nomeUsuario");
    localStorage.removeItem("usuarioLogadoEmail");
    window.location.href = "home.html";
  });
}

document.addEventListener("DOMContentLoaded", () => {
  if (!protegerAdmin()) return;
  iniciarEventosAdmin();
  renderizarAdmin();
});
