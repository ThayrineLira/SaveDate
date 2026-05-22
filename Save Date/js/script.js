/* =========================================================
   VERIFICA LOGIN
========================================================= */

function usuarioEstaLogado() {

  return localStorage.getItem(
    "usuarioLogado"
  ) === "true";
}


/* =========================================================
   MOSTRAR NOME DO USUÁRIO
========================================================= */

function carregarUsuario() {

  const nome =
    localStorage.getItem(
      "nomeUsuario"
    );

  const logado =
    localStorage.getItem(
      "usuarioLogado"
    );

  const $nomeUsuario =
    $("#nome-usuario");

  const $dropdownNome =
    $("#dropdown-nome");

  const tipoUsuario =
    localStorage.getItem(
      "usuarioTipo"
    );

  /* =========================================
     USUÁRIO LOGADO
  ========================================= */

  if (
    logado === "true" &&
    nome
  ) {

    const nomeExibicao =
      tipoUsuario === "estabelecimento"
        ? `${nome} (Estabelecimento)`
        : nome;

    $nomeUsuario.text(
      nomeExibicao
    );

    $dropdownNome.text(
      nomeExibicao
    );
  }

  /* =========================================
     NÃO LOGADO
  ========================================= */

  else {

    $nomeUsuario.text(
      "Entrar"
    );
  }
}

let lugaresCarregados =
  [];

const ORCAMENTO_PADRAO =
  120;

function formatarOrcamento(valor) {

  if (valor >= 250) {
    return "R$ 250+";
  }

  return `R$ ${valor}`;
}

function obterOrcamentoSelecionado() {

  const valor =
    parseInt(
      $("#range-orcamento").val(),
      10
    );

  if (Number.isNaN(valor)) {
    return ORCAMENTO_PADRAO;
  }

  return valor;
}

function estimarFaixaPreco(local) {

  if (local && !local.tags && local.cardapio) {
    const itens = [
      ...((local.cardapio || {}).pratos || []),
      ...((local.cardapio || {}).bebidas || [])
    ];

    const valores = itens
      .map(item => {
        const preco = String(item.preco || '').replace(',', '.');
        const numero = parseFloat(preco.replace(/[^\d.]/g, ''));
        return Number.isFinite(numero) ? numero : null;
      })
      .filter(valor => valor !== null);

    if (!valores.length) {
      return {
        media: 0,
        label: 'Consulte o cardapio'
      };
    }

    const menor = Math.min(...valores);
    const maior = Math.max(...valores);
    const media = Math.round(valores.reduce((total, valor) => total + valor, 0) / valores.length);

    return {
      media,
      label: `R$ ${menor.toFixed(2).replace('.', ',')} - R$ ${maior.toFixed(2).replace('.', ',')}`
    };
  }

  const tags =
    local.tags || {};

  if (
    tags.price ||
    tags.price_range
  ) {

    const precoTexto =
      String(
        tags.price || tags.price_range
      );

    const sinais =
      (precoTexto.match(/\$/g) || []).length;

    if (sinais) {
      const media =
        sinais * 60;

      return {
        media,
        label: `R$ ${Math.max(20, media - 30)} - R$ ${media + 40}`
      };
    }
  }

  if (tags.leisure === "park") {
    return {
      media: 0,
      label: "R$ 0 - R$ 30"
    };
  }

  if (tags.shop === "mall") {
    return {
      media: 60,
      label: "R$ 30 - R$ 90"
    };
  }

  if (tags.amenity === "bar") {
    return {
      media: 80,
      label: "R$ 40 - R$ 120"
    };
  }

  if (tags.amenity === "restaurant") {
    return {
      media: 120,
      label: "R$ 60 - R$ 180"
    };
  }

  if (tags.amenity === "nightclub") {
    return {
      media: 160,
      label: "R$ 80 - R$ 250"
    };
  }

  return {
    media: 90,
    label: "R$ 40 - R$ 140"
  };
}

function filtrarPorOrcamento(lugares) {

  const orcamento =
    obterOrcamentoSelecionado();

  return lugares.filter(local => {

    const preco =
      estimarFaixaPreco(local);

    return preco.media <= orcamento;
  }).sort((a, b) => {

    return estimarFaixaPreco(a).media -
      estimarFaixaPreco(b).media;
  });
}

function atualizarResumoOrcamento(total, exibidos) {

  const orcamento =
    obterOrcamentoSelecionado();

  $("#valor-orcamento").text(
    `At\u00e9 ${formatarOrcamento(orcamento)}`
  );

  $(".chip-orcamento").removeClass(
    "ativo"
  );

  $(`.chip-orcamento[data-orcamento="${orcamento}"]`).addClass(
    "ativo"
  );

  if (!total) {
    $("#resultado-orcamento").text(
      "Digite um CEP ou endere\u00e7o para encontrar lugares dentro dessa faixa."
    );
    return;
  }

  $("#resultado-orcamento").text(
    `${exibidos} de ${total} lugares cabem no or\u00e7amento de ${formatarOrcamento(orcamento)}.`
  );
}

function iniciarFiltroOrcamento() {

  const $range =
    $("#range-orcamento");

  if (!$range.length) {
    return;
  }

  atualizarResumoOrcamento(
    0,
    0
  );

  $range.on(
    "input",

    function () {

      atualizarResumoOrcamento(
        lugaresCarregados.length,
        filtrarPorOrcamento(lugaresCarregados).length
      );

      if (lugaresCarregados.length) {
        if (lugaresCarregados[0]?.cardapio) {
          mostrarCardsCatalogo(
            lugaresCarregados,
            lugaresCarregados.length
          );
        } else {
          mostrarCards(
            lugaresCarregados
          );
        }
      }
    }
  );

  $(".chip-orcamento").on(
    "click",

    function () {

      const valor =
        $(this).data(
          "orcamento"
        );

      $range.val(
        valor
      ).trigger(
        "input"
      );
    }
  );
}


/* =========================================================
   MENU DROPDOWN
========================================================= */

function iniciarMenuPerfil() {

  const $burger =
    $(".burger");

  const $nomeUsuario =
    $("#nome-usuario");

  const $dropdown =
    $("#dropdown-menu");

  if (!$burger.length || !$dropdown.length) {
    return;
  }

  $burger.on(
    "click",

    function (e) {

      e.stopPropagation();

      $dropdown.fadeToggle(150);
    }
  );

  if ($nomeUsuario.length) {
    $nomeUsuario.on(
      "click",
      function () {
        if (
          $nomeUsuario.text() ===
            "Entrar"
        ) {
          window.location.href =
            "login.html";
        }
      }
    );
  }

  $(document).on(
    "click",

    function () {

      $dropdown.fadeOut(150);
    }
  );
}


/* =========================================================
   LOGOUT
========================================================= */

function iniciarLogout() {

  const $btn =
    $("#btn-sair");

  if (!$btn.length) {
    return;
  }

  $btn.on(
    "click",

    function (e) {

      e.preventDefault();

      localStorage.removeItem(
        "usuarioLogado"
      );

      localStorage.removeItem(
        "nomeUsuario"
      );

      localStorage.removeItem(
        "usuarioTipo"
      );

      mostrarToast(
        "Você saiu da conta.",
        "aviso"
      );

      setTimeout(() => {

        window.location.reload();

      }, 1000);
    }
  );
}


/* =========================================================
   HIDE BANNER FOR LOGGED USER
========================================================= */

function ocultarSegundoBannerSeLogado() {

  if (!usuarioEstaLogado()) {
    return;
  }

  $("#hero-slide-2").hide();

  $(".slide-container").addClass(
    "slide-static"
  );
}


/* =========================================================
   ESTABELECIMENTO DASHBOARD
========================================================= */

function mostrarPainelEstabelecimento() {

  const tipoUsuario =
    localStorage.getItem(
      "usuarioTipo"
    );

  const homeNormal =
    document.getElementById(
      "home-normal"
    );

  const dashboard =
    document.getElementById(
      "estabelecimento-dashboard"
    );

  if (
    tipoUsuario === "estabelecimento"
  ) {

    if (homeNormal) {
      homeNormal.style.display =
        "none";
    }

    if (dashboard) {
      dashboard.style.display =
        "block";

      const nome =
        localStorage.getItem(
          "nomeUsuario"
        ) ||
        localStorage.getItem(
          "nomeCadastro"
        ) ||
        "Seu estabelecimento";

      const welcomeName =
        dashboard.querySelector(
          ".dashboard-welcome-nome"
        );

      if (welcomeName) {
        welcomeName.textContent =
          nome;
      }
    }

    return;
  }

  if (dashboard) {
    dashboard.style.display =
      "none";
  }

  if (homeNormal) {
    homeNormal.style.display =
      "block";
  }
}


/* =========================================================
   FUNÇÕES DO PAINEL DO ESTABELECIMENTO (CRUD SIMPLES)
========================================================= */

function carregarDadosEstabelecimento() {
  const raw = localStorage.getItem('estabelecimentoDados');

  if (raw) {
    try {
      return JSON.parse(raw);
    } catch (e) {
      return null;
    }
  }

  // valores padrão
  return {
    id: localStorage.getItem('estabelecimentoCadastroEmail') || 'estabelecimento',
    nome: localStorage.getItem('nomeUsuario') || 'Seu estabelecimento',
    endereco: localStorage.getItem('estabelecimentoCadastroEndereco') || '',
    complemento: localStorage.getItem('estabelecimentoCadastroComplemento') || '',
    telefone: localStorage.getItem('estabelecimentoCadastroTelefone') || '',
    email: localStorage.getItem('estabelecimentoCadastroEmail') || '',
    categorias: ['restaurantes'],
    horarios: [],
    cardapio: { pratos: [], bebidas: [] },
    status: 'Ativo',
    avaliacoes: 24,
    visualizacoes: 1300,
    favoritos: 48,
    eventos: [],
    fotos: []
  };
}

function carregarCatalogoEstabelecimentos() {
  const raw = localStorage.getItem('estabelecimentosCatalogo');

  if (!raw) {
    return [];
  }

  try {
    const dados = JSON.parse(raw);
    return Array.isArray(dados) ? dados : [];
  } catch (erro) {
    return [];
  }
}

function salvarCatalogoEstabelecimentos(catalogo) {
  localStorage.setItem('estabelecimentosCatalogo', JSON.stringify(catalogo));
}

function sincronizarCatalogoEstabelecimento(dados) {
  const id = dados.email || localStorage.getItem('estabelecimentoCadastroEmail') || 'estabelecimento';
  const catalogo = carregarCatalogoEstabelecimentos();

  const registro = {
    id,
    nome: dados.nome || localStorage.getItem('estabelecimentoCadastroNome') || 'Seu estabelecimento',
    endereco: dados.endereco || localStorage.getItem('estabelecimentoCadastroEndereco') || '',
    complemento: dados.complemento || localStorage.getItem('estabelecimentoCadastroComplemento') || '',
    telefone: dados.telefone || localStorage.getItem('estabelecimentoCadastroTelefone') || '',
    email: dados.email || localStorage.getItem('estabelecimentoCadastroEmail') || '',
    categorias: dados.categorias || ['restaurantes'],
    horarios: dados.horarios || [],
    cardapio: dados.cardapio || { pratos: [], bebidas: [] },
    fotos: dados.fotos || [],
    status: dados.status || 'Ativo',
    publicado: Boolean((dados.fotos || []).length && ((((dados.cardapio || {}).pratos) || []).length || ((((dados.cardapio || {}).bebidas) || []).length)))
  };

  const indice = catalogo.findIndex(item => item.id === id);

  if (indice >= 0) {
    catalogo[indice] = {
      ...catalogo[indice],
      ...registro
    };
  } else {
    catalogo.push(registro);
  }

  salvarCatalogoEstabelecimentos(catalogo);
}

function salvarDadosEstabelecimento(dados) {
  localStorage.setItem('estabelecimentoDados', JSON.stringify(dados));
  sincronizarCatalogoEstabelecimento(dados);
}

function atualizarResumoDashboard() {
  const dados = carregarDadosEstabelecimento() || {};

  const avaliacoes = document.getElementById('dash-avaliacoes');
  const visualizacoes = document.getElementById('dash-visualizacoes');
  const favoritos = document.getElementById('dash-favoritos');
  const statusText = document.querySelector('.dashboard-status-text');
  const welcomeName = document.querySelector('.dashboard-welcome-nome');

  if (avaliacoes) avaliacoes.textContent = dados.avaliacoes ?? 0;
  if (visualizacoes) visualizacoes.textContent = dados.visualizacoes ?? 0;
  if (favoritos) favoritos.textContent = dados.favoritos ?? 0;
  if (statusText) statusText.textContent = dados.status ?? 'Ativo';
  if (welcomeName) welcomeName.textContent = dados.nome ?? 'Seu estabelecimento';
}

let eventoEditIndex = -1;

function abrirModalEvento(indice = -1) {
  const overlay = document.getElementById('evento-modal-overlay');
  const tituloInput = document.getElementById('evento-titulo');
  const descricaoInput = document.getElementById('evento-descricao');
  const dataInput = document.getElementById('evento-data');
  const modalTitle = document.getElementById('modal-evento-titulo');
  const dados = carregarDadosEstabelecimento();

  if (!overlay || !tituloInput || !descricaoInput || !dataInput || !modalTitle || !dados) {
    return;
  }

  eventoEditIndex = indice;

  if (indice >= 0 && dados.eventos?.[indice]) {
    modalTitle.textContent = 'Editar evento';
    tituloInput.value = dados.eventos[indice].titulo || '';
    descricaoInput.value = dados.eventos[indice].descricao || '';
    dataInput.value = dados.eventos[indice].data || '';
  } else {
    modalTitle.textContent = 'Adicionar evento';
    tituloInput.value = '';
    descricaoInput.value = '';
    dataInput.value = '';
  }

  overlay.style.display = 'flex';
  setTimeout(() => tituloInput.focus(), 100);
}

function fecharModalEvento() {
  const overlay = document.getElementById('evento-modal-overlay');
  if (!overlay) return;
  overlay.style.display = 'none';
  eventoEditIndex = -1;
}

function salvarEvento(e) {
  e.preventDefault();

  const tituloInput = document.getElementById('evento-titulo');
  const descricaoInput = document.getElementById('evento-descricao');
  const dataInput = document.getElementById('evento-data');
  const dados = carregarDadosEstabelecimento();

  if (!tituloInput || !dataInput || !dados) {
    return;
  }

  const titulo = tituloInput.value.trim();
  const descricao = descricaoInput.value.trim();
  const data = dataInput.value.trim();

  if (!titulo || !data) {
    mostrarToast('Preencha título e data.', 'erro');
    return;
  }

  dados.eventos = dados.eventos || [];
  const evento = { titulo, descricao, data };

  if (eventoEditIndex >= 0 && dados.eventos[eventoEditIndex]) {
    dados.eventos[eventoEditIndex] = evento;
    mostrarToast('Evento atualizado.', 'sucesso');
  } else {
    dados.eventos.push(evento);
    mostrarToast('Evento adicionado.', 'sucesso');
  }

  salvarDadosEstabelecimento(dados);
  fecharModalEvento();
  renderizarEventos();
}

let pendingRemoveIndex = -1;

function removerEvento(indice) {
  const dados = carregarDadosEstabelecimento();
  if (!dados?.eventos?.[indice]) {
    return;
  }

  dados.eventos.splice(indice, 1);
  salvarDadosEstabelecimento(dados);
  renderizarEventos();
  mostrarToast('Evento removido.', 'aviso');
}

function abrirConfirmacaoRemocao(indice) {
  const overlay = document.getElementById('confirm-modal-overlay');
  const mensagem = document.getElementById('confirm-message');
  const dados = carregarDadosEstabelecimento();

  if (!overlay || !mensagem || !dados?.eventos?.[indice]) return;

  pendingRemoveIndex = indice;
  mensagem.textContent = `Tem certeza de que deseja remover o evento "${dados.eventos[indice].titulo}"?`;
  overlay.style.display = 'flex';
}

function fecharConfirmacaoRemocao() {
  const overlay = document.getElementById('confirm-modal-overlay');
  if (!overlay) return;

  overlay.style.display = 'none';
  pendingRemoveIndex = -1;
}

function confirmarRemocaoEvento() {
  if (pendingRemoveIndex < 0) {
    fecharConfirmacaoRemocao();
    return;
  }

  removerEvento(pendingRemoveIndex);
  fecharConfirmacaoRemocao();
}

function renderizarEventos() {
  const dashboard = document.getElementById('estabelecimento-dashboard');
  if (!dashboard) return;

  const lista = dashboard.querySelector('.events-list');
  if (!lista) return;

  const dados = carregarDadosEstabelecimento();
  const eventos = dados?.eventos || [];

  lista.innerHTML = '';

  if (!eventos.length) {
    lista.innerHTML = '<li class="event-empty">Nenhum evento cadastrado.</li>';
    return;
  }

  eventos.forEach((ev, idx) => {
    const li = document.createElement('li');

    li.innerHTML = `
      <div>
        <strong>${ev.titulo}</strong>
        <span>${ev.descricao || ''}</span>
      </div>
      <div class="evento-acoes">
        <button type="button" class="btn-editar">Editar</button>
        <button type="button" class="btn-remover">Remover</button>
      </div>
      <span class="event-date">${ev.data || ''}</span>
    `;

    const editar = li.querySelector('.btn-editar');
    const remover = li.querySelector('.btn-remover');

    if (editar) {
      editar.addEventListener('click', () => abrirModalEvento(idx));
    }
    if (remover) {
      remover.addEventListener('click', () => abrirConfirmacaoRemocao(idx));
    }

    lista.appendChild(li);
  });
}

function adicionarEvento() {
  abrirModalEvento(-1);
}

function iniciarDashboardActions() {
  const btnAdicionar = document.querySelector('.dashboard-event-button');
  if (btnAdicionar) btnAdicionar.addEventListener('click', adicionarEvento);

  const dashboard = document.getElementById('estabelecimento-dashboard');
  if (!dashboard) return;

  // Tornar nome clicável/éditavel via modal
  const welcomeName = dashboard.querySelector('.dashboard-welcome-nome');
  if (welcomeName) {
    welcomeName.style.cursor = 'pointer';
    welcomeName.title = 'Clique para editar nome';
    welcomeName.addEventListener('click', abrirModalNome);
  }

  // Toggle status ao clicar
  const statusText = dashboard.querySelector('.dashboard-status-text');
  if (statusText) {
    statusText.style.cursor = 'pointer';
    statusText.title = 'Clique para alternar status';
    statusText.addEventListener('click', function () {
      const dados = carregarDadosEstabelecimento();
      dados.status = (dados.status === 'Ativo') ? 'Inativo' : 'Ativo';
      salvarDadosEstabelecimento(dados);
      statusText.textContent = dados.status;
      mostrarToast('Status atualizado.', 'sucesso');
      atualizarResumoDashboard();
    });
  }

  atualizarResumoDashboard();
  renderizarEventos();
}


/* =========================================================
   AÇÕES RÁPIDAS DO DASHBOARD
========================================================= */

function handleQuickAction(action) {
  const actionLower = (action || '').toLowerCase();

  switch (actionLower) {
    case 'adicionar fotos':
      abrirModalFotos();
      break;

    case 'categorias':
      abrirModalCategorias();
      break;

    case 'pratos':
      abrirModalCardapio('prato');
      break;

    case 'bebidas':
      abrirModalCardapio('bebida', 'Água, Cerveja, Refrigerante');
      break;

    case 'horário':
      abrirModalHorario();
      break;

    case 'configurações':
      mostrarToast('Configurações: edite nome clicando no nome, altere status clicando no status.', 'sucesso');
      break;

    default:
      mostrarToast('Ação não reconhecida.', 'erro');
  }
}

/* =========================================================
   MODAIS DE AÇÕES RÁPIDAS
========================================================= */

function abrirModalFotos() {
  const overlay = document.getElementById('fotos-modal-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    document.getElementById('foto-arquivo').focus();
  }
}

function fecharModalFotos() {
  const overlay = document.getElementById('fotos-modal-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    document.getElementById('form-fotos').reset();
  }
}

function abrirModalCategorias() {
  const overlay = document.getElementById('categorias-modal-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    document.getElementById('categoria-nome').focus();
  }
}

function fecharModalCategorias() {
  const overlay = document.getElementById('categorias-modal-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    document.getElementById('form-categorias').reset();
  }
}

function abrirModalCardapio(tipo, placeholder = '') {
  const overlay = document.getElementById('cardapio-modal-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    const titulo = document.getElementById('cardapio-modal-titulo');
    const nomeInput = document.getElementById('cardapio-nome');
    
    if (titulo) titulo.textContent = `Adicionar ${tipo}`;
    if (nomeInput) {
      nomeInput.placeholder = placeholder || `Ex: ${tipo === 'prato' ? 'Frango à Parmegiana' : 'Suco Natural'}`;
      nomeInput.focus();
    }
    
    // Guardar tipo no form
    document.getElementById('form-cardapio').dataset.tipo = tipo;
  }
}

function fecharModalCardapio() {
  const overlay = document.getElementById('cardapio-modal-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    document.getElementById('form-cardapio').reset();
  }
}

function abrirModalHorario() {
  const overlay = document.getElementById('horario-modal-overlay');
  if (overlay) {
    overlay.style.display = 'flex';
    document.getElementById('horario-texto').focus();
  }
}

function fecharModalHorario() {
  const overlay = document.getElementById('horario-modal-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    document.getElementById('form-horario').reset();
  }
}

function abrirModalNome() {
  const overlay = document.getElementById('nome-modal-overlay');
  const nomeInput = document.getElementById('nome-input');
  const welcomeName = document.querySelector('.dashboard-welcome-nome');
  
  if (overlay && nomeInput && welcomeName) {
    nomeInput.value = welcomeName.textContent;
    overlay.style.display = 'flex';
    nomeInput.focus();
    nomeInput.select();
  }
}

function fecharModalNome() {
  const overlay = document.getElementById('nome-modal-overlay');
  if (overlay) {
    overlay.style.display = 'none';
    document.getElementById('form-nome').reset();
  }
}

function iniciarAcoesRapidas() {
  const links = document.querySelectorAll('.dashboard-action-link');
  links.forEach(link => {
    link.addEventListener('click', function (e) {
      e.preventDefault();
      const action = (this.textContent || '').trim();
      handleQuickAction(action);
    });
  });
}

function iniciarModalAcoes() {
  // Fechar modais com botão ×
  document.querySelectorAll('.action-close').forEach(btn => {
    btn.addEventListener('click', function (e) {
      e.preventDefault();
      const action = this.dataset.action;
      if (action === 'fotos') fecharModalFotos();
      else if (action === 'categorias') fecharModalCategorias();
      else if (action === 'cardapio') fecharModalCardapio();
      else if (action === 'horario') fecharModalHorario();
      else if (action === 'nome') fecharModalNome();
    });
  });

  // Fechar modais ao clicar fora
  document.querySelectorAll('.modal-overlay').forEach(overlay => {
    if (overlay.id.includes('fotos') || overlay.id.includes('categorias') || 
        overlay.id.includes('cardapio') || overlay.id.includes('horario') || overlay.id.includes('nome')) {
      overlay.addEventListener('click', function (e) {
        if (e.target === overlay) {
          if (overlay.id === 'fotos-modal-overlay') fecharModalFotos();
          else if (overlay.id === 'categorias-modal-overlay') fecharModalCategorias();
          else if (overlay.id === 'cardapio-modal-overlay') fecharModalCardapio();
          else if (overlay.id === 'horario-modal-overlay') fecharModalHorario();
          else if (overlay.id === 'nome-modal-overlay') fecharModalNome();
        }
      });
    }
  });

  // Formulário de Fotos
  const formFotos = document.getElementById('form-fotos');
  if (formFotos) {
    formFotos.addEventListener('submit', function (e) {
      e.preventDefault();
      const arquivo = document.getElementById('foto-arquivo').files[0];
      if (!arquivo) return;

      const reader = new FileReader();
      reader.onload = function (evento) {
        const dados = carregarDadosEstabelecimento();
        dados.fotos = dados.fotos || [];
        dados.fotos.push(evento.target.result);
        salvarDadosEstabelecimento(dados);
        mostrarToast('Foto adicionada.', 'sucesso');
        fecharModalFotos();
      };
      reader.readAsDataURL(arquivo);
    });
  }

  // Formulário de Categorias
  const formCategorias = document.getElementById('form-categorias');
  if (formCategorias) {
    formCategorias.addEventListener('submit', function (e) {
      e.preventDefault();
      const categoria = document.getElementById('categoria-nome').value.trim();
      if (!categoria) return;

      const dados = carregarDadosEstabelecimento();
      dados.categorias = dados.categorias || [];
      dados.categorias.push(categoria);
      salvarDadosEstabelecimento(dados);
      mostrarToast('Categoria adicionada.', 'sucesso');
      fecharModalCategorias();
    });
  }

  // Formulário de Cardápio (Pratos/Bebidas)
  const formCardapio = document.getElementById('form-cardapio');
  if (formCardapio) {
    formCardapio.addEventListener('submit', function (e) {
      e.preventDefault();
      const tipo = this.dataset.tipo || 'prato';
      const nome = document.getElementById('cardapio-nome').value.trim();
      if (!nome) return;

      const descricao = document.getElementById('cardapio-descricao').value.trim() || '';
      const preco = document.getElementById('cardapio-preco').value.trim() || '';

      const dados = carregarDadosEstabelecimento();
      dados.cardapio = dados.cardapio || { pratos: [], bebidas: [] };

      if (tipo === 'prato') {
        dados.cardapio.pratos.push({ nome, descricao, preco });
      } else {
        dados.cardapio.bebidas.push({ nome, descricao, preco });
      }

      salvarDadosEstabelecimento(dados);
      const tipoCapitalizado = tipo.charAt(0).toUpperCase() + tipo.slice(1);
      mostrarToast(`${tipoCapitalizado} adicionado.`, 'sucesso');
      fecharModalCardapio();
    });
  }

  // Formulário de Horário
  const formHorario = document.getElementById('form-horario');
  if (formHorario) {
    formHorario.addEventListener('submit', function (e) {
      e.preventDefault();
      const horario = document.getElementById('horario-texto').value.trim();
      if (!horario) return;

      const dados = carregarDadosEstabelecimento();
      dados.horarios = dados.horarios || [];
      dados.horarios.push(horario);
      salvarDadosEstabelecimento(dados);
      mostrarToast('Horário adicionado.', 'sucesso');
      fecharModalHorario();
    });
  }

  // Formulário de Nome
  const formNome = document.getElementById('form-nome');
  if (formNome) {
    formNome.addEventListener('submit', function (e) {
      e.preventDefault();
      const novoNome = document.getElementById('nome-input').value.trim();
      if (!novoNome) return;

      const dados = carregarDadosEstabelecimento();
      dados.nome = novoNome;
      salvarDadosEstabelecimento(dados);
      
      const welcomeName = document.querySelector('.dashboard-welcome-nome');
      if (welcomeName) {
        welcomeName.textContent = novoNome;
      }
      
      mostrarToast('Nome atualizado.', 'sucesso');
      fecharModalNome();
      atualizarResumoDashboard();
    });
  }
}

function iniciarEventosDashboard() {
  const btnAdicionar = document.querySelector('.dashboard-event-button');
  if (btnAdicionar) {
    btnAdicionar.addEventListener('click', adicionarEvento);
  }

  const fecharBtn = document.getElementById('btn-fechar-evento');
  const cancelarBtn = document.getElementById('btn-cancelar-evento');
  const formEvento = document.getElementById('form-evento');
  const overlay = document.getElementById('evento-modal-overlay');

  if (fecharBtn) {
    fecharBtn.addEventListener('click', fecharModalEvento);
  }
  if (cancelarBtn) {
    cancelarBtn.addEventListener('click', fecharModalEvento);
  }
  if (formEvento) {
    formEvento.addEventListener('submit', salvarEvento);
  }
  if (overlay) {
    overlay.addEventListener('click', function (e) {
      if (e.target === overlay) {
        fecharModalEvento();
      }
    });
  }

  const confirmOverlay = document.getElementById('confirm-modal-overlay');
  const confirmYes = document.getElementById('confirm-yes');
  const confirmNo = document.getElementById('confirm-no');

  if (confirmNo) {
    confirmNo.addEventListener('click', fecharConfirmacaoRemocao);
  }

  if (confirmYes) {
    confirmYes.addEventListener('click', confirmarRemocaoEvento);
  }

  if (confirmOverlay) {
    confirmOverlay.addEventListener('click', function (e) {
      if (e.target === confirmOverlay) {
        fecharConfirmacaoRemocao();
      }
    });
  }
}


/* =========================================================
   TOAST
========================================================= */

function mostrarToast(
  mensagem,
  tipo = "sucesso"
) {

  const container =
    document.getElementById(
      "toast-container"
    );

  if (!container) {
    return;
  }

  const toast =
    document.createElement("div");

  toast.className =
    `toast toast-${tipo}`;

  toast.textContent =
    mensagem;

  container.appendChild(
    toast
  );

  setTimeout(() => {

    toast.classList.add(
      "mostrar"
    );

  }, 100);

  setTimeout(() => {

    toast.classList.remove(
      "mostrar"
    );

    setTimeout(() => {

      toast.remove();

    }, 300);

  }, 3000);
}


/* =========================================================
   VALIDAR CEP
========================================================= */

function ehCep(texto) {

  return /^\d{5}-?\d{3}$/.test(
    texto
  );
}


/* =========================================================
   RESOLVER CEP / ENDEREÇO
========================================================= */

async function resolverEntrada(texto) {

  /* =========================================
     CEP
  ========================================= */

  if (ehCep(texto)) {

    const cep =
      texto.replace(/\D/g, '');

    const viaCep =
      await fetch(
        `https://viacep.com.br/ws/${cep}/json/`
      );

    const dados =
      await viaCep.json();

    if (dados.erro) {

      throw new Error(
        "CEP não encontrado"
      );
    }

    texto =
      `${dados.localidade}, ${dados.uf}`;
  }

  /* =========================================
     COORDENADAS
  ========================================= */

  const url =
    `https://nominatim.openstreetmap.org/search?q=` +
    encodeURIComponent(texto) +
    `&format=json&limit=1&countrycodes=br`;

  const resposta =
    await fetch(url);

  const dados =
    await resposta.json();

  if (!dados.length) {

    throw new Error(
      "Endereço não encontrado"
    );
  }

  return {

    lat: parseFloat(
      dados[0].lat
    ),

    lon: parseFloat(
      dados[0].lon
    )
  };
}


/* =========================================================
   BUSCAR LOCAIS
========================================================= */

async function resolverEntradaPrecisa(texto) {

  const buscarCoordenadas =
    async consulta => {

      const url =
        `https://nominatim.openstreetmap.org/search?q=` +
        encodeURIComponent(consulta) +
        `&format=json&limit=1&countrycodes=br`;

      const resposta =
        await fetch(url);

      if (!resposta.ok) {
        return null;
      }

      const dados =
        await resposta.json();

      if (!dados.length) {
        return null;
      }

      return {

        lat: parseFloat(
          dados[0].lat
        ),

        lon: parseFloat(
          dados[0].lon
        )
      };
    };

  if (!ehCep(texto)) {

    const coords =
      await buscarCoordenadas(
        texto
      );

    if (coords) {
      return coords;
    }

    throw new Error(
      "Endereco nao encontrado"
    );
  }

  const cep =
    texto.replace(
      /\D/g,
      ""
    );

  const viaCep =
    await fetch(
      `https://viacep.com.br/ws/${cep}/json/`
    );

  if (!viaCep.ok) {
    throw new Error(
      "Nao foi possivel consultar esse CEP"
    );
  }

  const dadosCep =
    await viaCep.json();

  if (dadosCep.erro) {

    throw new Error(
      "CEP nao encontrado"
    );
  }

  const consultas =
    [
      [
        dadosCep.logradouro,
        dadosCep.bairro,
        dadosCep.localidade,
        dadosCep.uf,
        "Brasil"
      ].filter(Boolean).join(", "),
      `${dadosCep.bairro || ""}, ${dadosCep.localidade}, ${dadosCep.uf}, Brasil`,
      `${dadosCep.localidade}, ${dadosCep.uf}, Brasil`
    ];

  for (const consulta of consultas) {

    const coords =
      await buscarCoordenadas(
        consulta
      );

    if (coords) {
      return coords;
    }
  }

  throw new Error(
    "Nao encontramos coordenadas para esse CEP"
  );
}

function obterRaioBusca() {

  const valor =
    parseInt(
      $("#range-area-busca").val(),
      10
    );

  if (Number.isNaN(valor)) {
    return 5000;
  }

  return valor * 1000;
}

function iniciarAreaBusca() {

  const $range =
    $("#range-area-busca");

  if (!$range.length) {
    return;
  }

  const atualizarTexto =
    () => {

      $("#valor-area-busca").text(
        `${$range.val()} km`
      );
    };

  atualizarTexto();

  $range.on(
    "input",
    atualizarTexto
  );

  $range.on(
    "change",

    function () {

      if (
        $("#input-local").val().trim()
      ) {
        buscar();
      }
    }
  );
}

function obterImagemFallback(local) {

  const tags =
    local.tags || {};

  if (tags.leisure === "park") {
    return "img/parque.png";
  }

  if (tags.shop === "mall") {
    return "img/shopping.png";
  }

  if (tags.amenity === "bar") {
    return "img/bar.png";
  }

  if (tags.amenity === "restaurant") {
    return "img/restaurante.png";
  }

  if (tags.amenity === "nightclub") {
    return "img/festas.png";
  }

  return "img/logo.png";
}

function obterImagemLocal(local) {

  const tags =
    local.tags || {};

  if (tags.image) {
    return tags.image;
  }

  if (tags.wikimedia_commons) {

    const arquivo =
      tags.wikimedia_commons
        .replace(/^File:/, "");

    return `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(arquivo)}`;
  }

  return obterImagemFallback(
    local
  );
}

function escaparAtributo(valor) {

  return String(valor || "")
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

function obterEnderecoLocal(local) {

  const tags =
    local.tags || {};

  return [
    tags["addr:street"],
    tags["addr:housenumber"],
    tags["addr:suburb"] ||
      tags["addr:neighbourhood"],
    tags["addr:city"]
  ].filter(Boolean).join(", ");
}

function obterResumoLocal(local, tipo, faixaPreco) {

  const tags =
    local.tags || {};

  const partes =
    [];

  if (tags.cuisine) {
    partes.push(
      `Culinaria: ${tags.cuisine.replace(/_/g, " ")}.`
    );
  }

  if (tags.opening_hours) {
    partes.push(
      `Horario informado: ${tags.opening_hours}.`
    );
  }

  if (tags.website) {
    partes.push(
      "Tem site cadastrado para consultar mais detalhes."
    );
  }

  if (!partes.length) {
    partes.push(
      `Opcao da categoria ${tipo.replace(/[^\w\sÀ-ÿ]/g, "").trim() || "local"}, com faixa estimada de ${faixaPreco.label}.`
    );
  }

  return partes.join(" ");
}

function abrirDetalhesLocal(dados) {

  $("#detalhes-local-overlay").remove();

  const endereco =
    dados.endereco ||
    "Endereco detalhado nao informado. Use o mapa para confirmar a rota.";

  const horario =
    dados.horario ||
    "Horario nao informado";

  const contato =
    dados.telefone ||
    dados.site ||
    "Contato nao informado";

  const $overlay =
    $(`
      <div id="detalhes-local-overlay" class="modal-overlay local-modal-overlay">
        <article class="modal local-modal">
          <button type="button" class="modal-close local-modal-close" aria-label="Fechar detalhes">&times;</button>

          <img
            class="local-modal-img"
            src="${escaparAtributo(dados.imagem)}"
            alt="Foto de ${escaparAtributo(dados.nome)}"
            onerror="this.onerror=null;this.src='${escaparAtributo(dados.fallback)}';"
          />

          <div class="local-modal-body">
            <span class="local-modal-tipo">${escaparAtributo(dados.tipo)}</span>
            <h2>${escaparAtributo(dados.nome)}</h2>
            <p class="local-modal-descricao">${escaparAtributo(dados.resumo)}</p>

            <div class="local-modal-info">
              <div>
                <span>Preco estimado</span>
                <strong>${escaparAtributo(dados.preco)}</strong>
              </div>
              <div>
                <span>Endereco</span>
                <strong>${escaparAtributo(endereco)}</strong>
              </div>
              <div>
                <span>Horario</span>
                <strong>${escaparAtributo(horario)}</strong>
              </div>
              <div>
                <span>Contato</span>
                <strong>${escaparAtributo(contato)}</strong>
              </div>
            </div>

            <div class="local-modal-actions">
              <button type="button" class="btn-claro local-modal-close">Voltar</button>
              <a href="${escaparAtributo(dados.maps)}" target="_blank" class="btn-principal">Ver no mapa</a>
            </div>
          </div>
        </article>
      </div>
    `);

  $("body").append(
    $overlay
  );

  $overlay.on(
    "click",

    function (e) {

      if (
        e.target === this ||
        $(e.target).hasClass("local-modal-close")
      ) {
        $overlay.remove();
      }
    }
  );
}

async function buscarLugares(
  lat,
  lon,
  raio = obterRaioBusca()
) {

  const filtros = `

    node[amenity=bar](around:${raio},${lat},${lon});
    way[amenity=bar](around:${raio},${lat},${lon});

    node[amenity=restaurant](around:${raio},${lat},${lon});
    way[amenity=restaurant](around:${raio},${lat},${lon});

    node[leisure=park](around:${raio},${lat},${lon});
    way[leisure=park](around:${raio},${lat},${lon});

    node[shop=mall](around:${raio},${lat},${lon});
    way[shop=mall](around:${raio},${lat},${lon});

    node[amenity=nightclub](around:${raio},${lat},${lon});
    way[amenity=nightclub](around:${raio},${lat},${lon});

  `;

  const query = `

    [out:json];

    (
      ${filtros}
    );

    out center 24;

  `;

  const resposta =
    await fetch(
      "https://overpass-api.de/api/interpreter",
      {
        method: "POST",
        body: query
      }
    );

  const dados =
    await resposta.json();

  return dados.elements || [];
}


/* =========================================================
   MOSTRAR CARDS
========================================================= */

function mostrarCards(lugares) {

  const grade =
    document.getElementById(
      "grade-destaques"
    );

  if (!grade) {
    return;
  }

  const lugaresFiltrados =
    filtrarPorOrcamento(
      lugares
    );

  atualizarResumoOrcamento(
    lugares.length,
    lugaresFiltrados.length
  );

  grade.innerHTML = "";

  /* =========================================
     NENHUM LOCAL
  ========================================= */

  if (!lugares.length) {

    grade.innerHTML = `

      <p class="aviso-vazio">
        Nenhum local encontrado.
      </p>

    `;

    return;
  }

  if (!lugaresFiltrados.length) {

    grade.innerHTML = `

      <p class="aviso-vazio">
        Nenhum local encontrado dentro desse or\u00e7amento. Aumente a barra para ver mais op\u00e7\u00f5es.
      </p>

    `;

    return;
  }

  /* =========================================
     CARDS
  ========================================= */

  lugaresFiltrados.forEach(local => {

    const nome =
      local.tags?.name ||
      "Local";

    let tipo = "";

    if (
      local.tags?.amenity === "bar"
    ) {

      tipo = "🍺 Bar";
    }

    else if (
      local.tags?.amenity === "restaurant"
    ) {

      tipo =
        "🍔 Restaurante";
    }

    else if (
      local.tags?.shop === "mall"
    ) {

      tipo =
        "🛍 Shopping";
    }

    else if (
      local.tags?.leisure === "park"
    ) {

      tipo =
        "🌳 Parque";
    }

    else if (
      local.tags?.amenity === "nightclub"
    ) {

      tipo =
        "🎉 Festa";
    }

    const lat =
      local.lat ||
      local.center?.lat;

    const lon =
      local.lon ||
      local.center?.lon;

    const maps =
      `https://www.google.com/maps?q=${lat},${lon}`;

    const faixaPreco =
      estimarFaixaPreco(
        local
      );

    const imagemLocal =
      obterImagemLocal(
        local
      );

    const imagemFallback =
      obterImagemFallback(
        local
      );

    const resumoLocal =
      obterResumoLocal(
        local,
        tipo,
        faixaPreco
      );

    const enderecoLocal =
      obterEnderecoLocal(
        local
      );

    const card =
      document.createElement(
        "div"
      );

    card.className =
      "card-local";

    /* =========================================
       NÃO LOGADO
    ========================================= */

    if (
      !usuarioEstaLogado()
    ) {

      card.innerHTML = `

        <img
          class="foto-local"
          src="${escaparAtributo(imagemFallback)}"
          alt="Imagem da categoria do local"
        />

        <div class="info-card">

          <h3 class="nome-local">
            🔒 Faça login para ver os locais
          </h3>

          <p class="subtitulo-local">
            Você precisa entrar na sua conta.
          </p>

          <button
            class="btn-principal"
            onclick="window.location.href='login.html'"
          >
            Fazer Login
          </button>

        </div>

      `;

      grade.appendChild(
        card
      );

      return;
    }

    /* =========================================
       CARD NORMAL
    ========================================= */

    card.innerHTML = `

      <img
        class="foto-local"
        src="${escaparAtributo(imagemLocal)}"
        alt="Foto de ${escaparAtributo(nome)}"
        onerror="this.onerror=null;this.src='${escaparAtributo(imagemFallback)}';"
      />

      <div class="info-card">

        <h3 class="nome-local">
          ${escaparAtributo(nome)}
        </h3>

        <p class="subtitulo-local">
          ${tipo}
        </p>

        <p class="preco-local">
          <span>Faixa estimada</span>
          <strong>${faixaPreco.label}</strong>
        </p>

        <p class="descricao-local-card">
          ${escaparAtributo(resumoLocal)}
        </p>

        <button
          type="button"
          class="btn-principal btn-detalhes-local"
        >
          Ver detalhes
        </button>

      </div>

    `;

    card
      .querySelector(
        ".btn-detalhes-local"
      )
      ?.addEventListener(
        "click",

        function () {

          abrirDetalhesLocal({
            nome,
            tipo,
            imagem: imagemLocal,
            fallback: imagemFallback,
            resumo: resumoLocal,
            preco: faixaPreco.label,
            endereco: enderecoLocal,
            horario: local.tags?.opening_hours,
            telefone: local.tags?.phone,
            site: local.tags?.website,
            maps
          });
        }
      );

    grade.appendChild(card);
  });
}

function normalizarTexto(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

function carregarRestaurantesPublicados() {
  return carregarCatalogoEstabelecimentos().filter(item => {
    const categorias = item.categorias || [];
    const temConteudo = Boolean((item.fotos || []).length && ((((item.cardapio || {}).pratos) || []).length || ((((item.cardapio || {}).bebidas) || []).length)));

    return categorias.includes('restaurantes') && (item.status || 'Ativo') !== 'Inativo' && (item.publicado || temConteudo);
  });
}

function filtrarRestaurantesPorBusca(restaurantes, busca) {
  const termo = normalizarTexto(busca);

  if (!termo) {
    return restaurantes;
  }

  return restaurantes.filter(item => {
    const alvo = [
      item.nome,
      item.endereco,
      item.complemento,
      item.telefone,
      ...(item.categorias || []),
      ...(((item.cardapio || {}).pratos) || []).map(prato => `${prato.nome} ${prato.descricao || ''}`)
    ].join(' ');

    return normalizarTexto(alvo).includes(termo);
  });
}

function mostrarCardsCatalogo(restaurantes, totalCatalogo = restaurantes.length) {
  const grade = document.getElementById('grade-destaques');

  if (!grade) {
    return;
  }

  const restaurantesFiltrados = filtrarPorOrcamento(restaurantes);

  atualizarResumoOrcamento(totalCatalogo, restaurantesFiltrados.length);
  grade.innerHTML = '';

  if (!restaurantes.length) {
    grade.innerHTML = `
      <p class="aviso-vazio">
        Nenhum restaurante cadastrado foi publicado ainda.
      </p>
    `;
    return;
  }

  if (!restaurantesFiltrados.length) {
    grade.innerHTML = `
      <p class="aviso-vazio">
        Nenhum restaurante cadastrado cabe nesse orcamento. Ajuste a faixa para ver mais opcoes.
      </p>
    `;
    return;
  }

  restaurantesFiltrados.forEach(local => {
    const nome = local.nome || 'Restaurante';
    const imagemLocal = (local.fotos || [])[0] || 'img/restaurante.png';
    const imagemFallback = 'img/restaurante.png';
    const faixaPreco = estimarFaixaPreco(local);
    const enderecoCompleto = [local.endereco, local.complemento].filter(Boolean).join(', ');
    const resumoLocal = (((local.cardapio || {}).pratos) || [])[0]?.descricao ||
      `Restaurante cadastrado na plataforma com ${(local.fotos || []).length} foto(s) e cardapio proprio.`;
    const maps = `https://www.google.com/maps?q=${encodeURIComponent(enderecoCompleto || nome)}`;
    const card = document.createElement('div');

    card.className = 'card-local';

    card.innerHTML = `
      <img
        class="foto-local"
        src="${escaparAtributo(imagemLocal)}"
        alt="Foto de ${escaparAtributo(nome)}"
        onerror="this.onerror=null;this.src='${escaparAtributo(imagemFallback)}';"
      />

      <div class="info-card">
        <h3 class="nome-local">
          ${escaparAtributo(nome)}
        </h3>

        <p class="subtitulo-local">
          Restaurante cadastrado
        </p>

        <p class="preco-local">
          <span>Faixa do cardapio</span>
          <strong>${faixaPreco.label}</strong>
        </p>

        <p class="descricao-local-card">
          ${escaparAtributo(resumoLocal)}
        </p>

        <button
          type="button"
          class="btn-principal btn-detalhes-local"
        >
          Ver detalhes
        </button>
      </div>
    `;

    card
      .querySelector('.btn-detalhes-local')
      ?.addEventListener('click', function () {
        abrirDetalhesLocal({
          nome,
          tipo: 'Restaurante cadastrado',
          imagem: imagemLocal,
          fallback: imagemFallback,
          resumo: resumoLocal,
          preco: faixaPreco.label,
          endereco: enderecoCompleto,
          horario: (local.horarios || []).join(' | '),
          telefone: local.telefone,
          site: local.email,
          maps
        });
      });

    grade.appendChild(card);
  });
}

function carregarCatalogoHome(busca = '') {
  const catalogo = carregarRestaurantesPublicados();
  const filtrados = filtrarRestaurantesPorBusca(catalogo, busca);

  lugaresCarregados = filtrados;
  mostrarCardsCatalogo(filtrados, filtrados.length);
}


/* =========================================================
   BUSCAR
========================================================= */

async function buscar() {

  const input =
    document.getElementById(
      "input-local"
    );

  const texto =
    input.value.trim();

  if (!texto) {

    mostrarToast(
      "Digite um CEP ou endereço.",
      "erro"
    );

    return;
  }

  try {

    const grade =
      document.getElementById(
        "grade-destaques"
      );

    grade.innerHTML = `

      <div class="card-skeleton"></div>
      <div class="card-skeleton"></div>
      <div class="card-skeleton"></div>

    `;

    const coords =
      await resolverEntradaPrecisa(
        texto
      );

    const lugares =
      await buscarLugares(
        coords.lat,
        coords.lon,
        obterRaioBusca()
      );

    lugaresCarregados =
      lugares;

    mostrarCards(
      lugares
    );

  } catch (erro) {

    lugaresCarregados =
      [];

    atualizarResumoOrcamento(
      0,
      0
    );

    mostrarToast(
      erro.message,
      "erro"
    );

    document.getElementById(
      "grade-destaques"
    ).innerHTML = "";
  }
}

function buscarCatalogoHomeAction() {
  const input =
    document.getElementById(
      "input-local"
    );

  const grade =
    document.getElementById(
      "grade-destaques"
    );

  const texto =
    input?.value.trim() || "";

  if (grade) {
    grade.innerHTML = `

      <div class="card-skeleton"></div>
      <div class="card-skeleton"></div>
      <div class="card-skeleton"></div>

    `;
  }

  carregarCatalogoHome(
    texto
  );
}

buscar = buscarCatalogoHomeAction;


/* =========================================================
   INICIAR
========================================================= */

$(function () {

    carregarUsuario();

    iniciarMenuPerfil();

    iniciarLogout();

    mostrarPainelEstabelecimento();

    ocultarSegundoBannerSeLogado();
    iniciarDashboardActions();
    iniciarAcoesRapidas();
    iniciarModalAcoes();
    iniciarEventosDashboard();
    iniciarFiltroOrcamento();
    sincronizarCatalogoEstabelecimento(
      carregarDadosEstabelecimento()
    );
    $(".area-busca-wrapper").hide();
    $("#input-local").attr(
      "placeholder",
      "Digite nome, bairro ou endereco do restaurante"
    );
    $("#mensagem-destaque").text(
      "Veja restaurantes cadastrados pela plataforma e filtre por orcamento."
    );
    $("#resultado-orcamento").text(
      "Digite nome, bairro ou endereco para encontrar restaurantes cadastrados nessa faixa."
    );
    carregarCatalogoHome();

    /* =========================================
       BOTÃO BUSCAR
    ========================================= */

    $("#btn-buscar-local").on(
      "click",
      buscarCatalogoHomeAction
    );

    /* =========================================
       ENTER
    ========================================= */

    $("#input-local").on(
      "keydown",

      function (e) {

        if (
          e.key === "Enter"
        ) {

          buscarCatalogoHomeAction();
        }
      }
    );
});
