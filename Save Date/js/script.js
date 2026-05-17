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