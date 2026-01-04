import { defineStore } from "pinia";

declare const uni: any;

interface MetaState {
  runCount: number;
  unlockedEndings: string[]; // List of ending IDs
}

export const useMetaStore = defineStore("meta", {
  state: (): MetaState => ({
    runCount: 0,
    unlockedEndings: [],
  }),

  getters: {
    isEndingUnlocked: (state) => (endingId: string) => {
      return state.unlockedEndings.includes(endingId);
    },
    totalEndingsUnlocked: (state) => state.unlockedEndings.length,
  },

  actions: {
    // Load from storage on app launch (or store init)
    loadMeta() {
      try {
        const data = uni.getStorageSync("braving_aotai_meta_v1");
        if (data) {
          this.runCount = data.runCount || 0;
          this.unlockedEndings = data.unlockedEndings || [];
        }
      } catch (e) {
        console.error("Failed to load meta", e);
      }
    },

    saveMeta() {
      try {
        const data = {
          runCount: this.runCount,
          unlockedEndings: this.unlockedEndings,
        };
        uni.setStorageSync("braving_aotai_meta_v1", data);
      } catch (e) {
        console.error("Failed to save meta", e);
      }
    },

    incrementRun() {
      this.runCount++;
      this.saveMeta();
    },

    unlockEnding(endingId: string) {
      if (!endingId) return;
      if (!this.unlockedEndings.includes(endingId)) {
        this.unlockedEndings.push(endingId);
        this.saveMeta();
        uni.showToast({ title: "解锁新结局！", icon: "success" });
      }
    },

    // For testing
    resetMeta() {
      this.runCount = 0;
      this.unlockedEndings = [];
      this.saveMeta();
    },
  },
});
