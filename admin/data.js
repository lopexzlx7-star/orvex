/* ORVEX — Painel interno · dados de demonstração (fictícios) */
'use strict';

var DB = {
  empresa: {
    nome: 'ORVEX Tecnologia & IA',
    cnpj: '00.000.000/0001-00',
    email: 'contato@orvex.com.br',
    telefone: '+55 (11) 4000-0000',
    endereco: 'Av. Paulista, 1000 · São Paulo/SP',
    moeda: 'BRL'
  },

  usuario: {
    nome: 'Isaque Lopes',
    cargo: 'Owner',
    email: 'admin@orvex.com.br',
    iniciais: 'IL'
  },

  /* ---------- Dashboard: KPIs por período ---------- */
  kpis: {
    '7d': [
      { id: 'receita',     lb: 'Receita total',      vl: 'R$ 48.200',  raw: 48200,   dl: '+12,4%', dir: 'up',   ft: 'vs 7 dias anteriores', spark: [22,28,25,34,30,40,48] },
      { id: 'mrr',         lb: 'Receita recorrente', vl: 'R$ 21.400',  raw: 21400,   dl: '+4,1%',  dir: 'up',   ft: 'MRR atual', spark: [18,18,19,20,20,21,21] },
      { id: 'clientes',    lb: 'Clientes ativos',    vl: '34',         raw: 34,      dl: '+2',     dir: 'up',   ft: 'novos no período' },
      { id: 'projetos',    lb: 'Projetos ativos',    vl: '12',         raw: 12,      dl: '+1',     dir: 'up',   ft: 'em andamento' },
      { id: 'leads',       lb: 'Leads',              vl: '46',         raw: 46,      dl: '+18,9%', dir: 'up',   ft: 'captados no período', spark: [10,14,12,18,16,22,26] },
      { id: 'conversao',   lb: 'Taxa de conversão',  vl: '23,8%',      raw: 23.8,    dl: '+2,1pp', dir: 'up',   ft: 'lead → cliente' },
      { id: 'ticket',      lb: 'Ticket médio',       vl: 'R$ 4.820',   raw: 4820,    dl: '−3,2%',  dir: 'down', ft: 'por venda fechada' },
      { id: 'pendentes',   lb: 'Contas pendentes',   vl: 'R$ 12.900',  raw: 12900,   dl: '5 contas', dir: 'flat', ft: 'a receber' }
    ],
    '30d': [
      { id: 'receita',     lb: 'Receita total',      vl: 'R$ 186.400', raw: 186400,  dl: '+9,7%',  dir: 'up',   ft: 'vs 30 dias anteriores', spark: [100,118,110,132,140,160,186] },
      { id: 'mrr',         lb: 'Receita recorrente', vl: 'R$ 21.400',  raw: 21400,   dl: '+4,1%',  dir: 'up',   ft: 'MRR atual', spark: [18,18,19,19,20,21,21] },
      { id: 'clientes',    lb: 'Clientes ativos',    vl: '34',         raw: 34,      dl: '+5',     dir: 'up',   ft: 'novos no período' },
      { id: 'projetos',    lb: 'Projetos ativos',    vl: '12',         raw: 12,      dl: '+3',     dir: 'up',   ft: 'em andamento' },
      { id: 'leads',       lb: 'Leads',              vl: '172',        raw: 172,     dl: '+14,2%', dir: 'up',   ft: 'captados no período', spark: [80,96,104,120,138,150,172] },
      { id: 'conversao',   lb: 'Taxa de conversão',  vl: '21,5%',      raw: 21.5,    dl: '+1,2pp', dir: 'up',   ft: 'lead → cliente' },
      { id: 'ticket',      lb: 'Ticket médio',       vl: 'R$ 5.340',   raw: 5340,    dl: '+6,4%',  dir: 'up',   ft: 'por venda fechada' },
      { id: 'pendentes',   lb: 'Contas pendentes',   vl: 'R$ 41.250',  raw: 41250,   dl: '14 contas', dir: 'flat', ft: 'a receber' }
    ],
    '90d': [
      { id: 'receita',     lb: 'Receita total',      vl: 'R$ 512.800', raw: 512800,  dl: '+21,3%', dir: 'up',   ft: 'vs 90 dias anteriores', spark: [240,280,310,360,410,460,512] },
      { id: 'mrr',         lb: 'Receita recorrente', vl: 'R$ 19.900',  raw: 19900,   dl: '+8,9%',  dir: 'up',   ft: 'MRR médio', spark: [14,15,16,17,18,19,20] },
      { id: 'clientes',    lb: 'Clientes ativos',    vl: '34',         raw: 34,      dl: '+9',     dir: 'up',   ft: 'novos no período' },
      { id: 'projetos',    lb: 'Projetos ativos',    vl: '12',         raw: 12,      dl: '+4',     dir: 'up',   ft: 'em andamento' },
      { id: 'leads',       lb: 'Leads',              vl: '498',        raw: 498,     dl: '+26,1%', dir: 'up',   ft: 'captados no período', spark: [210,250,290,340,390,440,498] },
      { id: 'conversao',   lb: 'Taxa de conversão',  vl: '20,2%',      raw: 20.2,    dl: '+0,8pp', dir: 'up',   ft: 'lead → cliente' },
      { id: 'ticket',      lb: 'Ticket médio',       vl: 'R$ 5.980',   raw: 5980,    dl: '+11,0%', dir: 'up',   ft: 'por venda fechada' },
      { id: 'pendentes',   lb: 'Contas pendentes',   vl: 'R$ 87.600',  raw: 87600,   dl: '28 contas', dir: 'flat', ft: 'a receber' }
    ],
    '12m': [
      { id: 'receita',     lb: 'Receita total',      vl: 'R$ 1.948.000', raw: 1948000, dl: '+34,6%', dir: 'up',   ft: 'vs 12 meses anteriores', spark: [800,900,1010,1120,1240,1380,1520,1640,1720,1810,1880,1948] },
      { id: 'mrr',         lb: 'Receita recorrente', vl: 'R$ 21.400',  raw: 21400,   dl: '+46,2%', dir: 'up',   ft: 'MRR atual vs início', spark: [8,9,10,12,13,14,16,17,18,19,20,21] },
      { id: 'clientes',    lb: 'Clientes ativos',    vl: '34',         raw: 34,      dl: '+19',    dir: 'up',   ft: 'novos no ano' },
      { id: 'projetos',    lb: 'Projetos ativos',    vl: '12',         raw: 12,      dl: '+7',     dir: 'up',   ft: 'em andamento' },
      { id: 'leads',       lb: 'Leads',              vl: '2.140',      raw: 2140,    dl: '+31,8%', dir: 'up',   ft: 'captados no ano', spark: [900,1020,1140,1280,1400,1520,1660,1780,1880,1960,2050,2140] },
      { id: 'conversao',   lb: 'Taxa de conversão',  vl: '19,4%',      raw: 19.4,    dl: '+1,6pp', dir: 'up',   ft: 'lead → cliente' },
      { id: 'ticket',      lb: 'Ticket médio',       vl: 'R$ 6.120',   raw: 6120,    dl: '+9,8%',  dir: 'up',   ft: 'por venda fechada' },
      { id: 'pendentes',   lb: 'Contas pendentes',   vl: 'R$ 87.600',  raw: 87600,   dl: '28 contas', dir: 'flat', ft: 'em aberto no ano' }
    ]
  },

  /* ---------- Gráfico financeiro por período ---------- */
  financeiroChart: {
    '7d':  { labels: ['Seg','Ter','Qua','Qui','Sex','Sáb','Dom'],
             receita:  [6200,7400,5800,9200,8100,5600,5900],
             despesas: [3100,3600,2900,4100,3800,2600,2800] },
    '30d': { labels: ['Sem 1','Sem 2','Sem 3','Sem 4'],
             receita:  [42000,48600,44200,51600],
             despesas: [24100,27300,25800,29400] },
    '90d': { labels: ['Jul','Ago','Set'],
             receita:  [158000,172400,182400],
             despesas: [96200,103800,110600] },
    '12m': { labels: ['Out','Nov','Dez','Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set'],
             receita:  [112000,124000,138000,142000,148000,156000,162000,158000,166000,172400,180000,189600],
             despesas: [78000,84000,91000,92000,95000,99000,102000,100000,104000,106000,110000,114000] }
  },

  /* ---------- Funil comercial ---------- */
  funil: [
    { etapa: 'Visitantes',  qtd: 12480 },
    { etapa: 'Leads',       qtd: 1720 },
    { etapa: 'Contatados',  qtd: 964 },
    { etapa: 'Qualificados',qtd: 512 },
    { etapa: 'Propostas',   qtd: 268 },
    { etapa: 'Negociação',  qtd: 142 },
    { etapa: 'Clientes',    qtd: 96 }
  ],

  /* ---------- Atividade recente ---------- */
  atividade: [
    { ico: 'user-plus', txt: 'Novo cliente cadastrado', det: 'Vertex Logística', user: 'Marina Duarte', ago: 'há 8 min' },
    { ico: 'inbox',     txt: 'Novo lead recebido',      det: 'Formulário do site · Chatbot IA', user: 'Sistema', ago: 'há 22 min' },
    { ico: 'refresh',   txt: 'Projeto atualizado',      det: 'App Clínica Sorriso → Revisão', user: 'Rafael Nunes', ago: 'há 1 h' },
    { ico: 'credit',    txt: 'Pagamento recebido',      det: 'R$ 4.800 · Nexus Contabilidade', user: 'Financeiro', ago: 'há 2 h' },
    { ico: 'ticket',    txt: 'Ticket aberto',           det: '#1042 · Erro no checkout', user: 'Paulo Rios', ago: 'há 3 h' },
    { ico: 'check',     txt: 'Tarefa concluída',        det: 'Integração API de pagamentos', user: 'Bruno Sales', ago: 'há 4 h' },
    { ico: 'file',      txt: 'Proposta aceita',         det: 'Sistema de agendamento · R$ 18.500', user: 'Marina Duarte', ago: 'há 5 h' },
    { ico: 'bot',       txt: 'Automação executada',     det: 'Boas-vindas · 14 e-mails enviados', user: 'Sistema', ago: 'há 6 h' },
    { ico: 'user-plus', txt: 'Novo lead qualificado',   det: 'Grupo Atlas · SaaS personalizado', user: 'Camila Reis', ago: 'há 7 h' },
    { ico: 'refresh',   txt: 'Projeto iniciado',        det: 'Portal do Investidor · Planejamento', user: 'Rafael Nunes', ago: 'ontem' }
  ],

  /* ---------- Equipe ---------- */
  equipe: [
    { id: 'u1', nome: 'Isaque Lopes',  cargo: 'Owner',         email: 'isaque@orvex.com.br',  status: 'online',  projetos: 3, tarefas: 5,  papel: 'Owner',         iniciais: 'IL' },
    { id: 'u2', nome: 'Marina Duarte', cargo: 'Gerente Comercial', email: 'marina@orvex.com.br', status: 'online', projetos: 4, tarefas: 8, papel: 'Gerente', iniciais: 'MD' },
    { id: 'u3', nome: 'Rafael Nunes',  cargo: 'Gerente de Projetos', email: 'rafael@orvex.com.br', status: 'ausente', projetos: 6, tarefas: 6, papel: 'Gerente', iniciais: 'RN' },
    { id: 'u4', nome: 'Bruno Sales',   cargo: 'Desenvolvedor Full-stack', email: 'bruno@orvex.com.br', status: 'online', projetos: 4, tarefas: 11, papel: 'Desenvolvedor', iniciais: 'BS' },
    { id: 'u5', nome: 'Camila Reis',   cargo: 'Marketing / Growth', email: 'camila@orvex.com.br', status: 'offline', projetos: 2, tarefas: 7, papel: 'Marketing', iniciais: 'CR' },
    { id: 'u6', nome: 'Paulo Rios',    cargo: 'Suporte Técnico', email: 'paulo@orvex.com.br',  status: 'online',  projetos: 1, tarefas: 9,  papel: 'Suporte', iniciais: 'PR' },
    { id: 'u7', nome: 'Helena Costa',  cargo: 'Financeiro',    email: 'helena@orvex.com.br',  status: 'ausente', projetos: 0, tarefas: 4,  papel: 'Financeiro', iniciais: 'HC' },
    { id: 'u8', nome: 'Diego Martins', cargo: 'Designer UI/UX', email: 'diego@orvex.com.br',  status: 'online',  projetos: 5, tarefas: 6,  papel: 'Admin', iniciais: 'DM' }
  ],

  permissaoMatriz: {
    modulos: ['Dashboard','Clientes','Leads/CRM','Projetos','Serviços','Vendas','Financeiro','Tarefas','Suporte','Analytics','Automações','Arquivos','Equipe','Configurações'],
    papeis: [
      { papel: 'Owner',         nivel: ['total','total','total','total','total','total','total','total','total','total','total','total','total','total'] },
      { papel: 'Admin',         nivel: ['total','total','total','total','total','total','leitura','total','total','total','total','total','total','leitura'] },
      { papel: 'Gerente',       nivel: ['leitura','total','total','total','leitura','total','—','total','total','leitura','leitura','total','leitura','—'] },
      { papel: 'Desenvolvedor', nivel: ['—','leitura','—','total','—','—','—','total','leitura','—','leitura','leitura','—','—'] },
      { papel: 'Marketing',     nivel: ['leitura','leitura','total','—','leitura','leitura','—','total','—','total','total','leitura','—','—'] },
      { papel: 'Suporte',       nivel: ['—','leitura','—','leitura','—','—','—','leitura','total','—','—','leitura','—','—'] },
      { papel: 'Financeiro',    nivel: ['leitura','leitura','—','—','—','leitura','total','—','—','—','—','leitura','—','—'] }
    ]
  },

  /* ---------- Clientes ---------- */
  clientes: [
    { id: 'c1',  nome: 'Ana Beatriz Moraes', empresa: 'Nexus Contabilidade',  servico: 'Manutenção mensal',   status: 'Ativo',    valor: 2400,  ultimoContato: '2026-09-20', proxPagamento: '2026-10-05', responsavel: 'Marina Duarte', email: 'ana@nexuscontabil.com.br', telefone: '+55 (11) 98877-1200', entrada: '2025-03-14', mensalidade: 2400, contratado: 28800, statusFin: 'Em dia', projetos: ['p5'], tickets: ['t3'] },
    { id: 'c2',  nome: 'Carlos Eduardo Lima', empresa: 'Vertex Logística',    servico: 'Sistema personalizado', status: 'Ativo',  valor: 46000, ultimoContato: '2026-09-21', proxPagamento: '2026-09-28', responsavel: 'Rafael Nunes', email: 'carlos@vertexlog.com.br', telefone: '+55 (11) 97744-8090', entrada: '2026-01-08', mensalidade: 0, contratado: 46000, statusFin: 'Em dia', projetos: ['p1'], tickets: [] },
    { id: 'c3',  nome: 'Fernanda Oliveira',  empresa: 'Clínica Sorriso',     servico: 'Aplicativo + Chatbot IA', status: 'Ativo', valor: 38500, ultimoContato: '2026-09-19', proxPagamento: '2026-10-01', responsavel: 'Rafael Nunes', email: 'fernanda@clinicasorriso.com', telefone: '+55 (21) 96655-3311', entrada: '2026-02-20', mensalidade: 1200, contratado: 38500, statusFin: 'Em dia', projetos: ['p2'], tickets: ['t1','t5'] },
    { id: 'c4',  nome: 'Ricardo Tavares',    empresa: 'Grupo Atlas',         servico: 'SaaS personalizado',    status: 'Ativo',    valor: 72000, ultimoContato: '2026-09-18', proxPagamento: '2026-09-30', responsavel: 'Isaque Lopes', email: 'ricardo@grupoatlas.com.br', telefone: '+55 (11) 95533-7788', entrada: '2025-08-02', mensalidade: 6000, contratado: 72000, statusFin: 'Em dia', projetos: ['p3','p8'], tickets: ['t2'] },
    { id: 'c5',  nome: 'Juliana Prado',      empresa: 'Prado & Filhos Adv.', servico: 'Landing page',          status: 'Ativo',    valor: 4800,  ultimoContato: '2026-09-12', proxPagamento: '—', responsavel: 'Marina Duarte', email: 'juliana@pradoadv.com.br', telefone: '+55 (11) 94422-6655', entrada: '2026-06-11', mensalidade: 0, contratado: 4800, statusFin: 'Quitado', projetos: ['p4'], tickets: [] },
    { id: 'c6',  nome: 'Marcos Vinícius',    empresa: 'AgroCampo Insumos',   servico: 'Automação de processos', status: 'Ativo',   valor: 28000, ultimoContato: '2026-09-15', proxPagamento: '2026-10-10', responsavel: 'Isaque Lopes', email: 'marcos@agrocampo.com.br', telefone: '+55 (62) 93311-4422', entrada: '2026-04-05', mensalidade: 2200, contratado: 28000, statusFin: 'Em dia', projetos: ['p6'], tickets: ['t7'] },
    { id: 'c7',  nome: 'Patrícia Gomes',     empresa: 'EducaMais Cursos',    servico: 'Plataforma EAD',        status: 'Em pausa', valor: 54000, ultimoContato: '2026-08-28', proxPagamento: '2026-10-15', responsavel: 'Rafael Nunes', email: 'patricia@educamais.com.br', telefone: '+55 (31) 92288-1144', entrada: '2025-11-19', mensalidade: 1800, contratado: 54000, statusFin: 'Atrasado', projetos: ['p7'], tickets: ['t8'] },
    { id: 'c8',  nome: 'Otávio Bernardes',   empresa: 'Bernardes Imóveis',   servico: 'Site institucional',    status: 'Ativo',    valor: 9600,  ultimoContato: '2026-09-10', proxPagamento: '—', responsavel: 'Marina Duarte', email: 'otavio@bernardesimoveis.com', telefone: '+55 (41) 91177-5566', entrada: '2026-05-23', mensalidade: 0, contratado: 9600, statusFin: 'Quitado', projetos: [], tickets: [] },
    { id: 'c9',  nome: 'Sílvia Nakamura',    empresa: 'Kibo Gastronomia',    servico: 'Chatbot WhatsApp IA',   status: 'Ativo',    valor: 15600, ultimoContato: '2026-09-21', proxPagamento: '2026-10-02', responsavel: 'Isaque Lopes', email: 'silvia@kibogastronomia.com.br', telefone: '+55 (11) 90066-8899', entrada: '2026-07-01', mensalidade: 1300, contratado: 15600, statusFin: 'Em dia', projetos: ['p9'], tickets: [] },
    { id: 'c10', nome: 'Eduardo Fontes',     empresa: 'FarmaVida Rede',      servico: 'Integração de APIs',    status: 'Ativo',    valor: 33000, ultimoContato: '2026-09-17', proxPagamento: '2026-09-29', responsavel: 'Rafael Nunes', email: 'eduardo@farmavida.com.br', telefone: '+55 (85) 98844-2233', entrada: '2025-12-09', mensalidade: 900, contratado: 33000, statusFin: 'Em dia', projetos: ['p10'], tickets: ['t9'] },
    { id: 'c11', nome: 'Renata Campos',      empresa: 'Studio RC Arquitetura', servico: 'Portfólio + SEO',     status: 'Inativo',  valor: 3600,  ultimoContato: '2026-04-30', proxPagamento: '—', responsavel: 'Camila Reis', email: 'renata@studiorc.arq.br', telefone: '+55 (11) 97711-3344', entrada: '2025-06-17', mensalidade: 0, contratado: 3600, statusFin: 'Quitado', projetos: [], tickets: [] },
    { id: 'c12', nome: 'Thiago Albuquerque', empresa: 'LogTech Transportes', servico: 'Painel de rastreamento', status: 'Ativo',   valor: 61000, ultimoContato: '2026-09-20', proxPagamento: '2026-10-08', responsavel: 'Rafael Nunes', email: 'thiago@logtech.com.br', telefone: '+55 (19) 96644-7711', entrada: '2026-03-02', mensalidade: 3400, contratado: 61000, statusFin: 'Em dia', projetos: ['p11'], tickets: [] }
  ],

  /* ---------- Leads / CRM (Kanban) ---------- */
  leads: [
    { id: 'l1',  col: 'novo',        nome: 'Larissa Peixoto',  empresa: 'Bella Moda Boutique', servico: 'Loja virtual',        valor: 22000, origem: 'Instagram Ads', responsavel: 'Marina Duarte', ultima: '2026-09-22', proxima: 'Enviar mensagem de boas-vindas' },
    { id: 'l2',  col: 'novo',        nome: 'Gustavo Arruda',   empresa: 'Arruda Construtora',  servico: 'Site institucional',  valor: 12000, origem: 'Indicação',     responsavel: 'Marina Duarte', ultima: '2026-09-22', proxima: 'Primeiro contato' },
    { id: 'l3',  col: 'novo',        nome: 'Amanda Lins',      empresa: 'PetLove Clínica Vet', servico: 'Chatbot WhatsApp IA', valor: 9800,  origem: 'Formulário do site', responsavel: 'Camila Reis', ultima: '2026-09-21', proxima: 'Qualificar via call' },
    { id: 'l4',  col: 'contatado',   nome: 'Sérgio Bittencourt', empresa: 'SB Consultoria',    servico: 'Automação de processos', valor: 18500, origem: 'Google Ads', responsavel: 'Marina Duarte', ultima: '2026-09-20', proxima: 'Agendar reunião de briefing' },
    { id: 'l5',  col: 'contatado',   nome: 'Viviane Rocha',    empresa: 'Rocha Fitness Studio', servico: 'Landing page',       valor: 4200,  origem: 'Orgânico',      responsavel: 'Camila Reis', ultima: '2026-09-19', proxima: 'Enviar portfólio' },
    { id: 'l6',  col: 'qualificado', nome: 'Henrique Salles',  empresa: 'Salles & Moura Adv.', servico: 'Sistema personalizado', valor: 34000, origem: 'LinkedIn',    responsavel: 'Isaque Lopes', ultima: '2026-09-18', proxima: 'Levantar requisitos' },
    { id: 'l7',  col: 'qualificado', nome: 'Daniela Freitas',  empresa: 'Freitas Eventos',     servico: 'Site + Integrações',  valor: 16700, origem: 'Indicação',     responsavel: 'Marina Duarte', ultima: '2026-09-18', proxima: 'Montar proposta' },
    { id: 'l8',  col: 'proposta',    nome: 'Roberto Muniz',    empresa: 'Muniz Autopeças',     servico: 'E-commerce + ERP',    valor: 48000, origem: 'Google Ads',    responsavel: 'Isaque Lopes', ultima: '2026-09-17', proxima: 'Follow-up da proposta' },
    { id: 'l9',  col: 'proposta',    nome: 'Tatiane Alves',    empresa: 'Alves Odontologia',   servico: 'Plataforma de agendamento', valor: 27500, origem: 'Formulário do site', responsavel: 'Rafael Nunes', ultima: '2026-09-16', proxima: 'Revisar escopo com cliente' },
    { id: 'l10', col: 'negociacao',  nome: 'Fábio Moretti',    empresa: 'Moretti Distribuidora', servico: 'SaaS logístico',    valor: 65000, origem: 'Evento / Feira', responsavel: 'Isaque Lopes', ultima: '2026-09-21', proxima: 'Negociar condições de pagamento' },
    { id: 'l11', col: 'negociacao',  nome: 'Cristina Vidal',   empresa: 'Vidal Estética',      servico: 'Chatbot + Automação', valor: 13900, origem: 'Instagram Ads', responsavel: 'Marina Duarte', ultima: '2026-09-20', proxima: 'Fechar contrato' },
    { id: 'l12', col: 'fechado',     nome: 'André Siqueira',   empresa: 'Siqueira Seguros',    servico: 'Portal do cliente',   valor: 39800, origem: 'LinkedIn',      responsavel: 'Rafael Nunes', ultima: '2026-09-15', proxima: 'Kickoff do projeto' },
    { id: 'l13', col: 'perdido',     nome: 'Mônica Braga',     empresa: 'Braga Papelaria',     servico: 'Loja virtual',        valor: 8600,  origem: 'Google Ads',    responsavel: 'Camila Reis', ultima: '2026-09-08', proxima: '—  (motivo: orçamento)' },
    { id: 'l14', col: 'perdido',     nome: 'Leandro Pimentel', empresa: 'LP Transportes',      servico: 'Sistema de frota',    valor: 52000, origem: 'Indicação',     responsavel: 'Isaque Lopes', ultima: '2026-09-02', proxima: '—  (motivo: escolheu concorrente)' }
  ],

  leadCols: [
    { id: 'novo',        nome: 'Novo' },
    { id: 'contatado',   nome: 'Contatado' },
    { id: 'qualificado', nome: 'Qualificado' },
    { id: 'proposta',    nome: 'Proposta' },
    { id: 'negociacao',  nome: 'Negociação' },
    { id: 'fechado',     nome: 'Fechado' },
    { id: 'perdido',     nome: 'Perdido' }
  ],

  /* ---------- Projetos ---------- */
  projetos: [
    { id: 'p1',  nome: 'Sistema de gestão logística', cliente: 'c2', servico: 's3', responsavel: 'Rafael Nunes', prazo: '2026-11-30', orcamento: 46000, status: 'Desenvolvimento', prioridade: 'Alta',     progresso: 64, fase: 4 },
    { id: 'p2',  nome: 'App Clínica Sorriso',         cliente: 'c3', servico: 's3', responsavel: 'Rafael Nunes', prazo: '2026-10-15', orcamento: 38500, status: 'Revisão',         prioridade: 'Urgente',  progresso: 88, fase: 5 },
    { id: 'p3',  nome: 'SaaS Grupo Atlas — módulo financeiro', cliente: 'c4', servico: 's7', responsavel: 'Isaque Lopes', prazo: '2026-12-20', orcamento: 72000, status: 'Desenvolvimento', prioridade: 'Alta', progresso: 41, fase: 4 },
    { id: 'p4',  nome: 'Landing Prado & Filhos',      cliente: 'c5', servico: 's1', responsavel: 'Diego Martins', prazo: '2026-09-30', orcamento: 4800, status: 'Aguardando cliente', prioridade: 'Normal', progresso: 95, fase: 6 },
    { id: 'p5',  nome: 'Manutenção Nexus Contabilidade', cliente: 'c1', servico: 's8', responsavel: 'Bruno Sales', prazo: '2026-10-05', orcamento: 2400, status: 'Em desenvolvimento', prioridade: 'Baixa', progresso: 72, fase: 4, prazoDias: 4 },
    { id: 'p6',  nome: 'Automação AgroCampo',         cliente: 'c6', servico: 's5', responsavel: 'Isaque Lopes', prazo: '2026-10-25', orcamento: 28000, status: 'Design',           prioridade: 'Alta',     progresso: 35, fase: 3 },
    { id: 'p7',  nome: 'Plataforma EAD EducaMais',    cliente: 'c7', servico: 's7', responsavel: 'Rafael Nunes', prazo: '2027-01-30', orcamento: 54000, status: 'Pausado',          prioridade: 'Normal',   progresso: 52, fase: 4 },
    { id: 'p8',  nome: 'Portal do Investidor Atlas',  cliente: 'c4', servico: 's3', responsavel: 'Isaque Lopes', prazo: '2027-02-28', orcamento: 58000, status: 'Planejamento',     prioridade: 'Normal',   progresso: 8,  fase: 1 },
    { id: 'p9',  nome: 'Chatbot WhatsApp Kibo',       cliente: 'c9', servico: 's4', responsavel: 'Bruno Sales', prazo: '2026-10-18', orcamento: 15600, status: 'Desenvolvimento',  prioridade: 'Alta',     progresso: 58, fase: 4 },
    { id: 'p10', nome: 'Integração APIs FarmaVida',   cliente: 'c10', servico: 's6', responsavel: 'Bruno Sales', prazo: '2026-10-30', orcamento: 33000, status: 'Briefing',         prioridade: 'Normal',   progresso: 18, fase: 2 },
    { id: 'p11', nome: 'Painel de rastreamento LogTech', cliente: 'c12', servico: 's7', responsavel: 'Rafael Nunes', prazo: '2026-12-10', orcamento: 61000, status: 'Desenvolvimento', prioridade: 'Alta', progresso: 47, fase: 4 },
    { id: 'p12', nome: 'Website Empresa X',           cliente: 'c8', servico: 's2', responsavel: 'Diego Martins', prazo: '2026-09-26', orcamento: 9600, status: 'Concluído',        prioridade: 'Normal',   progresso: 100, fase: 7 }
  ],

  projetoFases: ['Planejamento','Briefing','Design','Desenvolvimento','Revisão','Aguardando cliente','Concluído'],
  projetoStatus: ['Planejamento','Briefing','Design','Desenvolvimento','Revisão','Aguardando cliente','Concluído','Pausado'],

  projetoTimeline: {
    p1: [ { f: 'Planejamento', d: '2026-06-10', done: true }, { f: 'Briefing', d: '2026-06-18', done: true }, { f: 'Design', d: '2026-07-05', done: true }, { f: 'Desenvolvimento', d: '2026-07-28', done: false }, { f: 'Revisão', d: '—', done: false }, { f: 'Entrega', d: '—', done: false } ],
    p5: [ { f: 'Planejamento', d: '2026-08-01', done: true }, { f: 'Design', d: '2026-08-12', done: true }, { f: 'Desenvolvimento', d: '2026-08-25', done: false }, { f: 'Revisão', d: '—', done: false }, { f: 'Entrega', d: '—', done: false } ]
  },

  /* ---------- Serviços ---------- */
  servicos: [
    { id: 's1', nome: 'Landing page',            desc: 'Página de conversão com copy, design e integração de leads.', preco: 4500,  tipo: 'Projeto',    recorrencia: '—',        prazo: '7–10 dias',  status: 'Ativo' },
    { id: 's2', nome: 'Site institucional',      desc: 'Site completo com até 8 páginas, SEO técnico e painel de conteúdo.', preco: 9500, tipo: 'Projeto', recorrencia: '—', prazo: '15–25 dias', status: 'Ativo' },
    { id: 's3', nome: 'Sistema personalizado',   desc: 'Aplicação web sob medida: dashboards, portais e integrações.', preco: 28000, tipo: 'Projeto', recorrencia: '—', prazo: '45–120 dias', status: 'Ativo' },
    { id: 's4', nome: 'Chatbot com IA',          desc: 'Atendimento automatizado no WhatsApp/site com IA generativa.', preco: 8900, tipo: 'Projeto', recorrencia: 'Mensal', prazo: '15–30 dias', status: 'Ativo' },
    { id: 's5', nome: 'Automação de processos',  desc: 'Fluxos automatizados entre sistemas (CRM, ERP, e-mail, planilhas).', preco: 12500, tipo: 'Projeto', recorrencia: '—', prazo: '20–45 dias', status: 'Ativo' },
    { id: 's6', nome: 'Integração de APIs',      desc: 'Conexão entre plataformas: pagamentos, logística, ERPs e CRMs.', preco: 9800, tipo: 'Projeto', recorrencia: '—', prazo: '10–30 dias', status: 'Ativo' },
    { id: 's7', nome: 'SaaS sob medida',         desc: 'Produto multi-tenant com billing, auth e painel administrativo.', preco: 55000, tipo: 'Produto', recorrencia: 'Mensal', prazo: '90–180 dias', status: 'Ativo' },
    { id: 's8', nome: 'Manutenção mensal',       desc: 'Suporte contínuo, atualizações, backups e monitoramento.', preco: 2400, tipo: 'Serviço', recorrencia: 'Mensal', prazo: 'Contínuo', status: 'Ativo' },
    { id: 's9', nome: 'Consultoria em IA',       desc: 'Diagnóstico, roadmap de adoção de IA e treinamentos internos.', preco: 6800, tipo: 'Serviço', recorrencia: 'Por hora', prazo: '5–15 dias', status: 'Arquivado' }
  ],

  /* ---------- Vendas / Propostas ---------- */
  vendas: [
    { id: 'v1',  cliente: 'Siqueira Seguros',     servico: 'Portal do cliente',        valor: 39800, data: '2026-09-15', status: 'Aceita',    responsavel: 'Rafael Nunes' },
    { id: 'v2',  cliente: 'Kibo Gastronomia',     servico: 'Chatbot WhatsApp IA',      valor: 15600, data: '2026-09-02', status: 'Aceita',    responsavel: 'Isaque Lopes' },
    { id: 'v3',  cliente: 'LogTech Transportes',  servico: 'Painel de rastreamento',   valor: 61000, data: '2026-08-28', status: 'Aceita',    responsavel: 'Rafael Nunes' },
    { id: 'v4',  cliente: 'Muniz Autopeças',      servico: 'E-commerce + ERP',         valor: 48000, data: '2026-09-10', status: 'Enviada',   responsavel: 'Isaque Lopes' },
    { id: 'v5',  cliente: 'Alves Odontologia',    servico: 'Plataforma de agendamento', valor: 27500, data: '2026-09-08', status: 'Enviada',  responsavel: 'Rafael Nunes' },
    { id: 'v6',  cliente: 'Moretti Distribuidora', servico: 'SaaS logístico',          valor: 65000, data: '2026-09-05', status: 'Negociação', responsavel: 'Isaque Lopes' },
    { id: 'v7',  cliente: 'Braga Papelaria',      servico: 'Loja virtual',             valor: 8600,  data: '2026-08-20', status: 'Recusada',  responsavel: 'Camila Reis' },
    { id: 'v8',  cliente: 'LP Transportes',       servico: 'Sistema de frota',         valor: 52000, data: '2026-08-12', status: 'Recusada',  responsavel: 'Isaque Lopes' },
    { id: 'v9',  cliente: 'AgroCampo Insumos',    servico: 'Automação de processos',   valor: 28000, data: '2026-07-30', status: 'Aceita',    responsavel: 'Isaque Lopes' },
    { id: 'v10', cliente: 'Freitas Eventos',      servico: 'Site + Integrações',       valor: 16700, data: '2026-09-12', status: 'Enviada',   responsavel: 'Marina Duarte' }
  ],

  vendasKpis: [
    { lb: 'Propostas enviadas', vl: '32', dl: '+6', dir: 'up', ft: 'no trimestre' },
    { lb: 'Propostas aceitas',  vl: '18', dl: '+4', dir: 'up', ft: 'no trimestre' },
    { lb: 'Propostas recusadas',vl: '7',  dl: '−2', dir: 'up', ft: 'menos recusas' },
    { lb: 'Valor vendido',      vl: 'R$ 314.600', dl: '+18,2%', dir: 'up', ft: 'no trimestre' },
    { lb: 'Ticket médio',       vl: 'R$ 17.480',  dl: '+6,4%',  dir: 'up', ft: 'por venda fechada' },
    { lb: 'Taxa de conversão',  vl: '56,3%',      dl: '+4,1pp', dir: 'up', ft: 'aceitas / enviadas' }
  ],

  vendasChart: {
    labels: ['Abr','Mai','Jun','Jul','Ago','Set'],
    vendido: [42000, 58000, 51000, 67000, 74500, 92600]
  },

  /* ---------- Financeiro ---------- */
  financeiroKpis: [
    { lb: 'Receita (mês)', vl: 'R$ 189.600', dl: '+8,4%', dir: 'up', ft: 'set/2026' },
    { lb: 'Despesas (mês)',vl: 'R$ 114.200', dl: '+3,1%', dir: 'down', ft: 'set/2026' },
    { lb: 'Lucro',         vl: 'R$ 75.400',  dl: '+16,9%', dir: 'up', ft: 'set/2026' },
    { lb: 'Margem',        vl: '39,8%',      dl: '+2,4pp', dir: 'up', ft: 'lucro / receita' },
    { lb: 'MRR',           vl: 'R$ 21.400',  dl: '+4,1%', dir: 'up', ft: 'receita recorrente' },
    { lb: 'ARR',           vl: 'R$ 256.800', dl: '+46,2%', dir: 'up', ft: 'MRR × 12' },
    { lb: 'Ticket médio',  vl: 'R$ 5.980',   dl: '+11,0%', dir: 'up', ft: 'últimos 90 dias' },
    { lb: 'CAC',           vl: 'R$ 1.240',   dl: '−8,6%', dir: 'up', ft: 'custo por cliente' },
    { lb: 'LTV',           vl: 'R$ 18.700',  dl: '+12,3%', dir: 'up', ft: 'LTV / CAC = 15,1' }
  ],

  receitas: [
    { id: 'r1',  desc: 'Mensalidade — Nexus Contabilidade', cat: 'Recorrência',  valor: 2400,  venc: '2026-10-05', pag: '2026-10-05', parte: 'Nexus Contabilidade', status: 'Pago' },
    { id: 'r2',  desc: 'Parcela 3/4 — Vertex Logística',    cat: 'Projeto',      valor: 11500, venc: '2026-09-28', pag: '—',          parte: 'Vertex Logística',    status: 'Pendente' },
    { id: 'r3',  desc: 'Mensalidade — Grupo Atlas',         cat: 'Recorrência',  valor: 6000,  venc: '2026-09-30', pag: '—',          parte: 'Grupo Atlas',         status: 'Pendente' },
    { id: 'r4',  desc: 'Chatbot Kibo — implantação',        cat: 'Projeto',      valor: 7800,  venc: '2026-09-15', pag: '2026-09-15', parte: 'Kibo Gastronomia',    status: 'Pago' },
    { id: 'r5',  desc: 'Mensalidade — AgroCampo',           cat: 'Recorrência',  valor: 2200,  venc: '2026-10-10', pag: '—',          parte: 'AgroCampo Insumos',   status: 'Pendente' },
    { id: 'r6',  desc: 'Portal do cliente — entrada',       cat: 'Projeto',      valor: 19900, venc: '2026-09-20', pag: '2026-09-20', parte: 'Siqueira Seguros',    status: 'Pago' },
    { id: 'r7',  desc: 'Mensalidade — EducaMais',           cat: 'Recorrência',  valor: 1800,  venc: '2026-09-15', pag: '—',          parte: 'EducaMais Cursos',    status: 'Atrasado' }
  ],

  despesas: [
    { id: 'd1', desc: 'Folha de pagamento',        cat: 'Pessoal',     valor: 62000, venc: '2026-09-05', pag: '2026-09-05', parte: 'Folha interna',   status: 'Pago' },
    { id: 'd2', desc: 'Servidores cloud',          cat: 'Infra',       valor: 8400,  venc: '2026-09-10', pag: '2026-09-10', parte: 'Cloud Provider',  status: 'Pago' },
    { id: 'd3', desc: 'Licenças de software',      cat: 'Ferramentas', valor: 5200,  venc: '2026-09-12', pag: '2026-09-12', parte: 'Diversos',        status: 'Pago' },
    { id: 'd4', desc: 'Tráfego pago (Google/Meta)',cat: 'Marketing',   valor: 14800, venc: '2026-09-25', pag: '—',          parte: 'Plataformas ads',   status: 'Pendente' },
    { id: 'd5', desc: 'Aluguel do escritório',     cat: 'Operacional', valor: 9600,  venc: '2026-09-28', pag: '—',          parte: 'Imobiliária Central', status: 'Pendente' },
    { id: 'd6', desc: 'API de IA (tokens)',        cat: 'Infra',       valor: 6300,  venc: '2026-09-18', pag: '2026-09-18', parte: 'AI Provider',     status: 'Pago' }
  ],

  contasReceber: [
    { id: 'cr1', desc: 'Parcela 3/4 — Vertex Logística', cliente: 'Vertex Logística',  valor: 11500, venc: '2026-09-28', status: 'Pendente' },
    { id: 'cr2', desc: 'Mensalidade — Grupo Atlas',      cliente: 'Grupo Atlas',       valor: 6000,  venc: '2026-09-30', status: 'Pendente' },
    { id: 'cr3', desc: 'Mensalidade — Nexus',            cliente: 'Nexus Contabilidade', valor: 2400, venc: '2026-10-05', status: 'Pendente' },
    { id: 'cr4', desc: 'Mensalidade — AgroCampo',        cliente: 'AgroCampo Insumos', valor: 2200,  venc: '2026-10-10', status: 'Pendente' },
    { id: 'cr5', desc: 'Mensalidade — EducaMais',        cliente: 'EducaMais Cursos',  valor: 1800,  venc: '2026-09-15', status: 'Atrasado' },
    { id: 'cr6', desc: 'Mensalidade — LogTech',          cliente: 'LogTech Transportes', valor: 3400, venc: '2026-10-08', status: 'Pendente' },
    { id: 'cr7', desc: 'Mensalidade — FarmaVida',        cliente: 'FarmaVida Rede',    valor: 900,   venc: '2026-09-29', status: 'Pendente' }
  ],

  contasPagas: [
    { id: 'cp1', desc: 'Folha de pagamento',     fornecedor: 'Folha interna',  valor: 62000, pag: '2026-09-05', cat: 'Pessoal' },
    { id: 'cp2', desc: 'Servidores cloud',       fornecedor: 'Cloud Provider', valor: 8400,  pag: '2026-09-10', cat: 'Infra' },
    { id: 'cp3', desc: 'Licenças de software',   fornecedor: 'Diversos',       valor: 5200,  pag: '2026-09-12', cat: 'Ferramentas' },
    { id: 'cp4', desc: 'API de IA (tokens)',     fornecedor: 'AI Provider',    valor: 6300,  pag: '2026-09-18', cat: 'Infra' },
    { id: 'cp5', desc: 'Contabilidade',          fornecedor: 'Nexus Contabilidade', valor: 1800, pag: '2026-09-08', cat: 'Operacional' }
  ],

  assinaturas: [
    { id: 'as1', cliente: 'Nexus Contabilidade', plano: 'Manutenção mensal',    valor: 2400, ciclo: 'Mensal',  proxima: '2026-10-05', status: 'Ativa' },
    { id: 'as2', cliente: 'Grupo Atlas',         plano: 'SaaS — módulo financeiro', valor: 6000, ciclo: 'Mensal', proxima: '2026-09-30', status: 'Ativa' },
    { id: 'as3', cliente: 'AgroCampo Insumos',   plano: 'Automação + suporte',  valor: 2200, ciclo: 'Mensal',  proxima: '2026-10-10', status: 'Ativa' },
    { id: 'as4', cliente: 'Clínica Sorriso',     plano: 'Suporte do app',       valor: 1200, ciclo: 'Mensal',  proxima: '2026-10-01', status: 'Ativa' },
    { id: 'as5', cliente: 'EducaMais Cursos',    plano: 'Plataforma EAD',       valor: 1800, ciclo: 'Mensal',  proxima: '2026-10-15', status: 'Inadimplente' },
    { id: 'as6', cliente: 'Kibo Gastronomia',    plano: 'Chatbot IA',           valor: 1300, ciclo: 'Mensal',  proxima: '2026-10-02', status: 'Ativa' },
    { id: 'as7', cliente: 'LogTech Transportes', plano: 'Painel + hospedagem',  valor: 3400, ciclo: 'Mensal',  proxima: '2026-10-08', status: 'Ativa' },
    { id: 'as8', cliente: 'FarmaVida Rede',      plano: 'Integrações — suporte', valor: 900,  ciclo: 'Mensal', proxima: '2026-09-29', status: 'Ativa' }
  ],

  categoriasFin: ['Recorrência','Projeto','Pessoal','Infra','Ferramentas','Marketing','Operacional','Impostos','Outros'],

  /* ---------- Tarefas (Kanban) ---------- */
  tarefas: [
    { id: 'tk1',  col: 'backlog',   titulo: 'Documentar API do módulo financeiro', resp: 'Bruno Sales',   prio: 'Normal',   prazo: '2026-10-20', projeto: 'p3',  checklist: [1,3] },
    { id: 'tk2',  col: 'backlog',   titulo: 'Pesquisar fornecedores de SMS',       resp: 'Camila Reis',   prio: 'Baixa',    prazo: '—',          projeto: null,  checklist: [0,2] },
    { id: 'tk3',  col: 'afazer',    titulo: 'Criar telas do onboarding — Atlas',   resp: 'Diego Martins', prio: 'Alta',     prazo: '2026-09-26', projeto: 'p3',  checklist: [0,5] },
    { id: 'tk4',  col: 'afazer',    titulo: 'Configurar webhook de pagamentos',    resp: 'Bruno Sales',   prio: 'Alta',     prazo: '2026-09-25', projeto: 'p9',  checklist: [0,3] },
    { id: 'tk5',  col: 'afazer',    titulo: 'Revisar copy da landing Prado',       resp: 'Camila Reis',   prio: 'Normal',   prazo: '2026-09-27', projeto: 'p4',  checklist: [1,2] },
    { id: 'tk6',  col: 'andamento', titulo: 'Módulo de relatórios — LogTech',      resp: 'Bruno Sales',   prio: 'Urgente',  prazo: '2026-09-24', projeto: 'p11', checklist: [3,6] },
    { id: 'tk7',  col: 'andamento', titulo: 'Fluxo de agendamento no app',         resp: 'Rafael Nunes',  prio: 'Urgente',  prazo: '2026-09-23', projeto: 'p2',  checklist: [4,7] },
    { id: 'tk8',  col: 'andamento', titulo: 'Integração API de pagamentos',        resp: 'Bruno Sales',   prio: 'Alta',     prazo: '2026-09-28', projeto: 'p9',  checklist: [2,4] },
    { id: 'tk9',  col: 'revisao',   titulo: 'Ajustes de acessibilidade — Nexus',   resp: 'Diego Martins', prio: 'Normal',   prazo: '2026-09-24', projeto: 'p5',  checklist: [5,5] },
    { id: 'tk10', col: 'revisao',   titulo: 'Testes de carga do portal Atlas',     resp: 'Rafael Nunes',  prio: 'Alta',     prazo: '2026-09-26', projeto: 'p3',  checklist: [3,4] },
    { id: 'tk11', col: 'concluido', titulo: 'Deploy do chatbot — ambiente de teste', resp: 'Bruno Sales', prio: 'Alta',     prazo: '2026-09-19', projeto: 'p9',  checklist: [4,4] },
    { id: 'tk12', col: 'concluido', titulo: 'Briefing aprovado — FarmaVida',       resp: 'Marina Duarte', prio: 'Normal',   prazo: '2026-09-17', projeto: 'p10', checklist: [3,3] },
    { id: 'tk13', col: 'concluido', titulo: 'Backup automatizado configurado',     resp: 'Paulo Rios',    prio: 'Alta',     prazo: '2026-09-15', projeto: 'p5',  checklist: [2,2] },
    { id: 'tk14', col: 'backlog',   titulo: 'Planejar campanha de fim de ano',     resp: 'Camila Reis',   prio: 'Normal',   prazo: '2026-11-01', projeto: null,  checklist: [0,4] },
    { id: 'tk15', col: 'afazer',    titulo: 'Responder ticket #1042 (checkout)',   resp: 'Paulo Rios',    prio: 'Urgente',  prazo: '2026-09-23', projeto: null,  checklist: [0,1] },
    { id: 'tk16', col: 'andamento', titulo: 'Refatorar módulo de relatórios',      resp: 'Rafael Nunes',  prio: 'Normal',   prazo: '2026-10-02', projeto: 'p1',  checklist: [2,8] }
  ],

  tarefaCols: [
    { id: 'backlog',   nome: 'Backlog' },
    { id: 'afazer',    nome: 'A fazer' },
    { id: 'andamento', nome: 'Em andamento' },
    { id: 'revisao',   nome: 'Em revisão' },
    { id: 'concluido', nome: 'Concluído' }
  ],

  prioridades: ['Baixa','Normal','Alta','Urgente'],

  /* ---------- Suporte / Tickets ---------- */
  tickets: [
    { id: 't1',  num: 1043, cliente: 'Clínica Sorriso',      assunto: 'App não envia notificações',   prio: 'Alta',    status: 'Aberto',            resp: 'Paulo Rios',   aberto: '2026-09-22', atualizado: '2026-09-22', desc: 'Notificações push pararam de chegar após atualização do app.' },
    { id: 't2',  num: 1042, cliente: 'Grupo Atlas',          assunto: 'Erro no checkout do portal',   prio: 'Urgente', status: 'Em andamento',      resp: 'Bruno Sales',  aberto: '2026-09-21', atualizado: '2026-09-22', desc: 'Checkout retorna erro 500 para cartões internacionais.' },
    { id: 't3',  num: 1041, cliente: 'Nexus Contabilidade',  assunto: 'Dúvida sobre relatório mensal', prio: 'Baixa', status: 'Aguardando cliente', resp: 'Paulo Rios', aberto: '2026-09-20', atualizado: '2026-09-21', desc: 'Cliente pede explicação de campos do relatório.' },
    { id: 't4',  num: 1040, cliente: 'LogTech Transportes',  assunto: 'Lentidão no painel em horário de pico', prio: 'Alta', status: 'Em análise', resp: 'Rafael Nunes', aberto: '2026-09-19', atualizado: '2026-09-20', desc: 'Painel fica lento entre 8h e 10h.' },
    { id: 't5',  num: 1039, cliente: 'Clínica Sorriso',      assunto: 'Agenda des sincroniza com Google', prio: 'Normal', status: 'Resolvido', resp: 'Bruno Sales', aberto: '2026-09-16', atualizado: '2026-09-18', desc: 'Eventos duplicados na sincronização.' },
    { id: 't6',  num: 1038, cliente: 'Vertex Logística',     assunto: 'Exportação CSV truncada',      prio: 'Normal',  status: 'Em andamento',      resp: 'Bruno Sales',  aberto: '2026-09-15', atualizado: '2026-09-19', desc: 'Relatórios acima de 10k linhas saem incompletos.' },
    { id: 't7',  num: 1037, cliente: 'AgroCampo Insumos',    assunto: 'Automação de e-mail não disparou', prio: 'Alta', status: 'Aberto',           resp: 'Paulo Rios',   aberto: '2026-09-14', atualizado: '2026-09-14', desc: 'Fluxo de boas-vindas parou na sexta-feira.' },
    { id: 't8',  num: 1036, cliente: 'EducaMais Cursos',     assunto: 'Vídeos não carregam no mobile', prio: 'Urgente', status: 'Em análise',       resp: 'Rafael Nunes', aberto: '2026-09-12', atualizado: '2026-09-18', desc: 'Player trava em conexões 4G.' },
    { id: 't9',  num: 1035, cliente: 'FarmaVida Rede',       assunto: 'Token da API expirando',       prio: 'Normal',  status: 'Resolvido',         resp: 'Bruno Sales',  aberto: '2026-09-10', atualizado: '2026-09-12', desc: 'Renovação automática de token falhando.' },
    { id: 't10', num: 1034, cliente: 'Kibo Gastronomia',     assunto: 'Chatbot responde fora do horário', prio: 'Baixa', status: 'Fechado',          resp: 'Paulo Rios',   aberto: '2026-09-05', atualizado: '2026-09-09', desc: 'Configuração de horário de atendimento.' }
  ],

  ticketStatus: ['Aberto','Em análise','Em andamento','Aguardando cliente','Resolvido','Fechado'],

  /* ---------- Analytics ---------- */
  analyticsKpis: [
    { lb: 'Visitantes',       vl: '12.480', dl: '+18,3%', dir: 'up', ft: 'últimos 30 dias' },
    { lb: 'Sessões',          vl: '21.905', dl: '+14,7%', dir: 'up', ft: 'últimos 30 dias' },
    { lb: 'Leads gerados',    vl: '172',    dl: '+14,2%', dir: 'up', ft: 'formulários + chat' },
    { lb: 'Conversões',       vl: '37',     dl: '+8,8%',  dir: 'up', ft: 'objetivos concluídos' },
    { lb: 'Taxa de conversão',vl: '3,0%',   dl: '+0,2pp', dir: 'up', ft: 'visita → conversão' }
  ],

  trafegoChart: {
    labels: ['Sem 1','Sem 2','Sem 3','Sem 4'],
    series: [
      { nome: 'Visitantes', dados: [2600,2980,3240,3660], cor: 'a' },
      { nome: 'Leads',      dados: [34,40,44,54],         cor: 'b' }
    ]
  },

  conversoesChart: {
    labels: ['Abr','Mai','Jun','Jul','Ago','Set'],
    dados: [18,22,20,27,31,37]
  },

  origens: [
    { nome: 'Orgânico (Google)', pct: 38, cor: 'a' },
    { nome: 'Google Ads',        pct: 24, cor: 'b' },
    { nome: 'Instagram / Meta',  pct: 17, cor: 'c' },
    { nome: 'Direto',            pct: 12, cor: 'd' },
    { nome: 'Indicações',        pct: 9,  cor: 'e' }
  ],

  paginasTop: [
    { url: '/',                       views: 4820, pct: 100 },
    { url: '/servicos/chatbot-ia',    views: 2140, pct: 44 },
    { url: '/servicos/automacao',     views: 1690, pct: 35 },
    { url: '/portfolio',              views: 1230, pct: 26 },
    { url: '/contato',                views: 980,  pct: 20 },
    { url: '/sobre',                  views: 640,  pct: 13 }
  ],

  servicosProcurados: [
    { nome: 'Chatbot com IA',          leads: 52, pct: 100 },
    { nome: 'Automação de processos',  leads: 41, pct: 79 },
    { nome: 'Sistema personalizado',   leads: 33, pct: 63 },
    { nome: 'Landing page',            leads: 24, pct: 46 },
    { nome: 'Site institucional',      leads: 14, pct: 27 },
    { nome: 'Integração de APIs',      leads: 8,  pct: 15 }
  ],

  /* ---------- Automações ---------- */
  automacoes: [
    { id: 'a1', nome: 'Novo lead → CRM',            status: 'Ativa',     ultima: '2026-09-22 09:14', exec: 1284, erros: 0,
      fluxo: ['Novo lead capturado','Criar lead no CRM','Notificar comercial','Criar tarefa de follow-up'] },
    { id: 'a2', nome: 'Boas-vindas de cliente',     status: 'Ativa',     ultima: '2026-09-22 08:02', exec: 96,   erros: 1,
      fluxo: ['Cliente cadastrado','Enviar e-mail de boas-vindas','Criar pasta no Arquivos','Agendar reunião de kickoff'] },
    { id: 'a3', nome: 'Cobrança recorrente',        status: 'Ativa',     ultima: '2026-09-21 18:00', exec: 420,  erros: 3,
      fluxo: ['Verificar assinaturas do dia','Gerar cobrança','Enviar lembrete 3 dias antes','Registrar no financeiro'] },
    { id: 'a4', nome: 'Alerta de prazo de projeto', status: 'Ativa',     ultima: '2026-09-22 07:30', exec: 312,  erros: 0,
      fluxo: ['Projetos com prazo < 7 dias','Notificar responsável','Atualizar dashboard'] },
    { id: 'a5', nome: 'Triagem de tickets',         status: 'Com erro',  ultima: '2026-09-20 14:22', exec: 187,  erros: 12,
      fluxo: ['Ticket recebido','Classificar prioridade com IA','Atribuir responsável','Notificar cliente'] },
    { id: 'a6', nome: 'Relatório semanal',          status: 'Pausada',   ultima: '2026-09-13 08:00', exec: 64,   erros: 0,
      fluxo: ['Coletar métricas da semana','Gerar PDF','Enviar para liderança'] },
    { id: 'a7', nome: 'Backup diário de arquivos',  status: 'Ativa',     ultima: '2026-09-22 03:00', exec: 730,  erros: 2,
      fluxo: ['Listar novos arquivos','Copiar para storage','Verificar integridade','Registrar log'] }
  ],

  /* ---------- Arquivos ---------- */
  arquivoPastas: ['Clientes','Projetos','Contratos','Briefings','Designs','Documentos','Entregáveis'],

  arquivos: [
    { id: 'f1',  nome: 'contrato-vertex-logistica.pdf',    pasta: 'Contratos',   tipo: 'pdf',  tam: '1,2 MB', mod: '2026-09-10', por: 'Marina Duarte' },
    { id: 'f2',  nome: 'briefing-app-clinica-sorriso.docx', pasta: 'Briefings',  tipo: 'doc',  tam: '340 KB', mod: '2026-08-28', por: 'Rafael Nunes' },
    { id: 'f3',  nome: 'logo-grupo-atlas-v3.svg',           pasta: 'Designs',    tipo: 'img',  tam: '88 KB',  mod: '2026-09-02', por: 'Diego Martins' },
    { id: 'f4',  nome: 'prototipo-portal-atlas.fig',        pasta: 'Designs',    tipo: 'design', tam: '12,4 MB', mod: '2026-09-18', por: 'Diego Martins' },
    { id: 'f5',  nome: 'relatorio-financeiro-ago.xlsx',     pasta: 'Documentos', tipo: 'sheet', tam: '210 KB', mod: '2026-09-05', por: 'Helena Costa' },
    { id: 'f6',  nome: 'entrega-landing-prado.zip',         pasta: 'Entregáveis', tipo: 'zip',  tam: '8,9 MB', mod: '2026-09-14', por: 'Bruno Sales' },
    { id: 'f7',  nome: 'ficha-cadastro-nexus.pdf',          pasta: 'Clientes',   tipo: 'pdf',  tam: '540 KB', mod: '2026-07-20', por: 'Marina Duarte' },
    { id: 'f8',  nome: 'escopo-sistema-vertex.pdf',         pasta: 'Projetos',   tipo: 'pdf',  tam: '2,1 MB', mod: '2026-06-18', por: 'Rafael Nunes' },
    { id: 'f9',  nome: 'politica-privacidade-orvex.docx',   pasta: 'Documentos', tipo: 'doc',  tam: '96 KB',  mod: '2026-05-30', por: 'Isaque Lopes' },
    { id: 'f10', nome: 'apresentacao-comercial.pptx',       pasta: 'Documentos', tipo: 'slide', tam: '4,6 MB', mod: '2026-09-01', por: 'Camila Reis' },
    { id: 'f11', nome: 'contrato-agrocampo.pdf',            pasta: 'Contratos',  tipo: 'pdf',  tam: '980 KB', mod: '2026-04-08', por: 'Marina Duarte' },
    { id: 'f12', nome: 'mockups-chatbot-kibo.png',          pasta: 'Designs',    tipo: 'img',  tam: '3,2 MB', mod: '2026-08-15', por: 'Diego Martins' }
  ],

  /* ---------- Notificações ---------- */
  notificacoes: [
    { id: 'n1', ico: 'inbox',   txt: 'Novo lead: Bella Moda Boutique (loja virtual)', ago: 'há 5 min',   lida: false, rota: '#/leads' },
    { id: 'n2', ico: 'credit',  txt: 'Pagamento recebido: R$ 19.900 · Siqueira Seguros', ago: 'há 1 h',  lida: false, rota: '#/financeiro' },
    { id: 'n3', ico: 'alert',   txt: 'Projeto App Clínica Sorriso vence em 4 dias',   ago: 'há 2 h',     lida: false, rota: '#/projetos/p2' },
    { id: 'n4', ico: 'ticket',  txt: 'Ticket #1042 atualizado — erro no checkout',    ago: 'há 3 h',     lida: false, rota: '#/suporte' },
    { id: 'n5', ico: 'clock',   txt: 'Tarefa atrasada: Responder ticket #1042',       ago: 'há 4 h',     lida: true,  rota: '#/tarefas' },
    { id: 'n6', ico: 'user-plus', txt: 'Novo cliente: Vertex Logística',              ago: 'ontem',      lida: true,  rota: '#/clientes' },
    { id: 'n7', ico: 'alert',   txt: 'Automação "Triagem de tickets" com erro',       ago: 'ontem',      lida: true,  rota: '#/automacoes' },
    { id: 'n8', ico: 'check',   txt: 'Proposta aceita: Portal do cliente · R$ 39.800', ago: 'há 2 dias', lida: true,  rota: '#/vendas' }
  ],

  /* ---------- Configurações ---------- */
  integracoes: [
    { nome: 'WhatsApp Business API', cat: 'Mensageria',  status: 'Conectado' },
    { nome: 'Google Ads',            cat: 'Marketing',   status: 'Conectado' },
    { nome: 'Meta Ads',              cat: 'Marketing',   status: 'Conectado' },
    { nome: 'Gateway de pagamento',  cat: 'Financeiro',  status: 'Conectado' },
    { nome: 'Slack',                 cat: 'Produtividade', status: 'Desconectado' },
    { nome: 'Zapier',                cat: 'Automação',   status: 'Desconectado' }
  ],

  sessoesAtivas: [
    { disp: 'Chrome · Windows 11', local: 'São Paulo, BR', ip: '189.0.0.12', atual: true,  inicio: '2026-09-22 08:12' },
    { disp: 'Safari · iPhone 15',  local: 'São Paulo, BR', ip: '189.0.0.44', atual: false, inicio: '2026-09-21 19:40' },
    { disp: 'Firefox · macOS',     local: 'Campinas, BR',  ip: '201.7.0.88', atual: false, inicio: '2026-09-18 10:05' }
  ],

  logsAcesso: [
    { user: 'Isaque Lopes',  acao: 'Login',            ip: '189.0.0.12', data: '2026-09-22 08:12' },
    { user: 'Marina Duarte', acao: 'Cliente criado',   ip: '189.0.0.20', data: '2026-09-22 07:58' },
    { user: 'Bruno Sales',   acao: 'Deploy automação', ip: '201.7.0.15', data: '2026-09-21 17:33' },
    { user: 'Paulo Rios',    acao: 'Ticket atualizado',ip: '189.0.0.31', data: '2026-09-21 15:02' },
    { user: 'Isaque Lopes',  acao: 'Permissão alterada',ip: '189.0.0.12', data: '2026-09-20 11:47' }
  ]
};
