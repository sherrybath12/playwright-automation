import { test, expect } from '@playwright/test';
import { config } from '../../config/env.config';

const API_BASE = config.apiBaseUrl;
const VALID_CREDS = {
  username: config.api.username,
  password: config.api.password,
};

test.describe('DummyJSON - Auth API Tests', () => {
  test('TC_API_001: POST /auth/login - successful authentication returns tokens', { tag: ['@staging', '@prod', '@dev'] }, async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: { ...VALID_CREDS, expiresInMins: 30 },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
    expect(body).toHaveProperty('id');
    expect(body.username).toBe(VALID_CREDS.username);
    expect(typeof body.accessToken).toBe('string');
    expect(body.accessToken.length).toBeGreaterThan(0);
  });

  test('TC_API_002: POST /auth/login - response includes full user profile', { tag: ['@staging', '@prod', '@dev'] }, async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: VALID_CREDS,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toHaveProperty('firstName');
    expect(body).toHaveProperty('lastName');
    expect(body).toHaveProperty('email');
    expect(body).toHaveProperty('gender');
    expect(body).toHaveProperty('image');
  });

  test('TC_API_003: POST /auth/login - fails with invalid credentials', { tag: ['@staging', '@prod'] }, async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/login`, {
      data: { username: 'wronguser', password: 'wrongpass' },
    });

    expect(response.status()).toBe(400);
    const body = await response.json();
    expect(body).toHaveProperty('message');
  });

  test('TC_API_004: GET /auth/me - returns current user with valid Bearer token', { tag: ['@staging'] }, async ({ request }) => {
    const loginResponse = await request.post(`${API_BASE}/auth/login`, {
      data: VALID_CREDS,
    });
    const { accessToken } = await loginResponse.json();

    const response = await request.get(`${API_BASE}/auth/me`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toHaveProperty('id');
    expect(body.username).toBe(VALID_CREDS.username);
    expect(body).toHaveProperty('email');
  });

  test('TC_API_005: GET /auth/me - returns 401 without authorization token', { tag: ['@staging'] }, async ({ request }) => {
    const response = await request.get(`${API_BASE}/auth/me`);

    expect(response.status()).toBe(401);
  });

  test('TC_API_006: POST /auth/refresh - issues new tokens from valid refresh token', { tag: ['@staging'] }, async ({ request }) => {
    const loginResponse = await request.post(`${API_BASE}/auth/login`, {
      data: VALID_CREDS,
    });
    const { refreshToken } = await loginResponse.json();

    const response = await request.post(`${API_BASE}/auth/refresh`, {
      data: { refreshToken, expiresInMins: 30 },
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body).toHaveProperty('accessToken');
    expect(body).toHaveProperty('refreshToken');
    expect(typeof body.accessToken).toBe('string');
    expect(body.accessToken.length).toBeGreaterThan(0);
  });

  test('TC_API_007: POST /auth/refresh - fails with invalid refresh token', { tag: ['@staging'] }, async ({ request }) => {
    const response = await request.post(`${API_BASE}/auth/refresh`, {
      data: { refreshToken: 'invalid_refresh_token' },
    });

    expect(response.status()).toBe(401);
  });
});
