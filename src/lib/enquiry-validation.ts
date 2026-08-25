export const EMAIL_MAX_LENGTH = 200;
export const PHONE_MAX_INPUT_LENGTH = 40;
export const PHONE_MIN_DIGITS = 7;
export const PHONE_MAX_DIGITS = 15;

const EMAIL_LOCAL_PATTERN = /^[A-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/i;
const DOMAIN_LABEL_PATTERN = /^[A-Z0-9](?:[A-Z0-9-]{0,61}[A-Z0-9])?$/i;
const PHONE_CHARACTERS_PATTERN = /^[+\d\s().-]+$/;

export function isValidEmailAddress(value: string) {
  const email = value.trim();
  if (!email || email.length > EMAIL_MAX_LENGTH) return false;
  if (email.indexOf("@") !== email.lastIndexOf("@")) return false;

  const [localPart, domain] = email.split("@");
  if (!localPart || !domain || localPart.length > 64 || domain.length > 253) return false;
  if (
    localPart.startsWith(".") ||
    localPart.endsWith(".") ||
    localPart.includes("..") ||
    !EMAIL_LOCAL_PATTERN.test(localPart)
  )
    return false;

  const labels = domain.split(".");
  if (labels.length < 2 || (labels.at(-1)?.length ?? 0) < 2) return false;
  return labels.every((label) => label.length <= 63 && DOMAIN_LABEL_PATTERN.test(label));
}

export function isValidPhoneNumber(value: string) {
  const phone = value.trim();
  if (!phone || phone.length > PHONE_MAX_INPUT_LENGTH || !PHONE_CHARACTERS_PATTERN.test(phone))
    return false;

  const plusSigns = phone.match(/\+/g)?.length ?? 0;
  if (plusSigns > 1 || (plusSigns === 1 && !phone.startsWith("+"))) return false;

  const digits = phone.replace(/\D/g, "");
  if (digits.length < PHONE_MIN_DIGITS || digits.length > PHONE_MAX_DIGITS) return false;
  return !/^(\d)\1+$/.test(digits);
}
