const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const core = require('../src/mealCore');

test('recommends a meal within budget and avoids excluded tags', () => {
  const result = core.recommendMeal({
    goal: 'fat_loss',
    budget: 10,
    avoidTags: ['spicy'],
    taste: 'light'
  });

  assert.ok(result.totalPrice <= 10);
  assert.ok(result.items.length >= 3);
  assert.ok(result.items.every(item => !item.tags.includes('spicy')));
  assert.ok(result.items.every(item => item.sourceUniversity === '上海财经大学'));
  assert.equal(result.usesExternalApi, false);
});

test('returns readable reasons and nutrition score', () => {
  const result = core.recommendMeal({
    goal: 'muscle',
    budget: 16,
    avoidTags: [],
    taste: 'balanced'
  });

  assert.ok(result.score >= 0 && result.score <= 100);
  assert.ok(result.reasons.length >= 3);
  assert.match(result.summary, /公开菜单|本地规则|真实数据来源/);
});

test('varies recommendations across high scoring candidates', () => {
  const input = {
    goal: 'balanced',
    budget: 10,
    avoidTags: [],
    taste: 'balanced'
  };

  const first = core.recommendMeal(input, { random: () => 0 });
  const second = core.recommendMeal(input, { random: () => 0.99 });

  assert.ok(first.totalPrice <= input.budget);
  assert.ok(second.totalPrice <= input.budget);
  assert.notDeepEqual(
    first.items.map(item => item.id),
    second.items.map(item => item.id)
  );
  assert.ok(Math.abs(first.score - second.score) <= 8);
});

test('exposes local database schema for course documentation', () => {
  const schema = core.getDatabaseConfig();

  assert.deepEqual(Object.keys(schema.tables), ['dishes', 'preferences', 'plans', 'favorites', 'feedback']);
  assert.equal(schema.engine, 'Browser localStorage');
  assert.equal(schema.source.university, '上海财经大学');
  assert.match(schema.source.url, /gongkai\.sufe\.edu\.cn/);
});

test('uses expanded public SUFE canteen price data for named dishes', () => {
  const dishes = core.getDishes();
  const braisedChickenLeg = dishes.find(dish => dish.name === '红烧鸡腿');
  const teaEgg = dishes.find(dish => dish.name === '茶叶蛋');
  const duckBlood = dishes.find(dish => dish.name === '麻辣鸭血');

  assert.ok(dishes.length >= 50);
  assert.equal(braisedChickenLeg.price, 4);
  assert.equal(teaEgg.price, 1.5);
  assert.equal(duckBlood.price, 4);
  assert.equal(braisedChickenLeg.sourceUniversity, '上海财经大学');
  assert.match(braisedChickenLeg.sourceTitle, /学生食堂保障菜价格信息/);
});

test('uses project-local real SUFE photos and menu gallery images', () => {
  const root = path.resolve(__dirname, '..');
  const dishes = core.getDishes();
  const scenes = core.getScenePhotos();

  assert.ok(scenes.length >= 3);
  assert.ok(scenes.every(scene => scene.image.startsWith('assets/sufe-')));
  assert.ok(scenes.every(scene => fs.existsSync(path.join(root, scene.image))));
  assert.ok(dishes.every(dish => dish.image.startsWith('assets/food-')));
  assert.ok(dishes.every(dish => fs.existsSync(path.join(root, dish.image))));
});
