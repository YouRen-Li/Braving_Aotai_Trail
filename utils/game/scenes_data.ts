export interface ChoiceCost {
  hp?: number;
  hunger?: number;
}

export interface SceneChoice {
  text: string;
  target?: string; // Target scene ID. 'resume' means continue to original destination.
  cost?: ChoiceCost;
  action?: string; // Special actions: 'restart', 'rest', 'check_gear', 'trigger_storm'
}

export interface Scene {
  id: string;
  text: string;
  choices: SceneChoice[];
  bg?: string; // e.g., 'forest', 'snow', 'night'
}

// --- 真实地图节点 ---
const mapScenes: Record<string, Scene> = {
  start_001: {
    id: "start_001",
    text: "这里是塘口，鳌太线的起点。眼前是连绵的秦岭山脉，这一去，便是数日的无人区穿越。背包沉甸甸的，你检查了最后一遍装备。",
    choices: [
      { text: "整理心情，出发！", target: "node_2900" },
      {
        text: "先在村口吃顿饱饭",
        cost: { hunger: -10 },
        target: "node_2900",
        action: "rest",
      },
    ],
  },
  node_2900: {
    id: "node_2900",
    text: "经过艰难的爬升，你到达了海拔2900米的营地。这里是进入高海拔区域前的最后一个相对舒适的休整点。四周静谧，偶尔传来鸟鸣。",
    choices: [
      {
        text: "继续赶路，翻越鳌山",
        target: "node_aoshan",
        cost: { hunger: 15, hp: 5 },
      },
      { text: "原地扎营休息", action: "rest" },
    ],
  },
  node_aoshan: {
    id: "node_aoshan",
    text: "这里是鳌山大梁，海拔极高，狂风呼啸。这里是事故高发地，无遮无拦的脊线让人感到自身的渺小。你需要格外小心失温。",
    choices: [
      {
        text: "顶着风快速通过",
        target: "node_shuiwozi",
        cost: { hunger: 20, hp: 10 },
      },
      {
        text: "寻找背风处稍作调整",
        cost: { hunger: 5 },
        target: "node_shuiwozi",
      },
    ],
  },
  node_shuiwozi: {
    id: "node_shuiwozi",
    text: "到达水窝子营地。这里是南北坡的节点。如果天气恶劣，许多队伍会选择从这里下撤。你看到地上有一些凌乱的脚印。",
    choices: [
      {
        text: "坚持向东，前往2800营地",
        target: "node_2800",
        cost: { hunger: 20, hp: 10 },
      },
      { text: "身体不适，选择下撤", target: "end_retreat" },
    ],
  },
  node_2800: {
    id: "node_2800",
    text: "2800营地，树林茂密了一些。这里曾发生过惨剧，你路过一片空地，似乎感觉到一种异样的压抑感。",
    choices: [
      {
        text: "穿越迷雾林，前往大爷海",
        target: "node_fog_forest", // Insert Fog Forest here
        cost: { hunger: 15, hp: 5 },
      },
      { text: "仔细搜索周围", target: "evt_tent" }, // 必触发一次帐篷事件
    ],
  },
  // [NEW] Fog Forest Node
  node_fog_forest: {
    id: "node_fog_forest",
    text: "你进入了一片浓密的冷杉林，大雾弥漫，能见度不足5米。脚下的路若隐若现，很容易迷失方向。（这里是2800到大爷海之间的迷魂阵）",
    choices: [
      {
        text: "凭直觉向前走",
        target: "node_daye",
        cost: { hunger: 20 }, // Low cost but high risk logic handled by game? No, simplified here.
      },
      {
        text: "仔细辨认路标 (消耗精力)",
        target: "node_daye",
        cost: { hunger: 25, hp: 5 },
      },
    ],
  },
  node_daye: {
    id: "node_daye",
    text: "大爷海，秦岭之巅的圣湖。湖水幽蓝深邃。翻过前面的拔仙台，就是出山的路了。",
    choices: [
      {
        text: "一鼓作气，出山！",
        target: "end_success",
        cost: { hunger: 30, hp: 20 },
      },
      { text: "在湖边最后休整一夜", action: "rest" },
    ],
  },
  end_success: {
    id: "end_success",
    text: "终于，你看到了鹦鸽镇的灯火。你成功完成了鳌太线穿越！回首望去，群山已在身后，活着真好。",
    choices: [{ text: "再来一次", action: "restart" }],
  },
  end_retreat: {
    id: "end_retreat",
    text: "你明智地选择了下撤。山永远在那里，生命只有一次。虽然没有走完全程，但安全回家才是户外的终点。",
    choices: [{ text: "重新开始", action: "restart" }],
  },
  dead_001: {
    id: "dead_001",
    text: "你的意识逐渐模糊... 在这片无人区，你成为了大山的一部分。",
    choices: [{ text: "重新开始", action: "restart" }],
  },
  // [NEW] Catch Ending
  end_caught: {
    id: "end_caught",
    text: "【结局：被捕】你被巡山队带回了派出所。写下保证书，缴纳3000元罚款，并被列入黑名单。这一趟“非法穿越”终究以闹剧收场。",
    choices: [{ text: "接受教训，重新开始", action: "restart" }],
  },
};

// --- 随机事件 (基于真实案例) ---
const eventScenes: Record<string, Scene> = {
  // 案例：失联驴友
  evt_hiker: {
    id: "evt_hiker",
    text: "【随机事件】浓雾中，你隐约听到前方有呼救声。走近一看，是一个眼神涣散的落单驴友。他说同伴走丢了，自己也没水了。",
    choices: [
      { text: "分他半瓶水，指引方向", cost: { hunger: 10 }, target: "resume" }, // 消耗物资，继续
      { text: "自身难保，默默离开", target: "resume" },
      {
        text: "帮他报警(消耗大量时间等待)",
        cost: { hp: 20, hunger: 20 },
        target: "resume",
      },
    ],
  },
  // 案例：废弃帐篷/CO中毒
  evt_tent: {
    id: "evt_tent",
    text: "【随机事件】你发现一顶完好的帐篷搭在路边，但没有任何动静。走近时，心里涌起一股不祥的预感。",
    choices: [
      { text: "拉开帐篷查看", target: "evt_tent_result" },
      { text: "多一事不如少一事，离开", target: "resume" },
    ],
  },
  evt_tent_result: {
    id: "evt_tent_result",
    text: "帐篷里空无一人，只有一些散落的气罐和睡袋。看来主人已经离开许久了。你捡起了一些可用的物资。",
    choices: [{ text: "获得物资", target: "resume", action: "loot_supplies" }],
  },
  // 案例：暴风雪抉择
  evt_storm: {
    id: "evt_storm",
    text: "【突发恶劣天气】狂风骤起，暴雪瞬间吞没了视线！这是最危险的时刻（参考2017年及2021年多起事故）。强行赶路极易失温死亡。",
    choices: [
      { text: "强行突围", cost: { hp: 40, hunger: 20 }, target: "resume" },
      { text: "紧急扎营躲避", cost: { hunger: 40 }, target: "resume" }, // 耗时耗粮
      { text: "绝望报警(救援结局)", target: "end_rescue" },
    ],
  },

  // [NEW] Ranger Encounter
  evt_ranger: {
    id: "evt_ranger",
    text: "【突发事件】前方路口出现了几个穿迷彩服的身影——是自然保护区的巡山队！鳌太线早已全线封禁，你这是在非法穿越。",
    choices: [
      { text: "配合执法，接受处罚", target: "end_caught" },
      {
        text: "趁雾大，冒险绕路躲避",
        cost: { hp: 30, hunger: 30 },
        target: "resume",
      }, // High cost gamble
    ],
  },

  // [NEW] Frozen Body (Terminal Burrowing)
  evt_body: {
    id: "evt_body",
    text: "【恐怖发现】在一块巨石的缝隙中，你发现了一具蜷缩的遗体。他衣着单薄，似乎生前有“反常脱衣”现象，头部拼命往石缝里钻（终末挖洞行为）。这残酷的一幕让你不寒而栗。",
    choices: [
      {
        text: "搜寻遗物 (可能获得装备)",
        action: "loot_supplies",
        target: "resume",
      }, // Morally gray
      { text: "默哀三分钟，继续赶路", cost: { hunger: 5 }, target: "resume" },
    ],
  },

  // [NEW] Takin Encounter
  evt_takin: {
    id: "evt_takin",
    text: "【猛兽挡道】一头体型硕大的秦岭羚牛挡在了必经之路上。它盯着你，鼻孔喷着白气。这种独行公牛脾气暴躁，极具攻击性。",
    choices: [
      { text: "原地不动，等待它离开", cost: { hunger: 15 }, target: "resume" },
      { text: "大声驱赶", cost: { hp: 50 }, target: "resume" }, // High risk of injury
    ],
  },

  end_rescue: {
    id: "end_rescue",
    text: "你拨通了救援电话。十几个小时后，救援队把你抬下了山。虽然获救，但正如新闻所说：“这是一场不必要的冒险”。",
    choices: [{ text: "重新开始", action: "restart" }],
  },
};

export const scenes: Record<string, Scene> = {
  ...mapScenes,
  ...eventScenes,
};

// Updated random event list
export const randomEventIds = [
  "evt_hiker",
  "evt_storm",
  "evt_ranger",
  "evt_body",
  "evt_takin",
]; // evt_tent is manual trigger for now
