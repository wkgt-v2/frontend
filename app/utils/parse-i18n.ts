export default (text: string) => {
  return text.replace("_-", "<span>").replace("-_", "</span>");
}
