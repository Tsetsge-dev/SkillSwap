export const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

export const passwordChecks = (password) => [
  { label: '6-аас доошгүй тэмдэгт', valid: password.length >= 6 },
  { label: 'Том, жижиг үсэг хослуулах', valid: /[a-z]/.test(password) && /[A-Z]/.test(password) },
  { label: 'Тоо эсвэл тусгай тэмдэгт нэмэх', valid: /[0-9]|[^a-zA-Z]/.test(password) },
];

export const validateRegistration = ({ full_name, email, password, confirmPassword }) => {
  if (!full_name.trim()) return 'Нэрээ оруулна уу.';
  if (!validateEmail(email)) return 'Зөв имэйл хаяг оруулна уу.';
  if (password.length < 6) return 'Нууц үг 6-аас доошгүй тэмдэгт байна.';
  if (new TextEncoder().encode(password).length > 72) return 'Нууц үг 72 байтаас хэтрэхгүй байна.';
  if (password !== confirmPassword) return 'Нууц үгүүд хоорондоо таарахгүй байна.';
  return '';
};

export const getAuthErrorMessage = (error, flow) => {
  const status = error?.response?.status;
  const detail = error?.response?.data?.detail;
  if (flow === 'login') {
    if (status === 401) return 'Имэйл эсвэл нууц үг буруу байна. Дахин шалгана уу.';
    if (!error?.response) return 'Сервертэй холбогдож чадсангүй. Интернэтээ шалгаад дахин оролдоно уу.';
    return 'Нэвтрэхэд алдаа гарлаа. Түр хүлээгээд дахин оролдоно уу.';
  }
  if (typeof detail === 'string' && detail.toLowerCase().includes('already exists')) {
    return 'Энэ имэйлээр бүртгэл үүссэн байна. Нэвтрэх эсвэл өөр имэйл ашиглана уу.';
  }
  if (Array.isArray(detail)) return 'Оруулсан мэдээллээ шалгаад дахин оролдоно уу.';
  if (!error?.response) return 'Сервертэй холбогдож чадсангүй. Интернэтээ шалгаад дахин оролдоно уу.';
  return 'Бүртгэл үүсгэж чадсангүй. Мэдээллээ шалгаад дахин оролдоно уу.';
};
