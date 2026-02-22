import http from 'k6/http';
import { check, sleep } from 'k6';
import { randomIntBetween } from 'https://jslib.k6.io/k6-utils/1.4.0/index.js';
import { htmlReport } from "https://raw.githubusercontent.com/benc-uk/k6-reporter/main/dist/bundle.js";
import { textSummary } from "https://jslib.k6.io/k6-summary/0.0.2/index.js";

export const options = {
  // A simple load test scenario
  stages: [
    { duration: '10s', target: 50 },  // Ramp up to 5 users over 10s
    { duration: '30s', target: 100 }, // Stay at 10 users for 30s
    { duration: '10s', target: 30 },  // Ramp down to 0 users
  ],
  thresholds: {
    http_req_duration: ['p(95)<500'], // 95% of requests should be below 500ms
  },
};

const BASE_URL = 'http://localhost:8080/api';

// Kendari Office Coordinates
const OFFICE_LAT = -3.98929160;
const OFFICE_LONG = 122.50396530;

export default function () {
  // 1. SELECT USER
  // We use the seeded employees: karyawan1 to karyawan5
  const userIndex = randomIntBetween(1, 5);
  const username = `karyawan${userIndex}`;
  const password = `karyawan${userIndex}`;

  // 2. LOGIN
  const loginPayload = JSON.stringify({
    username: username,
    password: password,
  });

  const loginRes = http.post(`${BASE_URL}/login`, loginPayload, {
    headers: { 'Content-Type': 'application/json' },
  });

  check(loginRes, {
    'login successful': (r) => r.status === 200,
    'has token': (r) => r.json('token') !== undefined,
  });

  const token = loginRes.json('token');
  const authHeaders = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${token}`,
  };

  if (!token) {
    console.error(`Login failed for ${username}`);
    return;
  }

  // 3. CLOCK IN
  // Simulate being slightly off the exact center but within ~100m
  // Latitude: +/- 0.001 is roughly 111m
  const latOffset = (Math.random() - 0.5) * 0.001; 
  const longOffset = (Math.random() - 0.5) * 0.001;

  const clockInPayload = JSON.stringify({
    latitude: OFFICE_LAT + latOffset,
    longitude: OFFICE_LONG + longOffset,
  });

  const clockInRes = http.post(`${BASE_URL}/clock-in`, clockInPayload, {
    headers: authHeaders,
  });

  check(clockInRes, {
    'clock-in successful': (r) => r.status === 200,
    'clock-in approved': (r) => r.json('status') === 'approved', // Assuming we are in radius
  });

  // 4. CHECK ATTENDANCE HISTORY
  const historyRes = http.get(`${BASE_URL}/my-attendance/today`, {
    headers: authHeaders,
  });

  check(historyRes, {
    'history retrieved': (r) => r.status === 200,
  });

  // 5. PAUSE
  sleep(1);
}

export function handleSummary(data) {
  return {
    "summary.html": htmlReport(data),
    stdout: textSummary(data, { indent: " ", enableColors: true }),
  };
}
