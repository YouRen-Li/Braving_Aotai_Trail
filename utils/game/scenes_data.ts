// 场景数据入口文件 - 保持向后兼容
// 目录结构：
// - scenes/: 剧情场景 (map_scenes.ts, event_scenes.ts)
// - data/: 游戏数据 (items_data.ts, roles_data.ts, weather_data.ts)
// - types/: 类型定义 (index.ts)
// - utils/: 工具函数 (audio_manager.ts, sanity_utils.ts)

export type { ChoiceCost, SceneChoice, Scene } from "./types";
export { mapScenes } from "./scenes/map_scenes";
export { eventScenes, randomEventIds } from "./scenes/event_scenes";

import type { Scene } from "./types";
import { mapScenes } from "./scenes/map_scenes";
import { eventScenes } from "./scenes/event_scenes";

// 合并所有场景导出（保持向后兼容）
export const scenes: Record<string, Scene> = {
  ...mapScenes,
  ...eventScenes,
};
