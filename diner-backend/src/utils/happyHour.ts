/**
 * Happy Hour utility functions
 * Checks if current time is within happy hour and calculates discounted prices
 */

export interface HappyHourConfig {
  startHour: number;
  endHour: number;
}

export const getHappyHourConfig = (): HappyHourConfig => {
  return {
    startHour: parseInt(process.env.HAPPY_HOUR_START || "11"),
    endHour: parseInt(process.env.HAPPY_HOUR_END || "13"),
  };
};

export const isHappyHour = (): boolean => {
  const now = new Date();
  const currentHour = now.getHours();
  const config = getHappyHourConfig();

  return currentHour >= config.startHour && currentHour < config.endHour;
};

export const getHappyHourPrice = (
  originalPrice: number,
  discountPercent: number = 20
): number => {
  if (!isHappyHour()) {
    return originalPrice;
  }

  const discount = (originalPrice * discountPercent) / 100;
  return Math.round((originalPrice - discount) * 100) / 100; // Round to 2 decimals
};

export const isBusinessHours = (): boolean => {
  const now = new Date();
  const currentHour = now.getHours();
  const openingHour = parseInt(process.env.OPENING_HOUR || "8");
  const closingHour = parseInt(process.env.CLOSING_HOUR || "15");

  return currentHour >= openingHour && currentHour < closingHour;
};

