// Validation utilities

export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const validatePassword = (password: string): boolean => {
  return password.length >= 6;
};

export const validatePhone = (phone: string): boolean => {
  const phoneRegex = /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/;
  return phoneRegex.test(phone);
};

export const validateName = (name: string): boolean => {
  return name.trim().length >= 2;
};

export interface ValidationResult {
  isValid: boolean;
  error?: string;
}

export const validateLoginForm = (email: string, password: string): ValidationResult => {
  if (!email) {
    return { isValid: false, error: 'Email is required' };
  }
  if (!validateEmail(email)) {
    return { isValid: false, error: 'Please enter a valid email' };
  }
  if (!password) {
    return { isValid: false, error: 'Password is required' };
  }
  if (!validatePassword(password)) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  return { isValid: true };
};

export const validateRegisterForm = (
  name: string,
  email: string,
  password: string,
  phone: string
): ValidationResult => {
  if (!validateName(name)) {
    return { isValid: false, error: 'Name must be at least 2 characters' };
  }
  if (!validateEmail(email)) {
    return { isValid: false, error: 'Please enter a valid email' };
  }
  if (!validatePassword(password)) {
    return { isValid: false, error: 'Password must be at least 6 characters' };
  }
  if (!validatePhone(phone)) {
    return { isValid: false, error: 'Please enter a valid phone number' };
  }
  return { isValid: true };
};



