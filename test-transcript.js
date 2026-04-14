// Quick test script for transcript upload endpoint
// Run with: node test-transcript.js

const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');

const BASE_URL = 'http://localhost:3000';

// Replace with actual credentials
const TEST_EMAIL = 'test@example.com';
const TEST_PASSWORD = 'testpassword123';

async function makeRequest(url, options = {}, body = null) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const isHttps = urlObj.protocol === 'https:';
    const lib = isHttps ? https : http;

    const reqOptions = {
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + urlObj.search,
      method: options.method || 'GET',
      headers: options.headers || {},
    };

    const req = lib.request(reqOptions, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(body);
    req.end();
  });
}

async function signIn() {
  console.log('1. Signing in...');
  const response = await makeRequest(`${BASE_URL}/api/auth/v1/token?grant_type=password`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
  }, JSON.stringify({ email: TEST_EMAIL, password: TEST_PASSWORD }));

  if (response.status === 200) {
    console.log('   ✓ Signed in successfully');
    return response.data.access_token;
  } else {
    console.log('   ✗ Sign in failed:', response.data);
    return null;
  }
}

async function uploadTranscript(token) {
  console.log('2. Uploading transcript...');

  // Create a simple test PDF buffer (in real test, use actual PDF)
  const boundary = '----FormBoundary' + Date.now();
  const pdfBuffer = Buffer.from('%PDF-1.4 test content');

  let body = `--${boundary}\r\n`;
  body += 'Content-Disposition: form-data; name="file"; filename="test.pdf"\r\n';
  body += 'Content-Type: application/pdf\r\n\r\n';
  body += pdfBuffer;
  body += `\r\n--${boundary}--\r\n`;

  const response = await makeRequest(`${BASE_URL}/api/transcript/upload`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': `multipart/form-data; boundary=${boundary}`,
    },
  }, body);

  if (response.status === 200) {
    console.log('   ✓ Upload successful!');
    console.log('   Parsed data:', JSON.stringify(response.data, null, 2));
  } else {
    console.log('   ✗ Upload failed:', response.data);
  }
}

async function testWithoutAuth() {
  console.log('\n--- Testing without authentication ---');
  const response = await makeRequest(`${BASE_URL}/api/transcript/upload`, {
    method: 'POST',
  });

  if (response.status === 401) {
    console.log('✓ Correctly returns 401 Unauthorized');
  } else {
    console.log('Unexpected response:', response);
  }
}

async function main() {
  console.log('=== Transcript Upload API Test ===\n');

  // Test 1: Without auth (should return 401)
  await testWithoutAuth();

  // Test 2: With auth (requires valid credentials)
  const token = await signIn();
  if (token) {
    await uploadTranscript(token);
  }

  console.log('\n=== Test Complete ===');
}

main().catch(console.error);
