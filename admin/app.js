/* ORVEX — Painel interno · núcleo da aplicação (roteador + componentes) */
'use strict';

/* ============================ guarda de sessão ============================ */
(function guard() {
  var sess = null;
  try { sess = localStorage.getItem('orvex-session'); } catch (e) {}
  if (!sess) { location.replace('../index.html?entrar=1'); }
})();

/* ============================ helpers ============================ */
function esc(s) {
  return String(s == null ? '' : s).replace(/[&<>"']/g, function (c) {
    return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c];
  });
}
function brl(n) { return 'R$ ' + Number(n).toLocaleString('pt-BR'); }
function fmtData(iso) {
  if (!iso || iso === '—') return '—';
  var p = String(iso).slice(0, 10).split('-');
  return p.length === 3 ? p[2] + '/' + p[1] + '/' + p[0] : iso;
}
function el(html) {
  var t = document.createElement('template');
  t.innerHTML = html.trim();
  return t.content.firstElementChild;
}
function num(s) { return Number(String(s).replace(/[^\d,.-]/g, '').replace(/\./g, '').replace(',', '.')) || 0; }

/* ============================ ícones ============================ */
var ICONS = {
  'grid':        '<rect x="3" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="3" width="7.5" height="7.5" rx="1.5"/><rect x="3" y="13.5" width="7.5" height="7.5" rx="1.5"/><rect x="13.5" y="13.5" width="7.5" height="7.5" rx="1.5"/>',
  'users':       '<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
  'user':        '<path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  'user-plus':   '<path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/>',
  'filter':      '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
  'briefcase':   '<rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  'box':         '<path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/>',
  'tag':         '<path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.83z"/><line x1="7" y1="7" x2="7.01" y2="7"/>',
  'dollar':      '<line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
  'check-square':'<polyline points="9 11 12 14 22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/>',
  'check':       '<polyline points="20 6 9 17 4 12"/>',
  'lifebuoy':    '<circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="4"/><line x1="4.93" y1="4.93" x2="9.17" y2="9.17"/><line x1="14.83" y1="14.83" x2="19.07" y2="19.07"/><line x1="4.93" y1="19.07" x2="9.17" y2="14.83"/><line x1="14.83" y1="9.17" x2="19.07" y2="4.93"/>',
  'ticket':      '<path d="M2 9a3 3 0 0 1 0 6v2a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-2a3 3 0 0 1 0-6V7a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2z"/><line x1="13" y1="5" x2="13" y2="7"/><line x1="13" y1="11" x2="13" y2="13"/><line x1="13" y1="17" x2="13" y2="19"/>',
  'bar-chart':   '<line x1="12" y1="20" x2="12" y2="10"/><line x1="18" y1="20" x2="18" y2="4"/><line x1="6" y1="20" x2="6" y2="16"/>',
  'zap':         '<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>',
  'folder':      '<path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>',
  'settings':    '<circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>',
  'inbox':       '<polyline points="22 12 16 12 14 15 10 15 8 12 2 12"/><path d="M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"/>',
  'refresh':     '<polyline points="23 4 23 10 17 10"/><polyline points="1 20 1 14 7 14"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>',
  'credit':      '<rect x="1" y="4" width="22" height="16" rx="2"/><line x1="1" y1="10" x2="23" y2="10"/>',
  'file':        '<path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/>',
  'bot':         '<rect x="4" y="8" width="16" height="12" rx="2"/><path d="M12 8V4"/><circle cx="12" cy="3" r="1"/><circle cx="9" cy="13" r="1"/><circle cx="15" cy="13" r="1"/><path d="M2 13h2M20 13h2"/>',
  'alert':       '<path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/><line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>',
  'clock':       '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
  'plus':        '<line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>',
  'x':           '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>',
  'search':      '<circle cx="11" cy="11" r="7"/><path d="m20 20-3.2-3.2"/>',
  'logout':      '<path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/>',
  'edit':        '<path d="M17 3a2.83 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5z"/>',
  'copy':        '<rect x="9" y="9" width="13" height="13" rx="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>',
  'archive':     '<polyline points="21 8 21 21 3 21 3 8"/><rect x="1" y="3" width="22" height="5"/><line x1="10" y1="12" x2="14" y2="12"/>',
  'eye':         '<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>',
  'download':    '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>',
  'upload':      '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>',
  'trash':       '<polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>',
  'more':        '<circle cx="12" cy="12" r="1.4"/><circle cx="12" cy="5" r="1.4"/><circle cx="12" cy="19" r="1.4"/>',
  'chev-l':      '<polyline points="15 18 9 12 15 6"/>',
  'chev-r':      '<polyline points="9 18 15 12 9 6"/>',
  'arrow-up':    '<line x1="12" y1="19" x2="12" y2="5"/><polyline points="5 12 12 5 19 12"/>',
  'arrow-dn':    '<line x1="12" y1="5" x2="12" y2="19"/><polyline points="19 12 12 19 5 12"/>',
  'external':    '<path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>',
  'layers':      '<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>',
  'phone':       '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z"/>',
  'mail':        '<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>'
};
function icon(name, size) {
  var s = size || 16;
  return '<svg width="' + s + '" height="' + s + '" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">' + (ICONS[name] || ICONS['box']) + '</svg>';
}

/* ============================ App ============================ */
var App = {
  pages: {},          /* views.js registra: App.page('rota', {...}) */
  current: null,
  view: null,

  page: function (id, def) { this.pages[id] = def; return this; },
  go: function (hash) { location.hash = hash; },

  /* ---------- badge / prioridades / progresso ---------- */
  badge: function (txt, tom) {
    var map = {
      'Ativo': 'ok', 'Pago': 'ok', 'Quitado': 'ok', 'Em dia': 'ok', 'Ativa': 'ok', 'Aceita': 'ok', 'online': 'ok',
      'Resolvido': 'ok', 'Concluído': 'ok', 'Fechado': 'ok', 'Conectado': 'ok',
      'Pendente': 'warn', 'Atrasado': 'danger', 'Inadimplente': 'danger', 'Com erro': 'danger', 'Perdido': 'danger', 'Recusada': 'danger', 'offline': '',
      'Em pausa': 'warn', 'Pausado': 'warn', 'Pausada': 'warn', 'Inativo': '', 'Aberto': 'info', 'Em análise': 'info',
      'Em andamento': 'info', 'Aguardando cliente': 'warn', 'Enviada': 'info', 'Negociação': 'info', 'ausente': 'warn',
      'Desconectado': '', 'Arquivado': '', 'Desenvolvimento': 'info', 'Revisão': 'info', 'Planejamento': '',
      'Briefing': '', 'Design': '', 'Fechado ': 'ok'
    };
    var cls = tom || map[txt] || '';
    return '<span class="bdg ' + cls + '">' + (cls ? '<i></i>' : '') + esc(txt) + '</span>';
  },

  prio: function (p) {
    var n = { 'Baixa': 1, 'Normal': 2, 'Alta': 3, 'Urgente': 4 }[p] || 2;
    return '<span class="prio p' + n + '"><i></i>' + esc(p) + '</span>';
  },

  prog: function (pct) {
    return '<div class="prog" title="' + pct + '%"><i style="width:' + Math.min(100, Math.max(0, pct)) + '%"></i></div>';
  },

  delta: function (txt, dir) {
    var cls = dir === 'up' ? 'up' : dir === 'down' ? 'dn' : 'fl';
    var arw = dir === 'up' ? icon('arrow-up', 11) : dir === 'down' ? icon('arrow-dn', 11) : '';
    return '<span class="dl ' + cls + '">' + arw + esc(txt) + '</span>';
  },

  /* ---------- KPI ---------- */
  kpis: function (arr) {
    return '<div class="kpis">' + arr.map(function (k) {
      return '<div class="kpi">' +
        '<span class="lb">' + esc(k.lb) + '</span>' +
        '<span class="vl">' + esc(k.vl) + '</span>' +
        '<span class="ft">' + App.delta(k.dl, k.dir) +
        (k.spark ? App.sparkline(k.spark) : '<span class="small">' + esc(k.ft || '') + '</span>') +
        '</span>' +
        (k.spark ? '<span class="small">' + esc(k.ft || '') + '</span>' : '') +
      '</div>';
    }).join('') + '</div>';
  },

  sparkline: function (pts) {
    var w = 76, h = 26, mn = Math.min.apply(null, pts), mx = Math.max.apply(null, pts), d = '';
    pts.forEach(function (p, i) {
      var x = (i / (pts.length - 1)) * w;
      var y = h - 2 - ((p - mn) / ((mx - mn) || 1)) * (h - 4);
      d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
    });
    return '<svg class="spark" viewBox="0 0 ' + w + ' ' + h + '"><path d="' + d + '"/></svg>';
  },

  /* ---------- tooltip ---------- */
  tipShow: function (html, x, y) {
    var t = document.getElementById('tip');
    t.innerHTML = html;
    t.hidden = false;
    var r = t.getBoundingClientRect();
    t.style.left = Math.min(window.innerWidth - r.width - 10, Math.max(8, x - r.width / 2)) + 'px';
    t.style.top = (y - r.height - 12) + 'px';
  },
  tipHide: function () { document.getElementById('tip').hidden = true; },

  /* ---------- gráfico de barras agrupadas ---------- */
  barChart: function (opt) {
    /* opt: {labels, series:[{nome, dados, cls}], fmt(v)} */
    var W = 760, H = 260, padL = 8, padR = 8, padT = 12, padB = 26;
    var max = 0;
    opt.series.forEach(function (s) { s.dados.forEach(function (v) { if (v > max) max = v; }); });
    max = max * 1.12 || 1;
    var n = opt.labels.length, m = opt.series.length;
    var cw = (W - padL - padR) / n, bw = Math.min(22, (cw * 0.66) / m);
    var fmt = opt.fmt || function (v) { return brl(v); };
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '" role="img">';
    for (var g = 0; g <= 3; g++) {
      var gy = padT + (H - padT - padB) * (g / 3);
      svg += '<line class="gl" x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + gy.toFixed(1) + '"/>';
    }
    opt.labels.forEach(function (lb, i) {
      var cx = padL + cw * i + cw / 2;
      svg += '<text class="ax" x="' + cx.toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle">' + esc(lb) + '</text>';
      opt.series.forEach(function (s, j) {
        var v = s.dados[i];
        var bh = (v / max) * (H - padT - padB);
        var bx = cx - (m * bw + (m - 1) * 3) / 2 + j * (bw + 3);
        svg += '<rect class="bar ' + (s.cls || '') + '" x="' + bx.toFixed(1) + '" y="' + (H - padB - bh).toFixed(1) +
               '" width="' + bw.toFixed(1) + '" height="' + Math.max(2, bh).toFixed(1) + '" rx="3"/>';
      });
      svg += '<rect class="hit" data-i="' + i + '" x="' + (padL + cw * i).toFixed(1) + '" y="' + padT +
             '" width="' + cw.toFixed(1) + '" height="' + (H - padT - padB) + '" fill="transparent"/>';
    });
    svg += '</svg>';

    var wrap = el('<div class="chart">' + svg + '</div>');
    wrap.addEventListener('mousemove', function (ev) {
      var hit = ev.target.closest('.hit');
      if (!hit) { App.tipHide(); return; }
      var i = +hit.dataset.i;
      var html = '<b>' + esc(opt.labels[i]) + '</b>' + opt.series.map(function (s) {
        return '<div>' + esc(s.nome) + ': ' + esc(fmt(s.dados[i])) + '</div>';
      }).join('');
      App.tipShow(html, ev.clientX, ev.clientY);
    });
    wrap.addEventListener('mouseleave', App.tipHide);
    return wrap;
  },

  /* ---------- gráfico de linhas ---------- */
  lineChart: function (opt) {
    /* opt: {labels, series:[{nome, dados, cor:'a'|'b'}], fmt(v)} */
    var W = 760, H = 260, padL = 8, padR = 8, padT = 14, padB = 26;
    var max = 0;
    opt.series.forEach(function (s) { s.dados.forEach(function (v) { if (v > max) max = v; }); });
    max = max * 1.15 || 1;
    var n = opt.labels.length, cw = (W - padL - padR) / n;
    var strokes = { a: 'var(--text)', b: 'var(--info)' };
    var fmt = opt.fmt || function (v) { return String(v); };
    var svg = '<svg viewBox="0 0 ' + W + ' ' + H + '">';
    for (var g = 0; g <= 3; g++) {
      var gy = padT + (H - padT - padB) * (g / 3);
      svg += '<line class="gl" x1="' + padL + '" y1="' + gy.toFixed(1) + '" x2="' + (W - padR) + '" y2="' + gy.toFixed(1) + '"/>';
    }
    opt.labels.forEach(function (lb, i) {
      svg += '<text class="ax" x="' + (padL + cw * i + cw / 2).toFixed(1) + '" y="' + (H - 8) + '" text-anchor="middle">' + esc(lb) + '</text>';
      svg += '<rect class="hit" data-i="' + i + '" x="' + (padL + cw * i).toFixed(1) + '" y="' + padT + '" width="' + cw.toFixed(1) + '" height="' + (H - padT - padB) + '" fill="transparent"/>';
    });
    opt.series.forEach(function (s) {
      var d = '';
      s.dados.forEach(function (v, i) {
        var x = padL + cw * i + cw / 2;
        var y = H - padB - (v / max) * (H - padT - padB);
        d += (i ? 'L' : 'M') + x.toFixed(1) + ' ' + y.toFixed(1);
      });
      svg += '<path class="ln" d="' + d + '" stroke="' + (strokes[s.cor] || strokes.a) + '"/>';
      s.dados.forEach(function (v, i) {
        var x = padL + cw * i + cw / 2;
        var y = H - padB - (v / max) * (H - padT - padB);
        svg += '<circle class="pt" cx="' + x.toFixed(1) + '" cy="' + y.toFixed(1) + '" r="2.8" stroke="' + (strokes[s.cor] || strokes.a) + '"/>';
      });
    });
    svg += '</svg>';

    var wrap = el('<div class="chart">' + svg + '</div>');
    wrap.addEventListener('mousemove', function (ev) {
      var hit = ev.target.closest('.hit');
      if (!hit) { App.tipHide(); return; }
      var i = +hit.dataset.i;
      App.tipShow('<b>' + esc(opt.labels[i]) + '</b>' + opt.series.map(function (s) {
        return '<div>' + esc(s.nome) + ': ' + esc(fmt(s.dados[i])) + '</div>';
      }).join(''), ev.clientX, ev.clientY);
    });
    wrap.addEventListener('mouseleave', App.tipHide);
    return wrap;
  },

  /* ---------- funil ---------- */
  funnel: function (etapas) {
    var top = etapas[0].qtd || 1;
    var rows = etapas.map(function (e, i) {
      var pctEtapa = i === 0 ? '—' : ((e.qtd / etapas[i - 1].qtd) * 100).toFixed(1).replace('.', ',') + '%';
      return '<div class="fn-r"><span class="muted">' + esc(e.etapa) + '</span>' +
        '<span class="track"><i style="width:' + ((e.qtd / top) * 100).toFixed(1) + '%"></i></span>' +
        '<span class="cv"><b class="num">' + e.qtd.toLocaleString('pt-BR') + '</b> · ' + pctEtapa + '</span></div>';
    });
    return '<div class="funnel">' + rows.join('') + '</div>';
  },

  /* ---------- tabela com busca / ordenação / paginação ---------- */
  table: function (cfg) {
    /* cfg: {cols:[{lb, k, sort?, render(row), th?}], rows, search(k), pageSize, onRow(row), empty} */
    var state = { q: '', sk: null, sd: 1, pg: 1, ps: cfg.pageSize || 8 };
    var root = el('<div></div>');

    function filtered() {
      var rows = cfg.rows.slice();
      if (state.q && cfg.search) {
        var q = state.q.toLowerCase();
        rows = rows.filter(function (r) { return String(cfg.search(r)).toLowerCase().indexOf(q) > -1; });
      }
      if (state.sk != null) {
        var col = cfg.cols.filter(function (c) { return c.k === state.sk; })[0];
        rows.sort(function (a, b) {
          var x = col.sort ? col.sort(a) : a[col.k], y = col.sort ? col.sort(b) : b[col.k];
          if (typeof x === 'string') return x.localeCompare(y, 'pt-BR') * state.sd;
          return (x - y) * state.sd;
        });
      }
      return rows;
    }

    function render() {
      var rows = filtered();
      var pages = Math.max(1, Math.ceil(rows.length / state.ps));
      if (state.pg > pages) state.pg = pages;
      var vis = rows.slice((state.pg - 1) * state.ps, state.pg * state.ps);
      var html = '';

      if (cfg.search !== false) {
        html += '<div class="toolbar">' +
          '<input class="in" type="search" id="tbQ" placeholder="Buscar…" value="' + esc(state.q) + '" style="width:230px">' +
          (cfg.toolbar || '') + '<span class="grow"></span>' +
          '<span class="small">' + rows.length + ' registro' + (rows.length === 1 ? '' : 's') + '</span></div>';
      }

      if (!rows.length) {
        html += App.empty(cfg.empty || 'Nenhum resultado encontrado.', 'Ajuste a busca ou os filtros.', cfg.emptyAction);
      } else {
        html += '<div class="tw"><table><thead><tr>' + cfg.cols.map(function (c) {
          var on = state.sk === c.k ? ' on' : '';
          var ar = c.k ? '<span class="ar">' + (state.sk === c.k ? (state.sd > 0 ? '↑' : '↓') : '↕') + '</span>' : '';
          return '<th class="' + (c.k ? 'srt' + on : '') + '" data-k="' + (c.k || '') + '">' + esc(c.lb) + ar + '</th>';
        }).join('') + '</tr></thead><tbody>' +
          vis.map(function (r, ri) {
            return '<tr class="' + (cfg.onRow ? 'click' : '') + '" data-i="' + ri + '">' +
              cfg.cols.map(function (c) {
                return '<td data-th="' + esc(c.lb) + '">' + (c.render ? c.render(r) : esc(r[c.k])) + '</td>';
              }).join('') + '</tr>';
          }).join('') +
          '</tbody></table></div>';
        if (pages > 1 || rows.length > 5) {
          html += '<div class="pag"><span class="small">Página ' + state.pg + ' de ' + pages + '</span><span class="pg">' +
            '<button data-pg="prev"' + (state.pg === 1 ? ' disabled' : '') + '>' + icon('chev-l', 13) + '</button>' +
            Array.from({ length: pages }, function (_, i) {
              return '<button data-pg="' + (i + 1) + '" class="' + (i + 1 === state.pg ? 'on' : '') + '">' + (i + 1) + '</button>';
            }).join('') +
            '<button data-pg="next"' + (state.pg === pages ? ' disabled' : '') + '>' + icon('chev-r', 13) + '</button>' +
            '</span></div>';
        }
      }
      root.innerHTML = html;

      var qEl = root.querySelector('#tbQ');
      if (qEl) qEl.addEventListener('input', function () { state.q = qEl.value; state.pg = 1; render(); qEl.focus(); restoreCaret(qEl); });
      function restoreCaret(inp) { try { inp.setSelectionRange(inp.value.length, inp.value.length); } catch (e) {} }
      root.querySelectorAll('th.srt').forEach(function (th) {
        th.addEventListener('click', function () {
          var k = th.dataset.k;
          if (state.sk === k) state.sd *= -1; else { state.sk = k; state.sd = 1; }
          render();
        });
      });
      root.querySelectorAll('.pag button[data-pg]').forEach(function (b) {
        b.addEventListener('click', function () {
          var v = b.dataset.pg;
          if (v === 'prev') state.pg--; else if (v === 'next') state.pg++; else state.pg = +v;
          render();
        });
      });
      if (cfg.onRow) {
        root.querySelectorAll('tbody tr.click').forEach(function (tr) {
          tr.addEventListener('click', function (ev) {
            if (ev.target.closest('button,a')) return;
            cfg.onRow(vis[+tr.dataset.i]);
          });
        });
      }
      root.querySelectorAll('[data-act]').forEach(function (b) {
        b.addEventListener('click', function () {
          var act = cfg.actions && cfg.actions[b.dataset.act];
          if (act) act();
        });
      });
    }
    render();
    return root;
  },

  /* ---------- estado vazio ---------- */
  empty: function (title, msg, action) {
    return '<div class="empty"><span class="ei">' + icon('inbox', 20) + '</span>' +
      '<h4>' + esc(title) + '</h4><p>' + esc(msg || '') + '</p>' +
      (action ? '<button class="btn btn-p btn-sm" data-act="' + action.act + '" style="margin-top:4px">' + esc(action.lb) + '</button>' : '') +
      '</div>';
  },

  skeleton: function () {
    return '<div class="sk-grid">' + '<div class="skel"></div>'.repeat(4) + '</div>' +
           '<div class="skel sk-card"></div>';
  },

  /* ---------- modal ---------- */
  modal: function (cfg) {
    /* cfg: {title, body(html), wide, actions:[{lb, cls, onClick(close, root)}]} */
    var rootEl = document.getElementById('modalRoot');
    var box = el('<div class="m-box' + (cfg.wide ? ' wide' : '') + '" role="dialog" aria-modal="true">' +
      '<div class="m-h"><h3>' + esc(cfg.title || '') + '</h3>' +
      '<button class="iconbtn" data-close aria-label="Fechar">' + icon('x', 15) + '</button></div>' +
      '<div class="m-b">' + (cfg.body || '') + '</div>' +
      (cfg.actions ? '<div class="m-f"></div>' : '') + '</div>');
    var bg = el('<div class="m-bg" data-close></div>');
    function close() {
      rootEl.innerHTML = '';
      rootEl.hidden = true;
      document.body.style.overflow = '';
      document.removeEventListener('keydown', escKey);
    }
    function escKey(ev) { if (ev.key === 'Escape') close(); }
    if (cfg.actions) {
      var f = box.querySelector('.m-f');
      cfg.actions.forEach(function (a) {
        var b = el('<button class="btn ' + (a.cls || 'btn-g') + '">' + esc(a.lb) + '</button>');
        b.addEventListener('click', function () { a.onClick ? a.onClick(close, box) : close(); });
        f.appendChild(b);
      });
    }
    rootEl.innerHTML = '';
    rootEl.appendChild(bg);
    rootEl.appendChild(box);
    rootEl.hidden = false;
    document.body.style.overflow = 'hidden';
    rootEl.querySelectorAll('[data-close]').forEach(function (n) { n.addEventListener('click', close); });
    document.addEventListener('keydown', escKey);
    var first = box.querySelector('input,textarea,select');
    if (first) setTimeout(function () { first.focus(); }, 40);
    return { close: close, box: box };
  },

  confirm: function (cfg) {
    return App.modal({
      title: cfg.title || 'Confirmar',
      body: '<p class="muted" style="font-size:13.5px">' + esc(cfg.msg || '') + '</p>',
      actions: [
        { lb: 'Cancelar', cls: 'btn-g' },
        { lb: cfg.ok || 'Confirmar', cls: cfg.danger ? 'btn-d' : 'btn-p', onClick: function (close) { close(); cfg.onOk && cfg.onOk(); } }
      ]
    });
  },

  /* ---------- toasts ---------- */
  toast: function (msg, type) {
    var t = el('<div class="toast ' + (type || '') + '"><i class="ti"></i><span>' + esc(msg) + '</span></div>');
    document.getElementById('toasts').appendChild(t);
    setTimeout(function () { t.classList.add('out'); setTimeout(function () { t.remove(); }, 320); }, 3200);
  },

  /* ---------- kanban ---------- */
  kanban: function (cfg) {
    /* cfg: {cols:[{id,nome}], items, colOf(item), card(item)->html, onMove(itemId, colId), emptyMsg} */
    var wrap = el('<div class="kb"></div>');
    var dragId = null;

    function render() {
      wrap.innerHTML = '';
      cfg.cols.forEach(function (col) {
        var items = cfg.items.filter(function (it) { return cfg.colOf(it) === col.id; });
        var colEl = el('<div class="kb-col" data-col="' + col.id + '">' +
          '<div class="kb-ch">' + esc(col.nome) + '<span class="n">' + items.length + '</span></div></div>');
        items.forEach(function (it) {
          var card = el('<div class="kb-card" draggable="true" data-id="' + it.id + '">' + cfg.card(it) + '</div>');
          card.addEventListener('dragstart', function () { dragId = it.id; card.classList.add('drag'); });
          card.addEventListener('dragend', function () { dragId = null; card.classList.remove('drag'); });
          if (cfg.onCard) card.addEventListener('click', function (ev) { if (!dragId) cfg.onCard(it, ev); });
          colEl.appendChild(card);
        });
        if (!items.length) {
          colEl.appendChild(el('<div class="small" style="padding:10px 4px;text-align:center">' + esc(cfg.emptyMsg || 'Vazio') + '</div>'));
        }
        colEl.addEventListener('dragover', function (ev) { ev.preventDefault(); colEl.classList.add('over'); });
        colEl.addEventListener('dragleave', function () { colEl.classList.remove('over'); });
        colEl.addEventListener('drop', function (ev) {
          ev.preventDefault();
          colEl.classList.remove('over');
          if (dragId != null && cfg.onMove) cfg.onMove(dragId, col.id);
        });
        wrap.appendChild(colEl);
      });
    }
    render();
    wrap._rerender = render;
    return wrap;
  },

  /* ---------- campos de formulário ---------- */
  field: function (lb, inner) { return '<label class="f"><span>' + esc(lb) + '</span>' + inner + '</label>'; },
  input: function (attrs) { return '<input class="in" ' + (attrs || '') + '>'; },
  select: function (opts, sel) {
    return '<select class="in">' + opts.map(function (o) {
      return '<option' + (o === sel ? ' selected' : '') + '>' + esc(o) + '</option>';
    }).join('') + '</select>';
  },

  /* ---------- navegação auxiliar ---------- */
  clienteNome: function (id) { var c = App.cliente(id); return c ? c.empresa : '—'; },
  cliente: function (id) { return DB.clientes.filter(function (c) { return c.id === id; })[0]; },
  projeto: function (id) { return DB.projetos.filter(function (p) { return p.id === id; })[0]; },
  servico: function (id) { var s = DB.servicos.filter(function (x) { return x.id === id; })[0]; return s ? s.nome : '—'; },

  setPage: function (title, sub, actions) {
    document.getElementById('pTitle').textContent = title || '';
    document.getElementById('pSub').innerHTML = sub || '';
    document.getElementById('pSub').style.display = sub ? '' : 'none';
    document.getElementById('pAct').innerHTML = actions || '';
    return document.getElementById('pAct');
  }
};

/* ============================ roteador ============================ */
(function () {
  var NAV = [
    { id: 'dashboard',  lb: 'Dashboard',    ic: 'grid' },
    { id: 'clientes',   lb: 'Clientes',     ic: 'users' },
    { id: 'leads',      lb: 'Leads / CRM',  ic: 'filter' },
    { id: 'projetos',   lb: 'Projetos',     ic: 'briefcase' },
    { id: 'servicos',   lb: 'Serviços',     ic: 'box' },
    { id: 'vendas',     lb: 'Vendas',       ic: 'tag' },
    { id: 'financeiro', lb: 'Financeiro',   ic: 'dollar' },
    { id: 'tarefas',    lb: 'Tarefas',      ic: 'check-square' },
    { id: 'suporte',    lb: 'Suporte',      ic: 'lifebuoy' },
    { id: 'analytics',  lb: 'Analytics',    ic: 'bar-chart' },
    { id: 'automacoes', lb: 'Automações',   ic: 'zap' },
    { id: 'arquivos',   lb: 'Arquivos',     ic: 'folder' },
    { id: 'equipe',     lb: 'Equipe',       ic: 'user' },
    { id: 'config',     lb: 'Configurações', ic: 'settings' }
  ];
  App.NAV = NAV;

  function counts() {
    return {
      leads: DB.leads.filter(function (l) { return l.col !== 'fechado' && l.col !== 'perdido'; }).length,
      suporte: DB.tickets.filter(function (t) { return ['Aberto', 'Em análise', 'Em andamento'].indexOf(t.status) > -1; }).length,
      tarefas: DB.tarefas.filter(function (t) { return t.col !== 'concluido'; }).length
    };
  }

  function renderNav(active) {
    var c = counts();
    document.getElementById('sbNav').innerHTML = NAV.map(function (n) {
      return '<a class="sb-i' + (active === n.id ? ' on' : '') + '" href="#/' + n.id + '">' + icon(n.ic, 16) +
        '<span>' + n.lb + '</span>' + (c[n.id] ? '<span class="cnt">' + c[n.id] + '</span>' : '') + '</a>';
    }).join('');
  }

  function renderSbUser() {
    var email = '';
    try { email = localStorage.getItem('orvex-session') || ''; } catch (e) {}
    var u = DB.usuario;
    var box = el('<div class="sb-user"><div class="av">' + u.iniciais + '</div>' +
      '<div class="grow"><div class="ui-n">' + esc(u.nome) + '</div><div class="ui-r">' + esc(u.cargo) + ' · ' + esc(email) + '</div></div>' +
      '<button class="iconbtn" id="sbUserBtn" aria-label="Menu do perfil">' + icon('more', 15) + '</button></div>');
    box.querySelector('#sbUserBtn').addEventListener('click', function (ev) {
      ev.stopPropagation();
      App.modal({
        title: u.nome,
        body: '<p class="small" style="margin-bottom:14px">' + esc(u.cargo) + ' · ' + esc(email) + '</p>' +
          '<div style="display:flex;flex-direction:column;gap:8px">' +
          '<a class="btn btn-g" href="#/config" data-close>Preferências e perfil</a>' +
          '<a class="btn btn-g" href="../index.html">Voltar ao site</a>' +
          '<button class="btn btn-d" id="mLogout">' + icon('logout', 14) + ' Sair da conta</button></div>',
        actions: []
      });
      var lg = document.getElementById('mLogout');
      if (lg) lg.addEventListener('click', function () {
        try { localStorage.removeItem('orvex-session'); } catch (e) {}
        location.href = '../index.html';
      });
    });
    var host = document.getElementById('sbUser');
    host.innerHTML = '';
    host.appendChild(box);
  }

  function matchRoute(hash) {
    var path = (hash || location.hash || '#/dashboard').replace(/^#\/?/, '');
    var seg = path.split('/').filter(Boolean);
    if (!seg.length) seg = ['dashboard'];
    /* rota exata */
    if (App.pages[seg[0]] && seg.length === 1) return { def: App.pages[seg[0]], params: {}, id: seg[0] };
    /* rota com parâmetro: 'clientes/:id' registrada como pages['clientes'] com def.detail */
    var base = App.pages[seg[0]];
    if (base && seg.length > 1 && base.detail) return { def: base, params: { id: seg.slice(1).join('/') }, id: seg[0], detail: true };
    return null;
  }

  function navigate() {
    var m = matchRoute();
    var view = document.getElementById('view');
    if (!m) {
      renderNav('');
      App.setPage('Página não encontrada', 'O endereço acessado não existe no painel.');
      view.innerHTML = App.empty('Página não encontrada', 'Use o menu lateral para navegar.', { act: 'home', lb: 'Ir ao Dashboard' });
      view.querySelector('[data-act=home]').addEventListener('click', function () { App.go('#/dashboard'); });
      document.getElementById('crumb').innerHTML = '<b>404</b>';
      return;
    }
    renderNav(m.id);
    closeSb();
    view.innerHTML = App.skeleton();
    document.getElementById('crumb').innerHTML = 'Painel <b>/ ' + esc(m.def.crumb || m.id) + '</b>';
    setTimeout(function () {
      App.current = m;
      try {
        view.innerHTML = '';
        if (m.detail) m.def.detail(m.params, view);
        else m.def.render(view);
      } catch (err) {
        view.innerHTML = App.empty('Algo deu errado', 'Não foi possível carregar este módulo.');
        if (window.console) console.error(err);
      }
      window.scrollTo(0, 0);
    }, 220);
  }
  App.navigate = navigate;

  /* ---------- sidebar mobile ---------- */
  function openSb() {
    document.getElementById('sb').classList.add('open');
    document.getElementById('sbBg').classList.add('on');
  }
  function closeSb() {
    document.getElementById('sb').classList.remove('open');
    document.getElementById('sbBg').classList.remove('on');
  }
  App.closeSb = closeSb;

  /* ---------- notificações ---------- */
  function bellCount() { return DB.notificacoes.filter(function (n) { return !n.lida; }).length; }
  function refreshBell() {
    var d = document.getElementById('bellDot');
    if (d) d.className = bellCount() ? 'dot' : 'dot off';
  }
  function toggleNotif() {
    var p = document.getElementById('notif');
    if (!p.hidden) { p.hidden = true; return; }
    renderNotif();
    p.hidden = false;
  }
  function renderNotif() {
    var p = document.getElementById('notif');
    p.innerHTML = '<div class="notif-h"><h4>Notificações</h4>' +
      '<button class="btn btn-g btn-sm" id="notifAll">Marcar todas como lidas</button></div>' +
      '<div class="notif-l">' + DB.notificacoes.map(function (n) {
        return '<div class="li' + (n.lida ? '' : ' unread') + '" data-n="' + n.id + '" style="cursor:pointer">' +
          '<span class="ico">' + icon(n.ico, 14) + '</span>' +
          '<span class="grow"><span class="t1">' + esc(n.txt) + '</span><span class="t2">' + esc(n.ago) + '</span></span></div>';
      }).join('') + '</div>';
    p.querySelector('#notifAll').addEventListener('click', function () {
      DB.notificacoes.forEach(function (n) { n.lida = true; });
      refreshBell(); renderNotif();
      App.toast('Notificações marcadas como lidas.');
    });
    p.querySelectorAll('.li[data-n]').forEach(function (li) {
      li.addEventListener('click', function () {
        var n = DB.notificacoes.filter(function (x) { return x.id === li.dataset.n; })[0];
        if (n) { n.lida = true; refreshBell(); p.hidden = true; if (n.rota) App.go(n.rota); }
      });
    });
  }

  /* ---------- pesquisa global ---------- */
  function openGs() {
    var g = document.getElementById('gs');
    g.hidden = false;
    document.body.style.overflow = 'hidden';
    var inp = document.getElementById('gsInput');
    inp.value = '';
    searchGs('');
    setTimeout(function () { inp.focus(); }, 30);
  }
  function closeGs() {
    document.getElementById('gs').hidden = true;
    document.body.style.overflow = '';
  }
  App.closeGs = closeGs;

  function searchGs(q) {
    var res = document.getElementById('gsRes');
    q = (q || '').trim().toLowerCase();
    if (!q) {
      res.innerHTML = '<div class="gs-g">Atalhos</div>' +
        [['#/dashboard', 'Dashboard'], ['#/leads', 'Leads / CRM'], ['#/clientes', 'Clientes'], ['#/projetos', 'Projetos'], ['#/financeiro', 'Financeiro'], ['#/suporte', 'Suporte']]
          .map(function (s) { return '<div class="gs-i" data-go="' + s[0] + '">' + icon('chev-r', 14) + s[1] + '</div>'; }).join('');
    } else {
      var groups = [
        { lb: 'Clientes', rota: function (r) { return '#/clientes/' + r.id; }, txt: function (r) { return r.nome; }, sub: function (r) { return r.empresa; },
          itens: DB.clientes.filter(function (r) { return (r.nome + ' ' + r.empresa).toLowerCase().indexOf(q) > -1; }) },
        { lb: 'Leads', rota: function () { return '#/leads'; }, txt: function (r) { return r.nome; }, sub: function (r) { return r.empresa + ' · ' + r.servico; },
          itens: DB.leads.filter(function (r) { return (r.nome + ' ' + r.empresa + ' ' + r.servico).toLowerCase().indexOf(q) > -1; }) },
        { lb: 'Projetos', rota: function (r) { return '#/projetos/' + r.id; }, txt: function (r) { return r.nome; }, sub: function (r) { return r.status + ' · ' + r.progresso + '%'; },
          itens: DB.projetos.filter(function (r) { return r.nome.toLowerCase().indexOf(q) > -1; }) },
        { lb: 'Tarefas', rota: function () { return '#/tarefas'; }, txt: function (r) { return r.titulo; }, sub: function (r) { return r.resp; },
          itens: DB.tarefas.filter(function (r) { return r.titulo.toLowerCase().indexOf(q) > -1; }) },
        { lb: 'Tickets', rota: function () { return '#/suporte'; }, txt: function (r) { return '#' + r.num + ' · ' + r.assunto; }, sub: function (r) { return r.cliente; },
          itens: DB.tickets.filter(function (r) { return (r.assunto + ' ' + r.cliente + ' ' + r.num).toLowerCase().indexOf(q) > -1; }) },
        { lb: 'Arquivos', rota: function () { return '#/arquivos'; }, txt: function (r) { return r.nome; }, sub: function (r) { return r.pasta + ' · ' + r.tam; },
          itens: DB.arquivos.filter(function (r) { return r.nome.toLowerCase().indexOf(q) > -1; }) },
        { lb: 'Serviços', rota: function () { return '#/servicos'; }, txt: function (r) { return r.nome; }, sub: function (r) { return brl(r.preco); },
          itens: DB.servicos.filter(function (r) { return r.nome.toLowerCase().indexOf(q) > -1; }) }
      ];
      var html = '';
      var total = 0;
      groups.forEach(function (g) {
        if (!g.itens.length) return;
        total += g.itens.length;
        html += '<div class="gs-g">' + g.lb + '</div>' + g.itens.slice(0, 5).map(function (r) {
          return '<div class="gs-i" data-go="' + g.rota(r) + '"><span>' + esc(g.txt(r)) + '</span><span class="sub">' + esc(g.sub(r)) + '</span></div>';
        }).join('');
      });
      res.innerHTML = total ? html : '<div class="empty" style="padding:36px 20px"><h4>Nenhum resultado para “' + esc(q) + '”</h4><p>Tente outro termo: cliente, projeto, tarefa, ticket, arquivo ou serviço.</p></div>';
    }
    res.querySelectorAll('.gs-i[data-go]').forEach(function (i) {
      i.addEventListener('click', function () { closeGs(); App.go(i.dataset.go); });
    });
  }

  /* ---------- boot ---------- */
  document.addEventListener('DOMContentLoaded', function () {
    var sessEmail = '';
    try { sessEmail = localStorage.getItem('orvex-session') || ''; } catch (e) {}
    var tbAv = document.getElementById('tbAv');
    tbAv.textContent = DB.usuario.iniciais;
    tbAv.title = DB.usuario.nome + ' · ' + (sessEmail || DB.usuario.email);

    renderSbUser();
    refreshBell();

    document.getElementById('sbOpen').addEventListener('click', openSb);
    document.getElementById('sbClose').addEventListener('click', closeSb);
    document.getElementById('sbBg').addEventListener('click', closeSb);
    document.getElementById('tbSearchBtn').addEventListener('click', openGs);
    document.getElementById('gsBg').addEventListener('click', closeGs);
    document.getElementById('gsInput').addEventListener('input', function () { searchGs(this.value); });
    document.getElementById('bellBtn').addEventListener('click', function (ev) { ev.stopPropagation(); toggleNotif(); });
    document.addEventListener('click', function (ev) {
      var p = document.getElementById('notif');
      if (!p.hidden && !p.contains(ev.target)) p.hidden = true;
    });
    document.addEventListener('keydown', function (ev) {
      if (ev.key === '/' && !/^(INPUT|TEXTAREA|SELECT)$/.test(document.activeElement.tagName)) {
        ev.preventDefault(); openGs();
      }
      if (ev.key === 'Escape') { closeGs(); document.getElementById('notif').hidden = true; }
    });

    window.addEventListener('hashchange', navigate);
    navigate();
  });
})();
