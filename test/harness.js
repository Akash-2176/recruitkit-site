// Builds a testable module out of the REAL assets/rk.js.
//
// Why it works this way: rk.js is a bare block that touches the DOM at load time
// (it auto-parses the sample JD on line 87). So we cannot just require() it.
// Instead we run the whole file inside a minimal fake DOM and drive it through
// the window.RK export it already provides. That means the tests exercise the
// SHIPPED code - tables, regexes and all - not a retyped copy that can drift.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const root = path.join(__dirname, '..');
const src = fs.readFileSync(path.join(root, 'assets', 'rk.js'), 'utf8');

// ---- the smallest DOM that rk.js will accept -----------------------------
function makeEl(id) {
  const el = {
    id,
    value: '',
    textContent: '',
    innerHTML: '',
    hidden: false,
    dataset: {},
    _rows: null,
    classList: { add() {}, remove() {}, contains: () => false },
    attributes: {},
    setAttribute(k, v) { this.attributes[k] = v; },
    getAttribute(k) { return this.attributes[k]; },
    addEventListener() {},
    focus() {},
    closest: () => null,
    querySelector: () => null,
  };
  return el;
}

function buildSandbox() {
  const els = {};
  const ids = ['jd', 'titles', 'chips', 'loc', 'exp', 'visa', 'excl', 'out',
    'go', 'clr', 'smp', 'smpnote', 'strict', 'broad', 'toast'];
  ids.forEach(id => { els[id] = makeEl(id); });
  els.excl.value = 'recruiter, staffing, intern';

  const sandbox = {
    document: {
      getElementById: id => els[id] || makeEl(id),
      createRange: () => ({ selectNodeContents() {} }),
    },
    getSelection: () => ({ removeAllRanges() {}, addRange() {} }),
    navigator: { clipboard: { writeText: async () => {} } },
    setTimeout, clearTimeout,
    console,
    window: {},
  };
  sandbox.window.RK_NOAUTO = true;   // suppress the load-time auto-parse
  sandbox.globalThis = sandbox;
  return { sandbox, els };
}

/**
 * Parse a JD through the real rk.js and read the results back off the fake DOM.
 * Returns the same shape the UI shows the recruiter.
 */
function analyze(jd, opts = {}) {
  const { sandbox, els } = buildSandbox();
  vm.createContext(sandbox);
  vm.runInContext(src, sandbox, { filename: 'assets/rk.js' });

  els.jd.value = jd;
  if (opts.exclude !== undefined) els.excl.value = opts.exclude;
  sandbox.window.RK.parse();

  const rows = els.out._rows || [];
  return {
    titles: els.titles.value ? els.titles.value.split(',').map(s => s.trim()).filter(Boolean) : [],
    loc: els.loc.textContent,
    exp: els.exp.textContent,
    visa: els.visa.textContent,
    chipsHtml: els.chips.innerHTML,
    rows,
    boards: rows.map(r => r.b),
    str: Object.fromEntries(rows.map(r => [r.b, r.s])),
    outHtml: els.out.innerHTML,
  };
}

// Skill chips, read out of the rendered chip markup (orange = must).
function skillsFrom(result) {
  const must = [], nice = [], off = [];
  const re = /<button class="chip ([a-z]+)"[^>]*>([^<]*)<\/button>/g;
  let m;
  while ((m = re.exec(result.chipsHtml)) !== null) {
    const name = m[2].replace(/&amp;/g, '&').replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>').replace(/&quot;/g, '"');
    if (m[1] === 'must') must.push(name);
    else if (m[1] === 'nice') nice.push(name);
    else off.push(name);
  }
  return { must, nice, off };
}

module.exports = { analyze, skillsFrom };
