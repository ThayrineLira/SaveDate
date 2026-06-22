/* =========================================
   AUTH.JS
   Controle de login do Save Date
========================================= */


/* =========================================
   VERIFICAR SE ESTÁ LOGADO
========================================= */

function estaLogado() {

  return localStorage.getItem("usuarioLogado") === "true";

}

/* =========================================
   PROTEGER ROTAS INTERNAS
========================================= */

function protegerRotaAtual() {
  const paginaAtual = window.location.pathname
    .split("/")
    .pop()
    .toLowerCase();

  // A home e publica. As paginas de autenticacao e institucionais nao
  // carregam este arquivo; as demais que o carregam exigem uma conta.
  if (paginaAtual === "home.html" || estaLogado()) {
    return true;
  }

  window.location.replace("login.html");
  return false;
}

protegerRotaAtual();

function mostrarMensagem(texto, tipo = 'erro') {
  if (typeof mostrarToast === 'function') {
    mostrarToast(texto, tipo);
    return;
  }

  let container = document.getElementById('auth-toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'auth-toast-container';
    container.style.position = 'fixed';
    container.style.left = '50%';
    container.style.bottom = '20px';
    container.style.transform = 'translateX(-50%)';
    container.style.zIndex = '9999';
    container.style.display = 'flex';
    container.style.flexDirection = 'column';
    container.style.alignItems = 'center';
    container.style.gap = '10px';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.textContent = texto;
  toast.style.background = tipo === 'sucesso' ? '#2e7d32' : '#d32f2f';
  toast.style.color = '#fff';
  toast.style.padding = '12px 18px';
  toast.style.borderRadius = '16px';
  toast.style.boxShadow = '0 10px 25px rgba(0,0,0,0.18)';
  toast.style.maxWidth = '320px';
  toast.style.textAlign = 'center';
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3200);
}


/* =========================================
   PROTEGER PÁGINA
========================================= */

function protegerPagina(destino = null) {
  // Se NÃO estiver logado, redireciona para login
  if (!estaLogado()) {
    window.location.href = "login.html";
    return false;
  }

  // Se estiver logado e foi passado destino, navega
  if (destino) {
    window.location.href = destino;
  }

  return true;
}


/* =========================================
   ACESSAR FUNÇÃO/PÁGINA
========================================= */

function verificarLogin(destino = null) {

  // Usuário NÃO logado
  if (!estaLogado()) {

    mostrarMensagem("Faça login para continuar.", "erro");

    setTimeout(() => {

      window.location.href = "login.html";

    }, 500);

    return false;
  }

  // Se passou destino
  if (destino) {

    window.location.href = destino;

  }

  return true;
}


/* =========================================
   LOGIN
========================================= */

function fazerLogin(nomeUsuario = "Usuário") {

  localStorage.setItem(
    "usuarioLogado",
    "true"
  );

  localStorage.setItem(
    "nomeUsuario",
    nomeUsuario
  );

}


/* =========================================
   PROTEGER FUNCIONALIDADE (Requer Login)
========================================= */

function protegerFuncionalidade(callback = null) {
  // Se NÃO estiver logado, mostra mensagem e redireciona
  if (!estaLogado()) {
    mostrarMensagem("Faça login para acessar essa funcionalidade.", "erro");
    
    setTimeout(() => {
      window.location.href = "login.html";
    }, 1500);
    
    return false;
  }

  // Se estiver logado e existe callback, executa
  if (typeof callback === 'function') {
    callback();
  }

  return true;
}


/* =========================================
   LOGOUT
========================================= */

function sairLogin() {

  localStorage.removeItem(
    "usuarioLogado"
  );

  localStorage.removeItem(
    "nomeUsuario"
  );

  localStorage.removeItem(
    "usuarioTipo"
  );

  localStorage.removeItem(
    "usuarioLogadoEmail"
  );

  localStorage.removeItem(
    "estabelecimentoCadastroEmail"
  );

  localStorage.removeItem(
    "estabelecimentoCadastroSenha"
  );

  localStorage.removeItem(
    "estabelecimentoCadastroNome"
  );

  localStorage.removeItem(
    "estabelecimentoCadastroEndereco"
  );

  localStorage.removeItem(
    "estabelecimentoCadastroComplemento"
  );

  localStorage.removeItem(
    "estabelecimentoCadastroTelefone"
  );

  localStorage.removeItem(
    "estabelecimentoDados"
  );

  /* Remove as chaves globais legadas de premium. Elas não eram vinculadas
     ao e-mail e vazavam o premium de uma conta para a próxima que logasse
     neste navegador. As assinaturas reais ficam por e-mail
     (clientePremium_<email> / estabelecimentoPremium_<email>) e são
     reconhecidas normalmente no próximo login. */
  localStorage.removeItem("clientePremiumAtivo");
  localStorage.removeItem("usuarioPremium");

  window.location.href = "home.html";

}
