/* ================================================
   SAVE DATE — Busca por CEP ou Endereço
   APIs (gratuitas, sem chave):
   • ViaCEP       → CEP → logradouro/cidade
   • Nominatim    → endereço ou CEP → lat/lon
   • Overpass API → lat/lon → lugares reais
   ================================================ */


/* ================================================
   CONFIGURAÇÕES
   ================================================ */
const RAIOS_KM    = [2000, 5000, 10000];  // expande automaticamente se não achar nada
const MAX_CARDS   = 12;                   // máximo de cards exibidos

const TIPOS_OSM = {
  bares:        ['amenity=bar', 'amenity=pub', 'amenity=nightclub'],
  restaurantes: ['amenity=restaurant', 'amenity=fast_food', 'amenity=cafe'],
  parques:      ['leisure=park', 'leisure=garden', 'leisure=nature_reserve'],
  cinema:       ['amenity=cinema'],
  shopping:     ['shop=mall', 'building=mall'],
  festas:       ['amenity=nightclub', 'amenity=events_venue'],
};

let categoriaAtiva    = 'bares';
let coordenadasAtuais = null;  // salva última busca para trocar categoria sem redigitar


/* ================================================
   DETECTAR: É CEP ou endereço?
   ================================================ */
function ehCep(texto) {
  return /^\d{5}-?\d{3}$/.test(texto.trim());
}


/* ================================================
   CEP → COORDENADAS  (ViaCEP + Nominatim)
   ================================================ */
async function cepParaCoordenadas(cep) {
  const cepLimpo = cep.replace(/\D/g, '');

  const resVia = await fetch(`https://viacep.com.br/ws/${cepLimpo}/json/`);
  const dados  = await resVia.json();

  if (dados.erro) throw new Error('CEP não encontrado. Verifique e tente novamente.');

  const partes = [dados.logradouro, dados.bairro, dados.localidade, dados.uf, 'Brasil'];
  const endereco = partes.filter(Boolean).join(', ');

  return await enderecoParaCoordenadas(endereco, dados.localidade, dados.bairro);
}


/* ================================================
   ENDEREÇO LIVRE → COORDENADAS  (Nominatim)
   ================================================ */
async function enderecoParaCoordenadas(endereco, cidade = '', bairro = '') {
  const url =
    `https://nominatim.openstreetmap.org/search` +
    `?q=${encodeURIComponent(endereco)}` +
    `&format=json&limit=1&countrycodes=br`;

  const res  = await fetch(url, { headers: { 'Accept-Language': 'pt-BR' } });
  const geo  = await res.json();

  if (!geo.length) {
    throw new Error(
      'Endereço não encontrado. Tente ser mais específico (ex: "Av. Paulista, São Paulo").'
    );
  }

  return {
    lat:    parseFloat(geo[0].lat),
    lon:    parseFloat(geo[0].lon),
    cidade: cidade || geo[0].display_name.split(',')[2]?.trim() || '',
    bairro: bairro || geo[0].display_name.split(',')[1]?.trim() || '',
    label:  geo[0].display_name,
  };
}


/* ================================================
   ENTRADA UNIFICADA → detecta CEP ou endereço
   ================================================ */
async function resolverEntrada(texto) {
  const t = texto.trim();
  if (!t) throw new Error('Digite um CEP ou endereço para buscar.');

  if (ehCep(t)) {
    return await cepParaCoordenadas(t);
  } else {
    return await enderecoParaCoordenadas(t);
  }
}


/* ================================================
   COORDENADAS + RAIO → LUGARES  (Overpass)
   ================================================ */
async function buscarLugares(lat, lon, categoria, raio) {
  const tipos = TIPOS_OSM[categoria] || TIPOS_OSM['bares'];

  const filtros = tipos
    .map(t => `node[${t}](around:${raio},${lat},${lon});\nway[${t}](around:${raio},${lat},${lon});`)
    .join('\n');

  const query = `[out:json][timeout:25];\n(\n${filtros}\n);\nout center ${MAX_CARDS * 2};`;

  const res   = await fetch('https://overpass-api.de/api/interpreter', {
    method: 'POST',
    body:   query,
  });
  const dados = await res.json();
  return (dados.elements || []).filter(el => el.tags?.name);
}


/* ================================================
   BUSCA COM EXPANSÃO AUTOMÁTICA DE RAIO
   ================================================ */
async function buscarComExpansao(lat, lon, categoria) {
  for (let i = 0; i < RAIOS_KM.length; i++) {
    const raio     = RAIOS_KM[i];
    const lugares  = await buscarLugares(lat, lon, categoria, raio);
    const ultimo   = i === RAIOS_KM.length - 1;

    if (lugares.length > 0 || ultimo) {
      return { lugares, raio, expandido: i > 0 };
    }

    /* Aviso de expansão no meio */
    mostrarAvisoExpansao(raio, RAIOS_KM[i + 1]);
  }
}


/* ================================================
   DISTÂNCIA  (Haversine)
   ================================================ */
function distanciaKm(lat1, lon1, lat2, lon2) {
  const R    = 10000;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a    =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) ** 2;
  return (R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))).toFixed(1);
}


/* ================================================
   AVISO TEMPORÁRIO DE EXPANSÃO
   ================================================ */
function mostrarAvisoExpansao(raioAtual, raioNovo) {
  const grade = document.getElementById('grade-destaques');
  grade.innerHTML = `
    <p class="aviso-expandindo">
      🔍 Nada encontrado em ${raioAtual / 1000} km… ampliando para ${raioNovo / 1000} km
    </p>`;
}


/* ================================================
   GERAR CARDS
   ================================================ */
function gerarCards(lugares, latBase, lonBase, raio, expandido) {
  const grade  = document.getElementById('grade-destaques');
  const titulo = document.getElementById('titulo-destaques');

  grade.innerHTML = '';

  if (!lugares.length) {
    grade.innerHTML = `
      <p class="aviso-vazio">
        😕 Nenhum lugar encontrado mesmo com ${raio / 1000} km de raio.<br>
        Tente outra categoria ou um endereço diferente.
      </p>`;
    return;
  }

  titulo.textContent = 'Picos perto de você';

  if (expandido) {
    const aviso = document.createElement('p');
    aviso.className = 'aviso-raio';
    aviso.textContent = `📍 Resultados ampliados para ${raio / 1000} km — nada mais perto.`;
    grade.before(aviso);
  }

  lugares.slice(0, MAX_CARDS).forEach((lugar) => {
    const tags     = lugar.tags || {};
    const nome     = tags.name;
    const latL     = lugar.lat  ?? lugar.center?.lat;
    const lonL     = lugar.lon  ?? lugar.center?.lon;
    const dist     = latL ? `${distanciaKm(latBase, lonBase, latL, lonL)} km` : '—';
    const telefone = tags.phone             || tags['contact:phone']   || null;
    const site     = tags.website           || tags['contact:website'] || null;
    const horario  = tags.opening_hours     || null;
    const tipo     = tags.cuisine || tags.leisure || tags.amenity || tags.shop || categoriaAtiva;
    const maps     = latL
      ? `https://www.google.com/maps?q=${latL},${lonL}`
      : `https://www.google.com/maps/search/${encodeURIComponent(nome)}`;

    const card = document.createElement('article');
    card.className      = 'card-moderno card-local';
    card.dataset.nome   = nome.toLowerCase();

    card.innerHTML = `
      <div class="capa-card capa-sem-foto">
        <div class="placeholder-foto">📍</div>
        <button class="btn-favoritar">♥️</button>
        <span class="etiqueta etiqueta-preco">${tipo}</span>
      </div>
      <div class="info-card">
        <div class="titulo-rating">
          <h3 class="nome-local">${nome}</h3>
          <span class="nota-avaliacao">★ —</span>
        </div>
        <p class="subtitulo-local">${tipo} • ${dist} de distância</p>
        ${horario  ? `<p class="horario-local">🕐 ${horario}</p>`                          : ''}
        ${telefone ? `<p class="tel-local">📞 <a href="tel:${telefone}">${telefone}</a></p>` : ''}
        <div class="acoes-card">
          <a class="btn-maps" href="${maps}" target="_blank" rel="noopener">Ver no Mapa</a>
          ${site ? `<a class="btn-site" href="${site}" target="_blank" rel="noopener">Site</a>` : ''}
        </div>
      </div>`;

    grade.appendChild(card);
  });
}


/* ================================================
   MOSTRAR SKELETONS
   ================================================ */
function mostrarSkeletons(qtd = 6) {
  const grade = document.getElementById('grade-destaques');
  grade.innerHTML = Array(qtd).fill('<div class="card-skeleton"></div>').join('');

  /* Remove aviso de raio anterior se existir */
  const avisoAnterior = document.querySelector('.aviso-raio');
  if (avisoAnterior) avisoAnterior.remove();
}


/* ================================================
   BUSCA PRINCIPAL — chamada pelo botão ou Enter
   ================================================ */
async function buscarLugaresPorEntrada() {
  const input     = document.getElementById('input-local');
  const btnBuscar = document.getElementById('btn-buscar-local');
  const texto     = input?.value?.trim();

  if (!texto) {
    input?.focus();
    return;
  }

  mostrarSkeletons();
  if (btnBuscar) btnBuscar.disabled = true;

  try {
    const coords = await resolverEntrada(texto);
    coordenadasAtuais = coords;

    const { lugares, raio, expandido } = await buscarComExpansao(
      coords.lat, coords.lon, categoriaAtiva
    );

    gerarCards(lugares, coords.lat, coords.lon, raio, expandido);

  } catch (err) {
    document.getElementById('grade-destaques').innerHTML =
      `<p class="aviso-erro">⚠️ ${err.message}</p>`;
  } finally {
    if (btnBuscar) btnBuscar.disabled = false;
  }
}


/* ================================================
   TROCAR CATEGORIA — reutiliza coordenadas salvas
   ================================================ */
async function trocarCategoria(novaCategoria) {
  categoriaAtiva = novaCategoria;

  document.querySelectorAll('.item-cat').forEach((el) => {
    el.classList.toggle('ativo', el.dataset.categoria === novaCategoria);
  });

  if (!coordenadasAtuais) return;

  mostrarSkeletons(3);

  try {
    const { lugares, raio, expandido } = await buscarComExpansao(
      coordenadasAtuais.lat, coordenadasAtuais.lon, novaCategoria
    );
    gerarCards(lugares, coordenadasAtuais.lat, coordenadasAtuais.lon, raio, expandido);
  } catch {
    document.getElementById('grade-destaques').innerHTML =
      `<p class="aviso-erro">⚠️ Erro ao buscar lugares.</p>`;
  }
}


/* ================================================
   INICIALIZAÇÃO
   ================================================ */
document.addEventListener('DOMContentLoaded', function () {

  /* Injeta campo de busca acima dos destaques */
  const secao = document.getElementById('secao-destaques');
  if (secao) {
    const wrapper = document.createElement('div');
    wrapper.className = 'cep-wrapper';
    wrapper.innerHTML = `
      <div class="cep-box">
        <span class="cep-icone">📍</span>
        <input
          type="text"
          id="input-local"
          class="cep-input"
          placeholder="CEP ou endereço (ex: 22041-001 ou Av. Paulista, SP)"
          autocomplete="off"
        />
        <button id="btn-buscar-local" class="btn-buscar-cep" onclick="buscarLugaresPorEntrada()">
          Buscar
        </button>
      </div>
    `;
    secao.insertBefore(wrapper, secao.querySelector('.cabecalho-secao'));
  }

  /* Máscara automática: se parecer CEP, formata; se não, deixa livre */
  document.addEventListener('input', function (e) {
    if (e.target.id !== 'input-local') return;
    const v = e.target.value.replace(/\D/g, '');
    /* Só aplica máscara se os primeiros chars forem todos dígitos e ≤ 8 */
    if (/^\d+$/.test(e.target.value.replace('-', '')) && v.length <= 8) {
      e.target.value = v.length > 5 ? v.slice(0, 5) + '-' + v.slice(5, 8) : v;
    }
  });

  /* Enter dispara busca */
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target.id === 'input-local') buscarLugaresPorEntrada();
  });

  /* Clique nas categorias */
  document.querySelectorAll('.item-cat').forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault();
      trocarCategoria(el.dataset.categoria);
    });
  });

});
    /* ================================================
       CONFIGURAÇÕES
       ================================================ */
    const RAIOS_BUSCA = [2000, 5000, 10000];
    const MAX_LUGARES = 20;

    const TIPOS_OSM = {
      bares:        ['amenity=bar','amenity=pub','amenity=nightclub'],
      restaurantes: ['amenity=restaurant','amenity=fast_food','amenity=cafe'],
      parques:      ['leisure=park','leisure=garden','leisure=nature_reserve'],
      cinema:       ['amenity=cinema'],
      shopping:     ['shop=mall','building=mall'],
      festas:       ['amenity=nightclub','amenity=events_venue'],
    };

    let categoriaAtiva    = 'bares';
    let coordenadasAtuais = null;
    let marcadores        = [];
    let marcadorUsuario   = null;


    /* ================================================
       INICIALIZA MAPA (centro no Brasil)
       ================================================ */
    const map = L.map('mapa').setView([-15.78, -47.93], 4);

    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      maxZoom: 19,
    }).addTo(map);

    /* Ícone personalizado */
    const iconePin = L.divIcon({
      className: '',
      html: `<div style="
        background:#ff5a5f;color:#fff;font-size:18px;
        width:36px;height:36px;border-radius:50% 50% 50% 0;
        transform:rotate(-45deg);display:flex;align-items:center;
        justify-content:center;box-shadow:0 2px 8px rgba(0,0,0,.25);
        border:2px solid #fff;">
        <span style="transform:rotate(45deg)">📍</span>
      </div>`,
      iconSize:   [36, 36],
      iconAnchor: [18, 36],
      popupAnchor:[0, -36],
    });

    const iconeUsuario = L.divIcon({
      className: '',
      html: `<div style="
        background:#4a90e2;color:#fff;font-size:14px;
        width:32px;height:32px;border-radius:50%;
        display:flex;align-items:center;justify-content:center;
        box-shadow:0 2px 8px rgba(0,0,0,.25);border:3px solid #fff;">
        👤
      </div>`,
      iconSize:   [32, 32],
      iconAnchor: [16, 16],
    });


    /* ================================================
       DETECTAR CEP OU ENDEREÇO
       ================================================ */
    function ehCep(t) { return /^\d{5}-?\d{3}$/.test(t.trim()); }

    async function resolverEntrada(texto) {
      const t = texto.trim();
      if (!t) throw new Error('Digite um CEP ou endereço.');
      return ehCep(t) ? await cepParaCoords(t) : await enderecoParaCoords(t);
    }

    async function cepParaCoords(cep) {
      const limpo = cep.replace(/\D/g,'');
      const r = await fetch(`https://viacep.com.br/ws/${limpo}/json/`);
      const d = await r.json();
      if (d.erro) throw new Error('CEP não encontrado.');
      const end = [d.logradouro,d.bairro,d.localidade,d.uf,'Brasil'].filter(Boolean).join(', ');
      return await enderecoParaCoords(end, d.localidade, d.bairro);
    }

    async function enderecoParaCoords(endereco, cidade='', bairro='') {
      const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(endereco)}&format=json&limit=1&countrycodes=br`;
      const r = await fetch(url, { headers:{'Accept-Language':'pt-BR'} });
      const g = await r.json();
      if (!g.length) throw new Error('Endereço não encontrado. Tente ser mais específico.');
      return {
        lat:    parseFloat(g[0].lat),
        lon:    parseFloat(g[0].lon),
        cidade: cidade || g[0].display_name.split(',')[2]?.trim() || '',
        bairro: bairro || '',
      };
    }


    /* ================================================
       OVERPASS → LUGARES
       ================================================ */
    async function buscarOSM(lat, lon, categoria, raio) {
      const tipos = TIPOS_OSM[categoria] || TIPOS_OSM['bares'];
      const filtros = tipos.map(t =>
        `node[${t}](around:${raio},${lat},${lon});\nway[${t}](around:${raio},${lat},${lon});`
      ).join('\n');
      const query = `[out:json][timeout:25];\n(\n${filtros}\n);\nout center ${MAX_LUGARES * 2};`;
      const r = await fetch('https://overpass-api.de/api/interpreter', { method:'POST', body:query });
      const d = await r.json();
      return (d.elements || []).filter(e => e.tags?.name);
    }

    async function buscarComExpansao(lat, lon, categoria) {
      for (let i = 0; i < RAIOS_BUSCA.length; i++) {
        const raio    = RAIOS_BUSCA[i];
        const lugares = await buscarOSM(lat, lon, categoria, raio);
        if (lugares.length > 0 || i === RAIOS_BUSCA.length - 1) {
          return { lugares, raio, expandido: i > 0 };
        }
        document.getElementById('painel-sub').textContent =
          `Nada em ${raio/1000}km… ampliando para ${RAIOS_BUSCA[i+1]/1000}km`;
      }
    }


    /* ================================================
       DISTÂNCIA
       ================================================ */
    function distKm(la1,lo1,la2,lo2) {
      const R=6371, dLa=((la2-la1)*Math.PI)/180, dLo=((lo2-lo1)*Math.PI)/180;
      const a=Math.sin(dLa/2)**2+Math.cos(la1*Math.PI/180)*Math.cos(la2*Math.PI/180)*Math.sin(dLo/2)**2;
      return (R*2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a))).toFixed(1);
    }


    /* ================================================
       LIMPAR MARCADORES
       ================================================ */
    function limparMarcadores() {
      marcadores.forEach(m => map.removeLayer(m));
      marcadores = [];
    }


    /* ================================================
       RENDERIZAR LUGARES NO MAPA + PAINEL
       ================================================ */
    function renderizarLugares(lugares, lat, lon, raio, expandido) {
      limparMarcadores();

      const lista   = document.getElementById('lista-lugares');
      const titulo  = document.getElementById('painel-titulo');
      const sub     = document.getElementById('painel-sub');

      lista.innerHTML = '';

      if (expandido) {
        const av = document.createElement('p');
        av.className   = 'aviso-raio';
        av.textContent = `📍 Ampliado para ${raio/1000} km — nada mais perto.`;
        lista.appendChild(av);
      }

      titulo.textContent = `${lugares.length} lugar${lugares.length !== 1 ? 'es' : ''} encontrado${lugares.length !== 1 ? 's' : ''}`;
      sub.textContent    = categoriaAtiva.charAt(0).toUpperCase() + categoriaAtiva.slice(1) +
                           (expandido ? ` • raio ${raio/1000} km` : ` • raio ${raio/1000} km`);

      if (!lugares.length) {
        lista.innerHTML += `<div class="estado-vazio"><div class="icone">😕</div>Nenhum lugar encontrado.<br>Tente outra categoria.</div>`;
        return;
      }

      const bounds = [];
      bounds.push([lat, lon]);

      lugares.slice(0, MAX_LUGARES).forEach((lugar, idx) => {
        const tags = lugar.tags || {};
        const nome = tags.name;
        const latL = lugar.lat ?? lugar.center?.lat;
        const lonL = lugar.lon ?? lugar.center?.lon;
        if (!latL || !lonL) return;

        const dist = distKm(lat, lon, latL, lonL);
        const tipo = tags.cuisine || tags.leisure || tags.amenity || tags.shop || categoriaAtiva;
        const tel  = tags.phone || tags['contact:phone'] || null;
        const site = tags.website || tags['contact:website'] || null;
        const maps = `https://www.google.com/maps?q=${latL},${lonL}`;

        bounds.push([latL, lonL]);

        /* MARCADOR */
        const marcador = L.marker([latL, lonL], { icon: iconePin })
          .addTo(map)
          .bindPopup(`
            <div class="popup-save">
              <div class="popup-nome">${nome}</div>
              <div class="popup-tipo">${tipo}</div>
              <div class="popup-nota">★ — &nbsp;<small>${dist} km</small></div>
              ${tel ? `<div style="font-size:.75rem;margin-bottom:.4rem">📞 ${tel}</div>` : ''}
              <a class="popup-btn" href="${maps}" target="_blank" rel="noopener">Ver no Maps</a>
              ${site ? ` &nbsp;<a class="popup-btn" style="background:#555" href="${site}" target="_blank">Site</a>` : ''}
            </div>
          `, { maxWidth: 240 });

        marcadores.push(marcador);

        /* CARD NO PAINEL */
        const card = document.createElement('div');
        card.className    = 'card-lugar';
        card.dataset.idx  = idx;
        card.innerHTML    = `
          <div class="card-lugar-placeholder">📍</div>
          <div class="card-lugar-info">
            <div class="card-lugar-nome">${nome}</div>
            <div class="card-lugar-tipo">${tipo}</div>
            <div class="card-lugar-nota">
              <span class="estrela">★</span>
              <span class="nota-num">—</span>
            </div>
            <div class="card-lugar-dist">${dist} km de distância</div>
          </div>`;

        /* Clique no card → foca marcador */
        card.addEventListener('click', () => {
          document.querySelectorAll('.card-lugar').forEach(c => c.classList.remove('selecionado'));
          card.classList.add('selecionado');
          map.setView([latL, lonL], 17, { animate: true });
          marcador.openPopup();
        });

        lista.appendChild(card);
      });

      /* Ajusta zoom para caber todos os pontos */
      if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [40, 40] });
      }
    }


    /* ================================================
       SKELETONS NO PAINEL
       ================================================ */
    function mostrarSkeletons() {
      const lista = document.getElementById('lista-lugares');
      lista.innerHTML = Array(5).fill('<div class="skeleton-item"></div>').join('');
      document.getElementById('painel-sub').textContent = 'Buscando lugares…';
    }


    /* ================================================
       BUSCA PRINCIPAL
       ================================================ */
    async function buscarNoMapa() {
      const input = document.getElementById('input-local');
      const btn   = document.getElementById('btn-buscar');
      const texto = input?.value?.trim();
      if (!texto) { input?.focus(); return; }

      mostrarSkeletons();
      btn.disabled = true;
      limparMarcadores();

      try {
        const coords = await resolverEntrada(texto);
        coordenadasAtuais = coords;

        /* Marcador do usuário */
        if (marcadorUsuario) map.removeLayer(marcadorUsuario);
        marcadorUsuario = L.marker([coords.lat, coords.lon], { icon: iconeUsuario })
          .addTo(map)
          .bindPopup('<b>Você está aqui</b>')
          .openPopup();

        const { lugares, raio, expandido } = await buscarComExpansao(
          coords.lat, coords.lon, categoriaAtiva
        );

        renderizarLugares(lugares, coords.lat, coords.lon, raio, expandido);

      } catch (err) {
        document.getElementById('lista-lugares').innerHTML =
          `<div class="estado-vazio"><div class="icone">⚠️</div>${err.message}</div>`;
        document.getElementById('painel-sub').textContent = 'Erro na busca';
      } finally {
        btn.disabled = false;
      }
    }


    /* ================================================
       TROCAR CATEGORIA
       ================================================ */
    async function trocarCategoria(nova) {
      categoriaAtiva = nova;

      document.querySelectorAll('.cat-btn').forEach(b => {
        b.classList.toggle('ativo', b.dataset.categoria === nova);
      });

      if (!coordenadasAtuais) return;

      mostrarSkeletons();
      limparMarcadores();

      try {
        const { lugares, raio, expandido } = await buscarComExpansao(
          coordenadasAtuais.lat, coordenadasAtuais.lon, nova
        );
        renderizarLugares(lugares, coordenadasAtuais.lat, coordenadasAtuais.lon, raio, expandido);
      } catch {
        document.getElementById('lista-lugares').innerHTML =
          `<div class="estado-vazio"><div class="icone">⚠️</div>Erro ao buscar lugares.</div>`;
      }
    }


    /* ================================================
       LISTENERS
       ================================================ */
    document.getElementById('categorias').addEventListener('click', e => {
      const btn = e.target.closest('.cat-btn');
      if (btn) trocarCategoria(btn.dataset.categoria);
    });

    document.getElementById('input-local').addEventListener('keydown', e => {
      if (e.key === 'Enter') buscarNoMapa();
    });

    /* Máscara CEP */
    document.getElementById('input-local').addEventListener('input', function () {
      const v = this.value.replace(/\D/g,'');
      if (/^\d+$/.test(this.value.replace('-','')) && v.length <= 8) {
        this.value = v.length > 5 ? v.slice(0,5)+'-'+v.slice(5,8) : v;
      }
    });

    /* Se vier com CEP/endereço na URL (?q=...) busca automaticamente */
    const params = new URLSearchParams(window.location.search);
    if (params.get('q')) {
      document.getElementById('input-local').value = params.get('q');
      buscarNoMapa();
    }