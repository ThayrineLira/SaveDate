/* =========================================================
   DADOS.JS — FONTE ÚNICA DE LUGARES
   Esta é a única lista de lugares do Save Date.
   Todas as páginas (explorar, detalhes, salvos, conta e as
   páginas de categoria) usam este arquivo.
   Para adicionar/editar um lugar, edite SOMENTE aqui.

   OBS: catálogo 100% Rio de Janeiro.
========================================================= */

const lugaresData = [
  {
    id: 1,
    nome: "Garota de Ipanema",
    categoria: "Restaurante",
    patrocinado: true,
    emoji: "🍽️",
    imagem: "img/pagRestaurante.jpeg",
    preco: 95,
    avaliacoes: 4.8,
    countAvaliacao: 567,
    localizacao: "Ipanema, Rio de Janeiro",
    tags: ["Família", "Casal", "Tradição"],
    descricao: "Restaurante histórico onde nasceu a música 'Garota de Ipanema', com cozinha brasileira e chope gelado.",
    endereco: "R. Vinícius de Moraes, 49 - Ipanema, Rio de Janeiro, RJ",
    telefone: "(21) 2522-0340",
    horario: "11h30 - 23h",
    diferenciais: ["Bossa nova", "Cozinha brasileira", "Casa histórica", "Chope gelado"]
  },
  {
    id: 2,
    nome: "Bar Lagoa",
    categoria: "Bar",
    patrocinado: true,
    emoji: "🍺",
    imagem: "img/seuze.jpg",
    preco: 45,
    avaliacoes: 4.6,
    countAvaliacao: 324,
    localizacao: "Lagoa, Rio de Janeiro",
    tags: ["Amigos", "Casal"],
    descricao: "Boteco art déco de 1934 com vista para a Lagoa, famoso pelo chope e pela cozinha alemã.",
    endereco: "Av. Epitácio Pessoa, 1674 - Lagoa, Rio de Janeiro, RJ",
    telefone: "(21) 2523-1135",
    horario: "17h - 02h",
    diferenciais: ["Casa art déco", "Vista da Lagoa", "Cozinha alemã", "Chope tradicional"]
  },
  {
    id: 3,
    nome: "Cervantes",
    categoria: "Lanchonete",
    emoji: "🍔",
    imagem: "img/restaurante.png",
    preco: 35,
    avaliacoes: 4.5,
    countAvaliacao: 412,
    localizacao: "Copacabana, Rio de Janeiro",
    tags: ["Amigos", "Madrugada"],
    descricao: "Lanchonete clássica famosa pelos sanduíches de pernil com abacaxi, aberta madrugada adentro.",
    endereco: "Av. Prado Júnior, 335 - Copacabana, Rio de Janeiro, RJ",
    telefone: "(21) 2275-6147",
    horario: "12h - 04h",
    diferenciais: ["Sanduíche de pernil", "Aberto até tarde", "Tradicional", "Atendimento rápido"]
  },
  {
    id: 4,
    nome: "Pizzaria Guanabara",
    categoria: "Pizzaria",
    emoji: "🍕",
    imagem: "img/pizzariadobairro.jpg",
    preco: 60,
    avaliacoes: 4.7,
    countAvaliacao: 598,
    localizacao: "Leblon, Rio de Janeiro",
    tags: ["Família", "Casal", "Amigos"],
    descricao: "Pizzaria e boteco point do Leblon, com clima animado e movimento até tarde da noite.",
    endereco: "Av. Ataulfo de Paiva, 1228 - Leblon, Rio de Janeiro, RJ",
    telefone: "(21) 2294-0797",
    horario: "12h - 23h",
    diferenciais: ["Point do Leblon", "Clima animado", "Aberto até tarde", "Bom para grupos"]
  },
  {
    id: 5,
    nome: "Curto Café",
    categoria: "Café",
    emoji: "☕",
    imagem: "img/cafeaconchego2.jpg",
    preco: 25,
    avaliacoes: 4.9,
    countAvaliacao: 876,
    localizacao: "Centro, Rio de Janeiro",
    tags: ["Casal", "Café especial"],
    descricao: "Cafeteria autoral no centro histórico, especializada em cafés especiais e método coado.",
    endereco: "Travessa do Comércio, 17 - Centro, Rio de Janeiro, RJ",
    telefone: "(21) 3553-0150",
    horario: "07h - 19h",
    diferenciais: ["Cafés especiais", "Método coado", "Centro histórico", "Ambiente despojado"]
  },
  {
    id: 6,
    nome: "NorteShopping",
    categoria: "Shopping",
    emoji: "🛍️",
    imagem: "img/bangushopping.jpg",
    preco: 0,
    avaliacoes: 4.4,
    countAvaliacao: 1200,
    localizacao: "Cachambi, Rio de Janeiro",
    tags: ["Família", "Amigos"],
    descricao: "Um dos maiores shoppings do Rio, com lojas, cinema, teatro e ampla praça de alimentação.",
    endereco: "Av. Suburbana, 5474 - Cachambi, Rio de Janeiro, RJ",
    telefone: "(21) 2596-1000",
    horario: "10h - 22h",
    diferenciais: ["Múltiplas lojas", "Cinema", "Teatro", "Praça de alimentação"]
  },
  {
    id: 7,
    nome: "Quinta da Boa Vista",
    categoria: "Parque",
    emoji: "🌳",
    imagem: "img/parqueindependencia.jpg",
    preco: 0,
    avaliacoes: 4.6,
    countAvaliacao: 445,
    localizacao: "São Cristóvão, Rio de Janeiro",
    tags: ["Família", "Casal"],
    descricao: "Antigo parque imperial com amplos jardins, lago, museus e espaço para piquenique e caminhada.",
    endereco: "Av. Pedro II - São Cristóvão, Rio de Janeiro, RJ",
    telefone: "(21) 2589-4669",
    horario: "06h - 18h",
    diferenciais: ["Jardins imperiais", "Lago", "Museus", "Piquenique"]
  },
  {
    id: 8,
    nome: "Mil Frutas",
    categoria: "Sorveteria",
    emoji: "🍨",
    imagem: "img/cafeaconchego2.jpg",
    preco: 20,
    avaliacoes: 4.8,
    countAvaliacao: 567,
    localizacao: "Ipanema, Rio de Janeiro",
    tags: ["Amigos", "Família", "Casal"],
    descricao: "Sorveteria carioca famosa pelos sabores de frutas brasileiras como açaí, cupuaçu e jabuticaba.",
    endereco: "R. Garcia D'Ávila, 134 - Ipanema, Rio de Janeiro, RJ",
    telefone: "(21) 2521-1384",
    horario: "12h - 22h",
    diferenciais: ["Frutas brasileiras", "Sabores exóticos", "Artesanal", "Tradicional do Rio"]
  },
  {
    id: 9,
    nome: "Jobi",
    categoria: "Bar",
    emoji: "🍻",
    imagem: "img/beerevibe.jpg",
    preco: 50,
    avaliacoes: 4.5,
    countAvaliacao: 289,
    localizacao: "Leblon, Rio de Janeiro",
    tags: ["Amigos"],
    descricao: "Boteco tradicional do Leblon desde 1956, famoso pelo chope cremoso e pelos petiscos clássicos.",
    endereco: "Av. Ataulfo de Paiva, 1166 - Leblon, Rio de Janeiro, RJ",
    telefone: "(21) 2274-0547",
    horario: "17h - 03h",
    diferenciais: ["Chope cremoso", "Boteco clássico", "Aberto até tarde", "Petiscos"]
  },
  {
    id: 10,
    nome: "Bar Urca",
    categoria: "Bar",
    emoji: "🍸",
    imagem: "img/central.jpg",
    preco: 70,
    avaliacoes: 4.5,
    countAvaliacao: 156,
    localizacao: "Urca, Rio de Janeiro",
    tags: ["Casal", "Vista", "Pôr do sol"],
    descricao: "Bar à beira da mureta da Urca, point para tomar chope vendo o pôr do sol na Baía de Guanabara.",
    endereco: "R. Cândido Gaffrée, 205 - Urca, Rio de Janeiro, RJ",
    telefone: "(21) 2295-8744",
    horario: "11h - 00h",
    diferenciais: ["Vista da baía", "Mureta da Urca", "Pôr do sol", "Petiscos"]
  },
  {
    id: 11,
    nome: "Parque do Flamengo",
    categoria: "Parque",
    emoji: "🧺",
    imagem: "img/piquenique.jpg",
    preco: 30,
    avaliacoes: 4.7,
    countAvaliacao: 98,
    localizacao: "Flamengo, Rio de Janeiro",
    tags: ["Casal", "Econômico", "Ao ar livre"],
    descricao: "Maior parque urbano à beira-mar do Rio, ideal para piquenique, corrida e fim de tarde.",
    endereco: "Av. Infante Dom Henrique - Flamengo, Rio de Janeiro, RJ",
    telefone: "(21) 2265-3000",
    horario: "24h",
    diferenciais: ["Beira-mar", "Piquenique", "Ciclovia", "Fim de tarde"]
  },
  {
    id: 12,
    nome: "Trilha da Pedra Bonita",
    categoria: "Parque",
    emoji: "🥾",
    imagem: "img/trilha.jpg",
    preco: 0,
    avaliacoes: 4.6,
    countAvaliacao: 74,
    localizacao: "São Conrado, Rio de Janeiro",
    tags: ["Amigos", "Natureza", "Grátis"],
    descricao: "Trilha leve com vista panorâmica da praia de São Conrado e rampa de voo livre no topo.",
    endereco: "Estr. da Pedra Bonita - São Conrado, Rio de Janeiro, RJ",
    telefone: "(21) 2491-0000",
    horario: "07h - 17h",
    diferenciais: ["Vista panorâmica", "Trilha leve", "Voo livre", "Grátis"]
  },
  {
    id: 13,
    nome: "Shopping Leblon",
    categoria: "Shopping",
    emoji: "🛍️",
    imagem: "img/shoppingLeblon.png",
    preco: 0,
    avaliacoes: 4.6,
    countAvaliacao: 980,
    localizacao: "Leblon, Rio de Janeiro",
    tags: ["Casal", "Cinema", "Restaurantes"],
    descricao: "Lojas, restaurantes e cinema em um ambiente elegante para passeios mais tranquilos.",
    endereco: "Av. Afrânio de Melo Franco, 290 - Rio de Janeiro, RJ",
    telefone: "(21) 2111-2111",
    horario: "10h - 22h",
    diferenciais: ["Cinema", "Restaurantes", "Lojas premium", "Ambiente elegante"]
  },
  {
    id: 14,
    nome: "Barra Shopping",
    categoria: "Shopping",
    emoji: "🛍️",
    imagem: "img/shoppingBarra.jpg",
    preco: 0,
    avaliacoes: 4.5,
    countAvaliacao: 1340,
    localizacao: "Barra da Tijuca, Rio de Janeiro",
    tags: ["Família", "Amigos", "Compras"],
    descricao: "Shopping amplo com praça de alimentação, cinema e várias opções para família.",
    endereco: "Av. das Américas, 4666 - Rio de Janeiro, RJ",
    telefone: "(21) 2222-2222",
    horario: "10h - 22h",
    diferenciais: ["Praça de alimentação", "Cinema", "Amplo", "Bom para família"]
  },
  {
    id: 15,
    nome: "Fashion Mall",
    categoria: "Shopping",
    emoji: "🛍️",
    imagem: "img/fashionMall.webp",
    preco: 0,
    avaliacoes: 4.7,
    countAvaliacao: 760,
    localizacao: "São Conrado, Rio de Janeiro",
    tags: ["Moda", "Restaurantes", "Conforto"],
    descricao: "Boa escolha para restaurante, lojas e programa mais confortável em ambiente fechado.",
    endereco: "Estr. da Gávea, 899 - Rio de Janeiro, RJ",
    telefone: "(21) 3333-3333",
    horario: "10h - 22h",
    diferenciais: ["Moda", "Restaurantes", "Conforto", "Ambiente fechado"]
  },
  {
    id: 16,
    nome: "Casa de Festas Lapa",
    categoria: "Salão de festas",
    emoji: "🎉",
    imagem: "img/aurora.jpg",
    preco: 180,
    avaliacoes: 4.4,
    countAvaliacao: 64,
    localizacao: "Lapa, Rio de Janeiro",
    tags: ["Grupo", "Evento", "Reserva"],
    descricao: "Espaço para aniversários e confraternizações no coração boêmio da Lapa, com som e bar.",
    endereco: "R. do Lavradio, 100 - Lapa, Rio de Janeiro, RJ",
    telefone: "(21) 2222-4545",
    horario: "Sob reserva",
    diferenciais: ["No coração da Lapa", "Som e iluminação", "Bar incluso", "Reserva flexível"]
  },
  {
    id: 17,
    nome: "Espaço Laranjeiras",
    categoria: "Salão de festas",
    emoji: "🎊",
    imagem: "img/jardim.jpeg",
    preco: 220,
    avaliacoes: 4.6,
    countAvaliacao: 51,
    localizacao: "Laranjeiras, Rio de Janeiro",
    tags: ["Aniversário", "Família", "Área externa"],
    descricao: "Casarão com área externa e jardim para festas pequenas, aniversários e casamentos íntimos.",
    endereco: "R. das Laranjeiras, 500 - Laranjeiras, Rio de Janeiro, RJ",
    telefone: "(21) 2225-4646",
    horario: "Sob reserva",
    diferenciais: ["Área externa", "Jardim", "Casarão", "Festa pequena"]
  },
  {
    id: 18,
    nome: "Rio Scenarium",
    categoria: "Salão de festas",
    emoji: "🎶",
    imagem: "img/dj.jpg",
    preco: 160,
    avaliacoes: 4.3,
    countAvaliacao: 88,
    localizacao: "Lapa, Rio de Janeiro",
    tags: ["Amigos", "Música", "Noite"],
    descricao: "Casa de shows clássica da Lapa, com três andares de decoração antiga, samba e roda animada.",
    endereco: "R. do Lavradio, 20 - Centro, Rio de Janeiro, RJ",
    telefone: "(21) 3147-9000",
    horario: "19h - 04h",
    diferenciais: ["Samba ao vivo", "Decoração antiga", "Três andares", "Clima de festa"]
  },

  /* ---------- LUGARES REAIS (Rio de Janeiro) — parte 1 ---------- */
  {
    id: 19,
    nome: "Adega Pérola",
    categoria: "Bar",
    emoji: "🍺",
    imagem: "img/bar.png",
    preco: 70,
    avaliacoes: 4.4,
    countAvaliacao: 18500,
    localizacao: "Copacabana, Rio de Janeiro",
    tags: ["Amigos", "Petiscos", "Tradição"],
    descricao: "Bar histórico de 1957 famoso pela enorme variedade de petiscos ibéricos expostos no balcão.",
    endereco: "R. Siqueira Campos, 138 - Copacabana, Rio de Janeiro, RJ",
    telefone: "(21) 2255-9425",
    horario: "11h30 - 00h",
    diferenciais: ["Petiscos ibéricos", "Casa histórica", "Balcão farto", "No coração de Copacabana"]
  },
  {
    id: 20,
    nome: "Bracarense",
    categoria: "Bar",
    emoji: "🍸",
    imagem: "img/bardoseuze.jpg",
    preco: 80,
    avaliacoes: 4.6,
    countAvaliacao: 5400,
    localizacao: "Leblon, Rio de Janeiro",
    tags: ["Casal", "Chope", "Boteco"],
    descricao: "Boteco premiado do Leblon famoso pelo chope gelado e pelos bolinhos e empadas caseiras.",
    endereco: "R. José Linhares, 85 - Leblon, Rio de Janeiro, RJ",
    telefone: "(21) 2294-3549",
    horario: "17h30 - 00h",
    diferenciais: ["Chope gelado", "Bolinhos premiados", "Clima de boteco", "Tradicional"]
  },
  {
    id: 21,
    nome: "Pizzaria Capricciosa",
    categoria: "Pizzaria",
    emoji: "🍕",
    imagem: "img/pizzariadobairro.jpg",
    preco: 90,
    avaliacoes: 4.5,
    countAvaliacao: 7200,
    localizacao: "Ipanema, Rio de Janeiro",
    tags: ["Família", "Casal", "Forno a lenha"],
    descricao: "Pizzaria sofisticada de Ipanema com massa fina, ingredientes importados e ambiente charmoso.",
    endereco: "R. Maria Quitéria, 37 - Ipanema, Rio de Janeiro, RJ",
    telefone: "(21) 2523-3394",
    horario: "18h - 00h",
    diferenciais: ["Massa fina", "Ingredientes importados", "Ambiente charmoso", "Bom para grupos"]
  },
  {
    id: 22,
    nome: "Vero Gelato",
    categoria: "Sorveteria",
    emoji: "🍨",
    imagem: "img/cafeaconchego2.jpg",
    preco: 30,
    avaliacoes: 4.7,
    countAvaliacao: 9100,
    localizacao: "Ipanema, Rio de Janeiro",
    tags: ["Casal", "Família", "Gelato"],
    descricao: "Gelateria artesanal de Ipanema com gelato italiano cremoso feito diariamente.",
    endereco: "R. Visconde de Pirajá, 260 - Ipanema, Rio de Janeiro, RJ",
    telefone: "(21) 3497-8754",
    horario: "12h - 23h",
    diferenciais: ["Gelato artesanal", "Sabores italianos", "Feito no dia", "Em Ipanema"]
  },
  {
    id: 23,
    nome: "Floresta da Tijuca",
    categoria: "Parque",
    emoji: "🌳",
    imagem: "img/parque.png",
    preco: 0,
    avaliacoes: 4.8,
    countAvaliacao: 25000,
    localizacao: "Alto da Boa Vista, Rio de Janeiro",
    tags: ["Família", "Ao ar livre", "Grátis"],
    descricao: "Maior floresta urbana do mundo, com trilhas, cachoeiras, mirantes e muita Mata Atlântica.",
    endereco: "Estr. da Cascatinha, 850 - Alto da Boa Vista, Rio de Janeiro, RJ",
    telefone: "(21) 2492-2253",
    horario: "08h - 17h",
    diferenciais: ["Floresta urbana", "Cachoeiras", "Trilhas", "Mirantes"]
  },
  {
    id: 24,
    nome: "Parque do Cantagalo",
    categoria: "Parque",
    emoji: "🚴",
    imagem: "img/trilha.jpg",
    preco: 0,
    avaliacoes: 4.7,
    countAvaliacao: 11000,
    localizacao: "Lagoa, Rio de Janeiro",
    tags: ["Amigos", "Esporte", "Grátis"],
    descricao: "Área de lazer na orla da Lagoa Rodrigo de Freitas, com ciclovia, pedalinhos e quadras esportivas.",
    endereco: "Av. Epitácio Pessoa - Lagoa, Rio de Janeiro, RJ",
    telefone: "(21) 2247-0000",
    horario: "06h - 18h",
    diferenciais: ["Ciclovia", "Pedalinhos", "Quadras", "Orla da Lagoa"]
  },
  {
    id: 25,
    nome: "Shopping Rio Sul",
    categoria: "Shopping",
    emoji: "🛍️",
    imagem: "img/shopping.png",
    preco: 0,
    avaliacoes: 4.6,
    countAvaliacao: 32000,
    localizacao: "Botafogo, Rio de Janeiro",
    tags: ["Compras", "Cinema", "Restaurantes"],
    descricao: "Shopping tradicional de Botafogo com lojas, cinema e fácil acesso ao túnel para Copacabana.",
    endereco: "R. Lauro Müller, 116 - Botafogo, Rio de Janeiro, RJ",
    telefone: "(21) 2122-8070",
    horario: "10h - 22h",
    diferenciais: ["Lojas variadas", "Cinema", "Restaurantes", "Fácil acesso"]
  },
  {
    id: 26,
    nome: "Village Mall",
    categoria: "Shopping",
    emoji: "🛍️",
    imagem: "img/shoppingNovaA.jpg",
    preco: 0,
    avaliacoes: 4.5,
    countAvaliacao: 28000,
    localizacao: "Barra da Tijuca, Rio de Janeiro",
    tags: ["Família", "Cinema", "Compras"],
    descricao: "Shopping premium da Barra com grifes de luxo, teatro, cinema VIP e gastronomia.",
    endereco: "Av. das Américas, 3900 - Barra da Tijuca, Rio de Janeiro, RJ",
    telefone: "(21) 3252-2999",
    horario: "10h - 22h",
    diferenciais: ["Grifes de luxo", "Teatro", "Cinema VIP", "Gastronomia"]
  },

  /* ---------- LUGARES REAIS (Rio de Janeiro) — parte 2 ---------- */
  {
    id: 27,
    nome: "Confeitaria Colombo",
    categoria: "Café",
    emoji: "☕",
    imagem: "img/cafeaconchego2.jpg",
    preco: 70,
    avaliacoes: 4.6,
    countAvaliacao: 21000,
    localizacao: "Centro, Rio de Janeiro",
    tags: ["Casal", "Tradição", "Café da tarde"],
    descricao: "Café histórico de 1894 com arquitetura belle époque, doces clássicos e chá da tarde.",
    endereco: "R. Gonçalves Dias, 32 - Centro, Rio de Janeiro, RJ",
    telefone: "(21) 2505-1500",
    horario: "09h - 19h",
    diferenciais: ["Casa histórica", "Arquitetura belle époque", "Doces clássicos", "Chá da tarde"]
  },
  {
    id: 28,
    nome: "Bar Astor",
    categoria: "Bar",
    emoji: "🍸",
    imagem: "img/central.jpg",
    preco: 90,
    avaliacoes: 4.5,
    countAvaliacao: 6800,
    localizacao: "Ipanema, Rio de Janeiro",
    tags: ["Casal", "Drinks", "Vista"],
    descricao: "Bar charmoso de frente para a praia de Ipanema, com coquetelaria autoral e petiscos.",
    endereco: "Av. Vieira Souto, 110 - Ipanema, Rio de Janeiro, RJ",
    telefone: "(21) 2523-0085",
    horario: "12h - 00h",
    diferenciais: ["Frente para a praia", "Coquetelaria autoral", "Petiscos", "Ambiente charmoso"]
  },
  {
    id: 29,
    nome: "Bar do Mineiro",
    categoria: "Bar",
    emoji: "🍺",
    imagem: "img/seuze.jpg",
    preco: 55,
    avaliacoes: 4.5,
    countAvaliacao: 9300,
    localizacao: "Santa Teresa, Rio de Janeiro",
    tags: ["Amigos", "Feijoada", "Boteco"],
    descricao: "Boteco tradicional de Santa Teresa famoso pela feijoada e pelas fotos em preto e branco.",
    endereco: "R. Paschoal Carlos Magno, 99 - Santa Teresa, Rio de Janeiro, RJ",
    telefone: "(21) 2221-9227",
    horario: "11h - 00h",
    diferenciais: ["Feijoada tradicional", "Clima de boteco", "Cachaças", "No alto de Santa Teresa"]
  },
  {
    id: 30,
    nome: "Aprazível",
    categoria: "Restaurante",
    emoji: "🍽️",
    imagem: "img/pagRestaurante.jpeg",
    preco: 180,
    avaliacoes: 4.6,
    countAvaliacao: 4200,
    localizacao: "Santa Teresa, Rio de Janeiro",
    tags: ["Casal", "Vista", "Especial"],
    descricao: "Restaurante de cozinha brasileira com vista panorâmica da Baía de Guanabara em meio à mata.",
    endereco: "R. Aprazível, 62 - Santa Teresa, Rio de Janeiro, RJ",
    telefone: "(21) 2508-9174",
    horario: "12h - 22h",
    diferenciais: ["Vista panorâmica", "Cozinha brasileira", "Ambiente em meio à mata", "Ideal para casais"]
  },
  {
    id: 31,
    nome: "Parque Lage",
    categoria: "Parque",
    emoji: "🌳",
    imagem: "img/parqueindependencia.jpg",
    preco: 0,
    avaliacoes: 4.8,
    countAvaliacao: 19000,
    localizacao: "Jardim Botânico, Rio de Janeiro",
    tags: ["Família", "Ao ar livre", "Grátis"],
    descricao: "Parque histórico aos pés do Corcovado, com palacete, lago e trilhas em meio à Mata Atlântica.",
    endereco: "R. Jardim Botânico, 414 - Jardim Botânico, Rio de Janeiro, RJ",
    telefone: "(21) 3257-1800",
    horario: "08h - 18h",
    diferenciais: ["Vista do Cristo", "Palacete histórico", "Trilhas", "Gratuito"]
  },
  {
    id: 32,
    nome: "Jardim Botânico do Rio",
    categoria: "Parque",
    emoji: "🌿",
    imagem: "img/piquenique.jpg",
    preco: 35,
    avaliacoes: 4.8,
    countAvaliacao: 33000,
    localizacao: "Jardim Botânico, Rio de Janeiro",
    tags: ["Família", "Natureza", "Casal"],
    descricao: "Jardim de 1808 com mais de 8 mil espécies, aleia de palmeiras imperiais e orquidário.",
    endereco: "R. Jardim Botânico, 1008 - Jardim Botânico, Rio de Janeiro, RJ",
    telefone: "(21) 3874-1808",
    horario: "08h - 17h",
    diferenciais: ["Palmeiras imperiais", "Orquidário", "Lago das vitórias-régias", "Patrimônio natural"]
  },
  {
    id: 33,
    nome: "Belmonte",
    categoria: "Bar",
    emoji: "🍻",
    imagem: "img/beerevibe.jpg",
    preco: 60,
    avaliacoes: 4.4,
    countAvaliacao: 8700,
    localizacao: "Flamengo, Rio de Janeiro",
    tags: ["Amigos", "Chopp", "Boteco"],
    descricao: "Boteco carioca clássico famoso pelo chope gelado, pastéis e empadões generosos.",
    endereco: "Praia do Flamengo, 300 - Flamengo, Rio de Janeiro, RJ",
    telefone: "(21) 2552-3349",
    horario: "11h - 02h",
    diferenciais: ["Chope gelado", "Empadões", "Clima de boteco", "Aberto até tarde"]
  },

  /* ---------- EXEMPLOS — UM POR CATEGORIA (com imagem garantida) ---------- */
  {
    id: 34,
    nome: "Aconchego Carioca",
    categoria: "Restaurante",
    emoji: "🍽️",
    imagem: "img/restaurante.png",
    preco: 90,
    avaliacoes: 4.7,
    countAvaliacao: 15800,
    localizacao: "Praça da Bandeira, Rio de Janeiro",
    tags: ["Família", "Amigos", "Comida brasileira"],
    descricao: "Restaurante premiado de cozinha brasileira, famoso pelo bolinho de feijoada e pela carta de cervejas.",
    endereco: "R. Barão de Iguatemi, 379 - Praça da Bandeira, Rio de Janeiro, RJ",
    telefone: "(21) 2273-1035",
    horario: "12h - 23h",
    diferenciais: ["Bolinho de feijoada", "Cozinha brasileira", "Premiado pela crítica", "Carta de cervejas"]
  },
  {
    id: 35,
    nome: "Bar dos Descasados",
    categoria: "Bar",
    emoji: "🍸",
    imagem: "img/bar.png",
    preco: 110,
    avaliacoes: 4.6,
    countAvaliacao: 3900,
    localizacao: "Santa Teresa, Rio de Janeiro",
    tags: ["Casal", "Drinks", "Coquetelaria"],
    descricao: "Bar de coquetelaria autoral no Hotel Santa Teresa, com terraço e vista para a cidade.",
    endereco: "R. Almirante Alexandrino, 660 - Santa Teresa, Rio de Janeiro, RJ",
    telefone: "(21) 3380-0200",
    horario: "18h - 01h",
    diferenciais: ["Coquetelaria autoral", "Terraço com vista", "Ambiente sofisticado", "Drinks premiados"]
  },
  {
    id: 36,
    nome: "Parque das Ruínas",
    categoria: "Parque",
    emoji: "🌳",
    imagem: "img/parque.png",
    preco: 0,
    avaliacoes: 4.7,
    countAvaliacao: 12400,
    localizacao: "Santa Teresa, Rio de Janeiro",
    tags: ["Família", "Ao ar livre", "Grátis"],
    descricao: "Antigo casarão em ruínas transformado em centro cultural, com mirante e uma das melhores vistas do Rio.",
    endereco: "R. Murtinho Nobre, 169 - Santa Teresa, Rio de Janeiro, RJ",
    telefone: "(21) 2215-0621",
    horario: "08h - 18h",
    diferenciais: ["Mirante panorâmico", "Centro cultural", "Vista do Rio", "Gratuito"]
  },
  {
    id: 37,
    nome: "Shopping da Gávea",
    categoria: "Shopping",
    emoji: "🛍️",
    imagem: "img/shoppingGavea.jpg",
    preco: 0,
    avaliacoes: 4.7,
    countAvaliacao: 26500,
    localizacao: "Gávea, Rio de Janeiro",
    tags: ["Compras", "Teatro", "Restaurantes"],
    descricao: "Shopping charmoso da Gávea, reduto de teatros, restaurantes e lojas de design.",
    endereco: "R. Marquês de São Vicente, 52 - Gávea, Rio de Janeiro, RJ",
    telefone: "(21) 2294-1096",
    horario: "10h - 22h",
    diferenciais: ["Teatros", "Restaurantes", "Lojas de design", "Ambiente boêmio"]
  },
  {
    id: 38,
    nome: "Casa Rosa",
    categoria: "Salão de festas",
    emoji: "🎉",
    imagem: "img/festas.png",
    preco: 200,
    avaliacoes: 4.5,
    countAvaliacao: 120,
    localizacao: "Laranjeiras, Rio de Janeiro",
    tags: ["Grupo", "Festa", "Reserva"],
    descricao: "Casarão histórico em Laranjeiras com salões, jardim e palco para festas, samba e eventos.",
    endereco: "R. Alice, 550 - Laranjeiras, Rio de Janeiro, RJ",
    telefone: "(21) 2557-2562",
    horario: "Sob reserva",
    diferenciais: ["Casarão histórico", "Jardim", "Palco para samba", "Vários salões"]
  }
];

/* =========================================================
   MAPA DE CATEGORIAS
   Liga o slug da página (ex.: "bares") ao valor usado
   no campo "categoria" dos lugares (ex.: "Bar").
========================================================= */

const MAPA_CATEGORIAS = {
  bares: ["Bar"],
  restaurantes: ["Restaurante", "Lanchonete", "Pizzaria", "Café", "Sorveteria"],
  parques: ["Parque"],
  shoppings: ["Shopping"],
  festas: ["Salão de festas", "Festa"]
};

/* Retorna os lugares de uma categoria-slug (ex.: "bares"). */
function lugaresPorCategoriaSlug(slug) {
  const aceitas = MAPA_CATEGORIAS[slug] || [];
  return lugaresData.filter((lugar) => aceitas.includes(lugar.categoria));
}

/* =========================================================
   COORDENADAS (lat/lon) — usadas na busca por proximidade.
   Mantidas separadas para não poluir cada objeto.
   Todas no Rio de Janeiro.
========================================================= */
const COORDS_LUGARES = {
  1: [-22.9839, -43.2052],
  2: [-22.9716, -43.2052],
  3: [-22.9667, -43.1790],
  4: [-22.9847, -43.2230],
  5: [-22.9020, -43.1772],
  6: [-22.8869, -43.2769],
  7: [-22.9050, -43.2227],
  8: [-22.9845, -43.2057],
  9: [-22.9840, -43.2218],
  10: [-22.9486, -43.1647],
  11: [-22.9335, -43.1701],
  12: [-22.9889, -43.2783],
  13: [-22.984, -43.222],
  14: [-23.000, -43.366],
  15: [-22.999, -43.260],
  16: [-22.9118, -43.1796],
  17: [-22.9335, -43.1880],
  18: [-22.9100, -43.1810],
  19: [-22.9690, -43.1880],
  20: [-22.9837, -43.2247],
  21: [-22.9838, -43.2010],
  22: [-22.9839, -43.2030],
  23: [-22.9577, -43.2770],
  24: [-22.9728, -43.2010],
  25: [-22.9560, -43.1790],
  26: [-23.0030, -43.3210],
  27: [-22.9056, -43.1773],
  28: [-22.9876, -43.2008],
  29: [-22.9168, -43.1877],
  30: [-22.9215, -43.1925],
  31: [-22.9586, -43.2117],
  32: [-22.9676, -43.2227],
  33: [-22.9355, -43.1760],
  34: [-22.9118, -43.2150],
  35: [-22.9165, -43.1860],
  36: [-22.9168, -43.1845],
  37: [-22.9778, -43.2330],
  38: [-22.9300, -43.1880]
};

lugaresData.forEach((lugar) => {
  const c = COORDS_LUGARES[lugar.id];
  if (c) {
    lugar.lat = c[0];
    lugar.lon = c[1];
  }
});

/* =========================================================
   FOTOS REAIS (Wikimedia Commons, licença livre)
   Cada lugar usa a foto real correspondente em img/real/<id>.jpg.
   São fotos do próprio local (pontos famosos) ou do bairro/ponto
   próximo (bares e restaurantes privados sem foto livre).
   Se a imagem falhar ao carregar, o onerror das páginas cai no emoji.
========================================================= */
lugaresData.forEach((lugar) => {
  lugar.imagem = `img/real/${lugar.id}.jpg`;
});

/* Busca um lugar pelo id. */
function lugarPorId(id) {
  return lugaresData.find((lugar) => lugar.id === Number(id));
}

/* =========================================================
   PATROCÍNIO
   Um lugar é "patrocinado" quando:
   - tem o campo patrocinado: true no catálogo, OU
   - é um estabelecimento cadastrado com Premium ativo
     (chave estabelecimentoPremium_<email> no localStorage).
   Usado para exibir o selo "Patrocinado" nas listagens.
========================================================= */
function ehPatrocinado(item) {
  if (!item) return false;
  if (item.patrocinado === true) return true;

  const id = item.id;
  if (id === undefined || id === null) return false;

  try {
    return localStorage.getItem("estabelecimentoPremium_" + id) === "true";
  } catch (e) {
    return false;
  }
}

/* =========================================================
   ABERTO AGORA — interpreta o campo "horario" de cada lugar.
   Retorna true (aberto), false (fechado) ou null (não aplicável,
   ex.: "Sob reserva"). Entende formatos como "11h30 - 23h",
   "17h - 02h" (vira a madrugada) e "24h".
========================================================= */
function _minutosAgora() {
  const d = new Date();
  return d.getHours() * 60 + d.getMinutes();
}

function estaAbertoAgora(horario) {
  if (!horario) return null;
  const txt = String(horario).toLowerCase();
  if (txt.includes("24h")) return true;
  if (txt.includes("reserva")) return null;

  const m = String(horario).match(/(\d{1,2})h(\d{2})?\s*[-–]\s*(\d{1,2})h(\d{2})?/);
  if (!m) return null;

  const abre = parseInt(m[1], 10) * 60 + (m[2] ? parseInt(m[2], 10) : 0);
  let fecha = parseInt(m[3], 10) * 60 + (m[4] ? parseInt(m[4], 10) : 0);
  if (fecha === 0) fecha = 24 * 60; // "00h" = meia-noite (fim do dia)

  const agora = _minutosAgora();
  if (fecha > abre) return agora >= abre && agora < fecha;
  return agora >= abre || agora < fecha; // cruza a meia-noite
}

function badgeAbertoHTML(horario) {
  const aberto = estaAbertoAgora(horario);
  if (aberto === null) return "";
  return aberto
    ? '<span class="badge-aberto aberto">● Aberto agora</span>'
    : '<span class="badge-aberto fechado">● Fechado</span>';
}

/* =========================================================
   DISTÂNCIA / PERTO DE MIM — usa lat/lon (fórmula de Haversine)
   e a geolocalização do navegador.
========================================================= */
function distanciaKm(lat1, lon1, lat2, lon2) {
  const R = 6371;
  const toRad = (g) => (g * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

function formatarDistancia(km) {
  if (km == null || Number.isNaN(km)) return "";
  return km < 1 ? `${Math.round(km * 1000)} m` : `${km.toFixed(1)} km`;
}

const coordenadasPorBairro = {
  "Alto da Boa Vista": { lat: -22.9657, lon: -43.2676 },
  "Barra da Tijuca": { lat: -23.0004, lon: -43.3659 },
  Botafogo: { lat: -22.9519, lon: -43.1822 },
  Cachambi: { lat: -22.8872, lon: -43.2754 },
  Centro: { lat: -22.9068, lon: -43.1729 },
  Copacabana: { lat: -22.9711, lon: -43.1822 },
  Flamengo: { lat: -22.9339, lon: -43.1743 },
  Gávea: { lat: -22.9811, lon: -43.2367 },
  Ipanema: { lat: -22.9846, lon: -43.2048 },
  "Jardim Botânico": { lat: -22.9679, lon: -43.2246 },
  Lagoa: { lat: -22.9714, lon: -43.2111 },
  Lapa: { lat: -22.9137, lon: -43.1799 },
  Laranjeiras: { lat: -22.9344, lon: -43.1878 },
  Leblon: { lat: -22.9837, lon: -43.2241 },
  "Praça da Bandeira": { lat: -22.9122, lon: -43.2125 },
  "Santa Teresa": { lat: -22.9214, lon: -43.1882 },
  "São Conrado": { lat: -22.9986, lon: -43.2673 },
  "São Cristóvão": { lat: -22.8957, lon: -43.2227 },
  Urca: { lat: -22.9486, lon: -43.1656 }
};

function bairroDeLugar(lugar) {
  return (lugar && lugar.localizacao ? lugar.localizacao : "").split(",")[0].trim();
}

function coordenadasDeLugar(lugar) {
  if (!lugar) return null;
  if (lugar.lat != null && lugar.lon != null) return { lat: lugar.lat, lon: lugar.lon };
  return coordenadasPorBairro[bairroDeLugar(lugar)] || null;
}

let posicaoUsuario = null; // { lat, lon } em cache durante a sessão
function obterPosicaoUsuario() {
  return new Promise((resolve, reject) => {
    if (posicaoUsuario) return resolve(posicaoUsuario);
    if (!navigator.geolocation) {
      reject(new Error("Geolocalização não suportada neste navegador."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        posicaoUsuario = { lat: pos.coords.latitude, lon: pos.coords.longitude };
        resolve(posicaoUsuario);
      },
      (err) => reject(err),
      { enableHighAccuracy: false, timeout: 10000, maximumAge: 300000 }
    );
  });
}

/* =========================================================
   AVALIAÇÕES DE USUÁRIO — guardadas no navegador (localStorage),
   por id de lugar. Cada item: { nota, comentario, autor, data }.
========================================================= */
function _lerAvaliacoes() {
  try {
    return JSON.parse(localStorage.getItem("avaliacoesUsuario") || "{}");
  } catch (e) {
    return {};
  }
}

function getAvaliacoesUsuario(id) {
  const todas = _lerAvaliacoes();
  return todas[id] || [];
}

function addAvaliacaoUsuario(id, nota, comentario, autor) {
  const todas = _lerAvaliacoes();
  const lista = todas[id] || [];
  lista.unshift({
    nota: Number(nota),
    comentario: (comentario || "").trim(),
    autor: (autor && autor.trim()) || localStorage.getItem("nomeUsuario") || "Você",
    data: new Date().toISOString()
  });
  todas[id] = lista;
  localStorage.setItem("avaliacoesUsuario", JSON.stringify(todas));
  return lista;
}

function mediaAvaliacaoUsuario(id) {
  const lista = getAvaliacoesUsuario(id);
  if (!lista.length) return null;
  const soma = lista.reduce((s, a) => s + (Number(a.nota) || 0), 0);
  return { media: soma / lista.length, total: lista.length };
}

/* Disponibiliza no escopo global (para páginas que não usam módulos). */
if (typeof window !== "undefined") {
  window.lugaresData = lugaresData;
  window.MAPA_CATEGORIAS = MAPA_CATEGORIAS;
  window.lugaresPorCategoriaSlug = lugaresPorCategoriaSlug;
  window.lugarPorId = lugarPorId;
  window.ehPatrocinado = ehPatrocinado;
  window.estaAbertoAgora = estaAbertoAgora;
  window.badgeAbertoHTML = badgeAbertoHTML;
  window.distanciaKm = distanciaKm;
  window.formatarDistancia = formatarDistancia;
  window.bairroDeLugar = bairroDeLugar;
  window.coordenadasDeLugar = coordenadasDeLugar;
  window.obterPosicaoUsuario = obterPosicaoUsuario;
  window.getAvaliacoesUsuario = getAvaliacoesUsuario;
  window.addAvaliacaoUsuario = addAvaliacaoUsuario;
  window.mediaAvaliacaoUsuario = mediaAvaliacaoUsuario;
}
