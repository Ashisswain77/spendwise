/**
 * Smoothly scrolls to a target element by selector or ID, accounting for the sticky navbar height.
 */
export function smoothScrollTo(targetId, offset = 72) {
  if (!targetId || targetId === '#') {
    window.scrollTo({ top: 0, behavior: 'smooth' })
    return
  }

  const id = targetId.startsWith('#') ? targetId.slice(1) : targetId
  const element = document.getElementById(id)
  if (!element) return

  const elementPosition = element.getBoundingClientRect().top + window.scrollY
  const offsetPosition = Math.max(0, elementPosition - offset)

  window.scrollTo({
    top: offsetPosition,
    behavior: 'smooth',
  })
}

