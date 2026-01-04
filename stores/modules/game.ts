import { defineStore } from "pinia";
import {
  scenes,
  randomEventIds, // Import the list
  type SceneChoice,
  type ChoiceCost,
  type Scene,
} from "@/utils/game/scenes_data";
import { items, type Item, type ItemStats } from "@/utils/game/items_data";
import { weatherData, type WeatherType } from "@/utils/game/weather_data";

declare const uni: any;

// 定义 State 接口
interface GameState {
  gameState: "idle" | "playing" | "ended";
  currentSceneId: string;
  nextSceneId: string; // To remember where we were going before event
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
  equipment: {
    head: Item | null;
    body: Item | null;
    feet: Item | null;
    hand: Item | null;
  };
  weather: WeatherType;
  history: string[];
}

export const useGameStore = defineStore("game", {
  state: (): GameState => ({
    // 基础状态
    gameState: "idle",
    currentSceneId: "start_001",
    nextSceneId: "",

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

    // 装备栏
    equipment: {
      head: null,
      body: null,
      feet: null,
      hand: null,
    },

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

    // 统计总属性
    totalStats: (state): ItemStats => {
      let warmth = 0;
      let speed = 0;
      Object.values(state.equipment).forEach((item) => {
        if (item && item.stats) {
          warmth += item.stats.warmth || 0;
          speed += item.stats.speed || 0;
        }
      });
      return { warmth, speed };
    },
  },

  actions: {
    // 初始化游戏
    initGame() {
      this.gameState = "playing";
      this.currentSceneId = "start_001";
      this.nextSceneId = "";
      this.status = { hp: 100, hunger: 100, maxHp: 100, maxHunger: 100 };
      this.player.days = 1;
      this.inventory = [];
      this.equipment = { head: null, body: null, feet: null, hand: null }; // Reset equipment
      this.weather = "sunny";
      this.history = [];

      // 开局送点物资
      this.gainItem("water_001");
      this.gainItem("food_001");
      // 送个登山杖体验一下
      this.gainItem("gear_poles_01");

      this.saveGame();
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

    // 使用/装备物品
    useItem(index: number) {
      const item = this.inventory[index];
      if (!item) return;

      if (item.type === "gear" && item.slot) {
        this.equipItem(index);
        return;
      }

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
        this.saveGame(); // Save on use item
      } else {
        uni.showToast({ title: "暂时无法使用该物品", icon: "none" });
      }
    },

    // 装备逻辑
    equipItem(index: number) {
      const item = this.inventory[index];
      if (!item || !item.slot) return;

      const slot = item.slot;
      const currentEquip = this.equipment[slot];

      // 1. 从背包移除新装备
      this.inventory.splice(index, 1);

      // 2. 如果当前有装备，卸下放回背包
      if (currentEquip) {
        this.inventory.push(currentEquip);
      }

      // 3. 穿戴新装备
      this.equipment[slot] = item;
      uni.showToast({ title: `装备: ${item.name}`, icon: "none" });
      this.saveGame();
    },

    // 卸下逻辑
    unequipItem(slot: "head" | "body" | "feet" | "hand") {
      const item = this.equipment[slot];
      if (item) {
        this.equipment[slot] = null;
        this.inventory.push(item);
        uni.showToast({ title: `卸下: ${item.name}`, icon: "none" });
        this.saveGame();
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

      // 执行特殊动作
      if (choice.action) {
        this.handleAction(choice.action);
      }

      // 死活检查
      if (!this.checkSurvival()) {
        return;
      }

      // 场景跳转逻辑
      if (choice.target) {
        // Resume logic: go to stored nextScene
        if (choice.target === "resume") {
          if (this.nextSceneId) {
            this.moveToScene(this.nextSceneId);
            this.nextSceneId = ""; // Consume it
          } else {
            console.error("No nextSceneId to resume to!");
          }
          return;
        }

        // Random Event Trigger Logic
        // Only trigger events if we are moving to a new node (not an event or special end)
        // Simple check: does the target start with 'node_'?
        if (choice.target.startsWith("node_") && Math.random() < 0.3) {
          // 30% chance to trigger event
          this.nextSceneId = choice.target; // Store original destination
          const eventId =
            randomEventIds[Math.floor(Math.random() * randomEventIds.length)];

          // Special case: Storm event should override weather
          if (eventId === "evt_storm") {
            this.weather = "storm";
          }

          this.moveToScene(eventId);
          uni.showToast({ title: "遭遇突发事件！", icon: "none" });
        } else {
          // Normal move
          // Change weather when moving normally
          if (choice.target.startsWith("node_")) {
            this.randomizeWeather();
          }
          this.moveToScene(choice.target);
        }
      }
    },

    // 扣减数值 (核心算法：天气系数 + 饥饿惩罚)
    applyCost(cost: ChoiceCost) {
      const weatherInfo = weatherData[this.weather];
      const coeff = weatherInfo.costCoeff;
      const stats = this.totalStats; // Get current equipment stats

      // 1. 计算 hunger 消耗 (Move Speed modifier)
      // Example: Speed 10 -> reduces cost by 10%
      let hungerCost = (cost.hunger || 0) * coeff;
      if (stats.speed && stats.speed > 0) {
        const reduction = Math.min(0.5, stats.speed / 100); // Caps at 50% reduction
        hungerCost = hungerCost * (1 - reduction);
      }
      this.status.hunger = Math.max(0, this.status.hunger - hungerCost);

      // 2. 计算 HP 消耗 (Warmth modifier)
      let hpCost = (cost.hp || 0) * coeff;

      // 天气额外掉血 (失温) - Warmth reduces this!
      if (weatherInfo.hpLeak) {
        let leak = weatherInfo.hpLeak;
        // Each point of warmth reduces leak by 0.5 (example)
        if (stats.warmth) {
          leak = Math.max(0, leak - stats.warmth * 0.5);
        }
        hpCost += leak;
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
          this.saveGame();
          break;
        case "loot_supplies":
          this.gainItem("food_001");
          this.gainItem("water_001");
          if (Math.random() > 0.5) this.gainItem("gear_jacket_01"); // Lucky Loot
          uni.showToast({ title: "找到了一些物资", icon: "none" });
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
        this.saveGame(); // Auto save
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
      this.currentSceneId = "dead_001";
      this.history.push(`死因: ${reason}`);
      this.saveGame();
      console.log(`Player died: ${reason}`);
    },

    // --- 持久化 ---

    saveGame() {
      try {
        const dataToSave = {
          gameState: this.gameState,
          currentSceneId: this.currentSceneId,
          nextSceneId: this.nextSceneId,
          player: this.player,
          status: this.status,
          inventory: this.inventory,
          equipment: this.equipment, // Save equipment
          weather: this.weather,
          history: this.history,
        };
        uni.setStorageSync("braving_aotai_save_v1", dataToSave);
      } catch (e) {
        console.error("Save failed", e);
      }
    },

    loadGame(): boolean {
      try {
        const saved = uni.getStorageSync("braving_aotai_save_v1");
        if (saved && saved.currentSceneId) {
          this.gameState = saved.gameState;
          this.currentSceneId = saved.currentSceneId;
          this.nextSceneId = saved.nextSceneId || "";
          this.player = saved.player;
          this.status = saved.status;
          this.inventory = saved.inventory || [];
          this.equipment = saved.equipment || {
            head: null,
            body: null,
            feet: null,
            hand: null,
          }; // Load equipment
          this.weather = saved.weather || "sunny";
          this.history = saved.history || [];
          console.log("Game Loaded");
          return true;
        }
      } catch (e) {
        console.error("Load failed", e);
      }
      return false;
    },

    clearSave() {
      try {
        uni.removeStorageSync("braving_aotai_save_v1");
      } catch (e) {}
    },
  },
});
