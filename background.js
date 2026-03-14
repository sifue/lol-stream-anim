/**
 * background.js - 背景アニメーション (p5.js)
 *
 * 60秒シナリオ:
 *   0-15s  : 静かな星空、星がゆっくり瞬く
 *   15-30s : 流れ星が増える、星がやや明るくなる
 *   30-45s : 星雲の光が広がる、オーロラ的な光の揺らめき
 *   45-60s : 静かに戻る、次のループへ
 */

const bgSketch = function (p) {
  const W = 1920;
  const H = 1080;
  const STAR_COUNT = 280;
  const SCENARIO_MS = 60000;

  let stars = [];
  let shootingStars = [];
  let nebulaGfx;

  // ---- セットアップ ----
  p.setup = function () {
    let cnv = p.createCanvas(W, H);
    cnv.parent('bg-canvas-container');
    cnv.style('display', 'block');
    p.colorMode(p.RGB, 255);
    p.noSmooth(); // パフォーマンス向上

    initStars();
    nebulaGfx = buildNebulaGraphics();
  };

  // ---- メイン描画ループ ----
  p.draw = function () {
    let t = (p.millis() % SCENARIO_MS) / SCENARIO_MS; // 0.0〜1.0
    let sc = getScenario(t);

    // 背景色
    p.background(4, 6, 18);

    // 星雲
    let nebulaA = calcNebulaAlpha(sc);
    p.tint(255, nebulaA);
    p.image(nebulaGfx, 0, 0);
    p.noTint();

    // オーロラ (Phase 2のみ)
    if (sc.phase === 2) {
      drawAurora(p, sc.progress);
    }

    // 流れ星
    updateShootingStars(p, sc);

    // 通常の星
    drawStars(p, sc);

    // 下部グラデーションオーバーレイ（UIが見やすくなるよう底を暗く）
    let ctx = p.drawingContext;
    let grad = ctx.createLinearGradient(0, H * 0.55, 0, H);
    grad.addColorStop(0, 'rgba(4,6,18,0)');
    grad.addColorStop(1, 'rgba(4,6,18,0.85)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, H * 0.55, W, H * 0.45);

    // 上部グラデーション（UIの時計周りを少し暗く）
    let gradTop = ctx.createLinearGradient(0, 0, 0, H * 0.18);
    gradTop.addColorStop(0, 'rgba(4,6,18,0.5)');
    gradTop.addColorStop(1, 'rgba(4,6,18,0)');
    ctx.fillStyle = gradTop;
    ctx.fillRect(0, 0, W, H * 0.18);
  };

  // ---- 星の初期化 ----
  function initStars() {
    stars = [];
    for (let i = 0; i < STAR_COUNT; i++) {
      // 輝度の高い大きめの星を少数混ぜる
      let isBright = p.random() < 0.08;
      stars.push({
        x: p.random(W),
        y: p.random(H * 0.9), // 下部は暗いので星なし
        size: isBright ? p.random(1.8, 3.0) : p.random(0.4, 1.6),
        base: p.random(140, 255),
        speed: p.random(0.4, 2.2),
        phase: p.random(p.TWO_PI),
        r: p.random(200, 255),
        g: p.random(210, 255),
        b: p.random(230, 255),
        bright: isBright
      });
    }
  }

  // ---- 星雲グラフィックスを構築 ----
  function buildNebulaGraphics() {
    let g = p.createGraphics(W, H);
    g.noStroke();
    g.colorMode(p.RGB, 255);

    const blobs = [
      { x: 0.15, y: 0.25, rx: 420, ry: 280, col: [70,  0,  110] },
      { x: 0.72, y: 0.18, rx: 380, ry: 240, col: [0,   35, 110] },
      { x: 0.50, y: 0.50, rx: 520, ry: 320, col: [0,   55,  90] },
      { x: 0.88, y: 0.62, rx: 300, ry: 200, col: [50,   0,  90] },
      { x: 0.30, y: 0.70, rx: 350, ry: 220, col: [0,   80,  60] }
    ];

    for (let b of blobs) {
      let cx = b.x * W;
      let cy = b.y * H;
      for (let r = Math.max(b.rx, b.ry); r > 0; r -= 12) {
        let ratio = r / Math.max(b.rx, b.ry);
        let a = p.map(ratio, 0, 1, 55, 0);
        g.fill(b.col[0], b.col[1], b.col[2], a);
        g.ellipse(cx, cy, b.rx * 2 * (1 - ratio * 0.3), b.ry * 2 * (1 - ratio * 0.3));
      }
    }
    return g;
  }

  // ---- シナリオフェーズ取得 ----
  function getScenario(t) {
    if (t < 0.25)       return { phase: 0, progress: t / 0.25 };
    else if (t < 0.50)  return { phase: 1, progress: (t - 0.25) / 0.25 };
    else if (t < 0.75)  return { phase: 2, progress: (t - 0.50) / 0.25 };
    else                return { phase: 3, progress: (t - 0.75) / 0.25 };
  }

  // ---- 星雲アルファ値 ----
  function calcNebulaAlpha(sc) {
    switch (sc.phase) {
      case 0: return 45;
      case 1: return 45 + 35 * sc.progress;
      case 2: return 80 + 25 * Math.sin(sc.progress * Math.PI);
      case 3: return 80 - 35 * sc.progress;
    }
    return 45;
  }

  // ---- 通常の星を描画 ----
  function drawStars(p, sc) {
    let time = p.millis() * 0.001;
    let brightMult = (sc.phase === 1) ? (1.0 + 0.25 * sc.progress) : 1.0;

    p.noStroke();
    for (let s of stars) {
      let tw = Math.sin(time * s.speed + s.phase);
      let bri = Math.min(255, s.base * (0.65 + 0.35 * tw) * brightMult);

      // 大きい星はグロー効果
      if (s.bright) {
        p.fill(s.r, s.g, s.b, bri * 0.12);
        p.ellipse(s.x, s.y, s.size * 6, s.size * 6);
        p.fill(s.r, s.g, s.b, bri * 0.28);
        p.ellipse(s.x, s.y, s.size * 3, s.size * 3);
      }
      p.fill(s.r, s.g, s.b, bri);
      p.ellipse(s.x, s.y, s.size, s.size);
    }
  }

  // ---- 流れ星の更新・描画 ----
  function updateShootingStars(p, sc) {
    // 生成 (Phase 1 で多く、Phase 2 で少し)
    let spawnRate = 0;
    if (sc.phase === 1) spawnRate = 0.007 + 0.008 * sc.progress;
    else if (sc.phase === 2) spawnRate = 0.003;

    if (spawnRate > 0 && p.random() < spawnRate && shootingStars.length < 4) {
      let angle = p.random(0.15, 0.45); // ラジアン
      let speed = p.random(16, 28);
      shootingStars.push({
        x: p.random(W * 0.1, W * 0.9),
        y: p.random(H * 0.05, H * 0.45),
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        len: p.random(80, 220),
        life: 1.0,
        decay: p.random(0.012, 0.025)
      });
    }

    // 描画・更新
    for (let i = shootingStars.length - 1; i >= 0; i--) {
      let s = shootingStars[i];
      s.x += s.vx;
      s.y += s.vy;
      s.life -= s.decay;

      if (s.life <= 0 || s.x > W + 50 || s.y > H + 50) {
        shootingStars.splice(i, 1);
        continue;
      }

      let dist = Math.sqrt(s.vx * s.vx + s.vy * s.vy);
      let nx = s.vx / dist;
      let ny = s.vy / dist;
      let tl = s.len * s.life;

      // トレイル (グラデーション)
      let ctx = p.drawingContext;
      let grad = ctx.createLinearGradient(
        s.x, s.y,
        s.x - nx * tl, s.y - ny * tl
      );
      grad.addColorStop(0, `rgba(255,255,255,${(0.9 * s.life).toFixed(2)})`);
      grad.addColorStop(1, 'rgba(255,255,255,0)');
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - nx * tl, s.y - ny * tl);
      ctx.stroke();

      // 先端の輝き
      p.noStroke();
      p.fill(255, 255, 255, 220 * s.life);
      p.ellipse(s.x, s.y, 3.5, 3.5);
    }
    p.noStroke();
  }

  // ---- オーロラ描画 ----
  function drawAurora(p, progress) {
    let time = p.millis() * 0.0004;
    let maxAlpha = 22 * Math.sin(progress * Math.PI);

    const layers = [
      { col: [30, 180,  90], yBase: H * 0.22, amp: 70, freq: 0.0025 },
      { col: [20,  90, 200], yBase: H * 0.30, amp: 55, freq: 0.0032 },
      { col: [140, 30, 200], yBase: H * 0.38, amp: 50, freq: 0.0028 }
    ];

    let ctx = p.drawingContext;
    for (let l of layers) {
      ctx.beginPath();
      ctx.moveTo(0, H);
      for (let x = 0; x <= W; x += 15) {
        let y = l.yBase
          + Math.sin(x * l.freq + time) * l.amp
          + Math.sin(x * l.freq * 2.3 + time * 1.7) * (l.amp * 0.4);
        ctx.lineTo(x, y);
      }
      ctx.lineTo(W, H);
      ctx.closePath();
      ctx.fillStyle = `rgba(${l.col[0]},${l.col[1]},${l.col[2]},${(maxAlpha / 255).toFixed(3)})`;
      ctx.fill();
    }
  }
};

// p5インスタンスの生成
new p5(bgSketch);
