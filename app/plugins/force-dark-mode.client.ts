export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()

  // Force dark mode always, regardless of system preference
  colorMode.preference = 'dark'

  // Directly manipulate HTML element class to ensure dark class is always present
  if (import.meta.client) {
    const html = document.documentElement

    // Function to ensure dark class is present
    const forceDarkClass = () => {
      // Remove light mode class if present
      html.classList.remove('light')

      // Add dark class if not present
      if (!html.classList.contains('dark')) {
        html.classList.add('dark')
      }
    }

    // Force immediately
    forceDarkClass()

    // Watch and ensure it stays dark
    watch(colorMode, () => {
      if (colorMode.value !== 'dark') {
        colorMode.value = 'dark'
      }
      forceDarkClass()
    }, { immediate: true })

    // Use MutationObserver to detect any class changes and revert to dark
    const observer = new MutationObserver(() => {
      forceDarkClass()
    })

    observer.observe(html, {
      attributes: true,
      attributeFilter: ['class']
    })

    // Also force on window focus (some browsers reset theme on tab focus)
    window.addEventListener('focus', forceDarkClass)

    // Cleanup on plugin unload
    onScopeDispose(() => {
      observer.disconnect()
      window.removeEventListener('focus', forceDarkClass)
    })
  }
})
