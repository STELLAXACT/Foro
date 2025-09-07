export class AudioManager {
  private audioContext: AudioContext | null = null;

  constructor() {
    this.initAudioContext();
  }

  private initAudioContext(): void {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch (error) {
      console.warn("Web Audio API not supported:", error);
    }
  }

  // Generate sinister purchase sound
  playPurchaseSound(): void {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      // Create a sinister chord progression
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(110, this.audioContext.currentTime); // Low A
      oscillator.frequency.exponentialRampToValueAtTime(65.4, this.audioContext.currentTime + 0.3); // Low C
      oscillator.frequency.exponentialRampToValueAtTime(87.3, this.audioContext.currentTime + 0.6); // Low F
      
      gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
      gainNode.gain.linearRampToValueAtTime(0.1, this.audioContext.currentTime + 0.1);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 1);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 1);
    } catch (error) {
      console.warn("Error playing purchase sound:", error);
    }
  }

  // Generate ambient whisper sound
  playWhisperSound(): void {
    if (!this.audioContext) return;

    try {
      const bufferSize = this.audioContext.sampleRate * 2;
      const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
      const channelData = buffer.getChannelData(0);

      // Generate pink noise for whisper effect
      let b0 = 0, b1 = 0, b2 = 0, b3 = 0, b4 = 0, b5 = 0, b6 = 0;
      for (let i = 0; i < bufferSize; i++) {
        const white = Math.random() * 2 - 1;
        b0 = 0.99886 * b0 + white * 0.0555179;
        b1 = 0.99332 * b1 + white * 0.0750759;
        b2 = 0.96900 * b2 + white * 0.1538520;
        b3 = 0.86650 * b3 + white * 0.3104856;
        b4 = 0.55000 * b4 + white * 0.5329522;
        b5 = -0.7616 * b5 - white * 0.0168980;
        const pink = b0 + b1 + b2 + b3 + b4 + b5 + b6 + white * 0.5362;
        b6 = white * 0.115926;
        channelData[i] = pink * 0.05; // Very quiet
      }

      const source = this.audioContext.createBufferSource();
      const gainNode = this.audioContext.createGain();
      
      source.buffer = buffer;
      source.connect(gainNode);
      gainNode.connect(this.audioContext.destination);
      
      gainNode.gain.setValueAtTime(0.02, this.audioContext.currentTime);
      
      source.start();
      source.stop(this.audioContext.currentTime + 2);
    } catch (error) {
      console.warn("Error playing whisper sound:", error);
    }
  }

  // Generate glitch sound
  playGlitchSound(): void {
    if (!this.audioContext) return;

    try {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(this.audioContext.destination);

      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(220, this.audioContext.currentTime);
      
      // Random glitch frequency changes
      for (let i = 0; i < 10; i++) {
        const time = this.audioContext.currentTime + (i * 0.05);
        const freq = Math.random() * 1000 + 100;
        oscillator.frequency.setValueAtTime(freq, time);
      }

      gainNode.gain.setValueAtTime(0.05, this.audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.5);

      oscillator.start(this.audioContext.currentTime);
      oscillator.stop(this.audioContext.currentTime + 0.5);
    } catch (error) {
      console.warn("Error playing glitch sound:", error);
    }
  }
}

export const audioManager = new AudioManager();
