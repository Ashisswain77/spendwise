/**
 * Theme management utility for SpendWise.
 * Persists theme preference across sessions in localStorage.
 */

export function getStoredTheme() {
  if (typeof window === 'undefined') return 'light'
  const saved = localStorage.getItem('spendwise_theme')
  if (saved === 'dark' || saved === 'light') return saved
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

export function applyTheme(theme) {
  if (typeof document === 'undefined') return
  const root = document.documentElement

  // Temporarily disable all CSS transitions for an instant, seamless toggle
  const css = document.createElement('style')
  css.appendChild(
    document.createTextNode(
      `*, *::before, *::after {
        -webkit-transition: none !important;
        -moz-transition: none !important;
        -o-transition: none !important;
        -ms-transition: none !important;
        transition: none !important;
      }`
    )
  )
  document.head.appendChild(css)

  if (theme === 'dark') {
    root.classList.add('dark')
  } else {
    root.classList.remove('dark')
  }
  localStorage.setItem('spendwise_theme', theme)

  // Force synchronous style calculation, then remove temporary style element
  window.getComputedStyle(root).opacity
  requestAnimationFrame(() => {
    try {
      document.head.removeChild(css)
    } catch {
      // Element might already be removed
    }
  })
}
