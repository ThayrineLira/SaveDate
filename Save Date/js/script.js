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

  const nomeUsuario =
    document.getElementById(
      "nome-usuario"
    );

  const dropdownNome =
    document.getElementById(
      "dropdown-nome"
    );

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

    if (nomeUsuario) {

      nomeUsuario.textContent =
        nomeExibicao;
    }

    if (dropdownNome) {

      dropdownNome.textContent =
        nomeExibicao;
    }
  }

  /* =========================================
     NÃO LOGADO
  ========================================= */

  else {

    if (nomeUsuario) {

      nomeUsuario.textContent =
        "Entrar";
    }
  }
}


/* =========================================================
   MENU DROPDOWN
========================================================= */

function iniciarMenuPerfil() {

  const burger =
    document.querySelector(
      ".burger"
    );

  const nomeUsuario =
    document.getElementById(
      "nome-usuario"
    );

  const dropdown =
    document.getElementById(
      "dropdown-menu"
    );

  if (!burger || !dropdown) {
    return;
  }

  burger.addEventListener(
    "click",

    function (e) {

      e.stopPropagation();

      if (
        dropdown.style.display === "block"
      ) {

        dropdown.style.display =
          "none";
      }

      else {

        dropdown.style.display =
          "block";
      }
    }
  );

  if (nomeUsuario) {
    nomeUsuario.addEventListener(
      "click",
      function () {
        if (
          nomeUsuario.textContent ===
            "Entrar"
        ) {
          window.location.href =
            "login.html";
        }
      }
    );
  }

  document.addEventListener(
    "click",

    function () {

      dropdown.style.display =
        "none";
    }
  );
}


/* =========================================================
   LOGOUT
========================================================= */

function iniciarLogout() {

  const btn =
    document.getElementById(
      "btn-sair"
    );

  if (!btn) {
    return;
  }

  btn.addEventListener(
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

  const slide2 =
    document.getElementById(
      "hero-slide-2"
    );

  if (slide2) {
    slide2.style.display =
      "none";
  }

  const slideContainer =
    document.querySelector(
      ".slide-container"
    );

  if (slideContainer) {
    slideContainer.classList.add(
      "slide-static"
    );
  }
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
    nome: localStorage.getItem('nomeUsuario') || 'Seu estabelecimento',
    status: 'Ativo',
    avaliacoes: 24,
    visualizacoes: 1300,
    favoritos: 48,
    eventos: [],
    fotos: []
  };
}

function salvarDadosEstabelecimento(dados) {
  localStorage.setItem('estabelecimentoDados', JSON.stringify(dados));
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

async function buscarLugares(
  lat,
  lon
) {

  const filtros = `

    node[amenity=bar](around:5000,${lat},${lon});
    way[amenity=bar](around:5000,${lat},${lon});

    node[amenity=restaurant](around:5000,${lat},${lon});
    way[amenity=restaurant](around:5000,${lat},${lon});

    node[leisure=park](around:5000,${lat},${lon});
    way[leisure=park](around:5000,${lat},${lon});

    node[shop=mall](around:5000,${lat},${lon});
    way[shop=mall](around:5000,${lat},${lon});

    node[amenity=nightclub](around:5000,${lat},${lon});
    way[amenity=nightclub](around:5000,${lat},${lon});

  `;

  const query = `

    [out:json];

    (
      ${filtros}
    );

    out center 12;

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

  /* =========================================
     CARDS
  ========================================= */

  lugares.forEach(local => {

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

      <div class="info-card">

        <h3 class="nome-local">
          ${nome}
        </h3>

        <p class="subtitulo-local">
          ${tipo}
        </p>

        <a
          href="${maps}"
          target="_blank"
          class="btn-principal"
        >
          Ver no mapa
        </a>

      </div>

    `;

    grade.appendChild(card);
  });
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
      await resolverEntrada(
        texto
      );

    const lugares =
      await buscarLugares(
        coords.lat,
        coords.lon
      );

    mostrarCards(
      lugares
    );

  } catch (erro) {

    mostrarToast(
      erro.message,
      "erro"
    );

    document.getElementById(
      "grade-destaques"
    ).innerHTML = "";
  }
}


/* =========================================================
   INICIAR
========================================================= */

document.addEventListener(
  "DOMContentLoaded",

  function () {

    carregarUsuario();

    iniciarMenuPerfil();

    iniciarLogout();

    mostrarPainelEstabelecimento();

    ocultarSegundoBannerSeLogado();
    iniciarDashboardActions();
    iniciarAcoesRapidas();
    iniciarModalAcoes();
    iniciarEventosDashboard();

    /* =========================================
       BOTÃO BUSCAR
    ========================================= */

    document
      .getElementById(
        "btn-buscar-local"
      )
      ?.addEventListener(
        "click",
        buscar
      );

    /* =========================================
       ENTER
    ========================================= */

    document
      .getElementById(
        "input-local"
      )
      ?.addEventListener(
        "keydown",

        function (e) {

          if (
            e.key === "Enter"
          ) {

            buscar();
          }
        }
      );
  }
);