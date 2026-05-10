import Lenis from 'lenis'

let instance = null

export function getLenis() { return instance }

export function initLenis() {
  if (instance) return instance
  instance = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
  })
  function raf(time) { instance.raf(time); requestAnimationFrame(raf) }
  requestAnimationFrame(raf)
  return instance
}

export function destroyLenis() {
  if (instance) { instance.destroy(); instance = null }
}
