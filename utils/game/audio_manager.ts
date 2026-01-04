declare const uni: any;

class AudioManager {
  private bgmContext: any;
  private sfxContext: any;
  private currentBgm: string | null = null;

  constructor() {
    this.bgmContext = uni.createInnerAudioContext();
    this.bgmContext.loop = true;
    this.bgmContext.autoplay = true;

    this.sfxContext = uni.createInnerAudioContext();
    this.sfxContext.loop = false;

    // Error handling
    this.bgmContext.onError((res: any) => {
      console.warn("BGM Error", res);
    });
  }

  playBGM(type: "wind" | "sunny" | "calm") {
    if (this.currentBgm === type) return;

    let src = "";
    switch (type) {
      case "wind":
        src = "/static/audio/bgm_wind.mp3";
        break;
      case "sunny":
        src = "/static/audio/bgm_sunny.mp3";
        break;
      default:
        src = "";
    }

    if (src) {
      this.bgmContext.src = src;
      this.bgmContext.play();
      this.currentBgm = type;
    } else {
      this.bgmContext.stop();
      this.currentBgm = null;
    }
  }

  playSFX(type: "heartbeat" | "scream" | "step") {
    let src = "";
    switch (type) {
      case "heartbeat":
        src = "/static/audio/sfx_heartbeat.mp3";
        break;
      case "scream":
        src = "/static/audio/sfx_scream.mp3";
        break;
      case "step":
        src = "/static/audio/sfx_step.mp3";
        break;
    }

    if (src) {
      this.sfxContext.src = src;
      this.sfxContext.play();
    }
  }

  stopBGM() {
    this.bgmContext.stop();
    this.currentBgm = null;
  }
}

export const audioManager = new AudioManager();
