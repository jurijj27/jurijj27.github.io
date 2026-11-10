/* NEURO QUEST 2.0 — космическая IQ-лаборатория. Всё работает локально. */
(() => {
'use strict';

/* ---------- Утилиты ---------- */
const $ = s => document.querySelector(s);
const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const read = (k, d) => { try { const v = JSON.parse(localStorage.getItem(k)); return v == null ? d : v; } catch { return d; } };
const write = (k, v) => { try { localStorage.setItem(k, JSON.stringify(v)); } catch {} };
const shuffle = a => { const b = [...a]; for (let i = b.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [b[i], b[j]] = [b[j], b[i]]; } return b; };
const rnd = a => a[Math.floor(Math.random() * a.length)];
const fmtTime = s => { s = Math.max(0, Math.round(s)); return Math.floor(s / 60) + ':' + String(s % 60).padStart(2, '0'); };

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
  boss: () => beep(110, .4, 'square', .06),
  win:  () => [0, 120, 240, 400].forEach((d, i) => setTimeout(() => beep([523, 659, 784, 1046][i], .22, 'sine', .1), d)),
  ach:  () => [0, 150, 300].forEach((d, i) => setTimeout(() => beep([784, 988, 1319][i], .2, 'sine', .1), d)),
};

/* ---------- Темы (6 скинов, радужный — секретный) ---------- */
const THEMES = [
  { id:'mint',    name:'Мятный космос',       emoji:'🪐', sw:'linear-gradient(135deg,#3ddc97,#7c5cff)' },
  { id:'candy',   name:'Клубничный рай',      emoji:'🍓', sw:'linear-gradient(135deg,#ff5d8f,#ffd166)' },
  { id:'space',   name:'Тёмная обсерватория', emoji:'🌌', sw:'linear-gradient(135deg,#c084fc,#38bdf8)' },
  { id:'lemon',   name:'Лимонад',             emoji:'🍋', sw:'linear-gradient(135deg,#f59f00,#37b24d)' },
  { id:'retro',   name:'Ретро-аркада',        emoji:'👾', sw:'linear-gradient(135deg,#00ffd1,#ff2bd6)' },
  { id:'rainbow', name:'Радужный сюрприз',    emoji:'🌈', sw:'linear-gradient(135deg,#ff5d8f,#ffd166,#3ddc97)', secret:true },
];
let theme = read('nq_theme', 'mint');
if (!THEMES.some(t => t.id === theme) || (theme === 'rainbow' && !read('nq_rainbow', false))) theme = 'mint';
document.documentElement.dataset.theme = theme;

function buildThemeTray() {
  const tray = $('#themeTray');
  tray.innerHTML = THEMES.filter(t => !t.secret || read('nq_rainbow', false)).map(t =>
    `<button class="theme-opt ${t.id === theme ? 'active' : ''}" data-theme-id="${t.id}">
       <span class="sw" style="background:${t.sw}"></span> ${t.emoji} ${t.name}
     </button>`).join('');
  tray.querySelectorAll('.theme-opt').forEach(b => b.addEventListener('click', () => {
    theme = b.dataset.themeId; write('nq_theme', theme);
    document.documentElement.dataset.theme = theme;
    buildThemeTray(); $('#themeTray').hidden = true; sfx.click();
  }));
}
buildThemeTray();
$('#themeTray').hidden = true;
$('#themeBtn').addEventListener('click', () => { $('#themeTray').hidden = !$('#themeTray').hidden; sfx.click(); });
document.addEventListener('click', e => {
  const tray = $('#themeTray');
  if (!tray.hidden && !tray.contains(e.target) && !e.target.closest('#themeBtn')) tray.hidden = true;
});

function syncSoundBtn(){ $('#soundBtn').textContent = soundOn ? '🔊' : '🔇'; }
$('#soundBtn').addEventListener('click', () => { soundOn = !soundOn; write('nq_sound', soundOn); syncSoundBtn(); if (soundOn) sfx.click(); });
syncSoundBtn();
$('#logoBtn').addEventListener('click', () => { sfx.click(); stopAll(); renderHome(); });

/* ---------- Профиль, уровни, достижения ---------- */
const AVATARS = ['🚀','🧑‍🚀','👾','🦊','🐱','🦉','🐲','🌟'];
const LEVELS = [
  { xp:0,    t:'Стажёр мозга' },
  { xp:100,  t:'Юный следопыт' },
  { xp:250,  t:'Детектив логики' },
  { xp:450,  t:'Аналитик звёзд' },
  { xp:700,  t:'Мастер нейронов' },
  { xp:1000, t:'Профессор нейронов' },
  { xp:1400, t:'Гроссмейстер мысли' },
  { xp:1900, t:'Космический разум' },
];
function levelInfo(xp){
  let i = 0;
  for (let k = 0; k < LEVELS.length; k++) if (xp >= LEVELS[k].xp) i = k;
  const cur = LEVELS[i], next = LEVELS[i + 1];
  return { i, title: cur.t, progress: next ? Math.min(1, (xp - cur.xp) / (next.xp - cur.xp)) : 1, max: !next };
}

const ACHS = [
  { id:'first',     emoji:'🎯', name:'Первый старт',     desc:'Завершить первый тест' },
  { id:'streak5',   emoji:'🔥', name:'Огонёк',           desc:'Серия из 5 верных ответов' },
  { id:'perfect',   emoji:'⭐', name:'Идеально!',        desc:'100% в большом тесте' },
  { id:'boss',      emoji:'⚔️', name:'Гроза боссов',     desc:'Победить босса' },
  { id:'fast',      emoji:'⚡', name:'Скорострел',       desc:'Верный ответ быстрее 5 секунд' },
  { id:'lightning', emoji:'🌩️', name:'Разряд',           desc:'15+ верных в режиме «Молния»' },
  { id:'star',      emoji:'🪐', name:'Звездочёт',        desc:'Получить звезду на планете' },
  { id:'allstars',  emoji:'🌌', name:'Мастер категорий', desc:'Звезда на каждой планете' },
  { id:'xp500',     emoji:'🎖️', name:'Пятьсот!',         desc:'Набрать 500 опыта' },
  { id:'xp2000',    emoji:'👑', name:'Две тысячи',       desc:'Набрать 2000 опыта' },
  { id:'duelwin',   emoji:'🏆', name:'Чемпион дуэли',    desc:'Победить в дуэли' },
  { id:'level5',    emoji:'🎓', name:'Профессор',        desc:'Дорасти до «Профессора нейронов»' },
  { id:'secret',    emoji:'🌈', name:'Секрет',           desc:'Найти пасхалку' },
  { id:'diploma',   emoji:'📜', name:'Дипломант',        desc:'Получить диплом' },
];

let profile = read('nq_profile', { name:'', xp:0, avatar:0, achs:[], history:[], bestStreak:0, lightningBest:0, planets:{}, duel1:'', duel2:'' });
if (!profile.planets) profile.planets = {};
function saveProfile(){ write('nq_profile', profile); }

function unlock(id){
  if (profile.achs.includes(id)) return;
  const a = ACHS.find(x => x.id === id);
  if (!a) return;
  profile.achs.push(id); saveProfile();
  sfx.ach(); toast(a.emoji + ' Достижение: ' + a.name + '!');
  confetti(60);
}

function addXP(n){
  const before = levelInfo(profile.xp).i;
  profile.xp += n; saveProfile();
  if (profile.xp >= 500) unlock('xp500');
  if (profile.xp >= 2000) unlock('xp2000');
  const after = levelInfo(profile.xp);
  if (after.i >= 5) unlock('level5');
  if (after.i > before) { toast('🎉 Новый уровень: ' + after.title + '!'); confetti(90); }
  updateXPChip();
}
function updateXPChip(){
  const info = levelInfo(profile.xp);
  $('#xpAvatar').textContent = AVATARS[profile.avatar % AVATARS.length];
  $('#xpLevel').textContent = info.max ? info.title : info.title + ' · до след. ' + Math.ceil(info.next);
  $('#xpFill').style.width = Math.round(info.progress * 100) + '%';
}

/* ---------- Тосты, конфетти, модалки ---------- */
function toast(html, ms = 3200){
  const t = document.createElement('div');
  t.className = 'toast'; t.innerHTML = html;
  $('#toasts').appendChild(t);
  setTimeout(() => t.classList.add('gone'), ms - 400);
  setTimeout(() => t.remove(), ms);
}
function confetti(n = 80){
  const c = $('#confetti'); if (!c) return;
  const ctx = c.getContext('2d');
  c.width = innerWidth; c.height = innerHeight;
  const colors = ['#3ddc97','#7c5cff','#ffd166','#ff5d8f','#38bdf8'];
  const parts = Array.from({length:n}, () => ({
    x: Math.random() * c.width, y: -20 - Math.random() * c.height * .3,
    vx: (Math.random() - .5) * 3, vy: 2 + Math.random() * 4,
    s: 6 + Math.random() * 8, r: Math.random() * Math.PI, vr: (Math.random() - .5) * .3,
    col: rnd(colors),
  }));
  let frames = 0;
  (function tick(){
    ctx.clearRect(0, 0, c.width, c.height);
    parts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.r += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.r);
      ctx.fillStyle = p.col; ctx.globalAlpha = Math.max(0, 1 - frames / 160);
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s); ctx.restore();
    });
    if (++frames < 160) requestAnimationFrame(tick); else ctx.clearRect(0, 0, c.width, c.height);
  })();
}
function openModal(html){
  $('#modalBox').innerHTML = html;
  $('#modalOverlay').hidden = false;
  requestAnimationFrame(() => $('#modalOverlay').classList.add('show'));
}
function closeModal(){
  $('#modalOverlay').classList.remove('show');
  setTimeout(() => { $('#modalOverlay').hidden = true; }, 200);
}
$('#modalOverlay').addEventListener('click', e => { if (e.target === e.currentTarget) closeModal(); });

function openAvatarModal(){
  openModal('<h3>Выбери аватар</h3><div class="avatar-grid">' + AVATARS.map((a, i) =>
    '<button class="avatar-opt ' + (i === profile.avatar ? 'active' : '') + '" data-i="' + i + '">' + a + '</button>').join('') + '</div>');
  $('#modalBox').querySelectorAll('.avatar-opt').forEach(b => b.addEventListener('click', () => {
    profile.avatar = +b.dataset.i; saveProfile(); updateXPChip(); sfx.click(); closeModal();
  }));
}
$('#xpChip').addEventListener('click', openAvatarModal);

function openAchModal(){
  const got = profile.achs;
  openModal('<h3>🏅 Достижения (' + got.length + '/' + ACHS.length + ')</h3><div class="ach-list">' + ACHS.map(a => {
    const has = got.includes(a.id);
    return '<div class="ach-item ' + (has ? 'got' : '') + '"><span class="ach-emoji">' + (has ? a.emoji : '❔') + '</span><span><strong>' + a.name + '</strong><small>' + a.desc + '</small></span></div>';
  }).join('') + '</div>');
}
$('#achBtn').addEventListener('click', () => { sfx.click(); openAchModal(); });

/* ---------- Питомец БИП-9 ---------- */
const PET_HAPPY = ['Точно в цель! 🎯','Ух ты, да ты гений!','Плюсы зачислены ✅','Отличный выстрел!','Вот это реакция!'];
const PET_SAD = ['Бывает и так 🤏','Почти! Разберёмся вместе','Мимо, но не страшно','Ошибка — это опыт!','В следующий раз обязательно!'];
const PET_IDLE = ['Я скучаю по задачкам 🥺','Попробуй режим «Молния»? ⚡','Знаешь ли ты: у осьминога 9 мозгов?','Готов к новой планете? 🪐','Ты сегодня в отличной форме!','Тренировка — путь к Сверхновой 🌠'];
let petIdleTimer = 0;
function petSay(text, ms = 2600){
  const b = $('#petBubble'); if (!b) return;
  b.textContent = text; b.classList.add('show');
  clearTimeout(petIdleTimer);
  petIdleTimer = setTimeout(() => b.classList.remove('show'), ms);
}
function petReact(ok){ petSay(ok ? rnd(PET_HAPPY) : rnd(PET_SAD)); }
$('#pet').addEventListener('click', () => { petSay(rnd(['Бип-бип! Я БИП-9 🤖'].concat(PET_IDLE))); sfx.click(); });
setInterval(() => { if (Math.random() < .35 && !document.hidden && !Q) petSay(rnd(PET_IDLE)); }, 25000);

/* ---------- Категории и банк вопросов (42) ---------- */
const CATS = [
  { id:'numbers',  name:'Числа',         emoji:'🔢', planet:'Планета Чисел' },
  { id:'logic',    name:'Логика',        emoji:'🧩', planet:'Остров Логики' },
  { id:'words',    name:'Слова',         emoji:'📚', planet:'Библиотечная луна' },
  { id:'space',    name:'Пространство',  emoji:'🧊', planet:'Ледяной куб' },
  { id:'math',     name:'Считай быстро', emoji:'⚡', planet:'Грозовая станция' },
  { id:'patterns', name:'Узоры',         emoji:'🎨', planet:'Туманность узоров' },
];
const CAT = Object.fromEntries(CATS.map(c => [c.id, c]));

const BANK = [
  {q:'Продолжи ряд: 2, 4, 8, 16, …', opts:['24','32','20','18'], correct:1, cat:'numbers', expl:'Каждое число удваивается: 16 × 2 = 32.'},
  {q:'Продолжи ряд: 1, 1, 2, 3, 5, 8, …', opts:['11','13','12','10'], correct:1, cat:'numbers', expl:'Это числа Фибоначчи: каждое — сумма двух предыдущих. 5 + 8 = 13.'},
  {q:'Продолжи ряд: 81, 64, 49, …', opts:['36','42','32','25'], correct:0, cat:'numbers', expl:'Это квадраты в обратном порядке: 9², 8², 7², дальше 6² = 36.'},
  {q:'Продолжи ряд: 2, 6, 12, 20, …', opts:['26','28','30','32'], correct:2, cat:'numbers', expl:'Разница растёт: +4, +6, +8, значит дальше +10. 20 + 10 = 30.'},
  {q:'Продолжи ряд: 5, 10, 20, 40, …', opts:['60','80','100','45'], correct:1, cat:'numbers', expl:'Каждое число удваивается: 40 × 2 = 80.'},
  {q:'Продолжи ряд: 1, 3, 6, 10, 15, …', opts:['18','20','21','24'], correct:2, cat:'numbers', expl:'Разница растёт: +2, +3, +4, +5, значит дальше +6. 15 + 6 = 21.'},
  {q:'Продолжи ряд: 2, 3, 5, 8, 13, …', opts:['20','21','18','24'], correct:1, cat:'numbers', expl:'Каждое число — сумма двух предыдущих: 8 + 13 = 21.'},

  {q:'Что не подходит к остальным: Яблоко, Груша, Морковь, Слива?', opts:['Яблоко','Груша','Морковь','Слива'], correct:2, cat:'logic', expl:'Морковь — овощ, а всё остальное — фрукты.'},
  {q:'Миша выше Кати, Катя выше Оли. Кто самый низкий?', opts:['Миша','Катя','Оля','Нельзя узнать'], correct:2, cat:'logic', expl:'Миша выше Кати, Катя выше Оли — значит, самая низкая Оля.'},
  {q:'Что лишнее: Кошка, Собака, Корова, Курица?', opts:['Кошка','Собака','Корова','Курица'], correct:3, cat:'logic', expl:'Курица — птица, а остальные — млекопитающие.'},
  {q:'Биатлонист стрелял 5 раз и все выстрелы попали в цель. Сколько промахов?', opts:['0','1','5','Нельзя узнать'], correct:0, cat:'logic', expl:'Если все выстрелы попали в цель — промахов ноль.'},
  {q:'В семье пять сыновей, и у каждого есть сестра. Сколько всего детей?', opts:['5','6','10','Нельзя узнать'], correct:1, cat:'logic', expl:'Сестра одна и та же для всех братьев: 5 сыновей + 1 девочка = 6 детей.'},
  {q:'Какой месяц лишний: Июнь, Июль, Август, Октябрь?', opts:['Июнь','Июль','Август','Октябрь'], correct:3, cat:'logic', expl:'Июнь, июль и август — летние месяцы, а октябрь — осенний.'},
  {q:'Если сегодня вторник, какой день недели будет через 5 дней?', opts:['Суббота','Воскресенье','Понедельник','Пятница'], correct:1, cat:'logic', expl:'Вторник + 5 дней: ср, чт, пт, сб, вс — воскресенье.'},

  {q:'Тепло относится к холоду, как свет к …', opts:['ночи','тьме','лампе','тени'], correct:1, cat:'words', expl:'Противоположность света — тьма.'},
  {q:'Птица относится к небу, как рыба к …', opts:['земле','воде','кораблю','песку'], correct:1, cat:'words', expl:'Птица живёт в небе, рыба — в воде.'},
  {q:'Столовая относится к еде, как спальня к …', opts:['кровать','сон','окно','подушка'], correct:1, cat:'words', expl:'В столовой едят, а в спальне спят.'},
  {q:'Какое слово спряталось: А Б Ы Р?', opts:['БРА','РЫБА','БАРЫ','АРБА'], correct:1, cat:'words', expl:'Из букв А, Б, Ы, Р складывается РЫБА.'},
  {q:'Какое слово спряталось: З О А К?', opts:['ЗОКА','КОЗА','ЗАКО','АЗОК'], correct:1, cat:'words', expl:'Из букв З, О, А, К складывается КОЗА.'},
  {q:'Подбери синоним к слову «смелый»:', opts:['Храбрый','Трусливый','Весёлый','Тихий'], correct:0, cat:'words', expl:'Синоним слова «смелый» — «храбрый».'},
  {q:'Мяч относится к футболу, как шайба к …', opts:['баскетболу','хоккею','теннису','боксу'], correct:1, cat:'words', expl:'Шайба — снаряд в хоккее.'},

  {q:'Сколько диагоналей у квадрата?', opts:['1','2','3','4'], correct:1, cat:'space', expl:'У квадрата всего 2 диагонали — из угла в противоположный угол.'},
  {q:'Какая цифра не меняется, глядя на тебя из зеркала?', opts:['2','5','8','9'], correct:2, cat:'space', expl:'8 симметрична по вертикали — в зеркале выглядит так же.'},
  {q:'Часовая стрелка стоит на «12» и проходит 90° по часовой. Где она?', opts:['На «3»','На «6»','На «9»','На «2»'], correct:0, cat:'space', expl:'90° — четверть круга: 12 → 3.'},
  {q:'Сколько граней у куба?', opts:['4','6','8','12'], correct:1, cat:'space', expl:'У куба 6 граней — как у игрального кубика.'},
  {q:'На какой угол повернётся минутная стрелка за 15 минут?', opts:['45°','60°','90°','180°'], correct:2, cat:'space', expl:'За 15 минут стрелка проходит четверть круга — 90°.'},
  {q:'Сколько вершин у куба?', opts:['6','8','12','4'], correct:1, cat:'space', expl:'У куба 8 вершин — по углам двух квадратов.'},
  {q:'На игральной кости сверху выпала «1». Сколько точек на противоположной грани?', opts:['2','4','5','6'], correct:3, cat:'space', expl:'Сумма точек на противоположных гранях кубика всегда 7. 7 − 1 = 6.'},

  {q:'Сколько будет 7 × 8 − 6?', opts:['48','50','56','62'], correct:1, cat:'math', expl:'7 × 8 = 56, минус 6 = 50.'},
  {q:'Сколько минут в полутора часах?', opts:['75','80','90','100'], correct:2, cat:'math', expl:'Час — 60 минут, половина — 30. Всего 90.'},
  {q:'Что больше: четверть от 40 или десятая часть от 200?', opts:['Четверть от 40','Десятая от 200','Равны','Нельзя сравнить'], correct:1, cat:'math', expl:'Четверть от 40 = 10, десятая от 200 = 20.'},
  {q:'Сколько будет 15 × 4?', opts:['45','55','60','65'], correct:2, cat:'math', expl:'15 × 4 = 60.'},
  {q:'У Димы было 12 конфет, 5 он отдал друзьям. Сколько осталось?', opts:['6','7','8','5'], correct:1, cat:'math', expl:'12 − 5 = 7.'},
  {q:'Сколько будет 99 + 101?', opts:['180','200','210','190'], correct:1, cat:'math', expl:'99 + 101 = 200.'},
  {q:'Сколько будет 6 × 7 + 8?', opts:['42','48','50','54'], correct:2, cat:'math', expl:'6 × 7 = 42, плюс 8 = 50.'},

  {q:'Продолжи ряд фигур: ●, ●●, ●●●, ●●●●, …', opts:['●●●●●','●●●','●●●●●●','■'], correct:0, cat:'patterns', expl:'Каждый шаг добавляется одна точка — дальше пять точек.'},
  {q:'Продолжи: ▲ ■ ▲ ■ ▲ …', opts:['■','▲','●','▼'], correct:0, cat:'patterns', expl:'Фигуры чередуются: треугольник, квадрат… после ▲ идёт ■.'},
  {q:'1 — А, 2 — Б, 3 — В. Что соответствует числу 4?', opts:['Д','Г','Е','Ж'], correct:1, cat:'patterns', expl:'Буквы идут по алфавиту: четвёртая — Г.'},
  {q:'Продолжи: 🔺🔺🔵🔺🔺🔵🔺🔺 …', opts:['🔵','🔺','🔴','⬛'], correct:0, cat:'patterns', expl:'Узор повторяется: две красных, одна синяя — после двух красных снова 🔵.'},
  {q:'Продолжи: ↑ → ↓ ← ↑ …', opts:['→','↓','←','↑'], correct:0, cat:'patterns', expl:'Стрелка поворачивается по часовой: после ↑ снова →.'},
  {q:'Продолжи: ⬛ ⚪ ⬛ ⚪ ⬛ …', opts:['⬛','⚪','🔵','⬜'], correct:1, cat:'patterns', expl:'Квадраты чередуются, после чёрного идёт белый.'},
  {q:'1★, 2★★, 3★★★. Что соответствует числу 4?', opts:['★★','★★★★','★★★','★'], correct:1, cat:'patterns', expl:'Числу соответствует столько звёзд, каково само число: 4 — четыре звезды.'},
];

const MODES = [
  { id:'quick',     emoji:'🚀', title:'Быстрый старт',    desc:'10 вопросов на скорость',        meta:'⏱ 8 минут' },
  { id:'challenge', emoji:'🏆', title:'Большой челлендж', desc:'20 вопросов и боссы',            meta:'⏱ 18 минут' },
  { id:'train',     emoji:'🌿', title:'Тренировка',       desc:'Без таймера и с подсказками',    meta:'∞ времени' },
  { id:'lightning', emoji:'⚡', title:'Молния',           desc:'60 секунд — сколько успеешь?',   meta:'⚡ на реакцию' },
  { id:'duel',      emoji:'⚔️', title:'Дуэль',            desc:'Двое играют по очереди',         meta:'👥 на одном экране' },
];

/* ---------- Движок викторины ---------- */
let Q = null;
let eggBuf = '';

function stopAll(){
  if (Q && Q.timers) Q.timers.forEach(clearInterval);
  Q = null;
}

function startQuiz(mode, planetCat){
  const pool = planetCat ? BANK.filter(b => b.cat === planetCat) : BANK;
  let qs;
  if (mode === 'quick') qs = shuffle(pool).slice(0, 10);
  else if (mode === 'challenge') qs = shuffle(pool).slice(0, 20);
  else if (mode === 'planet') qs = shuffle(pool).slice(0, 4);
  else if (mode === 'duel') qs = shuffle(pool).slice(0, 10);
  else qs = shuffle(pool).slice(0, 10);
  Q = { mode, qs, i:0, correct:0, streak:0, bestStreak:0, perCat:{}, start:Date.now(), timers:[], timeLeft:0,
        lightning:null, duel:{ scores:[0,0], turn:0, names:['Игрок 1','Игрок 2'] }, planetCat:planetCat || null,
        boss:false, answered:false, currentStart:Date.now() };
  if (mode === 'quick') Q.timeLeft = 480;
  if (mode === 'challenge') Q.timeLeft = 1080;
  if (Q.timeLeft) runTimer();
  renderQuestion();
}

function runTimer(){
  const t = setInterval(() => {
    if (!Q || Q.mode === 'lightning') { clearInterval(t); return; }
    Q.timeLeft--;
    const el = $('#qTimer');
    if (el) {
      el.textContent = '⏱ ' + fmtTime(Q.timeLeft);
      if (Q.timeLeft < 60) el.classList.add('urgent');
    }
    if (Q.timeLeft <= 0) { clearInterval(t); finish(); }
  }, 1000);
  Q.timers.push(t);
}

function renderQuestion(){
  if (Q.mode === 'lightning') return renderLightning();
  if (Q.i >= Q.qs.length) return finish();
  const item = Q.qs[Q.i];
  const isBoss = (Q.mode === 'quick' || Q.mode === 'challenge' || Q.mode === 'duel') && Q.i % 5 === 4;
  Q.currentStart = Date.now();
  Q.boss = isBoss;
  const cat = CAT[item.cat];
  const timerText = Q.mode === 'train' ? '🌿 без таймера' : (Q.timeLeft ? '⏱ ' + fmtTime(Q.timeLeft) : '∞');
  const duelTurn = Q.mode === 'duel'
    ? '<div class="duel-turn">🎯 Ход: ' + esc(Q.duel.names[Q.duel.turn]) + ' — счёт ' + Q.duel.scores[0] + ' : ' + Q.duel.scores[1] + '</div>'
    : '';
  $('#app').innerHTML = `
    <section class="screen">
      <div class="q-top">
        <span class="q-cat">${cat.emoji} ${cat.name}</span>
        <span class="q-count">Вопрос ${Q.i + 1} из ${Q.qs.length}</span>
        <span class="q-timer" id="qTimer">${timerText}</span>
      </div>
      ${isBoss ? '<div class="boss-banner">⚔️ БОСС-ВОПРОС — опыт ×2</div>' : ''}
      ${Q.streak >= 2 ? '<div class="streak-fire ' + (Q.streak >= 3 ? 'hot' : '') + '">🔥 Серия ×' + Q.streak + '</div>' : ''}
      ${duelTurn}
      <div class="q-card ${isBoss ? 'boss' : ''}">
        <div class="q-text">${esc(item.q)}</div>
        <div class="opts">${item.opts.map((o, i) =>
          '<button class="opt" data-i="' + i + '"><b>' + (i + 1) + '</b> ' + esc(o) + '</button>').join('')}</div>
        ${Q.mode === 'train' ? '<div class="explain" id="explain" hidden><strong>💡 Разбор:</strong> ' + esc(item.expl) + '<br><button class="btn btn-primary" id="nextBtn">Дальше →</button></div>' : ''}
      </div>
      ${Q.mode === 'train' ? '<p class="hint">Клавиши 1–4 тоже выбирают ответ 😉</p>' : ''}
    </section>`;
  if (isBoss) sfx.boss();
  document.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => answer(+b.dataset.i, b)));
  const nb = $('#nextBtn'); if (nb) nb.addEventListener('click', () => { sfx.click(); next(); });
}

function answer(i, btn){
  if (!Q || Q.answered) return;
  Q.answered = true;
  const item = Q.qs[Q.i];
  const ok = i === item.correct;
  const secs = (Date.now() - Q.currentStart) / 1000;
  const opts = [...document.querySelectorAll('.opt')];
  opts.forEach((b, k) => { b.disabled = true; if (k === item.correct) b.classList.add('correct'); });
  if (!ok) btn.classList.add('wrong', 'shake');
  const wasBoss = Q.boss;
  if (!Q.perCat[item.cat]) Q.perCat[item.cat] = { c:0, t:0 };
  Q.perCat[item.cat].t++;
  if (ok){
    sfx.ok(); Q.correct++;
    Q.streak++; Q.bestStreak = Math.max(Q.bestStreak, Q.streak);
    profile.bestStreak = Math.max(profile.bestStreak, Q.bestStreak);
    Q.perCat[item.cat].c++;
    if (Q.mode === 'duel') Q.duel.scores[Q.duel.turn]++;
    let xp = 10 + (Q.streak >= 3 ? 5 : 0);
    if (wasBoss){ xp *= 2; unlock('boss'); }
    if (secs < 5) unlock('fast');
    if (Q.streak >= 5) unlock('streak5');
    addXP(xp); petReact(true);
    if (Q.streak >= 3) confetti(25);
  } else {
    sfx.bad(); Q.streak = 0; petReact(false);
  }
  if (Q.mode === 'train'){
    const ex = $('#explain'); if (ex) ex.hidden = false;
  } else {
    setTimeout(() => { Q.answered = false; next(); }, ok ? 900 : 1400);
  }
}

function next(){
  if (!Q) return;
  Q.answered = false;
  if (Q.mode === 'duel') Q.duel.turn = 1 - Q.duel.turn;
  Q.i++;
  if (Q.i >= Q.qs.length) finish(); else renderQuestion();
}

/* ---------- Режим «Молния» ---------- */
function startLightning(){
  Q = { mode:'lightning', qs:[], i:0, correct:0, streak:0, bestStreak:0, perCat:{}, start:Date.now(), timers:[],
        timeLeft:60, lightning:{ count:0, deck:shuffle(BANK) }, duel:{ names:['Игрок 1','Игрок 2'] },
        planetCat:null, boss:false, answered:false, currentStart:Date.now(), current:null };
  const t = setInterval(() => {
    if (!Q || Q.mode !== 'lightning') { clearInterval(t); return; }
    Q.timeLeft--;
    const el = $('#lightSec'); if (el) el.textContent = Math.max(0, Q.timeLeft);
    if (Q.timeLeft <= 0) { clearInterval(t); finishLightning(); }
  }, 1000);
  Q.timers.push(t);
  renderLightning();
}
function renderLightning(){
  if (!Q.lightning.deck.length) Q.lightning.deck = shuffle(BANK);
  const item = Q.lightning.deck.pop();
  Q.current = item; Q.currentStart = Date.now();
  $('#app').innerHTML = `
    <section class="screen">
      <div class="lightning-top">
        <span class="lightning-timer">⚡ <b id="lightSec">${Q.timeLeft}</b> сек</span>
        <span class="q-count">Верных: ${Q.lightning.count} · Серия: ${Q.streak} 🔥</span>
      </div>
      <div class="q-card">
        <div class="q-text">${esc(item.q)}</div>
        <div class="opts">${item.opts.map((o, i) =>
          '<button class="opt" data-i="' + i + '"><b>' + (i + 1) + '</b> ' + esc(o) + '</button>').join('')}</div>
      </div>
      <p class="hint">Отвечай максимально быстро — серия даёт бонусный опыт!</p>
    </section>`;
  document.querySelectorAll('.opt').forEach(b => b.addEventListener('click', () => lightAnswer(+b.dataset.i)));
}
function lightAnswer(i){
  if (!Q || Q.mode !== 'lightning') return;
  const ok = i === Q.current.correct;
  const secs = (Date.now() - Q.currentStart) / 1000;
  const opts = [...document.querySelectorAll('.opt')];
  opts.forEach((b, k) => {
    if (k === Q.current.correct) b.classList.add('correct');
    else if (k === i) { b.classList.add('wrong'); b.classList.add('shake'); }
  });
  if (ok){
    Q.lightning.count++; Q.streak++; Q.bestStreak = Math.max(Q.bestStreak, Q.streak);
    profile.bestStreak = Math.max(profile.bestStreak, Q.bestStreak);
    sfx.ok(); addXP(6 + (Q.streak >= 3 ? 4 : 0)); petReact(true);
    if (secs < 5) unlock('fast');
    if (Q.streak >= 5) unlock('streak5');
  } else { sfx.bad(); Q.streak = 0; petReact(false); }
  setTimeout(renderLightning, ok ? 500 : 900);
}
function finishLightning(){
  const c = Q.lightning.count;
  profile.lightningBest = Math.max(profile.lightningBest, c); saveProfile();
  if (c >= 15) unlock('lightning');
  addXP(c * 4);
  unlock('first');
  const rec = c >= profile.lightningBest;
  $('#app').innerHTML = `
    <section class="screen result-card">
      <h2>⚡ Молния завершена!</h2>
      <div class="lightning-final"><b>${c}</b><span>верных ответов за минуту</span></div>
      ${rec ? '<div class="result-title">🎉 Новый личный рекорд!</div>' : '<div class="hint">Рекорд: ' + profile.lightningBest + '</div>'}
      <div class="result-actions">
        <button class="btn btn-primary" id="againBtn">⚡ Ещё раз</button>
        <button class="btn" id="homeBtn">🏠 На базу</button>
      </div>
    </section>`;
  $('#againBtn').addEventListener('click', startLightning);
  $('#homeBtn').addEventListener('click', renderHome);
  sfx.win(); confetti(110);
}

/* ---------- Дуэль ---------- */
function duelSetup(){
  openModal('<h3>⚔️ Дуэль!</h3><p class="hint">10 вопросов, ходы по очереди. Кто больше — тот и чемпион.</p>' +
    '<div class="duel-names">' +
    '<input id="dName1" maxlength="14" placeholder="Игрок 1" value="' + esc(profile.duel1) + '"/>' +
    '<span class="vs">VS</span>' +
    '<input id="dName2" maxlength="14" placeholder="Игрок 2" value="' + esc(profile.duel2) + '"/>' +
    '</div><button class="btn btn-primary" id="duelGo">Начать дуэль! 🚀</button>');
  $('#duelGo').addEventListener('click', () => {
    profile.duel1 = $('#dName1').value.trim().slice(0, 14) || 'Игрок 1';
    profile.duel2 = $('#dName2').value.trim().slice(0, 14) || 'Игрок 2';
    saveProfile(); closeModal();
    startQuiz('duel');
    Q.duel.names = [profile.duel1, profile.duel2];
  });
}

/* ---------- Завершение и результаты ---------- */
function finish(){
  Q.timers.forEach(clearInterval);
  const total = Q.qs.length;
  const acc = total ? Q.correct / total : 0;
  const secs = Math.round((Date.now() - Q.start) / 1000);
  const iq = Math.round(Math.min(145, 85 + acc * 55 + Math.min(Q.bestStreak, 5) * 2));
  profile.history.push({ date: Date.now(), mode: Q.mode, correct: Q.correct, total: total, iq: iq, planet: Q.planetCat });
  saveProfile();
  unlock('first');
  if (Q.mode === 'challenge' && Q.correct === total) unlock('perfect');
  if (Q.mode === 'planet' && Q.planetCat){
    const stars = Q.correct === 4 ? 3 : Q.correct === 3 ? 2 : Q.correct === 2 ? 1 : 0;
    const p = profile.planets[Q.planetCat] || { stars:0 };
    if (stars > p.stars) p.stars = stars;
    profile.planets[Q.planetCat] = p; saveProfile();
    if (stars >= 1){
      unlock('star');
      if (CATS.every(c => ((profile.planets[c.id] || {}).stars || 0) >= 1)) unlock('allstars');
    }
  }
  if (Q.mode === 'duel'){
    const s = Q.duel.scores;
    let banner;
    if (s[0] === s[1]) banner = '<div class="result-title">🤝 Ничья! Дружба победила</div>';
    else {
      const w = s[0] > s[1] ? 0 : 1;
      banner = '<div class="result-title">🏆 Победил ' + esc(Q.duel.names[w]) + '!</div>';
      unlock('duelwin');
    }
    $('#app').innerHTML = `
      <section class="screen result-card">
        <h2>Дуэль завершена!</h2>
        <div class="duel-score"><span>${esc(Q.duel.names[0])} <b>${s[0]}</b></span><span class="vs">VS</span><span><b>${s[1]}</b> ${esc(Q.duel.names[1])}</span></div>
        ${banner}
        <div class="result-actions">
          <button class="btn btn-primary" id="againBtn">⚔️ Реванш</button>
          <button class="btn" id="homeBtn">🏠 На базу</button>
        </div>
      </section>`;
    $('#againBtn').addEventListener('click', duelSetup);
    $('#homeBtn').addEventListener('click', renderHome);
    sfx.win(); confetti(120);
    addXP(total * 3);
    return;
  }
  renderResults(iq, acc, secs, total);
  addXP(total * 3);
  confetti(iq >= 110 ? 140 : 60);
  if (iq >= 110) sfx.win();
}

function renderResults(iq, acc, secs, total){
  const title = iq >= 135 ? '🌠 Сверхновая' : iq >= 120 ? '🌌 Космический разум' : iq >= 105 ? '🚀 Пилот нейронов' : '🌱 Ракета на старте';
  const p = Math.round(iq / 145 * 100);
  const catRows = CATS.filter(c => Q.perCat[c.id]).map(c => {
    const s = Q.perCat[c.id];
    const pc = s.t ? Math.round(s.c / s.t * 100) : 0;
    return '<div class="bar-row"><span class="bar-cat">' + c.emoji + ' ' + c.name + '</span>' +
      '<span class="bar"><span class="bar-fill" style="width:' + pc + '%"></span></span><b>' + s.c + '/' + s.t + '</b></div>';
  }).join('');
  $('#app').innerHTML = `
    <section class="screen result-card">
      <h2>${esc(profile.name || 'Космонавт')}, твой результат!</h2>
      ${Q.planetCat ? '<p class="hint">Планета: ' + CAT[Q.planetCat].planet + ' 🪐</p>' : ''}
      <div class="gauge" style="--p:${p}"><div class="gauge-inner"><div class="gauge-num">${iq}</div><div class="gauge-label">IQ</div></div></div>
      <div class="result-title">${title}</div>
      <div class="res-stats">
        <div class="stat"><b>${Q.correct}/${total}</b><span>верных</span></div>
        <div class="stat"><b>${Math.round(acc * 100)}%</b><span>точность</span></div>
        <div class="stat"><b>${fmtTime(secs)}</b><span>время</span></div>
        <div class="stat"><b>🔥 ${Q.bestStreak}</b><span>серия</span></div>
      </div>
      <div class="cat-bars">${catRows}</div>
      <div class="result-actions">
        <button class="btn btn-primary" id="againBtn">↻ Ещё раз</button>
        <button class="btn" id="homeBtn">🏠 На базу</button>
        <button class="btn btn-warn" id="certBtn">📜 Получить диплом</button>
      </div>
    </section>`;
  $('#againBtn').addEventListener('click', () => startQuiz(Q.mode, Q.planetCat));
  $('#homeBtn').addEventListener('click', renderHome);
  $('#certBtn').addEventListener('click', makeDiploma);
}

/* ---------- Диплом ---------- */
function makeDiploma(){
  unlock('diploma');
  const cv = document.createElement('canvas'); cv.width = 1200; cv.height = 800;
  const g = cv.getContext('2d');
  const grad = g.createLinearGradient(0, 0, 1200, 800);
  grad.addColorStop(0, '#0a1420'); grad.addColorStop(.5, '#132438'); grad.addColorStop(1, '#0d1b2c');
  g.fillStyle = grad; g.fillRect(0, 0, 1200, 800);
  for (let i = 0; i < 50; i++){
    g.fillStyle = 'rgba(255,255,255,' + (Math.random() * .5 + .1).toFixed(2) + ')';
    g.beginPath(); g.arc(Math.random() * 1200, Math.random() * 800, Math.random() * 2.5, 0, 7); g.fill();
  }
  g.strokeStyle = '#3ddc97'; g.lineWidth = 6; g.strokeRect(40, 40, 1120, 720);
  g.globalAlpha = .3; g.strokeStyle = '#7c5cff'; g.lineWidth = 2; g.strokeRect(60, 60, 1080, 680); g.globalAlpha = 1;
  g.textAlign = 'center';
  g.fillStyle = '#3ddc97'; g.font = 'bold 44px sans-serif';
  g.fillText('🚀 NEURO QUEST 🚀', 600, 150);
  g.fillStyle = '#f2f7ff'; g.font = 'bold 30px sans-serif';
  g.fillText('ДИПЛОМ КОСМИЧЕСКОГО РАЗУМА', 600, 215);
  g.font = '26px sans-serif'; g.fillStyle = '#8fa3bd';
  g.fillText('вручается', 600, 285);
  g.fillStyle = '#ffd166'; g.font = 'bold 56px sans-serif';
  g.fillText(profile.name || 'Юному космонавту', 600, 360);
  const last = profile.history[profile.history.length - 1] || {};
  g.fillStyle = '#f2f7ff'; g.font = '30px sans-serif';
  g.fillText(AVATARS[profile.avatar % AVATARS.length] + '  IQ: ' + (last.iq ?? '—') + '  ·  Верных: ' + (last.correct ?? 0) + '/' + (last.total ?? 0), 600, 450);
  g.font = '24px sans-serif'; g.fillStyle = '#8fa3bd';
  g.fillText('Дата: ' + new Date().toLocaleDateString('ru-RU') + ' · NEURO QUEST — лаборатория мышления', 600, 720);
  const a = document.createElement('a');
  a.download = 'neuro-quest-diploma.png';
  a.href = cv.toDataURL('image/png');
  a.click();
  toast('📜 Диплом готов и скачан!');
}

/* ---------- Главная ---------- */
function renderHome(){
  stopAll();
  const starsRow = n => '⭐'.repeat(n) + '☆'.repeat(3 - n);
  const planets = CATS.map(c => {
    const s = (profile.planets[c.id] || {}).stars || 0;
    return '<button class="planet-card" data-cat="' + c.id + '">' +
      '<span class="planet-emoji">' + c.emoji + '</span>' +
      '<span class="planet-name">' + c.planet + '</span>' +
      '<span class="stars">' + starsRow(s) + '</span></button>';
  }).join('');
  const shelf = ACHS.slice(0, 8).map(a => {
    const got = profile.achs.includes(a.id);
    return '<span class="ach-badge ' + (got ? 'got' : '') + '" title="' + a.name + ': ' + a.desc + '">' + (got ? a.emoji : '🔒') + '</span>';
  }).join('');
  const avgIq = profile.history.length ? Math.round(profile.history.reduce((s, h) => s + (h.iq || 0), 0) / profile.history.length) : 0;
  $('#app').innerHTML = `
    <section class="screen">
      <div class="hero">
        <span class="planet">🪐</span>
        <h1>Прокачай свой мозг!</h1>
        <p class="lead">Космическая лаборатория мышления: задачи, боссы, планеты и дуэли. Тренируйся — стань Сверхновой! 🚀</p>
        <div class="name-row">
          <input id="nameInput" maxlength="16" placeholder="Твой позывной" value="${esc(profile.name)}"/>
          <button class="btn btn-primary" id="saveName">Сохранить</button>
        </div>
      </div>
      <h2 class="h2">🎯 Выбери режим</h2>
      <div class="modes">
        ${MODES.map(m => '<button class="mode" data-mode="' + m.id + '">' +
          '<span class="mode-emoji">' + m.emoji + '</span>' +
          '<span class="mode-title">' + m.title + '</span>' +
          '<span class="mode-desc">' + m.desc + '</span>' +
          '<span class="mode-meta">' + m.meta + '</span></button>').join('')}
      </div>
      <h2 class="h2">🪐 Галактика знаний</h2>
      <p class="hint">Кликни по планете — получишь мини-тест из 4 вопросов её темы и звёзды за точность.</p>
      <div class="galaxy">${planets}</div>
      <h2 class="h2">📊 Твоя станция</h2>
      <div class="stats-row">
        <div class="stat"><b>${profile.history.length}</b><span>тестов пройдено</span></div>
        <div class="stat"><b>${avgIq || '—'}</b><span>средний IQ</span></div>
        <div class="stat"><b>🔥 ${profile.bestStreak}</b><span>лучшая серия</span></div>
        <div class="stat"><b>⚡ ${profile.lightningBest}</b><span>рекорд «Молнии»</span></div>
      </div>
      <h2 class="h2">🏅 Полка достижений</h2>
      <div class="ach-shelf">${shelf}</div>
      <p class="hint">Полный список достижений — по кнопке 🏅 в шапке.</p>
    </section>`;
  $('#saveName').addEventListener('click', () => {
    profile.name = $('#nameInput').value.trim().slice(0, 16);
    saveProfile(); sfx.ok();
    toast(profile.name ? 'Привет, ' + esc(profile.name) + '! 🚀' : 'Позывной стёрт');
  });
  document.querySelectorAll('.mode').forEach(b => b.addEventListener('click', () => {
    sfx.click();
    const m = b.dataset.mode;
    if (m === 'duel') return duelSetup();
    if (m === 'lightning') return startLightning();
    startQuiz(m);
  }));
  document.querySelectorAll('.planet-card').forEach(b => b.addEventListener('click', () => {
    sfx.click(); startQuiz('planet', b.dataset.cat);
  }));
}

/* ---------- Пасхалка «умник» + клавиатура ---------- */
document.addEventListener('keydown', e => {
  if (e.key.length === 1){
    eggBuf = (eggBuf + e.key.toLowerCase()).slice(-10);
    if (eggBuf.includes('умник') && !read('nq_rainbow', false)){
      write('nq_rainbow', true);
      theme = 'rainbow'; write('nq_theme', theme);
      document.documentElement.dataset.theme = theme;
      buildThemeTray();
      unlock('secret');
      toast('🌈 Секрет открыт! Радужный скин разблокирован');
      confetti(150); sfx.win();
    }
  }
  if (Q && ['1','2','3','4'].includes(e.key)){
    const opt = document.querySelectorAll('.opt')[+e.key - 1];
    if (opt && !opt.disabled) opt.click();
  }
});

/* ---------- Старт ---------- */
updateXPChip();
renderHome();

if ('serviceWorker' in navigator) navigator.serviceWorker.register('sw.js').catch(() => {});

})();
