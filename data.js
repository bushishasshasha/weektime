// Theme, copy, sample data, and easter-egg text kept separate from runtime logic.
const sampleText = `**周一**
- \`8:30\` 起床
- \`8:30 - 9:00\` 洗漱 + 早间护肤 + 早餐
- \`9:00 - 9:30\` 韩语背诵：40音/词汇
- \`9:30 - 9:45\` 论文速读 1 篇
- \`9:45 - 12:00\` 自由学习/个人任务
- \`12:00 - 13:30\` 午饭 + 休息
- \`13:30 - 15:30\` 游戏
- \`15:30 - 16:00\` 休息/准备运动
- \`16:00 - 17:00\` 健身：练胸肩
- \`17:00 - 18:30\` 洗澡 + 晚饭
- \`18:30 - 20:00\` 韩语上课学习
- \`20:00 - 21:00\` 游戏/放松
- \`21:00 - 22:30\` 放松/整理
- \`22:30 - 22:45\` 晚间护肤
- \`22:45 - 23:30\` 睡前放松
- \`23:30\` 睡觉

**周二**
- \`8:30\` 起床
- \`8:30 - 9:20\` 跑步：轻松跑 25-35分钟 / 3-5公里 + 拉伸
- \`9:20 - 10:00\` 洗澡 + 早间护肤 + 早餐
- \`10:00 - 10:30\` 韩语背诵：40音/词汇
- \`10:30 - 10:45\` 论文速读 1 篇
- \`10:45 - 12:00\` 自由学习/个人任务
- \`12:00 - 13:30\` 午饭 + 休息
- \`13:30 - 15:00\` 韩语上课学习
- \`15:00 - 17:00\` 游戏
- \`17:00 - 18:00\` 晚饭 + 准备/出发上班
- \`18:00 - 22:20\` 上班相关时间
- \`22:20 - 22:55\` 回家/洗漱
- \`22:55 - 23:10\` 晚间护肤
- \`23:10 - 23:40\` 轻松娱乐
- \`23:40\` 睡觉

**周三**
- \`8:30\` 起床
- \`8:30 - 9:00\` 洗漱 + 早间护肤 + 早餐
- \`9:00 - 9:25\` 韩语背诵：词汇/40音
- \`9:25 - 9:40\` 论文速读 1 篇
- \`9:40 - 11:40\` 游戏
- \`11:40 - 12:30\` 午饭
- \`12:30 - 13:00\` 去实验室/准备
- \`13:00 - 17:30\` 实验室学习研究生内容
- \`17:30 - 18:00\` 简单吃饭/出发上班
- \`18:00 - 22:20\` 上班相关时间
- \`22:20 - 22:55\` 回家/洗漱
- \`22:55 - 23:10\` 晚间护肤
- \`23:10 - 23:40\` 轻松娱乐
- \`23:40\` 睡觉

**周四**
- \`8:30\` 起床
- \`8:30 - 9:00\` 洗漱 + 早间护肤 + 早餐
- \`9:00 - 9:25\` 韩语背诵：词汇/短句
- \`9:25 - 9:40\` 论文速读 1 篇
- \`9:40 - 11:40\` 游戏
- \`11:40 - 12:30\` 午饭
- \`12:30 - 13:00\` 去实验室/准备
- \`13:00 - 17:30\` 实验室学习研究生内容
- \`17:30 - 18:00\` 简单吃饭/出发上班
- \`18:00 - 22:20\` 上班相关时间
- \`22:20 - 22:55\` 回家/洗漱
- \`22:55 - 23:10\` 晚间护肤
- \`23:10 - 23:40\` 轻松娱乐
- \`23:40\` 睡觉

**周五**
- \`8:30\` 起床
- \`8:30 - 9:00\` 洗漱 + 早间护肤 + 早餐
- \`9:00 - 9:25\` 韩语背诵：词汇维持
- \`9:25 - 9:40\` 论文速读 1 篇
- \`9:40 - 11:40\` 游戏
- \`11:40 - 12:30\` 午饭
- \`12:30 - 13:00\` 去实验室/准备
- \`13:00 - 17:30\` 实验室学习研究生内容
- \`17:30 - 18:00\` 简单吃饭/出发上班
- \`18:00 - 23:00\` 上班相关时间
- \`23:00 - 23:35\` 回家/洗漱
- \`23:35 - 23:50\` 晚间护肤
- \`23:50 - 00:30\` 轻松娱乐
- \`00:30\` 睡觉

**周六**
- \`9:30\` 起床
- \`9:30 - 10:00\` 洗漱 + 早间护肤 + 早餐
- \`10:00 - 10:30\` 韩语背诵：40音 + 本周词汇
- \`10:30 - 11:30\` 健身：背部 + 手臂
- \`11:30 - 12:00\` 洗澡/整理
- \`12:00 - 12:15\` 论文速读 1 篇
- \`12:15 - 14:00\` 午饭 + 休息
- \`14:00 - 15:30\` 韩语上课学习/整理课堂笔记
- \`15:30 - 17:30\` 游戏
- \`17:30 - 20:00\` 晚饭/出门/社交
- \`20:00 - 22:30\` 游戏/娱乐
- \`22:30 - 22:45\` 晚间护肤
- \`22:45 - 23:30\` 睡前放松
- \`23:30\` 睡觉

**周日**
- \`9:30\` 起床
- \`9:30 - 10:00\` 洗漱 + 早间护肤 + 早餐
- \`10:00 - 10:25\` 韩语背诵：复盘本周词汇
- \`10:25 - 10:40\` 论文速读 1 篇
- \`10:40 - 12:40\` 游戏
- \`12:40 - 14:00\` 午饭 + 休息
- \`14:00 - 15:00\` 下周计划/轻整理
- \`15:00 - 16:30\` 自由时间/出门/生活整理
- \`16:30 - 17:40\` 跑步：稍长跑 40-55分钟 / 5-8公里 + 拉伸
- \`17:40 - 18:20\` 洗澡 + 护肤补水
- \`18:20 - 20:00\` 晚饭 + 放松
- \`20:00 - 22:00\` 游戏/娱乐
- \`22:00 - 22:15\` 晚间护肤
- \`22:15 - 23:30\` 睡前放松
- \`23:30\` 睡觉`;

const dayOrder = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const uncategorizedLabel = "无类别";
const commonCategories = [
  { label: uncategorizedLabel, className: "uncategorized", colors: ["#f4f1eb", "#d8d0c3"], keywords: null },
  { label: "游戏", className: "game", colors: ["#eee8f6", "#e7e0f2"], keywords: /游戏|娱乐/ },
  { label: "韩语", className: "korean", colors: ["#fbeddc", "#f8e7d2"], keywords: /韩语|40音|词汇|背诵/ },
  { label: "运动", className: "fitness", colors: ["#eef2df", "#e6ead4"], keywords: /健身|跑步|拉伸|运动|胸肩|背部|手臂/ },
  { label: "论文", className: "paper", colors: ["#e9f1fb", "#dce8f6"], keywords: /论文/ },
  { label: "实验室", className: "lab", colors: ["#e8f5ed", "#dceee4"], keywords: /实验室|研究生/ },
  { label: "上班", className: "work", colors: ["#f7e5d9", "#f3dccd"], keywords: /上班|工作/ },
  { label: "护肤/洗漱", className: "care", colors: ["#fae7e8", "#f6dfe0"], keywords: /护肤|洗漱|洗澡/ },
  { label: "学习", className: "study", colors: ["#edf7f5", "#e4f1ef"], keywords: /学习|任务|计划|整理课堂/ },
  { label: "生活", className: "rest", colors: ["#f1eee7", "#ece7dc"], keywords: null },
];
const appThemes = [
  {
    id: "default",
    name: "默认手账",
    description: "温暖纸张、低饱和色块，适合长期看计划。",
    colors: ["#fffaf0", "#2f6f73", "#c65338"],
    badge: {
      label: "默认手账 · Weekly Planner",
      image: "./icon.svg",
    },
    metaColor: "#2f6f73",
  },
  {
    id: "snow-lotus",
    name: "东雪莲·雪莲舞台",
    description: "雪蓝、粉白、轻舞台光感；点击右上角预览图可配置网页/表格背景。",
    colors: ["#f6fbff", "#68a8f7", "#ff8ec8"],
    image: "./assets/dongxuelian/table-backgrounds/blue-collage.jpg",
    badge: {
      label: "东雪莲主题 · Azuma Seren",
      image: "./assets/dongxuelian/table-backgrounds/blue-collage.jpg",
    },
    configurableBackgrounds: true,
    metaColor: "#68a8f7",
  },
  {
    id: "ace-taffy",
    name: "Taffy·粉色游戏屋",
    description: "粉色糖果、电子游戏、兔子和泡芙感；点击右上角预览图可配置背景。",
    colors: ["#fff3fb", "#df4f9d", "#54bed7"],
    image: "./assets/taffy/page-backgrounds/115570927_p0.png",
    badge: {
      label: "Taffy 主题 · Ace Taffy",
      image: "./assets/taffy/page-backgrounds/115570927_p0.png",
    },
    configurableBackgrounds: true,
    metaColor: "#df4f9d",
  },
  {
    id: "diana-jiaran",
    name: "嘉然·草莓小恶魔",
    description: "粉红草莓、嘉心糖、A-SOUL 舞台和小恶魔偶像感；点击右上角预览图可配置背景。",
    colors: ["#fff2f3", "#df5c74", "#f2b74c"],
    image: "./assets/jiaran/page-backgrounds/strawberry-diana.png",
    badge: {
      label: "嘉然主题 · Diana",
      image: "./assets/jiaran/page-backgrounds/strawberry-diana.png",
    },
    configurableBackgrounds: true,
    metaColor: "#df5c74",
  },
];
const snowLotusPageBackgroundOptions = [
  {
    id: "blue-city-garden",
    name: "蓝城花园",
    image: "./assets/dongxuelian/page-backgrounds/blue-city-garden.jpg",
  },
  {
    id: "pale-lotus-garden",
    name: "浅色莲庭",
    image: "./assets/dongxuelian/page-backgrounds/pale-lotus-garden.jpg",
  },
  {
    id: "blossom-profile",
    name: "花枝侧影",
    image: "./assets/dongxuelian/page-backgrounds/blossom-profile.jpg",
  },
  {
    id: "sunset-birds",
    name: "落日晚鸟",
    image: "./assets/dongxuelian/page-backgrounds/sunset-birds.jpg",
  },
  {
    id: "listener-desk",
    name: "耳机桌前",
    image: "./assets/dongxuelian/page-backgrounds/listener-desk.jpg",
  },
  {
    id: "throne-stage",
    name: "蓝白王座",
    image: "./assets/dongxuelian/page-backgrounds/throne-stage.jpg",
  },
];
const snowLotusTableBackgroundOptions = [
  {
    id: "rainy-umbrella",
    name: "雨夜伞下",
    image: "./assets/dongxuelian/table-backgrounds/rainy-umbrella.jpg",
    tone: "dark",
  },
  {
    id: "hourglass-garden",
    name: "沙漏花园",
    image: "./assets/dongxuelian/table-backgrounds/hourglass-garden.jpg",
    tone: "light",
  },
  {
    id: "blue-collage",
    name: "蓝色拼贴",
    image: "./assets/dongxuelian/table-backgrounds/blue-collage.jpg",
    tone: "light",
  },
  {
    id: "chibi-pattern",
    name: "小莲纹理",
    image: "./assets/dongxuelian/table-backgrounds/chibi-pattern.jpg",
    tone: "light",
  },
];
const defaultSnowLotusBackgrounds = {
  page: "blue-city-garden",
  table: "rainy-umbrella",
  pageOpacity: 46,
  tableOpacity: 82,
  taskOpacity: 38,
  panelOpacity: 100,
};
const aceTaffyPageBackgroundOptions = [
  {
    id: "taffy-pink-room",
    name: "粉色游戏屋",
    image: "./assets/taffy/page-backgrounds/115570927_p0.png",
  },
  {
    id: "taffy-puff-party",
    name: "泡芙派对",
    image: "./assets/taffy/page-backgrounds/110762787_p0.jpg",
  },
  {
    id: "taffy-bunny-pop",
    name: "兔兔电波",
    image: "./assets/taffy/page-backgrounds/96972053_p0.jpg",
  },
  {
    id: "taffy-square-sugar",
    name: "方糖塔菲",
    image: "./assets/taffy/page-backgrounds/131274076_p0.png",
  },
];
const aceTaffyTableBackgroundOptions = [
  {
    id: "taffy-pink-room-table",
    name: "粉色游戏桌",
    image: "./assets/taffy/table-backgrounds/115570927_p0.png",
    tone: "light",
  },
  {
    id: "taffy-puff-party-table",
    name: "泡芙表格",
    image: "./assets/taffy/table-backgrounds/110762787_p0.jpg",
    tone: "light",
  },
  {
    id: "taffy-bunny-pop-table",
    name: "兔兔表格",
    image: "./assets/taffy/table-backgrounds/96972053_p0.jpg",
    tone: "light",
  },
  {
    id: "taffy-square-sugar-table",
    name: "方糖表格",
    image: "./assets/taffy/table-backgrounds/131274076_p0.png",
    tone: "light",
  },
];
const defaultAceTaffyBackgrounds = {
  page: "taffy-pink-room",
  table: "taffy-pink-room-table",
  pageOpacity: 34,
  tableOpacity: 74,
  taskOpacity: 34,
  panelOpacity: 100,
};
const dianaJiaranPageBackgroundOptions = [
  {
    id: "jiaran-strawberry",
    name: "草莓小恶魔",
    image: "./assets/jiaran/page-backgrounds/strawberry-diana.png",
  },
  {
    id: "jiaran-sunset-car",
    name: "落日车窗",
    image: "./assets/jiaran/page-backgrounds/sunset-car.png",
  },
  {
    id: "jiaran-poolside",
    name: "池畔晴光",
    image: "./assets/jiaran/page-backgrounds/poolside-portrait.jpg",
  },
];
const dianaJiaranTableBackgroundOptions = [
  {
    id: "jiaran-friday-drum-table",
    name: "周五鼓锣",
    image: "./assets/jiaran/table-backgrounds/friday-drum.jpg",
    tone: "dark",
    fit: "100% 100%",
  },
  {
    id: "jiaran-deadline-table",
    name: "死期将至",
    image: "./assets/jiaran/table-backgrounds/deadline-grave.jpg",
    tone: "dark",
    fit: "100% 100%",
  },
  {
    id: "jiaran-half-life-table",
    name: "命剩一半",
    image: "./assets/jiaran/table-backgrounds/half-life.jpg",
    tone: "dark",
    fit: "100% 100%",
  },
  {
    id: "jiaran-overtime-table",
    name: "续命上班",
    image: "./assets/jiaran/table-backgrounds/overtime-flames.jpg",
    tone: "dark",
    fit: "100% 100%",
  },
  {
    id: "jiaran-head-seven-table",
    name: "我的头七",
    image: "./assets/jiaran/table-backgrounds/head-seven.jpg",
    tone: "light",
    fit: "100% 100%",
  },
  {
    id: "jiaran-big-fish-table",
    name: "大鱼大肉",
    image: "./assets/jiaran/table-backgrounds/big-fish-meat.jpg",
    tone: "light",
    fit: "100% 100%",
  },
  {
    id: "jiaran-meteor-table",
    name: "重见天日",
    image: "./assets/jiaran/table-backgrounds/meteor-goodbye.jpg",
    tone: "dark",
    fit: "100% 100%",
  },
  {
    id: "jiaran-new-year-table",
    name: "新年祈愿",
    image: "./assets/jiaran/table-backgrounds/new-year-chibi.jpg",
    tone: "light",
    fit: "100% 100%",
  },
  {
    id: "jiaran-birthday-card-table",
    name: "粉色生日",
    image: "./assets/jiaran/table-backgrounds/pink-birthday-card.jpeg",
    tone: "light",
    fit: "100% 100%",
  },
  {
    id: "jiaran-spotted-dog-table",
    name: "斑点咖啡",
    image: "./assets/jiaran/table-backgrounds/spotted-dog-cafe.jpg",
    tone: "dark",
    fit: "100% 100%",
  },
];
const defaultDianaJiaranBackgrounds = {
  page: "jiaran-strawberry",
  table: "jiaran-friday-drum-table",
  pageOpacity: 38,
  tableOpacity: 70,
  taskOpacity: 36,
  panelOpacity: 100,
};
const themePacks = {
  default: {
    effectTones: {
      complete: [523.25, 659.25],
      undo: [392, 329.63],
    },
    easterEggs: {
      complete: {
        default: [
          "完成一格，今天少欠自己一笔。",
          "这项搞定，待办清单安静了一秒。",
          "任务已完成，拖延症扣一分。",
          "盖章成功，这格别再诈尸了。",
        ],
      },
      dayClear: [
        "今日全清，待办清单被你摁住了。",
        "今天的任务都收好了，可以合法躺一下。",
      ],
      weekClear: [
        "一周全清，计划表今天没话说。",
        "整周任务完成，这波可以写进战报。",
      ],
      rare: [
        "稀有彩蛋：效率突然上线，装作很常见。",
        "低概率好运触发，这格被顺手端走。",
      ],
      undo: ["撤回完成，没事，它先复活三分钟。", "完成章先收回，这格还有点不服。"],
    },
  },
  "snow-lotus": {
    backgrounds: {
      pageOptions: snowLotusPageBackgroundOptions,
      tableOptions: snowLotusTableBackgroundOptions,
      defaults: defaultSnowLotusBackgrounds,
    },
    categoryPalette: {
      uncategorized: ["#f2f5fb", "#ccd6e6"],
      game: ["#eef0f8", "#b8c1d8"],
      korean: ["#f7edf1", "#d9a7bb"],
      fitness: ["#edf6f1", "#a7cdbb"],
      paper: ["#edf4fa", "#a9c4dd"],
      lab: ["#eaf4f5", "#9fc6ce"],
      work: ["#f7f0eb", "#d4b49e"],
      care: ["#f8eef2", "#d8a4b8"],
      study: ["#edf5f6", "#a9c9d0"],
      rest: ["#f3f3f0", "#cbc8bd"],
    },
    exportColors: {
      paper: "#f6fbff",
      panel: "#ffffff",
      line: "#bdd6f4",
      header: "#e8f4ff",
      muted: "#677190",
      ink: "#203154",
    },
    effectTones: {
      complete: [587.33, 783.99],
      undo: [440, 349.23],
    },
    easterEggs: {
      complete: {
        default: [
          "莲莲 0 帧起手：这格直接拿下。",
          "好运莲莲？不，是任务爆杀。",
          "莲莲查房：这格没活过三秒。",
          "这格被莲莲鉴定为可以抬走。",
          "别急，莲莲已经替你急完了。",
          "莲宝锐评：这任务纯属自己把自己送走。",
          "莲莲公主驾到，拖延症先跪下再说。",
          "这格被莲莲一句话打到闭麦。",
        ],
        study: [
          "莲莲查房：学习没破防，任务先破防。",
          "这波学习属于是把拖延按在地上打。",
          "知识点试图逃跑，被莲莲当场抓回。",
          "学习格已完成，脑子先别急着下班。",
          "莲莲：做好该做的事，别让知识点装死。",
          "这波学习被莲宝抓包，直接从摆烂区除名。",
          "题目还在嘴硬，莲莲已经把答案区举办了。",
        ],
        game: [
          "游戏格结算：莲莲宣布你赢麻了。",
          "这格娱乐已通关，别急着二周目。",
          "莲莲开麦：这把属于是时间管理大胜利。",
          "娱乐时间被精准爆破，爽到但克制。",
          "莲莲查战绩：这把不是赢，是把拖延打退游。",
          "游戏格下播，莲宝说再开一把就要被举办。",
        ],
        fitness: [
          "运动完成，莲莲鉴定为狠活。",
          "这波不是健身，是把懒惰举办了。",
          "身体：汗流浃背了吧。莲莲：继续。",
          "懒惰试图复活，被运动格再次击毙。",
          "莲莲开麦催练，懒惰当场破防退群。",
          "运动格完成，莲宝给你的摆烂判了缓刑。",
        ],
        paper: [
          "论文速读完成，文献区已被莲莲爆破。",
          "文献没看懂也先盖章，气势不能输。",
          "摘要读完，莲莲宣布这篇先别装高手。",
          "论文格完成，引用区已进入战损状态。",
          "莲莲锐评文献：别装深沉，先读完再破防。",
          "这篇论文被莲宝查房，脚注都开始冒汗。",
        ],
        work: [
          "上班格完成，莲莲说这班味太冲了。",
          "工作已结算，工位先别急着复活。",
          "班味被莲莲一脚踹出时间轴。",
          "这格上班已抬走，精神状态暂时安全。",
          "莲莲一句锐评，班味从屏幕里爬走了。",
          "工位被莲宝临时封印，今天先做人。",
        ],
      },
      dayClear: [
        "莲莲宣布：今日任务全员下播。",
        "今天全清，莲莲把时间轴打成顺风局。",
        "本日清空，拖延症被莲莲举办一整天。",
        "今日全清，莲宝查房只查到一地战绩。",
        "今天任务被莲莲逐个点名，最后全员闭麦。",
        "本日收工，莲莲公主宣布拖延症败诉。",
      ],
      weekClear: [
        "一周全清，莲莲宣布这是神之一手。",
        "全周任务被莲莲爆杀，时间表当场沉默。",
        "七天全清，莲宝把计划表打到不敢开播。",
        "一周完封，莲莲锐评：这才叫自己该做的事。",
      ],
      rare: [
        "稀有莲莲：别急，这波好运已经溢出了。",
        "隐藏触发：莲莲 0 帧连招，把计划表打穿。",
        "莲莲神秘一笑：这格不是完成，是处决。",
        "稀有查房：莲宝突然出现，任务吓到自动下播。",
        "隐藏狠活：莲莲把摆烂区锐评到连夜整改。",
      ],
      undo: [
        "莲莲撤回一个爆杀，鉴定为还得再打。",
        "完成章被莲莲举办，重新来过。",
        "莲莲：刚才那下不算，重开。",
        "这格复活了，但莲莲已经盯上它了。",
        "莲宝看了一眼撤回记录：别装，继续补刀。",
        "任务复活成功，但莲莲的查房名单也刷新了。",
      ],
    },
  },
  "ace-taffy": {
    backgrounds: {
      pageOptions: aceTaffyPageBackgroundOptions,
      tableOptions: aceTaffyTableBackgroundOptions,
      defaults: defaultAceTaffyBackgrounds,
    },
    categoryPalette: {
      uncategorized: ["#fff7fb", "#e6c8dc"],
      game: ["#ffe4f6", "#df74b3"],
      korean: ["#f4ecff", "#caa7e4"],
      fitness: ["#e9fbf8", "#89cfc4"],
      paper: ["#e8f6ff", "#8fc7e1"],
      lab: ["#e3fbff", "#86d5e4"],
      work: ["#f5e9ff", "#c29cdc"],
      care: ["#fff0dd", "#edb66f"],
      study: ["#fff0fa", "#e7a1ca"],
      rest: ["#fff8ee", "#e2c295"],
    },
    exportColors: {
      paper: "#fff3fb",
      panel: "#fffafe",
      line: "#f2b3d7",
      header: "#ffe2f4",
      muted: "#7d5b86",
      ink: "#3b2442",
    },
    effectTones: {
      complete: [659.25, 987.77],
      undo: [493.88, 392],
    },
    easterEggs: {
      complete: {
        default: [
          "谢谢喵，这格已经被塔菲举办了。",
          "蛋包饭变好吃魔法启动：任务当场爆炸。",
          "塔菲 0 帧起手，这格没反应过来就没了。",
          "急急急，但任务已经急完了。",
          "这格被泡芙糊脸，宣布下播。",
          "关注那个任务？塔菲已经替你点成完成喵。",
          "雏草姬集合，这格被塔菲当场做成战利品。",
        ],
        game: [
          "电子游戏结算完成，谢谢喵，急急急。",
          "这格游戏被塔菲 0 帧起手速通了。",
          "塔菲开大：娱乐格被当场满血斩杀。",
          "游戏时间已结算，别急着开下一把喵。",
          "单机区主播发力，这格被塔菲速通到跳制作名单。",
          "塔菲打完这格，存档点都开始谢谢喵。",
        ],
        study: [
          "学习格已被塔菲拿下，知识点别急着复活。",
          "泡芙糖霜糊脸，拖延症当场下播。",
          "塔菲宣布：这波学习不是努力，是补刀。",
          "知识点汗流浃背了吧，塔菲还在看。",
          "一起干活喵，塔菲把摆烂从课本里拖出来举办。",
          "学习格完成，雏草姬看了都说别急，已经赢了。",
        ],
        korean: [
          "背诵完成，词汇表被塔菲一口闷。",
          "呼呼喵，韩语格已经急到自己完成。",
          "发音还没急，塔菲先急了：完成！",
          "词汇表被 0 帧带走，下一页别装睡。",
          "塔菲喵了一声，词汇表立刻不敢嘴硬。",
        ],
        fitness: [
          "兔兔电波开大：懒惰被当场击毙。",
          "运动格完成，塔菲说这波汗流浃背了吧。",
          "塔菲宣布：今天不是运动，是抓懒惰现行。",
          "肌肉还没说话，任务已经谢谢喵了。",
          "一起干活喵升级版：一起流汗喵，懒惰别跑。",
          "运动格被塔菲打出暴击，沙发当场失去召唤权。",
        ],
        paper: [
          "论文速读完成，文献被塔菲谢谢喵了。",
          "这篇论文被 0 帧抬走，下一篇别装死。",
          "摘要区被塔菲举办，结论区瑟瑟发抖。",
          "参考文献别急，塔菲已经急到下一篇。",
          "塔菲读完摘要，文献区立刻进入谢谢喵状态。",
        ],
        work: [
          "工作格完成，班味已被泡芙净化。",
          "这班上完了，塔菲宣布工位暂时死亡。",
          "工位复活甲已碎，塔菲谢谢喵。",
          "班味试图攻击你，被蛋包饭魔法反弹。",
          "塔菲把工位按进蛋包饭里，班味当场消音。",
          "工作格被王牌级偶像补刀，老板都来不及急。",
        ],
      },
      dayClear: [
        "今日全清，谢谢喵，塔菲把日程表举办了。",
        "这一天被蛋包饭魔法抬走，急急急但爽。",
        "兔兔电波确认：今日任务全部下播。",
        "今日全清，雏草姬宣布这不是计划，是速通录像。",
        "塔菲收工喵，今天的任务列表已经被吃成蛋包饭。",
      ],
      weekClear: [
        "一周全清，塔菲宣布计划表已经汗流浃背。",
        "全周任务被谢谢喵，时间轴进入贤者模式。",
        "七天全清，塔菲把周计划打成塔GA 年度最佳。",
        "一周速通，王牌级偶像宣布拖延症原地毕业。",
      ],
      rare: [
        "稀有塔菲：蛋包饭魔法暴击，任务直接蒸发。",
        "隐藏谢谢喵触发：这格被 0 帧举办两次。",
        "塔菲混沌电波：急急急急急，但你已经赢了。",
        "隐藏雏草姬频道开启：任务被围观到当场自首。",
        "稀有关注那个：塔菲点名任务，任务秒变乖巧。",
      ],
      undo: [
        "塔菲撤回举办，任务暂时复活喵。",
        "蛋包饭魔法失效，鉴定为还得补刀。",
        "谢谢喵撤回，任务装死失败。",
        "塔菲先不急，这格留着二次处决。",
        "任务复活甲触发，塔菲已经在读秒喵。",
      ],
    },
  },
  "diana-jiaran": {
    backgrounds: {
      pageOptions: dianaJiaranPageBackgroundOptions,
      tableOptions: dianaJiaranTableBackgroundOptions,
      defaults: defaultDianaJiaranBackgrounds,
    },
    categoryPalette: {
      uncategorized: ["#fff7f3", "#ead1c4"],
      game: ["#ffe5ee", "#df6d87"],
      korean: ["#f7edff", "#c89be4"],
      fitness: ["#edf8ef", "#9fce9d"],
      paper: ["#fff0d9", "#ebb85d"],
      lab: ["#e9f8ff", "#91cbe1"],
      work: ["#ffe8ea", "#d98a96"],
      care: ["#fff1f1", "#e8a2a4"],
      study: ["#fff3dc", "#e8bf63"],
      rest: ["#fff8ea", "#e1c993"],
    },
    exportColors: {
      paper: "#fff2f3",
      panel: "#fffaf7",
      line: "#efb8be",
      header: "#ffe3e8",
      muted: "#7c5b5d",
      ink: "#42272a",
    },
    effectTones: {
      complete: [587.33, 880],
      undo: [440, 329.63],
    },
    easterEggs: {
      complete: {
        default: [
          "关注嘉然，这格已经被嘉心糖抬上舞台。",
          "嘉然今天吃什么？吃掉一个任务先。",
          "然然小恶魔出手，这格当场变成草莓碎。",
          "嘉心糖集合，这格已经拿下了。",
          "Diana 雷达全开，任务没跑出三秒。",
          "圣嘉然轻轻点头，待办清单当场闭麦。",
          "这格被然然甜甜一笑打到缴械。",
          "嘉然说接受挑战，于是任务先认输了。",
        ],
        game: [
          "游戏格完成，嘉心糖宣布这把有然味。",
          "然然开局就拿下，存档点开始鼓掌。",
          "这格游戏被小恶魔速通，嘉油声已经响了。",
          "嘉然小姐上号，拖延症被打到掉线。",
          "二楼还没拿下，游戏格已经先被拿下。",
          "嘉心糖看战绩：这格赢得很不讲道理。",
        ],
        study: [
          "学习格完成，嘉然把知识点画进你画我猜。",
          "然然查作业，摆烂当场装作不认识你。",
          "嘉心糖别发病，先把这页拿下。",
          "知识点被嘉然甜甜点名，直接站好。",
          "这波学习不是内卷，是嘉然雷达锁定。",
          "书本刚想闭麦，嘉然已经说嘉油了。",
        ],
        korean: [
          "背诵完成，然然把词汇表当小蛋糕切了。",
          "发音还在犹豫，嘉心糖已经开始嘉油。",
          "韩语格被嘉然拿下，词汇表别装不熟。",
          "然然小恶魔眨眼，单词直接投降。",
          "这格语言学习被草莓味雷达锁住了。",
        ],
        fitness: [
          "运动完成，嘉然小姐的狗都得说你今天能跑。",
          "嘉然小恶魔巡场，懒惰被罚去跳宅舞。",
          "这格运动拿下，嘉心糖先别瘫。",
          "汗还没落地，然然已经盖章完成。",
          "懒惰想躺平，被嘉然一声嘉油拽起来。",
          "运动格完成，草莓小恶魔宣布沙发败诉。",
        ],
        paper: [
          "论文速读完成，嘉然把摘要当菜单看完了。",
          "文献区被嘉心糖围观，引用都不敢乱跑。",
          "这篇论文被然然拿下，结论区开始发抖。",
          "摘要还没装深沉，嘉然已经吃掉重点。",
          "论文格完成，学术拖延被小恶魔叉走。",
        ],
        work: [
          "工作格完成，班味被嘉然做成草莓蛋糕。",
          "工位还想加戏，嘉心糖已经把它按回表格。",
          "然然甜甜开口，上班格当场下线。",
          "这班上完了，嘉然宣布今天少一点苦味。",
          "工作格被小恶魔收走，老板的急急雷达失灵。",
        ],
      },
      dayClear: [
        "今日全清，嘉然今天吃的是整张日程表。",
        "这一天被嘉心糖拿下，二楼都得让路。",
        "然然收工，今天的待办全员变草莓。",
        "嘉然雷达确认：今日任务无人生还。",
        "今天全清，圣嘉然宽恕了你的拖延症。",
      ],
      weekClear: [
        "一周全清，嘉心糖宣布这是大型拿下现场。",
        "七天任务被然然吃完，计划表只剩盘子。",
        "整周通关，Diana 的挑战你真的接住了。",
        "一周全清，嘉然小姐的狗都得给你鼓掌。",
      ],
      rare: [
        "稀有嘉然：甜甜小草莓突然暴击，任务直接融化。",
        "隐藏触发：嘉心糖发病频道开启，拖延症被围观到退场。",
        "圣嘉然降临，这格被温柔地判了完成。",
        "嘉然小恶魔眨眼，待办清单突然失去抵抗。",
        "低概率关注嘉然：这格被关注到自己完成。",
      ],
      undo: [
        "嘉然撤回一个拿下，任务暂时逃出草莓篮。",
        "完成章被嘉心糖收回，这格还得再嘉油。",
        "然然看了眼撤回：可以，但别装没来过。",
        "任务复活了，圣嘉然先宽恕三分钟。",
        "小恶魔暂停施法，这格留着下次吃。",
      ],
    },
  },
};
