export const truncateString = (n, s = "", useWordBoundary = false) => {
  if (s.length < n) return s;
  let subString = s.substr(0, n - 1);
  if (useWordBoundary) subString = subString.substr(0, subString.lastIndexOf(" "))
  return subString + "...";
};
