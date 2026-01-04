import { ref } from "vue";

export function useTypewriter() {
  const displayedText = ref("");
  const isTyping = ref(false);
  let fullText = "";
  let currentIndex = 0;
  let timer: any = null;

  const start = (text: string, speed = 30) => {
    // Reset state
    if (timer) clearTimeout(timer);
    fullText = text;
    displayedText.value = "";
    currentIndex = 0;
    isTyping.value = true;

    const typeChar = () => {
      if (currentIndex < fullText.length) {
        displayedText.value += fullText.charAt(currentIndex);
        currentIndex++;
        timer = setTimeout(typeChar, speed);
      } else {
        isTyping.value = false;
        timer = null;
      }
    };

    typeChar();
  };

  const skip = () => {
    if (isTyping.value) {
      if (timer) clearTimeout(timer);
      displayedText.value = fullText;
      isTyping.value = false;
      timer = null;
    }
  };

  const reset = () => {
    if (timer) clearTimeout(timer);
    displayedText.value = "";
    isTyping.value = false;
    fullText = "";
  };

  return {
    displayedText,
    isTyping,
    start,
    skip,
    reset,
  };
}
