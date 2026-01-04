export interface ChoiceCost {
  hp?: number;
  hunger?: number;
  sanity?: number;
}

export interface SceneChoice {
  text: string;
  target?: string; // Target scene ID. 'resume' for random events.
  cost?: ChoiceCost;
  action?: string; // Special actions: 'restart', 'rest', 'loot_supplies', 'refill_water', 'look_back'
}

export interface Scene {
  id: string;
  text: string;
  choices: SceneChoice[];
  bg?: string;
}

// --- 真实地图节点扩充版 (40+ Nodes) ---
const mapScenes: Record<string, Scene> = {
  // === 第一章：进山 (The Approach) ===

  start_001: {
    id: "start_001",
    text: "这里是塘口，鳌太线的起点。清晨的空气冷冽刺骨。眼前是连绵的秦岭山脉，墨绿色的冷杉林在风中低语。这一去，便是数日的无人区。",
    bg: "loc_village",
    choices: [
      { text: "整理心情，踏上机耕路", target: "node_village_road" },
      {
        text: "先在村口吃顿饱饭 (饱食+10)",
        cost: { hunger: -10 },
        target: "node_village_road",
      },
    ],
  },

  node_village_road: {
    id: "node_village_road",
    text: "【机耕路】还是平缓的土路。你沿着河谷前行，还能看到远处农家的炊烟。这是最后的文明痕迹。背包的重量开始压在肩上。",
    bg: "loc_tractor_road",
    choices: [
      {
        text: "加快脚步热身",
        target: "node_river_crossing",
        cost: { hunger: 5 },
      },
      {
        text: "调整背包背负系统",
        target: "node_river_crossing",
        cost: { hunger: 2 },
      },
    ],
  },

  node_river_crossing: {
    id: "node_river_crossing",
    text: "【过河】路断了，一条冰冷的溪流挡在面前。石头上结了薄薄的冰。",
    bg: "loc_river", // Updated
    choices: [
      {
        text: "踩着石头跳过去",
        target: "node_forest_entry",
        cost: { hunger: 5, sanity: 2 },
      },
      {
        text: "脱鞋涉水 (失温风险)",
        target: "node_forest_entry",
        cost: { hp: 5, hunger: 5 },
      },
    ],
  },

  node_forest_entry: {
    id: "node_forest_entry",
    text: "【红桦林】你正式进入了爬升路段。四周是茂密的红桦林，坡度陡然提升。呼吸开始变得急促，心跳声在耳边回响。",
    bg: "loc_red_birch",
    choices: [
      {
        text: "保持节奏爬升",
        target: "node_forest_climb",
        cost: { hunger: 10, hp: 2 },
      },
      {
        text: "回头看一眼山下的村庄 (理智+5)",
        action: "look_back",
        target: "node_forest_climb",
        cost: { hunger: 5, sanity: -5 },
      },
    ],
  },

  node_forest_climb: {
    id: "node_forest_climb",
    text: "【林海深处】海拔上升到2600米。树木变得稀疏，空气也变得稀薄。每迈出一步都需要大口喘气。",
    bg: "loc_forest",
    choices: [
      { text: "咬牙坚持", target: "node_2900", cost: { hunger: 15, hp: 5 } },
      {
        text: "喝口水继续赶路",
        cost: { hp: -5, hunger: 5 },
        target: "node_2900",
      },
    ],
  },

  node_2900: {
    id: "node_2900",
    text: "【2900营地】终于，你到达了第一晚的落脚点。这里地势相对平坦，是一片开阔的草甸。夕阳下的秦岭美得令人窒息。",
    bg: "loc_sunset_meadow",
    choices: [
      { text: "搭帐篷过夜", action: "rest", target: "node_2900_morning" },
      {
        text: "趁天色还早赶往盆景园",
        target: "node_penjing_ascent",
        cost: { hunger: 15, sanity: 5 },
      },
      { text: "感觉状态不对，下撤", target: "end_retreat" },
    ],
  },

  node_2900_morning: {
    id: "node_2900_morning",
    text: "【2900营地·清晨】清晨的阳光洒在帐篷上。昨晚虽然寒冷，但你终于恢复了一些体力。是时候出发了。",
    bg: "loc_sunset_meadow",
    choices: [{ text: "拔营前往盆景园", target: "node_penjing_ascent" }],
  },

  // === 第二章：脊线之上 (On the Ridge) ===

  node_penjing_ascent: {
    id: "node_penjing_ascent",
    text: "【乱石坡】离开2900营地，路面变成了破碎的石块。这就是“石海”的雏形。脚下容易打滑，极其消耗体力。",
    bg: "loc_stone_sea",
    choices: [
      {
        text: "手脚并用攀爬",
        target: "node_penjing",
        cost: { hunger: 20, hp: 5 },
      },
      { text: "使用登山杖支撑", target: "node_penjing", cost: { hunger: 15 } },
    ],
  },

  node_penjing: {
    id: "node_penjing",
    text: "【盆景园】海拔3100米。这里的太白红杉因长期受大风吹袭，树冠平整如削，姿态奇异，如同天然盆景园。",
    bg: "loc_penjing",
    choices: [
      { text: "穿过怪树林", target: "node_baiqi_start", cost: { hunger: 10 } },
      {
        text: "拍照留念 (理智+5)",
        target: "node_baiqi_start",
        cost: { hunger: 10, sanity: -5 },
      },
    ],
  },

  node_baiqi_start: {
    id: "node_baiqi_start",
    text: "【白起梁起点】树木消失了，眼前是裸露的山脊线。风声仿佛千军万马在呼啸，“白起梁”因此得名。体感温度骤降。",
    bg: "loc_ridge",
    choices: [
      {
        text: "拉紧冲锋衣拉链",
        target: "node_baiqi_middle",
        cost: { hunger: 5 },
      },
      {
        text: "含一颗糖补充热量",
        target: "node_baiqi_middle",
        cost: { hunger: -5 },
      },
    ],
  },

  node_baiqi_middle: {
    id: "node_baiqi_middle",
    text: "【白起梁中段】漫长、枯燥、狂风。左边是万丈深渊，右边是滚滚云海。这种单调的行走最容易消磨意志。",
    bg: "loc_ridge",
    choices: [
      {
        text: "机械地迈步",
        target: "node_nav_stand",
        cost: { hunger: 20, sanity: 5 },
      },
      {
        text: "大吼一声给自己壮胆",
        target: "node_nav_stand",
        cost: { hunger: 25, sanity: -10 },
      },
    ],
  },

  node_nav_stand: {
    id: "node_nav_stand",
    text: "【鳌山导航架】海拔3475米。这架废弃的导航架是鳌山的标志。风太大了，你甚至无法站稳。",
    bg: "loc_nav_stand", // Updated
    choices: [
      {
        text: "快速拍照后离开",
        target: "node_maijie_descent",
        cost: { hunger: 10, hp: 2 },
      },
      {
        text: "在架子下躲避风雪 (恢复体力)",
        cost: { hp: -10, hunger: 10, sanity: -5 },
        target: "node_maijie_descent",
      },
    ],
  },

  // === 第三章：凶险之间 (The Danger Zone) ===

  node_maijie_descent: {
    id: "node_maijie_descent",
    text: "【麦秸岭下撤】过了鳌山，路况突变。前方是陡峭的麦秸岭，你需要从这满是碎石的陡坡上下去。",
    bg: "loc_ridge",
    choices: [
      {
        text: "侧身慢下",
        target: "node_knife_ridge",
        cost: { hunger: 15, hp: 5 },
      },
      {
        text: "屁降 (坐着滑下去)",
        target: "node_knife_ridge",
        cost: { hunger: 10, hp: 10 },
      },
    ],
  },

  node_knife_ridge: {
    id: "node_knife_ridge",
    text: "【刀刃梁】路如其名，山脊窄得只能容下一只脚。两边都是深不见底的悬崖。一阵横风吹来，你晃了一下。",
    bg: "loc_knife_ridge",
    choices: [
      {
        text: "趴下爬过去",
        target: "node_shuiwozi_source",
        cost: { hunger: 20, sanity: 10 },
      },
      {
        text: "深呼吸，快速通过",
        target: "node_shuiwozi_source",
        cost: { hunger: 15, sanity: 5 },
      },
    ],
  },

  node_shuiwozi_source: {
    id: "node_shuiwozi_source",
    text: "【寻找水源】翻过刀刃梁，你听到了流水声。在乱石堆下方，有一股细小的清泉。这是救命水。",
    bg: "loc_spring_water",
    choices: [
      {
        text: "把水壶灌满",
        action: "loot_supplies",
        target: "node_shuiwozi_camp",
      },
      { text: "顾不上水了，先去营地", target: "node_shuiwozi_camp" },
    ],
  },

  node_shuiwozi_camp: {
    id: "node_shuiwozi_camp",
    text: "【水窝子营地】这里是一个相对避风的鞍部。许多队伍会选择在这里扎营。地上有些前人留下的气罐垃圾。",
    bg: "loc_camp",
    choices: [
      { text: "扎营休整", action: "rest", target: "node_shuiwozi_morning" },
      {
        text: "状态还行，继续",
        target: "node_plane_wreck",
        cost: { hunger: 10 },
      },
      { text: "太难了，我要下撤", target: "end_retreat" },
    ],
  },

  node_shuiwozi_morning: {
    id: "node_shuiwozi_morning",
    text: "【水窝子·清晨】这片鞍部在早晨显得格外宁静。远处的云海在翻腾。你收拾好垃圾，准备迎接最艰难的路段。",
    bg: "loc_camp",
    choices: [{ text: "出发，穿越飞机梁", target: "node_plane_wreck" }],
  },

  // === 第四章：迷途 (Lost) ===

  node_plane_wreck: {
    id: "node_plane_wreck",
    text: "【飞机梁】你看到了一些散落的金属碎片，那是多年前坠毁的战机残骸。这里常年大雾，仿佛是被诅咒之地。",
    bg: "loc_plane_wreck", // Updated
    choices: [
      { text: "查看残骸", target: "node_stone_sea", cost: { sanity: 5 } },
      {
        text: "双手合十，匆匆通过",
        target: "node_stone_sea",
        cost: { sanity: -2 },
      },
    ],
  },

  node_stone_sea: {
    id: "node_stone_sea",
    text: "【无尽石海】眼前是没有尽头的乱石堆。每块石头都有半人高，且松动不稳。一旦卡住脚就是骨折。",
    bg: "loc_stone_sea",
    choices: [
      {
        text: "像岩羊一样跳跃",
        target: "node_2800",
        cost: { hunger: 30, hp: 15 },
      },
      {
        text: "一步一步试探",
        target: "node_2800",
        cost: { hunger: 40, hp: 5 },
      },
    ],
  },

  node_2800: {
    id: "node_2800",
    text: "【2800营地】海拔重新降到2800米。这里树木茂密，光线阴暗。压抑的氛围让你只想尽快离开。",
    bg: "loc_forest",
    choices: [
      {
        text: "进入前面的森林",
        target: "node_fog_entry",
        cost: { hunger: 10 },
      },
      { text: "搜索一下周围", target: "evt_tent", cost: { sanity: 5 } },
    ],
  },

  node_fog_entry: {
    id: "node_fog_entry",
    text: "【迷雾入口】走进冷杉林，浓雾突然涌来，能见度瞬间降到五米以内。路迹消失了。",
    bg: "bg_fog",
    choices: [
      {
        text: "拿出指北针确认方向",
        target: "node_fog_deep",
        cost: { sanity: -5 },
      },
      { text: "凭直觉走", target: "node_fog_deep", cost: { sanity: 5 } },
    ],
  },

  node_fog_deep: {
    id: "node_fog_deep",
    text: "【迷魂阵】你绕回了原地？那棵枯树刚才好像见过。恐惧开始在心中蔓延。",
    bg: "bg_fog",
    choices: [
      {
        text: "寻找树上的红布条",
        target: "node_pyramid",
        cost: { hunger: 20, sanity: 5 },
      },
      {
        text: "冷静下来，观察兽道",
        target: "node_pyramid",
        cost: { hunger: 15, sanity: -5 },
      },
    ],
  },

  // === 第五章：朝圣 (Pilgrimage) ===

  node_pyramid: {
    id: "node_pyramid",
    text: "【金字塔】雾气散去，一座金字塔般的角峰耸立在眼前。这里是太白山的南坡。",
    bg: "loc_ridge",
    choices: [
      {
        text: "翻越山侧",
        target: "node_xitaibai",
        cost: { hunger: 20, hp: 10 },
      },
    ],
  },

  node_xitaibai: {
    id: "node_xitaibai",
    text: "【西太白】这里有雷公庙的断壁残垣。古人敬畏自然，在此设庙。太白绝顶就在前方了。",
    bg: "loc_temple", // Updated
    choices: [
      {
        text: "捡一块石头祭拜",
        target: "node_daye_lake",
        cost: { sanity: -10 },
      },
      { text: "继续赶路", target: "node_daye_lake", cost: { hunger: 10 } },
    ],
  },

  node_daye_lake: {
    id: "node_daye_lake",
    text: "【大爷海】翻过最后一个垭口，那抹幽蓝的湖水出现在眼前。海拔3590米的圣湖。许多人到了这里，都会忍不住落泪。",
    bg: "loc_daye_lake",
    choices: [
      { text: "在湖边洗把脸", action: "rest", target: "node_baxian_ascent" },
      {
        text: "一鼓作气冲顶",
        target: "node_baxian_ascent",
        cost: { hunger: 10 },
      },
    ],
  },

  node_baxian_ascent: {
    id: "node_baxian_ascent",
    text: "【最后的冲顶】只剩下最后一百多米的拔高。碎石坡很滑，每走一步退半步。这是最后的考验。",
    bg: "loc_stone_sea",
    choices: [
      {
        text: "燃烧最后的意志",
        target: "node_baxiantai",
        cost: { hunger: 15, hp: 5 },
      },
    ],
  },

  node_baxiantai: {
    id: "node_baxiantai",
    text: "【拔仙台】海拔3767.2米！你站上了秦岭之巅。云海在你脚下翻腾，天地之间，只有风声和你沉重的呼吸声。",
    bg: "bg_sunny",
    choices: [{ text: "向群山致敬，下山", target: "end_success" }],
  },

  // --- Endings ---
  end_success: {
    id: "end_success",
    text: "顺着游人如织的台阶路下山，你恍如隔世。你满身泥泞，在游客惊讶的目光中走出了大山。你活着，并且战胜了自己。",
    bg: "bg_sunny",
    choices: [{ text: "再来一次", action: "restart" }],
  },
  end_retreat: {
    id: "end_retreat",
    text: "【结局：明智撤退】山永远在那里，生命只有一次。你选择了下撤。虽然通过了，但安全回家才是户外的终点。",
    bg: "loc_village", // Updated
    choices: [{ text: "重新开始", action: "restart" }],
  },
  dead_001: {
    id: "dead_001",
    text: "【结局：长眠大山】你的意识逐渐模糊... 身体不再寒冷，反而感到一丝温暖。在这片无人区，你成为了大山的一部分。",
    bg: "bg_snow",
    choices: [{ text: "重新开始", action: "restart" }],
  },
  dead_starve: {
    id: "dead_starve",
    text: "【结局：饥寒交迫】食物耗尽，体力透支。你倒在了路上，再也没有力气站起来。",
    bg: "bg_snow",
    choices: [{ text: "重新开始", action: "restart" }],
  },
  dead_cold: {
    id: "dead_cold",
    text: "【结局：失温】核心体温降低，你开始出现幻觉，感到异常燥热而脱去了衣服... 最后的微笑凝固在嘴角。",
    bg: "bg_storm",
    choices: [{ text: "重新开始", action: "restart" }],
  },
  dead_sanity: {
    id: "dead_sanity",
    text: "【结局：精神崩溃】无尽的黑暗和风声击垮了你的意志。你开始胡言乱语，冲向了悬崖...",
    bg: "bg_fog",
    choices: [{ text: "重新开始", action: "restart" }],
  },
  end_caught: {
    id: "end_caught",
    text: "【结局：被捕】你被巡山队带回了派出所。写下保证书，缴纳罚款，并被列入黑名单。这一趟“非法穿越”终究以闹剧收场。",
    bg: "loc_village", // Updated
    choices: [{ text: "接受教训，重新开始", action: "restart" }],
  },
  end_rescue: {
    id: "end_rescue",
    text: "【结局：获救】只有亲历者才知道等待救援的那十几个小时有多绝望。获救了，但“驴友”的名声又多了一笔负面教材。",
    bg: "loc_camp",
    choices: [{ text: "重新开始", action: "restart" }],
  },
};

// --- 随机事件 ---
const eventScenes: Record<string, Scene> = {
  evt_hiker: {
    id: "evt_hiker",
    text: "【随机事件】浓雾中，你隐约听到前方有呼救声。走近一看，是一个眼神涣散的落单驴友。他说同伴走丢了，自己也没水了。",
    bg: "bg_fog",
    choices: [
      {
        text: "分他半瓶水",
        cost: { hunger: 10, sanity: -10 },
        target: "resume",
      }, // +Karma
      { text: "自身难保，离开", cost: { sanity: 10 }, target: "resume" }, // Guilt
      {
        text: "帮他报警",
        cost: { hp: 20, hunger: 20, sanity: -5 },
        target: "resume",
      },
    ],
  },
  evt_tent: {
    id: "evt_tent",
    text: "【探索】你发现一顶完好的帐篷搭在路边，但没有任何动静。走近时，心里涌起一股不祥的预感。",
    bg: "loc_camp",
    choices: [
      { text: "拉开帐篷查看", target: "evt_tent_result", cost: { sanity: 5 } },
      { text: "多一事不如少一事，离开", target: "resume" },
    ],
  },
  evt_tent_result: {
    id: "evt_tent_result",
    text: "帐篷里空无一人，只有一些散落的气罐和睡袋。看来主人已经离开许久了。你捡起了一些可用的物资。",
    bg: "loc_camp",
    choices: [{ text: "获得物资", target: "resume", action: "loot_supplies" }],
  },
  evt_storm: {
    id: "evt_storm",
    text: "【突发恶劣天气】狂风骤起，暴雪瞬间吞没了视线！这是最危险的时刻。强行赶路极易失温死亡。",
    bg: "bg_storm",
    choices: [
      {
        text: "强行突围",
        cost: { hp: 40, hunger: 20, sanity: 15 },
        target: "resume",
      },
      {
        text: "紧急扎营躲避",
        cost: { hunger: 40, sanity: 5 },
        target: "resume",
      },
      { text: "绝望报警(救援结局)", target: "end_rescue" },
    ],
  },
  evt_ranger: {
    id: "evt_ranger",
    text: "【突发事件】前方路口出现了几个穿迷彩服的身影——是自然保护区的巡山队！鳌太线全线封禁，你这是在非法穿越。",
    bg: "loc_forest",
    choices: [
      { text: "配合执法，接受处罚", target: "end_caught" },
      {
        text: "趁雾大，冒险绕路躲避",
        cost: { hp: 30, hunger: 30, sanity: 15 },
        target: "resume",
      },
    ],
  },
  evt_body: {
    id: "evt_body",
    text: "【恐怖发现】在一块巨石的缝隙中，你发现了一具蜷缩的遗体。他衣着单薄，似乎生前有“反常脱衣”现象。这残酷的一幕让你不寒而栗。",
    bg: "loc_stone_sea",
    choices: [
      { text: "搜寻遗物 (理智-20)", action: "loot_supplies", target: "resume" },
      { text: "默哀并离开", cost: { hunger: 5, sanity: 10 }, target: "resume" },
    ],
  },
  evt_takin: {
    id: "evt_takin",
    text: "【猛兽挡道】一头体型硕大的秦岭羚牛挡在了由独木桥上。它盯着你，鼻孔喷着白气。这种独行公牛极具攻击性。",
    bg: "loc_forest",
    choices: [
      {
        text: "原地不动等待",
        cost: { hunger: 20, sanity: 5 },
        target: "resume",
      },
      { text: "大声驱赶", cost: { hp: 50, sanity: 10 }, target: "resume" },
    ],
  },
};

export const scenes: Record<string, Scene> = {
  ...mapScenes,
  ...eventScenes,
};

export const randomEventIds = [
  "evt_hiker",
  "evt_storm",
  "evt_ranger",
  "evt_body",
  "evt_takin",
];
