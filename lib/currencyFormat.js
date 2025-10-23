export function formatCurrency(amount) {
  // Convert to number if not already, and format with commas if the number has 3 or more digits
  const num = typeof amount === 'number' ? amount : Number(amount);
  if (isNaN(num)) return amount;
  return num.toLocaleString();
}

// Example usage:
// const price = 12500;
// console.log(formatCurrency(price)); // "12,500"
