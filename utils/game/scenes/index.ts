// 场景数据入口文件
export type { ChoiceCost, SceneChoice, Scene } from "../types";
export { mapScenes } from "./map_scenes";
export { eventScenes, randomEventIds } from "./event_scenes";

import type { Scene } from "../types";
import { mapScenes } from "./map_scenes";
import { eventScenes } from "./event_scenes";

// 合并所有场景导出
export const scenes: Record<string, Scene> = {
  ...mapScenes,
  ...eventScenes,
};
