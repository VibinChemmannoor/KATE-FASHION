export const ENCRYPTION_ALGORITHM = "aes-256-gcm";
export const ENCRYPTION_IV_BYTES = 12;
export const ENCRYPTION_TAG_BYTES = 16;

export const AUTH_COOKIE_NAME = "session";
export const MILLISECONDS_IN_SECOND = 1000;
export const ONE_DAY_SECONDS = 60 * 60 * 24;
export const AUTH_SESSION_DAYS = 7;
export const AUTH_COOKIE_MAX_AGE = ONE_DAY_SECONDS * AUTH_SESSION_DAYS;
export const SESSION_TOKEN_BYTES = 32;

export const AUTH_RATE_LIMIT_MAX = 10;
export const AUTH_RATE_LIMIT_WINDOW = "1m";

export const USERNAME_MIN = 3;
export const USERNAME_MAX = 20;
export const PASSWORD_MIN = 8;
export const PHONE_MIN = 7;
export const BABY_NAME_MAX = 50;
export const BCRYPT_SALT_ROUNDS = 10;
