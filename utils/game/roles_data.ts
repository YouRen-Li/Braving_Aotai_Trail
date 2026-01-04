import { type Item } from "@/utils/game/items_data";

export interface Role {
  id: string;
  name: string;
  title: string;
  description: string;
  avatar: string; // Emoji for now
  stats: {
    maxHp: number;
    maxSanity: number;
    maxHunger: number;
  };
  items: string[]; // Item IDs
}

export const roles: Role[] = [
  {
    id: "student",
    name: "大学生",
    title: "The Student",
    description: "年轻气盛，精神充沛。兼职送外卖买的强光手电是唯一的依靠。",
    avatar: "🎓",
    stats: {
      maxHp: 90,
      maxHunger: 100,
      maxSanity: 120,
    },
    items: ["gear_headlamp_01", "food_001"],
  },
  {
    id: "athlete",
    name: "运动员",
    title: "The Athlete",
    description: "体能怪兽，耐力惊人。但他那像燃烧炉一样的身体需要大量食物。",
    avatar: "🏃",
    stats: {
      maxHp: 130,
      maxHunger: 100, // Hunger drains naturally faster via game logic mod? Or just starts same
      maxSanity: 100,
    },
    items: ["food_001", "water_001", "water_001"],
  },
  {
    id: "doctor",
    name: "医生",
    title: "The Doctor",
    description: "冷静专业，救死扶伤。随身携带的急救药品能应对突发状况。",
    avatar: "🩺",
    stats: {
      maxHp: 100,
      maxHunger: 100,
      maxSanity: 110,
    },
    items: ["med_001", "med_001", "food_001"],
  },
  {
    id: "veteran",
    name: "退伍军人",
    title: "The Veteran",
    description: "野外生存专家。那双穿旧的登山靴曾随他征服过无数高山。",
    avatar: "🪖",
    stats: {
      maxHp: 110,
      maxHunger: 100,
      maxSanity: 90,
    },
    items: ["gear_boots_01", "food_001"],
  },
];
