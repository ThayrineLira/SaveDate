/* =========================================================
   HOME-DESTAQUES.JS
   Renderiza os destaques da home unindo:
   - o catálogo base (js/dados.js)
   - os restaurantes cadastrados (localStorage: estabelecimentosCatalogo)
   Sobrescreve os renderizadores antigos do script.js para
   que a home nunca fique vazia e o filtro de orçamento/busca
   funcione com os dados reais.
========================================================= */

(function () {

  function orcamentoAtual() {
    const v = parseInt(document.getElementById('range-orcamento')?.value, 10);
    return Number.isNaN(v) ? 250 : v;
  }

  function rotuloOrcamento(orc) {
    return orc >= 250 ? 'R$ 250+' : 'R$ ' + orc;
  }

  function rotuloPreco(preco) {
    return preco === 0 ? 'Grátis' : 'R$ ' + preco;
  }

  function normaliza(texto) {
    return (texto || '')
      .toString()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '');
  }

  // ----- Catálogo base (dados.js) -----
  function itensCatalogo() {
    return (window.lugaresData || []).map((l) => ({
      id: l.id,
      nome: l.nome,
      tipo: l.categoria,
      imagem: l.imagem || 'img/optimized/logo.png',
      preco: Number(l.preco) || 0,
      precoLabel: rotuloPreco(Number(l.preco) || 0),
      resumo: l.descricao || '',
      local: l.localizacao || '',
      patrocinado: l.patrocinado === true,
      origem: 'catalogo'
    }));
  }

  // ----- Restaurantes cadastrados (localStorage) -----
  function itensCadastrados() {
    const catalogo = (typeof carregarCatalogoEstabelecimentos === 'function')
      ? carregarCatalogoEstabelecimentos()
      : [];

    return catalogo
      .filter((it) => (it.status || 'Ativo') !== 'Inativo')
      .map((it) => {
        const faixa = (typeof estimarFaixaPreco === 'function')
          ? estimarFaixaPreco(it)
          : { media: 0, label: '' };
        const endereco = [it.endereco, it.complemento].filter(Boolean).join(', ');
        const resumo =
          it.descricao ||
          ((((it.cardapio || {}).pratos) || [])[0] || {}).descricao ||
          'Restaurante cadastrado na plataforma.';

        return {
          id: it.id,
          nome: it.nome || 'Restaurante',
          tipo: 'Restaurante cadastrado',
          imagem: (it.fotos || [])[0] || 'img/optimized/restaurante.png',
          preco: faixa.media || 0,
          precoLabel: faixa.label || rotuloPreco(faixa.media || 0),
          resumo: resumo,
          local: endereco,
          endereco: endereco,
          telefone: it.telefone,
          email: it.email,
          horarios: it.horarios || [],
          patrocinado: (typeof ehPatrocinado === 'function') ? ehPatrocinado(it) : false,
          origem: 'cadastro'
        };
      });
  }

  function montarCard(item) {
    const card = document.createElement('div');
    card.className = 'card-local' + (item.patrocinado ? ' patrocinado' : '');
    const seloPatrocinado = item.patrocinado
      ? '<span class="selo-patrocinado">★ Patrocinado</span>'
      : '';
    card.innerHTML = `
      <div class="foto-wrapper">
        ${seloPatrocinado}
        <img
          class="foto-local"
          src="${escaparAtributo(item.imagem)}"
          alt="Foto de ${escaparAtributo(item.nome)}"
          onerror="this.onerror=null;this.src='img/optimized/logo.png';"
        />
      </div>
      <div class="info-card">
        <h3 class="nome-local">${escaparAtributo(item.nome)}</h3>
        <p class="subtitulo-local">
          ${escaparAtributo(item.tipo)}${item.local ? ' · ' + escaparAtributo(item.local) : ''}
        </p>
        <p class="preco-local">
          <span>Preço estimado</span>
          <strong>${escaparAtributo(item.precoLabel)}</strong>
        </p>
        <p class="descricao-local-card">${escaparAtributo(item.resumo)}</p>
        <button type="button" class="btn-principal btn-detalhes-local">Ver detalhes</button>
      </div>
    `;

    card.querySelector('.btn-detalhes-local').addEventListener('click', function () {
      // Verificar se está logado
      if (!estaLogado()) {
        protegerFuncionalidade();
        return;
      }
      
      if (item.origem === 'catalogo') {
        window.location.href = 'detalhes.html?id=' + item.id;
        return;
      }
      const maps = 'https://www.google.com/maps?q=' + encodeURIComponent(item.endereco || item.nome);
      abrirDetalhesLocal({
        nome: item.nome,
        tipo: item.tipo,
        imagem: item.imagem,
        fallback: 'img/optimized/restaurante.png',
        resumo: item.resumo,
        preco: item.precoLabel,
        endereco: item.endereco,
        horario: (item.horarios || []).join(' | '),
        telefone: item.telefone,
        site: item.email,
        maps: maps
      });
    });

    return card;
  }

  function renderHomeDestaques(busca) {
    const grade = document.getElementById('grade-destaques');
    if (!grade) return;

    const termo = normaliza(busca);
    const orc = orcamentoAtual();

    // Cadastrados primeiro (dão destaque a quem anuncia), depois o catálogo.
    let itens = [...itensCadastrados(), ...itensCatalogo()];
    const total = itens.length;

    itens = itens.filter((i) => i.preco <= orc);

    if (termo) {
      itens = itens.filter((i) =>
        normaliza(`${i.nome} ${i.tipo} ${i.local} ${i.resumo}`).includes(termo));
    }

    // Patrocinados aparecem primeiro (mantém a ordem relativa do restante).
    itens.sort((a, b) => (b.patrocinado === true) - (a.patrocinado === true));

    grade.innerHTML = '';
    if (!itens.length) {
      grade.innerHTML =
        '<p class="aviso-vazio">Nenhum lugar encontrado para esse filtro. Tente aumentar o orçamento.</p>';
    } else {
      itens.forEach((i) => grade.appendChild(montarCard(i)));
    }

    const resumo = document.getElementById('resultado-orcamento');
    if (resumo) {
      resumo.textContent = itens.length
        ? `${itens.length} de ${total} lugares cabem no orçamento de ${rotuloOrcamento(orc)}.`
        : 'Nenhum lugar nesse orçamento. Aumente a faixa para ver mais opções.';
    }

    const valor = document.getElementById('valor-orcamento');
    if (valor) valor.textContent = 'Até ' + rotuloOrcamento(orc);

    const titulo = document.getElementById('titulo-destaques');
    if (titulo) titulo.textContent = 'Lugares em destaque';

    const msg = document.getElementById('mensagem-destaque');
    if (msg) msg.textContent = '';
  }

  // Sobrescreve os renderizadores antigos do script.js.
  window.carregarCatalogoHome = function (busca) {
    renderHomeDestaques(busca || '');
  };
  window.mostrarCards = function () {
    renderHomeDestaques(document.getElementById('input-local')?.value || '');
  };
  window.mostrarCardsCatalogo = function () {
    renderHomeDestaques(document.getElementById('input-local')?.value || '');
  };
  window.renderHomeDestaques = renderHomeDestaques;

  // Re-renderiza ao mexer no orçamento (depois dos handlers antigos).
  document.addEventListener('DOMContentLoaded', function () {
    const range = document.getElementById('range-orcamento');
    if (range) {
      range.addEventListener('input', function () {
        const busca = document.getElementById('input-local')?.value || '';
        setTimeout(() => renderHomeDestaques(busca), 0);
      });
    }
  });

})();
