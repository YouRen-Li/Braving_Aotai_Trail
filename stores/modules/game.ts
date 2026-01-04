import { defineStore } from "pinia";
import {
  scenes,
  type SceneChoice,
  type ChoiceCost,
  type Scene,
} from "@/utils/game/scenes_data";
import { items, type Item } from "@/utils/game/items_data";
import { weatherData, type WeatherType } from "@/utils/game/weather_data";

declare const uni: any;

// 定义 State 接口
interface GameState {
  gameState: "idle" | "playing" | "ended";
  currentSceneId: string;
  player: {
    name: string;
    identity: string;
    days: number;
  };
  status: {
    hp: number;
    hunger: number;
    maxHp: number;
    maxHunger: number;
  };
  inventory: Item[];
  weather: WeatherType;
  history: string[];
}

export const useGameStore = defineStore("game", {
  state: (): GameState => ({
    // 基础状态
    gameState: "idle",
    currentSceneId: "start_001",

    // 玩家状态
    player: {
      name: "驴友",
      identity: "普通游客",
      days: 1,
    },

    // 生存数值
    status: {
      hp: 100,
      hunger: 100,
      maxHp: 100,
      maxHunger: 100,
    },

    // 背包
    inventory: [],

    // 天气
    weather: "sunny",

    // 历史记录 (用于回放或结算)
    history: [],
  }),

  getters: {
    currentScene: (state): Scene =>
      scenes[state.currentSceneId] || scenes["start_001"],
    isAlive: (state): boolean => state.status.hp > 0,
    currentWeatherInfo: (state) => weatherData[state.weather],
  },

  actions: {
    // 初始化游戏
    initGame() {
      this.gameState = "playing";
      this.currentSceneId = "start_001";
      this.status = { hp: 100, hunger: 100, maxHp: 100, maxHunger: 100 };
      this.player.days = 1;
      this.inventory = [];
      this.weather = "sunny";
      this.history = [];

      // 开局送点物资
      this.gainItem("water_001");
      this.gainItem("food_001");

      console.log("Game Initialized");
    },

    // 获得物品
    gainItem(itemId: string) {
      const item = items[itemId];
      if (item) {
        // Deep copy
        this.inventory.push({ ...item });
        uni.showToast({ title: `获得: ${item.name}`, icon: "none" });
      }
    },

    // 使用物品
    useItem(index: number) {
      const item = this.inventory[index];
      if (!item) return;

      if (item.type === "consumable" && item.effect) {
        // 应用效果
        if (item.effect.hp) {
          this.status.hp = Math.min(
            this.status.maxHp,
            this.status.hp + item.effect.hp
          );
        }
        if (item.effect.hunger) {
          this.status.hunger = Math.min(
            this.status.maxHunger,
            this.status.hunger + item.effect.hunger
          );
        }

        // 提示信息
        if (item.effect.msg) {
          uni.showToast({ title: item.effect.msg, icon: "none" });
        }

        // 移除消耗品
        this.inventory.splice(index, 1);
      } else {
        uni.showToast({ title: "暂时无法使用该物品", icon: "none" });
      }
    },

    // 随机天气
    randomizeWeather() {
      const rand = Math.random();
      if (rand < 0.4) this.weather = "sunny";
      else if (rand < 0.7) this.weather = "cloudy";
      else if (rand < 0.85) this.weather = "fog";
      else if (rand < 0.95) this.weather = "snow";
      else this.weather = "storm";

      // 播报天气变化
      const info = weatherData[this.weather];
      // 降低频繁播报的打扰，仅在恶劣天气提示
      if (["storm", "snow"].includes(this.weather)) {
        uni.showToast({ title: `警告: ${info.name}`, icon: "none" });
      }
    },

    // 处理玩家选择
    handleChoice(choice: SceneChoice) {
      this.history.push(`选择: ${choice.text}`);

      // 先扣费
      if (choice.cost) {
        this.applyCost(choice.cost);
      }

      // 变天逻辑：每次移动都有概率变天
      // 可以在这里简单处理，或者单独的 action
      if (choice.target) {
        this.randomizeWeather();
      }

      // 执行特殊动作
      if (choice.action) {
        this.handleAction(choice.action);
      }

      // 死活检查
      if (!this.checkSurvival()) {
        return;
      }

      // 场景跳转
      if (choice.target) {
        // 恶劣天气可能导致无法前往特定区域 (暂未实现，可扩展)
        this.moveToScene(choice.target);
      }
    },

    // 扣减数值 (核心算法：天气系数 + 饥饿惩罚)
    applyCost(cost: ChoiceCost) {
      const weatherInfo = weatherData[this.weather];
      const coeff = weatherInfo.costCoeff;

      // 1. 计算 hunger 消耗
      let hungerCost = (cost.hunger || 0) * coeff;
      this.status.hunger = Math.max(0, this.status.hunger - hungerCost);

      // 2. 计算 HP 消耗
      let hpCost = (cost.hp || 0) * coeff;

      // 天气额外掉血 (失温)
      if (weatherInfo.hpLeak) {
        hpCost += weatherInfo.hpLeak;
      }

      // 饥饿惩罚：如果饿空了，额外扣血
      if (this.status.hunger <= 0) {
        hpCost += 10; // 极度饥饿惩罚
        uni.showToast({ title: "饥饿难耐，生命流失！", icon: "none" });
      }

      this.status.hp = Math.max(0, this.status.hp - hpCost);
    },

    // 特殊动作处理
    handleAction(action: string) {
      switch (action) {
        case "restart":
          this.initGame();
          break;
        case "rest":
          // 休息回血，天气好回得多
          let heal = 30;
          if (this.weather === "storm") heal = 10;
          if (this.weather === "sunny") heal = 50;

          this.status.hp = Math.min(this.status.maxHp, this.status.hp + heal);
          this.player.days += 1;
          this.randomizeWeather(); // 睡一觉天气肯定变
          uni.showToast({ title: `休息一晚 (恢复+${heal})`, icon: "none" });
          break;
        case "check_gear":
          uni.showToast({ title: "请打开右上角背包查看", icon: "none" });
          break;
        default:
          console.warn("Unknown action:", action);
      }
    },

    // 场景跳转
    moveToScene(sceneId: string) {
      if (scenes[sceneId]) {
        this.currentSceneId = sceneId;
      } else {
        console.error(`Scene not found: ${sceneId}`);
      }
    },

    // 生存检查
    checkSurvival(): boolean {
      if (this.status.hp <= 0) {
        this.die(this.status.hunger <= 0 ? "饥寒交迫而死" : "体力耗尽");
        return false;
      }
      return true;
    },

    // 死亡处理
    die(reason: string) {
      this.gameState = "ended";
      this.moveToScene("dead_001");
      console.log(`Player died: ${reason}`);
    },
  },
});
