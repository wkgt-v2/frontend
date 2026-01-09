export default defineNuxtPlugin(() => {
  const colorMode = useColorMode()

  // Force dark mode on app initialization
  colorMode.preference = 'dark'

  // Watch and ensure it always stays dark
  watch(() => colorMode.value, () => {
    if (colorMode.value !== 'dark') {
      colorMode.value = 'dark'
      colorMode.preference = 'dark'
    }
  }, { immediate: true })
})
