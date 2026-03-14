/**
 * LoL 配信待機画面 設定ファイル
 * OBSの「カスタムJavaScript」入力欄でこのオブジェクトを上書きすることで設定変更可能
 *
 * 使用方法:
 *   OBSのブラウザソース設定 → 「カスタムJavaScript」に以下のように入力:
 *   CONFIG.tournament.name = "新しい大会名";
 *   CONFIG.bgm.title = "曲名";
 */
const CONFIG = {
  // 大会情報
  tournament: {
    name: "Nexus Cup 交流大会",
    schedule: "19:00より",
    mainMessage: "配信開始までしばらくお待ちください"
  },

  // BGM情報
  bgm: {
    label: "Inst.音源",
    artist: "騒音のない世界",
    title: "きらめくウィークエンド"
  },

  // チーム情報
  teams: [
    {
      name: "デマーシア",
      color: "#4A8FD4",
      glowColor: "rgba(74,143,212,0.4)",
      emblem: "⚔",
      players: [
        { lane: "TOP", summoner: "IkuraTubun#Ikura" },
        { lane: "JG",  summoner: "yasei#2693" },
        { lane: "MID", summoner: "android#ボット" },
        { lane: "ADC", summoner: "rito#2374" },
        { lane: "SUP", summoner: "tanoshii#7549" }
      ]
    },
    {
      name: "ノクサス",
      color: "#C0392B",
      glowColor: "rgba(192,57,43,0.4)",
      emblem: "🗡",
      players: [
        { lane: "TOP", summoner: "tabaru#Jax" },
        { lane: "JG",  summoner: "umineko#004" },
        { lane: "MID", summoner: "ラーメン二郎成増店#ザゲザゲ" },
        { lane: "ADC", summoner: "isseyrockwell#7256" },
        { lane: "SUP", summoner: "ハルオッティ#869" }
      ]
    },
    {
      name: "アイオニア",
      color: "#A855F7",
      glowColor: "rgba(168,85,247,0.4)",
      emblem: "✿",
      players: [
        { lane: "TOP", summoner: "銀河打者#ベクター穹" },
        { lane: "JG",  summoner: "kyanbera#65913" },
        { lane: "MID", summoner: "7nyqn#1115" },
        { lane: "ADC", summoner: "Altoron#Alt" },
        { lane: "SUP", summoner: "naruneco#5909" }
      ]
    },
    {
      name: "フレヨルド",
      color: "#38BDF8",
      glowColor: "rgba(56,189,248,0.4)",
      emblem: "❄",
      players: [
        { lane: "TOP", summoner: "dodon#5296" },
        { lane: "JG",  summoner: "MEMENT0#nihil" },
        { lane: "MID", summoner: "たまご抜きたまごサンド#ブルベ冬" },
        { lane: "ADC", summoner: "TKSK008#3041" },
        { lane: "SUP", summoner: "かれん#elu08" }
      ]
    },
    {
      name: "ピルトーヴァー",
      color: "#34D399",
      glowColor: "rgba(52,211,153,0.4)",
      emblem: "⚡",
      players: [
        { lane: "TOP", summoner: "akkili0909#ななもり" },
        { lane: "JG",  summoner: "MakiZushi#7058" },
        { lane: "MID", summoner: "Ore0#0031" },
        { lane: "ADC", summoner: "chanbethe8east#1412" },
        { lane: "SUP", summoner: "SITOSEI#INK" }
      ]
    }
  ],

  // 表示設定
  display: {
    teamDisplayDuration: 8000,     // 各チームの表示時間 (ミリ秒)
    teamTransitionDuration: 700,   // チーム切り替えアニメーション時間 (ミリ秒)
    bgScenarioDuration: 60000      // 背景シナリオループ時間 (ミリ秒)
  }
};
