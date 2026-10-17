/* 음악 카드 공용 window.NMTone — 단추를 누를 때만 소리를 낸다(Web Audio). 소리를 낼 수 없으면 조용히 넘어간다. */
window.NMTone = (() => {
  "use strict";
  let ac = null;
  const ctx = () => { try { ac = ac || new (window.AudioContext || window.webkitAudioContext)(); if (ac.state === "suspended") ac.resume(); return ac; } catch (e) { return null; } };
  /* freqs: 한꺼번에 낼 진동수 목록, dur: 초 */
  function play(freqs, dur = 1.2, gain = 0.12) {
    const a = ctx(); if (!a) return false;
    const t = a.currentTime, g = a.createGain();
    g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(gain, t + 0.03); g.gain.exponentialRampToValueAtTime(0.0008, t + dur);
    g.connect(a.destination);
    [].concat(freqs).forEach((f) => { const o = a.createOscillator(); o.type = "triangle"; o.frequency.value = f; o.connect(g); o.start(t); o.stop(t + dur + 0.05); });
    return true;
  }
  return { play };
})();
