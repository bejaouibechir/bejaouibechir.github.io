/*
  Moteur déterministe du site — 17 opérations du DSL Hydra sur un tableau d'objets.

  Sa seule raison d'être : montrer en direct ce que le vrai moteur produirait.
  Sa fidélité est vérifiée par scripts/test_engine.cjs, qui compare chaque sortie
  aux fixtures produites par le PandasEngine réel sur le jeu canonique.

  `script` n'est pas simulé — il exécute du Python. L'opération est refusée
  explicitement plutôt qu'ignorée en silence.

  Aucune dépendance.
*/
(function (root, factory) {
  if (typeof module === 'object' && module.exports) module.exports = factory();
  else root.HydraEngine = factory();
})(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  /* ─────────────── helpers ─────────────── */

  const isNull = (v) => v === null || v === undefined || (typeof v === 'number' && Number.isNaN(v));
  const clone = (rows) => rows.map((r) => Object.assign({}, r));
  const colsOf = (rows) => (rows.length ? Object.keys(rows[0]) : []);

  function cmp(a, b) {
    if (isNull(a) && isNull(b)) return 0;
    if (isNull(a)) return 1;   // pandas place les NaN en fin
    if (isNull(b)) return -1;
    if (typeof a === 'number' && typeof b === 'number') return a - b;
    return String(a) < String(b) ? -1 : String(a) > String(b) ? 1 : 0;
  }

  /* ─────────────── évaluateur d'expressions ───────────────
     Sous-ensemble de la syntaxe pandas query/eval réellement utilisé par le DSL :
     colonnes, nombres, chaînes, + - * / %, comparaisons, and/or/not, parenthèses. */

  function tokenize(src) {
    const t = [];
    const re = /\s*(>=|<=|==|!=|&&|\|\||[-+*/%()<>,]|'[^']*'|"[^"]*"|[A-Za-z_][A-Za-z0-9_.]*|\d+\.?\d*)/y;
    let m;
    while ((m = re.exec(src)) !== null) {
      t.push(m[1]);
      if (re.lastIndex >= src.length) break;
    }
    if (!t.length) throw new Error('expression vide');
    return t;
  }

  function parse(tokens) {
    let i = 0;
    const peek = () => tokens[i];
    const next = () => tokens[i++];

    function primary() {
      const tok = next();
      if (tok === undefined) throw new Error('expression incomplète');
      if (tok === '(') { const e = orExpr(); if (next() !== ')') throw new Error('parenthèse fermante manquante'); return e; }
      if (tok === '-') { const e = primary(); return { t: 'neg', e }; }
      if (tok === 'not' || tok === '!') { const e = primary(); return { t: 'not', e }; }
      if (/^['"]/.test(tok)) return { t: 'lit', v: tok.slice(1, -1) };
      if (/^\d/.test(tok)) return { t: 'lit', v: parseFloat(tok) };
      if (tok === 'True' || tok === 'true') return { t: 'lit', v: true };
      if (tok === 'False' || tok === 'false') return { t: 'lit', v: false };
      return { t: 'col', name: tok };
    }
    function mul() {
      let l = primary();
      while (peek() === '*' || peek() === '/' || peek() === '%') l = { t: 'bin', op: next(), l, r: primary() };
      return l;
    }
    function add() {
      let l = mul();
      while (peek() === '+' || peek() === '-') l = { t: 'bin', op: next(), l, r: mul() };
      return l;
    }
    function comparison() {
      let l = add();
      while (['>', '<', '>=', '<=', '==', '!='].indexOf(peek()) >= 0) l = { t: 'bin', op: next(), l, r: add() };
      return l;
    }
    function andExpr() {
      let l = comparison();
      while (peek() === 'and' || peek() === '&&' || peek() === '&') { next(); l = { t: 'and', l, r: comparison() }; }
      return l;
    }
    function orExpr() {
      let l = andExpr();
      while (peek() === 'or' || peek() === '||' || peek() === '|') { next(); l = { t: 'or', l, r: andExpr() }; }
      return l;
    }
    const ast = orExpr();
    if (i < tokens.length) throw new Error('jeton inattendu : ' + tokens[i]);
    return ast;
  }

  function evalNode(node, row) {
    switch (node.t) {
      case 'lit': return node.v;
      case 'col':
        if (!(node.name in row)) throw new Error("colonne inconnue : '" + node.name + "'");
        return row[node.name];
      case 'neg': { const v = evalNode(node.e, row); return isNull(v) ? null : -v; }
      case 'not': { const v = evalNode(node.e, row); return isNull(v) ? false : !v; }
      case 'and': return Boolean(evalNode(node.l, row)) && Boolean(evalNode(node.r, row));
      case 'or': return Boolean(evalNode(node.l, row)) || Boolean(evalNode(node.r, row));
      case 'bin': {
        const a = evalNode(node.l, row), b = evalNode(node.r, row);
        const arith = ['+', '-', '*', '/', '%'].indexOf(node.op) >= 0;
        if (isNull(a) || isNull(b)) return arith ? null : false;  // NaN se propage, comparaison fausse
        switch (node.op) {
          case '+': return typeof a === 'string' || typeof b === 'string' ? String(a) + String(b) : a + b;
          case '-': return a - b;
          case '*': return a * b;
          case '/': return a / b;
          case '%': return a % b;
          case '>': return a > b;
          case '<': return a < b;
          case '>=': return a >= b;
          case '<=': return a <= b;
          case '==': return a === b;
          case '!=': return a !== b;
        }
      }
    }
    throw new Error('nœud inconnu');
  }

  const compile = (expr) => { const ast = parse(tokenize(expr)); return (row) => evalNode(ast, row); };

  /* ─────────────── opérations ─────────────── */

  const OPS = {
    select(rows, p) {
      const cols = p.columns || [];
      return rows.map((r) => { const o = {}; cols.forEach((c) => { o[c] = c in r ? r[c] : null; }); return o; });
    },

    rename(rows, p) {
      const m = p.mapping || {};
      return rows.map((r) => { const o = {}; Object.keys(r).forEach((k) => { o[k in m ? m[k] : k] = r[k]; }); return o; });
    },

    cast(rows, p) {
      const m = p.mapping || {};
      return rows.map((r) => {
        const o = Object.assign({}, r);
        Object.keys(m).forEach((c) => {
          const t = String(m[c]).toLowerCase(), v = o[c];
          if (isNull(v) || v === '') { o[c] = null; return; }
          if (t === 'int' || t === 'integer') { const n = Number(v); o[c] = Number.isNaN(n) ? null : Math.trunc(n); }
          else if (t === 'float') { const n = Number(v); o[c] = Number.isNaN(n) ? null : n; }
          else if (t === 'str' || t === 'string') o[c] = String(v);
          else if (t === 'bool' || t === 'boolean') o[c] = ['true', '1', 'yes', 'y', 'oui'].indexOf(String(v).toLowerCase()) >= 0;
          else if (t.indexOf('datetime') === 0) o[c] = String(v);
          else throw new Error("cast : type non supporté '" + m[c] + "'");
        });
        return o;
      });
    },

    filter(rows, p) { const f = compile(p.expr); return rows.filter((r) => Boolean(f(r))); },

    calculate(rows, p) {
      const f = compile(p.expr);
      return rows.map((r) => { const o = Object.assign({}, r); o[p.column] = f(r); return o; });
    },

    sort(rows, p) {
      const by = Array.isArray(p.by) ? p.by : [p.by];
      const asc = p.ascending === undefined ? true : p.ascending;
      const dir = (i) => (Array.isArray(asc) ? asc[i] !== false : asc !== false) ? 1 : -1;
      return clone(rows).sort((a, b) => {
        for (let i = 0; i < by.length; i++) {
          const x = a[by[i]], y = b[by[i]];
          // pandas : na_position='last', les nuls ne suivent pas le sens du tri
          if (isNull(x) && isNull(y)) continue;
          if (isNull(x)) return 1;
          if (isNull(y)) return -1;
          const c = cmp(x, y);
          if (c) return c * dir(i);
        }
        return 0;
      });
    },

    deduplicate(rows, p) {
      const cols = p.columns && p.columns.length ? p.columns : colsOf(rows);
      const keep = p.keep || 'first';
      const seen = new Map();
      rows.forEach((r, i) => { const k = JSON.stringify(cols.map((c) => r[c])); if (keep === 'last' || !seen.has(k)) seen.set(k, i); });
      const idx = Array.from(seen.values()).sort((a, b) => a - b);
      return idx.map((i) => Object.assign({}, rows[i]));
    },

    fill_null(rows, p) {
      const perCol = p.columns && !Array.isArray(p.columns) ? p.columns : null;
      return rows.map((r) => {
        const o = Object.assign({}, r);
        Object.keys(o).forEach((c) => {
          if (!isNull(o[c])) return;
          if (perCol) { if (c in perCol) o[c] = perCol[c]; }
          else if (p.value !== undefined) o[c] = p.value;
        });
        return o;
      });
    },

    trim(rows, p) {
      const cols = p.columns && p.columns.length ? p.columns : colsOf(rows);
      return rows.map((r) => {
        const o = Object.assign({}, r);
        cols.forEach((c) => { if (c in o) o[c] = String(o[c]).trim(); });
        return o;
      });
    },

    clean(rows, p) {
      const cols = p.columns && p.columns.length ? p.columns : colsOf(rows);
      const cs = String(p.case || 'none').toLowerCase();
      return rows.map((r) => {
        const o = Object.assign({}, r);
        cols.forEach((c) => {
          if (typeof o[c] !== 'string') return;
          let v = o[c].replace(/\s+/g, ' ').trim();
          if (cs === 'lower') v = v.toLowerCase();
          else if (cs === 'upper') v = v.toUpperCase();
          o[c] = v;
        });
        return o;
      });
    },

    aggregate(rows, p) {
      const by = Array.isArray(p.by) ? p.by : [p.by];
      const spec = p.agg || {};
      const groups = new Map();
      rows.forEach((r) => {
        const k = JSON.stringify(by.map((c) => r[c]));
        if (!groups.has(k)) groups.set(k, { keys: by.map((c) => r[c]), rows: [] });
        groups.get(k).rows.push(r);
      });
      const ALIAS = { avg: 'mean' };
      const out = Array.from(groups.values()).map((g) => {
        const o = {};
        by.forEach((c, i) => { o[c] = g.keys[i]; });
        Object.keys(spec).forEach((outCol) => {
          const s = spec[outCol];
          let func = typeof s === 'string' ? s : (s.func || 'sum');
          func = (ALIAS[String(func).toLowerCase()] || String(func).toLowerCase());
          const src = typeof s === 'string' ? outCol : (s.col || outCol);
          const vals = g.rows.map((r) => r[src]).filter((v) => !isNull(v));
          let v;
          if (func === 'sum') v = vals.reduce((a, b) => a + Number(b), 0);
          else if (func === 'count') v = vals.length;
          else if (func === 'mean') v = vals.length ? vals.reduce((a, b) => a + Number(b), 0) / vals.length : null;
          else if (func === 'min') v = vals.length ? vals.reduce((a, b) => (cmp(a, b) <= 0 ? a : b)) : null;
          else if (func === 'max') v = vals.length ? vals.reduce((a, b) => (cmp(a, b) >= 0 ? a : b)) : null;
          else if (func === 'first') v = vals.length ? vals[0] : null;
          else if (func === 'last') v = vals.length ? vals[vals.length - 1] : null;
          else throw new Error("aggregate : fonction non simulée '" + func + "'");
          o[outCol] = v;
        });
        return o;
      });
      return out.sort((a, b) => { for (const c of by) { const d = cmp(a[c], b[c]); if (d) return d; } return 0; });
    },

    join(rows, p, right) {
      if (!right) throw new Error("join : le flux 'right' n'est pas chargé");
      const how = p.how || 'inner';
      if (['inner', 'left', 'right', 'outer'].indexOf(how) < 0) throw new Error('join.how invalide : ' + how);
      const lk = p.left_key ? [].concat(p.left_key) : [].concat(p.key);
      const rk = p.right_key ? [].concat(p.right_key) : [].concat(p.key);
      const rightCols = colsOf(right).filter((c) => rk.indexOf(c) < 0);
      const index = new Map();
      right.forEach((r) => { const k = JSON.stringify(rk.map((c) => r[c])); if (!index.has(k)) index.set(k, []); index.get(k).push(r); });
      const out = []; const used = new Set();
      rows.forEach((l) => {
        const k = JSON.stringify(lk.map((c) => l[c]));
        const matches = index.get(k);
        if (matches) {
          used.add(k);
          matches.forEach((r) => { const o = Object.assign({}, l); rightCols.forEach((c) => { o[c] = r[c]; }); out.push(o); });
        } else if (how === 'left' || how === 'outer') {
          const o = Object.assign({}, l); rightCols.forEach((c) => { o[c] = null; }); out.push(o);
        }
      });
      if (how === 'right' || how === 'outer') {
        right.forEach((r) => {
          const k = JSON.stringify(rk.map((c) => r[c]));
          if (used.has(k)) return;
          const o = {};
          colsOf(rows).forEach((c) => { o[c] = lk.indexOf(c) >= 0 ? r[rk[lk.indexOf(c)]] : null; });
          rightCols.forEach((c) => { o[c] = r[c]; });
          out.push(o);
        });
      }
      return out;
    },

    merge(rows, p, right) {
      if (!right) throw new Error("merge : le flux 'right' n'est pas chargé");
      if (!p.key) throw new Error('merge.key requis');
      const keys = [].concat(p.key);
      const combined = rows.concat(right);
      const kept = new Map();
      combined.forEach((r, i) => { kept.set(JSON.stringify(keys.map((c) => r[c])), i); });
      let idx = Array.from(kept.values()).sort((a, b) => a - b);
      let out = idx.map((i) => Object.assign({}, combined[i]));
      if (p.delete_unmatched) {
        const src = new Set(right.map((r) => JSON.stringify(keys.map((c) => r[c]))));
        out = out.filter((r) => src.has(JSON.stringify(keys.map((c) => r[c]))));
      }
      return out;
    },

    union(rows, p, right) {
      if (!right) throw new Error("union : le flux 'right' n'est pas chargé");
      const out = rows.concat(right).map((r) => Object.assign({}, r));
      if (!p.distinct) return out;
      const seen = new Set();
      return out.filter((r) => { const k = JSON.stringify(r); if (seen.has(k)) return false; seen.add(k); return true; });
    },

    pivot(rows, p) {
      const index = [].concat(p.index || []);
      const column = p.column, values = p.values, aggfunc = p.aggfunc || 'first';
      if (!index.length || !column || !values) throw new Error("pivot requiert 'index', 'column' et 'values'");
      const heads = Array.from(new Set(rows.map((r) => r[column]).filter((v) => !isNull(v)))).sort((a, b) => cmp(a, b));
      const groups = new Map();
      rows.forEach((r) => {
        const k = JSON.stringify(index.map((c) => r[c]));
        if (!groups.has(k)) groups.set(k, { keys: index.map((c) => r[c]), cells: {} });
        const g = groups.get(k), h = r[column];
        (g.cells[h] = g.cells[h] || []).push(r[values]);
      });
      const out = Array.from(groups.values()).map((g) => {
        const o = {};
        index.forEach((c, i) => { o[c] = g.keys[i]; });
        heads.forEach((h) => {
          const present = Object.prototype.hasOwnProperty.call(g.cells, h);
          const vals = (g.cells[h] || []).filter((v) => !isNull(v));
          if (!vals.length) {
            // pandas : une cellule existante mais toute nulle somme a 0 ; une cellule absente reste vide
            o[h] = present && (aggfunc === 'sum' || aggfunc === 'count') ? 0 : null;
            return;
          }
          if (aggfunc === 'sum') o[h] = vals.reduce((a, b) => a + Number(b), 0);
          else if (aggfunc === 'mean') o[h] = vals.reduce((a, b) => a + Number(b), 0) / vals.length;
          else if (aggfunc === 'count') o[h] = vals.length;
          else if (aggfunc === 'min') o[h] = vals.reduce((a, b) => (cmp(a, b) <= 0 ? a : b));
          else if (aggfunc === 'max') o[h] = vals.reduce((a, b) => (cmp(a, b) >= 0 ? a : b));
          else o[h] = vals[0];
        });
        return o;
      });
      return out.sort((a, b) => { for (const c of index) { const d = cmp(a[c], b[c]); if (d) return d; } return 0; });
    },

    unpivot(rows, p) {
      const ids = [].concat(p.id_vars || []);
      const varName = p.var_name || 'variable', valName = p.value_name || 'value';
      const vals = p.value_vars && p.value_vars.length ? p.value_vars : colsOf(rows).filter((c) => ids.indexOf(c) < 0);
      const out = [];
      vals.forEach((v) => {
        rows.forEach((r) => {
          const o = {};
          ids.forEach((c) => { o[c] = r[c]; });
          o[varName] = v;
          o[valName] = r[v];
          out.push(o);
        });
      });
      return out;
    },

    transpose(rows, p) {
      const idx = p.index_col, header = p.header_name || 'column';
      const cols = colsOf(rows).filter((c) => c !== idx);
      const heads = idx ? rows.map((r) => String(r[idx])) : rows.map((_, i) => String(i));
      return cols.map((c) => {
        const o = {}; o[header] = c;
        rows.forEach((r, i) => { o[heads[i]] = r[c]; });
        return o;
      });
    },

    script() {
      throw new Error("script : cette opération exécute du Python, elle n'est pas simulée dans le navigateur.");
    }
  };

  function applyOp(rows, op, params, right) {
    if (!(op in OPS)) throw new Error("opération inconnue : '" + op + "'");
    return OPS[op](rows || [], params || {}, right || null);
  }

  function applySteps(rows, steps, streams) {
    return (steps || []).reduce(function (acc, step) {
      const op = Object.keys(step)[0];
      const p = step[op] || {};
      const right = p.right && streams ? streams[p.right] : null;
      return applyOp(acc, op, p, right);
    }, rows);
  }

  return { applyOp, applySteps, compileExpr: compile, ops: Object.keys(OPS) };
});
