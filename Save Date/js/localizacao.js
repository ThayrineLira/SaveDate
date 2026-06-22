// ===== 1. OBTER LOCALIZAÇÃO DO USUÁRIO =====
function obterLocalizacao() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject('Geolocalização não suportada pelo navegador');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (posicao) => {
        resolve({
          latitude: posicao.coords.latitude,
          longitude: posicao.coords.longitude
        });
      },
      (erro) => {
        let mensagem;
        switch (erro.code) {
          case erro.PERMISSION_DENIED:
            mensagem = 'Permissão negada. Ative a localização.';
            break;
          case erro.POSITION_UNAVAILABLE:
            mensagem = 'Não foi possível obter sua localização.';
            break;
          case erro.TIMEOUT:
            mensagem = 'Tempo esgotado.';
            break;
          default:
            mensagem = 'Erro ao obter localização.';
        }
        reject(mensagem);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0
      }
    );
  });
}

// ===== 2. FÓRMULA DE HAVERSINE =====
function toRad(graus) {
  return graus * (Math.PI / 180);
}

function calcularDistancia(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  
  const a = 
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * 
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

// ===== 3. CARREGAR ESTABELECIMENTOS =====
// Usa a fonte única (js/dados.js). Mantém o campo preco_medio
// que o restante deste arquivo espera.
async function carregarEstabelecimentos() {
  const base =
    (typeof window !== 'undefined' && Array.isArray(window.lugaresData))
      ? window.lugaresData
      : [];

  return base
    .filter((lugar) => typeof lugar.lat === 'number' && typeof lugar.lon === 'number')
    .map((lugar) => ({ ...lugar, preco_medio: lugar.preco }));
}

// ===== 4. FILTRAR =====
function filtrarEstabelecimentos(estabelecimentos, latUsuario, lonUsuario, raioKm, orcamentoMax) {
  return estabelecimentos
    .map(est => ({
      ...est,
      distancia: calcularDistancia(latUsuario, lonUsuario, est.lat, est.lon)
    }))
    .filter(est => est.distancia <= raioKm && est.preco_medio <= orcamentoMax)
    .sort((a, b) => a.distancia - b.distancia);
}

// ===== 5. RENDERIZAR CARDS =====
function renderizarCards(estabelecimentos) {
  const grade = document.getElementById('grade-destaques');
  const mensagem = document.getElementById('mensagem-destaque');
  const titulo = document.getElementById('titulo-destaques');
  
  if (!grade) return;
  
  grade.innerHTML = '';
  
  if (estabelecimentos.length === 0) {
    if (mensagem) {
      mensagem.textContent = 'Nenhum estabelecimento encontrado nessa área.';
    }
    return;
  }
  
  if (mensagem) {
    mensagem.textContent = `Encontrado(s) ${estabelecimentos.length} estabelecimento(s).`;
  }
  
  if (titulo) {
    const range = document.getElementById('range-area-busca');
    const kms = range ? range.value : 5;
    titulo.textContent = `Picos em destaque (${kms} km)`;
  }
  
  estabelecimentos.forEach(est => {
    const card = document.createElement('a');
    card.className = 'card-estabelecimento';
    card.href = `detalhes.html?id=${est.id}`;
    card.style.cssText = 'display:block; text-decoration:none; color:inherit; background: white; border-radius: 12px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); margin: 10px 0;';

    const distanciaTexto = est.distancia < 1
      ? Math.round(est.distancia * 1000) + ' m'
      : est.distancia.toFixed(1) + ' km';

    const imagem = est.imagem || '../img/optimized/logo.png';

    card.innerHTML = `
      <img src="${imagem}" alt="${est.nome}" style="width: 100%; height: 150px; object-fit: cover;" onerror="this.onerror=null;this.src='../img/optimized/logo.png';" />
      <div style="padding: 15px;">
        <span style="background: #e3f2fd; color: #1976d2; padding: 4px 10px; border-radius: 20px; font-size: 12px; font-weight: 600;">${est.categoria}</span>
        <h3 style="font-size: 16px; margin: 10px 0 5px;">${est.nome}</h3>
        <p style="color: #666; font-size: 13px;">${est.endereco}</p>
        <div style="display: flex; justify-content: space-between; margin-top: 10px; padding-top: 10px; border-top: 1px solid #eee;">
          <span style="color: #4caf50; font-weight: 600;">📍 ${distanciaTexto}</span>
          <span style="color: #ff9800; font-weight: 600;">${est.preco_medio === 0 ? 'Grátis' : 'R$ ' + est.preco_medio}</span>
        </div>
      </div>
    `;
    grade.appendChild(card);
  });
}

// ===== 6. BUSCA PRINCIPAL =====
async function buscarProximos() {
  const rangeDistancia = document.getElementById('range-area-busca');
  const rangeOrcamento = document.getElementById('range-orcamento');
  const inputLocal = document.getElementById('input-local');
  
  const raioKm = rangeDistancia ? parseInt(rangeDistancia.value) : 5;
  const orcamentoMax = rangeOrcamento ? parseInt(rangeOrcamento.value) : 250;
  
  try {
    // Obter localização do usuário
    const usuario = await obterLocalizacao();
    
    // Salvar no localStorage
    localStorage.setItem('localizacao_usuario', JSON.stringify({
      coordenadas: usuario,
      timestamp: Date.now()
    }));
    
    // Carregar e filtrar estabelecimentos
    const todos = await carregarEstabelecimentos();
    let filtrados = filtrarEstabelecimentos(todos, usuario.latitude, usuario.longitude, raioKm, orcamentoMax);

    // Fallback: se nada cair no raio, mostra os mais próximos dentro do orçamento.
    if (filtrados.length === 0) {
      filtrados = todos
        .map((est) => ({
          ...est,
          distancia: calcularDistancia(usuario.latitude, usuario.longitude, est.lat, est.lon)
        }))
        .filter((est) => est.preco_medio <= orcamentoMax)
        .sort((a, b) => a.distancia - b.distancia)
        .slice(0, 6);

      renderizarCards(filtrados);
      mostrarToast('Nenhum lugar no raio escolhido. Mostrando os mais próximos.', 'info');
      return;
    }

    // Renderizar
    renderizarCards(filtrados);
    mostrarToast('Locais próximos encontrados!', 'sucesso');
    
  } catch (erro) {
    console.error('Erro:', erro);
    mostrarToast(erro, 'erro');
  }
}

// ===== 7. BUSCAR COM CACHE =====
async function buscarComCache() {
  const cacheKey = 'localizacao_usuario';
  const cacheTempo = 5 * 60 * 1000;
  
  const cached = localStorage.getItem(cacheKey);
  let usuario = null;
  
  if (cached) {
    const dados = JSON.parse(cached);
    if (Date.now() - dados.timestamp < cacheTempo) {
      usuario = dados.coordenadas;
    }
  }
  
  if (!usuario) {
    mostrarToast('Clique no botão 📍 para atualizar sua localização', 'info');
    return;
  }
  
  const rangeDistancia = document.getElementById('range-area-busca');
  const rangeOrcamento = document.getElementById('range-orcamento');
  
  const raioKm = rangeDistancia ? parseInt(rangeDistancia.value) : 5;
  const orcamentoMax = rangeOrcamento ? parseInt(rangeOrcamento.value) : 250;
  
  const todos = await carregarEstabelecimentos();
  const filtrados = filtrarEstabelecimentos(todos, usuario.latitude, usuario.longitude, raioKm, orcamentoMax);
  
  renderizarCards(filtrados);
}