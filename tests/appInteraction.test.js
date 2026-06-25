const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const core = require('../src/mealCore');

const root = path.resolve(__dirname, '..');

function createFakeElement(id) {
  return {
    id,
    value: '',
    checked: false,
    innerHTML: '',
    textContent: '',
    className: '',
    handlers: {},
    dataset: {},
    classList: {
      add() {},
      remove() {}
    },
    addEventListener(type, handler) {
      this.handlers[type] = handler;
    },
    closest(selector) {
      if (selector === '[data-favorite-dish]' && this.dataset.favoriteDish) return this;
      return null;
    }
  };
}

function createHarness() {
  const ids = [
    'mealForm',
    'budget',
    'budgetValue',
    'taste',
    'avoidSpicy',
    'sceneGallery',
    'dishGallery',
    'menuBoard',
    'mealCards',
    'mealSummary',
    'scoreBadge',
    'planTitle',
    'savePlan',
    'likePlan',
    'dislikePlan',
    'dataState',
    'historyList'
  ];
  const elements = Object.fromEntries(ids.map(id => [id, createFakeElement(id)]));
  elements.budget.value = '10';
  elements.taste.value = 'balanced';

  const store = new Map();

  const localStorage = {
    getItem(key) {
      return store.has(key) ? store.get(key) : null;
    },
    setItem(key, value) {
      store.set(key, String(value));
    },
    removeItem(key) {
      store.delete(key);
    }
  };

  return {
    elements,
    localStorage
  };
}

test('browser app renders real scenes, menu data, meal plan, and persists records locally', () => {
  const harness = createHarness();
  const source = fs.readFileSync(path.join(root, 'src', 'app.js'), 'utf8');
  const sandbox = {
    window: {},
    localStorage: harness.localStorage,
    CanteenCore: core,
    crypto: { randomUUID: () => 'plan-test-id' },
    requestAnimationFrame: callback => callback()
  };
  sandbox.window = sandbox;
  sandbox.document = {
    getElementById: id => harness.elements[id] || null,
    querySelector: selector => {
      if (selector === 'input[name="goal"]:checked') return { value: 'fat_loss' };
      if (selector === '.recommendation') return createFakeElement('recommendation');
      return null;
    }
  };

  vm.runInNewContext(source, sandbox, { filename: 'app.js' });

  assert.match(harness.elements.sceneGallery.innerHTML, /官方|实拍|原始来源/);
  assert.match(harness.elements.dishGallery.innerHTML, /红烧鸡腿|蕃茄炒蛋|鲜肉包/);
  assert.match(harness.elements.menuBoard.innerHTML, /完整|快餐保障菜|点心/);
  assert.equal(harness.elements.budgetValue.textContent, '10 元');

  harness.elements.budget.value = '10';
  harness.elements.taste.value = 'light';
  harness.elements.avoidSpicy.checked = true;
  harness.elements.mealForm.handlers.submit({ preventDefault() {} });

  assert.match(harness.elements.mealCards.innerHTML, /meal-card/);
  assert.match(harness.elements.mealSummary.innerHTML, /预算使用|蛋白质|推荐理由/);
  assert.match(harness.elements.planTitle.textContent, /轻盈控卡/);

  const preferences = JSON.parse(harness.localStorage.getItem('canteen_nutrition.preferences'));
  assert.equal(preferences.goal, 'fat_loss');
  assert.deepEqual(preferences.avoidTags, ['spicy']);

  harness.elements.savePlan.handlers.click();

  const plans = JSON.parse(harness.localStorage.getItem('canteen_nutrition.plans'));
  assert.equal(plans.length, 1);
  assert.equal(plans[0].usesExternalApi, false);
});
