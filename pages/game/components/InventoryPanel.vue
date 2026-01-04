<template>
    <view class="inventory-overlay" v-if="visible" @click.self="close">
        <view class="panel">
            <!-- 标题栏 -->
            <view class="header">
                <text class="title">物资背包</text>
                <view class="close-btn" @click="close">×</view>
            </view>

            <!-- 物品网格 -->
            <scroll-view scroll-y class="grid-area">
                <view class="grid" v-if="inventory.length > 0">
                    <view v-for="(item, index) in inventory" :key="index" class="grid-item"
                        :class="{ active: selectedIndex === index }" @click="selectItem(index)">
                        <text class="item-icon">{{ item.icon || '📦' }}</text>
                        <text class="item-name">{{ item.name }}</text>
                    </view>
                </view>
                <view v-else class="empty-tip">
                    <text>背包空空如也...</text>
                </view>
            </scroll-view>

            <!-- 物品详情与操作 -->
            <view class="detail-area">
                <template v-if="selectedItem">
                    <view class="item-info">
                        <text class="info-name">{{ selectedItem.name }}</text>
                        <text class="info-desc">{{ selectedItem.description }}</text>
                    </view>
                    <button class="use-btn" :disabled="selectedItem.type !== 'consumable'" @click="handleUse">
                        {{ selectedItem.type === 'consumable' ? '使用' : '不可直接使用' }}
                    </button>
                </template>
                <view v-else class="placeholder-text">
                    点击物品查看详情
                </view>
            </view>
        </view>
    </view>
</template>

<script setup>
import { ref, computed, watch } from 'vue';
import { useGameStore } from '@/stores/modules/game';

const props = defineProps(['visible']);
const emit = defineEmits(['update:visible']);
const gameStore = useGameStore();

const inventory = computed(() => gameStore.inventory);
const selectedIndex = ref(-1);
const selectedItem = computed(() => {
    if (selectedIndex.value === -1) return null;
    return inventory.value[selectedIndex.value];
});

// 当背包打开或关闭时，重置选择
watch(() => props.visible, (val) => {
    if (!val) selectedIndex.value = -1;
});

const close = () => {
    emit('update:visible', false);
};

const selectItem = (index) => {
    selectedIndex.value = index;
};

const handleUse = () => {
    if (selectedIndex.value !== -1) {
        gameStore.useItem(selectedIndex.value);
        // 如果物品被消耗了（移除了），重置选择状态
        // Use nextTick or simple check? Store action modifies array immediately.
        // If item is removed, selectedIndex might now point to nothing or next item.
        // Let's reset for safety or check bounds.
        if (selectedIndex.value >= inventory.value.length) {
            selectedIndex.value = -1;
        }
    }
};
</script>

<style lang="scss" scoped>
.inventory-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.75);
    z-index: 200;
    display: flex;
    align-items: center;
    justify-content: center;
    animation: fadeIn 0.2s ease-out;
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
    width: 640rpx;
    height: 800rpx;
    background: #2a2a2a;
    border: 2rpx solid #3a3a3a;
    border-radius: 16rpx;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    box-shadow: 0 20rpx 40rpx rgba(0, 0, 0, 0.5);
}

.header {
    height: 88rpx;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30rpx;
    background: #1f1f1f;
    border-bottom: 2rpx solid #333;
}

.title {
    color: #fff;
    font-size: 32rpx;
    font-weight: 600;
}

.close-btn {
    color: #999;
    font-size: 48rpx;
    padding: 10rpx;
    line-height: 1;
}

.grid-area {
    flex: 1;
    background: #222;
    padding: 20rpx;
    box-sizing: border-box;
}

.grid {
    display: flex;
    flex-wrap: wrap;
    gap: 20rpx;
}

.grid-item {
    width: 120rpx;
    height: 120rpx;
    background: #333;
    border-radius: 8rpx;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    border: 2rpx solid transparent;
    transition: all 0.2s;

    &.active {
        background: #3a3a3a;
        border-color: #ffd700;
        box-shadow: 0 0 10rpx rgba(255, 215, 0, 0.2);
    }

    .item-icon {
        font-size: 48rpx;
        margin-bottom: 8rpx;
    }

    .item-name {
        font-size: 20rpx;
        color: #ccc;
        text-align: center;
        width: 100%;
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        padding: 0 4rpx;
    }
}

.empty-tip {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 300rpx;
    color: #555;
    font-size: 28rpx;
}

.detail-area {
    height: 200rpx;
    background: #1a1a1a;
    padding: 30rpx;
    border-top: 2rpx solid #333;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
}

.item-info {
    display: flex;
    flex-direction: column;
    gap: 12rpx;
}

.info-name {
    color: #ffd700;
    font-size: 32rpx;
    font-weight: 600;
}

.info-desc {
    color: #999;
    font-size: 26rpx;
    line-height: 1.4;
}

.placeholder-text {
    color: #555;
    font-size: 28rpx;
    text-align: center;
    margin-top: 60rpx;
}

.use-btn {
    background: #007aff;
    color: #fff;
    font-size: 28rpx;
    border-radius: 8rpx;
    margin: 0;

    &[disabled] {
        background: #444;
        color: #777;
    }

    &:active {
        opacity: 0.8;
    }
}
</style>
