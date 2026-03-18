/* ═══════════════════════════════════════════════════
   SCRIPT.JS — v4
   Новое: fullscreen-галерея / параллакс / взрыв частиц / сургучная печать
   ═══════════════════════════════════════════════════ */

/* ─────────────────────────────────────────
   ▼ ВСТАВЬ СВОИ ДАННЫЕ
───────────────────────────────────────── */
const BOT_TOKEN = "8649068293:AAGWOogyAQStZK6WUBua7KRzU40-imu_6TA";
const CHAT_ID   = "8500370370";

/* ─────────────────────────────────────────
   ▼ ТЕКСТ ПИСЬМА
───────────────────────────────────────── */
const LETTER_TEXT =
`Я долго думал как это сказать.

Мы оба знаем что что-то пошло не так.
Но я не хочу делать вид, что тебя нет.

Ты один из тех людей, которые
меняют что-то внутри — просто фактом
своего существования рядом.

Прости меня. Серьёзно.

Давай просто по-нормальному.`;

/* ─────────────────────────────────────────
   ▼ ГАЛЕРЕЯ — ФОТО И ПОДПИСИ
   src   — путь к файлу (photo1.jpg и т.д.)
   text  — текст который появится поверх
───────────────────────────────────────── */
const GALLERY = [
  {
    src:  "photo1.jpg",
    text: "С садика. Я даже не помню мир без тебя.",
  },
  {
    src:  "photo2.jpg",
    text: "Турники, улица — мы были королями двора.",
  },
  {
    src:  "photo3.jpg",
    text: "Дота до утра. Время тогда не существовало.",
  },
  {
    src:  "photo4.jpg",
    text: "Ночные прогулки. Таких разговоров больше ни с кем.",
  },
  {
    src:  "photo5.jpg",
    text: "Зал. Ты моя мотивация, бро.",
  },
  {
    src:  "photo6.jpg",
    text: "Это всё было настоящим. И я не хочу это терять.",
  },
];

/* ─────────────────────────────────────────
   ▼ КАРТА
───────────────────────────────────────── */
const MAP_POINTS = [
  { x: 320, y: 160, city: "СОТКА",      memo: "131 ШКОЛА ТУРНИКИ — ПРЯМ РАЗЬЁБ" },
  { x: 245, y: 130, city: "САДИК",      memo: "САДИК — ГДЕ МЫ НАЧАЛИ ДРУЖИТЬ" },
  { x: 560, y: 200, city: "ДОТА",       memo: "НОЧНАЯ ДОТА ЭТО ПРЯМ ЛЕГЕНДА" },
  { x: 420, y: 290, city: "МОТИВАЦИЯ", memo: "ЗАЛ — ТЫ МОЯ МОТИВАЦИЯ БРАТ" },
];

/* ─────────────────────────────────────────
   ▼ ПРЕЛОАДЕР
───────────────────────────────────────── */
const LOADER_HINTS = [
  "загружаю воспоминания...",
  "ищу нужные слова...",
  "вспоминаю...",
  "собираю мысли...",
  "почти готово...",
];

/* ══════════════════════════════════════════
   ПРЕЛОАДЕР
══════════════════════════════════════════ */
(function runPreloader() {
  const fill = document.getElementById('preFill');
  const hint = document.getElementById('preHint');
  const pre  = document.getElementById('preloader');
  let pct = 0, hi = 0;
  hint.textContent = LOADER_HINTS[0];
  const iv = setInterval(() => {
    pct += Math.random() * 4 + 1.5;
    if (pct > 100) pct = 100;
    fill.style.width = pct + '%';
    const newHi = Math.min(LOADER_HINTS.length - 1, Math.floor(pct / 20));
    if (newHi !== hi) {
      hi = newHi;
      hint.style.opacity = 0;
      setTimeout(() => { hint.textContent = LOADER_HINTS[hi]; hint.style.opacity = 1; }, 200);
    }
    if (pct >= 100) {
      clearInterval(iv);
      setTimeout(() => {
        pre.classList.add('fade');
        setTimeout(() => { pre.style.display = 'none'; showScreen('s1'); }, 850);
      }, 400);
    }
  }, 55);
})();

/* ══════════════════════════════════════════
   GRAIN
══════════════════════════════════════════ */
(function initGrain() {
  const c = document.getElementById('grain');
  const x = c.getContext('2d');
  function resize() { c.width = innerWidth; c.height = innerHeight; }
  resize(); addEventListener('resize', resize);
  let f = 0;
  function loop() {
    if (++f % 4 === 0) {
      const id = x.createImageData(c.width, c.height);
      const d = id.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = (Math.random() * 255) | 0;
        d[i] = d[i+1] = d[i+2] = v; d[i+3] = 255;
      }
      x.putImageData(id, 0, 0);
    }
    requestAnimationFrame(loop);
  }
  loop();
})();

/* ══════════════════════════════════════════
   PARTICLES (фоновые)
══════════════════════════════════════════ */
(function initParticles() {
  const c = document.getElementById('particles');
  const x = c.getContext('2d');
  let W = innerWidth, H = innerHeight;
  function resize() { W = c.width = innerWidth; H = c.height = innerHeight; }
  resize(); addEventListener('resize', resize);
  const pts = Array.from({ length: 75 }, () => ({
    x: Math.random() * W, y: Math.random() * H,
    r: Math.random() < .14 ? Math.random() * 1.6 + .7 : Math.random() * .85 + .2,
    vx: (Math.random() - .5) * .13, vy: -(Math.random() * .18 + .04),
    a: Math.random() * .35 + .05,
    hue: Math.random() < .6 ? '184,63,255' : '255,61,172',
  }));
  function draw() {
    x.clearRect(0, 0, W, H);
    for (const p of pts) {
      x.beginPath(); x.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      x.fillStyle = `rgba(${p.hue},${p.a})`; x.fill();
      p.x += p.vx; p.y += p.vy;
      if (p.y < -4) p.y = H + 4;
      if (p.x < -4) p.x = W + 4;
      if (p.x > W+4) p.x = -4;
    }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ══════════════════════════════════════════
   ПАРАЛЛАКС — фон двигается за мышью
══════════════════════════════════════════ */
(function initParallax() {
  const layer = document.getElementById('parallaxLayer');
  if (!layer) return;
  let tx = 0, ty = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => {
    // Смещение ±2% от центра
    tx = (e.clientX / innerWidth  - 0.5) * -2.5;
    ty = (e.clientY / innerHeight - 0.5) * -2.5;
  });
  function animPx() {
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;
    layer.style.transform = `translate(${cx}%, ${cy}%)`;
    requestAnimationFrame(animPx);
  }
  animPx();
})();

/* ══════════════════════════════════════════
   ВЗРЫВ ЧАСТИЦ (при YES)
══════════════════════════════════════════ */
function launchBurst() {
  const canvas = document.getElementById('burst');
  if (!canvas) return;
  canvas.style.display = 'block';
  canvas.width = innerWidth;
  canvas.height = innerHeight;
  const ctx = canvas.getContext('2d');

  const COLORS = ['#d8764f','#e8c48a','#8350b4','#c44dff','#ff3dac','#f5e6c8','#e84545'];
  const particles = Array.from({ length: 200 }, () => {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 14 + 4;
    return {
      x: innerWidth / 2, y: innerHeight / 2,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - Math.random() * 6,
      r: Math.random() * 5 + 2,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 1,
      gravity: 0.22 + Math.random() * 0.18,
      // форма: 0=круг, 1=прямоугольник
      shape: Math.random() < 0.5 ? 0 : 1,
      w: Math.random() * 8 + 3,
      h: Math.random() * 4 + 2,
      rot: Math.random() * Math.PI * 2,
      rotV: (Math.random() - 0.5) * 0.18,
    };
  });

  let alive = true;
  function draw() {
    if (!alive) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let allDead = true;
    for (const p of particles) {
      if (p.alpha <= 0) continue;
      allDead = false;
      p.x += p.vx; p.y += p.vy;
      p.vy += p.gravity;
      p.vx *= 0.98;
      p.alpha -= 0.018;
      p.rot += p.rotV;
      ctx.save();
      ctx.globalAlpha = Math.max(0, p.alpha);
      ctx.fillStyle = p.color;
      if (p.shape === 0) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fill();
      } else {
        ctx.translate(p.x, p.y); ctx.rotate(p.rot);
        ctx.fillRect(-p.w/2, -p.h/2, p.w, p.h);
      }
      ctx.restore();
    }
    if (allDead) {
      alive = false;
      canvas.style.display = 'none';
    } else {
      requestAnimationFrame(draw);
    }
  }
  draw();
}

/* ══════════════════════════════════════════
   КУРСОР
══════════════════════════════════════════ */
(function initCursor() {
  const cur = document.getElementById('cursor');
  const dot = document.getElementById('cursorDot');
  if (!cur || !dot) return;
  let mx = 0, my = 0, cx = 0, cy = 0;
  document.addEventListener('mousemove', e => {
    mx = e.clientX; my = e.clientY;
    dot.style.left = mx + 'px'; dot.style.top = my + 'px';
  });
  function animCursor() {
    cx += (mx - cx) * .12; cy += (my - cy) * .12;
    cur.style.left = cx + 'px'; cur.style.top = cy + 'px';
    requestAnimationFrame(animCursor);
  }
  animCursor();
  document.querySelectorAll('button,.tl-card,.map-pin').forEach(el => {
    el.addEventListener('mouseenter', () => { cur.style.width='52px'; cur.style.height='52px'; cur.style.borderColor='rgba(216,118,79,.8)' });
    el.addEventListener('mouseleave', () => { cur.style.width='34px'; cur.style.height='34px'; cur.style.borderColor='rgba(222,175,129,.35)' });
  });
})();

/* ══════════════════════════════════════════
   НАВИГАЦИЯ
══════════════════════════════════════════ */
let currentScreen = '';

function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => {
    s.classList.add('hidden'); s.classList.remove('visible');
  });
  const t = document.getElementById(id);
  if (!t) return;
  currentScreen = id;
  t.classList.remove('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => {
    t.classList.add('visible');
    onScreenEnter(id);
  }));
  updateDots(id);
}

function onScreenEnter(id) {
  const screen = document.getElementById(id);
  if (id === 's1') {
    startTypewriter("Слушай... Брат.", () => {
      animateBodyBlock('bodyBlock1', 0);
      setTimeout(() => showBtn(screen), 3200);
    });
  } else if (id === 's2') {
    animateTimeline();
    setTimeout(() => showBtn(screen), 2000);
  } else if (id === 's3') {
    buildMap();
    setTimeout(() => showBtn(screen), 1000);
  } else if (id === 's4') {
    animateBodyBlock('bodyBlock4', 0);
    setTimeout(() => showBtn(screen), 1600);
  } else if (id === 's5') {
    animFinal();
    startEasterTimer();
  }
}

document.querySelectorAll('.nxt').forEach(btn => {
  btn.addEventListener('click', () => {
    startAudio();
    // Кнопка галереи обрабатывается отдельно
    if (btn.id === 'btnStartGallery') { openGallery(); return; }
    showScreen(btn.dataset.to);
  });
});

function updateDots(id) {
  document.querySelectorAll('.pd').forEach(pd => {
    pd.classList.toggle('active', pd.dataset.screen === id);
  });
}
document.querySelectorAll('.pd').forEach(pd => {
  pd.addEventListener('click', () => {
    const order = ['s1','s2','s3','s4','s5'];
    const ci = order.indexOf(currentScreen);
    const ti = order.indexOf(pd.dataset.screen);
    if (ti <= ci) showScreen(pd.dataset.screen);
  });
});

/* ══════════════════════════════════════════
   TYPEWRITER
══════════════════════════════════════════ */
function startTypewriter(text, onDone) {
  const el = document.getElementById('heroLine');
  const cursor = document.getElementById('twCursor');
  el.textContent = ''; cursor.style.display = 'inline';
  let i = 0;
  function type() {
    if (i < text.length) {
      el.textContent += text[i++];
      setTimeout(type, 70 + Math.random() * 55);
    } else {
      setTimeout(() => { cursor.style.display = 'none'; onDone && onDone(); }, 600);
    }
  }
  setTimeout(type, 300);
}

function animateBodyBlock(blockId, startDelay) {
  const block = document.getElementById(blockId);
  if (!block) return;
  const lines = block.querySelectorAll('.bl');
  lines.forEach(l => l.classList.remove('show'));
  lines.forEach((l, i) => setTimeout(() => l.classList.add('show'), startDelay + i * 230));
}

function showBtn(screen) {
  const btn = screen.querySelector('.glow-btn');
  if (btn) btn.classList.add('show');
}

/* ══════════════════════════════════════════
   ТАЙМЛАЙН
══════════════════════════════════════════ */
function animateTimeline() {
  const items = document.querySelectorAll('.tl-item');
  items.forEach(item => item.classList.remove('show'));
  items.forEach((item, i) => setTimeout(() => item.classList.add('show'), 250 + i * 280));
}

/* ══════════════════════════════════════════
   КАРТА
══════════════════════════════════════════ */
function buildMap() {
  const g = document.getElementById('mapPoints');
  const tooltip = document.getElementById('mapTooltip');
  const ttCity = document.getElementById('ttCity');
  const ttMemo = document.getElementById('ttMemo');
  const ttClose = document.getElementById('ttClose');
  const mapSvg = document.getElementById('mapSvg');
  g.innerHTML = '';

  MAP_POINTS.forEach((p, i) => {
    const grp = document.createElementNS('http://www.w3.org/2000/svg','g');
    grp.setAttribute('class','map-pin'); grp.style.cursor = 'pointer'; grp.style.opacity = 0;
    const pulse = document.createElementNS('http://www.w3.org/2000/svg','circle');
    pulse.setAttribute('class','pin-pulse'); pulse.setAttribute('cx',p.x); pulse.setAttribute('cy',p.y); pulse.setAttribute('r','6');
    const dot = document.createElementNS('http://www.w3.org/2000/svg','circle');
    dot.setAttribute('cx',p.x); dot.setAttribute('cy',p.y); dot.setAttribute('r','6');
    grp.appendChild(pulse); grp.appendChild(dot); g.appendChild(grp);
    setTimeout(() => { grp.style.transition = 'opacity .5s ease'; grp.style.opacity = 1; }, 300 + i * 200);

    grp.addEventListener('click', () => {
      ttCity.textContent = p.city; ttMemo.textContent = p.memo;
      tooltip.classList.remove('hidden');
      const svgRect = mapSvg.getBoundingClientRect();
      const scaleX = svgRect.width/900; const scaleY = svgRect.height/500;
      let tx = p.x*scaleX + svgRect.left - tooltip.offsetWidth/2;
      let ty = p.y*scaleY + svgRect.top  - tooltip.offsetHeight - 16;
      const wrap = document.querySelector('.map-wrap'); const wr = wrap.getBoundingClientRect();
      tx = Math.max(wr.left+4, Math.min(tx, wr.right-224));
      if (ty < wr.top) ty = p.y*scaleY + svgRect.top + 16;
      tooltip.style.left = (tx-wr.left)+'px'; tooltip.style.top = (ty-wr.top)+'px';
    });
  });

  ttClose && ttClose.addEventListener('click', () => tooltip.classList.add('hidden'));
}

/* ══════════════════════════════════════════
   FULLSCREEN ГАЛЕРЕЯ
══════════════════════════════════════════ */
let galleryIndex = 0;
const gfsEl      = document.getElementById('galleryFs');
const gfsBg      = document.getElementById('gfsBg');
const gfsPhoto   = document.getElementById('gfsPhoto');
const gfsPhotoW  = document.getElementById('gfsPhotoWrap');
const gfsCaption = document.getElementById('gfsCaption');
const gfsText    = document.getElementById('gfsText');
const gfsIndexEl = document.getElementById('gfsIndex');
const gfsPrev    = document.getElementById('gfsPrev');
const gfsNext    = document.getElementById('gfsNext');
const gfsExit    = document.getElementById('gfsExit');
const gfsProg    = document.getElementById('gfsProgress');
const clickSnd   = document.getElementById('clickSnd');

// Строим точки-прогресс
function buildGalleryDots() {
  gfsProg.innerHTML = '';
  GALLERY.forEach((_, i) => {
    const d = document.createElement('span');
    d.className = 'gfs-dot' + (i === 0 ? ' active' : '');
    d.addEventListener('click', () => gotoSlide(i));
    gfsProg.appendChild(d);
  });
}

function gotoSlide(idx) {
  galleryIndex = Math.max(0, Math.min(idx, GALLERY.length - 1));
  const item = GALLERY[galleryIndex];

  // Скрыть текущее
  gfsPhoto.classList.remove('show');
  gfsCaption.classList.remove('show');

  setTimeout(() => {
    // Сменить
    gfsBg.style.backgroundImage = `url('${item.src}')`;
    gfsPhoto.src = item.src;
    gfsText.textContent = item.text;
    gfsIndexEl.textContent = String(galleryIndex + 1).padStart(2,'0') + ' / ' + String(GALLERY.length).padStart(2,'0');

    // Обновить точки
    document.querySelectorAll('.gfs-dot').forEach((d,i) => d.classList.toggle('active', i === galleryIndex));

    // Показать
    requestAnimationFrame(() => {
      gfsPhoto.classList.add('show');
      setTimeout(() => gfsCaption.classList.add('show'), 120);
    });
  }, 300);

  // Звук щелчка
  if (clickSnd) { clickSnd.currentTime = 0; clickSnd.play().catch(()=>{}); }

  // Стрелки
  gfsPrev.style.opacity = galleryIndex === 0 ? '.3' : '1';
  gfsNext.textContent = galleryIndex === GALLERY.length - 1 ? '→ дальше' : '→';
}

function openGallery() {
  buildGalleryDots();
  gfsEl.classList.remove('hidden');
  gfsEl.classList.add('visible');
  gotoSlide(0);
  document.body.style.overflow = 'hidden';
}

function closeGallery() {
  gfsEl.classList.remove('visible');
  gfsEl.classList.add('hidden');
  showScreen('s5');
}

gfsPrev && gfsPrev.addEventListener('click', () => { if (galleryIndex > 0) gotoSlide(galleryIndex - 1) });
gfsNext && gfsNext.addEventListener('click', () => {
  if (galleryIndex < GALLERY.length - 1) {
    gotoSlide(galleryIndex + 1);
  } else {
    closeGallery();
  }
});
gfsExit && gfsExit.addEventListener('click', closeGallery);

// Свайп на мобиле
(function initSwipe() {
  let startX = 0;
  gfsEl.addEventListener('touchstart', e => { startX = e.touches[0].clientX }, { passive:true });
  gfsEl.addEventListener('touchend',   e => {
    const dx = e.changedTouches[0].clientX - startX;
    if (Math.abs(dx) < 40) return;
    if (dx < 0) {
      if (galleryIndex < GALLERY.length - 1) gotoSlide(galleryIndex + 1);
      else closeGallery();
    } else {
      if (galleryIndex > 0) gotoSlide(galleryIndex - 1);
    }
  });
})();

// Клавиатура
document.addEventListener('keydown', e => {
  if (gfsEl.classList.contains('hidden')) return;
  if (e.key === 'ArrowRight' || e.key === ' ') {
    if (galleryIndex < GALLERY.length - 1) gotoSlide(galleryIndex + 1); else closeGallery();
  } else if (e.key === 'ArrowLeft') {
    if (galleryIndex > 0) gotoSlide(galleryIndex - 1);
  } else if (e.key === 'Escape') {
    closeGallery();
  }
});

/* ══════════════════════════════════════════
   ФИНАЛ
══════════════════════════════════════════ */
function animFinal() {
  const s5 = document.getElementById('s5');
  const els = s5.querySelectorAll('.section-eyebrow,.final-title,.final-sub,.final-btns');
  els.forEach((el,i) => {
    el.style.opacity = 0; el.style.transform = 'translateY(14px)';
    el.style.transition = `opacity .65s ease ${i*.2}s, transform .65s ease ${i*.2}s`;
    setTimeout(() => { el.style.opacity = 1; el.style.transform = 'translateY(0)'; }, 50 + i*200);
  });
}

let easterTimer = null;
function startEasterTimer() {
  clearTimeout(easterTimer);
  easterTimer = setTimeout(() => {
    const h = document.getElementById('easterHint');
    if (h) h.classList.remove('hidden');
  }, 8000);
}

/* ══════════════════════════════════════════
   ПАСХАЛКА
══════════════════════════════════════════ */
(function initEasterEgg() {
  const heroLine = document.getElementById('heroLine');
  const overlay  = document.getElementById('secretOverlay');
  const closeBtn = document.getElementById('secretClose');
  let clicks = 0, timer = null;

  if (heroLine) {
    heroLine.addEventListener('click', () => {
      clicks++; clearTimeout(timer);
      timer = setTimeout(() => clicks = 0, 700);
      if (clicks >= 3) { clicks = 0; openSecret(); }
    });
  }

  function openSecret() {
    overlay.classList.remove('hidden');
    requestAnimationFrame(() => requestAnimationFrame(() => overlay.classList.add('active')));
  }
  closeBtn && closeBtn.addEventListener('click', () => {
    overlay.classList.remove('active');
    setTimeout(() => overlay.classList.add('hidden'), 500);
  });
})();

/* ══════════════════════════════════════════
   ФИНАЛЬНЫЕ КНОПКИ
══════════════════════════════════════════ */
const btnYes       = document.getElementById('btnYes');
const btnNo        = document.getElementById('btnNo');
const envOverlay   = document.getElementById('envOverlay');
const quietOverlay = document.getElementById('quietOverlay');

function hideOtherBtn(btn) {
  if (!btn) return;
  btn.style.transition = 'opacity .4s ease, transform .4s ease';
  btn.style.opacity = '0';
  btn.style.pointerEvents = 'none';
  btn.style.transform = 'translateY(8px)';
  setTimeout(() => { btn.style.display = 'none'; }, 400);
}

btnYes && btnYes.addEventListener('click', () => {
  hideOtherBtn(btnNo);
  launchBurst();
  setTimeout(() => openEnvelope(), 600);
  fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
    method:'POST', headers:{'Content-Type':'application/json'},
    body:JSON.stringify({ chat_id:CHAT_ID, text:'Он нажал: СНОВА БРАТЬЯ 🤝' })
  }).catch(()=>{});
});

btnNo && btnNo.addEventListener('click', () => {
  hideOtherBtn(btnYes);
  quietOverlay.classList.remove('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => quietOverlay.classList.add('active')));
});
document.getElementById('quietClose') && document.getElementById('quietClose').addEventListener('click', () => {
  quietOverlay.classList.remove('active');
  setTimeout(() => quietOverlay.classList.add('hidden'), 700);
});

/* ══════════════════════════════════════════
   СУРГУЧНАЯ ПЕЧАТЬ + КОНВЕРТ
══════════════════════════════════════════ */
function openEnvelope() {
  envOverlay.classList.remove('hidden');
  requestAnimationFrame(() => requestAnimationFrame(() => envOverlay.classList.add('active')));

  // Убедиться что видна именно печать
  const waxScreen = document.getElementById('waxScreen');
  const envScene  = document.getElementById('envScene');
  waxScreen.classList.remove('breaking');
  waxScreen.style.display = 'flex';
  envScene.classList.add('hidden'); envScene.classList.remove('show-it');
  document.getElementById('envLetter').classList.remove('visible');
  document.getElementById('envClose').classList.remove('show');
  document.getElementById('letterBody').textContent = '';
  document.getElementById('envFlap').classList.remove('open');
  document.getElementById('envelope').classList.remove('fly-away');
  // Сброс формы ответа
  const _reply   = document.getElementById('letterReply');
  const _ta      = document.getElementById('replyTextarea');
  const _status  = document.getElementById('replyStatus');
  const _sendBtn = document.getElementById('replySend');
  const _lbl     = document.querySelector('.reply-label');
  if (_reply)   { _reply.classList.add('hidden'); _reply.classList.remove('show'); }
  if (_ta)      { _ta.value = ''; _ta.style.display = ''; }
  if (_status)  { _status.classList.add('hidden'); _status.classList.remove('show'); _status.textContent = ''; }
  if (_sendBtn) { _sendBtn.disabled = false; _sendBtn.textContent = 'отправить →'; _sendBtn.style.display = ''; }
  if (_lbl)     { _lbl.style.display = ''; }
}

// Клик по сургучной печати
const waxSeal   = document.getElementById('waxSeal');
const waxCracks = document.getElementById('waxCracks');
const waxScreen = document.getElementById('waxScreen');
const envScene  = document.getElementById('envScene');
let waxBroken = false;

waxSeal && waxSeal.addEventListener('click', () => {
  if (waxBroken) return;
  waxBroken = true;

  // 1. Показываем трещины
  waxCracks.classList.remove('hidden');

  // 2. Печать трясётся и рассыпается
  waxSeal.style.transition = 'transform .08s ease';
  let shakes = 0;
  const shakeIv = setInterval(() => {
    waxSeal.style.transform = `rotate(${(Math.random()-.5)*8}deg) scale(${1 - shakes*.04})`;
    if (++shakes >= 6) {
      clearInterval(shakeIv);
      // 3. Экран печати исчезает
      waxScreen.classList.add('breaking');
      setTimeout(() => {
        waxScreen.style.display = 'none';
        waxBroken = false; // сброс для повторного открытия
        // 4. Показываем конверт
        envScene.classList.remove('hidden');
        envScene.classList.add('show-it');
        startConvertAnim();
      }, 500);
    }
  }, 80);
});

function startConvertAnim() {
  const flap    = document.getElementById('envFlap');
  const envelope= document.getElementById('envelope');
  const letter  = document.getElementById('envLetter');
  const body    = document.getElementById('letterBody');
  const close   = document.getElementById('envClose');

  setTimeout(() => flap.classList.add('open'), 800);
  setTimeout(() => envelope.classList.add('fly-away'), 1700);
  setTimeout(() => letter.classList.add('visible'), 2100);
  setTimeout(() => {
    typewriterLetter(body, LETTER_TEXT, 30, () => {
      close.classList.add('show');
      // Показываем форму ответа после того как письмо допечаталось
      showReplyForm();
    });
  }, 2500);
}

function typewriterLetter(el, text, speed, onDone) {
  el.textContent = ''; let i = 0;
  function type() {
    if (i < text.length) { el.textContent += text[i++]; setTimeout(type, speed + Math.random()*20); }
    else onDone && onDone();
  }
  type();
}

document.getElementById('envClose') && document.getElementById('envClose').addEventListener('click', () => {
  const overlay = document.getElementById('envOverlay');
  const letter  = document.getElementById('envLetter');
  overlay.classList.remove('active');
  letter.classList.remove('visible');
  setTimeout(() => overlay.classList.add('hidden'), 700);
});

/* ══════════════════════════════════════════
   АУДИО
══════════════════════════════════════════ */
const audio    = document.getElementById('bgMusic');
const muteBtn  = document.getElementById('muteBtn');
const muteIcon = document.getElementById('muteIcon');
audio.volume = 0.18;
let audioStarted = false, muted = false;
function startAudio() {
  if (audioStarted) return; audioStarted = true;
  audio.play().catch(()=>{});
}
muteBtn && muteBtn.addEventListener('click', () => {
  muted = !muted; audio.muted = muted;
  muteIcon.textContent = muted ? '✕' : '♪';
});


/* ══════════════════════════════════════════
   ФОРМА ОТВЕТА В ПИСЬМЕ
══════════════════════════════════════════ */
function showReplyForm() {
  const reply = document.getElementById('letterReply');
  if (!reply) return;
  reply.classList.remove('hidden');
  // Небольшая задержка чтобы transition сработал
  requestAnimationFrame(() => requestAnimationFrame(() => reply.classList.add('show')));

  // Прокручиваем письмо вниз чтобы форма была видна
  const letter = document.getElementById('envLetter');
  if (letter) setTimeout(() => {
    letter.scrollTo({ top: letter.scrollHeight, behavior: 'smooth' });
  }, 400);
}

(function initReplyForm() {
  const sendBtn  = document.getElementById('replySend');
  const textarea = document.getElementById('replyTextarea');
  const status   = document.getElementById('replyStatus');
  if (!sendBtn || !textarea || !status) return;

  sendBtn.addEventListener('click', async () => {
    const text = textarea.value.trim();
    if (!text) {
      // Лёгкое покачивание если пусто
      textarea.style.transition = 'border-color .1s';
      textarea.style.borderColor = 'rgba(180,60,40,.5)';
      setTimeout(() => textarea.style.borderColor = '', 600);
      return;
    }

    sendBtn.disabled = true;
    sendBtn.textContent = 'отправляю...';

    try {
      await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chat_id: CHAT_ID,
          // Текст который придёт тебе в бота
          text: `✉️ Он ответил на письмо:\n\n"${text}"`
        })
      });

      // Успех
      sendBtn.style.display = 'none';
      textarea.style.display = 'none';
      document.querySelector('.reply-label').style.display = 'none';
      status.classList.remove('hidden');
      status.classList.add('show');
      // Меняй текст подтверждения здесь ↓
      status.textContent = 'отправлено. я прочитаю.';

    } catch (e) {
      sendBtn.disabled = false;
      sendBtn.textContent = 'отправить →';
      status.classList.remove('hidden');
      status.classList.add('show');
      status.textContent = 'что-то пошло не так, попробуй ещё раз';
      setTimeout(() => {
        status.classList.remove('show');
        status.classList.add('hidden');
      }, 3000);
    }
  });

  // Отправка по Ctrl+Enter / Cmd+Enter
  textarea.addEventListener('keydown', e => {
    if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
      e.preventDefault();
      sendBtn.click();
    }
  });
})();
