/* AXIOM IQ — полностью автономная лаборатория мышления. Без серверов и библиотек. */
(() => {
'use strict';

const ICONS = {
  layout:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  zap:'<path d="m13 2-3 8H4l7 12 3-8h6L13 2Z"/>',grid:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><rect x="14" y="14" width="7" height="7" rx="1"/>',
  chart:'<path d="M3 3v18h18M7 16l4-5 4 3 5-7"/>',info:'<circle cx="12" cy="12" r="10"/><path d="M12 16v-4m0-4h.01"/>',sun:'<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M4.93 4.93l1.42 1.42m11.3 11.3 1.42 1.42M2 12h2m16 0h2M4.93 19.07l1.42-1.42m11.3-11.3 1.42-1.42"/>',moon:'<path d="M20.95 13A9 9 0 0 1 11 3.05 9 9 0 1 0 20.95 13Z"/>',user:'<circle cx="12" cy="8" r="4"/><path d="M4 21v-2a8 8 0 0 1 16 0v2"/>',menu:'<path d="M4 6h16M4 12h16M4 18h16"/>',arrow:'<path d="M5 12h14m-6-6 6 6-6 6"/>',check:'<path d="m4 12 5 5L20 6"/>',close:'<path d="M18 6 6 18M6 6l12 12"/>',clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',brain:'<path d="M12 18V5a3 3 0 0 0-5.7-1.3A4 4 0 0 0 4 11a4 4 0 0 0 3 7.8A3.5 3.5 0 0 0 12 21m0-16a3 3 0 0 1 5.7-1.3A4 4 0 0 1 20 11a4 4 0 0 1-3 7.8A3.5 3.5 0 0 1 12 21m-8-9h4m8 0h4"/>',
  boxes:'<rect x="3" y="3" width="7" height="7" rx="1"/><rect x="14" y="3" width="7" height="7" rx="1"/><rect x="3" y="14" width="7" height="7" rx="1"/><path d="M14 17h7m-3.5-3.5v7"/>',numbers:'<path d="M4 8h6m-3-3v14m7-14h6l-6 7h6m-6 7h6"/>',logic:'<circle cx="5" cy="5" r="2"/><circle cx="19" cy="6" r="2"/><circle cx="12" cy="19" r="2"/><path d="m7 6 10 1M6 7l5 10m7-9-5 9"/>',cube:'<path d="m12 2 9 5-9 5-9-5 9-5Zm-9 5v10l9 5 9-5V7M12 12v10"/>',text:'<path d="M4 7V4h16v3m-8-3v16m-4 0h8"/>',eye:'<path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>',memory:'<rect x="4" y="4" width="16" height="16" rx="3"/><path d="M9 4V2m6 2V2M9 22v-2m6 2v-2M4 9H2m2 6H2m20-6h-2m2 6h-2m-11-3h6m-3-3v6"/>',
  target:'<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="5"/><circle cx="12" cy="12" r="1"/>',flame:'<path d="M12 22c4.4 0 7-3 7-7 0-3-2-5-3-6-.2 2-1.1 3-2 3 0-4-2-7-5-10 0 4-4 7-4 12 0 5 3 8 7 8Z"/>',spark:'<path d="m12 2 2.5 7.5L22 12l-7.5 2.5L12 22l-2.5-7.5L2 12l7.5-2.5L12 2Z"/>',calendar:'<rect x="3" y="5" width="18" height="16" rx="2"/><path d="M16 3v4M8 3v4M3 11h18"/>',trophy:'<path d="M8 21h8m-4-4v4M7 4h10v6a5 5 0 0 1-10 0V4ZM7 6H4v3a4 4 0 0 0 4 4m9-7h3v3a4 4 0 0 1-4 4"/>',download:'<path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4"/>',trash:'<path d="M3 6h18m-2 0-1 15H6L5 6m3 0V4h8v2m-6 4v7m4-7v7"/>',shield:'<path d="m12 2 9 4v5c0 5.5-3.8 9.5-9 11-5.2-1.5-9-5.5-9-11V6l9-4Zm-4 9 3 3 5-5"/>',help:'<circle cx="12" cy="12" r="10"/><path d="M9.5 9a2.5 2.5 0 1 1 4.5 1.5c-1 1.3-2 1.5-2 3.5m0 3h.01"/>',play:'<path d="m7 4 14 8-14 8V4Z"/>',back:'<path d="M19 12H5m6 6-6-6 6-6"/>',pause:'<rect x="6" y="4" width="4" height="16" rx="1"/><rect x="14" y="4" width="4" height="16" rx="1"/>'
};
const icon=(key,size=20)=>`<svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONS[key]||ICONS.spark}</svg>`;
const CATEGORIES = [
  {id:'matrix',name:'Визуальные матрицы',short:'Матрицы',description:'Скрытые правила, последовательности фигур, недостающие элементы.',icon:'boxes',tone:'mint',rating:'Визуальная логика'},
  {id:'numbers',name:'Числовые закономерности',short:'Числа',description:'Ряды чисел, сложные последовательности и математические связи.',icon:'numbers',tone:'violet',rating:'Числовой анализ'},
  {id:'logic',name:'Логика и дедукция',short:'Логика',description:'Строгие выводы, причинно-следственные связи и условия.',icon:'logic',tone:'amber',rating:'Аналитика'},
  {id:'spatial',name:'Пространственное мышление',short:'Пространство',description:'Вращение объектов, зеркальные отражения и преобразования.',icon:'cube',tone:'mint',rating:'3D-мышление'},
  {id:'verbal',name:'Вербальный интеллект',short:'Слова',description:'Аналогии, связи между понятиями и смысловая точность.',icon:'text',tone:'violet',rating:'Речевые связи'},
  {id:'attention',name:'Внимание и концентрация',short:'Внимание',description:'Поиск признаков, визуальная точность и скорость наблюдения.',icon:'eye',tone:'amber',rating:'Концентрация'},
  {id:'memory',name:'Зрительная память',short:'Память',description:'Запоминайте расположение элементов и восстанавливайте узоры.',icon:'memory',tone:'mint',rating:'Кратковременная память'}
];
const CAT_BY_ID=Object.fromEntries(CATEGORIES.map(c=>[c.id,c]));
const MODES={
  express:{name:'Экспресс-тест',tag:'БЫСТРЫЙ СТАРТ',icon:'zap',count:10,minutes:8,description:'Короткая проверка семи направлений мышления. Идеально для первого знакомства.',color:'featured'},
  challenge:{name:'IQ Challenge',tag:'КОМПЛЕКСНОЕ ИСПЫТАНИЕ',icon:'brain',count:21,minutes:18,description:'Большое сбалансированное испытание: три задания из каждого направления.',color:'featured'},
  extreme:{name:'Extreme Mode',tag:'ДЛЯ САМЫХ УПОРНЫХ',icon:'flame',count:28,minutes:18,description:'Четыре задания из каждой области, повышенная сложность и дефицит времени.',color:'mode-violet'},
  training:{name:'Свободная тренировка',tag:'БЕЗ ДАВЛЕНИЯ',icon:'target',count:14,minutes:0,description:'Без таймера. После ответа объясняем решение, чтобы можно было учиться.',color:''},
  daily:{name:'Задача дня',tag:'ОДИН НАБОР НА ДЕНЬ',icon:'calendar',count:14,minutes:12,description:'Ежедневное испытание с одинаковыми заданиями на всех устройствах.',color:''},
  category:{name:'Тренировка направления',tag:'ТОЧЕЧНАЯ ТРЕНИРОВКА',icon:'target',count:12,minutes:0,description:'Все задания посвящены одному виду мышления.',color:''}
};

const escapeHtml=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const clamp=(n,a,b)=>Math.max(a,Math.min(b,n));
const readStore=(key,fallback)=>{try{const v=JSON.parse(localStorage.getItem(key));return v??fallback;}catch{return fallback;}};
const writeStore=(key,val)=>{try{localStorage.setItem(key,JSON.stringify(val));}catch{showToast('Не удалось сохранить данные: хранилище недоступно');}};
const seedFromString=str=>{let h=2166136261;for(const ch of str){h=Math.imul(h^ch.charCodeAt(0),16777619);}return h>>>0;};
const rngFactory=seed=>{let t=seed>>>0;return ()=>{t+=0x6D2B79F5;let v=t;v=Math.imul(v^(v>>>15),v|1);v^=v+Math.imul(v^(v>>>7),v|61);return((v^(v>>>14))>>>0)/4294967296;};};
const int=(r,min,max)=>Math.floor(r()*(max-min+1))+min;
const shuffle=(items,r)=>{const a=[...items];for(let i=a.length-1;i>0;i--){const j=int(r,0,i);[a[i],a[j]]=[a[j],a[i]];}return a;};
const pick=(items,r)=>items[int(r,0,items.length-1)];
const svgWrap=(body,w,h,cls='')=>`<svg class="${cls}" viewBox="0 0 ${w} ${h}" role="img" aria-label="Графическое задание" xmlns="http://www.w3.org/2000/svg">${body}</svg>`;
const rect=(x,y,w,h,fill='none',stroke='var(--border)',rad=8)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rad}" fill="${fill}" stroke="${stroke}"/>`;
const DOT_POS=[[0,0],[1,0],[2,0],[0,1],[1,1],[2,1],[0,2],[1,2],[2,2]];
function dotsAt(n,x,y,size=74){return DOT_POS.slice(0,n).map(([a,b])=>`<circle cx="${x+(a-1)*size*.23}" cy="${y+(b-1)*size*.23}" r="${size*.075}" fill="var(--accent)"/>`).join('');}
function maskDots(mask,x,y,size=67){return DOT_POS.map(([a,b],i)=>(mask&(1<<i))?`<circle cx="${x+(a-1)*size*.25}" cy="${y+(b-1)*size*.25}" r="${size*.075}" fill="var(--accent)"/>`:'').join('');}
const bits=x=>x.toString(2).replace(/0/g,'').length;
function matrixSVG(cells,visualType='count'){
  const size=92,gap=10,pad=14,total=pad*2+size*3+gap*2;
  let body='';
  cells.forEach((value,i)=>{const x=pad+(i%3)*(size+gap),y=pad+Math.floor(i/3)*(size+gap);body+=rect(x,y,size,size,'rgba(121,231,206,.025)','var(--border)',10);
    if(value===null){body+=`<text x="${x+size/2}" y="${y+size/2+12}" font-size="38" fill="var(--accent)" font-family="Arial" font-weight="600" text-anchor="middle">?</text>`;return;}
    if(visualType==='count')body+=dotsAt(value,x+size/2,y+size/2,size);
    else if(visualType==='mask')body+=maskDots(value,x+size/2,y+size/2,size);
    else{const d=value*90;body+=`<g transform="translate(${x+size/2},${y+size/2}) rotate(${d})"><path d="M0 -29 23 16 6 9 6 29 -6 29 -6 9 -23 16Z" fill="var(--accent)" opacity=".93" /></g>`;}
  });
  return svgWrap(body,total,total,'matrix-svg');
}
function countOptions(correct,r){
  const opts=[correct,correct-1,correct+1,correct+2].filter(n=>n>0);
  while(opts.length<4){const n=correct-opts.length-1;if(n>0&&!opts.includes(n))opts.push(n);else opts.push(correct+opts.length+1);}
  return shuffle([...new Set(opts)].slice(0,4),r);
}
function makeMatrix(r,difficulty){
  const family= difficulty>=3 ? pick(['xor','count','rotate','xor'],r):pick(['count','rotate','xor'],r);
  if(family==='count'){
    const base=int(r,1,2),stepRow=int(r,1,2),stepCol=1;
    const values=Array.from({length:9},(_,i)=>base+Math.floor(i/3)*stepRow+(i%3)*stepCol);
    const correct=values[8],options=countOptions(correct,r).map(n=>({text:`${n} элементов`}));
    return {title:'Какая фигура должна стоять на месте вопросительного знака?',subtitle:'Найдите правило изменения количества точек по строкам и столбцам.',visual:matrixSVG([...values.slice(0,8),null]),options,answer:options.findIndex(o=>o.text===`${correct} элементов`),explanation:`В каждом шаге вправо добавляется одна точка, а при переходе вниз — ${stepRow}. В недостающей ячейке должно быть ${correct} точек.`,difficulty};
  }
  if(family==='rotate'){
    const start=int(r,0,3),sr=pick([1,3],r),sc=pick([1,3],r),values=Array.from({length:9},(_,i)=>(start+Math.floor(i/3)*sr+(i%3)*sc)%4),correct=values[8];
    const labels=['↑','→','↓','←'],opts=shuffle([0,1,2,3],r),options=opts.map(n=>({text:`${labels[n]}  ${['вверх','вправо','вниз','влево'][n]}`}));
    return {title:'В каком направлении будет указывать последняя стрелка?',subtitle:'Проследите, как стрелки поворачиваются при переходе между клетками.',visual:matrixSVG([...values.slice(0,8),null],'arrow'),options,answer:opts.indexOf(correct),explanation:`В каждом столбце стрелка поворачивается на ${sr===1?'90° по часовой стрелке':'90° против часовой стрелки'} при движении вниз, а в строке — на ${sc===1?'90° по часовой стрелке':'90° против часовой стрелки'} при движении вправо. Правильное направление: ${['вверх','вправо','вниз','влево'][correct]}.`,difficulty};
  }
  let masks;for(let attempt=0;attempt<300;attempt++){
    const cols=[];
    for(let col=0;col<3;col++){
      let a=0,b=0;while(bits(a)<2||bits(a)>5)a=int(r,1,511);while(bits(b)<2||bits(b)>5)b=int(r,1,511);
      cols.push([a,b,a^b]);
    }
    const tentative=Array.from({length:9},(_,i)=>cols[i%3][Math.floor(i/3)]);
    if(bits(tentative[8])>=2&&bits(tentative[8])<=6){masks=tentative;break;}
  }
  if(!masks){return makeMatrix(r,1);}
  const correct=masks[8],optionsMasks=[correct];let tries=0;
  while(optionsMasks.length<4&&tries++<250){const b1=int(r,0,8),b2=int(r,0,8);if(b1===b2)continue;const mask=correct^(1<<b1)^(1<<b2);if(!optionsMasks.includes(mask)&&bits(mask)>=1&&bits(mask)<=8)optionsMasks.push(mask);}
  while(optionsMasks.length<4){const mask=correct^(1<<int(r,0,8));if(!optionsMasks.includes(mask))optionsMasks.push(mask);}
  const opts=shuffle(optionsMasks,r);
  return {title:'Найдите недостающий узор в логической матрице.',subtitle:'Сравните верхнюю и среднюю фигуры каждой колонки. По какому правилу образуется нижняя?',visual:matrixSVG([...masks.slice(0,8),null],'mask'),options:opts.map(mask=>({svg:svgWrap(rect(5,5,99,99,'rgba(121,231,206,.025)','var(--border)',9)+maskDots(mask,54,54,91),109,109)})),answer:opts.indexOf(correct),explanation:'В каждой колонке нижняя фигура содержит точки, присутствующие ровно в одной из двух верхних фигур. Совпадающие точки исчезают (логическая операция исключающего ИЛИ).',difficulty:3};
}
function makeNumeric(r,difficulty){
  const families=['arithmetic','growing','alternating','squares','triangular','geometric','fibonacci','interleave'];
  const type=pick(difficulty>=3?families:families.slice(0,6),r);let seq=[],correct,explanation;
  if(type==='arithmetic'){const start=int(r,4,35),d=int(r,3,13);seq=Array.from({length:5},(_,i)=>start+i*d);correct=start+5*d;explanation=`Каждый следующий элемент больше предыдущего на ${d}.`;}
  else if(type==='growing'){const start=int(r,2,24),base=int(r,2,5),step=int(r,1,4);let x=start;seq=[x];for(let i=0;i<4;i++){x+=base+i*step;seq.push(x);}correct=x+base+4*step;explanation=`Приращения образуют последовательность: ${[0,1,2,3,4].map(i=>base+i*step).join(', ')}. Каждое следующее приращение увеличивается на ${step}.`;}
  else if(type==='alternating'){const a=int(r,3,8),b=int(r,10,19),start=int(r,4,20);let x=start;seq=[x];for(let i=0;i<4;i++){x+=i%2?b:a;seq.push(x);}correct=x+a;explanation=`Чередуются прибавления ${a} и ${b}. После последнего числа нужно прибавить ${a}.`;}
  else if(type==='squares'){const st=int(r,1,3),offset=int(r,1,13);seq=Array.from({length:5},(_,i)=>(st+i)**2+offset);correct=(st+5)**2+offset;explanation=`Числа получены как квадраты последовательных натуральных чисел плюс ${offset}.`;}
  else if(type==='triangular'){const st=int(r,2,5),offset=int(r,0,8),t=n=>n*(n+1)/2;seq=Array.from({length:5},(_,i)=>t(st+i)+offset);correct=t(st+5)+offset;explanation=`Это треугольные числа n(n + 1) / 2 с добавлением ${offset}; разности возрастают на единицу.`;}
  else if(type==='geometric'){const st=int(r,2,5),factor=int(r,2,3);seq=Array.from({length:5},(_,i)=>st*factor**i);correct=st*factor**5;explanation=`Каждый следующий элемент получается умножением предыдущего на ${factor}.`;}
  else if(type==='fibonacci'){const a=int(r,1,7),b=int(r,2,9);seq=[a,b];while(seq.length<5)seq.push(seq.at(-1)+seq.at(-2));correct=seq[3]+seq[4];explanation='Начиная с третьего элемента каждое число равно сумме двух предыдущих.';}
  else{const a=int(r,3,12),b=int(r,20,39),d=int(r,3,7),e=int(r,4,9);seq=[a,b,a+d,b+e,a+2*d,b+2*e];correct=a+3*d;explanation=`Позиции 1, 3, 5, 7 образуют отдельный ряд с шагом ${d}; позиции 2, 4, 6 — другой ряд с шагом ${e}.`;}
  const scale=clamp(Math.floor(correct*.06),2,19),other=[correct+scale,correct-scale,correct+2*scale,correct-2*scale,correct+1,correct-1].filter(n=>n>0&&n!==correct);
  const choices=[correct,...shuffle([...new Set(other)],r).slice(0,3)];let offset=3;while(choices.length<4){const v=correct+offset++;if(!choices.includes(v))choices.push(v);}
  const options=shuffle(choices,r).map(n=>({text:String(n)}));
  return {title:`Какое число должно продолжить последовательность?`,subtitle:`${seq.join('    ·    ')}    ·    ?`,options,answer:options.findIndex(o=>o.text===String(correct)),explanation:`${explanation} Следующий элемент — ${correct}.`,difficulty};
}

const VERBAL_BANK=[
  ['Термометр : температура = барометр : ...','давление',['скорость','влажность','яркость'],'Барометр измеряет атмосферное давление, так же как термометр — температуру.'],
  ['Кисть : художник = скальпель : ...','хирург',['токарь','скульптор','шахтёр'],'Кисть — рабочий инструмент художника, скальпель — хирурга.'],
  ['Перчатка : рука = ботинок : ...','нога',['голова','колено','ладонь'],'Перчатку надевают на руку, ботинок — на ногу.'],
  ['Восток : запад = север : ...','юг',['центр','северо-восток','горизонт'],'В каждой паре указаны противоположные стороны света.'],
  ['Пролог : начало = эпилог : ...','конец',['завязка','сюжет','глава'],'Пролог предшествует основному повествованию, эпилог завершает его.'],
  ['Лестница : ступень = цепь : ...','звено',['кольцо','петля','крючок'],'Лестница состоит из ступеней, цепь — из звеньев.'],
  ['Корень : растение = фундамент : ...','здание',['крыша','дорога','окно'],'Корень закрепляет растение, фундамент служит опорой зданию.'],
  ['Библиотека : книги = архив : ...','документы',['картины','станки','приборы'],'Библиотека хранит книги, архив — документы.'],
  ['Микроскоп : малое = телескоп : ...','далёкое',['тяжёлое','громкое','горячее'],'Микроскоп позволяет наблюдать малые объекты, телескоп — далёкие.'],
  ['День : ночь = бодрствование : ...','сон',['отдых','утро','работа'],'День и ночь противопоставлены, как бодрствование и сон.'],
  ['Секунда : время = метр : ...','длина',['масса','плотность','скорость'],'Секунда — единица времени, метр — единица длины.'],
  ['Автор : роман = композитор : ...','симфония',['картина','статуя','чертёж'],'Писатель создаёт роман, композитор — симфонию.'],
  ['Гусеница : бабочка = личинка : ...','взрослое насекомое',['яйцо','куколка','семя'],'Гусеница превращается в бабочку; личинка развивается во взрослую особь насекомого.'],
  ['Перо : птица = чешуя : ...','рыба',['насекомое','лягушка','осьминог'],'Перья покрывают тело птицы, чешуя — тело рыбы.'],
  ['Скупой : щедрый = смелый : ...','трусливый',['упорный','решительный','весёлый'],'В обеих парах слова являются антонимами.'],
  ['Подберите синоним к слову «лаконичный».','краткий',['непонятный','торжественный','беспечный'],'Лаконичная речь — краткая и немногословная.'],
  ['Какое слово отличается от остальных по категории?','пятница',['январь','март','июль'],'Три слова обозначают месяцы, пятница — день недели.'],
  ['Какое понятие не является плоской фигурой?','куб',['треугольник','круг','квадрат'],'Куб — объёмное тело, остальные фигуры двухмерные.'],
  ['Компас : направление = часы : ...','время',['расстояние','температура','масса'],'Компас показывает направление, часы — время.'],
  ['Грамм : масса = литр : ...','объём',['скорость','время','сила'],'Грамм измеряет массу, литр — объём.'],
  ['Буква : слово = слово : ...','предложение',['алфавит','слог','звук'],'Из букв составляют слова, а из слов — предложения.'],
  ['Что является противоположностью слова «очевидный»?','неявный',['простой','вероятный','заметный'],'Очевидное легко обнаружить, неявное скрыто и не выражено прямо.'],
  ['Лёд : плавление = вода : ...','испарение',['замерзание','кристаллизация','сублимация'],'При плавлении лёд переходит в жидкость; при испарении вода — в газ.'],
  ['Око : глаз = уста : ...','рот',['ухо','нос','подбородок'],'«Око» — устаревшее слово для глаза, «уста» — для рта.']
];
function makeVerbal(r,difficulty){
  const [title,correct,wrong,explanation]=pick(VERBAL_BANK,r),options=shuffle([correct,...wrong],r).map(text=>({text}));
  return {title,subtitle:'Выберите наиболее точный ответ.',options,answer:options.findIndex(o=>o.text===correct),explanation,difficulty};
}
const LOGIC_BANK=[
  ['У Анны больше книг, чем у Бориса, а у Бориса больше, чем у Веры. У кого книг больше всего?','У Анны',['У Бориса','У Веры','Нельзя определить'],'Из условий следует: Анна > Борис > Вера.'],
  ['Если лампа включена, то горит индикатор. Индикатор не горит. Какой вывод обязателен?','Лампа выключена',['Лампа включена','Индикатор сломан','Нельзя сделать вывод'],'По правилу отрицания следствия: если при включённой лампе индикатор обязательно горит, отсутствие света означает, что лампа не включена.'],
  ['Все орхидеи — растения. Все растения — живые организмы. Что следует обязательно?','Все орхидеи — живые организмы',['Все растения — орхидеи','Все живые организмы — орхидеи','Ни одна орхидея не является растением'],'Если A входит в B, а B в C, то A входит в C.'],
  ['Три ящика расположены по порядку: красный левее синего, а синий левее зелёного. Какой находится посередине?','Синий',['Красный','Зелёный','Нельзя определить'],'Порядок слева направо: красный, синий, зелёный.'],
  ['У Игоря три карточки: круг, квадрат и треугольник. Круг не первый, треугольник последний. Какая карточка первая?','Квадрат',['Круг','Треугольник','Нельзя определить'],'Треугольник третий. Круг не может быть первым, поэтому первый — квадрат.'],
  ['Только один из двух переключателей включён. Первый выключен. Что верно?','Второй включён',['Второй выключен','Оба включены','Нельзя определить'],'Если включён ровно один и это не первый, значит второй.'],
  ['В классе все участники шахматного клуба умеют играть в шахматы. Можно ли из этого заключить, что все умеющие играть состоят в клубе?','Нет, этого не следует',['Да, обязательно','Да, если в классе больше 10 человек','Да, если есть хотя бы один член клуба'],'Умение играть — необходимое условие членства, но обратное утверждение не задано.'],
  ['Ровно одно из утверждений истинно: «число больше 10» и «число чётное». Число 13 подходит?','Да',['Нет, оба истинны','Нет, оба ложны','Невозможно проверить'],'13 больше 10, но нечётное. Истинно ровно одно утверждение.'],
  ['У четырёх спортсменов разные места. Миша раньше Коли, Коля раньше Олега. Кто точно не может быть первым?','Олег',['Миша','Неизвестный четвёртый спортсмен','Нельзя определить'],'Олег финишировал после Коли и Миши, поэтому не мог быть первым.'],
  ['Если сегодня среда, какой день недели будет через 10 дней?','Суббота',['Пятница','Воскресенье','Понедельник'],'Через 7 дней снова среда, ещё через 3 — суббота.'],
  ['Два разных целых числа имеют сумму 11. Одно равно 4. Чему равно другое?','7',['6','8','15'],'11 − 4 = 7.'],
  ['В мешке только красные и синие шарики. Известно, что красных нет. Какого цвета любой вынутый шарик, если мешок не пуст?','Синего',['Красного','Зелёного','Неизвестного'],'Если доступны только красный и синий, а красных нет, все имеющиеся — синие.'],
  ['У Маши билет № 14, у Даши номер на 3 больше, у Кати на 2 меньше, чем у Даши. Номер Кати?','15',['12','16','19'],'Даша — 17, Катя — 17 − 2 = 15.'],
  ['В комнате три человека. Каждый пожал руку каждому другому ровно один раз. Сколько было рукопожатий?','3',['2','4','6'],'Возможны три уникальные пары людей: AB, AC и BC.'],
  ['На полке книга А стоит левее книги Б, а книга В правее книги Б. Какая книга самая правая из этих трёх?','В',['А','Б','Нельзя определить'],'А < Б < В по расположению слева направо.'],
  ['Если число делится на 6 без остатка, то оно обязательно делится на ...','3',['4','5','7'],'Число, кратное 6, обязательно кратно 2 и 3.'],
  ['Все квадраты — прямоугольники. Какое утверждение обязательно верно?','Каждый квадрат имеет четыре прямых угла',['Каждый прямоугольник — квадрат','Все прямоугольники равносторонние','У квадрата нет диагоналей'],'Квадрат — частный случай прямоугольника, у которого все углы прямые.'],
  ['Из трёх коробок две пусты, а в одной лежит приз. Коробка № 1 пуста, № 2 содержит приз. Что в коробке № 3?','Она пуста',['Там тоже приз','Там два приза','Содержимое неизвестно'],'По условию ровно одна коробка с призом, и это № 2.'],
  ['Если А = Б, а Б > В, какое сравнение верно?','А > В',['А < В','А = В','Сравнить невозможно'],'Замена Б на равное ему А сохраняет неравенство А > В.'],
  ['На часах 15:00. Сколько часов останется до 21:00 того же дня?','6',['5','7','18'],'21 − 15 = 6 часов.']
];
function makeLogic(r,difficulty){
  const [title,correct,wrong,explanation]=pick(LOGIC_BANK,r),options=shuffle([correct,...wrong],r).map(text=>({text}));
  return {title,subtitle:'Выберите вывод, который следует из условий задачи.',options,answer:options.findIndex(o=>o.text===correct),explanation,difficulty};
}

function transformGrid(mask,cols,rows,kind){
  let out=0;
  for(let y=0;y<rows;y++)for(let x=0;x<cols;x++)if(mask&(1<<(y*cols+x))){let nx=x,ny=y;
    if(kind==='r90'){nx=rows-1-y;ny=x;}else if(kind==='r180'){nx=cols-1-x;ny=rows-1-y;}else if(kind==='r270'){nx=y;ny=cols-1-x;}else if(kind==='mirrorH'){nx=cols-1-x;}else if(kind==='mirrorV'){ny=rows-1-y;}
    out|=(1<<(ny*cols+nx));
  }return out;
}
function boardSVG(mask,cols=3,rows=3,small=false){
  const cell=small?30:55,gap=small?4:7,pad=small?10:16,w=pad*2+cols*cell+(cols-1)*gap,h=pad*2+rows*cell+(rows-1)*gap;
  let body='';for(let i=0;i<cols*rows;i++){
    const x=pad+(i%cols)*(cell+gap),y=pad+Math.floor(i/cols)*(cell+gap),lit=Boolean(mask&(1<<i));
    body+=rect(x,y,cell,cell,lit?'var(--accent)':'rgba(121,231,206,.035)',lit?'var(--accent)':'var(--border)',small?4:7);
    if(lit)body+=`<rect x="${x+cell*.26}" y="${y+cell*.26}" width="${cell*.48}" height="${cell*.48}" rx="${small?2:3}" fill="#06352e" opacity=".2"/>`;
  }
  return svgWrap(body,w,h,'board-svg');
}
function uniqueSpatialMask(r){
  for(let attempt=0;attempt<250;attempt++){
    let mask=0;while(bits(mask)<3||bits(mask)>5)mask=int(r,1,511);
    const transforms=[mask,transformGrid(mask,3,3,'r90'),transformGrid(mask,3,3,'r180'),transformGrid(mask,3,3,'r270'),transformGrid(mask,3,3,'mirrorH'),transformGrid(mask,3,3,'mirrorV')];
    if(new Set(transforms).size===6)return mask;
    if(new Set(transforms.slice(0,4)).size===4&&attempt>100)return mask;
  }
  return 0b000101011;
}
function makeSpatial(r,difficulty){
  const mask=uniqueSpatialMask(r),mirror=difficulty>=3&&r()<.5;
  let correct,optionsMasks,title,explanation;
  if(mirror){correct=transformGrid(mask,3,3,'mirrorH');optionsMasks=[correct,mask,transformGrid(mask,3,3,'mirrorV'),transformGrid(mask,3,3,'r90')];title='Какая фигура получится при зеркальном отражении относительно вертикальной оси?';explanation='При зеркальном отражении меняются местами левые и правые клетки каждого ряда. Верх и низ не переставляются.';}
  else{correct=transformGrid(mask,3,3,'r90');optionsMasks=[mask,correct,transformGrid(mask,3,3,'r180'),transformGrid(mask,3,3,'r270')];title='Какой рисунок получится после поворота фигуры на 90° по часовой стрелке?';explanation='Поверните всю сетку на четверть оборота по часовой стрелке. Каждый заполненный квадрат должен перейти на соответствующее новое место.';}
  optionsMasks=[...new Set(optionsMasks)];
  if(optionsMasks.length<4){for(let v=1;v<512&&optionsMasks.length<4;v++){if(!optionsMasks.includes(v)&&bits(v)===bits(mask))optionsMasks.push(v);}}
  const opts=shuffle(optionsMasks.slice(0,4),r);
  return {title,subtitle:'Обратите внимание на расположение всех закрашенных квадратов.',visual:boardSVG(mask),options:opts.map(m=>({svg:boardSVG(m,3,3,true)})),answer:opts.indexOf(correct),explanation,difficulty};
}
function attentionSVG(elements,cols=8){
  const cell=39,pad=17,rows=Math.ceil(elements.length/cols),w=2*pad+cols*cell,h=2*pad+rows*cell;
  let body='';elements.forEach((v,i)=>{
    const x=pad+(i%cols)*cell+cell/2,y=pad+Math.floor(i/cols)*cell+cell/2;
    let color=v.includes('mint')?'var(--accent)':v.includes('purple')?'var(--violet)':'var(--muted-2)';
    if(v.includes('diamond'))body+=`<path d="M${x} ${y-12} l12 12 -12 12 -12 -12Z" fill="${color}" opacity="${v.includes('muted')?.68:1}"/>`;
    else body+=`<circle cx="${x}" cy="${y}" r="${v.includes('small')?6:10}" fill="${color}" opacity="${v.includes('muted')?.68:1}"/>`;
  });return svgWrap(body,w,h,'attention-svg');
}
function makeAttention(r,difficulty){
  const total=difficulty>=3?56:48,target=int(r,7,13),others=['mint-circle','purple-diamond','purple-circle','muted-diamond','muted-circle','muted-small-circle'];
  let data=Array(target).fill('mint-diamond');while(data.length<total)data.push(pick(others,r));data=shuffle(data,r);
  const choices=countOptions(target,r),options=choices.map(x=>({text:`${x}`}));
  return {title:'Сколько бирюзовых ромбов изображено на поле?',subtitle:'Считайте только ромбы бирюзового цвета. Бирюзовые круги и ромбы других цветов не учитываются.',visual:attentionSVG(data),options,answer:choices.indexOf(target),explanation:`На поле находится ${target} бирюзовых ромбов. Здесь важно одновременно учитывать и форму, и цвет.`,difficulty};
}
function makeMemory(r,difficulty){
  const n=difficulty>=3?6:int(r,4,5),size=12;let mask=0;while(bits(mask)<n)mask|=(1<<int(r,0,size-1));
  const masks=[mask],allBits=Array.from({length:size},(_,i)=>i);let tries=0;
  while(masks.length<4&&tries++<400){const lit=allBits.filter(i=>mask&(1<<i)),unlit=allBits.filter(i=>!(mask&(1<<i))),off=pick(lit,r),on=pick(unlit,r),v=mask^(1<<off)^(1<<on);if(!masks.includes(v))masks.push(v);}
  const opts=shuffle(masks,r);
  return {kind:'memory',title:'Запомните расположение подсвеченных клеток.',subtitle:'Через несколько секунд узор исчезнет. Выберите его точную копию из четырёх вариантов.',memoryMask:mask,options:opts.map(m=>({svg:boardSVG(m,4,3,true)})),answer:opts.indexOf(mask),explanation:'Точное расположение выделенных клеток совпадает только с одним вариантом. Все остальные содержат переставленную клетку.',difficulty};
}
const GENERATORS={matrix:makeMatrix,numbers:makeNumeric,logic:makeLogic,spatial:makeSpatial,verbal:makeVerbal,attention:makeAttention,memory:makeMemory};

let profile=readStore('axiom_profile',{name:'Исследователь',theme:'dark'});
if(!profile||typeof profile!=='object')profile={name:'Исследователь',theme:'dark'};
let history=readStore('axiom_history',[]);if(!Array.isArray(history))history=[];
let route='home',session=null,lastResult=null,quizTimer=null,memoryTimer=null,memoryPhase='show',memoryRemaining=0,filter='all',toastTimer=null;
const main=document.getElementById('main'),modalLayer=document.getElementById('modal-layer');
const dateKey=()=>{const d=new Date();return [d.getFullYear(),String(d.getMonth()+1).padStart(2,'0'),String(d.getDate()).padStart(2,'0')].join('-');};
const getSummary=()=>{const solved=history.reduce((a,h)=>a+(h.total||0),0),correct=history.reduce((a,h)=>a+(h.correct||0),0);return {sessions:history.length,solved,correct,accuracy:solved?Math.round(100*correct/solved):0,best:history.length?Math.max(...history.map(h=>h.score||0)):0};};
const formatDate=iso=>{try{return new Date(iso).toLocaleDateString('ru-RU',{day:'2-digit',month:'short',year:'numeric'});}catch{return '—';}};
const formatDuration=seconds=>{const m=Math.floor(seconds/60),s=Math.floor(seconds%60);return `${m}:${String(s).padStart(2,'0')}`;};
function showToast(message){const el=document.getElementById('toast');if(toastTimer)clearTimeout(toastTimer);el.textContent=message;el.classList.add('visible');toastTimer=setTimeout(()=>el.classList.remove('visible'),2800);}
function updateChrome(){
  document.body.classList.toggle('theme-light',profile.theme==='light');
  document.querySelectorAll('[data-icon]').forEach(el=>{el.innerHTML=icon(el.dataset.icon==='sun'&&profile.theme==='light'?'moon':el.dataset.icon);});
  const name=(profile.name||'Исследователь').trim();document.getElementById('sidebar-username').textContent=name;
  document.getElementById('sidebar-avatar').textContent=name==='Исследователь'?'IQ':name.slice(0,2).toUpperCase();
  document.getElementById('copyright-year').textContent=new Date().getFullYear();
  document.querySelectorAll('.nav-link').forEach(el=>el.classList.toggle('active',el.dataset.route===route));
  const labels={home:'ОБЗОР',challenges:'ИСПЫТАНИЯ',library:'БИБЛИОТЕКА',stats:'СТАТИСТИКА',about:'О ЛАБОРАТОРИИ',quiz:'ПРОХОЖДЕНИЕ',result:'РЕЗУЛЬТАТ'};
  document.getElementById('breadcrumb-current').textContent=labels[route]||'ОБЗОР';
}
const categoryCard=c=>`<button class="category-card" data-tone="${c.tone}" data-action="start-category" data-category="${c.id}"><span class="category-icon">${icon(c.icon,24)}</span><span><h3>${c.name}</h3><p>${c.description}</p></span><span class="category-bottom"><span>${c.rating}</span>${icon('arrow',16)}</span></button>`;
const metric=(label,value,foot,ico)=>`<div class="metric"><div class="metric-header"><span>${label}</span><span class="metric-icon">${icon(ico,17)}</span></div><strong class="metric-value">${value}</strong><span class="metric-foot">${foot}</span></div>`;
const sectionHeader=(label,title,link=null)=>`<div class="section-heading"><div><span class="eyebrow">${label}</span><h2>${title}</h2></div>${link?`<button class="link-button" data-route="${link.route}">${link.text}${icon('arrow',15)}</button>`:''}</div>`;
function renderHome(){const s=getSummary();return `
  <div class="hero"><div class="hero-content"><span class="eyebrow">ИНТЕЛЛЕКТУАЛЬНАЯ ЛАБОРАТОРИЯ / 01</span><h1>Узнай, на что<br>способен твой <em>разум.</em></h1><p>Семь направлений мышления. Тысячи комбинаций задач. От короткой тренировки до серьёзных интеллектуальных испытаний.</p><div class="hero-cta"><button class="btn btn-primary" data-action="start" data-mode="challenge">Начать испытание ${icon('arrow',17)}</button><button class="btn btn-secondary" data-action="start" data-mode="training">Свободная тренировка</button></div></div><div class="hero-art" aria-hidden="true"><div class="orbit-ring"></div><div class="orbit-ring orbit-small"></div><div class="hero-matrix">${Array.from({length:9},(_,i)=>`<div class="tile">${i===8?'?':'<span></span>'}</div>`).join('')}</div><div class="art-chip">PATTERN / 09</div></div></div>
  <div class="metrics-grid">${metric('Пройдено тестов',s.sessions,'Всего завершённых испытаний','target')}${metric('Решено задач',s.solved,'Ваш личный опыт','brain')}${metric('Точность ответов',`${s.accuracy}<small>%</small>`,'По всей истории','chart')}${metric('Лучший результат',`${s.best}<small>%</small>`,'Максимум за тест','trophy')}</div>
  ${sectionHeader('07 НАПРАВЛЕНИЙ','Тренируй разные способности',{route:'library',text:'Вся библиотека'})}
  <div class="category-grid">${CATEGORIES.slice(0,6).map(categoryCard).join('')}</div>
  <div class="feature-banner"><div style="display:flex;gap:17px;align-items:center"><div class="feature-icon">${icon('memory',30)}</div><div><span class="eyebrow">ОТДЕЛЬНЫЙ ФОРМАТ</span><h3>Проверь зрительную память</h3><p>Запомните расположение клеток и восстановите узор после исчезновения.</p></div></div><button class="btn btn-secondary" data-action="start-category" data-category="memory">Попробовать ${icon('arrow',16)}</button></div>
  `;}
const modeCard=(id)=>{const m=MODES[id];return `<div class="mode-card ${m.color}"><div><div class="mode-top"><span class="mode-tag">${m.tag}</span><span class="mode-symbol">${icon(m.icon,24)}</span></div><h3>${m.name}</h3><p>${m.description}</p></div><div class="mode-bottom"><span class="mode-details">${m.count} ЗАДАНИЙ · ${m.minutes?m.minutes+' МИН':'БЕЗ ТАЙМЕРА'}</span><button class="btn btn-primary" data-action="start" data-mode="${id}">Начать ${icon('arrow',15)}</button></div></div>`;};
function renderChallenges(){const already=history.some(h=>h.mode==='daily'&&h.day===dateKey());return `<div class="page-heading"><span class="eyebrow">РЕЖИМЫ ИСПЫТАНИЙ</span><h1>Выбери свой вызов.</h1><p>От спокойной тренировки до интенсивной проверки логики. Выбирайте подходящий уровень нагрузки и следите за своим прогрессом.</p></div>
  <div class="daily-banner"><div class="daily-meta"><span class="daily-mark">${icon('calendar',25)}</span><div><h3>Ежедневный вызов</h3><p>14 заданий · 12 минут · Общий набор на ${escapeHtml(new Date().toLocaleDateString('ru-RU',{day:'numeric',month:'long'}))}${already?' · Вы уже проходили сегодня':''}</p></div></div><button class="btn btn-secondary" data-action="start" data-mode="daily">${already?'Пройти ещё раз':'Испытать себя'} ${icon('arrow',15)}</button></div>
  <div class="mode-grid">${['challenge','express','extreme','training'].map(modeCard).join('')}</div>`;}
function renderLibrary(){let cats=CATEGORIES.filter(c=>filter==='all'||filter===c.id);return `<div class="page-heading"><span class="eyebrow">БИБЛИОТЕКА</span><h1>Семь областей интеллекта.</h1><p>Выберите направление и отработайте навык на серии из 12 заданий. Каждая попытка создаёт новые комбинации.</p></div>
  <div class="filter-bar"><button class="filter-button ${filter==='all'?'selected':''}" data-action="filter" data-filter="all">Все направления</button>${CATEGORIES.map(c=>`<button class="filter-button ${filter===c.id?'selected':''}" data-action="filter" data-filter="${c.id}">${c.short}</button>`).join('')}</div>
  <div class="library-grid">${cats.map(c=>`<div class="library-card"><div class="category-icon">${icon(c.icon,26)}</div><div class="card-copy"><h3>${c.name}</h3><p>${c.description}</p></div><button class="btn btn-secondary" data-action="start-category" data-category="${c.id}">Начать ${icon('arrow',14)}</button></div>`).join('')}</div>
  <div class="info-strip"><strong>Как устроена библиотека?</strong> Задачи включают авторские шаблоны и алгоритмически создаваемые варианты. В математике, матрицах и пространственных заданиях условия генерируются заново, а верный ответ вычисляется автоматически.</div>`;}
function renderStats(){const s=getSummary(),summaryByCat=getCatStats(history);const bestCategory=CATEGORIES.map(c=>({...c,...summaryByCat[c.id]})).filter(c=>c.total>0).sort((a,b)=>b.accuracy-a.accuracy)[0];return `<div class="page-heading"><span class="eyebrow">АНАЛИТИКА ПРОГРЕССА</span><h1>Твой путь в цифрах.</h1><p>Все результаты сохраняются локально в браузере на этом устройстве. Не требуется регистрация или интернет.</p></div>
  <div class="metrics-grid">${metric('Всего испытаний',s.sessions,'Завершённых тестов','target')}${metric('Всего вопросов',s.solved,'С учётом пропущенных','brain')}${metric('Верных ответов',s.correct,'За всё время','check')}${metric('Точность',`${s.accuracy}<small>%</small>`,'Средняя по вопросам','chart')}</div>
  ${s.sessions?`<div class="stats-split"><div class="section-card"><h3>Точность по направлениям</h3>${barsHtml(summaryByCat)}</div><div class="section-card"><h3>Личный рекорд</h3><div class="stats-number">${s.best}%</div><p class="stats-caption">Лучший результат в одном испытании</p><div style="height:1px;background:var(--border);margin:25px 0"></div><h3>Сильное направление</h3><div class="stats-number" style="font-size:22px;letter-spacing:-.5px">${bestCategory?bestCategory.short:'—'}</div><p class="stats-caption">По точности полученных ответов</p></div></div>`:`<div class="empty-state" style="margin-top:19px">${icon('chart',43)}<h3>Пока нет результатов</h3><p>Пройди первое испытание — здесь появится статистика по всем направлениям.</p><button class="btn btn-primary" data-action="start" data-mode="express">Пройти первый тест ${icon('arrow',15)}</button></div>`}
  ${s.sessions?`<div class="section-card"><h3>История испытаний</h3><div class="history-scroll"><table class="history-table"><thead><tr><th>Дата</th><th>Испытание</th><th>Результат</th><th>Правильно</th><th>Время</th></tr></thead><tbody>${history.slice(0,25).map(h=>`<tr><td>${formatDate(h.date)}</td><td><strong>${escapeHtml(h.name)}</strong></td><td><strong>${h.score}%</strong></td><td>${h.correct}/${h.total}</td><td>${formatDuration(h.duration||0)}</td></tr>`).join('')}</tbody></table></div></div>`:''}
  <div class="feature-banner"><div><h3>Управление своими данными</h3><p>Можно сохранить всю статистику в JSON-файл или стереть локальную историю.</p></div><div style="display:flex;gap:10px;flex-wrap:wrap"><button class="btn btn-secondary" data-action="export">${icon('download',15)} Экспорт</button><button class="btn btn-danger" data-action="clear">${icon('trash',15)} Сбросить</button></div></div>`;}
function renderAbout(){return `<div class="page-heading"><span class="eyebrow">ПРИНЦИПЫ ЛАБОРАТОРИИ</span><h1>Умнее — с практикой.</h1><p>AXIOM IQ — независимый интерактивный тренажёр для любителей сложных задач, логики и исследования собственных когнитивных навыков.</p></div>
  <div class="about-layout"><div class="about-card"><h3>Что внутри?</h3><p>Платформа объединяет семь направлений: визуальные матрицы, числовые ряды, логику, пространственные преобразования, словесные аналогии, внимание и память. Часть вопросов берётся из проверенной библиотеки, часть создаётся генераторами математически определённых задач.</p><ul><li>Смешанные тесты, тренировки по темам, ежедневное испытание.</li><li>Проверка ответов, объяснения, режимы с таймером.</li><li>Локальная статистика и экспорт своих результатов.</li><li>Работает без сервера, аккаунта, базы данных и сторонних библиотек.</li></ul></div><div class="about-card"><h3>Честная оценка</h3><p><strong>Баллы на сайте — это процент верных ответов, а не стандартизированный IQ.</strong> Чтобы получить психометрически обоснованный показатель IQ, необходимы валидированные задания, нормирование по возрасту, контролируемые условия и статистическая калибровка.</p><p>Используйте AXIOM как развивающий инструмент и личный трекер прогресса, а не как клиническую или профессиональную диагностику.</p></div></div><div class="feature-banner"><div><span class="eyebrow">НАЧАТЬ</span><h3>Проверь себя прямо сейчас</h3><p>Первые десять вопросов — отличный способ почувствовать формат.</p></div><button class="btn btn-primary" data-action="start" data-mode="express">Экспресс-тест ${icon('arrow',15)}</button></div>`;}
function getCatStats(records){const s=Object.fromEntries(CATEGORIES.map(c=>[c.id,{total:0,correct:0,accuracy:0}]));for(const h of records)if(h.byCat)for(const [cat,v]of Object.entries(h.byCat)){if(s[cat]){s[cat].total+=Number(v.total||0);s[cat].correct+=Number(v.correct||0);}}for(const v of Object.values(s))v.accuracy=v.total?Math.round(v.correct/v.total*100):0;return s;}
function barsHtml(stats){return CATEGORIES.map(c=>{const s=stats[c.id]||{total:0,accuracy:0};return `<div class="bar-row"><span class="bar-label">${c.short}</span><div class="bar-track"><div class="bar-fill" style="width:${s.accuracy}%"></div></div><strong>${s.total?s.accuracy+'%':'—'}</strong></div>`;}).join('');}

function generateQuestions(modeId,catId){const mode=MODES[modeId],day=dateKey(),seed=modeId==='daily'?seedFromString('AXIOM-'+day):((Math.random()*2**32)>>>0),r=rngFactory(seed);
  let cats=[];if(catId){cats=Array(mode.count).fill(catId);}else{while(cats.length<mode.count)cats.push(...CATEGORIES.map(c=>c.id));cats=shuffle(cats.slice(0,mode.count),r);}
  const used=new Set();return cats.map((category,i)=>{let q;let tries=0;let signature;do{const diff=modeId==='extreme'?3+int(r,0,1):(i>=mode.count*.6?3:1+int(r,0,2));q=GENERATORS[category](r,diff);signature=category+'|'+q.title+'|'+q.subtitle+'|'+(q.visual||q.memoryMask||'');tries++;}while(used.has(signature)&&tries<120);used.add(signature);return {...q,category,id:`${seed}-${i}`,index:i};});}
function clearTimers(){if(quizTimer){clearInterval(quizTimer);quizTimer=null;}if(memoryTimer){clearInterval(memoryTimer);memoryTimer=null;}}
function startSession(modeId,category=null){if(!MODES[modeId])return;clearTimers();const mode=MODES[modeId],questions=generateQuestions(modeId,category);session={modeId,category,modeName:category?CAT_BY_ID[category].name:mode.name,questions,index:0,answers:[],currentAnswer:null,startTime:Date.now(),deadline:mode.minutes?Date.now()+mode.minutes*60000:null,day:dateKey()};memoryPhase='show';memoryRemaining=0;route='quiz';location.hash='quiz';render();if(session.deadline)quizTimer=setInterval(updateQuizClock,300);}
function updateQuizClock(){if(!session||!session.deadline)return;const ms=Math.max(0,session.deadline-Date.now()),el=document.getElementById('quiz-timer');if(el){el.textContent=formatDuration(Math.ceil(ms/1000));el.parentElement.classList.toggle('low',ms<60000);}if(ms<=0)finishSession('time');}
function beginMemory(){if(!session)return;const q=session.questions[session.index];if(q.kind!=='memory'||session.currentAnswer){memoryPhase='answer';return;}memoryPhase='show';memoryRemaining=q.difficulty>=3?6:5;if(memoryTimer)clearInterval(memoryTimer);memoryTimer=setInterval(()=>{memoryRemaining--;const el=document.getElementById('memory-count');if(el)el.textContent=String(Math.max(0,memoryRemaining));if(memoryRemaining<=0){clearInterval(memoryTimer);memoryTimer=null;memoryPhase='answer';renderQuizOnly();}},1000);}
function renderQuizOnly(){main.innerHTML=renderQuiz();updateQuizClock();}
function renderQuiz(){if(!session)return renderHome();const q=session.questions[session.index],m=MODES[session.modeId],answered=Boolean(session.currentAnswer),isMemShow=q.kind==='memory'&&memoryPhase==='show'&&!answered,progress=Math.round(session.index/session.questions.length*100);let optionsHtml='';
  if(!isMemShow){optionsHtml=`<div class="answers-grid">${q.options.map((o,i)=>{let state='';if(answered){state=i===q.answer?'correct':(i===session.currentAnswer.choice?'wrong':'dimmed');}return `<button class="answer ${state}" data-action="answer" data-index="${i}" ${answered?'disabled':''} aria-label="Вариант ${'ABCD'[i]}${o.text?' — '+escapeHtml(o.text):''}"><span class="answer-letter">${'ABCD'[i]}</span><span class="answer-content ${o.svg?'answer-visual':''}">${o.svg||escapeHtml(o.text)}</span>${answered&&i===q.answer?icon('check',18):''}</button>`;}).join('')}</div>`;}
  const feedback=answered?`<div class="feedback ${session.currentAnswer.correct?'':'wrong'}"><span class="feedback-icon">${icon(session.currentAnswer.correct?'check':'close',20)}</span><div><h3>${session.currentAnswer.correct?'Верное решение':'Разбор решения'}</h3><p>${escapeHtml(q.explanation)}</p></div></div>`:'';
  const visual=q.kind==='memory'?isMemShow?`<div class="visual-wrap memory-show"><div><div class="memory-status">Осталось <strong id="memory-count">${memoryRemaining}</strong> сек.</div><div class="memory-grid">${Array.from({length:12},(_,i)=>`<span class="memory-cell ${q.memoryMask&(1<<i)?'lit':''}">${i+1}</span>`).join('')}</div><div class="memory-caption">Запоминайте именно расположение подсвеченных клеток</div></div></div>`:`<div class="visual-wrap"><div style="font-size:12px;color:var(--muted);text-align:center">Узор скрыт. Выберите его точную копию ниже.</div></div>`:q.visual?`<div class="visual-wrap">${q.visual}</div>`:'';
  return `<div class="quiz-top"><div class="quiz-heading"><div class="mini-symbol">${icon(CAT_BY_ID[q.category].icon,23)}</div><div><h1>${escapeHtml(session.modeName)}</h1><p>${escapeHtml(CAT_BY_ID[q.category].name)} · Задание ${session.index+1} из ${session.questions.length}</p></div></div><div class="quiz-status">${session.deadline?`<div class="timer" aria-label="Время до завершения">${icon('clock',16)}<span id="quiz-timer">${formatDuration(Math.ceil((session.deadline-Date.now())/1000))}</span></div>`:''}<button class="btn btn-ghost" data-action="quit">${icon('close',15)} Выход</button></div></div>
    <div class="question-progress"><div class="progress-labels"><span>ПРОГРЕСС ИСПЫТАНИЯ</span><span><strong>${session.index+1}</strong> / ${session.questions.length}</span></div><div class="progress-track"><div class="progress-fill" style="width:${progress}%"></div></div></div>
    <div class="question-panel"><div class="question-meta"><span class="tag">${escapeHtml(CAT_BY_ID[q.category].short)}</span><span>УРОВЕНЬ ${q.difficulty>=3?'ПРОДВИНУТЫЙ':q.difficulty===2?'СРЕДНИЙ':'БАЗОВЫЙ'}</span>${q.kind==='memory'?'<span class="tag purple">ТЕСТ ПАМЯТИ</span>':''}</div>
      <h2 class="question-title">${escapeHtml(q.title)}</h2><p class="question-subtitle">${escapeHtml(q.subtitle||'Выберите один верный вариант ответа.')}</p>${visual}${optionsHtml}${feedback}
      <div class="question-actions"><span class="question-tip">${icon('shield',14)} ${answered?'Результат сохранится после завершения испытания':isMemShow?'Внимательно запомните рисунок':'Выберите один из четырёх вариантов'}</span>${answered?`<button class="btn btn-primary" data-action="next">${session.index===session.questions.length-1?'Завершить испытание':'Следующий вопрос'} ${icon('arrow',16)}</button>`:isMemShow?`<button class="btn btn-ghost" data-action="hide-memory">Готов ответить ${icon('arrow',15)}</button>`:`<button class="btn btn-ghost" data-action="skip">Пропустить ${icon('arrow',15)}</button>`}</div></div>`;}
function selectAnswer(i){if(!session||session.currentAnswer||memoryPhase==='show'&&session.questions[session.index].kind==='memory')return;const q=session.questions[session.index];if(!Number.isInteger(i)||i<0||i>=q.options.length)return;session.currentAnswer={choice:i,correct:i===q.answer};renderQuizOnly();}
function nextQuestion(skip=false){if(!session)return;const q=session.questions[session.index];if(!skip&&!session.currentAnswer)return;session.answers.push({category:q.category,correct:skip?false:session.currentAnswer.correct,choice:skip?-1:session.currentAnswer.choice,index:session.index});session.index++;session.currentAnswer=null;if(session.index>=session.questions.length){finishSession();return;}memoryPhase='show';memoryRemaining=0;renderQuizOnly();if(session.questions[session.index].kind==='memory'){beginMemory();renderQuizOnly();}}
function finishSession(reason='complete'){if(!session)return;clearTimers();if(session.currentAnswer){const q=session.questions[session.index];session.answers.push({category:q.category,correct:session.currentAnswer.correct,choice:session.currentAnswer.choice,index:session.index});session.currentAnswer=null;}while(session.answers.length<session.questions.length){const q=session.questions[session.answers.length];session.answers.push({category:q.category,correct:false,choice:-1,index:session.answers.length});}
  const correct=session.answers.filter(a=>a.correct).length,total=session.questions.length,score=Math.round(correct/total*100),duration=Math.max(0,Math.round((Date.now()-session.startTime)/1000));
  const byCat={};for(const a of session.answers){const c=byCat[a.category]||(byCat[a.category]={total:0,correct:0});c.total++;if(a.correct)c.correct++;}
  const record={id:`${Date.now()}-${Math.random().toString(36).slice(2,7)}`,date:new Date().toISOString(),day:session.day,mode:session.modeId,name:session.modeName,correct,total,score,duration,byCat,reason};history.unshift(record);history=history.slice(0,100);writeStore('axiom_history',history);
  lastResult={...record,questions:session.questions,answers:session.answers};session=null;route='result';location.hash='result';render();}
function renderResult(){if(!lastResult)return renderStats();const v=lastResult;let label=v.score>=90?'Впечатляющая точность':v.score>=70?'Отличная работа':v.score>=50?'Хорошая основа':'Есть пространство для роста';return `<div class="page-heading"><span class="eyebrow">ИСПЫТАНИЕ ЗАВЕРШЕНО</span><h1>Итоги исследования.</h1><p>${escapeHtml(v.name)} · ${formatDate(v.date)}</p></div>
  <div class="result-hero"><div class="result-label">ВАШ РЕЗУЛЬТАТ</div><div class="score-ring" style="--score-angle:${v.score}%"><div class="score-inner"><strong>${v.score}</strong><small>ПРОЦЕНТОВ</small></div></div><h2>${label}</h2><p>${v.reason==='time'?'Время испытания закончилось. Неотвеченные вопросы отмечены как пропущенные.':'Испытание завершено!'} Этот показатель отражает долю правильных ответов, а не психометрический IQ.</p><div class="result-actions"><button class="btn btn-primary" data-action="start" data-mode="${v.mode==='category'?'training':v.mode}">Пройти ещё раз ${icon('arrow',15)}</button><button class="btn btn-secondary" data-route="stats">Моя статистика</button></div></div>
  <div class="result-metrics">${metric('Верных ответов',v.correct,'Точно решённых','check')}${metric('Всего заданий',v.total,'В испытании','brain')}${metric('Время',formatDuration(v.duration),'На прохождение','clock')}</div>
  <div class="section-card"><h3>Результаты по направлениям</h3>${barsHtml(getCatStats([v]))}</div>
  <div class="section-card"><h3>Разбор заданий</h3><div class="review-list">${v.answers.map((a,i)=>{const q=v.questions[i];const chosen=a.choice>=0?q.options[a.choice]:null;const correct=q.options[q.answer];const short=o=>o?(o.text||'графический вариант'):'пропуск';return `<div class="review-item ${a.correct?'':'failed'}"><span class="review-symbol">${icon(a.correct?'check':'close',18)}</span><div><h4>${i+1}. ${escapeHtml(q.title)}</h4><p>${a.correct?'Верно':`Ваш ответ: ${escapeHtml(short(chosen))}. Правильный: ${escapeHtml(short(correct))}.`} ${escapeHtml(q.explanation)}</p></div><span>${CAT_BY_ID[q.category].short}</span></div>`;}).join('')}</div></div>`;}
function render(){updateChrome();const views={home:renderHome,challenges:renderChallenges,library:renderLibrary,stats:renderStats,about:renderAbout,quiz:renderQuiz,result:renderResult};main.innerHTML=(views[route]||renderHome)();window.scrollTo({top:0,behavior:'instant'});if(route==='quiz'&&session){if(session.questions[session.index].kind==='memory'&&memoryPhase==='show'&&!memoryTimer){beginMemory();renderQuizOnly();}updateQuizClock();}}
function navigate(next){if(session&&route==='quiz'&&next!=='quiz'){window.history.replaceState?.(null,'','#quiz');showQuitModal(next);return;}if(!['home','challenges','library','stats','about','result'].includes(next))next='home';if(next==='result'&&!lastResult)next='stats';route=next;location.hash=next;document.getElementById('sidebar').classList.remove('open');document.getElementById('sidebar-overlay').classList.remove('show');render();}
function showModal(content){modalLayer.innerHTML=`<div class="modal" role="dialog" aria-modal="true">${content}</div>`;modalLayer.classList.add('open');modalLayer.setAttribute('aria-hidden','false');}
function hideModal(){modalLayer.classList.remove('open');modalLayer.setAttribute('aria-hidden','true');modalLayer.innerHTML='';}
function showQuitModal(target='home'){showModal(`<div class="modal-top"><h2>Завершить досрочно?</h2><button class="icon-button" data-action="modal-close" aria-label="Закрыть">${icon('close',17)}</button></div><p>Текущий тест будет прерван. Незавершённая попытка не попадёт в статистику.</p><div class="modal-actions"><button class="btn btn-secondary" data-action="modal-close">Продолжить</button><button class="btn btn-danger" data-action="confirm-quit" data-target="${target}">Выйти без сохранения</button></div>`);}
function showProfile(){showModal(`<div class="modal-top"><h2>Мой профиль</h2><button class="icon-button" data-action="modal-close" aria-label="Закрыть">${icon('close',17)}</button></div><p>Имя используется только для подписи в интерфейсе. Все данные остаются на вашем устройстве.</p><form id="profile-form"><label class="form-label" for="profile-name">ИМЯ ИССЛЕДОВАТЕЛЯ</label><input id="profile-name" name="name" class="text-input" maxlength="30" required placeholder="Ваше имя" value="${escapeHtml(profile.name||'Исследователь')}" autocomplete="nickname"/><div class="modal-actions"><button class="btn btn-secondary" data-action="modal-close" type="button">Отмена</button><button class="btn btn-primary" type="submit">Сохранить ${icon('check',15)}</button></div></form>`);setTimeout(()=>document.getElementById('profile-name')?.focus(),0);}
function clearHistory(){if(!history.length){showToast('История уже пуста');return;}showModal(`<div class="modal-top"><h2>Стереть статистику?</h2><button class="icon-button" data-action="modal-close">${icon('close',17)}</button></div><p>Будет удалена вся локальная история (${history.length} испытаний). Это действие нельзя отменить. Перед очисткой можно экспортировать результаты.</p><div class="modal-actions"><button class="btn btn-secondary" data-action="modal-close">Отмена</button><button class="btn btn-danger" data-action="confirm-clear">Удалить навсегда</button></div>`);}
function exportHistory(){const data={app:'AXIOM IQ',version:'1.0',exportedAt:new Date().toISOString(),profile:{name:profile.name},history};const blob=new Blob([JSON.stringify(data,null,2)],{type:'application/json;charset=utf-8'});const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download=`axiom-iq-results-${dateKey()}.json`;document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1500);showToast('Статистика экспортирована в JSON');}

document.addEventListener('click',e=>{
  const button=e.target.closest('[data-action],[data-route]');if(!button)return;
  if(button.tagName==='A')e.preventDefault();
  if(button.dataset.route){navigate(button.dataset.route);return;}
  const a=button.dataset.action;
  if(a==='start')startSession(button.dataset.mode);
  else if(a==='start-category')startSession('category',button.dataset.category);
  else if(a==='answer')selectAnswer(Number(button.dataset.index));
  else if(a==='next')nextQuestion();
  else if(a==='skip')nextQuestion(true);
  else if(a==='hide-memory'){if(memoryTimer){clearInterval(memoryTimer);memoryTimer=null;}memoryPhase='answer';renderQuizOnly();}
  else if(a==='quit')showQuitModal();
  else if(a==='confirm-quit'){clearTimers();session=null;hideModal();navigate(button.dataset.target||'home');}
  else if(a==='filter'){filter=button.dataset.filter;render();}
  else if(a==='export')exportHistory();
  else if(a==='clear')clearHistory();
  else if(a==='confirm-clear'){history=[];writeStore('axiom_history',history);hideModal();render();showToast('История удалена');}
  else if(a==='modal-close')hideModal();
});
document.addEventListener('submit',e=>{if(e.target.id!=='profile-form')return;e.preventDefault();const value=(new FormData(e.target).get('name')||'').toString().trim().slice(0,30);profile.name=value||'Исследователь';writeStore('axiom_profile',profile);hideModal();updateChrome();showToast('Профиль сохранён');});
document.getElementById('theme-toggle').addEventListener('click',()=>{profile.theme=profile.theme==='light'?'dark':'light';writeStore('axiom_profile',profile);updateChrome();});
document.getElementById('profile-button').addEventListener('click',showProfile);
document.getElementById('menu-toggle').addEventListener('click',()=>{document.getElementById('sidebar').classList.toggle('open');document.getElementById('sidebar-overlay').classList.toggle('show');});
document.getElementById('sidebar-overlay').addEventListener('click',()=>{document.getElementById('sidebar').classList.remove('open');document.getElementById('sidebar-overlay').classList.remove('show');});
modalLayer.addEventListener('click',e=>{if(e.target===modalLayer)hideModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape'){if(modalLayer.classList.contains('open'))hideModal();else if(document.getElementById('sidebar').classList.contains('open')){document.getElementById('sidebar').classList.remove('open');document.getElementById('sidebar-overlay').classList.remove('show');}}});
window.addEventListener('hashchange',()=>{const next=location.hash.slice(1).split('?')[0];if(next===route)return;if(next==='quiz'&&!session){navigate('home');return;}if(next==='result'&&!lastResult){navigate('stats');return;}navigate(next);});
const initial=location.hash.replace('#','');if(['home','challenges','library','stats','about'].includes(initial))route=initial;
render();
})();
