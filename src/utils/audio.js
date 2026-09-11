import { Howl } from 'howler';

// Web Audio API buffer generator for synthesized retro cooking sound effects
class SoundManager {
  constructor() {
    this.muted = false;
    this.rollingHowl = null;
    this.initAudioContext();
  }

  initAudioContext() {
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      this.ctx = new AudioCtx();
    } catch (e) {
      console.warn('Web Audio API not supported', e);
    }
  }

  playClick() {
    if (this.muted) return;
    try {
      const ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(150, ctx.currentTime + 0.05);

      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.05);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // Fallback silent handle
    }
  }

  playTick() {
    if (this.muted) return;
    try {
      const ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(800, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(400, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {}
  }

  playRoll(intensity = 1.0) {
    if (this.muted) return;
    try {
      const ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      if (this.rollingNode) return; // Already playing continuous roll noise

      // Create white noise buffer for rolling friction sound
      const bufferSize = ctx.sampleRate * 0.5;
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }

      const noise = ctx.createBufferSource();
      noise.buffer = buffer;
      noise.loop = true;

      // Lowpass filter to simulate wooden rolling pin friction on dough
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(250 + Math.min(intensity * 150, 400), ctx.currentTime);

      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.15 * Math.min(intensity, 1.2), ctx.currentTime);

      noise.connect(filter);
      filter.connect(gain);
      gain.connect(ctx.destination);

      noise.start();
      this.rollingNode = noise;
      this.rollingGain = gain;
      this.rollingFilter = filter;
    } catch (e) {}
  }

  updateRoll(intensity = 1.0) {
    if (this.rollingFilter && this.rollingGain && this.ctx) {
      try {
        this.rollingFilter.frequency.setValueAtTime(250 + Math.min(intensity * 200, 500), this.ctx.currentTime);
        this.rollingGain.gain.setValueAtTime(0.15 * Math.min(intensity, 1.2), this.ctx.currentTime);
      } catch (e) {}
    }
  }

  stopRoll() {
    if (this.rollingNode) {
      try {
        this.rollingNode.stop();
        this.rollingNode.disconnect();
      } catch (e) {}
      this.rollingNode = null;
      this.rollingGain = null;
      this.rollingFilter = null;
    }
  }

  playSubmit() {
    if (this.muted) return;
    try {
      const ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      const notes = [440, 554.37, 659.25]; // A major arpeggio
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.08);

        gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.08 + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.08);
        osc.stop(ctx.currentTime + idx * 0.08 + 0.3);
      });
    } catch (e) {}
  }

  playVictory(isHighscore = false) {
    if (this.muted) return;
    try {
      const ctx = this.ctx || new (window.AudioContext || window.webkitAudioContext)();
      const chords = isHighscore 
        ? [523.25, 659.25, 783.99, 1046.50] // C major triumph
        : [440, 554.37, 659.25];

      chords.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + idx * 0.1);

        gain.gain.setValueAtTime(0.3, ctx.currentTime + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + idx * 0.1 + 0.6);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(ctx.currentTime + idx * 0.1);
        osc.stop(ctx.currentTime + idx * 0.1 + 0.6);
      });
    } catch (e) {}
  }

  toggleMute() {
    this.muted = !this.muted;
    if (this.muted) {
      this.stopRoll();
    }
    return this.muted;
  }
}

export const soundManager = new SoundManager();
