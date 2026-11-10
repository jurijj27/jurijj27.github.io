/* NEURO QUEST — вся логика локально, без серверов и библиотек. */
(() => {
'use strict';

/* ---------- Утилиты ---------- */
const $ = sel => document.querySelector(sel);
const app = $('#app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };

/* ---------- Звук ---------- */
let soundOn = read('nq_sound', true);
let actx = null;
function beep(freq, dur = .12, type = 'sine', vol = .12) {
  if (!soundOn) return;
  try {
    actx = actx || new (window.AudioContext || window.webkitAudioContext)();
    const o = actx.createOscillator(), g = actx.createGain();
    o.type = type; o.frequency.value = freq;
    g.gain.setValueAtTime(vol, actx.currentTime);
    g.gain.exponentialRampToValueAtTime(.001, actx.currentTime + dur);
    o.connect(g); g.connect(actx.destination);
    o.start(); o.stop(actx.currentTime + dur);
  } catch {}
}
const sfx = {
  ok:   () => { beep(660, .1); setTimeout(() => beep(880, .16), 90); },
  bad:  () => { beep(220, .2, 'sawtooth', .08); },
  click:() => beep(520, .06, 'triangle', .07),
  win:  () => [0, 120, 240, 400].forEach((d, i) => setTimeout(() => beep([523, 659, 784, 1046][i], .22, 'sine', .1), d)),
};

/* ---------- Темы ---------- */
const THEMES = [
  { id:'mint',  name:'Мятный космос',      emoji:'🪐', sw:'linear-gradient(135deg,#3ddc97,#7c5cff)' },
  { id:'candy', name:'Клубничный рай',     emoji:'🍓', sw:'linear-gradient(135deg,#ff5d8f,#ffd166)' },
  { id:'space', name:'Тёмная обсерватория',emoji:'🌌', sw:'linear-gradient(135deg,#c084fc,#38bdf8)' },
  { id:'lemon', name:'Лимонад',            emoji:'🍋', sw:'linear-gradient(135deg,#f59f00,#37b24d)' },
  { id:'retro', name:'Ретро-аркада',       emoji:'👾', sw:'linear-gradient(135deg,#00ffd1,#ff2bd6)' },
];
let theme = read('nq_theme', 'mint');
document.documentElement.dataset.theme = theme;

function buildThemeTray() {
  const tray = $('#themeTray');
  tray.innerHTML = THEMES.map(t =>
    `<button class="theme-opt ${t.id === theme ? 'active' : ''}" data-theme-id="${t.id}">
       <span class="sw" style="background:${t.sw}"></span> ${t.emoji} ${t.name}
     </button>`).join('');
  tray.querySelectorAll('.theme-opt').forEach(b => b.addEventListener('click', () => {
    theme = b.dataset.themeId; write('nq_theme', theme);
    document.documentElement.dataset.theme = theme;
    buildThemeTray(); sfx.click();
    $('#themeTray').hidden = true;
  }));
}
buildThemeTray();
$('#themeBtn').addEventListener('click', () => { $('#themeTray').hidden = !$('#themeTray').hidden; sfx.click(); });
document.addEventListener('click', e => {
  const tray = $('#themeTray');
  if (!tray.hidden && !tray.contains(e.target) && e.target !== $('#themeBtn')) tray.hidden = true;
});
function syncSoundBtn(){ $('#soundBtn').textContent = soundOn ? '🔊' : '🔇'; }
$('#soundBtn').addEventListener('click', () => { soundOn = !soundOn; write('nq_sound', soundOn); syncSoundBtn(); if (soundOn) sfx.click(); });
syncSoundBtn();
$('#logoBtn').addEventListener('click', () => renderHome());

/* ---------- Банк вопросов ---------- */
const BANK = [
  {q:'Продолжи ряд: 2, 4, 8, 16, …', opts:['24','32','20','18'], correct:1, cat:'Числа', expl:'Каждое число удваивается: 16 × 2 = 32.'},
  {q:'Продолжи ряд: 1, 1, 2, 3, 5, 8, …', opts:['11','13','12','10'], correct:1, cat:'Числа', expl:'Это числа Фибоначчи: каждое — сумма двух предыдущих. 5 + 8 = 13.'},
  {q:'Что не подходит к остальным: Яблоко, Груша, Морковь, Слива?', opts:['Яблоко','Груша','Морковь','Слива'], correct:2, cat:'Логика', expl:'Морковь — овощ, а всё остальное — фрукты.'},
  {q:'Тепло относится к холоду, как свет к …', opts:['ночи','тьме','лампе','тени'], correct:1, cat:'Слова', expl:'Противоположность света — тьма.'},
  {q:'Сколько будет 7 × 8 − 6?', opts:['48','50','56','62'], correct:1, cat:'Считай быстро', expl:'7 × 8 = 56, минус 6 = 50.'},
  {q:'Биатлонист стрелял 5 раз и все выстрелы попали в цель. Сколько промахов?', opts:['0','1','5','Нельзя узнать'], correct:0, cat:'Логика', expl:'Если все выстрелы попали в цель — промахов ноль.'},
  {q:'Продолжи ряд: 81, 64, 49, …', opts:['36','42','32','25'], correct:0, cat:'Числа', expl:'Это квадраты в обратном порядке: 9², 8², 7², значит дальше 6² = 36.'},
  {q:'Сколько минут в полутора часах?', opts:['75','80','90','100'], correct:2, cat:'Считай быстро', expl:'Час — 60 минут, половина — 30. Всего 90.'},
  {q:'Миша выше Кати, Катя выше Оли. Кто самый низкий?', opts:['Миша','Катя','Оля','Нельзя узнать'], correct:2, cat:'Логика', expl:'Миша > Катя > Оля. Самая низкая — Оля.'},
  {q:'Что лишнее: Кошка, Собака, Корова, Курица?', opts:['Кошка','Собака','Корова','Курица'], correct:3, cat:'Логика', expl:'Курица — птица, остальные — млекопитающие.'},
  {q:'Сколько диагоналей у квадрата?', opts:['1','2','3','4'], correct:1, cat:'Пространство', expl:'У квадрата всего 2 диагонали — из угла в противоположный угол.'},
  {q:'Какая цифра не меняется, глядя на тебя из зеркала?', opts:['2','5','8','9'], correct:2, cat:'Пространство', expl:'8 симметрична по вертикали — в зеркале выглядит так же.'},
  {q:'Что тяжелее: килограмм пуха или килограмм железа?', opts:['Пух','Железо','Одинаково','Зависит от объёма'], correct:2, cat:'Логика', expl:'Килограмм есть килограмм — вес одинаковый, разный только объём.'},
  {q:'Продолжи ряд фигур: ●, ●●, ●●●, ●●●●, …', opts:['●●●●●','●●●','●●●●●●','■'], correct:0, cat:'Паттерны', expl:'Каждый шаг добавляется одна точка — значит дальше пять точек.'},
  {q:'Птица относится к небу, как рыба к …', opts:['земле','воде','кораблю','песку'], correct:1, cat:'Слова', expl:'Птица живёт в небе, рыба — в воде.'},
  {q:'Если часовая стрелка стоит на «12» и пройдёт 90° по часовой, где она окажется?', opts:['На «3»','На «6»','На «9»','На «2»'], correct:0, cat:'Пространство', expl:'90° — это четверть круга: 12 → 3.'},
  {q:'Продолжи ряд: 2, 6, 12, 20, …', opts:['26','28','30','32'], correct:2, cat:'Числа', expl:'Разница растёт: +4, +6, +8, значит дальше +10. 20 + 10 = 30.'},
  {q:'Какое слово спряталось: А Б Ы Р?', opts:['БРА','РЫБА','БАРЫ','АРБА'], correct:1, cat:'Слова', expl:'Из букв А, Б, Ы, Р складывается РЫБА.'},
  {q:'Что больше: четверть от 40 или десятая часть от 200?', opts:['Четверть от 40','Десятая от 200','Равны','Нельзя сравнить'], correct:1, cat:'Считай быстро', expl:'Четверть от 40 = 10, десятая от 200 = 20. Больше второе.'},
  {q:'Столовая относится к еде, как спальня к …', opts:['кровать','сон','окно','подушка'], correct:1, cat:'Слова', expl:'В столовой едят, в спальне спят.'},
  {q:'В корзине 5 яблок. Как раздать их пятерым так, чтобы одно осталось в корзине?', opts:['Разрезать','Отдать 4, корзину пятому','Так нельзя','Отдать все'], correct:1, cat:'Логика', expl:'Пятому отдают яблоко вместе с корзиной — яблоко остаётся в корзине.'},
  {q:'Продолжи ряд: 7, 14, 28, 56, …', opts:['84','100','112','98'], correct:2, cat:'Числа', expl:'Каждое число удваивается: 56 × 2 = 112.'},
  {q:'Сколько будет 100 − 25 − 25 − 25?', opts:['35','25','15','45'], correct:1, cat:'Считай быстро', expl:'100 − 75 = 25.'},
  {q:'Что не подходит: Январь, Март, Среда, Май?', opts:['Январь','Март','Среда','Май'], correct:2, cat:'Логика', expl:'Среда — день недели, остальное — месяцы.'},
  {q:'Продолжи: А, Б, В, Г, …', opts:['Д','Е','Ё','Ж'], correct:0, cat:'Слова', expl:'Это алфавит по порядку: за Г идёт Д.'},
  {q:'Сколько будет 9 + 9 + 9 + 3?', opts:['27','30','33','36'], correct:1, cat:'Считай быстро', expl:'9 × 3 = 27, плюс 3 = 30. Хитрость в том, что 3 «дособирает» четвёртую девятку.'},
  {q:'Если все коты боятся воды, а Мурзик не боится воды, то Мурзик…', opts:['кот','не кот','собака','нельзя узнать'], correct:3, cat:'Логика', expl:'«Все коты боятся воды» не значит, что боится воды только кот. Вывод сделать нельзя.'},
  {q:'Продолжи ряд: 4, 9, 16, 25, …', opts:['30','36','42','49'], correct:1, cat:'Числа', expl:'Это квадраты: 2², 3², 4², 5², значит дальше 6² = 36.'},
];

const CATS = ['Числа','Логика','Слова','Пространство','Считай быстро','Паттерны'];
const CAT_EMOJI = {'Числа':'🔢','Логика':'🧩','Слова':'📝','Пространство':'🧊','Считай быстро':'⚡','Паттерны':'🔍'};

/* ---------- Режимы ---------- */
const MODES = [
  {id:'quick', emoji:'🚀', name:'Быстрый старт',  count:10, mins:8,  tag:'8 МИНУТ',  desc:'10 вопросов — идеально, чтобы размяться.', featured:true},
  {id:'full',  emoji:'🏆', name:'Большой челлендж',count:20, mins:18, tag:'18 МИНУТ', desc:'20 вопросов на всю мощь. Для настоящих исследователей.'},
  {id:'train', emoji:'🌿', name:'Тренировка',      count:10, mins:0,  tag:'БЕЗ ТАЙМЕРА', desc:'Спокойно думаем, после ответа показываем объяснение.'},
];

/* ---------- Состояние ---------- */
let S = null;
let userName = read('nq_name', '');

/* ---------- Рендер ---------- */
function renderHome() {
  const hist = read('nq_history', []);
  const best = hist.length ? Math.max(...hist.map(h => h.iq)) : null;
  app.innerHTML = `
  <section class="screen">
    <div class="hero">
      <span class="planet">🪐</span>
      <h1>Прокачай свой мозг</h1>
      <p>Космическая лаборатория мышления: числа, логика, слова и пространственные головоломки. Всё просто, весело и без регистрации.</p>
      <div class="who">
        <input id="nameInput" placeholder="Как тебя зовут?" maxlength="20" value="${esc(userName)}">
        <span style="color:var(--muted);font-weight:700">— так тебя назовёт ИИ-наставник</span>
      </div>
    </div>
    <div class="modes">
      ${MODES.map(m => `
        <button class="mode ${m.featured ? 'featured' : ''}" data-mode="${m.id}">
          <span class="m-tag">${m.tag}</span>
          <span class="m-emoji">${m.emoji}</span>
          <h3>${m.name}</h3>
          <p>${m.desc}</p>
        </button>`).join('')}
    </div>
    ${best ? `<p class="best">🏅 Лучший результат: <b>${best} IQ</b> · попыток: ${hist.length}</p>` : '<p class="best">Пока ни одной попытки — самое время начать! 🚀</p>'}
  </section>`;
  const ni = $('#nameInput');
  ni.addEventListener('input', () => { userName = ni.value.trim(); write('nq_name', userName); });
  app.querySelectorAll('.mode').forEach(b => b.addEventListener('click', () => startQuiz(b.dataset.mode)));
}

function startQuiz(modeId) {
  const m = MODES.find(x => x.id === modeId);
  const qs = shuffle(BANK).slice(0, m.count);
  S = { mode: m, qs, i: 0, correct: 0, cats: {}, t0: Date.now(), log: [] };
  CATS.forEach(c => S.cats[c] = { ok: 0, all: 0 });
  renderQuestion();
}

function renderQuestion() {
  const q = S.qs[S.i];
  const total = S.qs.length;
  const pct = Math.round(S.i / total * 100);
  const left = S.mode.mins ? S.mode.mins * 60 - Math.floor((Date.now() - S.t0) / 1000) : null;
  app.innerHTML = `
  <section class="screen">
    <div class="quiz-top">
      <span class="q-count">Вопрос ${S.i + 1} / ${total}</span>
      ${left !== null ? `<span class="timer ${left < 60 ? 'urgent' : ''}" id="timer">⏱ ${fmt(left)}</span>` : '<span class="timer">🌿 без спешки</span>'}
    </div>
    <div class="bar"><i style="width:${pct}%"></i></div>
    <div class="q-card">
      <span class="q-cat">${CAT_EMOJI[q.cat]} ${q.cat.toUpperCase()}</span>
      <h2 class="q-text">${esc(q.q)}</h2>
      <div class="opts">
        ${q.opts.map((o, j) => `
          <button class="opt" data-j="${j}">
            <span class="key">${'АБВГ'[j]}</span> ${esc(o)}
          </button>`).join('')}
      </div>
      <div id="after"></div>
    </div>
  </section>`;

  const timer = $('#timer');
  if (timer) {
    clearInterval(S.tick);
    S.tick = setInterval(() => {
      const l = S.mode.mins * 60 - Math.floor((Date.now() - S.t0) / 1000);
      if (l <= 0) { clearInterval(S.tick); finishQuiz(true); return; }
      timer.textContent = '⏱ ' + fmt(l);
      timer.classList.toggle('urgent', l < 60);
    }, 1000);
  }

  app.querySelectorAll('.opt').forEach(btn => btn.addEventListener('click', () => answer(+btn.dataset.j)));
}

function fmt(sec) {
  sec = Math.max(0, sec);
  const m = Math.floor(sec / 60), s = sec % 60;
  return `${m}:${String(s).padStart(2, '0')}`;
}

function answer(j) {
  clearInterval(S.tick);
  const q = S.qs[S.i];
  const ok = j === q.correct;
  S.cats[q.cat].all++;
  if (ok) { S.cats[q.cat].ok++; S.correct++; sfx.ok(); } else sfx.bad();
  S.log.push({ q: q.q, ok, cat: q.cat });

  app.querySelectorAll('.opt').forEach((btn, idx) => {
    btn.disabled = true;
    if (idx === q.correct) btn.classList.add('correct');
    else if (idx === j) btn.classList.add('wrong');
  });

  const training = S.mode.id === 'train';
  const next = () => {
    S.i++;
    if (S.i >= S.qs.length) finishQuiz(false);
    else renderQuestion();
  };
  if (training) {
    $('#after').innerHTML = `
      <div class="expl"><b>${ok ? 'Точно! 🎉' : 'Не совсем 🤔'}</b> ${esc(q.expl)}</div>
      <div style="text-align:right;margin-top:16px"><button class="btn btn-primary" id="nextBtn">Дальше →</button></div>`;
    $('#nextBtn').addEventListener('click', () => { sfx.click(); next(); });
  } else {
    setTimeout(next, 700);
  }
}

function finishQuiz(byTime) {
  clearInterval(S.tick);
  const total = S.qs.length;
  const pct = S.correct / total;
  const secs = Math.round((Date.now() - S.t0) / 1000);
  let iq = Math.round(70 + pct * 78 + (total === 20 ? 2 : 0));
  iq = Math.max(70, Math.min(150, iq));
  const speedBonus = secs < total * 25 ? 3 : 0;
  iq += speedBonus;

  const ranks = [
    [130, '🌌 Космический разум', 'Капитан галактики! Твой мозг светится ярче сверхновой.'],
    [115, '🚀 Пилот-исследователь', 'Отличная скорость мышления! Дальше — к новым открытиям.'],
    [100, '🛰️ Уверенный курс', 'Прочный фундамент. Ещё немного тренировок — и ты выйдешь на орбиту.'],
    [85,  '🔭 Юный астроном', 'Хорошее начало! Заглядывай в тренировку — она объяснит всё по шагам.'],
    [0,   '🌱 Ракета на старте', 'Каждый гений начинал с первого вопроса. Тренируйся — и результат полетит вверх!'],
  ];
  const rank = ranks.find(r => iq >= r[0]) || ranks[ranks.length - 1];

  const hist = read('nq_history', []);
  hist.unshift({ iq, date: new Date().toLocaleDateString('ru-RU'), correct: S.correct, total, mode: S.mode.name, secs });
  write('nq_history', hist.slice(0, 30));

  if (iq >= 110) { sfx.win(); confetti(90); }

  app.innerHTML = `
  <section class="screen">
    <div class="result-hero">
      <span class="big-face">${ok_face(iq)}</span>
      <div class="iq-ring" style="--p:${Math.round(pct * 100)}">
        <span class="iq-num">${iq}<small>IQ-оценка</small></span>
      </div>
      <div class="rank">${rank[1]}</div>
      <p style="color:var(--muted);max-width:440px;margin:10px auto 0">${rank[2]}</p>
      ${byTime ? '<p style="color:var(--bad);font-weight:800;margin-top:10px">⏰ Время вышло — но это тоже опыт!</p>' : ''}
    </div>
    <div class="stats-grid">
      <div class="stat"><b>${S.correct}/${total}</b><span>ПРАВИЛЬНЫХ</span></div>
      <div class="stat"><b>${Math.round(pct * 100)}%</b><span>ТОЧНОСТЬ</span></div>
      <div class="stat"><b>${fmt(secs)}</b><span>ВРЕМЯ</span></div>
      ${speedBonus ? '<div class="stat"><b>+3</b><span>БОНУС ЗА СКОРОСТЬ</span></div>' : ''}
    </div>
    <div class="cats">
      ${CATS.filter(c => S.cats[c].all).map(c => {
        const r = S.cats[c];
        const p = Math.round(r.ok / r.all * 100);
        return `<div class="cat-row">
          <span class="c-name">${CAT_EMOJI[c]} ${c}</span>
          <span class="c-bar"><i style="width:0"></i></span>
          <span class="c-val">${r.ok}/${r.all}</span>
        </div>`;
      }).join('')}
    </div>
    <div class="result-actions">
      <button class="btn btn-primary" id="againBtn">🔄 Ещё раз</button>
      <button class="btn btn-ghost" id="homeBtn">На главную</button>
    </div>
  </section>`;
  requestAnimationFrame(() => app.querySelectorAll('.c-bar > i').forEach((b, k) => {
    const c = CATS.filter(c => S.cats[c].all)[k];
    b.style.width = Math.round(S.cats[c].ok / S.cats[c].all * 100) + '%';
  }));
  $('#againBtn').addEventListener('click', () => startQuiz(S.mode.id));
  $('#homeBtn').addEventListener('click', renderHome);
}
function ok_face(iq){ return iq >= 130 ? '🤯' : iq >= 115 ? '🥳' : iq >= 100 ? '😎' : iq >= 85 ? '🙂' : '🌱'; }

function renderStats() {
  const hist = read('nq_history', []);
  app.innerHTML = `
  <section class="screen">
    <h2 style="font-family:var(--disp);font-size:30px;margin:0 0 18px">📊 Твоя статистика</h2>
    ${hist.length ? `<div class="hist">${hist.map(h => `
      <div class="hist-row">
        <span class="h-iq">${h.iq}</span>
        <span class="h-meta"><b>${esc(h.mode)}</b> · ${h.correct}/${h.total} · ${fmt(h.secs)} · ${esc(h.date)}</span>
      </div>`).join('')}</div>
      <p style="color:var(--muted);margin-top:16px;font-weight:700">Средний IQ: <b style="color:var(--accent)">${Math.round(hist.reduce((s, h) => s + h.iq, 0) / hist.length)}</b> по ${hist.length} попыткам</p>`
    : '<p style="color:var(--muted);font-weight:700">Пока пусто — пройди первый тест! 🚀</p>'}
    <div style="margin-top:24px"><button class="btn btn-ghost" id="homeBtn2">← На главную</button></div>
  </section>`;
  $('#homeBtn2').addEventListener('click', renderHome);
}

/* ---------- Конфетти ---------- */
const fx = $('#fx');
const fctx = fx.getContext('2d');
let parts = [], fxRun = false;
function confetti(n) {
  const colors = ['#3ddc97', '#7c5cff', '#ffd166', '#ff5d8f', '#38bdf8'];
  for (let i = 0; i < n; i++) {
    parts.push({ x: Math.random() * innerWidth, y: -20 - Math.random() * innerHeight * .3,
      vx: (Math.random() - .5) * 2.4, vy: 2 + Math.random() * 3, s: 5 + Math.random() * 7,
      c: colors[i % colors.length], a: Math.random() * Math.PI, spin: (Math.random() - .5) * .25 });
  }
  if (!fxRun) { fxRun = true; fxLoop(); }
}
function fxLoop() {
  if (document.hidden) { requestAnimationFrame(fxLoop); return; }
  fx.width = innerWidth; fx.height = innerHeight;
  fctx.clearRect(0, 0, fx.width, fx.height);
  parts = parts.filter(p => p.y < fx.height + 30);
  for (const p of parts) {
    p.x += p.vx; p.y += p.vy; p.a += p.spin;
    fctx.save(); fctx.translate(p.x, p.y); fctx.rotate(p.a);
    fctx.fillStyle = p.c; fctx.globalAlpha = .9;
    fctx.fillRect(-p.s / 2, -p.s / 4, p.s, p.s / 2); fctx.restore();
  }
  if (parts.length) requestAnimationFrame(fxLoop); else fxRun = false;
}

/* ---------- Автообновление: чистим старый кэш при смене версии ---------- */
const APP_VERSION = '2.1';
try {
  if (location.protocol.startsWith('http') && 'caches' in window) {
    const seen = read('nq_version', null);
    if (seen === null) {
      write('nq_version', APP_VERSION); // первый визит — просто запоминаем
    } else if (seen !== APP_VERSION) {
      // версия сменилась: стираем весь старый кэш и перезагружаемся один раз
      write('nq_version', APP_VERSION);
      const wipe = caches.keys().then(ks => Promise.all(ks.map(k => caches.delete(k))));
      const unreg = ('serviceWorker' in navigator)
        ? navigator.serviceWorker.getRegistrations().then(rs => Promise.all(rs.map(r => r.unregister())))
        : Promise.resolve();
      Promise.all([wipe, unreg]).then(() => location.reload());
    }
    if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});
  }
} catch (e) {}

/* ---------- Старт ---------- */
renderHome();
})();
