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
import { audioManager } from "@/utils/game/audio_manager";
import { useMetaStore } from "@/stores/modules/meta";
import { roles, type Role } from "@/utils/game/roles_data"; // [NEW]

declare const uni: any;

// 定义 State 接口
interface GameState {
  gameState: "idle" | "playing" | "ended";
  currentSceneId: string;
  nextSceneId: string;
  player: {
    name: string;
    identity: string;
    days: number;
    roleId?: string; // [NEW]
  };
  status: {
    hp: number;
    hunger: number;
    sanity: number;
    maxHp: number;
    maxHunger: number;
    maxSanity: number;
    isNight: boolean;
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
  worldFlags: {
    // [NEW] Randomized world state
    shuiwozi_water: boolean; // true = has water
    liang2_blocked: boolean; // true = landslide
  };
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
      roleId: "student",
    },

    // 生存数值
    status: {
      hp: 100,
      hunger: 100,
      sanity: 100,
      maxHp: 100,
      maxHunger: 100,
      maxSanity: 100,
      isNight: false,
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

    // 世界随机状态
    worldFlags: {
      shuiwozi_water: true, // Default, will be randomized in init
      liang2_blocked: false,
    },
  }),

  getters: {
    currentScene: (state: GameState): Scene => {
      const scene = scenes[state.currentSceneId] || scenes["start_001"];
      // [NEW] Dynamic Weather Text override
      if (scene.weatherText && scene.weatherText[state.weather]) {
        return {
          ...scene,
          text: scene.weatherText[state.weather],
        };
      }
      return scene;
    },
    isAlive: (state: GameState): boolean =>
      state.status.hp > 0 && state.status.sanity > 0,
    currentWeatherInfo: (state: GameState) => weatherData[state.weather],

    // Helper to check if item exists
    hasItem: (state: GameState) => (itemId: string) => {
      return state.inventory.some((i) => i.id === itemId);
    },

    // Vision Check
    hasVision: (state: GameState): boolean => {
      if (!state.status.isNight) return true; // Day = Vision
      return state.equipment.head?.id === "gear_headlamp_01"; // Night needs Lamp
    },

    // 统计总属性
    totalStats: (state: GameState): ItemStats => {
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

    // [NEW] Role Traits
    playerTraits: (state: GameState): string[] => {
      const roleId = state.player.roleId;
      if (!roleId) return [];
      const role = roles.find((r: Role) => r.id === roleId);
      return role ? role.traits : [];
    },
  },

  actions: {
    // 初始化游戏 [UPDATED]
    initGame(this: any, roleId: string = "student") {
      const metaStore = useMetaStore();
      metaStore.loadMeta();
      metaStore.incrementRun();

      // Find Role
      const role = roles.find((r: Role) => r.id === roleId) || roles[0];

      this.gameState = "playing";
      this.currentSceneId = "start_001";
      this.nextSceneId = "";

      this.player.days = 1;
      this.player.roleId = role.id;
      this.player.identity = role.name;

      // Stats from Role
      this.status = {
        hp: role.stats.maxHp,
        hunger: role.stats.maxHunger,
        sanity: role.stats.maxSanity,
        maxHp: role.stats.maxHp,
        maxHunger: role.stats.maxHunger,
        maxSanity: role.stats.maxSanity,
        isNight: false,
      };

      this.inventory = [];
      this.equipment = { head: null, body: null, feet: null, hand: null };
      this.weather = "sunny";
      this.history = [];

      // Items from Role
      role.items.forEach((itemId: string) => this.gainItem(itemId));

      audioManager.playBGM("sunny");

      // [NEW] Randomize World Flags
      this.worldFlags = {
        shuiwozi_water: Math.random() > 0.4, // 60% Chance of water
        liang2_blocked: Math.random() > 0.8, // 20% Chance of blocked path
      };

      console.log("World Flags:", this.worldFlags);

      this.saveGame();
      console.log("Game Initialized with role:", role.name);
    },

    // 获得物品
    gainItem(this: any, itemId: string) {
      const item = items[itemId];
      if (item) {
        this.inventory.push({ ...item });
        // Don't toast during init
        if (this.gameState === "playing" && this.history.length > 0) {
          uni.showToast({ title: `获得: ${item.name}`, icon: "none" });
        }
      }
    },

    // 使用/装备物品
    useItem(this: any, index: number) {
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
        if (item.effect.sanity) {
          this.status.sanity = Math.min(
            this.status.maxSanity,
            this.status.sanity + item.effect.sanity
          );
        }

        // 提示信息
        let msg = item.effect.msg;

        // [TRAIT] Field Medic
        if (this.playerTraits.includes("field_medic")) {
          if (item.effect.hp && item.effect.hp > 0) {
            const bonus = Math.floor(item.effect.hp * 0.5);
            this.status.hp = Math.min(
              this.status.maxHp,
              this.status.hp + bonus
            );
            msg += ` (医术加成+${bonus})`;
          }
        }

        if (msg) {
          uni.showToast({ title: msg, icon: "none" });
        }

        // 移除消耗品
        this.inventory.splice(index, 1);
        this.saveGame();
      } else {
        uni.showToast({ title: "暂时无法使用该物品", icon: "none" });
      }
    },

    // 装备逻辑
    equipItem(this: any, index: number) {
      const item = this.inventory[index];
      if (!item || !item.slot) return;

      const slot = item.slot;
      const currentEquip = this.equipment[slot];

      this.inventory.splice(index, 1);
      if (currentEquip) {
        this.inventory.push(currentEquip);
      }

      this.equipment[slot] = item;
      uni.showToast({ title: `装备: ${item.name}`, icon: "none" });
      this.saveGame();
    },

    // 卸下逻辑
    unequipItem(this: any, slot: "head" | "body" | "feet" | "hand") {
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

      if (["storm", "snow"].includes(this.weather)) {
        audioManager.playBGM("wind");
      } else {
        audioManager.playBGM("sunny");
      }

      const info = weatherData[this.weather];
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
        // Resume logic
        if (choice.target === "resume") {
          if (this.nextSceneId) {
            this.moveToScene(this.nextSceneId);
            this.nextSceneId = "";
          } else {
            console.error("No nextSceneId to resume to!");
            uni.showToast({ title: "路径迷失，原地徘徊...", icon: "none" });
            // Fallback: Stay in current scene or go to a safe default if needed
            // For now, doing nothing keeps player in current scene which is safe
          }
          return;
        }

        // Random Event logic
        if (choice.target.startsWith("node_") && Math.random() < 0.3) {
          this.nextSceneId = choice.target;
          const eventId =
            randomEventIds[Math.floor(Math.random() * randomEventIds.length)];

          if (eventId === "evt_storm") {
            this.weather = "storm";
            audioManager.playBGM("wind");
          }

          this.moveToScene(eventId);
          uni.showToast({ title: "遭遇突发事件！", icon: "none" });
        } else {
          // Normal move logic
          if (choice.target.startsWith("node_")) {
            this.randomizeWeather();
            // this.status.isNight = true; // Fixed: Don't force night on every move
          }
          this.moveToScene(choice.target);
        }
      }
    },

    // 扣减数值
    applyCost(cost: ChoiceCost) {
      const weatherInfo = weatherData[this.weather];
      const coeff = weatherInfo.costCoeff;
      const stats = this.totalStats;

      // 1. Hunger
      let hungerCost = (cost.hunger || 0) * coeff;

      // [TRAIT] High Metabolism (Athlete)
      if (this.playerTraits.includes("high_metabolism")) {
        hungerCost *= 1.25; // +25% Hunger drain
      }

      if (stats.speed && stats.speed > 0) {
        const reduction = Math.min(0.5, stats.speed / 100);
        hungerCost = hungerCost * (1 - reduction);
      }
      this.status.hunger = Math.max(0, this.status.hunger - hungerCost);

      // 2. HP
      let hpCost = (cost.hp || 0) * coeff;
      if (weatherInfo.hpLeak) {
        let leak = weatherInfo.hpLeak;
        if (stats.warmth) {
          leak = Math.max(0, leak - stats.warmth * 0.5);
        }
        hpCost += leak;
      }
      if (this.status.hunger <= 0) {
        hpCost += 10;
        uni.showToast({ title: "饥饿难耐，生命流失！", icon: "none" });
      }

      // Night Fall Risk
      if (this.status.isNight && !this.hasVision) {
        // [TRAIT] Iron Will (Veteran) ignores fear of dark, but still risks falling physically?
        // User said: "Not afraid of black". Usually refers to Sanity.
        // Falling is physical. Let's keep physical risk but maybe lower it?

        if ((cost.hp || 0) > 0 || (cost.hunger || 0) > 0) {
          if (Math.random() < 0.4) {
            // Veteran falls less?
            let fallChance = 0.4;
            if (this.playerTraits.includes("iron_will")) fallChance = 0.2;

            if (Math.random() < fallChance) {
              hpCost += 30;
              uni.showToast({ title: "摸黑赶路摔伤了！(-30HP)", icon: "none" });
            }
          }
        }
      }

      this.status.hp = Math.max(0, this.status.hp - hpCost);

      // 3. Sanity
      let sanityCost = cost.sanity || 0;

      // Weather Sanity Cost
      if (["fog", "storm", "snow"].includes(this.weather)) {
        // [TRAIT] PTSD Storm Calm (Veteran)
        if (
          this.playerTraits.includes("ptsd_storm_calm") &&
          this.weather === "storm"
        ) {
          // Storms calm him down (Positive Sanity)
          sanityCost -= 5; // Heals 5 sanity in storm
        } else {
          sanityCost += 2;
        }
      }

      // Night Sanity Cost
      if (this.status.isNight && !this.hasVision) {
        // [TRAIT] Iron Will (Veteran) ignores darkness fear
        if (!this.playerTraits.includes("iron_will")) {
          sanityCost += 5;
        }
      }

      this.status.sanity = Math.max(0, this.status.sanity - sanityCost);
      if (this.status.sanity <= 30) {
        uni.showToast({ title: "意识模糊，耳边传来幻听...", icon: "none" });
        if (sanityCost > 0) audioManager.playSFX("heartbeat");
      }
    },

    // 特殊动作处理
    handleAction(action: string) {
      switch (action) {
        case "restart":
          // Return to Home Page
          uni.reLaunch({ url: "/pages/index/index" });
          break;
        case "rest":
          // 3. 休息回血，消耗饱食度
          // Cost Hunger
          if (this.status.hunger < 20) {
            uni.showToast({ title: "太饿了，根本睡不着！", icon: "none" });
            return; // Cannot rest if starving
          }

          this.status.hunger = Math.max(0, this.status.hunger - 20); // Reduced from 25

          let heal = 40; // Increased base from 30
          if (this.weather === "storm") heal = 15; // Slightly better storm rest
          if (this.weather === "sunny") heal = 60; // Better sunny rest

          // [MORAL DILEMMA] Cursed Items check
          // If player has 'relic_watch' (Dead man's watch), resting is less effective/painful
          const hasCursedItem = this.inventory.some(
            (i: Item) => i.id === "relic_watch"
          );

          if (hasCursedItem) {
            uni.showToast({
              title: "死者的手表在背包里滴答作响...你彻夜难眠",
              icon: "none",
            });
            heal = Math.floor(heal * 0.5); // Heal reduced
            this.status.sanity = Math.max(0, this.status.sanity - 10); // Sanity drops instead of efficient gain
            // Still advances day
          } else {
            // Normal Sanity Heal
            this.status.sanity = Math.min(
              this.status.maxSanity,
              this.status.sanity + 20
            );
          }

          this.status.hp = Math.min(this.status.maxHp, this.status.hp + heal);
          this.status.isNight = false;
          this.player.days += 1;
          this.randomizeWeather();

          if (!hasCursedItem) {
            uni.showToast({
              title: `休息一晚 (生命+${heal}, 饱食-20)`,
              icon: "none",
            });
          }
          this.saveGame();
          break;
        case "loot_supplies":
          this.gainItem("food_001");
          this.gainItem("water_001");
          if (Math.random() > 0.3) this.gainItem("gear_headlamp_01");

          this.status.sanity = Math.max(0, this.status.sanity - 10);
          audioManager.playSFX("heartbeat");
          uni.showToast({ title: "获得物资 (理智-10)", icon: "none" });
          break;
        case "check_gear":
          uni.showToast({ title: "背包状态良好，暂无异常", icon: "none" });
          break;
        case "sos":
          // SOS Logic
          // 1. Cost Sanity
          this.status.sanity = Math.max(0, this.status.sanity - 15);

          // 2. Calculate Success Rate
          let sosChance = 0.3; // Base chance 30%
          if (
            this.currentSceneId.includes("village") ||
            this.currentSceneId.includes("road")
          )
            sosChance = 0.9;
          if (this.weather === "storm") sosChance = 0.0;
          if (this.weather === "fog") sosChance = 0.1;
          if (this.weather === "snow") sosChance = 0.2;
          if (this.status.isNight) sosChance *= 0.5;

          if (Math.random() < sosChance) {
            uni.showToast({
              title: "求教信号发送成功！等待救援...",
              icon: "success",
            });
            setTimeout(() => {
              this.moveToScene("end_rescue");
            }, 1500);
          } else {
            uni.showToast({ title: "无信号 / 天气恶劣无法救援", icon: "none" });
            audioManager.playSFX("heartbeat"); // Panic sound
          }
          break;
        case "look_back":
          this.status.sanity = Math.min(
            this.status.maxSanity,
            this.status.sanity + 5
          );
          uni.showToast({
            title: "回望来路，内心平静了一些 (理智+5)",
            icon: "none",
          });
          break;
        default:
          console.warn("Unknown action:", action);
      }
    },

    // 场景跳转
    moveToScene(sceneId: string) {
      if (scenes[sceneId]) {
        this.currentSceneId = sceneId;
        this.saveGame();

        // [FIX] Success/Retreat endings now trigger Settlement Screen
        if (sceneId.startsWith("end_")) {
          const metaStore = useMetaStore();
          metaStore.unlockEnding(sceneId);

          this.gameState = "ended";
          this.history.push(`结局: ${sceneId}`); // Push key for panel to read
          console.log(`Ending reached: ${sceneId}`);
        }
      } else {
        console.error(`Scene not found: ${sceneId}`);
      }
    },

    // 生存检查
    checkSurvival(): boolean {
      if (this.status.hp <= 0) {
        this.die(this.status.hunger <= 0 ? "dead_starve" : "dead_cold");
        audioManager.stopBGM();
        return false;
      }
      if (this.status.sanity <= 0) {
        this.die("dead_sanity");
        audioManager.stopBGM();
        audioManager.playSFX("scream");
        return false;
      }
      return true;
    },

    // 死亡处理
    die(endingKey: string) {
      this.gameState = "ended";
      this.currentSceneId = "dead_001";
      this.history.push(`结局: ${endingKey}`);
      this.saveGame();

      const metaStore = useMetaStore();
      metaStore.unlockEnding(endingKey);

      console.log(`Player died: ${endingKey}`);
    },

    // --- 持久化 ---

    saveGame() {
      try {
        const dataToSave = {
          gameState: this.gameState,
          currentSceneId: this.currentSceneId,
          nextSceneId: this.nextSceneId,
          player: this.player, // Includes roleId
          status: this.status,
          inventory: this.inventory,
          equipment: this.equipment,
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

          // Migration / Safety check for old saves
          if (this.status.sanity === undefined) this.status.sanity = 100;
          if (this.status.maxSanity === undefined) this.status.maxSanity = 100;
          if (this.status.isNight === undefined) this.status.isNight = false;
          if (this.player.roleId === undefined) this.player.roleId = "student"; // Default

          this.inventory = saved.inventory || [];
          this.equipment = saved.equipment || {
            head: null,
            body: null,
            feet: null,
            hand: null,
          };
          this.weather = saved.weather || "sunny";
          this.history = saved.history || [];

          if (this.gameState === "playing") {
            audioManager.playBGM(
              ["storm", "snow"].includes(this.weather) ? "wind" : "sunny"
            );
          }

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
