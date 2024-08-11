export function numberToK(number: number) {
  number.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    notation: "compact",
    compactDisplay: "short",
  });
}

export function formatNumberToLocale(number: number) {
  return number.toLocaleString();
}
