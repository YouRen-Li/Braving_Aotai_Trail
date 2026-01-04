<template>
  <view class="game-container" :style="sanityStyle">
    <!-- 动态背景层 -->
    <background-layer />

    <!-- 昼夜遮罩层 [NEW] -->
    <day-night-overlay :is-night="isNight" :has-vision="hasVision" />

    <!-- 伤害血红特效 -->
    <view class="damage-flash" :class="{ active: showDamageFlash }"></view>

    <!-- 精神错乱 Glitch 特效 -->
    <view class="glitch-overlay" v-if="showGlitch">
      <text v-for="n in 20" :key="n" class="glitch-char" :style="randomGlitchStyle()">
        {{ randomChar() }}
      </text>
    </view>

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
        <text class="story-text" :class="{ 'text-distort': showGlitch }">{{ displayedText }}</text>
        <text v-if="isTyping" class="cursor">|</text>
      </view>
    </scroll-view>

    <!-- 操作区 -->
    <view class="action-area" :class="{ disabled: isTyping }">
      <view v-for="(choice, index) in currentScene.choices" :key="index" class="choice-btn" hover-class="btn-hover"
        @click="onChoose(choice)">
        <text class="btn-text">{{ choice.text }}</text>
        <text v-if="choice.cost" class="cost-hint">
          {{ formatCost(choice.cost) }}
        </text>
      </view>
      <!-- Night Warning -->
      <view v-if="isNight && !hasVision" class="night-warning">
        <text>⚠️ 天黑路滑，视野受限 (高风险)</text>
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
import BackgroundLayer from './components/BackgroundLayer.vue';
import DayNightOverlay from './components/DayNightOverlay.vue'; // [NEW]
import { useTypewriter } from '@/utils/composables/useTypewriter';

const gameStore = useGameStore();
const currentScene = computed(() => gameStore.currentScene);
const showInventory = ref(false);
const showDamageFlash = ref(false);

// Day/Night State [NEW]
const isNight = computed(() => gameStore.status.isNight);
const hasVision = computed(() => gameStore.hasVision);

// Sanity Visuals
const sanity = computed(() => gameStore.status.sanity);
const showGlitch = computed(() => sanity.value <= 30);

const sanityStyle = computed(() => {
  const s = sanity.value;
  let grayscale = 0;
  let blur = 0;
  let hue = 0;

  if (s < 60) {
    grayscale = (60 - s) / 60; // 0 to 1
  }
  if (s < 30) {
    blur = (30 - s) / 10; // 0 to 3px
    hue = (30 - s) * 2; // 0 to 60deg
  }

  return {
    filter: `grayscale(${grayscale}) blur(${blur}px) hue-rotate(${hue}deg)`
  };
});

// 打字机特效
const { displayedText, isTyping, start, skip } = useTypewriter();

// 监听剧情变化，重新播放打字机
watch(() => currentScene.value.id, (newId) => {
  start(currentScene.value.text);
}, { immediate: true });

// 监听HP变化，触发受伤特效
watch(() => gameStore.status.hp, (newHp, oldHp) => {
  if (newHp < oldHp) {
    showDamageFlash.value = true;
    setTimeout(() => {
      showDamageFlash.value = false;
    }, 300);
  }
});

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
  if (cost.sanity) text += `(${cost.sanity > 0 ? '-' : '+'}${Math.abs(cost.sanity)}理智) `;
  return text;
};

// Glitch Helpers
const randomChar = () => {
  const chars = '!@#$%^&*()_+-=[]{}|;:,.<>?/~';
  return chars[Math.floor(Math.random() * chars.length)];
};

const randomGlitchStyle = () => {
  return {
    top: Math.random() * 100 + '%',
    left: Math.random() * 100 + '%',
    fontSize: (Math.random() * 40 + 20) + 'rpx',
    opacity: Math.random()
  };
};
</script>

<style lang="scss" scoped>
.game-container {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  color: #fff;
  overflow: hidden;
  transition: filter 1s ease; // Smooth transition for sanity effects
}

.damage-flash {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: radial-gradient(circle, transparent 50%, rgba(255, 0, 0, 0.6) 100%);
  pointer-events: none;
  opacity: 0;
  transition: opacity 0.1s;
  z-index: 10;

  &.active {
    opacity: 1;
  }
}

// Glitch Overlay
.glitch-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 5;
  overflow: hidden;
}

.glitch-char {
  position: absolute;
  color: rgba(255, 0, 255, 0.5);
  font-family: monospace;
  animation: twitch 0.1s infinite;
}

@keyframes twitch {
  0% {
    transform: translate(0, 0);
  }

  25% {
    transform: translate(2px, 2px);
  }

  50% {
    transform: translate(-2px, -2px);
  }

  75% {
    transform: translate(-2px, 2px);
  }

  100% {
    transform: translate(2px, -2px);
  }
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

  &.text-distort {
    text-shadow: 2px 0 red, -2px 0 blue;
  }
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
  position: relative;
  z-index: 30; // Above overlay so we can still click

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

.night-warning {
  text-align: center;
  color: #ffcc00;
  font-size: 24rpx;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    opacity: 0.7;
  }

  50% {
    opacity: 1;
  }

  100% {
    opacity: 0.7;
  }
}
</style>
