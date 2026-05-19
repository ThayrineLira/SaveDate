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