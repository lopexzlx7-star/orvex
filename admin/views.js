/* ORVEX — Painel interno · módulos (views) */
'use strict';

function card(title, meta, body, cls) {
  return '<div class="card ' + (cls || '') + '">' +
    (title ? '<div class="card-h"><h3>' + esc(title) + '</h3>' + (meta ? '<span class="mono">' + meta + '</span>' : '') + '</div>' : '') +
    '<div class="card-b">' + body + '</div></div>';
}
function ini(nome) {
  return nome.split(' ').map(function (p) { return p[0]; }).slice(0, 2).join('').toUpperCase();
}
function diasRestantes(iso) {
  var d = Math.ceil((new Date(iso + 'T12:00:00') - new Date()) / 86400000);
  if (isNaN(d)) return null;
  return d;
}
function prazoTxt(iso) {
  var d = diasRestantes(iso);
  if (d == null) return '—';
  if (d < 0) return '<span style="color:var(--danger)">' + Math.abs(d) + ' dias em atraso</span>';
  if (d === 0) return '<span style="color:var(--warn)">vence hoje</span>';
  return d + (d === 1 ? ' dia' : ' dias');
}

/* ==================================================================
   1. DASHBOARD
   ================================================================== */
App.page('dashboard', {
  crumb: 'Dashboard',
  render: function (view) {
    var per = '30d';
    App.setPage('Dashboard', 'Visão geral da operação da agência em tempo real.',
      '<div class="seg" id="perSeg">' +
      [['7d', '7 dias'], ['30d', '30 dias'], ['90d', '90 dias'], ['12m', '12 meses']]
        .map(function (o) { return '<button data-p="' + o[0] + '" class="' + (o[0] === per ? 'on' : '') + '">' + o[1] + '</button>'; }).join('') +
      '</div>');

    view.innerHTML = '<div id="dbKpis"></div>' +
      '<div class="grid g-31" style="margin-top:14px">' +
        '<div class="card"><div class="card-h"><h3>Desempenho financeiro</h3><span class="mono" id="finLbl"></span></div>' +
        '<div class="card-b"><div id="finChart"></div><div id="finSum" style="margin-top:14px"></div></div></div>' +
        '<div class="card"><div class="card-h"><h3>Funil comercial</h3><span class="mono">30 dias</span></div>' +
        '<div class="card-b" id="funilBox"></div></div>' +
      '</div>' +
      '<div class="grid g-31" style="margin-top:14px">' +
        '<div id="projetosBox"></div>' +
        '<div class="card"><div class="card-h"><h3>Atividade recente</h3></div><div id="ativBox" style="padding:0"></div></div>' +
      '</div>';

    function drawFin() {
      var f = DB.financeiroChart[per];
      var lucro = f.receita.map(function (r, i) { return r - f.despesas[i]; });
      var host = document.getElementById('finChart');
      host.innerHTML = '';
      host.appendChild(App.barChart({
        labels: f.labels,
        series: [
          { nome: 'Receita', dados: f.receita, cls: '' },
          { nome: 'Despesas', dados: f.despesas, cls: 'b2' },
          { nome: 'Lucro', dados: lucro, cls: 'b3' }
        ]
      }));
      var rec = f.receita.reduce(function (a, b) { return a + b; }, 0);
      var des = f.despesas.reduce(function (a, b) { return a + b; }, 0);
      var luc = rec - des;
      document.getElementById('finSum').innerHTML =
        '<div class="legend" style="margin-bottom:10px"><span><i></i>Receita</span><span><i class="l2"></i>Despesas</span><span><i class="l3"></i>Lucro</span></div>' +
        '<div class="grid" style="grid-template-columns:repeat(4,1fr);gap:10px">' +
        [['Receita bruta', brl(rec)], ['Despesas', brl(des)], ['Lucro líquido', brl(luc)], ['Margem', ((luc / rec) * 100).toFixed(1).replace('.', ',') + '%']]
          .map(function (k) { return '<div><div class="small" style="font-size:11px">' + k[0] + '</div><div class="num" style="font-weight:500">' + k[1] + '</div></div>'; }).join('') + '</div>';
      document.getElementById('finLbl').textContent = { '7d': 'últimos 7 dias', '30d': 'últimos 30 dias', '90d': 'últimos 90 dias', '12m': 'últimos 12 meses' }[per];
    }

    function draw() {
      document.getElementById('dbKpis').innerHTML = App.kpis(DB.kpis[per]);
      drawFin();
      document.getElementById('funilBox').innerHTML = App.funnel(DB.funil);

      var ativos = DB.projetos.filter(function (p) { return ['Concluído', 'Pausado'].indexOf(p.status) === -1; }).slice(0, 4);
      document.getElementById('projetosBox').innerHTML = card('Projetos ativos', ativos.length + ' em andamento',
        '<div class="list" style="margin:-6px -18px -18px">' + ativos.map(function (p) {
          return '<div class="li"><span class="ico">' + icon('briefcase', 14) + '</span>' +
            '<span class="grow"><span class="t1">' + esc(p.nome) + '</span>' +
            '<span class="t2">' + esc(App.clienteNome(p.cliente)) + ' · ' + esc(p.responsavel) + ' · prazo ' + prazoTxt(p.prazo) + '</span></span>' +
            '<span style="width:86px">' + App.prog(p.progresso) + '</span>' +
            '<span class="rt">' + App.badge(p.status) + '</span>' +
            '<a class="btn btn-g btn-sm" href="#/projetos/' + p.id + '">Ver projeto</a></div>';
        }).join('') + '</div>');

      document.getElementById('ativBox').innerHTML = '<div class="list">' + DB.atividade.slice(0, 7).map(function (a) {
        return '<div class="li"><span class="ico">' + icon(a.ico, 14) + '</span>' +
          '<span class="grow"><span class="t1">' + esc(a.txt) + '</span><span class="t2">' + esc(a.det) + ' · ' + esc(a.user) + '</span></span>' +
          '<span class="rt">' + esc(a.ago) + '</span></div>';
      }).join('') + '</div>';
    }
    draw();

    document.getElementById('perSeg').addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-p]');
      if (!b) return;
      per = b.dataset.p;
      this.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
      draw();
    });
  }
});

/* ==================================================================
   2. CLIENTES  (+ detalhe)
   ================================================================== */
function novoClienteModal(after) {
  App.modal({
    title: 'Novo cliente',
    body: '<div class="frow">' +
      App.field('Nome do contato', '<input class="in" id="ncNome">') +
      App.field('Empresa', '<input class="in" id="ncEmp">') + '</div>' +
      '<div class="frow">' +
      App.field('E-mail', '<input class="in" type="email" id="ncEmail">') +
      App.field('Telefone', '<input class="in" id="ncFone">') + '</div>' +
      '<div class="frow">' +
      App.field('Serviço', App.select(DB.servicos.filter(function (s) { return s.status === 'Ativo'; }).map(function (s) { return s.nome; }))) +
      App.field('Responsável', App.select(DB.equipe.map(function (u) { return u.nome; }))) + '</div>',
    actions: [
      { lb: 'Cancelar', cls: 'btn-g' },
      { lb: 'Cadastrar cliente', cls: 'btn-p', onClick: function (close, box) {
        var nome = box.querySelector('#ncNome').value.trim(), emp = box.querySelector('#ncEmp').value.trim();
        if (!nome || !emp) { App.toast('Preencha nome e empresa.', 'warn'); return; }
        DB.clientes.unshift({ id: 'c' + Date.now(), nome: nome, empresa: emp, servico: box.querySelectorAll('select')[0].value,
          status: 'Ativo', valor: 0, ultimoContato: new Date().toISOString().slice(0, 10), proxPagamento: '—',
          responsavel: box.querySelectorAll('select')[1].value, email: box.querySelector('#ncEmail').value || '—',
          telefone: box.querySelector('#ncFone').value || '—', entrada: new Date().toISOString().slice(0, 10),
          mensalidade: 0, contratado: 0, statusFin: 'Em dia', projetos: [], tickets: [] });
        close(); App.toast('Cliente "' + emp + '" cadastrado.'); after && after();
      } }
    ]
  });
}

App.page('clientes', {
  crumb: 'Clientes',
  render: function (view) {
    var pact = App.setPage('Clientes', 'Carteira de clientes da agência com situação financeira e contratos.');
    var b = el('<button class="btn btn-p">' + icon('plus', 14) + ' Novo cliente</button>');
    b.addEventListener('click', function () { novoClienteModal(function () { App.navigate(); }); });
    pact.appendChild(b);

    var host = el('<div class="card"></div>');
    view.appendChild(host);
    host.appendChild(App.table({
      pageSize: 8,
      cols: [
        { lb: 'Cliente', render: function (r) { return '<div class="nm">' + esc(r.empresa) + '</div><div class="sub">' + esc(r.nome) + '</div>'; } },
        { lb: 'Serviço', k: 'servico' },
        { lb: 'Status', k: 'status', render: function (r) { return App.badge(r.status); } },
        { lb: 'Valor', k: 'valor', render: function (r) { return '<span class="num">' + brl(r.valor) + '</span>'; } },
        { lb: 'Último contato', k: 'ultimoContato', render: function (r) { return fmtData(r.ultimoContato); } },
        { lb: 'Próx. pagamento', k: 'proxPagamento', render: function (r) { return fmtData(r.proxPagamento); } },
        { lb: 'Financeiro', k: 'statusFin', render: function (r) { return App.badge(r.statusFin); } },
        { lb: 'Responsável', k: 'responsavel' }
      ],
      rows: DB.clientes,
      search: function (r) { return r.nome + ' ' + r.empresa + ' ' + r.servico + ' ' + r.responsavel; },
      onRow: function (r) { App.go('#/clientes/' + r.id); },
      empty: 'Você ainda não possui clientes cadastrados.',
      emptyAction: { act: 'novo', lb: '+ Novo cliente' },
      actions: { novo: function () { novoClienteModal(function () { App.navigate(); }); } }
    }));
  },

  detail: function (params, view) {
    var c = App.cliente(params.id);
    if (!c) { view.innerHTML = App.empty('Cliente não encontrado', 'Ele pode ter sido removido.'); return; }
    App.setPage(c.empresa, c.nome + ' · cliente desde ' + fmtData(c.entrada),
      '<a class="btn btn-g" href="#/clientes">' + icon('chev-l', 14) + ' Voltar</a>' +
      '<button class="btn btn-p" id="cEdit">Editar</button>');
    document.getElementById('cEdit').addEventListener('click', function () { App.toast('Modo de edição disponível na versão conectada ao banco.', 'warn'); });

    var projetos = DB.projetos.filter(function (p) { return p.cliente === c.id; });
    var tickets = DB.tickets.filter(function (t) { return t.cliente === c.empresa; });
    var vendas = DB.vendas.filter(function (v) { return v.cliente === c.empresa; });

    view.innerHTML = '<div class="dgrid">' +
      '<div style="display:flex;flex-direction:column;gap:14px">' +
        card('Informações', '', '<dl class="kv">' +
          [['Nome', c.nome], ['Empresa', c.empresa], ['E-mail', c.email], ['Telefone', c.telefone],
           ['Status', App.badge(c.status)], ['Entrada', fmtData(c.entrada)], ['Responsável', c.responsavel]]
            .map(function (k) { return '<dt>' + k[0] + '</dt><dd>' + (k[1].indexOf ? (k[1].indexOf('<span') === 0 ? k[1] : esc(k[1])) : k[1]) + '</dd>'; }).join('') +
          '</dl>') +
        card('Projetos', projetos.length + ' projeto(s)', projetos.length
          ? '<div class="list" style="margin:-6px -18px -18px">' + projetos.map(function (p) {
              return '<a class="li" href="#/projetos/' + p.id + '"><span class="ico">' + icon('briefcase', 14) + '</span>' +
                '<span class="grow"><span class="t1">' + esc(p.nome) + '</span><span class="t2">' + esc(p.status) + ' · ' + p.progresso + '% · prazo ' + prazoTxt(p.prazo) + '</span></span>' +
                '<span style="width:70px">' + App.prog(p.progresso) + '</span></a>';
            }).join('') + '</div>'
          : App.empty('Nenhum projeto ainda.', 'Projetos deste cliente aparecerão aqui.')) +
        card('Suporte', tickets.length + ' ticket(s)', tickets.length
          ? '<div class="list" style="margin:-6px -18px -18px">' + tickets.map(function (t) {
              return '<div class="li"><span class="ico">' + icon('ticket', 14) + '</span>' +
                '<span class="grow"><span class="t1">#' + t.num + ' · ' + esc(t.assunto) + '</span><span class="t2">' + esc(t.resp) + ' · atualizado ' + fmtData(t.atualizado) + '</span></span>' +
                App.badge(t.status) + '</div>';
            }).join('') + '</div>'
          : App.empty('Sem tickets.', 'Nenhuma solicitação de suporte registrada.')) +
      '</div>' +
      '<div style="display:flex;flex-direction:column;gap:14px">' +
        card('Financeiro', '', '<dl class="kv">' +
          [['Valor contratado', brl(c.contratado)], ['Mensalidade', c.mensalidade ? brl(c.mensalidade) : '—'],
           ['Pagamentos', vendas.filter(function (v) { return v.status === 'Aceita'; }).length + ' vendas'],
           ['Próx. vencimento', fmtData(c.proxPagamento)], ['Situação', '']] .map(function (k) {
            return '<dt>' + k[0] + '</dt><dd>' + (k[1] || '') + '</dd>';
          }).join('') +
          '<dt>Situação</dt><dd>' + App.badge(c.statusFin) + '</dd></dl>') +
        card('Atividade', '', '<div class="list" style="margin:-6px -18px -18px">' +
          [{ i: 'credit', t: 'Pagamento registrado', d: fmtData(c.ultimoContato) },
           { i: 'refresh', t: 'Última interação comercial', d: fmtData(c.ultimoContato) },
           { i: 'file', t: 'Contrato assinado', d: fmtData(c.entrada) },
           { i: 'user-plus', t: 'Cliente cadastrado', d: fmtData(c.entrada) }]
            .map(function (a) { return '<div class="li"><span class="ico">' + icon(a.i, 14) + '</span><span class="grow"><span class="t1">' + a.t + '</span></span><span class="rt">' + a.d + '</span></div>'; }).join('') +
          '</div>') +
      '</div></div>';
  }
});

/* ==================================================================
   3. LEADS / CRM
   ================================================================== */
function novoLeadModal(after) {
  App.modal({
    title: 'Novo lead',
    body: '<div class="frow">' +
      App.field('Nome', '<input class="in" id="nlNome">') +
      App.field('Empresa', '<input class="in" id="nlEmp">') + '</div>' +
      '<div class="frow">' +
      App.field('Serviço de interesse', App.select(DB.servicos.map(function (s) { return s.nome; }))) +
      App.field('Valor potencial (R$)', '<input class="in" type="number" id="nlVal" placeholder="0">') + '</div>' +
      '<div class="frow">' +
      App.field('Origem', App.select(['Formulário do site', 'Google Ads', 'Instagram Ads', 'Indicação', 'LinkedIn', 'Orgânico', 'Evento / Feira'])) +
      App.field('Responsável', App.select(DB.equipe.map(function (u) { return u.nome; }))) + '</div>',
    actions: [
      { lb: 'Cancelar', cls: 'btn-g' },
      { lb: 'Criar lead', cls: 'btn-p', onClick: function (close, box) {
        var nome = box.querySelector('#nlNome').value.trim();
        if (!nome) { App.toast('Informe o nome do lead.', 'warn'); return; }
        DB.leads.push({ id: 'l' + Date.now(), col: 'novo', nome: nome,
          empresa: box.querySelector('#nlEmp').value.trim() || '—',
          servico: box.querySelectorAll('select')[0].value,
          valor: +box.querySelector('#nlVal').value || 0,
          origem: box.querySelectorAll('select')[1].value,
          responsavel: box.querySelectorAll('select')[2].value,
          ultima: new Date().toISOString().slice(0, 10), proxima: 'Primeiro contato' });
        close(); App.toast('Lead criado na coluna "Novo".'); after && after();
      } }
    ]
  });
}

App.page('leads', {
  crumb: 'Leads / CRM',
  render: function (view) {
    App.setPage('Leads / CRM', 'Pipeline comercial — arraste os cards entre as etapas do funil.');
    var pact = document.getElementById('pAct');
    var b = el('<button class="btn btn-p">' + icon('plus', 14) + ' Novo lead</button>');
    b.addEventListener('click', function () { novoLeadModal(rerender); });
    pact.appendChild(b);

    var host = el('<div class="card"></div>');
    view.appendChild(host);
    var kb;
    function rerender() {
      if (kb) kb.remove();
      kb = App.kanban({
        cols: DB.leadCols,
        items: DB.leads,
        colOf: function (l) { return l.col; },
        card: function (l) {
          return '<div class="t">' + esc(l.nome) + '</div>' +
            '<div class="m"><span>' + esc(l.empresa) + '</span>·<span>' + esc(l.servico) + '</span></div>' +
            '<div class="rw"><span class="num" style="font-weight:500;color:var(--text)">' + brl(l.valor) + '</span>' +
            '<span class="av" style="width:24px;height:24px;font-size:9.5px" title="' + esc(l.responsavel) + '">' + ini(l.responsavel) + '</span></div>' +
            '<div class="m"><span>' + esc(l.origem) + '</span>·<span>' + fmtData(l.ultima) + '</span></div>' +
            '<div class="m" style="border-top:1px dashed var(--line);padding-top:7px">Próx.: ' + esc(l.proxima) + '</div>';
        },
        onMove: function (id, col) {
          var l = DB.leads.filter(function (x) { return x.id === id; })[0];
          if (!l || l.col === col) return;
          var de = DB.leadCols.filter(function (c) { return c.id === l.col; })[0].nome;
          var para = DB.leadCols.filter(function (c) { return c.id === col; })[0].nome;
          l.col = col;
          l.ultima = new Date().toISOString().slice(0, 10);
          rerender();
          App.toast(l.nome + ': ' + de + ' → ' + para);
          if (col === 'fechado') App.toast('Lead fechado! Converta em cliente na aba Clientes.', 'warn');
        },
        emptyMsg: 'Solte um lead aqui'
      });
      host.appendChild(kb);
    }
    rerender();
  }
});

/* ==================================================================
   4. PROJETOS (+ detalhe)
   ================================================================== */
App.page('projetos', {
  crumb: 'Projetos',
  render: function (view) {
    App.setPage('Projetos', 'Acompanhamento de escopo, prazo, progresso e entregas.');
    var pact = document.getElementById('pAct');
    var b = el('<button class="btn btn-p">' + icon('plus', 14) + ' Novo projeto</button>');
    b.addEventListener('click', function () { App.toast('Criação de projeto libera após conectar o banco de dados.', 'warn'); });
    pact.appendChild(b);

    var host = el('<div class="card"></div>');
    view.appendChild(host);
    host.appendChild(App.table({
      pageSize: 10,
      cols: [
        { lb: 'Projeto', k: 'nome', render: function (r) { return '<div class="nm">' + esc(r.nome) + '</div><div class="sub">' + esc(App.servico(r.servico)) + '</div>'; } },
        { lb: 'Cliente', render: function (r) { return esc(App.clienteNome(r.cliente)); } },
        { lb: 'Responsável', k: 'responsavel' },
        { lb: 'Status', k: 'status', render: function (r) { return App.badge(r.status); } },
        { lb: 'Prioridade', k: 'prioridade', render: function (r) { return App.prio(r.prioridade); } },
        { lb: 'Progresso', k: 'progresso', render: function (r) { return '<div style="display:flex;align-items:center;gap:9px">' + App.prog(r.progresso) + '<span class="num small">' + r.progresso + '%</span></div>'; } },
        { lb: 'Prazo', k: 'prazo', render: function (r) { return fmtData(r.prazo) + ' <span class="sub">(' + prazoTxt(r.prazo) + ')</span>'; } },
        { lb: 'Orçamento', k: 'orcamento', render: function (r) { return '<span class="num">' + brl(r.orcamento) + '</span>'; } }
      ],
      rows: DB.projetos,
      search: function (r) { return r.nome + ' ' + r.responsavel + ' ' + r.status + ' ' + App.clienteNome(r.cliente); },
      onRow: function (r) { App.go('#/projetos/' + r.id); },
      empty: 'Você ainda não possui projetos ativos.',
      emptyAction: { act: 'np', lb: '+ Criar projeto' },
      actions: { np: function () { App.toast('Criação de projeto libera após conectar o banco.', 'warn'); } }
    }));
  },

  detail: function (params, view) {
    var p = App.projeto(params.id);
    if (!p) { view.innerHTML = App.empty('Projeto não encontrado', 'Volte para a lista de projetos.'); return; }
    var c = App.cliente(p.cliente) || { empresa: '—', nome: '—' };
    App.setPage(p.nome, c.empresa + ' · ' + App.servico(p.servico),
      '<a class="btn btn-g" href="#/projetos">' + icon('chev-l', 14) + ' Voltar</a>');

    var tl = DB.projetoTimeline[p.id] || DB.projetoFases.slice(0, 7).map(function (f, i) {
      return { f: f, d: i < p.fase ? '2026-0' + Math.min(9, i + 3) + '-01' : '—', done: i < p.fase - 1 || (i === p.fase - 1 && p.progresso === 100) };
    });
    var tarefas = DB.tarefas.filter(function (t) { return t.projeto === p.id; });
    var arquivos = DB.arquivos.filter(function (f) { return f.pasta === 'Projetos' || f.pasta === 'Designs'; }).slice(0, 3);

    view.innerHTML = '<div class="dgrid">' +
      '<div style="display:flex;flex-direction:column;gap:14px">' +
        card('Visão geral', App.badge(p.status), '<dl class="kv">' +
          [['Cliente', '<a href="#/clientes/' + c.id + '">' + esc(c.empresa) + '</a>'],
           ['Responsável', esc(p.responsavel)], ['Prazo', fmtData(p.prazo) + ' (' + prazoTxt(p.prazo) + ')'],
           ['Orçamento', brl(p.orcamento)], ['Prioridade', '']] .map(function (k) {
            return '<dt>' + k[0] + '</dt><dd>' + (k[1] || '') + '</dd>';
          }).join('') +
          '<dt>Prioridade</dt><dd>' + App.prio(p.prioridade) + '</dd>' +
          '<dt>Progresso</dt><dd><div style="display:flex;align-items:center;gap:10px;max-width:260px">' + App.prog(p.progresso) + '<span class="num">' + p.progresso + '%</span></div></dd></dl>') +
        card('Tarefas do projeto', tarefas.length, tarefas.length
          ? '<div class="list" style="margin:-6px -18px -18px">' + tarefas.map(function (t) {
              return '<div class="li"><span class="ico">' + icon(t.col === 'concluido' ? 'check' : 'check-square', 14) + '</span>' +
                '<span class="grow"><span class="t1">' + esc(t.titulo) + '</span><span class="t2">' + esc(t.resp) + ' · checklist ' + t.checklist[0] + '/' + t.checklist[1] + '</span></span>' +
                App.prio(t.prio) + '</div>';
            }).join('') + '</div>'
          : App.empty('Sem tarefas', 'Crie tarefas no módulo Tarefas e vincule a este projeto.')) +
        card('Comentários', '', '<div class="li" style="padding-left:0"><span class="av">' + ini(DB.usuario.nome) + '</span>' +
          '<input class="in" style="flex:1" placeholder="Escreva um comentário…"><button class="btn btn-p btn-sm" id="pjCom">Enviar</button></div>' +
          '<div class="list" style="margin-top:6px"><div class="li" style="padding-left:0"><span class="av">' + ini(p.responsavel) + '</span>' +
          '<span class="grow"><span class="t1">' + esc(p.responsavel) + '</span><span class="t2">' +
          (p.progresso > 80 ? 'Últimos ajustes em revisão, entrega em breve.' : p.progresso > 40 ? 'Sprint desta semana seguindo o cronograma.' : 'Fase inicial — alinhando escopo com o cliente.') + '</span></span><span class="rt">há 1 dia</span></div></div>') +
      '</div>' +
      '<div style="display:flex;flex-direction:column;gap:14px">' +
        card('Timeline', '', '<ul class="tl">' + tl.map(function (t) {
          return '<li class="' + (t.done ? 'done' : '') + '"><div class="t1">' + esc(t.f) + '</div><div class="t2">' + (t.d === '—' ? 'pendente' : fmtData(t.d)) + '</div></li>';
        }).join('') + '</ul>') +
        card('Arquivos', '', '<div class="list" style="margin:-6px -18px -18px">' + arquivos.map(function (f) {
          return '<div class="li"><span class="ico">' + icon('file', 14) + '</span><span class="grow"><span class="t1">' + esc(f.nome) + '</span><span class="t2">' + esc(f.pasta) + ' · ' + f.tam + '</span></span></div>';
        }).join('') + '</div>') +
        card('Histórico', '', '<div class="list" style="margin:-6px -18px -18px">' +
          [{ i: 'refresh', t: 'Status alterado para ' + p.status, d: 'há 2 dias' },
           { i: 'check', t: 'Marco concluído: aprovação de design', d: 'há 1 semana' },
           { i: 'user-plus', t: 'Projeto iniciado', d: fmtData('2026-0' + Math.min(9, p.fase + 2) + '-01') }]
            .map(function (h) { return '<div class="li"><span class="ico">' + icon(h.i, 13) + '</span><span class="grow"><span class="t1">' + h.t + '</span></span><span class="rt">' + h.d + '</span></div>'; }).join('') + '</div>') +
      '</div></div>';

    var pc = document.getElementById('pjCom');
    if (pc) pc.addEventListener('click', function () { App.toast('Comentários serão persistidos com o banco de dados.', 'warn'); });
  }
});

/* ==================================================================
   5. SERVIÇOS
   ================================================================== */
App.page('servicos', {
  crumb: 'Serviços',
  render: function (view) {
    App.setPage('Serviços', 'Catálogo administrativo do que a agência oferece.');
    var pact = document.getElementById('pAct');
    var b = el('<button class="btn btn-p">' + icon('plus', 14) + ' Novo serviço</button>');
    b.addEventListener('click', function () { servicoModal(null, draw); });
    pact.appendChild(b);

    var host = el('<div id="svHost"></div>');
    view.appendChild(host);

    function draw() {
      host.innerHTML = '<div class="grid" style="grid-template-columns:repeat(auto-fill,minmax(300px,1fr))">' +
        DB.servicos.map(function (s) {
          return '<div class="card"><div class="card-b" style="display:flex;flex-direction:column;gap:10px;min-height:150px">' +
            '<div style="display:flex;justify-content:space-between;gap:8px"><h3 style="font-size:14.5px">' + esc(s.nome) + '</h3>' + App.badge(s.status) + '</div>' +
            '<p class="small" style="flex:1">' + esc(s.desc) + '</p>' +
            '<div style="display:flex;gap:14px;flex-wrap:wrap" class="small">' +
              '<span><b class="num" style="color:var(--text)">' + brl(s.preco) + '</b></span>' +
              '<span>' + esc(s.tipo) + '</span><span>' + esc(s.recorrencia) + '</span><span>' + esc(s.prazo) + '</span></div>' +
            '<div style="display:flex;gap:6px;border-top:1px solid var(--line);padding-top:10px">' +
              '<button class="btn btn-g btn-sm" data-e="' + s.id + '">' + icon('edit', 12) + ' Editar</button>' +
              '<button class="btn btn-g btn-sm" data-c="' + s.id + '">' + icon('copy', 12) + ' Duplicar</button>' +
              '<button class="btn btn-g btn-sm" data-a="' + s.id + '">' + icon('archive', 12) + ' ' + (s.status === 'Arquivado' ? 'Reativar' : 'Arquivar') + '</button>' +
            '</div></div></div>';
        }).join('') + '</div>';

      host.querySelectorAll('[data-e]').forEach(function (x) { x.addEventListener('click', function () { servicoModal(x.dataset.e, draw); }); });
      host.querySelectorAll('[data-c]').forEach(function (x) { x.addEventListener('click', function () {
        var s = DB.servicos.filter(function (y) { return y.id === x.dataset.c; })[0];
        var cp = JSON.parse(JSON.stringify(s));
        cp.id = 's' + Date.now(); cp.nome = s.nome + ' (cópia)'; cp.status = 'Arquivado';
        DB.servicos.push(cp); draw(); App.toast('Serviço duplicado como "' + cp.nome + '".');
      }); });
      host.querySelectorAll('[data-a]').forEach(function (x) { x.addEventListener('click', function () {
        var s = DB.servicos.filter(function (y) { return y.id === x.dataset.a; })[0];
        var arq = s.status !== 'Arquivado';
        App.confirm({ title: arq ? 'Arquivar serviço' : 'Reativar serviço', msg: arq ? '"' + s.nome + '" sairá do catálogo ativo.' : '"' + s.nome + '" voltará ao catálogo ativo.',
          ok: arq ? 'Arquivar' : 'Reativar', danger: arq, onOk: function () { s.status = arq ? 'Arquivado' : 'Ativo'; draw(); App.toast(arq ? 'Serviço arquivado.' : 'Serviço reativado.'); } });
      }); });
    }
    draw();
  }
});

function servicoModal(id, after) {
  var s = id ? DB.servicos.filter(function (x) { return x.id === id; })[0] : null;
  App.modal({
    title: s ? 'Editar serviço' : 'Novo serviço',
    wide: true,
    body: App.field('Nome', '<input class="in" id="svN" value="' + esc(s ? s.nome : '') + '">') +
      App.field('Descrição', '<textarea class="in" id="svD">' + esc(s ? s.desc : '') + '</textarea>') +
      '<div class="frow">' +
      App.field('Preço (R$)', '<input class="in" type="number" id="svP" value="' + (s ? s.preco : '') + '">') +
      App.field('Tipo', '<select class="in" id="svT">' + ['Projeto', 'Serviço', 'Produto'].map(function (o) { return '<option' + (s && s.tipo === o ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select>') + '</div>' +
      '<div class="frow">' +
      App.field('Recorrência', '<select class="in" id="svR">' + ['—', 'Mensal', 'Anual', 'Por hora'].map(function (o) { return '<option' + (s && s.recorrencia === o ? ' selected' : '') + '>' + o + '</option>'; }).join('') + '</select>') +
      App.field('Prazo estimado', '<input class="in" id="svZ" value="' + esc(s ? s.prazo : '') + '" placeholder="ex.: 15–25 dias">') + '</div>',
    actions: [
      { lb: 'Cancelar', cls: 'btn-g' },
      { lb: s ? 'Salvar alterações' : 'Criar serviço', cls: 'btn-p', onClick: function (close, box) {
        var n = box.querySelector('#svN').value.trim();
        if (!n) { App.toast('Informe o nome do serviço.', 'warn'); return; }
        var dados = { nome: n, desc: box.querySelector('#svD').value.trim() || '—', preco: +box.querySelector('#svP').value || 0,
          tipo: box.querySelector('#svT').value, recorrencia: box.querySelector('#svR').value, prazo: box.querySelector('#svZ').value.trim() || '—' };
        if (s) { Object.assign(s, dados); App.toast('Serviço atualizado.'); }
        else { DB.servicos.push(Object.assign({ id: 's' + Date.now(), status: 'Ativo' }, dados)); App.toast('Serviço "' + n + '" criado.'); }
        close(); after && after();
      } }
    ]
  });
}

/* ==================================================================
   6. VENDAS
   ================================================================== */
App.page('vendas', {
  crumb: 'Vendas',
  render: function (view) {
    App.setPage('Vendas', 'Propostas, conversão e receita comercial.');
    view.innerHTML = App.kpis(DB.vendasKpis) +
      '<div class="card" style="margin-top:14px"><div class="card-h"><h3>Vendas por período</h3><span class="mono">últimos 6 meses</span></div>' +
      '<div class="card-b"><div id="vdChart"></div></div></div>' +
      '<div class="card" style="margin-top:14px" id="vdTable"></div>';
    document.getElementById('vdChart').appendChild(App.barChart({
      labels: DB.vendasChart.labels,
      series: [{ nome: 'Valor vendido', dados: DB.vendasChart.vendido, cls: '' }]
    }));
    document.getElementById('vdTable').appendChild(App.table({
      pageSize: 8,
      cols: [
        { lb: 'Cliente', k: 'cliente', render: function (r) { return '<span class="nm">' + esc(r.cliente) + '</span>'; } },
        { lb: 'Serviço', k: 'servico' },
        { lb: 'Valor', k: 'valor', render: function (r) { return '<span class="num">' + brl(r.valor) + '</span>'; } },
        { lb: 'Data', k: 'data', render: function (r) { return fmtData(r.data); } },
        { lb: 'Status', k: 'status', render: function (r) { return App.badge(r.status); } },
        { lb: 'Responsável', k: 'responsavel' }
      ],
      rows: DB.vendas,
      search: function (r) { return r.cliente + ' ' + r.servico + ' ' + r.status + ' ' + r.responsavel; }
    }));
  }
});

/* ==================================================================
   7. FINANCEIRO
   ================================================================== */
App.page('financeiro', {
  crumb: 'Financeiro',
  render: function (view) {
    App.setPage('Financeiro', 'Receitas, despesas, contas e assinaturas recorrentes.');
    var pact = document.getElementById('pAct');
    var b = el('<button class="btn btn-p">' + icon('plus', 14) + ' Nova movimentação</button>');
    b.addEventListener('click', function () { movimentacaoModal(); });
    pact.appendChild(b);

    var aba = 'receitas';
    view.innerHTML = App.kpis(DB.financeiroKpis) +
      '<div class="grid g-31" style="margin-top:14px">' +
        '<div class="card"><div class="card-h"><h3>Receita × Despesas × Lucro</h3><span class="mono">12 meses</span></div>' +
        '<div class="card-b"><div id="fiChart"></div></div></div>' +
        '<div class="card"><div class="card-h"><h3>Assinaturas ativas</h3><span class="mono">MRR ' + brl(21400) + '</span></div>' +
        '<div id="fiAssin" style="padding:0"></div></div>' +
      '</div>' +
      '<div class="card" style="margin-top:14px">' +
        '<div class="tabs" id="fiTabs">' +
        [['receitas', 'Receitas'], ['despesas', 'Despesas'], ['receber', 'Contas a receber'], ['pagas', 'Contas pagas'], ['assinaturas', 'Assinaturas']]
          .map(function (t) { return '<button data-t="' + t[0] + '" class="' + (t[0] === aba ? 'on' : '') + '">' + t[1] + '</button>'; }).join('') +
        '</div><div id="fiTab"></div></div>';

    var f = DB.financeiroChart['12m'];
    document.getElementById('fiChart').appendChild(App.barChart({
      labels: f.labels,
      series: [
        { nome: 'Receita', dados: f.receita, cls: '' },
        { nome: 'Despesas', dados: f.despesas, cls: 'b2' },
        { nome: 'Lucro', dados: f.receita.map(function (r, i) { return r - f.despesas[i]; }), cls: 'b3' }
      ]
    }));
    document.getElementById('fiAssin').innerHTML = '<div class="list">' + DB.assinaturas.slice(0, 5).map(function (a) {
      return '<div class="li"><span class="ico">' + icon('refresh', 13) + '</span><span class="grow"><span class="t1">' + esc(a.cliente) + '</span><span class="t2">' + esc(a.plano) + '</span></span><span class="rt num">' + brl(a.valor) + '</span></div>';
    }).join('') + '</div>';

    function tabHtml() {
      if (aba === 'receitas' || aba === 'despesas') {
        var rows = aba === 'receitas' ? DB.receitas : DB.despesas;
        return App.table({
          pageSize: 7,
          cols: [
            { lb: 'Descrição', render: function (r) { return '<span class="nm">' + esc(r.desc) + '</span>'; } },
            { lb: 'Categoria', k: 'cat' },
            { lb: 'Valor', k: 'valor', render: function (r) { return '<span class="num">' + brl(r.valor) + '</span>'; } },
            { lb: 'Vencimento', k: 'venc', render: function (r) { return fmtData(r.venc); } },
            { lb: 'Pagamento', k: 'pag', render: function (r) { return fmtData(r.pag); } },
            { lb: aba === 'receitas' ? 'Cliente' : 'Fornecedor', k: 'parte' },
            { lb: 'Status', k: 'status', render: function (r) { return App.badge(r.status); } }
          ],
          rows: rows,
          search: function (r) { return r.desc + ' ' + r.cat + ' ' + r.parte + ' ' + r.status; }
        });
      }
      if (aba === 'receber') {
        return App.table({ pageSize: 7, cols: [
          { lb: 'Descrição', render: function (r) { return '<span class="nm">' + esc(r.desc) + '</span>'; } },
          { lb: 'Cliente', k: 'cliente' },
          { lb: 'Valor', k: 'valor', render: function (r) { return '<span class="num">' + brl(r.valor) + '</span>'; } },
          { lb: 'Vencimento', k: 'venc', render: function (r) { return fmtData(r.venc); } },
          { lb: 'Status', k: 'status', render: function (r) { return App.badge(r.status); } }
        ], rows: DB.contasReceber, search: function (r) { return r.desc + ' ' + r.cliente; } });
      }
      if (aba === 'pagas') {
        return App.table({ pageSize: 7, cols: [
          { lb: 'Descrição', render: function (r) { return '<span class="nm">' + esc(r.desc) + '</span>'; } },
          { lb: 'Fornecedor', k: 'fornecedor' },
          { lb: 'Categoria', k: 'cat' },
          { lb: 'Valor', k: 'valor', render: function (r) { return '<span class="num">' + brl(r.valor) + '</span>'; } },
          { lb: 'Pago em', k: 'pag', render: function (r) { return fmtData(r.pag); } }
        ], rows: DB.contasPagas, search: function (r) { return r.desc + ' ' + r.fornecedor; } });
      }
      return App.table({ pageSize: 7, cols: [
        { lb: 'Cliente', render: function (r) { return '<span class="nm">' + esc(r.cliente) + '</span>'; } },
        { lb: 'Plano', k: 'plano' },
        { lb: 'Valor', k: 'valor', render: function (r) { return '<span class="num">' + brl(r.valor) + '</span>'; } },
        { lb: 'Ciclo', k: 'ciclo' },
        { lb: 'Próxima cobrança', k: 'proxima', render: function (r) { return fmtData(r.proxima); } },
        { lb: 'Status', k: 'status', render: function (r) { return App.badge(r.status); } }
      ], rows: DB.assinaturas, search: function (r) { return r.cliente + ' ' + r.plano; } });
    }

    function drawTab() {
      var host = document.getElementById('fiTab');
      host.innerHTML = '';
      host.appendChild(tabHtml());
    }
    drawTab();
    document.getElementById('fiTabs').addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-t]');
      if (!b) return;
      aba = b.dataset.t;
      this.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
      drawTab();
    });
  }
});

function movimentacaoModal() {
  App.modal({
    title: 'Nova movimentação',
    body: App.field('Tipo', '<select class="in" id="mvT"><option>Receita</option><option>Despesa</option></select>') +
      App.field('Descrição', '<input class="in" id="mvD">') +
      '<div class="frow">' +
      App.field('Categoria', App.select(DB.categoriasFin)) +
      App.field('Valor (R$)', '<input class="in" type="number" id="mvV">') + '</div>' +
      '<div class="frow">' +
      App.field('Vencimento', '<input class="in" type="date" id="mvVc">') +
      App.field('Cliente / Fornecedor', '<input class="in" id="mvP">') + '</div>',
    actions: [
      { lb: 'Cancelar', cls: 'btn-g' },
      { lb: 'Registrar', cls: 'btn-p', onClick: function (close, box) {
        var d = box.querySelector('#mvD').value.trim(), v = +box.querySelector('#mvV').value;
        if (!d || !v) { App.toast('Preencha descrição e valor.', 'warn'); return; }
        var rec = box.querySelector('#mvT').value === 'Receita';
        (rec ? DB.receitas : DB.despesas).unshift({ id: 'x' + Date.now(), desc: d,
          cat: box.querySelectorAll('select')[1].value, valor: v,
          venc: box.querySelector('#mvVc').value || '—', pag: '—',
          parte: box.querySelector('#mvP').value || '—', status: 'Pendente' });
        close(); App.toast((rec ? 'Receita' : 'Despesa') + ' registrada.'); App.navigate();
      } }
    ]
  });
}

/* ==================================================================
   8. TAREFAS
   ================================================================== */
App.page('tarefas', {
  crumb: 'Tarefas',
  render: function (view) {
    App.setPage('Tarefas', 'Quadro de execução da equipe — arraste entre as colunas.');
    var pact = document.getElementById('pAct');
    var b = el('<button class="btn btn-p">' + icon('plus', 14) + ' Nova tarefa</button>');
    b.addEventListener('click', function () {
      App.modal({
        title: 'Nova tarefa',
        body: App.field('Título', '<input class="in" id="ntT">') +
          '<div class="frow">' +
          App.field('Responsável', App.select(DB.equipe.map(function (u) { return u.nome; }))) +
          App.field('Prioridade', App.select(DB.prioridades, 'Normal')) + '</div>' +
          '<div class="frow">' +
          App.field('Prazo', '<input class="in" type="date" id="ntP">') +
          App.field('Projeto', '<select class="in" id="ntPr"><option value="">—</option>' +
            DB.projetos.map(function (p) { return '<option value="' + p.id + '">' + esc(p.nome) + '</option>'; }).join('') + '</select>') + '</div>' +
          App.field('Descrição', '<textarea class="in" id="ntD"></textarea>'),
        actions: [
          { lb: 'Cancelar', cls: 'btn-g' },
          { lb: 'Criar tarefa', cls: 'btn-p', onClick: function (close, box) {
            var t = box.querySelector('#ntT').value.trim();
            if (!t) { App.toast('Informe o título.', 'warn'); return; }
            DB.tarefas.push({ id: 'tk' + Date.now(), col: 'backlog', titulo: t,
              resp: box.querySelectorAll('select')[0].value, prio: box.querySelectorAll('select')[1].value,
              prazo: box.querySelector('#ntP').value || '—', projeto: box.querySelector('#ntPr').value || null, checklist: [0, 1] });
            close(); App.toast('Tarefa criada no Backlog.'); rerender();
          } }
        ]
      });
    });
    pact.appendChild(b);

    var host = el('<div class="card"></div>');
    view.appendChild(host);
    var kb;
    function rerender() {
      if (kb) kb.remove();
      kb = App.kanban({
        cols: DB.tarefaCols,
        items: DB.tarefas,
        colOf: function (t) { return t.col; },
        card: function (t) {
          return '<div class="t">' + esc(t.titulo) + '</div>' +
            '<div class="m">' + App.prio(t.prio) + '<span>·</span><span>' + prazoTxt(t.prazo === '—' ? null : t.prazo) + '</span></div>' +
            '<div class="rw"><span>' + esc(t.projeto ? (App.projeto(t.projeto) || { nome: '—' }).nome : 'Sem projeto') + '</span>' +
            '<span class="av" style="width:24px;height:24px;font-size:9.5px" title="' + esc(t.resp) + '">' + ini(t.resp) + '</span></div>' +
            '<div class="m"><span>Checklist ' + t.checklist[0] + '/' + t.checklist[1] + '</span>' +
            '<span style="flex:1">' + App.prog(Math.round((t.checklist[0] / (t.checklist[1] || 1)) * 100)) + '</span></div>';
        },
        onMove: function (id, col) {
          var t = DB.tarefas.filter(function (x) { return x.id === id; })[0];
          if (!t || t.col === col) return;
          t.col = col;
          if (col === 'concluido') t.checklist = [t.checklist[1], t.checklist[1]];
          rerender();
          var nome = DB.tarefaCols.filter(function (c) { return c.id === col; })[0].nome;
          App.toast('Tarefa movida para "' + nome + '".');
        },
        emptyMsg: 'Nenhuma tarefa'
      });
      host.appendChild(kb);
    }
    rerender();
  }
});

/* ==================================================================
   9. SUPORTE
   ================================================================== */
App.page('suporte', {
  crumb: 'Suporte',
  render: function (view) {
    var pend = DB.tickets.filter(function (t) { return ['Aberto', 'Em análise', 'Em andamento', 'Aguardando cliente'].indexOf(t.status) > -1; }).length;
    App.setPage('Suporte', 'Central de tickets e solicitações de clientes.',
      '<span class="bdg danger" style="height:30px"><i></i>' + pend + ' tickets pendentes</span>');

    var host = el('<div class="card"></div>');
    view.appendChild(host);
    host.appendChild(App.table({
      pageSize: 10,
      cols: [
        { lb: 'Nº', k: 'num', render: function (r) { return '<span class="num nm">#' + r.num + '</span>'; } },
        { lb: 'Cliente', k: 'cliente' },
        { lb: 'Assunto', k: 'assunto', render: function (r) { return '<span class="nm">' + esc(r.assunto) + '</span>'; } },
        { lb: 'Prioridade', k: 'prio', render: function (r) { return App.prio(r.prio); } },
        { lb: 'Status', k: 'status', render: function (r) { return App.badge(r.status); } },
        { lb: 'Responsável', k: 'resp' },
        { lb: 'Aberto', k: 'aberto', render: function (r) { return fmtData(r.aberto); } },
        { lb: 'Atualizado', k: 'atualizado', render: function (r) { return fmtData(r.atualizado); } }
      ],
      rows: DB.tickets,
      search: function (r) { return r.num + ' ' + r.cliente + ' ' + r.assunto + ' ' + r.status + ' ' + r.resp; },
      onRow: function (t) {
        App.modal({
          title: 'Ticket #' + t.num,
          wide: true,
          body: '<div style="display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px">' + App.badge(t.status) + App.prio(t.prio) +
            '<span class="bdg">' + esc(t.cliente) + '</span></div>' +
            '<h4 style="margin-bottom:6px">' + esc(t.assunto) + '</h4>' +
            '<p class="muted" style="font-size:13px;margin-bottom:14px">' + esc(t.desc) + '</p>' +
            '<dl class="kv"><dt>Responsável</dt><dd>' + esc(t.resp) + '</dd>' +
            '<dt>Aberto em</dt><dd>' + fmtData(t.aberto) + '</dd>' +
            '<dt>Última atualização</dt><dd>' + fmtData(t.atualizado) + '</dd></dl>' +
            '<div style="margin-top:16px">' + App.field('Alterar status', App.select(DB.ticketStatus, t.status)) + '</div>',
          actions: [
            { lb: 'Fechar', cls: 'btn-g' },
            { lb: 'Salvar status', cls: 'btn-p', onClick: function (close, box) {
              t.status = box.querySelector('select').value;
              t.atualizado = new Date().toISOString().slice(0, 10);
              close(); App.toast('Ticket #' + t.num + ' → ' + t.status + '.'); App.navigate();
            } }
          ]
        });
      },
      empty: 'Nenhum ticket por aqui.',
      emptyAction: null
    }));
  }
});

/* ==================================================================
   10. ANALYTICS
   ================================================================== */
App.page('analytics', {
  crumb: 'Analytics',
  render: function (view) {
    var per = '30d';
    App.setPage('Analytics', 'Desempenho digital: tráfego, leads e conversões.',
      '<div class="seg" id="anSeg">' +
      [['7d', '7 dias'], ['30d', '30 dias'], ['90d', '90 dias'], ['12m', '12 meses']]
        .map(function (o) { return '<button data-p="' + o[0] + '" class="' + (o[0] === per ? 'on' : '') + '">' + o[1] + '</button>'; }).join('') + '</div>');

    view.innerHTML = '<div id="anKpis"></div>' +
      '<div class="grid g-2" style="margin-top:14px">' +
        '<div class="card"><div class="card-h"><h3>Tráfego e leads</h3><span class="mono">semanal</span></div><div class="card-b"><div id="anTraf"></div></div></div>' +
        '<div class="card"><div class="card-h"><h3>Conversões</h3><span class="mono">mensal</span></div><div class="card-b"><div id="anConv"></div></div></div>' +
      '</div>' +
      '<div class="grid g-13" style="margin-top:14px">' +
        '<div class="card"><div class="card-h"><h3>Origem do tráfego</h3></div><div class="card-b" id="anOrig"></div></div>' +
        '<div style="display:flex;flex-direction:column;gap:14px">' +
          '<div class="card"><div class="card-h"><h3>Páginas mais acessadas</h3></div><div id="anPag" style="padding:0"></div></div>' +
          '<div class="card"><div class="card-h"><h3>Serviços mais procurados</h3></div><div class="card-b" id="anServ"></div></div>' +
        '</div>' +
      '</div>';

    var mult = { '7d': 0.26, '30d': 1, '90d': 2.7, '12m': 10.5 };
    function draw() {
      var m = mult[per];
      document.getElementById('anKpis').innerHTML = App.kpis(DB.analyticsKpis.map(function (k) {
        if (/^\d/.test(k.vl.replace('.', '')) && k.lb !== 'Taxa de conversão') {
          var n = num(k.vl) * m;
          return Object.assign({}, k, { vl: Math.round(n).toLocaleString('pt-BR') + (k.lb === 'Visitantes' || k.lb === 'Sessões' ? '' : ''), ft: 'últimos ' + ({ '7d': '7 dias', '30d': '30 dias', '90d': '90 dias', '12m': '12 meses' }[per]) });
        }
        return Object.assign({}, k, { ft: 'últimos ' + ({ '7d': '7 dias', '30d': '30 dias', '90d': '90 dias', '12m': '12 meses' }[per]) });
      }));
      var tr = document.getElementById('anTraf');
      tr.innerHTML = '';
      tr.appendChild(App.lineChart({
        labels: DB.trafegoChart.labels,
        series: DB.trafegoChart.series.map(function (s) {
          return { nome: s.nome, dados: s.dados.map(function (v) { return Math.round(v * (per === '30d' ? 1 : m / (per === '90d' ? 1 : 1) * (per === '7d' ? 1 : 1))); }), cor: s.cor };
        }),
        fmt: function (v) { return v.toLocaleString('pt-BR'); }
      }));
      tr.insertAdjacentHTML('beforeend', '<div class="legend" style="margin-top:10px"><span><i></i>Visitantes</span><span><i style="background:var(--info)"></i>Leads</span></div>');
      var cv = document.getElementById('anConv');
      cv.innerHTML = '';
      cv.appendChild(App.barChart({ labels: DB.conversoesChart.labels, series: [{ nome: 'Conversões', dados: DB.conversoesChart.dados, cls: 'b3' }] }));

      document.getElementById('anOrig').innerHTML = DB.origens.map(function (o) {
        return '<div style="margin-bottom:13px"><div style="display:flex;justify-content:space-between;font-size:12.5px;margin-bottom:5px">' +
          '<span class="muted">' + esc(o.nome) + '</span><span class="num">' + o.pct + '%</span></div>' +
          '<div class="prog" style="height:6px"><i style="width:' + o.pct * 2.5 + '%;opacity:' + (o.pct > 30 ? '.8' : o.pct > 15 ? '.5' : '.3') + '"></i></div></div>';
      }).join('');

      document.getElementById('anPag').innerHTML = '<div class="list">' + DB.paginasTop.map(function (p) {
        return '<div class="li"><span class="ico">' + icon('file', 13) + '</span><span class="grow"><span class="t1 mono" style="text-transform:none;letter-spacing:0;font-size:12.5px">' + esc(p.url) + '</span></span><span class="rt num">' + p.views.toLocaleString('pt-BR') + ' views</span></div>';
      }).join('') + '</div>';

      document.getElementById('anServ').innerHTML = DB.servicosProcurados.map(function (s) {
        return '<div style="display:flex;align-items:center;gap:12px;margin-bottom:11px"><span style="flex:1;font-size:12.5px" class="muted">' + esc(s.nome) + '</span>' +
          '<span style="width:120px">' + App.prog(s.pct) + '</span><span class="num" style="font-size:12.5px;width:44px;text-align:right">' + s.leads + '</span></div>';
      }).join('');
    }
    draw();
    document.getElementById('anSeg').addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-p]');
      if (!b) return;
      per = b.dataset.p;
      this.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
      draw();
    });
  }
});

/* ==================================================================
   11. AUTOMAÇÕES
   ================================================================== */
App.page('automacoes', {
  crumb: 'Automações',
  render: function (view) {
    App.setPage('Automações', 'Fluxos automáticos que mantêm a operação rodando.');
    var pact = document.getElementById('pAct');
    var b = el('<button class="btn btn-p">' + icon('plus', 14) + ' Nova automação</button>');
    b.addEventListener('click', function () { App.toast('Editor de automações chega na próxima versão.', 'warn'); });
    pact.appendChild(b);

    function draw() {
      view.innerHTML = '<div class="card"><div class="list" style="padding:0">' + DB.automacoes.map(function (a) {
        return '<div class="li" data-a="' + a.id + '" style="cursor:pointer;padding:14px 18px">' +
          '<span class="ico">' + icon(a.status === 'Com erro' ? 'alert' : 'zap', 14) + '</span>' +
          '<span class="grow"><span class="t1">' + esc(a.nome) + '</span>' +
          '<span class="t2">Última execução: ' + esc(a.ultima) + ' · ' + a.exec.toLocaleString('pt-BR') + ' execuções · ' + a.erros + ' erros</span></span>' +
          App.badge(a.status) +
          '<button class="btn btn-g btn-sm" data-tg="' + a.id + '">' + (a.status === 'Pausada' ? 'Ativar' : 'Pausar') + '</button>' +
          '<button class="btn btn-g btn-sm" data-fl="' + a.id + '">Ver fluxo</button></div>';
      }).join('') + '</div></div>';

      view.querySelectorAll('[data-fl]').forEach(function (x) {
        x.addEventListener('click', function (ev) {
          ev.stopPropagation();
          var a = DB.automacoes.filter(function (y) { return y.id === x.dataset.fl; })[0];
          App.modal({ title: a.nome, body: '<ul class="tl">' + a.fluxo.map(function (f, i) {
            return '<li class="' + (i < a.fluxo.length - 1 || a.status === 'Ativa' ? 'done' : '') + '"><div class="t1">' + esc(f) + '</div><div class="t2">etapa ' + (i + 1) + '</div></li>';
          }).join('') + '</ul>' + (a.erros ? '<p class="small" style="margin-top:12px;color:var(--danger)">' + a.erros + ' falhas registradas nas últimas execuções.</p>' : '') });
        });
      });
      view.querySelectorAll('[data-tg]').forEach(function (x) {
        x.addEventListener('click', function (ev) {
          ev.stopPropagation();
          var a = DB.automacoes.filter(function (y) { return y.id === x.dataset.tg; })[0];
          a.status = a.status === 'Pausada' ? 'Ativa' : 'Pausada';
          draw(); App.toast('Automação "' + a.nome + '" ' + (a.status === 'Ativa' ? 'ativada' : 'pausada') + '.');
        });
      });
    }
    draw();
  }
});

/* ==================================================================
   12. ARQUIVOS
   ================================================================== */
App.page('arquivos', {
  crumb: 'Arquivos',
  render: function (view) {
    App.setPage('Arquivos', 'Contratos, briefings, designs e entregáveis organizados por pasta.');
    var pact = document.getElementById('pAct');
    var b = el('<button class="btn btn-p">' + icon('upload', 14) + ' Upload</button>');
    b.addEventListener('click', function () {
      App.modal({
        title: 'Enviar arquivo',
        body: '<div style="border:1.5px dashed var(--line-3);border-radius:12px;padding:34px 20px;text-align:center;color:var(--text-3)">' +
          icon('upload', 22) + '<p class="small" style="margin-top:8px">Arraste arquivos aqui ou clique para selecionar.<br>(demonstração — o upload real entra com o storage)</p></div>' +
          '<div style="margin-top:14px">' + App.field('Pasta de destino', App.select(DB.arquivoPastas)) + '</div>',
        actions: [{ lb: 'Fechar', cls: 'btn-g' }, { lb: 'Enviar', cls: 'btn-p', onClick: function (close) { close(); App.toast('Arquivo enviado (simulado).'); } }]
      });
    });
    pact.appendChild(b);

    var pasta = 'Todos';
    view.innerHTML = '<div class="fm"><div class="card fm-fold" id="fmFold"></div><div class="card" id="fmList"></div></div>';

    function drawFolders() {
      document.getElementById('fmFold').innerHTML =
        ['Todos'].concat(DB.arquivoPastas).map(function (f) {
          var n = f === 'Todos' ? DB.arquivos.length : DB.arquivos.filter(function (a) { return a.pasta === f; }).length;
          return '<button data-f="' + esc(f) + '" class="' + (f === pasta ? 'on' : '') + '">' + icon(f === 'Todos' ? 'layers' : 'folder', 14) + esc(f) + '<span class="n">' + n + '</span></button>';
        }).join('');
      document.querySelectorAll('#fmFold button').forEach(function (x) {
        x.addEventListener('click', function () { pasta = x.dataset.f; drawFolders(); drawList(); });
      });
    }
    function drawList() {
      var host = document.getElementById('fmList');
      host.innerHTML = '';
      var rows = pasta === 'Todos' ? DB.arquivos : DB.arquivos.filter(function (a) { return a.pasta === pasta; });
      host.appendChild(App.table({
        pageSize: 8,
        cols: [
          { lb: 'Nome', k: 'nome', render: function (r) { return '<span class="nm">' + icon('file', 13) + '</span> <span class="nm" style="margin-left:6px">' + esc(r.nome) + '</span>'; } },
          { lb: 'Pasta', k: 'pasta' },
          { lb: 'Tamanho', k: 'tam' },
          { lb: 'Modificado', k: 'mod', render: function (r) { return fmtData(r.mod); } },
          { lb: 'Por', k: 'por' },
          { lb: '', render: function (r) {
              return '<span style="display:flex;gap:4px;justify-content:flex-end">' +
                '<button class="iconbtn" title="Visualizar" data-v="' + r.id + '">' + icon('eye', 14) + '</button>' +
                '<button class="iconbtn" title="Download" data-d="' + r.id + '">' + icon('download', 14) + '</button>' +
                '<button class="iconbtn" title="Renomear" data-r="' + r.id + '">' + icon('edit', 14) + '</button>' +
                '<button class="iconbtn" title="Excluir" data-x="' + r.id + '" style="color:var(--danger)">' + icon('trash', 14) + '</button></span>';
            } }
        ],
        rows: rows,
        search: function (r) { return r.nome + ' ' + r.pasta + ' ' + r.por; },
        empty: 'Pasta vazia.',
        emptyAction: null
      }));
      host.querySelectorAll('[data-v]').forEach(function (x) { x.addEventListener('click', function () {
        var a = DB.arquivos.filter(function (y) { return y.id === x.dataset.v; })[0];
        App.modal({ title: a.nome, body: '<div style="background:var(--sunken);border-radius:12px;height:220px;display:grid;place-items:center;color:var(--text-3)">' + icon('eye', 26) + '</div><p class="small" style="margin-top:10px">Pré-visualização disponível com o storage conectado. ' + a.tam + ' · ' + esc(a.por) + ' · ' + fmtData(a.mod) + '</p>' });
      }); });
      host.querySelectorAll('[data-d]').forEach(function (x) { x.addEventListener('click', function () { App.toast('Download iniciado (simulado).'); }); });
      host.querySelectorAll('[data-r]').forEach(function (x) { x.addEventListener('click', function () {
        var a = DB.arquivos.filter(function (y) { return y.id === x.dataset.r; })[0];
        App.modal({ title: 'Renomear arquivo', body: App.field('Novo nome', '<input class="in" id="rnN" value="' + esc(a.nome) + '">'),
          actions: [{ lb: 'Cancelar', cls: 'btn-g' }, { lb: 'Renomear', cls: 'btn-p', onClick: function (close, box) {
            var n = box.querySelector('#rnN').value.trim();
            if (!n) return;
            a.nome = n; close(); drawList(); App.toast('Arquivo renomeado.');
          } }] });
      }); });
      host.querySelectorAll('[data-x]').forEach(function (x) { x.addEventListener('click', function () {
        var a = DB.arquivos.filter(function (y) { return y.id === x.dataset.x; })[0];
        App.confirm({ title: 'Excluir arquivo', msg: 'Excluir "' + a.nome + '" permanentemente?', ok: 'Excluir', danger: true, onOk: function () {
          DB.arquivos = DB.arquivos.filter(function (y) { return y.id !== a.id; });
          drawFolders(); drawList(); App.toast('Arquivo excluído.', 'danger');
        } });
      }); });
    }
    drawFolders(); drawList();
  }
});

/* ==================================================================
   13. EQUIPE
   ================================================================== */
App.page('equipe', {
  crumb: 'Equipe',
  render: function (view) {
    App.setPage('Equipe', 'Membros, papéis e permissões de acesso ao painel.');
    var pact = document.getElementById('pAct');
    var b = el('<button class="btn btn-p">' + icon('user-plus', 14) + ' Convidar membro</button>');
    b.addEventListener('click', function () {
      App.modal({
        title: 'Convidar membro',
        body: '<div class="frow">' + App.field('Nome', '<input class="in" id="eqN">') + App.field('E-mail', '<input class="in" type="email" id="eqE">') + '</div>' +
          App.field('Função', App.select(['Admin', 'Gerente', 'Desenvolvedor', 'Marketing', 'Suporte', 'Financeiro'])),
        actions: [{ lb: 'Cancelar', cls: 'btn-g' }, { lb: 'Enviar convite', cls: 'btn-p', onClick: function (close, box) {
          var n = box.querySelector('#eqN').value.trim();
          if (!n) { App.toast('Informe o nome.', 'warn'); return; }
          close(); App.toast('Convite enviado para ' + (box.querySelector('#eqE').value || n) + ' (simulado).');
        } }]
      });
    });
    pact.appendChild(b);

    var aba = 'membros';
    view.innerHTML = '<div class="card"><div class="tabs" id="eqTabs">' +
      '<button data-t="membros" class="on">Membros</button><button data-t="perm">Permissões</button></div><div id="eqBody"></div></div>';

    function draw() {
      var host = document.getElementById('eqBody');
      host.innerHTML = '';
      if (aba === 'membros') {
        host.appendChild(App.table({
          pageSize: 8,
          cols: [
            { lb: 'Membro', render: function (r) { return '<div style="display:flex;align-items:center;gap:10px"><span class="av">' + r.iniciais + '</span><div><div class="nm">' + esc(r.nome) + '</div><div class="sub">' + esc(r.email) + '</div></div></div>'; } },
            { lb: 'Cargo', k: 'cargo' },
            { lb: 'Função', k: 'papel', render: function (r) { return '<span class="bdg">' + esc(r.papel) + '</span>'; } },
            { lb: 'Status', k: 'status', render: function (r) { return App.badge(r.status); } },
            { lb: 'Projetos', k: 'projetos', render: function (r) { return '<span class="num">' + r.projetos + '</span>'; } },
            { lb: 'Tarefas', k: 'tarefas', render: function (r) { return '<span class="num">' + r.tarefas + '</span>'; } }
          ],
          rows: DB.equipe,
          search: function (r) { return r.nome + ' ' + r.cargo + ' ' + r.email + ' ' + r.papel; }
        }));
      } else {
        var m = DB.permissaoMatriz;
        host.innerHTML = '<div class="tw"><table><thead><tr><th>Papel</th>' + m.modulos.map(function (x) { return '<th>' + esc(x) + '</th>'; }).join('') + '</tr></thead><tbody>' +
          m.papeis.map(function (p) {
            return '<tr><td class="nm">' + esc(p.papel) + '</td>' + p.nivel.map(function (n) {
              var c = n === 'total' ? '<span class="bdg ok">total</span>' : n === 'leitura' ? '<span class="bdg info">leitura</span>' : '<span class="small">—</span>';
              return '<td>' + c + '</td>';
            }).join('') + '</tr>';
          }).join('') + '</tbody></table></div>' +
          '<p class="small" style="padding:12px 18px">total = cria, edita e exclui · leitura = somente visualização · — = sem acesso</p>';
      }
    }
    draw();
    document.getElementById('eqTabs').addEventListener('click', function (ev) {
      var b = ev.target.closest('button[data-t]');
      if (!b) return;
      aba = b.dataset.t;
      this.querySelectorAll('button').forEach(function (x) { x.classList.toggle('on', x === b); });
      draw();
    });
  }
});

/* ==================================================================
   14. CONFIGURAÇÕES
   ================================================================== */
App.page('config', {
  crumb: 'Configurações',
  render: function (view) {
    App.setPage('Configurações', 'Empresa, usuários, segurança e preferências do painel.');
    var aba = 'empresa';
    var abas = [['empresa', 'Empresa'], ['usuarios', 'Usuários'], ['permissoes', 'Permissões'], ['notificacoes', 'Notificações'], ['integracoes', 'Integrações'], ['seguranca', 'Segurança'], ['preferencias', 'Preferências']];

    view.innerHTML = '<div class="card" style="display:flex;min-height:520px">' +
      '<div class="fm-fold" id="cfNav" style="border-right:1px solid var(--line);width:210px;flex:0 0 auto"></div>' +
      '<div style="flex:1;min-width:0;padding:20px 22px" id="cfBody"></div></div>';

    function nav() {
      document.getElementById('cfNav').innerHTML = abas.map(function (a) {
        return '<button data-t="' + a[0] + '" class="' + (a[0] === aba ? 'on' : '') + '">' + esc(a[1]) + '</button>';
      }).join('');
      document.querySelectorAll('#cfNav button').forEach(function (x) {
        x.addEventListener('click', function () { aba = x.dataset.t; nav(); draw(); });
      });
    }
    function toggleRow(lb, on) {
      return '<div class="li" style="padding:12px 0;border-bottom:1px solid var(--line)"><span class="grow"><span class="t1">' + lb + '</span></span>' +
        '<label style="position:relative;width:38px;height:22px;flex:0 0 auto;cursor:pointer">' +
        '<input type="checkbox" ' + (on ? 'checked' : '') + ' style="opacity:0;position:absolute;inset:0">' +
        '<span style="position:absolute;inset:0;border-radius:99px;background:' + (on ? 'var(--ok)' : 'var(--line-3)') + ';transition:.2s"></span>' +
        '<span style="position:absolute;top:3px;left:' + (on ? '19px' : '3px') + ';width:16px;height:16px;border-radius:50%;background:#fff;transition:.2s"></span></label></div>';
    }
    function saveBar() {
      return '<div style="margin-top:20px;display:flex;gap:8px"><button class="btn btn-p" data-save>Salvar alterações</button><button class="btn btn-g" data-cancel>Cancelar</button></div>';
    }
    function wireSave() {
      var b = document.querySelector('#cfBody [data-save]');
      if (b) b.addEventListener('click', function () { App.toast('Alterações salvas (demonstração).'); });
      var c = document.querySelector('#cfBody [data-cancel]');
      if (c) c.addEventListener('click', function () { draw(); });
    }

    function draw() {
      var host = document.getElementById('cfBody');
      var e = DB.empresa;
      if (aba === 'empresa') {
        host.innerHTML = '<h3 style="margin-bottom:16px">Dados da empresa</h3><div class="frow">' +
          App.field('Nome', '<input class="in" value="' + esc(e.nome) + '">') +
          App.field('CNPJ', '<input class="in" value="' + esc(e.cnpj) + '">') + '</div><div class="frow">' +
          App.field('E-mail comercial', '<input class="in" value="' + esc(e.email) + '">') +
          App.field('Telefone', '<input class="in" value="' + esc(e.telefone) + '">') + '</div>' +
          App.field('Endereço', '<input class="in" value="' + esc(e.endereco) + '">') +
          App.field('Descrição', '<textarea class="in">Agência de tecnologia e inteligência artificial — automação, sistemas sob medida e produtos SaaS.</textarea>') +
          App.field('Logo', '<div style="display:flex;align-items:center;gap:12px"><img src="../attached_assets/orvex-logo-transparent.png" alt="ORVEX" style="height:34px;background:var(--sunken);padding:6px 10px;border-radius:9px"><button class="btn btn-g btn-sm">Trocar logo</button></div>') +
          saveBar();
      } else if (aba === 'usuarios') {
        host.innerHTML = '<h3 style="margin-bottom:16px">Usuários do painel</h3><div class="list" style="margin:0 -22px">' +
          DB.equipe.map(function (u) {
            return '<div class="li"><span class="av">' + u.iniciais + '</span><span class="grow"><span class="t1">' + esc(u.nome) + '</span><span class="t2">' + esc(u.email) + '</span></span>' +
              '<span class="bdg">' + esc(u.papel) + '</span>' + App.badge(u.status) + '</div>';
          }).join('') + '</div>';
      } else if (aba === 'permissoes') {
        host.innerHTML = '<h3 style="margin-bottom:16px">Matriz de permissões</h3>' +
          '<p class="small" style="margin-bottom:12px">Gerenciada no módulo <a href="#/equipe" style="text-decoration:underline">Equipe → Permissões</a>.</p>' +
          '<a class="btn btn-g" href="#/equipe">Abrir permissões</a>';
      } else if (aba === 'notificacoes') {
        host.innerHTML = '<h3 style="margin-bottom:6px">Notificações</h3><p class="small" style="margin-bottom:10px">Escolha o que a equipe recebe por e-mail e no painel.</p>' +
          toggleRow('Novo lead recebido', true) + toggleRow('Pagamento recebido', true) +
          toggleRow('Projeto próximo do prazo', true) + toggleRow('Ticket de suporte aberto', true) +
          toggleRow('Tarefa atrasada', false) + toggleRow('Falha em automação', true) +
          toggleRow('Resumo semanal por e-mail', false) + saveBar();
      } else if (aba === 'integracoes') {
        host.innerHTML = '<h3 style="margin-bottom:16px">Integrações</h3><div class="list" style="margin:0 -22px">' +
          DB.integracoes.map(function (i) {
            return '<div class="li"><span class="ico">' + icon(i.status === 'Conectado' ? 'check' : 'layers', 14) + '</span>' +
              '<span class="grow"><span class="t1">' + esc(i.nome) + '</span><span class="t2">' + esc(i.cat) + '</span></span>' +
              App.badge(i.status) +
              '<button class="btn btn-g btn-sm">' + (i.status === 'Conectado' ? 'Desconectar' : 'Conectar') + '</button></div>';
          }).join('') + '</div>';
        host.querySelectorAll('.li button').forEach(function (b) {
          b.addEventListener('click', function () { App.toast('Integrações externas entram com o backend de APIs.', 'warn'); });
        });
      } else if (aba === 'seguranca') {
        host.innerHTML = '<h3 style="margin-bottom:16px">Segurança</h3>' +
          '<div class="frow">' + App.field('Senha atual', '<input class="in" type="password" placeholder="••••••••">') +
          App.field('Nova senha', '<input class="in" type="password" placeholder="••••••••">') + '</div>' +
          '<button class="btn btn-g btn-sm" id="cfPwd">Alterar senha</button>' +
          '<h3 style="margin:26px 0 10px">Sessões ativas</h3><div class="list" style="margin:0 -22px">' +
          DB.sessoesAtivas.map(function (s) {
            return '<div class="li"><span class="ico">' + icon('grid', 13) + '</span><span class="grow"><span class="t1">' + esc(s.disp) + (s.atual ? ' · <b>sessão atual</b>' : '') + '</span>' +
              '<span class="t2">' + esc(s.local) + ' · IP ' + esc(s.ip) + ' · desde ' + esc(s.inicio) + '</span></span>' +
              (s.atual ? '' : '<button class="btn btn-d btn-sm">Encerrar</button>') + '</div>';
          }).join('') + '</div>' +
          '<h3 style="margin:26px 0 10px">Logs de acesso</h3><div class="list" style="margin:0 -22px">' +
          DB.logsAcesso.map(function (l) {
            return '<div class="li"><span class="grow"><span class="t1">' + esc(l.user) + ' — ' + esc(l.acao) + '</span></span><span class="rt mono" style="letter-spacing:.04em">' + esc(l.ip) + ' · ' + esc(l.data) + '</span></div>';
          }).join('') + '</div>';
        document.getElementById('cfPwd').addEventListener('click', function () { App.toast('Troca de senha requer backend de autenticação.', 'warn'); });
        host.querySelectorAll('.btn-d').forEach(function (b) { b.addEventListener('click', function () { App.toast('Sessão encerrada (simulado).'); }); });
      } else {
        host.innerHTML = '<h3 style="margin-bottom:16px">Preferências</h3>' +
          '<div class="frow">' + App.field('Idioma', App.select(['Português (BR)', 'English'], 'Português (BR)')) +
          App.field('Fuso horário', App.select(['America/Sao_Paulo (GMT−3)', 'America/New_York (GMT−5)'])) + '</div>' +
          App.field('Formato de data', App.select(['DD/MM/AAAA', 'AAAA-MM-DD'], 'DD/MM/AAAA')) +
          toggleRow('Modo compacto em tabelas', false) + toggleRow('Animações reduzidas', false) + saveBar();
      }
      wireSave();
    }
    nav(); draw();
  }
});
