#!/usr/bin/env node
/**
 * build.js — regenerates index.html from skills-2028-roadmap.md
 * Edit the markdown, run `node build.js`, and the styled page is rebuilt.
 * The GitHub Action does this automatically on every push that touches the .md.
 */
const fs = require('fs');
const path = require('path');

const SRC = path.join(__dirname, 'skills-2028-roadmap.md');
const OUT = path.join(__dirname, 'index.html');

// ---------- inline markdown → HTML ----------
const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const inline = (s) =>
  esc(s)
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    .replace(/\*([^*]+)\*/g, '<em>$1</em>');
const stripParen = (s) => s.replace(/\s*\(.*\)\s*$/, '').trim();

// ---------- parse ----------
function parse(md) {
  const lines = md.split('\n');
  const doc = { title: '', profile: '', framing: [], sections: [], plan: [], summary: '' };
  let mode = null;          // 'framing' | 'numbered' | 'plan' | 'summary'
  let section = null;       // current numbered section
  let topic = null;         // current topic within a section

  for (const raw of lines) {
    const line = raw.replace(/\s+$/, '');
    if (line === '---' || line.trim() === '') continue;

    let m;
    if ((m = line.match(/^#\s+(.*)$/))) { doc.title = m[1].trim(); continue; }
    if ((m = line.match(/^\*\*Profile:\*\*\s*(.*)$/))) { doc.profile = m[1].trim(); continue; }

    if (/^##\s+The honest framing/.test(line)) { mode = 'framing'; continue; }
    if (/^##\s+A concrete/.test(line)) { mode = 'plan'; continue; }
    if (/^##\s+One-sentence summary/.test(line)) { mode = 'summary'; continue; }

    if ((m = line.match(/^##\s+(\d+)\.\s+(.*)$/))) {
      mode = 'numbered';
      section = { num: m[1], title: m[2].trim(), intro: '', topics: [] };
      topic = null;
      doc.sections.push(section);
      continue;
    }
    if ((m = line.match(/^###\s+(\d+\.\d+)\s+(.*)$/))) {
      topic = { id: m[1], name: m[2].trim(), what: '', why: '', how: '' };
      section.topics.push(topic);
      continue;
    }
    if ((m = line.match(/^-\s+\*\*(What|Why|How):\*\*\s*(.*)$/))) {
      if (topic) topic[m[1].toLowerCase()] = m[2].trim();
      continue;
    }

    // plain paragraph / list lines, dispatched by mode
    if (mode === 'framing') { doc.framing.push(line.trim()); continue; }
    if (mode === 'numbered' && section && !topic && !section.intro) { section.intro = line.trim(); continue; }
    if (mode === 'plan' && (m = line.match(/^\d+\.\s+\*\*(.+?):\*\*\s*(.*)$/))) {
      doc.plan.push({ label: m[1].trim(), text: m[2].trim() });
      continue;
    }
    if (mode === 'summary' && !doc.summary) { doc.summary = line.trim(); continue; }
  }
  return doc;
}

// ---------- assets ----------
const FAVICON_SVG =
  "<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'>" +
  "<defs><linearGradient id='g' x1='0' y1='0' x2='1' y2='1'>" +
  "<stop offset='0' stop-color='#6d5efc'/><stop offset='1' stop-color='#8b5cf6'/></linearGradient></defs>" +
  "<rect width='64' height='64' rx='16' fill='url(%23g)'/>" +
  "<path d='M13 41 L27 27 L37 35 L51 19' fill='none' stroke='#fff' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/>" +
  "<path d='M43 19 L51 19 L51 27' fill='none' stroke='#fff' stroke-width='5' stroke-linecap='round' stroke-linejoin='round'/>" +
  "</svg>";
const FAVICON = 'data:image/svg+xml,' + FAVICON_SVG.replace(/#/g, '%23').replace(/</g, '%3C').replace(/>/g, '%3E').replace(/ /g, '%20');

const CSS = `
  :root{
    --bg:#f7f8fb; --bg-soft:#ffffff; --card:#ffffff; --ink:#1a1d29; --ink-soft:#4a4f60;
    --muted:#767c90; --line:#e6e8f0; --line-soft:#eef0f6;
    --accent:#6d5efc; --accent-2:#8b5cf6; --accent-ink:#5a4bf0;
    --what:#2563eb; --what-bg:#eaf1ff; --why:#b45309; --why-bg:#fff3e0; --how:#0f9d63; --how-bg:#e4f7ee;
    --shadow:0 1px 2px rgba(20,22,40,.04),0 8px 24px rgba(20,22,40,.06);
    --shadow-lg:0 8px 40px rgba(70,60,180,.14);
  }
  @media (prefers-color-scheme: dark){
    :root{
      --bg:#0c0d14; --bg-soft:#12141f; --card:#161826; --ink:#eef0f8; --ink-soft:#c2c6d6;
      --muted:#878da2; --line:#262a3d; --line-soft:#1e2231;
      --accent:#8b7dff; --accent-2:#a78bfa; --accent-ink:#a99cff;
      --what:#6fa0ff; --what-bg:#16233d; --why:#f0b45e; --why-bg:#33260f; --how:#5fd8a0; --how-bg:#0f2f21;
      --shadow:0 1px 2px rgba(0,0,0,.3),0 10px 30px rgba(0,0,0,.35);
      --shadow-lg:0 10px 50px rgba(0,0,0,.5);
    }
  }
  *{box-sizing:border-box}
  html{scroll-behavior:smooth}
  body{
    margin:0; background:var(--bg); color:var(--ink);
    font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
    line-height:1.65; -webkit-font-smoothing:antialiased;
  }
  a{color:var(--accent-ink); text-decoration:none}
  a:hover{text-decoration:underline}
  .wrap{max-width:920px; margin:0 auto; padding:0 22px}
  .hero{
    position:relative; overflow:hidden;
    background:
      radial-gradient(1200px 500px at 15% -10%, rgba(139,92,246,.30), transparent 60%),
      radial-gradient(1000px 500px at 90% 0%, rgba(109,94,252,.28), transparent 55%),
      linear-gradient(180deg, var(--bg-soft), var(--bg));
    border-bottom:1px solid var(--line);
  }
  .hero-inner{padding:76px 22px 54px; max-width:920px; margin:0 auto}
  .eyebrow{
    display:inline-flex; align-items:center; gap:8px; font-size:.78rem; font-weight:700;
    letter-spacing:.09em; text-transform:uppercase; color:var(--accent-ink);
    background:color-mix(in srgb, var(--accent) 12%, transparent);
    border:1px solid color-mix(in srgb, var(--accent) 28%, transparent);
    padding:6px 13px; border-radius:999px;
  }
  h1{
    font-size:clamp(2.1rem,5.2vw,3.4rem); line-height:1.08; margin:20px 0 14px; letter-spacing:-.02em;
    background:linear-gradient(120deg,var(--ink),var(--accent-ink)); -webkit-background-clip:text; background-clip:text; color:transparent;
  }
  .lede{font-size:1.12rem; color:var(--ink-soft); max-width:660px; margin:0 0 8px}
  .profile{display:inline-flex; flex-wrap:wrap; gap:8px; margin-top:22px; font-size:.92rem; color:var(--muted)}
  .bets{display:flex; flex-wrap:wrap; gap:10px; margin-top:28px}
  .bet{
    display:flex; align-items:center; gap:10px; background:var(--card); border:1px solid var(--line);
    padding:10px 15px; border-radius:14px; box-shadow:var(--shadow); font-weight:600; font-size:.94rem;
  }
  .bet b{color:var(--accent-ink); font-size:1.05rem}
  .legend{display:flex; flex-wrap:wrap; gap:18px; margin:28px auto 0; max-width:920px; padding:0 22px}
  .legend .lg{display:flex; align-items:center; gap:9px; font-size:.9rem; color:var(--ink-soft)}
  .dot{width:11px; height:11px; border-radius:50%}
  section{padding:44px 0 8px}
  .frame{
    background:var(--bg-soft); border:1px solid var(--line); border-radius:18px;
    padding:24px 26px; margin:8px 0 34px; box-shadow:var(--shadow);
  }
  .sec-head{display:flex; align-items:baseline; gap:14px; margin:44px 0 6px}
  .sec-num{
    font-variant-numeric:tabular-nums; font-weight:800; font-size:1.05rem; color:#fff;
    background:linear-gradient(135deg,var(--accent),var(--accent-2)); border-radius:10px;
    min-width:38px; height:38px; display:inline-flex; align-items:center; justify-content:center; box-shadow:var(--shadow);
  }
  h2{font-size:clamp(1.4rem,3.2vw,1.9rem); margin:0; letter-spacing:-.01em; line-height:1.15}
  .sec-sub{color:var(--muted); margin:6px 0 4px 52px; font-size:.98rem}
  .topic{
    background:var(--card); border:1px solid var(--line); border-radius:16px; padding:20px 22px;
    margin:16px 0; box-shadow:var(--shadow); transition:transform .18s ease, box-shadow .18s ease, border-color .18s ease;
  }
  .topic:hover{transform:translateY(-2px); box-shadow:var(--shadow-lg); border-color:color-mix(in srgb, var(--accent) 40%, var(--line))}
  .topic h3{margin:0 0 4px; font-size:1.14rem; letter-spacing:-.01em}
  .topic h3 .id{color:var(--accent-ink); font-variant-numeric:tabular-nums; margin-right:8px; font-weight:800}
  .wwh{display:grid; gap:10px; margin-top:14px}
  .row{display:grid; grid-template-columns:76px 1fr; gap:14px; align-items:start}
  .tag{font-size:.72rem; font-weight:800; letter-spacing:.05em; text-transform:uppercase; padding:4px 0; text-align:center; border-radius:8px}
  .tag.what{color:var(--what); background:var(--what-bg)}
  .tag.why{color:var(--why); background:var(--why-bg)}
  .tag.how{color:var(--how); background:var(--how-bg)}
  .row p{margin:1px 0; color:var(--ink-soft)}
  .row p b{color:var(--ink)}
  .timeline{margin:8px 0; padding:0; list-style:none}
  .tl{position:relative; padding:0 0 22px 44px; border-left:2px solid var(--line); margin-left:14px}
  .tl:last-child{border-left-color:transparent; padding-bottom:0}
  .tl::before{
    content:""; position:absolute; left:-9px; top:2px; width:16px; height:16px; border-radius:50%;
    background:linear-gradient(135deg,var(--accent),var(--accent-2)); box-shadow:0 0 0 4px var(--bg-soft);
  }
  .tl .when{font-weight:800; color:var(--accent-ink); font-size:.86rem; letter-spacing:.02em; text-transform:uppercase}
  .tl p{margin:6px 0 0; color:var(--ink-soft)}
  .summary{
    background:linear-gradient(135deg, color-mix(in srgb,var(--accent) 14%,var(--card)), var(--card));
    border:1px solid color-mix(in srgb,var(--accent) 34%,var(--line));
    border-radius:18px; padding:26px 28px; margin:8px 0 10px; box-shadow:var(--shadow-lg);
  }
  .summary .k{font-size:.78rem; font-weight:800; letter-spacing:.1em; text-transform:uppercase; color:var(--accent-ink)}
  .summary p{font-size:1.18rem; line-height:1.55; margin:8px 0 0; color:var(--ink)}
  em{color:var(--ink); font-style:italic}
  code{font-family:ui-monospace,SFMono-Regular,Menlo,Consolas,monospace; font-size:.9em; background:var(--line-soft); padding:1px 6px; border-radius:6px; color:var(--accent-ink)}
  footer{border-top:1px solid var(--line); margin-top:40px; padding:28px 0 46px; color:var(--muted); font-size:.9rem; text-align:center}
  footer .upd{display:inline-block; margin-top:6px; font-size:.82rem}
  @media (max-width:560px){ .row{grid-template-columns:1fr; gap:4px} .tag{width:64px} .sec-sub{margin-left:0} }
`;

// ---------- render ----------
function render(doc) {
  const bets = doc.sections.slice(0, 3)
    .map((s, i) => `<div class="bet"><b>${i + 1}</b> ${esc(stripParen(s.title))}</div>`).join('\n      ');

  const framing = doc.framing.map((p) => `<p style="color:var(--ink-soft);margin:0 0 12px">${inline(p)}</p>`).join('\n      ');

  const sections = doc.sections.map((s) => {
    const topics = s.topics.map((t) => `
  <article class="topic">
    <h3><span class="id">${esc(t.id)}</span>${inline(t.name)}</h3>
    <div class="wwh">
      <div class="row"><span class="tag what">What</span><p>${inline(t.what)}</p></div>
      <div class="row"><span class="tag why">Why</span><p>${inline(t.why)}</p></div>
      <div class="row"><span class="tag how">How</span><p>${inline(t.how)}</p></div>
    </div>
  </article>`).join('\n');
    return `
  <div class="sec-head"><span class="sec-num">${esc(s.num)}</span><h2>${esc(stripParen(s.title))}</h2></div>
  <p class="sec-sub">${inline(s.intro)}</p>
${topics}`;
  }).join('\n');

  const plan = doc.plan.map((p) => `
      <li class="tl"><span class="when">${inline(p.label)}</span><p>${inline(p.text)}</p></li>`).join('');

  const updated = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

  return `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>${esc(doc.title)} — Node/React → AI + Data</title>
<meta name="description" content="A What / Why / How roadmap for a senior Node.js + React engineer to stay in demand through 2028." />
<link rel="icon" href="${FAVICON}" />
<!-- Generated from skills-2028-roadmap.md by build.js — edit the .md, not this file. -->
<style>${CSS}</style>
</head>
<body>

<header class="hero">
  <div class="hero-inner">
    <span class="eyebrow">◆ Career Roadmap · 2026 → 2028</span>
    <h1>Staying in demand through 2028</h1>
    <p class="lede">A <b>What / Why / How</b> plan to turn 10 years of Node.js + React into a moat that a junior-plus-AI can't replicate.</p>
    <div class="profile">Profile: ${inline(doc.profile)}</div>
    <div class="bets">
      ${bets}
    </div>
  </div>
  <div class="legend">
    <span class="lg"><span class="dot" style="background:var(--what)"></span> <b>What</b> — the skill in a line</span>
    <span class="lg"><span class="dot" style="background:var(--why)"></span> <b>Why</b> — why it matters for you</span>
    <span class="lg"><span class="dot" style="background:var(--how)"></span> <b>How</b> — how to practice it</span>
  </div>
</header>

<main class="wrap">

  <section id="framing">
    <div class="frame">
      <h2 style="margin-bottom:10px">The honest framing</h2>
      ${framing}
    </div>
  </section>
${sections}

  <div class="sec-head"><span class="sec-num">★</span><h2>A concrete ~12-month path</h2></div>
  <p class="sec-sub">One RAG project threads through almost everything — you build one thing and learn against it.</p>
  <div class="frame">
    <ul class="timeline">${plan}
    </ul>
  </div>

  <div class="summary">
    <span class="k">One-sentence summary</span>
    <p>${inline(doc.summary)}</p>
  </div>

</main>

<footer>
  <div class="wrap">
    Skills Roadmap to 2028 · built for a Node.js + React engineer · hosted on GitHub Pages
    <div class="upd">Last updated: ${updated}</div>
  </div>
</footer>

</body>
</html>
`;
}

// ---------- run ----------
const md = fs.readFileSync(SRC, 'utf8');
const doc = parse(md);
fs.writeFileSync(OUT, render(doc));
console.log(`Built index.html — ${doc.sections.length} sections, ` +
  `${doc.sections.reduce((n, s) => n + s.topics.length, 0)} topics, ` +
  `${doc.plan.length} plan steps, summary:${doc.summary ? 'yes' : 'no'}`);
