export type WeatherType = "sunny" | "cloudy" | "fog" | "snow" | "storm";

export interface WeatherInfo {
  name: string;
  icon: string;
  desc: string;
  costCoeff: number; // 消耗倍率 (1.0 = normal)
  hpLeak?: number; // 每回合额外扣血 (失温)
}

export const weatherData: Record<WeatherType, WeatherInfo> = {
  sunny: {
    name: "晴朗",
    icon: "☀",
    desc: "阳光明媚，视野开阔。",
    costCoeff: 1.0,
  },
  cloudy: {
    name: "多云",
    icon: "⛅",
    desc: "阴云密布，气温适宜。",
    costCoeff: 1.0,
  },
  fog: {
    name: "大雾",
    icon: "🌫",
    desc: "浓雾弥漫，能见度极低。",
    costCoeff: 1.2,
  },
  snow: {
    name: "小雪",
    icon: "🌨",
    desc: "零星雪花飘落，气温下降。",
    costCoeff: 1.3,
    hpLeak: 1,
  },
  storm: {
    name: "暴风雪",
    icon: "⚡❄",
    desc: "狂风卷着暴雪，举步维艰！",
    costCoeff: 1.8,
    hpLeak: 5,
  },
};
