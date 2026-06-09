/* =========================================================
   AUTH-VISUAL.JS
   Carrossel automático da coluna ilustrada das telas de
   autenticação (login / cadastro). Alterna os slides e os
   dots a cada 5s; clicar num dot troca o slide. Respeita a
   preferência de reduzir animações.
========================================================= */
(function () {
  function iniciar() {
    var slides = Array.prototype.slice.call(document.querySelectorAll(".visual-slide"));
    var dots = Array.prototype.slice.call(document.querySelectorAll(".visual-dots span"));

    if (slides.length < 2) return;

    var atual = 0;
    var timer = null;
    var animacaoReduzida =
      document.documentElement.getAttribute("data-anim") === "reduzido" ||
      (window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);

    function mostrar(indice) {
      atual = (indice + slides.length) % slides.length;
      slides.forEach(function (slide, i) {
        slide.classList.toggle("ativo", i === atual);
      });
      dots.forEach(function (dot, i) {
        dot.classList.toggle("ativo", i === atual);
      });
    }

    function reiniciarTimer() {
      if (timer) clearInterval(timer);
      if (animacaoReduzida) return;
      timer = setInterval(function () {
        mostrar(atual + 1);
      }, 5000);
    }

    dots.forEach(function (dot, i) {
      dot.style.cursor = "pointer";
      dot.setAttribute("role", "button");
      dot.setAttribute("aria-label", "Ver slide " + (i + 1));
      dot.addEventListener("click", function () {
        mostrar(i);
        reiniciarTimer();
      });
    });

    mostrar(0);
    reiniciarTimer();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciar);
  } else {
    iniciar();
  }
})();
