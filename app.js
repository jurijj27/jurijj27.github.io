/* NEURO QUEST — вся логика локально, без серверов и библиотек.
   Версия 1.1: трей скинов корректно закрывается (после выбора, по клику мимо и по кнопке). */
(() => {
'use strict';

/* ---------- Утилиты ---------- */
const $  = sel => document.querySelector(sel);
const app = () => $('#app');
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read  = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v ?? d; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const fmtTime = s => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

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
  bad:  () => beep(220, .2, 'sawtooth', .08),
  click:() => beep(520, .06, 'triangle', .07),
  win:  () => [0, 120, 240, 400].forEach((d, i) => setTimeout(() => beep([523, 659, 784, 1046][i], .22, 'sine', .1), d)),
};

/* ---------- Темы ---------- */
const THEMES = [
  { id:'mint',  name:'Мятный космос',       emoji:'🪐', sw:'linear-gradient(135deg,#3ddc97,#7c5cff)' },
  { id:'candy', name:'Клубничный рай',      emoji:'🍓', sw:'linear-gradient(135deg,#ff5d8f,#ffd166)' },
  { id:'space', name:'Тёмная обсерватория', emoji:'🌌', sw:'linear-gradient(135deg,#c084fc,#38bdf8)' },
  { id:'lemon', name:'Лимонад',             emoji:'🍋', sw:'linear-gradient(135deg,#f59f00,#37b24d)' },
  { id:'retro', name:'Ретро-аркада',        emoji:'👾', sw:'linear-gradient(135deg,#00ffd1,#ff2bd6)' },
];
let theme = read('nq_theme', 'mint');
document.documentElement.dataset.theme = theme;

function buildThemeTray() {
  const tray = $('#themeTray');
  if (!tray) return;
  tray.innerHTML = THEMES.map(t =>
    `<button class="theme-opt ${t.id === theme ? 'active' : ''}" data-theme-id="${t.id}">
       <span class="sw" style="background:${t.sw}"></span> ${t.emoji} ${t.name}
     </button>`).join('');
  tray.querySelectorAll('.theme-opt').forEach(b => b.addEventListener('click', () => {
    theme = b.dataset.themeId; write('nq_theme', theme);
    document.documentElement.dataset.theme = theme;
    buildThemeTray(); sfx.click();
    tray.hidden = true;              /* закрыть панель после выбора */
  }));
}

/* ---------- Каркас (страховка: если чего-то нет в index.html — создадим) ---------- */
function ensureUI() {
  if (!document.querySelector('.blob-a')) {
    const a = document.createElement('div'); a.className = 'blob blob-a';
    const b = document.createElement('div'); b.className = 'blob blob-b';
    document.body.append(a, b);
  }
  if (!$('#fx')) {
    const cv = document.createElement('canvas'); cv.id = 'fx';
    document.body.appendChild(cv);
  }
  if (!$('#themeBtn')) {
    const bar = document.createElement('header');
    bar.className = 'topbar';
    bar.innerHTML = `
      <div class="logo" id="logoBtn" role="button" tabindex="0">
        <span class="logo-face">🧠</span>
        <span class="logo-text">NEURO<em>QUEST</em></span>
      </div>
      <div class="topbar-actions">
        <button class="chip-btn" id="soundBtn" title="Звук">🔊</button>
        <button class="chip-btn" id="themeBtn" title="Сменить скин">🎨 Скин</button>
      </div>
      <nav id="themeTray" class="theme-tray" hidden aria-label="Выбор скина"></nav>`;
    document.body.insertBefore(bar, document.body.firstChild);
  }
  const tray = $('#themeTray');
  tray.hidden = true;                  /* панель всегда стартует закрытой */
  buildThemeTray();
}

function bindChrome() {
  $('#themeBtn').addEventListener('click', e => {
    const tray = $('#themeTray');
    tray.hidden = !tray.hidden;
    sfx.click();
  });
  /* клик мимо панели закрывает её (клики внутри кнопки «Скин» не считаются «мимо») */
  document.addEventListener('click', e => {
    const tray = $('#themeTray');
    if (!tray.hidden && !tray.contains(e.target) && !e.target.closest('#themeBtn')) tray.hidden = true;
  });
  $('#soundBtn').addEventListener('click', () => {
    soundOn = !soundOn; write('nq_sound', soundOn); syncSoundBtn(); if (soundOn) sfx.click();
  });
  $('#logoBtn').addEventListener('click', () => renderHome());
}
function syncSoundBtn(){ const b = $('#soundBtn'); if (b) b.textContent = soundOn ? '🔊' : '🔇'; }

/* ---------- Банк вопросов (28 штук, 6 видов) ---------- */
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
  {q:'Все розы — цветы. Некоторые цветы быстро вянут. Значит…', opts:['Все розы вянут','Некоторые розы могут быстро вянуть','Розы не вянут','Вывода сделать нельзя'], correct:1, cat:'Логика', expl:'Розы — часть цветов, поэтому некоторые розы могут быстро вянуть. Больше сказать нельзя.'},
  {q:'Сколько месяцев имеют 28 дней?', opts:['Один','Два','Одиннадцать','Все двенадцать'], correct:3, cat:'Логика', expl:'У каждого месяца есть 28 дней — просто у большинства их больше.'},
  {q:'Продолжи: 1, 4, 9, 16, 25, …', opts:['30','36','42','49'], correct:1, cat:'Числа', expl:'Это квадраты чисел: 1², 2², 3²… дальше 6² = 36.'},
  {q:'Сколько будет 15% от 200?', opts:['15','25','30','35'], correct:2, cat:'Считай быстро', expl:'10% — это 20, 5% — ещё 10. Итого 30.'},
  {q:'Верблюд относится к пустыне, как пингвин к …', opts:['джунглям','Антарктике','лесу','горе'], correct:1, cat:'Слова', expl:'Верблюд приспособлен к пустыне, пингвин — к Антарктике.'},
  {q:'Ты разворачиваешь лист бумаги с написанной цифрой «3» вверх ногами. На что она станет похожа?', opts:['На «Е»','На «ω»','На «3» и останется','На «М»'], correct:0, cat:'Пространство', expl:'Перевёрнутая тройка по форме напоминает букву «Е».'},
  {q:'Термометр показывает 3° мороза. Сколько это по шкале?', opts:['+3°','−3°','0°','−30°'], correct:1, cat:'Считай быстро', expl:'Минус три градуса — это −3°.'},
  {q:'У Маши было 6 конфет. Половину она отдала другу, а потом съела ещё одну. Сколько осталось?', opts:['1','2','3','4'], correct:1, cat:'Считай быстро', expl:'Половина от 6 — это 3, отдала: осталось 3. Съела ещё одну: осталось 2.'},
];

/* ---------- Режимы ---------- */
const MODES = [
  { id:'quick',    emoji:'🚀', name:'Быстрый старт',    tag:'ПОПРОБОВАТЬ', n:10, secs:480,  desc:'10 вопросов и 8 минут. Идеально, чтобы размяться.' },
  { id:'big',      emoji:'🏆', name:'Большой челлендж', tag:'ХАРДКОР',     n:20, secs:1080, desc:'20 вопросов и 18 минут. Проверка на прочность!' },
  { id:'practice', emoji:'🌿', name:'Тренировка',       tag:'БЕЗ ТАЙМЕРА', n:12, secs:0,    desc:'Не спешим: после каждого ответа — объяснение решения.' },
];

/* ---------- Ранги и оценка ---------- */
const RANKS = [
  { min:135, emoji:'🌌', name:'Космический разум' },
  { min:120, emoji:'🌟', name:'Космический капитан' },
  { min:105, emoji:'⭐',  name:'Знаток галактики' },
  { min:90,  emoji:'🚀', name:'Юный исследователь' },
  { min:0,   emoji:'🌱', name:'Ракета на старте' },
];
const rankOf = iq => RANKS.find(r => iq >= r.min);
const faceOf = iq => iq >= 120 ? '🤩' : iq >= 100 ? '😃' : iq >= 85 ? '🙂' : '🤔';

function estimateIQ(correct, total, mode) {
  const acc = total ? correct / total : 0;
  let iq = 80 + acc * 55;                       /* 80…135 */
  if (mode === 'big') iq += 4;                  /* чуть смелее за длинный забег */
  if (mode === 'quick') iq += 2;
  return Math.max(80, Math.min(145, Math.round(iq)));
}

/* ---------- Состояние ---------- */
let state = null;   /* {mode, qs, idx, correct, cats:{cat:{c,t}}, t0, secs, timerId, remaining} */
let lastResult = null;

/* ---------- Экраны ---------- */
function renderHome() {
  stopTimer();
  const name = read('nq_name', '');
  const hist = read('nq_history', []);
  const best = hist.length ? Math.max(...hist.map(h => h.iq)) : null;
  app().innerHTML = `
    <div class="screen">
      <div class="hero">
        <span class="planet">🪐</span>
        <h1>Прокачай свой мозг</h1>
        <p>NEURO QUEST — космическая лаборатория мышления. Логика, числа, слова и загадки — всё в одной миссии.</p>
      </div>
      <div class="modes">
        ${MODES.map(m => `
          <button class="mode ${m.id === 'big' ? 'featured' : ''}" data-mode="${m.id}">
            ${m.tag ? `<span class="m-tag">${m.tag}</span>` : ''}
            <span class="m-emoji">${m.emoji}</span>
            <h3>${m.name}</h3>
            <p>${m.desc}</p>
          </button>`).join('')}
      </div>
      <div class="who">
        <input id="nameInput" maxlength="16" placeholder="Как тебя зовут, исследователь?" value="${esc(name)}">
      </div>
      <div class="best">${best ? `Лучший результат${name ? `, <b>${esc(name)}</b>` : ''}: <b>${best}</b> IQ` : 'Пройди первый тест — и здесь появится твой рекорд! ✨'}</div>
    </div>`;
  app().querySelectorAll('.mode').forEach(b => b.addEventListener('click', () => {
    sfx.click();
    const inp = $('#nameInput');
    if (inp && inp.value.trim()) write('nq_name', inp.value.trim());
    startQuiz(b.dataset.mode);
  }));
  const inp = $('#nameInput');
  if (inp) inp.addEventListener('change', () => write('nq_name', inp.value.trim()));
}

function startQuiz(modeId) {
  const mode = MODES.find(m => m.id === modeId) || MODES[0];
  const qs = shuffle(BANK).slice(0, Math.min(mode.n, BANK.length));
  state = {
    mode: mode.id, secs: mode.secs, qs,
    idx: 0, correct: 0, t0: Date.now(),
    cats: {},
    remaining: mode.secs, timerId: null,
  };
  renderQuiz();
  if (mode.secs) startTimer();
}

function startTimer() {
  state.timerId = setInterval(() => {
    state.remaining--;
    const t = $('#timerVal');
    if (t) t.textContent = fmtTime(Math.max(0, state.remaining));
    const box = $('#timerBox');
    if (box) box.classList.toggle('urgent', state.remaining <= 30);
    if (state.remaining <= 0) finishQuiz(true);
  }, 1000);
}
function stopTimer(){ if (state && state.timerId) { clearInterval(state.timerId); state.timerId = null; } }

function renderQuiz() {
  const q = state.qs[state.idx];
  const total = state.qs.length;
  const key = q.cat;
  if (!state.cats[key]) state.cats[key] = { c:0, t:0 };
  const timed = state.secs > 0;
  app().innerHTML = `
    <div class="screen">
      <div class="quiz-top">
        <span class="q-count">Вопрос ${state.idx + 1} из ${total}</span>
        ${timed
          ? `<span class="timer" id="timerBox">⏱ <span id="timerVal">${fmtTime(state.remaining)}</span></span>`
          : `<span class="timer">🌿 без таймера</span>`}
      </div>
      <div class="bar"><i style="width:${(state.idx / total) * 100}%"></i></div>
      <div class="q-card">
        <span class="q-cat">${esc(q.cat)}</span>
        <h2 class="q-text">${esc(q.q)}</h2>
        <div class="opts">
          ${q.opts.map((o, i) => `
            <button class="opt" data-i="${i}">
              <span class="key">${'АБВГ'[i]}</span> ${esc(o)}
            </button>`).join('')}
        </div>
        <div id="after"></div>
      </div>
    </div>`;
  app().querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => answer(+b.dataset.i)));
}

function answer(i) {
  const q = state.qs[state.idx];
  const ok = i === q.correct;
  state.cats[q.cat].t++;
  if (ok) { state.correct++; state.cats[q.cat].c++; }

  app().querySelectorAll('.opt').forEach((b, bi) => {
    b.disabled = true;
    if (bi === q.correct) b.classList.add('correct');
    else if (bi === i) b.classList.add('wrong');
  });
  ok ? sfx.ok() : sfx.bad();

  const showExpl = state.mode === 'practice';
  const after = $('#after');
  if (after) {
    if (showExpl) {
      after.innerHTML = `
        <div class="expl"><b>${ok ? 'Верно! 🎉' : 'Почти! Правильный ответ: ' + esc(q.opts[q.correct])}</b><br>${esc(q.expl)}</div>
        <div style="margin-top:16px;display:flex;justify-content:flex-end">
          <button class="btn btn-primary" id="nextBtn">${state.idx + 1 >= state.qs.length ? 'К результатам →' : 'Дальше →'}</button>
        </div>`;
      $('#nextBtn').addEventListener('click', next);
    } else {
      setTimeout(next, 750);
    }
  }
}

function next() {
  state.idx++;
  if (state.idx >= state.qs.length) finishQuiz(false);
  else renderQuiz();
}

function finishQuiz(timeUp) {
  stopTimer();
  const spent = state.secs ? state.secs - state.remaining : Math.round((Date.now() - state.t0) / 1000);
  const total = state.qs.length;
  const iq = estimateIQ(state.correct, total, state.mode);
  const acc = Math.round((state.correct / total) * 100);
  const r = { date: new Date().toLocaleDateString('ru-RU'), mode: state.mode, iq, correct: state.correct, total, secs: Math.max(1, spent) };
  const hist = read('nq_history', []);
  hist.push(r);
  write('nq_history', hist.slice(-50));
  lastResult = r;
  renderResult(r, acc, timeUp);
  if (iq >= 110) { sfx.win(); confetti(); } else { sfx.ok(); }
}

function renderResult(r, acc, timeUp) {
  const rank = rankOf(r.iq);
  const cats = Object.entries(state.cats).map(([cat, v]) => ({ cat, pct: Math.round((v.c / v.t) * 100) }));
  const modeName = (MODES.find(m => m.id === r.mode) || {}).name || r.mode;
  app().innerHTML = `
    <div class="screen">
      <div class="result-hero">
        <span class="big-face">${faceOf(r.iq)}</span>
        <div class="iq-ring" style="--p:0" id="ring">
          <div class="iq-num">${r.iq}<small>IQ-ОЦЕНКА</small></div>
        </div>
        <div class="rank">${rank.emoji} ${rank.name}</div>
        ${timeUp ? '<div style="color:var(--muted);font-weight:700;margin-top:6px">Время вышло — но это тоже результат! ⏱</div>' : ''}
      </div>
      <div class="stats-grid">
        <div class="stat"><b>${acc}%</b><span>ТОЧНОСТЬ</span></div>
        <div class="stat"><b>${r.correct}/${r.total}</b><span>ВЕРНЫХ ОТВЕТОВ</span></div>
        <div class="stat"><b>${fmtTime(r.secs)}</b><span>ВРЕМЯ</span></div>
        <div class="stat"><b>${esc(modeName.split(' ')[0])}</b><span>РЕЖИМ</span></div>
      </div>
      <div class="cats">
        ${cats.map(c => `
          <div class="cat-row">
            <span class="c-name">${esc(c.cat)}</span>
            <span class="c-bar"><i style="width:0%" data-w="${c.pct}"></i></span>
            <span class="c-val">${c.pct}%</span>
          </div>`).join('')}
      </div>
      <div class="result-actions">
        <button class="btn btn-primary" id="againBtn">🔁 Ещё раз</button>
        <button class="btn btn-ghost" id="homeBtn">🏠 На главную</button>
        <button class="btn btn-ghost" id="statsBtn">📊 Статистика</button>
      </div>
    </div>`;
  setTimeout(() => { const ring = $('#ring'); if (ring) ring.style.setProperty('--p', Math.min(100, Math.round((r.iq / 145) * 100))); }, 60);
  setTimeout(() => app().querySelectorAll('.c-bar>i').forEach(i => i.style.width = i.dataset.w + '%'), 200);
  $('#againBtn').addEventListener('click', () => { sfx.click(); startQuiz(r.mode); });
  $('#homeBtn').addEventListener('click', () => { sfx.click(); renderHome(); });
  $('#statsBtn').addEventListener('click', () => { sfx.click(); renderStats(); });
}

function renderStats() {
  const hist = read('nq_history', []);
  const avg = hist.length ? Math.round(hist.reduce((s, h) => s + h.iq, 0) / hist.length) : 0;
  const best = hist.length ? Math.max(...hist.map(h => h.iq)) : 0;
  app().innerHTML = `
    <div class="screen">
      <div class="hero" style="padding-bottom:10px">
        <h1 style="font-size:clamp(30px,5vw,44px)">Твои полёты 📊</h1>
        <p>Всё хранится только на этом устройстве — никуда не отправляется.</p>
      </div>
      <div class="stats-grid">
        <div class="stat"><b>${hist.length}</b><span>ПОПЫТОК</span></div>
        <div class="stat"><b>${best || '—'}</b><span>РЕКОРД</span></div>
        <div class="stat"><b>${avg || '—'}</b><span>СРЕДНИЙ IQ</span></div>
      </div>
      ${hist.length ? `
        <div class="hist">
          ${[...hist].reverse().map(h => `
            <div class="hist-row">
              <span class="h-iq">${h.iq}</span>
              <span class="h-meta">${esc(h.date)} · <b>${esc((MODES.find(m => m.id === h.mode) || {}).name || h.mode)}</b> · ${h.correct}/${h.total} · ${fmtTime(h.secs)}</span>
            </div>`).join('')}
        </div>
        <div class="result-actions" style="margin-top:22px">
          <button class="btn btn-ghost" id="clearBtn">🗑 Очистить историю</button>
        </div>` : '<div class="best">Пока пусто — пройди первый тест! 🚀</div>'}
      <div class="result-actions" style="margin-top:22px">
        <button class="btn btn-primary" id="homeBtn2">🏠 На главную</button>
      </div>
    </div>`;
  const cb = $('#clearBtn');
  if (cb) cb.addEventListener('click', () => {
    if (confirm('Точно стереть всю историю полётов?')) { write('nq_history', []); renderStats(); }
  });
  $('#homeBtn2').addEventListener('click', () => { sfx.click(); renderHome(); });
}

/* ---------- Конфетти ---------- */
function confetti() {
  const cv = $('#fx');
  if (!cv || matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const ctx = cv.getContext('2d');
  cv.width = innerWidth; cv.height = innerHeight;
  const colors = ['#3ddc97', '#7c5cff', '#ffd166', '#ff5d8f', '#38bdf8'];
  const parts = Array.from({ length: 140 }, () => ({
    x: Math.random() * cv.width, y: -20 - Math.random() * cv.height * .5,
    vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 4,
    s: 5 + Math.random() * 7, rot: Math.random() * Math.PI,
    vr: (Math.random() - .5) * .3, c: colors[(Math.random() * colors.length) | 0],
  }));
  const t0 = performance.now();
  (function loop(t) {
    ctx.clearRect(0, 0, cv.width, cv.height);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot);
      ctx.fillStyle = p.c; ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * .6);
      ctx.restore();
    });
    if (t - t0 < 3500) requestAnimationFrame(loop);
    else ctx.clearRect(0, 0, cv.width, cv.height);
  })(t0);
}

/* ---------- Старт ---------- */
ensureUI();
bindChrome();
renderHome();
})();
