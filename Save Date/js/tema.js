/* =========================================================
   TEMA GLOBAL — Save Date
   Aplica o tema (claro/escuro/auto) e a preferência de
   animações salvos em localStorage em TODAS as páginas.
   Deve ser carregado no <head>, antes do CSS, para evitar
   o "flash" de tela clara ao abrir a página.
========================================================= */
(function () {
  function temaSalvo() {
    try {
      return localStorage.getItem("configTema") || "auto";
    } catch (e) {
      return "auto";
    }
  }

  function sistemaEscuro() {
    return (
      window.matchMedia &&
      window.matchMedia("(prefers-color-scheme: dark)").matches
    );
  }

  function aplicarTema(tema) {
    var usarEscuro = tema === "escuro" || (tema === "auto" && sistemaEscuro());
    document.documentElement.setAttribute(
      "data-tema",
      usarEscuro ? "escuro" : "claro"
    );
  }

  function aplicarAnimacoes() {
    try {
      if (localStorage.getItem("configReduzirAnimacoes") === "1") {
        document.documentElement.setAttribute("data-anim", "reduzido");
      } else {
        document.documentElement.removeAttribute("data-anim");
      }
    } catch (e) {}
  }

  // Aplica imediatamente (antes da tela pintar)
  aplicarTema(temaSalvo());
  aplicarAnimacoes();

  // Acompanha o tema do sistema quando estiver em "Auto"
  if (window.matchMedia) {
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", function () {
        if (temaSalvo() === "auto") aplicarTema("auto");
      });
  }

  // Reaplica caso o tema seja alterado em outra aba
  window.addEventListener("storage", function (e) {
    if (e.key === "configTema") aplicarTema(temaSalvo());
    if (e.key === "configReduzirAnimacoes") aplicarAnimacoes();
  });

  // Expõe para uso opcional em outras telas
  window.SaveDateTema = { aplicar: aplicarTema };
})();
