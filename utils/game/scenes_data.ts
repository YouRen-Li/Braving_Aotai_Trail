export interface GameGameState {
  hp: number;
  hunger: number;
}

export interface ChoiceCost {
  hp?: number;
  hunger?: number;
}

export interface SceneChoice {
  text: string;
  target?: string; // The ID of the next scene
  action?: string; // Special actions like 'rest', 'eat'
  cost?: ChoiceCost;
  condition?: (state: any) => boolean; // Logic to show/hide this choice
}

export interface Scene {
  id: string;
  text: string;
  choices: SceneChoice[];
  image?: string; // Optional background image specific to this scene
  type?: "normal" | "camp" | "danger" | "ending";
}

// 初始剧情数据
export const scenes: Record<string, Scene> = {
  // --- 序章 ---
  start_001: {
    id: "start_001",
    type: "normal",
    text: "这里是塘口村，鳌太线的起点。天空阴沉沉的，飘着零星的雪花。你整理了一下背包，深吸一口气，准备踏入这片被称为“行走在中华龙脊”的无人区。",
    choices: [
      {
        text: "检查装备",
        action: "check_gear",
      },
      {
        text: "进山！",
        target: "forest_001",
        cost: { hunger: 2 },
      },
    ],
  },

  // --- 森林阶段 ---
  forest_001: {
    id: "forest_001",
    type: "normal",
    text: "你走进了一片茂密的原始红桦林。积雪没过了脚踝，四周静得可怕，只能听到自己沉重的呼吸声。前方出现了一个分岔路口。",
    choices: [
      {
        text: "走左边的小路 (陡峭但近)",
        target: "slope_001",
        cost: { hunger: 5, hp: 2 }, // 爬坡累，扣血扣饿
      },
      {
        text: "走右边的河谷 (平缓但远)",
        target: "river_001",
        cost: { hunger: 8 }, // 绕路，只饿不扣血
      },
    ],
  },

  slope_001: {
    id: "slope_001",
    type: "danger",
    text: "坡度超过了60度，你手脚并用艰难攀爬。忽然脚下一滑，一块碎石滚落深渊...",
    choices: [
      {
        text: "稳住身形",
        target: "camp_2800",
        cost: { hp: 5, hunger: 5 }, // 受了点惊吓和擦伤
      },
    ],
  },

  river_001: {
    id: "river_001",
    type: "normal",
    text: "沿着冰冻的河床行走，虽然路程较长，但胜在安全。天色渐晚，你看到了前方有一块巨大的避风石，那是传说中的“2800营地”。",
    choices: [
      {
        text: "前往营地",
        target: "camp_2800",
        cost: { hunger: 3 },
      },
    ],
  },

  // --- 营地节点 ---
  camp_2800: {
    id: "camp_2800",
    type: "camp",
    text: "你抵达了2800营地。这里地势平坦，是个绝佳的扎营点。此时狂风大作，气温骤降。",
    choices: [
      {
        text: "扎营休息 (恢复生命)",
        target: "forest_morning_001",
        action: "rest",
        cost: { hunger: 10 }, // 睡觉也会饿，但在营地睡可以触发回血逻辑
      },
      {
        text: "连夜赶路 (极度危险)",
        target: "dead_001", // 必死剧情演示
        cost: { hp: 100 },
      },
    ],
  },

  forest_morning_001: {
    id: "forest_morning_001",
    type: "normal",
    text: "第二天清晨，风雪停了。阳光洒在雪面上，刺得人睁不开眼。你收拾好帐篷，感觉体力恢复了不少。",
    choices: [
      {
        text: "继续前进",
        target: "start_001", // 暂时循环回去演示
        cost: { hunger: 5 },
      },
    ],
  },

  // --- 结局 ---
  dead_001: {
    id: "dead_001",
    type: "ending",
    text: "夜晚的鳌太线是死神的领地。你在黑暗中迷失了方向，失温迅速夺去了你的意识。你的旅程到此结束。",
    choices: [
      {
        text: "重新开始",
        action: "restart",
      },
    ],
  },
};
