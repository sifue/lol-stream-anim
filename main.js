/**
 * main.js - オーバーレイ UI の制御
 *
 * 担当:
 *   - 時計の更新 (秒ごと)
 *   - チームカードのローテーション
 *   - BGM情報の音符アニメーション
 *   - LIVE バッジ / パーティクル演出
 */

// ---- 初期化 ----
document.addEventListener('DOMContentLoaded', () => {
  applyConfig();
  initClock();
  initTeamDisplay();
  initBgmAnimation();
  initParticles();
  initLaneIcons();
});

// ---- CONFIG を DOM に反映 ----
function applyConfig() {
  document.getElementById('tournament-name').textContent     = CONFIG.tournament.name;
  document.getElementById('tournament-schedule').textContent = CONFIG.tournament.schedule;
  document.getElementById('main-message').textContent        = CONFIG.tournament.mainMessage;
  document.getElementById('bgm-label').textContent           = CONFIG.bgm.label;
  document.getElementById('bgm-artist').textContent          = CONFIG.bgm.artist;
  document.getElementById('bgm-title').textContent           = CONFIG.bgm.title;
}

// ---- 時計 ----
function initClock() {
  updateClock();
  setInterval(updateClock, 1000);
}

function updateClock() {
  const now = new Date();
  const Y  = now.getFullYear();
  const Mo = String(now.getMonth() + 1).padStart(2, '0');
  const D  = String(now.getDate()).padStart(2, '0');
  const H  = String(now.getHours()).padStart(2, '0');
  const Mi = String(now.getMinutes()).padStart(2, '0');
  const S  = String(now.getSeconds()).padStart(2, '0');

  document.getElementById('date-display').textContent = `${Y}.${Mo}.${D}`;
  document.getElementById('time-h').textContent  = H;
  document.getElementById('time-m').textContent  = Mi;
  document.getElementById('time-s').textContent  = S;

  // コロンの点滅は CSS アニメーションで対応
}

// ---- チームカードのローテーション ----
let currentTeamIndex = 0;
let teamRotationTimer = null;
let isTransitioning = false;

function initTeamDisplay() {
  buildTeamIndicators();
  renderTeamCard(0, 'enter');
  scheduleNextTeam();
}

function buildTeamIndicators() {
  const container = document.getElementById('team-indicators');
  container.innerHTML = '';
  CONFIG.teams.forEach((_, i) => {
    const dot = document.createElement('span');
    dot.className = 'team-dot' + (i === 0 ? ' active' : '');
    dot.addEventListener('click', () => jumpToTeam(i));
    container.appendChild(dot);
  });
}

function jumpToTeam(index) {
  if (isTransitioning || index === currentTeamIndex) return;
  clearTimeout(teamRotationTimer);
  transitionToTeam(index);
}

function scheduleNextTeam() {
  teamRotationTimer = setTimeout(() => {
    const nextIndex = (currentTeamIndex + 1) % CONFIG.teams.length;
    transitionToTeam(nextIndex);
  }, CONFIG.display.teamDisplayDuration);
}

function transitionToTeam(nextIndex) {
  if (isTransitioning) return;
  isTransitioning = true;

  const card = document.getElementById('team-card');
  if (card) {
    card.classList.add('exit');
    setTimeout(() => {
      renderTeamCard(nextIndex, 'enter');
      currentTeamIndex = nextIndex;
      updateTeamIndicators();
      isTransitioning = false;
      scheduleNextTeam();
    }, CONFIG.display.teamTransitionDuration);
  }
}

function renderTeamCard(index, animClass) {
  const team = CONFIG.teams[index];
  const container = document.getElementById('team-card-container');

  const card = document.createElement('div');
  card.id = 'team-card';
  card.className = 'team-card ' + animClass;
  card.style.setProperty('--team-color', team.color);
  card.style.setProperty('--team-glow', team.glowColor);

  // ヘッダー
  const header = document.createElement('div');
  header.className = 'team-card-header';
  header.innerHTML = `
    <span class="team-emblem">${team.emblem}</span>
    <span class="team-name">${team.name}</span>
    <span class="team-count">${team.players.length}名</span>
  `;
  card.appendChild(header);

  // 区切り線
  const divider = document.createElement('div');
  divider.className = 'team-divider';
  card.appendChild(divider);

  // プレイヤーリスト
  const playerList = document.createElement('div');
  playerList.className = 'player-list';
  team.players.forEach((pl, i) => {
    const row = document.createElement('div');
    row.className = 'player-row';
    row.style.animationDelay = `${i * 80}ms`;
    row.innerHTML = `
      <span class="lane-badge lane-${pl.lane.toLowerCase()}">${pl.lane}</span>
      <span class="summoner-name">${pl.summoner}</span>
    `;
    playerList.appendChild(row);
  });
  card.appendChild(playerList);

  // 既存カードを置き換え
  container.innerHTML = '';
  container.appendChild(card);

  // 次フレームで enter クラスを付与してアニメ開始
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      card.classList.add('visible');
    });
  });
}

function updateTeamIndicators() {
  document.querySelectorAll('.team-dot').forEach((dot, i) => {
    dot.classList.toggle('active', i === currentTeamIndex);
  });
}

// ---- BGM 音符アニメーション ----
function initBgmAnimation() {
  const notes = ['♩', '♪', '♫', '♬'];
  const container = document.getElementById('bgm-notes');

  function spawnNote() {
    const note = document.createElement('span');
    note.className = 'music-note';
    note.textContent = notes[Math.floor(Math.random() * notes.length)];
    note.style.left = `${Math.random() * 60}px`;
    note.style.animationDuration = `${2.0 + Math.random() * 1.5}s`;
    container.appendChild(note);
    note.addEventListener('animationend', () => note.remove());
  }

  // 初回
  setTimeout(spawnNote, 500);
  setInterval(spawnNote, 1800);
}

// ---- BGM タイトルのスクロールアニメーション（長い場合） ----
// (CSS の marquee 的な動作は CSS animation で対応)

// ---- 背景パーティクル (小さな光の粒、HTMLレイヤー) ----
function initParticles() {
  const canvas = document.getElementById('particle-canvas');
  const ctx = canvas.getContext('2d');
  canvas.width  = 1920;
  canvas.height = 1080;

  const particles = [];
  const COUNT = 40;

  for (let i = 0; i < COUNT; i++) {
    particles.push(newParticle(true));
  }

  function newParticle(randomY) {
    return {
      x:    Math.random() * 1920,
      y:    randomY ? Math.random() * 1080 : 1080 + 10,
      vy:   -(0.15 + Math.random() * 0.35),
      vx:   (Math.random() - 0.5) * 0.2,
      size: 0.8 + Math.random() * 1.6,
      alpha: 0.0,
      maxAlpha: 0.3 + Math.random() * 0.5,
      fadeIn: true,
      life: 0,
      maxLife: 300 + Math.floor(Math.random() * 400)
    };
  }

  function loop() {
    ctx.clearRect(0, 0, 1920, 1080);
    for (let i = 0; i < particles.length; i++) {
      let pt = particles[i];
      pt.x += pt.vx;
      pt.y += pt.vy;
      pt.life++;

      // フェード
      if (pt.life < 60)       pt.alpha = pt.maxAlpha * (pt.life / 60);
      else if (pt.life > pt.maxLife - 60) pt.alpha = pt.maxAlpha * ((pt.maxLife - pt.life) / 60);
      else                    pt.alpha = pt.maxAlpha;

      if (pt.life >= pt.maxLife || pt.y < -10) {
        particles[i] = newParticle(false);
        continue;
      }

      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(180,210,255,${pt.alpha.toFixed(3)})`;
      ctx.fill();
    }
    requestAnimationFrame(loop);
  }
  loop();
}

// ---- レーンアイコン設定 ----
// レーンバッジの色はCSSで定義済み
function initLaneIcons() {
  // 必要に応じて動的にアイコンを変更
}
