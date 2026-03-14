# LoL 配信待機画面

League of Legends 大会向けの OBS 配信待機画面です。
フルHD (1920×1080) に最適化されています。

## 画面構成

| 要素 | 位置 | 内容 |
|------|------|------|
| 時計 | 左上 | 年月日 + 時分秒 (アニメーション付き) |
| LIVE バッジ | 上部中央 | 点滅する LIVE 表示 |
| メインメッセージ | 中央 | 「配信開始までしばらくお待ちください」など |
| 大会情報 | 中央 | 大会名 + 開始時刻 |
| チームカード | 中央下部 | 5チームをローテーション表示 |
| BGM情報 | 右下 | 楽曲情報 + 音符アニメーション |
| 背景 | 全面 | 60秒シナリオの宇宙/星空アニメーション |

### 背景シナリオ (60秒ループ)

| 時間 | 演出 |
|------|------|
| 0〜15秒 | 静かな星空、星がゆっくり瞬く |
| 15〜30秒 | 流れ星が増える、星が明るくなる |
| 30〜45秒 | 星雲の光が広がり、オーロラが揺らめく |
| 45〜60秒 | 静かに戻り、次のループへ |

## ファイル構成

```
lol-stream-anim/
├── index.html      メインHTML (OBSで開くファイル)
├── config.js       設定ファイル (大会情報・チーム情報など)
├── background.js   背景アニメーション (p5.js)
├── main.js         UIロジック (時計・チームカード等)
├── style.css       スタイルシート
└── README.md       このファイル
```

## OBS への導入手順

### 1. ファイルの配置

このフォルダごとローカルの任意の場所に保存します。
例: `C:\obs-overlays\lol-stream-anim\`

### 2. OBS のブラウザソース設定

1. OBS を起動し、シーンにソースを追加
2. **「ブラウザ」** を選択
3. 設定を以下のように入力:

| 項目 | 値 |
|------|-----|
| URL | `file:///C:/obs-overlays/lol-stream-anim/index.html` (実際のパスに変更) |
| 幅 | `1920` |
| 高さ | `1080` |
| FPS | `60` |
| カスタムCSS | (空欄でOK) |

### 3. インターネット接続について

フォントと p5.js のライブラリは CDN から読み込むため、
**OBS を開く際はインターネット接続が必要**です。

オフラインで使用する場合は、以下のファイルをローカルに保存して
`index.html` 内のURLを変更してください:
- `https://fonts.googleapis.com/...` → ローカルフォント
- `https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.9.0/p5.min.js` → `./lib/p5.min.js`

## 設定の変更方法

### 方法 A: config.js を直接編集 (推奨)

`config.js` をテキストエディタで開き、値を変更してください。

```javascript
const CONFIG = {
  tournament: {
    name: "新しい大会名",        // 大会名
    schedule: "20:00より",       // 開始時刻
    mainMessage: "待機中です"    // メインメッセージ
  },
  bgm: {
    label: "BGM",
    artist: "アーティスト名",
    title: "曲名"
  },
  // ...
};
```

### 方法 B: OBS のカスタムJavaScript で上書き

OBS ブラウザソースの **「カスタムJavaScript」** 欄に入力:

```javascript
// ページ読み込み後に設定を上書き
window.addEventListener('load', () => {
  CONFIG.tournament.name = "Spring Cup 2026";
  CONFIG.tournament.schedule = "20:00より";
  CONFIG.bgm.title = "新しい曲名";
});
```

### チーム情報の変更

`config.js` の `teams` 配列を編集します:

```javascript
teams: [
  {
    name: "チーム名",
    color: "#4A8FD4",       // チームカラー (16進数カラーコード)
    glowColor: "rgba(74,143,212,0.4)", // グロー色 (RGB + 透明度)
    emblem: "⚔",            // エンブレム文字/絵文字
    players: [
      { lane: "TOP", summoner: "サモナーネーム#タグ" },
      { lane: "JG",  summoner: "サモナーネーム#タグ" },
      { lane: "MID", summoner: "サモナーネーム#タグ" },
      { lane: "ADC", summoner: "サモナーネーム#タグ" },
      { lane: "SUP", summoner: "サモナーネーム#タグ" }
    ]
  },
  // 最大5チームまで (それ以上も動作しますがカード切替時間が長くなります)
]
```

### 表示タイミングの変更

```javascript
display: {
  teamDisplayDuration: 8000,    // 各チームの表示時間 (ミリ秒) デフォルト: 8秒
  teamTransitionDuration: 700,  // 切り替えアニメーション時間 (ミリ秒)
  bgScenarioDuration: 60000     // 背景シナリオループ時間 (ミリ秒)
}
```

## 使用ライブラリ

| ライブラリ | バージョン | 用途 |
|-----------|-----------|------|
| [p5.js](https://p5js.org/) | 1.9.0 | 背景アニメーション |
| [Cinzel](https://fonts.google.com/specimen/Cinzel) | - | 英字フォント |
| [Noto Sans JP](https://fonts.google.com/noto/specimen/Noto+Sans+JP) | - | 日本語フォント |

## 動作環境

- OBS Studio 28.0 以上 (Chromium ベースのブラウザソース)
- 解像度: 1920×1080 (フルHD)
- インターネット接続必須 (CDN からフォント・ライブラリを読み込む)

## トラブルシューティング

**背景が真っ暗で星が表示されない**
→ インターネット接続を確認してください (p5.js CDN の読み込み失敗)

**フォントが崩れる**
→ インターネット接続を確認してください (Google Fonts CDN)

**チームカードが表示されない**
→ ブラウザソースの「キャッシュを削除」をクリックして再読み込み

**文字が小さい/大きい**
→ OBS のブラウザソースの幅/高さが 1920×1080 になっているか確認
