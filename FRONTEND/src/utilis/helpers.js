/**
 * Luhn Algorithm for credit card validation
 * @param {string} cardNumber - Credit card number to validate
 * @returns {boolean} - True if valid, false otherwise
 */
export const validateCardLuhn = (cardNumber) => {
  if (!cardNumber) return false;
  
  // Remove spaces and non-digits
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (cleaned.length < 13 || cleaned.length > 19) return false;
  
  let sum = 0;
  let isEven = false;
  
  // Loop through values starting from the rightmost digit
  for (let i = cleaned.length - 1; i >= 0; i--) {
    let digit = parseInt(cleaned[i], 10);
    
    if (isEven) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    
    sum += digit;
    isEven = !isEven;
  }
  
  return sum % 10 === 0;
};

/**
 * Detect card type from card number
 * @param {string} cardNumber - Credit card number
 * @returns {string} - Card type (visa, mastercard, amex, etc.)
 */
export const detectCardType = (cardNumber) => {
  const cleaned = cardNumber.replace(/\D/g, '');
  
  if (/^4/.test(cleaned)) return 'visa';
  if (/^5[1-5]/.test(cleaned)) return 'mastercard';
  if (/^3[47]/.test(cleaned)) return 'amex';
  if (/^6(?:011|5)/.test(cleaned)) return 'discover';
  
  return 'unknown';
};

/**
 * Format card number with spaces
 * @param {string} value - Raw card number
 * @returns {string} - Formatted card number
 */
export const formatCardNumber = (value) => {
  const cleaned = value.replace(/\D/g, '');
  const match = cleaned.match(/.{1,4}/g);
  return match ? match.join(' ') : cleaned;
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
export const validateEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
};

/**
 * Validate CVV
 * @param {string} cvv - CVV to validate
 * @param {string} cardType - Card type
 * @returns {boolean} - True if valid
 */
export const validateCVV = (cvv, cardType = 'visa') => {
  const cleaned = cvv.replace(/\D/g, '');
  if (cardType === 'amex') {
    return cleaned.length === 4;
  }
  return cleaned.length === 3;
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} - Formatted number
 */
export const formatNumber = (num) => {
  return num.toLocaleString();
};

