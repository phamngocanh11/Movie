const test = require("node:test");
const assert = require("node:assert/strict");

const {
  validateEmail,
  validateUsername,
  validatePassword,
  validateName,
} = require("../utils/validation");

test("validates email format", () => {
  assert.equal(validateEmail("user@example.com"), true);
  assert.equal(validateEmail("not-an-email"), false);
});

test("validates username format", () => {
  assert.equal(validateUsername("user_123"), true);
  assert.equal(validateUsername("ab"), false);
  assert.equal(validateUsername("invalid-name"), false);
});

test("validates password strength", () => {
  assert.equal(validatePassword("Password1"), true);
  assert.equal(validatePassword("password"), false);
  assert.equal(validatePassword("PASSWORD1"), false);
});

test("validates display name length", () => {
  assert.equal(validateName("Nguyen Van A"), true);
  assert.equal(validateName("A"), false);
  assert.equal(validateName("A".repeat(51)), false);
});
