/* =========================================================
   TEMA GLOBAL — Save Date
   Aplica o tema (claro/escuro/auto) e a preferência de
   animações/tamanho das letras salvos em localStorage em TODAS as páginas.
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

  function tamanhoFonteSalvo() {
    try {
      return localStorage.getItem("configTamanhoFonte") || "normal";
    } catch (e) {
      return "normal";
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

  function aplicarTamanhoFonte(tamanho) {
    var valor = ["menor", "normal", "maior"].indexOf(tamanho) >= 0 ? tamanho : "normal";

    if (valor === "normal") {
      document.documentElement.removeAttribute("data-fonte");
    } else {
      document.documentElement.setAttribute("data-fonte", valor);
    }
  }

  // Aplica imediatamente (antes da tela pintar)
  aplicarTema(temaSalvo());
  aplicarAnimacoes();
  aplicarTamanhoFonte(tamanhoFonteSalvo());

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
    if (e.key === "configTamanhoFonte") aplicarTamanhoFonte(tamanhoFonteSalvo());
  });

  // Expõe para uso opcional em outras telas
  window.SaveDateTema = { aplicar: aplicarTema, aplicarFonte: aplicarTamanhoFonte };
})();
