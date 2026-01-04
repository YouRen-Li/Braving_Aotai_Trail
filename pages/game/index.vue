<template>
  <view class="game-container">
    <!-- 状态栏 -->
    <game-status />

    <!-- 背包按钮 -->
    <bag-button @click="showInventory = true" />

    <!-- 背包弹窗 -->
    <inventory-panel v-model:visible="showInventory" />

    <!-- 结算弹窗 -->
    <game-over-panel />

    <!-- 剧情显示区 -->
    <scroll-view scroll-y class="story-area" @click="handleTextClick">
      <view class="story-content">
        <text class="story-text">{{ displayedText }}</text>
        <text v-if="isTyping" class="cursor">|</text>
      </view>
    </scroll-view>

    <!-- 操作区 -->
    <view class="action-area" :class="{ disabled: isTyping }">
      <view v-for="(choice, index) in currentScene.choices" :key="index" class="choice-btn" hover-class="btn-hover"
        @click="onChoose(choice)">
        <text class="btn-text">{{ choice.text }}</text>
        <text v-if="choice.cost && (choice.cost.hp || choice.cost.hunger)" class="cost-hint">
          {{ formatCost(choice.cost) }}
        </text>
      </view>
    </view>
  </view>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue';
import { useGameStore } from '@/stores/modules/game';
import GameStatus from './components/GameStatus.vue';
import BagButton from './components/BagButton.vue';
import InventoryPanel from './components/InventoryPanel.vue';
import GameOverPanel from './components/GameOverPanel.vue';
import { useTypewriter } from '@/utils/composables/useTypewriter';

const gameStore = useGameStore();
const currentScene = computed(() => gameStore.currentScene);
const showInventory = ref(false);

// 打字机特效
const { displayedText, isTyping, start, skip } = useTypewriter();

// 监听剧情变化，重新播放打字机
watch(() => currentScene.value.id, (newId) => {
  start(currentScene.value.text);
}, { immediate: true });

const handleTextClick = () => {
  if (isTyping.value) {
    skip();
  }
};

const onChoose = (choice) => {
  if (isTyping.value) return; // 打字时不让点选项
  gameStore.handleChoice(choice);
};

const formatCost = (cost) => {
  let text = '';
  if (cost.hp) text += `(-${cost.hp}HP) `;
  if (cost.hunger) text += `(-${cost.hunger}饱食) `;
  return text;
};
</script>

<style lang="scss" scoped>
.game-container {
  width: 100%;
  height: 100vh;
  background: #1a1a1a;
  display: flex;
  flex-direction: column;
  color: #fff;
}

.story-area {
  flex: 1;
  width: 100%;
  padding: 160rpx 40rpx 40rpx; // Top padding for status bar
  box-sizing: border-box;
}

.story-content {
  padding-bottom: 40rpx;
}

.story-text {
  font-size: 36rpx;
  line-height: 1.8;
  color: #e0e0e0;
  text-align: justify;
  letter-spacing: 2rpx;
}

.cursor {
  font-weight: bold;
  opacity: 1;
  animation: blink 1s infinite;
  color: #fff;
}

@keyframes blink {

  0%,
  100% {
    opacity: 1;
  }

  50% {
    opacity: 0;
  }
}

.action-area {
  padding: 40rpx 40rpx 80rpx; // Safe area
  background: linear-gradient(180deg, transparent, rgba(0, 0, 0, 0.8));
  display: flex;
  flex-direction: column;
  gap: 24rpx;
  transition: opacity 0.3s;

  &.disabled {
    opacity: 0.5;
    pointer-events: none;
  }
}

.choice-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1rpx solid rgba(255, 255, 255, 0.2);
  padding: 30rpx;
  border-radius: 12rpx;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: all 0.2s;

  &.btn-hover {
    background: rgba(255, 255, 255, 0.2);
    transform: scale(0.99);
  }
}

.btn-text {
  font-size: 32rpx;
  font-weight: 500;
}

.cost-hint {
  font-size: 24rpx;
  color: #ff6b6b; // Reddish for costs
}
</style>
