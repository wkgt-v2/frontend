export default (phone: string) => {
  return phone.slice(0, -4).replace(/./g, '*') + phone.slice(-4);
}
