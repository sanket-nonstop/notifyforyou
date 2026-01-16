import { emailRegex, phoneRegex } from "./regex";

export const validateEmail = (email: string) => emailRegex.test(email);

export const validatePhone = (phone: string) =>
  phoneRegex.test(phone.replace(/[^0-9]/g, ""));
