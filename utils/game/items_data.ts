export interface ItemEffect {
  hp?: number;
  hunger?: number;
  sanity?: number; // reserved for future
  msg?: string; // effect description message
}

export interface Item {
  id: string;
  name: string;
  description: string;
  type: "consumable" | "tool" | "material";
  icon?: string; // emoji or image path
  stackable?: boolean;
  effect?: ItemEffect;
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
};
