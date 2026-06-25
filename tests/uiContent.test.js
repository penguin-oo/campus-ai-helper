const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'index.html'), 'utf8');

test('front page presents the real SUFE canteen assistant direction', () => {
  assert.match(html, /上财保障菜配餐助手/);
  assert.match(html, /上海财经大学食堂保障菜现场/);
  assert.match(html, /真实现场/);
  assert.match(html, /精选菜品/);
  assert.match(html, /完整菜单/);
  assert.match(html, /数据状态/);
});

test('front page keeps the hero focused on the product instead of implementation caveats', () => {
  assert.doesNotMatch(html, /无需真实大模型|外部 API|模拟 AI/);
});
