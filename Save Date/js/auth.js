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
   PROTEGER PÁGINA
========================================= */

function protegerPagina() {

  // Se NÃO estiver logado
  if (!estaLogado()) {

    // Redireciona para login
    window.location.href = "login.html";

  }

}


/* =========================================
   ACESSAR FUNÇÃO/PÁGINA
========================================= */

function verificarLogin(destino = null) {

  // Usuário NÃO logado
  if (!estaLogado()) {

    alert("Faça login para continuar.");

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
    "usuarioNome",
    nomeUsuario
  );

}


/* =========================================
   LOGOUT
========================================= */

function sairLogin() {

  localStorage.removeItem(
    "usuarioLogado"
  );

  localStorage.removeItem(
    "usuarioNome"
  );

  localStorage.removeItem(
    "usuarioTipo"
  );

  window.location.href = "home.html";

}