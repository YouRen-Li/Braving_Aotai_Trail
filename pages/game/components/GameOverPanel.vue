<template>
    <view class="game-over-overlay" v-if="visible">
        <view class="panel">
            <view class="header">
                <text class="title">生命终结</text>
            </view>

            <view class="content">
                <text class="days-label">存活天数</text>
                <text class="days-value">{{ days }}</text>

                <view class="divider"></view>

                <text class="reason-label">最终结局</text>
                <text class="reason-value">{{ deathReason }}</text>

                <view class="rank-badge">
                    <text class="rank-text">称号: {{ evaluationTitle }}</text>
                </view>
            </view>

            <button class="restart-btn" hover-class="btn-hover" @click="onRestart">
                返回主页
            </button>
        </view>
    </view>
</template>

<script setup>
import { computed, ref, watch } from 'vue';
import { useGameStore } from '@/stores/modules/game';
import { scenes } from '@/utils/game/scenes_data'; // Import scenes to look up titles/text if needed, but we used IDs

const gameStore = useGameStore();

const visible = ref(false);
const days = computed(() => gameStore.player.days);

// Watch game state to trigger modal with delay
watch(() => gameStore.gameState, (newVal) => {
    if (newVal === 'ended') {
        // Give user 2 seconds to read the death text before showing modal
        setTimeout(() => {
            visible.value = true;
        }, 3000); // 3 seconds
    } else {
        visible.value = false;
    }
}, { immediate: true });

const endingId = computed(() => {
    const history = gameStore.history;
    if (history.length > 0) {
        const last = history[history.length - 1];
        if (last.startsWith('结局:')) return last.split(':')[1].trim();
        if (last.startsWith('死因:')) return last.split(':')[1].trim(); // Compatible
    }
    return '';
});

// Extract death reason text (Narrative) from the ID
const deathReason = computed(() => {
    const eid = endingId.value;
    if (!eid) return '在这片荒野中永远沉睡...';

    // Map ID to a short summary if possible, or just use a poetic line
    const map = {
        'dead_001': '长眠于秦岭深处',
        'dead_starve': '倒在了寻找食物的路上',
        'dead_cold': '失温，在幻觉中睡去',
        'dead_sanity': '精神崩溃，迷失在风雪中',
        'end_lost_23km': '走进跑道，不知所踪',
        'end_caught': '非法穿越被劝返',
        'end_rescue': '体力不支获救',
        'end_retreat': '知难而退，保留火种',
        'end_success': '完成小鳌太穿越',
        'end_game_cleared': '完成鳌太全线穿越',
    };
    return map[eid] || '旅途终结';
});

const evaluationTitle = computed(() => {
    const eid = endingId.value;
    const d = days.value;

    // 1. Success Outcomes
    if (eid === 'end_game_cleared') return '鳌太征服者'; // Conqueror
    if (eid === 'end_success') return '雪线行者'; // Snow Walker
    if (eid === 'end_retreat') return '明智的生存者'; // Wise Survivor (High praise for retreating)

    // 2. Failure Outcomes specific
    if (eid === 'end_caught') return '受训斥的驴友';
    if (eid === 'end_rescue') return '幸存者';
    if (eid === 'end_lost_23km') return '失落的灵魂';

    // 3. Deaths - Based on days
    if (d < 2) return '初涉险阻'; // Beginner
    if (d < 4) return '莽撞的行者'; // Hasty
    if (d < 6) return '风雪归人'; // Snow Returner
    return '秦岭之魂'; // Soul of Qinling (High respect for long survival)
});

const onRestart = () => {
    uni.reLaunch({ url: '/pages/index/index' });
};
</script>

<style lang="scss" scoped>
.game-over-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.9);
    z-index: 999;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 1s ease-out;
}

@keyframes fadeIn {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.panel {
    width: 600rpx;
    background: linear-gradient(180deg, #2a0e0e 0%, #1a1a1a 100%);
    border: 2rpx solid #5a1e1e;
    border-radius: 20rpx;
    padding: 40rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    box-shadow: 0 0 60rpx rgba(255, 0, 0, 0.1);
}

.header {
    margin-bottom: 40rpx;
}

.title {
    color: #ff4d4d;
    font-size: 48rpx;
    font-weight: 900;
    letter-spacing: 4rpx;
    text-shadow: 0 0 20rpx rgba(255, 77, 77, 0.5);
}

.content {
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 60rpx;
}

.days-label {
    color: #999;
    font-size: 24rpx;
    margin-bottom: 10rpx;
}

.days-value {
    color: #fff;
    font-size: 80rpx;
    font-weight: 700;
    font-family: monospace;
}

.divider {
    width: 100rpx;
    height: 2rpx;
    background: #444;
    margin: 30rpx 0;
}

.reason-label {
    color: #999;
    font-size: 24rpx;
    margin-bottom: 10rpx;
}

.reason-value {
    color: #ccc;
    font-size: 30rpx;
    text-align: center;
    line-height: 1.4;
    max-width: 90%;
}

.rank-badge {
    margin-top: 40rpx;
    background: #ffd700;
    color: #000;
    padding: 8rpx 20rpx;
    border-radius: 8rpx;

    .rank-text {
        font-weight: 800;
        font-size: 28rpx;
    }
}

.restart-btn {
    width: 100%;
    height: 88rpx;
    line-height: 88rpx;
    background: #ff4d4d;
    color: #fff;
    font-size: 32rpx;
    font-weight: 600;
    border-radius: 44rpx;

    &.btn-hover {
        background: #d93636;
        transform: scale(0.98);
    }
}
</style>
