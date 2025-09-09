export default (price: string) => {
  const formatted = `${price || 0}`.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return `Rp${formatted}`;
}
