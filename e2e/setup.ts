import { beforeAll, beforeEach, afterAll } from '@jest/globals';
import { device, expect } from 'detox';

beforeAll(async () => {
  await device.launchApp();
});

beforeEach(async () => {
  await device.reloadReactNative();
});

afterAll(async () => {
  await device.terminateApp();
});

// Extend Jest matchers with Detox matchers
expect.extend(require('detox/runners/jest/matchers'));
