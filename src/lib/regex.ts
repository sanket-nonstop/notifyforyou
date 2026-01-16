export const nameRegex =
  /^(?=.{2,30}$)(?!.*\s{2,})[A-Za-z]+(?:[ '-][A-Za-z]+)*$/;
export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
export const phoneRegex = /^[0-9]{10,15}$/;
export const passwordRegex =
  /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,24}$/;
