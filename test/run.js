// RecruitKit free-tool regression suite.
//   node test/run.js
//
// Drives the REAL assets/rk.js inside a minimal fake DOM (see harness.js), so
// these checks exercise shipped code. Covers the six per-firm sample JDs used in
// the demo videos, plus adversarial inputs that look like real vendor emails.
const { analyze, skillsFrom } = require('./harness.js');

let pass = 0;
const failures = [];
function check(name, cond, detail) {
  if (cond) pass++;
  else failures.push(`${name}\n      ${detail}`);
}
function hasAll(name, arr, items) {
  for (const it of items) {
    check(`${name}: has "${it}"`, arr.includes(it), `got [${arr.join(', ')}]`);
  }
}

// ------------------------------------------------- the six per-firm sample JDs
const FIRMS = {
  lorven: {
    jd: `Job Title: Senior Java Developer
Location: Dallas, TX (Hybrid, 3 days onsite)
Duration: 12+ months contract
Visa: USC, GC, H1B. W2 / C2C accepted.

Must have:
- 8+ years of experience in Java and Spring Boot
- Strong hands-on with Microservices and REST APIs
- AWS (EC2, Lambda, S3) and Docker / Kubernetes
- Kafka for event streaming

Nice to have:
- React or Angular
- Jenkins CI/CD
- PostgreSQL or Oracle`,
    loc: 'Dallas, TX', exp: '8+ years',
    visa: ['USC', 'GC', 'H1B', 'W2', 'C2C'],
    must: ['Java', 'Spring Boot', 'Microservices', 'AWS', 'Kafka'],
    nice: ['React', 'Jenkins', 'PostgreSQL'],
    title: /java/i,
  },
  cloudious: {
    jd: `Job Title: GenAI Engineer
Location: San Jose, CA (Hybrid 3 days office)
Duration: Long term contract
Visa: USC, GC, H1B. C2C ok.

Must have:
- 5+ years with Python
- LLM / Generative AI apps, RAG
- Machine Learning in production

Nice to have:
- AWS or Azure`,
    loc: 'San Jose, CA', exp: '5+ years',
    visa: ['USC', 'GC', 'H1B', 'C2C'],
    must: ['Python', 'LLM / GenAI', 'Machine Learning'],
    nice: ['AWS', 'Azure'],
    title: /genai|ai engineer/i,
  },
  divihn: {
    jd: `Job Title: Data Engineer
Location: Chicago, IL (Hybrid)
Duration: 6 months contract to hire
Visa: USC, GC only. W2.

Must have:
- 6+ years as a Data Engineer
- Python and SQL
- Snowflake and Airflow

Nice to have:
- Spark`,
    loc: 'Chicago, IL', exp: '6+ years',
    visa: ['USC', 'GC', 'W2'],
    must: ['Python', 'SQL', 'Snowflake', 'Airflow'],
    nice: ['Spark'],
    title: /data engineer/i,
  },
  kovantech: {
    jd: `Job Title: Salesforce Developer
Location: Atlanta, GA (Remote)
Duration: 9 months contract
Visa: H1B, GC, USC. C2C ok.

Must have:
- 6+ years Salesforce development
- Apex, LWC, SOQL
- REST APIs and integrations`,
    loc: 'Atlanta, GA', exp: '6+ years',
    visa: ['H1B', 'GC', 'USC', 'C2C'],
    must: ['Salesforce', 'REST APIs'],
    title: /salesforce/i,
  },
  purpledrive: {
    jd: `Job Title: DevOps Engineer
Location: Irvine, CA (Onsite)
Duration: 12 months contract
Visa: USC, GC only.

Must have:
- 7+ years in DevOps / SRE
- AWS, Terraform, Kubernetes
- Jenkins CI/CD, Docker`,
    loc: 'Irvine, CA', exp: '7+ years',
    visa: ['USC', 'GC'],
    must: ['AWS', 'Terraform', 'Kubernetes', 'Jenkins', 'Docker'],
    title: /devops|sre|site reliability/i,
  },
  tasa: {
    jd: `Job Title: .NET Developer
Location: Charlotte, NC (Hybrid)
Duration: 12 months contract
Visa: USC, GC, H1B. W2 only.

Must have:
- 7+ years with C# and .NET Core
- REST APIs and Microservices
- SQL Server, Azure`,
    loc: 'Charlotte, NC', exp: '7+ years',
    visa: ['USC', 'GC', 'H1B', 'W2'],
    must: ['.NET', 'C#', 'REST APIs', 'Microservices', 'SQL', 'Azure'],
    title: /\.net|c#/i,
  },
};

console.log('\n=== Per-firm sample JDs (the demo-video inputs) ===');
for (const [firm, t] of Object.entries(FIRMS)) {
  const r = analyze(t.jd);
  const sk = skillsFrom(r);
  console.log(`\n  ${firm}`);
  console.log(`    loc="${r.loc}"  exp="${r.exp}"  visa="${r.visa}"`);
  console.log(`    must=[${sk.must.join(', ')}]`);
  if (sk.nice.length) console.log(`    nice=[${sk.nice.join(', ')}]`);

  check(`${firm}: location`, r.loc === t.loc, `expected "${t.loc}", got "${r.loc}"`);
  check(`${firm}: experience`, r.exp === t.exp, `expected "${t.exp}", got "${r.exp}"`);
  check(`${firm}: work-auth populated`, r.visa !== '—' && r.visa !== '',
    `the JD states work-auth terms but the field rendered "${r.visa}"`);
  hasAll(`${firm} visa`, r.visa.split(', '), t.visa);
  hasAll(`${firm} must`, sk.must, t.must);
  if (t.nice) hasAll(`${firm} nice`, sk.nice, t.nice);
  check(`${firm}: title inferred`, t.title.test(r.titles.join(' ')),
    `titles=[${r.titles.join(', ')}] did not match ${t.title}`);
  check(`${firm}: all five boards`, r.boards.length === 5,
    `got ${r.boards.length} boards: [${r.boards.join(', ')}]`);
  // Every board string must carry at least one must-have skill.
  for (const b of r.boards) {
    check(`${firm}: ${b} string non-empty`, (r.str[b] || '').trim().length > 0, 'empty string');
  }
  // Nice-to-haves are deliberately excluded from the strings.
  if (t.nice) {
    for (const n of sk.nice) {
      check(`${firm}: LinkedIn omits nice-to-have "${n}"`,
        !new RegExp('\\b' + n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '\\b').test(r.str['LinkedIn'] || ''),
        `"${n}" leaked into the LinkedIn string`);
    }
  }
}

// --------------------------------------------------------- adversarial inputs
console.log('\n=== Adversarial / real-world inputs ===');

// A real vendor requirement email: no "Location:" label, no comma before state.
{
  const r = analyze(`Hi Team,

Hope you are doing well. Please find below requirement and share profiles ASAP.

Role: Sr. Full Stack Developer (Java + React)
Loc: Austin TX - Hybrid
Exp: 10+ yrs
Rate: $65/hr on C2C
Visa: Any visa except OPT/CPT

JD:
Candidate must have strong Core Java, Spring Boot, ReactJS.
Experience with Kubernetes and Kafka required.
Oracle / PostgreSQL exposure good to have.

Thanks & Regards,
Priya | ABC Staffing`);
  const sk = skillsFrom(r);
  console.log(`\n  vendor email: loc="${r.loc}" exp="${r.exp}" visa="${r.visa}"`);
  console.log(`    must=[${sk.must.join(', ')}]  nice=[${sk.nice.join(', ')}]`);
  check('vendor email: no-comma location resolves', r.loc === 'Austin, TX',
    `expected "Austin, TX", got "${r.loc}" (real emails write "Austin TX")`);
  check('vendor email: experience from "10+ yrs"', r.exp === '10+ years', `got "${r.exp}"`);
  hasAll('vendor email visa', r.visa.split(', '), ['C2C', 'OPT', 'CPT']);
  hasAll('vendor email skills', sk.must, ['Java', 'React', 'Spring Boot', 'Kubernetes', 'Kafka']);
  check('vendor email: "good to have" demotes Oracle/PostgreSQL',
    sk.nice.includes('Oracle') || sk.nice.includes('PostgreSQL'),
    `nice=[${sk.nice.join(', ')}]`);
}

// No title label at all.
{
  const r = analyze(`Senior Python Developer needed in Dallas, TX
8+ years exp. Django, AWS, PostgreSQL. USC/GC only.`);
  console.log(`\n  no-title-label: titles=[${r.titles.join(', ')}] loc="${r.loc}" visa="${r.visa}"`);
  check('no-title-label: infers a Python title', /python/i.test(r.titles.join(' ')),
    `got [${r.titles.join(', ')}]`);
  check('no-title-label: location', r.loc === 'Dallas, TX', `got "${r.loc}"`);
  hasAll('no-title-label visa', r.visa.split(', '), ['USC', 'GC']);
}

// Remote, no city.
{
  const r = analyze('Looking for Guidewire developer, 5+ years, Remote. W2.');
  const sk = skillsFrom(r);
  console.log(`  remote-only: loc="${r.loc}" visa="${r.visa}" must=[${sk.must.join(', ')}]`);
  check('remote-only: loc is Remote', r.loc === 'Remote', `got "${r.loc}"`);
  hasAll('remote-only visa', r.visa.split(', '), ['W2']);
  hasAll('remote-only skills', sk.must, ['Guidewire']);
}

// Junk and empty must NOT produce a bogus quoted Boolean string.
{
  const r = analyze('please send resumes asap thanks');
  const joined = Object.values(r.str).join(' ');
  console.log(`  junk: titles=[${r.titles.join(', ')}] rows=${r.rows.length}`);
  check('junk: no garbage title echoed into a string',
    !/please send resumes/i.test(joined),
    `the junk line was quoted into a search string: ${joined.slice(0, 90)}`);
}
{
  const r = analyze('');
  console.log(`  empty: rows=${r.rows.length}`);
  check('empty input: produces no search rows', r.rows.length === 0,
    `got ${r.rows.length} rows`);
}

// False-positive guard: a 2-letter token that is not a US state.
{
  const r = analyze('Java SE developer wanted. 5+ years. Remote.');
  console.log(`  state-guard: loc="${r.loc}"`);
  check('state-guard: "Java SE" is not read as a location', r.loc !== 'Java, SE',
    `got "${r.loc}" - SE is not a US state`);
}

// Exclusions must reach the strings in each board's own syntax.
{
  const r = analyze(FIRMS.lorven.jd, { exclude: 'recruiter, staffing' });
  console.log(`  exclusions: LinkedIn tail="${(r.str['LinkedIn'] || '').slice(-40)}"`);
  check('exclusions: LinkedIn uses NOT', /NOT recruiter/.test(r.str['LinkedIn'] || ''),
    `got "${r.str['LinkedIn']}"`);
  check('exclusions: Indeed uses -minus', /-recruiter/.test(r.str['Monster / Indeed'] || ''),
    `got "${r.str['Monster / Indeed']}"`);
  // Indeed/Monster resume search has no AND keyword - spaces mean AND.
  check('Indeed: drops the AND keyword', !/ AND /.test(r.str['Monster / Indeed'] || ''),
    `"AND" left in the Indeed string: ${r.str['Monster / Indeed']}`);
  check('Indeed: still carries the skills', /Kafka/.test(r.str['Monster / Indeed'] || ''),
    `got "${r.str['Monster / Indeed']}"`);
}

// X-ray strings must stay well-formed.
{
  const r = analyze(FIRMS.lorven.jd);
  check('x-ray: linkedin site operator', /site:linkedin\.com\/in/.test(r.str['Google X-ray'] || ''),
    `got "${r.str['Google X-ray']}"`);
  check('x-ray: excludes job pages', /-intitle:jobs/.test(r.str['Google X-ray'] || ''),
    'missing -intitle:jobs');
  check('x-ray: github site operator', /site:github\.com/.test(r.str['GitHub X-ray'] || ''),
    `got "${r.str['GitHub X-ray']}"`);
}

// Balanced parentheses and quotes in every generated string.
{
  for (const [firm, t] of Object.entries(FIRMS)) {
    const r = analyze(t.jd);
    for (const b of r.boards) {
      const s = r.str[b] || '';
      const open = (s.match(/\(/g) || []).length, close = (s.match(/\)/g) || []).length;
      check(`${firm}/${b}: balanced parens`, open === close, `${open} "(" vs ${close} ")" in: ${s}`);
      check(`${firm}/${b}: even quote count`, ((s.match(/"/g) || []).length % 2) === 0,
        `odd number of quotes in: ${s}`);
    }
  }
}

// ---------------------------------------------------------------- summary
console.log('\n' + '='.repeat(54));
if (failures.length) {
  console.log(`FAIL  ${pass} passed, ${failures.length} failed\n`);
  failures.forEach((f, i) => console.log(`  ${i + 1}. ${f}`));
  console.log('');
  process.exit(1);
}
console.log(`PASS  all ${pass} checks green\n`);
