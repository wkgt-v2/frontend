export default (textarea: HTMLTextAreaElement, initialRows = 4) => {
  /* Calculate the minimum height based on the initial row count */
  const lineHeight = parseInt(window.getComputedStyle(textarea).lineHeight || "20", 10);
  const minHeight = lineHeight * initialRows;

  /* Calculate the maximum height as a percentage of the viewport height */
  const maxHeight = window.innerHeight * 0.7;

  /* Reset the height to auto to calculate the correct scrollHeight */
  textarea.style.height = "auto";

  /* Set the height to be at least the minimum height, but not exceed the maximum height */
  const newHeight = Math.max(textarea.scrollHeight, minHeight);
  textarea.style.height = `${Math.min(newHeight, maxHeight)}px`;

  /* Add overflow handling in case the content exceeds the maxHeight */
  textarea.style.overflowY = newHeight > maxHeight ? "auto" : "hidden";
};
