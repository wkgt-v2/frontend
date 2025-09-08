export default (e: Event) => {
  const input = e.target as HTMLInputElement;
  return input.value = input.value.replace(/[^\d]/g, "");
}
