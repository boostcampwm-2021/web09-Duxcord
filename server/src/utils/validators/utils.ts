export const VALIDATE_OPTIONS = { validationError: { target: false, value: false } };
export const REGEXP = {
  LOGIN_ID: /^[a-z][a-z0-9]{5,14}$/,
  USERNAME: /^[^\s]{1,15}$/,
  PASSWORD: /^(?=.*?[a-zA-Z])(?=.*?[0-9])(?=.*?[#?!@$ %^&*-]).{8,}$/,
};
