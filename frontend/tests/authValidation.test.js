import test from 'node:test';
import assert from 'node:assert/strict';
import { getAuthErrorMessage, passwordChecks, validateEmail, validateRegistration } from '../src/services/authValidation.js';

test('email validation accepts valid addresses and rejects malformed input', () => {
  assert.equal(validateEmail('student@example.mn'), true);
  assert.equal(validateEmail(' student@example.mn '), true);
  assert.equal(validateEmail('student.example.mn'), false);
});

test('registration validation enforces the backend password limit and matching fields', () => {
  const base = { last_name: 'Бат', first_name: 'Сурагч', email: 'student@example.mn', password: 'Strong1!', confirmPassword: 'Strong1!' };
  assert.equal(validateRegistration(base), '');
  assert.match(validateRegistration({ ...base, last_name: '  ' }), /Овгоо/);
  assert.match(validateRegistration({ ...base, first_name: '  ' }), /Нэрээ/);
  assert.match(validateRegistration({ ...base, email: 'bad-email' }), /имэйл/);
  assert.match(validateRegistration({ ...base, password: 'short', confirmPassword: 'short' }), /6-аас/);
  assert.match(validateRegistration({ ...base, password: 'Strong1!', confirmPassword: 'Other1!' }), /таарахгүй/);
  assert.match(validateRegistration({ ...base, password: 'ә'.repeat(37), confirmPassword: 'ә'.repeat(37) }), /72 байт/);
});

test('password guidance reflects the three strength checks', () => {
  assert.equal(passwordChecks('').filter((item) => item.valid).length, 0);
  assert.equal(passwordChecks('Strong1!').filter((item) => item.valid).length, 3);
});

test('authentication errors are translated without exposing backend details', () => {
  assert.match(getAuthErrorMessage({ response: { status: 401, data: { detail: 'Incorrect email or password.' } } }, 'login'), /Имэйл эсвэл нууц үг/);
  assert.match(getAuthErrorMessage({ response: { status: 400, data: { detail: 'An account with this email already exists.' } } }, 'register'), /өөр имэйл/);
  assert.match(getAuthErrorMessage(new Error('offline'), 'login'), /Сервертэй холбогдож чадсангүй/);
});
