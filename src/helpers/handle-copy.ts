export const handleCopy = (value: string) => {
  navigator.clipboard
    .writeText(value)
    .then(() => {
      console.warn("Copied to clipboard:", value);
    })
    .catch((err) => {
      console.error("Failed to copy!", err);
    });
};
