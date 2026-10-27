// Web Speech Recognition & Synthesis 헬퍼

// SpeechRecognition 인터페이스 타입 선언
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export class SpeechHandler {
  private recognition: any = null;
  private isListening: boolean = false;

  constructor(
    private onResult: (text: string, isFinal: boolean) => void,
    private onError: (err: string) => void,
    private onStateChange: (listening: boolean) => void
  ) {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      this.recognition = new SpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.interimResults = true;
      this.recognition.lang = 'ko-KR';

      this.recognition.onstart = () => {
        this.isListening = true;
        this.onStateChange(true);
      };

      this.recognition.onend = () => {
        this.isListening = false;
        this.onStateChange(false);
      };

      this.recognition.onerror = (event: any) => {
        console.warn('SpeechRecognition error:', event.error);
        if (event.error !== 'no-speech') {
          this.onError(event.error === 'not-allowed' ? '마이크 권한이 필요합니다.' : '음성 인식 오류가 발생했습니다.');
        }
        this.isListening = false;
        this.onStateChange(false);
      };

      this.recognition.onresult = (event: any) => {
        let interimTranscript = '';
        let finalTranscript = '';

        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            finalTranscript += event.results[i][0].transcript;
          } else {
            interimTranscript += event.results[i][0].transcript;
          }
        }

        const text = finalTranscript || interimTranscript;
        if (text) {
          this.onResult(text.trim(), !!finalTranscript);
        }
      };
    }
  }

  public isSupported(): boolean {
    return !!(window.SpeechRecognition || window.webkitSpeechRecognition);
  }

  public start(): void {
    if (!this.recognition) {
      this.onError('이 브라우저는 음성 인식을 지원하지 않습니다. 크롬 브라우저를 권장합니다.');
      return;
    }
    try {
      this.recognition.start();
    } catch (e) {
      console.warn('Recognition already started or error', e);
    }
  }

  public stop(): void {
    if (this.recognition && this.isListening) {
      try {
        this.recognition.stop();
      } catch (e) {
        console.warn('Recognition stop error', e);
      }
    }
  }

  public toggle(): void {
    if (this.isListening) {
      this.stop();
    } else {
      this.start();
    }
  }

  // 글귀 음성 낭독 (TTS)
  public static speak(text: string, onEnd?: () => void): void {
    if (!('speechSynthesis' in window)) {
      alert('음성 낭독을 지원하지 않는 브라우저입니다.');
      return;
    }

    window.speechSynthesis.cancel(); // 기존 재생 취소

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'ko-KR';
    utterance.rate = 0.9; // 아침 명상에 맞게 살짝 차분하고 여유로운 속도
    utterance.pitch = 1.0;

    if (onEnd) {
      utterance.onend = onEnd;
      utterance.onerror = onEnd;
    }

    window.speechSynthesis.speak(utterance);
  }

  public static stopSpeaking(): void {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }
}
