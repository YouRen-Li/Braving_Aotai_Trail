<template>
  <view class="game-container">
    <!-- 视觉特效层 (受Sanity/DayNight影响) -->
    <view class="visual-layer" :style="sanityStyle">
      <background-layer />
      <day-night-overlay :is-night="isNight" :has-vision="hasVision" />
    </view>

    <!-- 伤害血红特效 (UI层) -->
    <view class="damage-flash" :class="{ active: showDamageFlash }"></view>

    <!-- 精神错乱 Glitch 特效 (Overlay) -->
    <view class="glitch-overlay" v-if="showGlitch">
      <text v-for="n in 20" :key="n" class="glitch-char" :style="randomGlitchStyle()">
        {{ randomChar() }}
      </text>
    </view>

    <!-- 状态栏 (不受滤镜影响) -->
    <game-status />

    <!-- 背包按钮 -->
    <bag-button @click="showInventory = true" />

    <!-- 背包弹窗 -->
    <inventory-panel v-model:visible="showInventory" />

    <!-- 结算弹窗 -->
    <game-over-panel />

    <!-- 游戏通知 -->
    <game-notification :visible="gameStore.notification.visible" :message="gameStore.notification.message"
      :type="gameStore.notification.type" />

    <!-- 剧情显示区 -->
    <scroll-view scroll-y class="story-area" @click="handleTextClick">
      <view class="story-content">
        <text class="story-text" :class="{ 'text-distort': showGlitch }">{{ displayedText }}</text>
        <text v-if="isTyping" class="cursor">|</text>
      </view>
    </scroll-view>

    <!-- 操作区 -->
    <view class="action-area" :class="{ disabled: isTyping }">
      <view v-for="(choice, index) in filteredChoices" :key="index" class="choice-btn" hover-class="btn-hover"
        @click="onChoose(choice)">
        <text class="btn-text" :class="{ 'glitch-text': showGlitch }">{{ corruptedChoiceText(choice.text) }}</text>
        <!-- Removed Cost Hint for Realism -->
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
import GameStatus from '@/pages/components/GameStatus.vue';
import BagButton from '@/pages/components/BagButton.vue';
import InventoryPanel from '@/pages/components/InventoryPanel.vue';
import GameOverPanel from '@/pages/components/GameOverPanel.vue';
import BackgroundLayer from '@/pages/components/BackgroundLayer.vue';
import DayNightOverlay from '@/pages/components/DayNightOverlay.vue';
import GameNotification from '@/pages/components/GameNotification.vue';
import { useTypewriter } from '@/utils/composables/useTypewriter';
import { getCorruptedText } from '@/utils/game/utils/sanity_utils';

const gameStore = useGameStore();

const currentScene = computed(() => gameStore.currentScene);
// [NEW] Filter choices by role
const filteredChoices = computed(() => {
  if (!currentScene.value || !currentScene.value.choices) return [];
  const roleId = gameStore.player.roleId;
  return currentScene.value.choices.filter(c => {
    // 1. Check Role
    if (c.requiredRole && c.requiredRole !== roleId) return false;

    // 2. [NEW] Check Condition
    if (c.condition) {
      const flags = gameStore.worldFlags;
      // Handle simple 'flag' or '!flag'
      if (c.condition.startsWith('!')) {
        const key = c.condition.slice(1);
        if (flags[key]) return false; // If !flag but flag is true -> hide
      } else {
        if (!flags[c.condition]) return false; // If flag but flag is false -> hide
      }
    }

    return true;
  });
});

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

  const style = {
    filter: `grayscale(${grayscale}) blur(${blur}px) hue-rotate(${hue}deg)`
  };

  // Screen Shake at critical sanity
  if (s < 20) {
    const shake = Math.random() * 10 - 5; // -5 to 5px
    style.transform = `translateX(${shake}px)`;
  }

  return style;
});

// [NEW] Glitch Methods
const randomChar = () => {
  const chars = '!@#$%^&*()_+-={}[]|;:,.<>?/☠️❌';
  return chars[Math.floor(Math.random() * chars.length)];
};

const randomGlitchStyle = () => {
  const top = Math.random() * 100;
  const left = Math.random() * 100;
  return {
    top: `${top}%`,
    left: `${left}%`,
    fontSize: `${Math.random() * 40 + 20}rpx`,
    opacity: Math.random(),
    transform: `rotate(${Math.random() * 360}deg)`
  };
};

const corruptedChoiceText = (text) => {
  return getCorruptedText(text, gameStore.status.sanity);
};

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

const isProcessing = ref(false);

const onChoose = (choice) => {


  if (isProcessing.value) return; // Debounce
  isProcessing.value = true;
  setTimeout(() => { isProcessing.value = false; }, 500);

  gameStore.handleChoice(choice);
};

const formatCost = (cost) => {
  let text = '';
  // Cost > 0 means loss (e.g. cost: { hp: 5 } -> -5 HP)
  // Cost < 0 means gain (e.g. cost: { hunger: -10 } -> +10 Hunger)

  if (cost.hp) {
    text += `(${cost.hp > 0 ? '-' : '+'}${Math.abs(cost.hp)}生命) `;
  }
  if (cost.hunger) {
    text += `(${cost.hunger > 0 ? '-' : '+'}${Math.abs(cost.hunger)}饱食) `;
  }
  if (cost.sanity) {
    text += `(${cost.sanity > 0 ? '-' : '+'}${Math.abs(cost.sanity)}理智) `;
  }
  return text;
};

// ... (Rest of logic)
</script>

<style lang="scss">
/* Global page fix */
page {
  background-color: #000;
  height: 100%;
  overflow: hidden;
}
</style>

<style lang="scss" scoped>
/* 容器定义 */
.game-container {
  width: 100%;
  height: 100vh;
  position: relative;
  display: flex;
  flex-direction: column;
  color: #fff;
  overflow: hidden;
  // REMOVED transition: filter - keeping it on visual-layer instead
}

.visual-layer {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
  transition: filter 1s ease;
}

// ... (Previous styles)

.story-area {
  flex: 1;
  width: 100%;
  padding: calc(180rpx + var(--status-bar-height)) 40rpx 40rpx; // Dynamic top padding
  box-sizing: border-box;
}

.story-content {
  padding: 40rpx;
  background: rgba(0, 0, 0, 0.6); // Dark background for readability
  backdrop-filter: blur(10px);
  border-radius: 16rpx;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 10rpx 30rpx rgba(0, 0, 0, 0.3);
  margin-bottom: 40rpx;
}

.story-text {
  font-size: 34rpx; // Slightly smaller for better density
  line-height: 1.8;
  color: #e0e0e0;
  text-align: justify;
  letter-spacing: 2rpx;

  &.text-distort {
    text-shadow: 2px 0 red, -2px 0 blue;
    animation: text-shake 0.1s infinite;
    color: #ff4d4d; // Subtle red tint
  }
}

// [NEW] Text Animations
@keyframes text-shake {
  0% {
    transform: translate(0, 0);
  }

  25% {
    transform: translate(2rpx, 2rpx);
  }

  50% {
    transform: translate(-2rpx, -2rpx);
  }

  75% {
    transform: translate(-2rpx, 2rpx);
  }

  100% {
    transform: translate(2rpx, -2rpx);
  }
}

// ...

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
    opacity: 0.8; // Changed from 0.5 to indicate it's active but busy
    // pointer-events: none; // REMOVED: Allow clicking to skip
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

  &.glitch-text {
    font-family: "Courier New", Courier, monospace; // Glitchy font
    color: #ff4d4d;
    animation: text-shake 0.2s infinite;
  }
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
