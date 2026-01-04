import { defineStore } from "pinia";
import {
  scenes,
  type SceneChoice,
  type ChoiceCost,
  type Scene,
} from "@/utils/game/scenes_data";
import { items, type Item } from "@/utils/game/items_data";

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

    // 历史记录 (用于回放或结算)
    history: [],
  }),

  getters: {
    currentScene: (state): Scene =>
      scenes[state.currentSceneId] || scenes["start_001"],
    isAlive: (state): boolean => state.status.hp > 0,
  },

  actions: {
    // 初始化游戏
    initGame() {
      this.gameState = "playing";
      this.currentSceneId = "start_001";
      this.status = { hp: 100, hunger: 100, maxHp: 100, maxHunger: 100 };
      this.player.days = 1;
      this.inventory = [];
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
        // Deep copy to avoid reference issues if mutable property added later
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

    // 处理玩家选择
    handleChoice(choice: SceneChoice) {
      // 1. 记录操作
      this.history.push(`选择: ${choice.text}`);

      // 2. 扣除消耗 (Cost)
      if (choice.cost) {
        this.applyCost(choice.cost);
      }

      // 3. 执行特殊动作 (Action)
      if (choice.action) {
        this.handleAction(choice.action);
      }

      // 4. 生存检查
      if (!this.checkSurvival()) {
        return; // 如果死了，流程被 checkSurvival 接管
      }

      // 5. 场景跳转 (Target)
      if (choice.target) {
        this.moveToScene(choice.target);
      }
    },

    // 扣减数值
    applyCost(cost: ChoiceCost) {
      if (cost.hp) {
        this.status.hp = Math.max(0, this.status.hp - cost.hp);
      }
      if (cost.hunger) {
        this.status.hunger = Math.max(0, this.status.hunger - cost.hunger);
      }
    },

    // 特殊动作处理
    handleAction(action: string) {
      switch (action) {
        case "restart":
          this.initGame();
          break;
        case "rest":
          // 休息回血
          this.status.hp = Math.min(this.status.maxHp, this.status.hp + 30);
          this.player.days += 1;
          uni.showToast({ title: "休息了一晚，体力恢复", icon: "none" });
          break;
        case "check_gear":
          // 只是查看装备，不跳转，或者弹出提示
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
        this.die("体力耗尽");
        return false;
      }
      return true;
    },

    // 死亡处理
    die(reason: string) {
      this.gameState = "ended";
      this.moveToScene("dead_001"); // 强制跳转到死亡节点
      console.log(`Player died: ${reason}`);
    },
  },
});
