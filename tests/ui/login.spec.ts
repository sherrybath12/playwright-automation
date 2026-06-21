import { expect } from '@playwright/test';
import { test } from '../../utils/fixtures';
import { config } from '../../config/env.config';

test.describe('Sauce Demo - Login Tests', () => {
  test('TC_LOGIN_001: Successful login with valid credentials', { tag: ['@staging', '@prod', '@dev'] }, async ({ loginPage, page }) => {
    await loginPage.login(config.ui.username, config.ui.password);

    await expect(page).toHaveURL(/.*inventory\.html/);
    expect(await loginPage.isInventoryVisible()).toBe(true);
  });

  test('TC_LOGIN_002: Login fails with invalid password', { tag: ['@staging', '@prod', '@dev'] }, async ({ loginPage }) => {
    await loginPage.login(config.ui.username, 'wrong_password');

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorText()).toContain('Username and password do not match');
  });

  test('TC_LOGIN_003: Login fails with invalid username', { tag: ['@staging', '@prod'] }, async ({ loginPage }) => {
    await loginPage.login('invalid_user', config.ui.password);

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorText()).toContain('Username and password do not match');
  });

  test('TC_LOGIN_004: Login fails with empty username', { tag: ['@staging'] }, async ({ loginPage }) => {
    await loginPage.login('', config.ui.password);

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorText()).toContain('Username is required');
  });

  test('TC_LOGIN_005: Login fails with empty password', { tag: ['@staging'] }, async ({ loginPage }) => {
    await loginPage.login(config.ui.username, '');

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorText()).toContain('Password is required');
  });

  test('TC_LOGIN_006: Locked out user cannot login', { tag: ['@staging'] }, async ({ loginPage }) => {
    await loginPage.login('locked_out_user', config.ui.password);

    expect(await loginPage.isErrorVisible()).toBe(true);
    expect(await loginPage.getErrorText()).toContain('Sorry, this user has been locked out');
  });

  test('TC_LOGIN_007: Login form elements are visible on page load', { tag: ['@staging'] }, async ({ loginPage }) => {
    await expect(loginPage.usernameInput).toBeVisible();
    await expect(loginPage.passwordInput).toBeVisible();
    await expect(loginPage.loginButton).toBeVisible();
  });
});
