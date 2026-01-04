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

  public isMusicOn: boolean = true;

  playBGM(type: "wind" | "sunny" | "calm" | "snow" | "storm") {
    // If music is globally off, just record what SHOULD be playing but don't play it
    if (!this.isMusicOn) {
      this.currentBgm = type;
      return;
    }

    if (this.currentBgm === type) return;

    let src = "";
    switch (type) {
      case "wind":
      case "snow":
      case "storm":
        src = "/static/audio/Winter.wav";
        break;
      case "sunny":
      case "calm":
        src = "/static/audio/Ambient.wav";
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

  toggleMusic() {
    this.isMusicOn = !this.isMusicOn;
    if (this.isMusicOn) {
      // Resume logic: if we have a current BGM type (or default to one), play it
      if (this.currentBgm) {
        // Force replay smoothly
        const type = this.currentBgm as any;
        this.currentBgm = null; // Reset to force playBGM to act
        this.playBGM(type);
      }
    } else {
      this.bgmContext.pause();
    }
    return this.isMusicOn;
  }

  playSFX(type: "heartbeat" | "scream" | "step") {
    let src = "";
    switch (type) {
      case "heartbeat":
        // src = "/static/audio/sfx_heartbeat.mp3"; // Missing
        break;
      case "scream":
        // src = "/static/audio/sfx_scream.mp3"; // Missing
        break;
      case "step":
        // src = "/static/audio/sfx_step.mp3"; // Missing
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
