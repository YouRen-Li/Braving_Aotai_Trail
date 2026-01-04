export interface ItemEffect {
  hp?: number;
  hunger?: number;
  sanity?: number; // reserved for future
  msg?: string; // effect description message
}

export interface ItemStats {
  warmth?: number; // Reduces HP loss from cold
  speed?: number; // Reduces Hunger loss from movement
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: "consumable" | "tool" | "material" | "gear";
  slot?: "head" | "body" | "feet" | "hand";
  icon?: string; // emoji or image path
  stackable?: boolean;
  effect?: ItemEffect;
  stats?: ItemStats;
}

export const items: Record<string, Item> = {
  water_001: {
    id: "water_001",
    name: "矿泉水",
    description: "一瓶500ml的矿泉水，虽然冰冷但能解渴。",
    type: "consumable",
    icon: "💧",
    effect: {
      hunger: 5,
      msg: "你喝了一口水，感觉喉咙舒服多了。(饱食+5)",
    },
  },
  food_001: {
    id: "food_001",
    name: "压缩饼干",
    description: "干硬的军用压缩饼干，顶饱但很难吃。",
    type: "consumable",
    icon: "🍪",
    effect: {
      hunger: 25,
      msg: "你艰难地咽下饼干，胃里充实了不少。(饱食+25)",
    },
  },
  med_001: {
    id: "med_001",
    name: "云南白药",
    description: "止血化瘀的喷雾剂，处理外伤的神器。",
    type: "consumable",
    icon: "💊",
    effect: {
      hp: 20,
      msg: "伤口经过处理不再剧烈疼痛。(生命+20)",
    },
  },
  // --- GEAR ---
  gear_jacket_01: {
    id: "gear_jacket_01",
    name: "冲锋衣",
    description: "专业的Gore-Tex冲锋衣，防风防水，是抵御恶劣天气的关键。",
    type: "gear",
    slot: "body",
    icon: "🧥",
    stats: { warmth: 15 },
  },
  gear_boots_01: {
    id: "gear_boots_01",
    name: "登山鞋",
    description: "抓地力极强的重装徒步鞋，能有效节省体力。",
    type: "gear",
    slot: "feet",
    icon: "🥾",
    stats: { speed: 10 },
  },
  gear_poles_01: {
    id: "gear_poles_01",
    name: "登山杖",
    description: "碳纤维登山杖，能有效分担膝盖压力。",
    type: "gear",
    slot: "hand",
    icon: "🦯",
    stats: { speed: 5 },
  },
  gear_headlamp_01: {
    id: "gear_headlamp_01",
    name: "手电筒",
    description: "夜间行进的生命之光。没有它，夜晚就是地狱。",
    type: "gear",
    slot: "head",
    icon: "🔦",
    stats: { warmth: 0 },
  },
};
