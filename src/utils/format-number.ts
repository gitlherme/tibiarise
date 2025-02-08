export function numberToK(number: number) {
  number.toLocaleString("en-US", {
    maximumFractionDigits: 2,
    notation: "compact",
    compactDisplay: "short",
  });
}

export function formatNumberToLocaleString(number: number) {
  return number.toLocaleString();
}

export function formatNumberToLocale(number: number) {
  return Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(
    number
  );
}
