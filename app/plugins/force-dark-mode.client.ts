export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()

  // Force dark mode always, regardless of system preference
  colorMode.preference = 'dark'

  // Watch and ensure it stays dark
  watch(colorMode, () => {
    if (colorMode.value !== 'dark') {
      colorMode.value = 'dark'
    }
  }, { immediate: true })
})
