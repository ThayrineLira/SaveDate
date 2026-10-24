/* Shared storage helpers for Save Date pages. */
(function () {
  const SALVOS_KEY = "lugaresSalvos";
  const SALVOS_LEGACY_KEY = "lugareSalvos";

  function normalizarIds(valor) {
    if (!Array.isArray(valor)) return [];

    return [...new Set(
      valor
        .map((id) => Number(id))
        .filter((id) => Number.isInteger(id) && id > 0)
    )];
  }

  function lerLista(chave) {
    try {
      const raw = localStorage.getItem(chave);
      if (raw === null) return null;
      return normalizarIds(JSON.parse(raw));
    } catch (erro) {
      return [];
    }
  }

  function salvarSalvos(salvos) {
    const lista = normalizarIds(salvos);
    localStorage.setItem(SALVOS_KEY, JSON.stringify(lista));
    localStorage.removeItem(SALVOS_LEGACY_KEY);
    return lista;
  }

  function obterSalvos() {
    const atuais = lerLista(SALVOS_KEY);
    if (atuais !== null) return atuais;

    const legados = lerLista(SALVOS_LEGACY_KEY) || [];
    if (legados.length) return salvarSalvos(legados);
    return [];
  }

  function limparSalvos() {
    localStorage.removeItem(SALVOS_KEY);
    localStorage.removeItem(SALVOS_LEGACY_KEY);
  }

  function alternarSalvo(id, opcoes) {
    const config = opcoes || {};
    const localId = Number(id);
    const salvos = obterSalvos();
    const index = salvos.indexOf(localId);

    if (!Number.isInteger(localId) || localId <= 0) {
      return { alterado: false, salvo: false, salvos };
    }

    if (index >= 0) {
      salvos.splice(index, 1);
      return { alterado: true, salvo: false, salvos: salvarSalvos(salvos) };
    }

    if (typeof config.podeAdicionar === "function" && !config.podeAdicionar(salvos.length)) {
      if (typeof config.onLimite === "function") config.onLimite();
      return { alterado: false, salvo: false, limite: true, salvos };
    }

    salvos.push(localId);
    return { alterado: true, salvo: true, salvos: salvarSalvos(salvos) };
  }

  window.SaveDateStorage = {
    SALVOS_KEY,
    SALVOS_LEGACY_KEY,
    obterSalvos,
    salvarSalvos,
    limparSalvos,
    alternarSalvo
  };

  window.obterSalvos = obterSalvos;
  window.salvarSalvos = salvarSalvos;
})();
