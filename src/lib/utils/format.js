/**
 * Format price in INR
 * @param {number} amount
 * @returns {string}
 */
export function formatPrice(amount) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Format date to readable string
 * @param {string|Date} date
 * @returns {string}
 */
export function formatDate(date) {
  return new Intl.DateTimeFormat("en-IN", {
    year: "numeric",
    month: "long",
    day: "numeric",
  }).format(new Date(date));
}

/**
 * Generate a unique order number
 * @returns {string}
 */
export function generateOrderNumber() {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `KF-${timestamp}-${random}`;
}

/**
 * Calculate delivery date
 * @param {'standard'|'express'} type
 * @returns {Date}
 */
export function getEstimatedDelivery(type = "standard") {
  const days = type === "express" ? 3 : 7;
  const date = new Date();
  date.setDate(date.getDate() + days);
  return date;
}
