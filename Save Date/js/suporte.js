(function () {
  const form = document.getElementById("form-suporte");
  const statusEl = document.getElementById("status-suporte");

  function limparErros() {
    form.querySelectorAll(".erro-campo").forEach((item) => {
      item.textContent = "";
    });

    form.querySelectorAll("[aria-invalid='true']").forEach((campo) => {
      campo.removeAttribute("aria-invalid");
    });
  }

  function marcarErro(campo, mensagem) {
    const erro = document.getElementById(`${campo.id}-erro`);
    campo.setAttribute("aria-invalid", "true");
    if (erro) erro.textContent = mensagem;
  }

  function emailValido(valor) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valor);
  }

  function validar() {
    limparErros();

    const campos = {
      nome: form.elements.nome,
      email: form.elements.email,
      tipo: form.elements.tipo,
      mensagem: form.elements.mensagem
    };

    const dados = {
      nome: campos.nome.value.trim(),
      email: campos.email.value.trim(),
      tipo: campos.tipo.value,
      mensagem: campos.mensagem.value.trim()
    };

    let valido = true;

    if (dados.nome.length < 2) {
      marcarErro(campos.nome, "Informe seu nome.");
      valido = false;
    }

    if (!emailValido(dados.email)) {
      marcarErro(campos.email, "Informe um e-mail v\u00e1lido.");
      valido = false;
    }

    if (!dados.tipo) {
      marcarErro(campos.tipo, "Escolha o assunto.");
      valido = false;
    }

    if (dados.mensagem.length < 20) {
      marcarErro(campos.mensagem, "Descreva o caso com pelo menos 20 caracteres.");
      valido = false;
    }

    return { valido, dados };
  }

  function salvarChamado(dados) {
    const protocolo = `SD-${Date.now().toString().slice(-6)}`;
    let chamados = [];

    try {
      chamados = JSON.parse(localStorage.getItem("saveDateChamadosSuporte") || "[]");
      if (!Array.isArray(chamados)) chamados = [];
    } catch (erro) {
      chamados = [];
    }

    chamados.unshift({
      protocolo,
      ...dados,
      criadoEm: new Date().toISOString()
    });

    localStorage.setItem("saveDateChamadosSuporte", JSON.stringify(chamados.slice(0, 20)));
    return protocolo;
  }

  function mostrarStatus(tipo, mensagem) {
    statusEl.className = `status-inline ativo ${tipo}`;
    statusEl.textContent = mensagem;
  }

  form?.addEventListener("submit", (event) => {
    event.preventDefault();

    const botao = form.querySelector("button[type='submit']");
    const resultado = validar();

    if (!resultado.valido) {
      mostrarStatus("erro", "Revise os campos marcados antes de enviar.");
      window.SaveDateUI?.toast("Revise os campos do formulario.", "erro");
      return;
    }

    window.SaveDateUI?.botaoCarregando(botao, true, "Enviando...");

    window.setTimeout(() => {
      const protocolo = salvarChamado(resultado.dados);
      form.reset();
      limparErros();
      window.SaveDateUI?.botaoCarregando(botao, false);
      mostrarStatus("sucesso", `Chamado recebido. Protocolo ${protocolo}.`);
      window.SaveDateUI?.toast("Chamado registrado com sucesso.", "sucesso");
    }, 650);
  });
})();
