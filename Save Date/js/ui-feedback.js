(function () {
  function garantirContainer() {
    let container = document.querySelector(".sd-toast-container");
    if (container) return container;

    container = document.createElement("div");
    container.className = "sd-toast-container";
    container.setAttribute("aria-live", "polite");
    container.setAttribute("aria-atomic", "true");
    document.body.appendChild(container);
    return container;
  }

  function toast(mensagem, tipo, duracao) {
    const container = garantirContainer();
    const toastEl = document.createElement("div");
    const tipoFinal = tipo || "info";
    const icones = { info: "i", sucesso: "OK", erro: "!" };

    toastEl.className = `sd-toast sd-toast-${tipoFinal}`;
    toastEl.setAttribute("role", tipoFinal === "erro" ? "alert" : "status");

    const icon = document.createElement("span");
    icon.className = "sd-toast-icon";
    icon.textContent = icones[tipoFinal] || "i";

    const texto = document.createElement("span");
    texto.textContent = mensagem;

    toastEl.appendChild(icon);
    toastEl.appendChild(texto);
    container.appendChild(toastEl);

    requestAnimationFrame(() => toastEl.classList.add("show"));

    window.setTimeout(() => {
      toastEl.classList.remove("show");
      window.setTimeout(() => toastEl.remove(), 260);
    }, duracao || 3600);
  }

  function botaoCarregando(botao, carregando, texto) {
    if (!botao) return;

    if (!botao.dataset.textoOriginal) {
      botao.dataset.textoOriginal = botao.textContent.trim();
    }

    botao.disabled = Boolean(carregando);
    botao.setAttribute("aria-busy", carregando ? "true" : "false");
    botao.textContent = carregando
      ? (texto || "Carregando...")
      : botao.dataset.textoOriginal;
  }

  window.SaveDateUI = {
    toast,
    botaoCarregando
  };

  if (typeof window.mostrarToast !== "function") {
    window.mostrarToast = toast;
  }
})();
