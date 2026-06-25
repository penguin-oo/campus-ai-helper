const dataSource = {
  university: '上海财经大学',
  title: '学生食堂保障菜价格信息（2023-2024学年）',
  url: 'https://gongkai.sufe.edu.cn/a6/f3/c13786a42739/page.htm',
  publishedAt: '2024-09-03',
  note: '菜名和售价来自上海财经大学信息公开页；热量、蛋白质、标签和推荐分数为课程作品中的本地估算。'
};

const scenePhotos = [
  {
    id: 'buffet-line',
    title: '保障菜现场长台',
    image: 'assets/sufe-scene-buffet.jpg',
    sourceUrl: 'https://news.sufe.edu.cn/f5/47/c13908a259399/page.htm',
    caption: '来自上财后勤公开报道的食堂现场照片。'
  },
  {
    id: 'tasting',
    title: '学生试吃投票',
    image: 'assets/sufe-scene-tasting.jpg',
    sourceUrl: 'https://news.sufe.edu.cn/f5/49/c17806a259401/page.htm',
    caption: '来自上财校园新闻的试吃活动照片。'
  },
  {
    id: 'dessert',
    title: '点心窗口实拍',
    image: 'assets/sufe-scene-dessert.jpg',
    sourceUrl: 'https://news.sufe.edu.cn/f5/49/c17806a259401/page.htm',
    caption: '来自上财校园新闻的点心展示照片。'
  }
];

const sourceFields = {
  sourceUniversity: dataSource.university,
  sourceTitle: dataSource.title,
  sourceUrl: dataSource.url
};

const dishImages = {
  braisedPork: 'assets/food-braised-pork.jpg',
  chickenLeg: 'assets/food-chicken-leg.jpg',
  friedChicken: 'assets/food-fried-chicken.jpg',
  kungPao: 'assets/food-kung-pao.jpg',
  curryChicken: 'assets/food-curry-chicken.jpg',
  tomatoEgg: 'assets/food-tomato-egg.jpg',
  eggplant: 'assets/food-eggplant.jpg',
  tofu: 'assets/food-mapo-tofu.jpg',
  greens: 'assets/food-greens.jpg',
  congee: 'assets/food-congee.jpg',
  centuryCongee: 'assets/food-century-congee.jpg',
  baozi: 'assets/food-baozi.jpg',
  mantou: 'assets/food-mantou.jpg',
  teaEgg: 'assets/food-tea-egg.jpg',
  youtiao: 'assets/food-youtiao.jpg',
  steamedEgg: 'assets/food-steamed-egg.jpg'
};

const featuredDishNames = [
  '红烧鸡腿',
  '肉糜蒸蛋',
  '蕃茄炒蛋',
  '青椒土豆丝',
  '清蒸鸡腿',
  '宫爆鸡丁',
  '皮蛋瘦肉粥',
  '鲜肉包'
];

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function pick(pool, index) {
  return pool[index % pool.length];
}

function chooseDishImage(spec) {
  const name = spec.name;

  if (name.includes('粥')) return name.includes('皮蛋') ? dishImages.centuryCongee : dishImages.congee;
  if (name.includes('包')) return dishImages.baozi;
  if (name.includes('馒头') || name.includes('花卷')) return dishImages.mantou;
  if (name.includes('茶叶蛋') || name.includes('白煮蛋')) return dishImages.teaEgg;
  if (name.includes('油条') || name.includes('麻球') || name.includes('煎饼')) return dishImages.youtiao;
  if (name.includes('番') || name.includes('蕃')) return dishImages.tomatoEgg;
  if (name.includes('茄子')) return dishImages.eggplant;
  if (name.includes('豆腐') || name.includes('素肠') || name.includes('鸭血')) return dishImages.tofu;
  if (name.includes('蒸蛋') || name.includes('炒蛋')) return dishImages.steamedEgg;
  if (name.includes('青菜') || name.includes('白菜') || name.includes('豆芽') || name.includes('土豆') || name.includes('生菜') || name.includes('苋菜') || name.includes('豇豆') || name.includes('花菜') || name.includes('芹菜')) return dishImages.greens;
  if (name.includes('宫爆') || name.includes('双椒') || name.includes('鸡丁') || name.includes('鸡柳')) return dishImages.kungPao;
  if (name.includes('咖喱')) return dishImages.curryChicken;
  if (name.includes('炸') || name.includes('椒盐') || name.includes('鸡米花') || name.includes('锅包')) return dishImages.friedChicken;
  if (name.includes('鸡腿') || name.includes('鸡块')) return dishImages.chickenLeg;
  return dishImages.braisedPork;
}

function createDish(spec, index) {
  return {
    id: `${slugify(spec.name)}-${index}`,
    name: spec.name,
    type: spec.type,
    menuGroup: spec.menuGroup,
    window: spec.window,
    price: spec.price,
    kcal: spec.kcal,
    protein: spec.protein,
    tags: [...spec.tags],
    image: chooseDishImage(spec),
    featured: featuredDishNames.includes(spec.name),
    ...sourceFields
  };
}

const fastLightSpecs = [
  { name: '红烧肉圆', type: 'main', menuGroup: '轻食素菜', window: '快餐保障菜', price: 1.5, kcal: 240, protein: 12, tags: ['budget', 'warm', 'balanced'] },
  { name: '红烧大排', type: 'main', menuGroup: '轻食素菜', window: '快餐保障菜', price: 2.8, kcal: 410, protein: 24, tags: ['budget', 'high-protein', 'warm'] },
  { name: '红烧肉', type: 'main', menuGroup: '轻食素菜', window: '快餐保障菜', price: 3.2, kcal: 430, protein: 22, tags: ['warm', 'balanced'] },
  { name: '炒青菜', type: 'side', menuGroup: '轻食素菜', window: '快餐保障菜', price: 2, kcal: 90, protein: 4, tags: ['light', 'low-fat', 'budget', 'fresh'] },
  { name: '清炒杭白菜', type: 'side', menuGroup: '轻食素菜', window: '快餐保障菜', price: 2, kcal: 80, protein: 3, tags: ['light', 'low-fat', 'budget'] },
  { name: '青椒绿豆芽', type: 'side', menuGroup: '轻食素菜', window: '快餐保障菜', price: 2, kcal: 85, protein: 4, tags: ['light', 'budget', 'fresh'] },
  { name: '青椒土豆丝', type: 'side', menuGroup: '轻食素菜', window: '快餐保障菜', price: 2.5, kcal: 190, protein: 4, tags: ['budget', 'vegetarian', 'balanced'] },
  { name: '蒜泥生菜', type: 'side', menuGroup: '轻食素菜', window: '快餐保障菜', price: 3, kcal: 95, protein: 3, tags: ['light', 'fresh', 'low-fat'] },
  { name: '清炒苋菜', type: 'side', menuGroup: '轻食素菜', window: '快餐保障菜', price: 3, kcal: 110, protein: 5, tags: ['light', 'fresh', 'low-fat'] },
  { name: '南瓜小圆子', type: 'staple', menuGroup: '轻食素菜', window: '快餐保障菜', price: 3, kcal: 180, protein: 3, tags: ['warm', 'budget'] },
  { name: '麻辣豆腐', type: 'side', menuGroup: '轻食素菜', window: '快餐保障菜', price: 3, kcal: 220, protein: 11, tags: ['spicy', 'balanced', 'budget'] },
  { name: '蕃茄炒蛋', type: 'side', menuGroup: '轻食素菜', window: '快餐保障菜', price: 3, kcal: 220, protein: 13, tags: ['balanced', 'budget', 'fresh'] },
  { name: '豆腐蒸蛋', type: 'side', menuGroup: '轻食素菜', window: '快餐保障菜', price: 3, kcal: 210, protein: 14, tags: ['light', 'balanced'] },
  { name: '清蒸鸡腿', type: 'main', menuGroup: '轻食素菜', window: '快餐保障菜', price: 4, kcal: 340, protein: 31, tags: ['high-protein', 'light', 'balanced'] },
  { name: '清炒豇豆', type: 'side', menuGroup: '轻食素菜', window: '快餐保障菜', price: 4, kcal: 130, protein: 6, tags: ['light', 'balanced'] },
  { name: '干锅有机花菜', type: 'side', menuGroup: '轻食素菜', window: '快餐保障菜', price: 4, kcal: 180, protein: 7, tags: ['warm', 'spicy', 'balanced'] },
  { name: '芹菜干丝', type: 'side', menuGroup: '轻食素菜', window: '快餐保障菜', price: 4, kcal: 150, protein: 9, tags: ['balanced', 'light'] },
  { name: '韭菜炒蛋', type: 'side', menuGroup: '轻食素菜', window: '快餐保障菜', price: 4, kcal: 240, protein: 15, tags: ['warm', 'balanced'] },
  { name: '青椒素肠', type: 'side', menuGroup: '轻食素菜', window: '快餐保障菜', price: 4, kcal: 230, protein: 12, tags: ['balanced', 'budget'] },
  { name: '肉糜粉丝', type: 'side', menuGroup: '轻食素菜', window: '快餐保障菜', price: 4, kcal: 320, protein: 14, tags: ['warm', 'balanced'] },
  { name: '麻辣鸭血', type: 'main', menuGroup: '轻食素菜', window: '快餐保障菜', price: 4, kcal: 260, protein: 17, tags: ['spicy', 'high-protein', 'warm'] }
];

const fastMeatSpecs = [
  { name: '红烧鸡腿', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 4, kcal: 390, protein: 29, tags: ['high-protein', 'warm', 'balanced'] },
  { name: '肉糜蒸蛋', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 4, kcal: 330, protein: 22, tags: ['high-protein', 'light', 'balanced'] },
  { name: '鱼香茄子', type: 'side', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 4, kcal: 260, protein: 6, tags: ['warm', 'spicy'] },
  { name: '炸鸡腿', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 4.5, kcal: 460, protein: 28, tags: ['high-protein', 'warm', 'crispy'] },
  { name: '冬瓜小排', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 5, kcal: 360, protein: 24, tags: ['balanced', 'warm', 'high-protein'] },
  { name: '红烧鸡块', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 5, kcal: 380, protein: 26, tags: ['balanced', 'warm', 'high-protein'] },
  { name: '水煮肉片', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 5, kcal: 470, protein: 27, tags: ['spicy', 'high-protein', 'warm'] },
  { name: '莴笋肉片', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 5, kcal: 310, protein: 22, tags: ['balanced', 'fresh'] },
  { name: '千页豆腐', type: 'side', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 5, kcal: 260, protein: 13, tags: ['balanced', 'vegetarian'] },
  { name: '油豆腐烧肉', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 5, kcal: 420, protein: 20, tags: ['warm', 'balanced'] },
  { name: '玉米鸡丁', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 5, kcal: 320, protein: 24, tags: ['balanced', 'fresh', 'high-protein'] },
  { name: '香炸鸡米花', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 5, kcal: 430, protein: 24, tags: ['warm', 'crispy'] },
  { name: '玉米小排', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 5, kcal: 370, protein: 22, tags: ['balanced', 'warm'] },
  { name: '椒盐排条', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 5, kcal: 450, protein: 25, tags: ['warm', 'crispy'] },
  { name: '咖喱鸡块', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 5, kcal: 400, protein: 25, tags: ['warm', 'balanced'] },
  { name: '茄汁鸡柳', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 5, kcal: 360, protein: 23, tags: ['balanced', 'fresh'] },
  { name: '红烧鸭腿', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 6, kcal: 430, protein: 26, tags: ['warm', 'high-protein'] },
  { name: '双椒鸡丁', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 6, kcal: 350, protein: 26, tags: ['spicy', 'high-protein'] },
  { name: '宫爆鸡丁', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 6, kcal: 370, protein: 24, tags: ['spicy', 'balanced'] },
  { name: '椒盐锅包肉', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 6, kcal: 480, protein: 22, tags: ['warm', 'crispy'] },
  { name: '豆豉蒸小排', type: 'main', menuGroup: '荤菜主菜', window: '快餐保障菜', price: 6, kcal: 360, protein: 24, tags: ['balanced', 'high-protein'] }
];

const stapleSpecs = [
  { name: '白粥', type: 'staple', menuGroup: '点心主食', window: '点心（保障型）', price: 0.2, kcal: 70, protein: 2, tags: ['light', 'budget', 'breakfast'] },
  { name: '白馒头', type: 'staple', menuGroup: '点心主食', window: '点心（保障型）', price: 0.5, kcal: 170, protein: 5, tags: ['budget', 'warm'] },
  { name: '花卷', type: 'staple', menuGroup: '点心主食', window: '点心（保障型）', price: 0.8, kcal: 180, protein: 5, tags: ['budget', 'warm'] },
  { name: '煎饼', type: 'staple', menuGroup: '点心主食', window: '点心（保障型）', price: 1, kcal: 220, protein: 6, tags: ['warm', 'budget'] },
  { name: '菜包', type: 'staple', menuGroup: '点心主食', window: '点心（保障型）', price: 1, kcal: 180, protein: 6, tags: ['vegetarian', 'budget', 'warm'] },
  { name: '南瓜粥', type: 'staple', menuGroup: '点心主食', window: '点心（保障型）', price: 1, kcal: 120, protein: 3, tags: ['warm', 'budget', 'breakfast'] },
  { name: '黑米粥', type: 'staple', menuGroup: '点心主食', window: '点心（保障型）', price: 1, kcal: 130, protein: 4, tags: ['warm', 'budget', 'breakfast'] },
  { name: '皮蛋瘦肉粥', type: 'staple', menuGroup: '点心主食', window: '点心（保障型）', price: 1, kcal: 160, protein: 8, tags: ['warm', 'budget', 'balanced'] },
  { name: '白煮蛋', type: 'staple', menuGroup: '点心主食', window: '点心（保障型）', price: 1, kcal: 75, protein: 7, tags: ['high-protein', 'light', 'budget'] },
  { name: '鲜肉包', type: 'staple', menuGroup: '点心主食', window: '点心（保障型）', price: 1.2, kcal: 220, protein: 9, tags: ['warm', 'balanced'] },
  { name: '豆沙包', type: 'staple', menuGroup: '点心主食', window: '点心（保障型）', price: 1.2, kcal: 210, protein: 5, tags: ['warm', 'budget'] },
  { name: '茶叶蛋', type: 'staple', menuGroup: '点心主食', window: '点心（保障型）', price: 1.5, kcal: 85, protein: 7, tags: ['high-protein', 'warm', 'budget'] },
  { name: '粉丝包', type: 'staple', menuGroup: '点心主食', window: '点心（保障型）', price: 1.5, kcal: 210, protein: 6, tags: ['warm', 'balanced'] },
  { name: '奶黄包', type: 'staple', menuGroup: '点心主食', window: '点心（保障型）', price: 2, kcal: 240, protein: 6, tags: ['warm'] },
  { name: '红糖馒头', type: 'staple', menuGroup: '点心主食', window: '点心（保障型）', price: 2, kcal: 210, protein: 5, tags: ['warm'] },
  { name: '麻球', type: 'staple', menuGroup: '点心主食', window: '点心（保障型）', price: 2, kcal: 240, protein: 4, tags: ['warm'] },
  { name: '油条', type: 'staple', menuGroup: '点心主食', window: '点心（保障型）', price: 2.5, kcal: 280, protein: 5, tags: ['warm', 'crispy'] }
];

const dishes = [
  ...fastLightSpecs.map((spec, index) => createDish(spec, index)),
  ...fastMeatSpecs.map((spec, index) => createDish(spec, fastLightSpecs.length + index)),
  ...stapleSpecs.map((spec, index) => createDish(spec, fastLightSpecs.length + fastMeatSpecs.length + index))
];

const goalProfiles = {
  fat_loss: { label: '轻盈控卡', prefer: ['low-fat', 'light', 'fresh'], kcalTarget: 560, proteinTarget: 38 },
  muscle: { label: '高蛋白增肌', prefer: ['high-protein', 'balanced'], kcalTarget: 760, proteinTarget: 54 },
  budget: { label: '省钱吃饭', prefer: ['budget', 'warm'], kcalTarget: 680, proteinTarget: 32 },
  balanced: { label: '均衡能量', prefer: ['balanced', 'light', 'budget'], kcalTarget: 650, proteinTarget: 40 }
};

function cloneDish(dish) {
  return { ...dish, tags: [...dish.tags] };
}

function getDishes() {
  return dishes.map(cloneDish);
}

function getFeaturedDishes() {
  return dishes.filter(dish => dish.featured).map(cloneDish);
}

function getScenePhotos() {
  return scenePhotos.map(photo => ({ ...photo }));
}

function getDataSource() {
  return { ...dataSource };
}

function getMenuSections() {
  const order = ['轻食素菜', '荤菜主菜', '点心主食'];
  return order.map(title => ({
    title,
    items: dishes.filter(dish => dish.menuGroup === title).map(cloneDish)
  }));
}

function matchesTaste(dish, taste) {
  if (taste === 'light') return dish.tags.includes('light') || dish.tags.includes('fresh') || dish.tags.includes('low-fat');
  if (taste === 'warm') return dish.tags.includes('warm') || dish.tags.includes('balanced') || dish.tags.includes('crispy');
  return true;
}

function filterDishes({ avoidTags = [], taste = 'balanced' }) {
  return dishes.filter(dish => {
    const avoids = avoidTags.some(tag => dish.tags.includes(tag));
    return !avoids && matchesTaste(dish, taste);
  });
}

function sum(items, field) {
  return items.reduce((total, item) => total + item[field], 0);
}

function roundMoney(value) {
  return Math.round(value * 10) / 10;
}

function comboScore(items, profile, budget) {
  const totalPrice = roundMoney(sum(items, 'price'));
  const kcal = sum(items, 'kcal');
  const protein = sum(items, 'protein');
  const tagScore = items.reduce((total, item) => total + item.tags.filter(tag => profile.prefer.includes(tag)).length * 8, 0);
  const budgetScore = Math.max(0, 24 - Math.abs(budget - totalPrice) * 3);
  const kcalScore = Math.max(0, 24 - Math.abs(profile.kcalTarget - kcal) / 26);
  const proteinScore = Math.min(28, protein / profile.proteinTarget * 28);
  return Math.round(Math.min(100, tagScore + budgetScore + kcalScore + proteinScore));
}

function normalizeRandom(value) {
  if (!Number.isFinite(value)) return 0;
  if (value < 0) return 0;
  if (value >= 1) return 0.999999;
  return value;
}

function pickRecommendedCombo(combos, random = Math.random) {
  const sorted = combos.sort((a, b) => b.score - a.score || a.totalPrice - b.totalPrice);
  const best = sorted[0];
  if (!best) return null;

  const candidatePool = sorted
    .filter(combo => best.score - combo.score <= 8)
    .slice(0, 10);
  const randomValue = normalizeRandom(random());
  const index = Math.floor(randomValue * candidatePool.length);
  return candidatePool[index] || best;
}

function buildReasons(items, profile, budget, score) {
  const totalPrice = roundMoney(sum(items, 'price'));
  const kcal = sum(items, 'kcal');
  const protein = sum(items, 'protein');
  const groups = [...new Set(items.map(item => item.menuGroup))].join(' / ');
  return [
    `参考上财公开保障菜价目表，预算 ${budget} 元内，本餐合计 ${totalPrice} 元。`,
    `目标为${profile.label}，当前估算约 ${kcal} kcal、蛋白质 ${protein}g。`,
    `组合覆盖 ${groups}，可按“主菜 + 配菜 + 主食”在窗口快速完成取餐。`,
    `综合评分 ${score} 分，依据公开售价、本地营养估算和标签匹配计算。`
  ];
}

function recommendMeal(input = {}, options = {}) {
  const goal = input.goal || 'balanced';
  const budget = Math.max(3, Number(input.budget) || 10);
  const profile = goalProfiles[goal] || goalProfiles.balanced;
  const filtered = filterDishes(input);
  const mains = filtered.filter(dish => dish.type === 'main');
  const sides = filtered.filter(dish => dish.type === 'side');
  const staples = filtered.filter(dish => dish.type === 'staple');
  const combos = [];

  for (const main of mains) {
    for (const side of sides) {
      for (const staple of staples) {
        const items = [main, side, staple];
        const totalPrice = roundMoney(sum(items, 'price'));
        if (totalPrice <= budget) {
          combos.push({ items, totalPrice, score: comboScore(items, profile, budget) });
        }
      }
    }
  }

  const best = pickRecommendedCombo(combos, options.random || Math.random);
  const fallbackItems = filtered.slice(0, 3);
  const items = best?.items || fallbackItems;
  const totalPrice = best?.totalPrice || roundMoney(sum(items, 'price'));
  const score = best?.score || comboScore(items, profile, budget);
  const kcal = sum(items, 'kcal');
  const protein = sum(items, 'protein');

  return {
    usesExternalApi: false,
    source: getDataSource(),
    goal,
    goalLabel: profile.label,
    items: items.map(cloneDish),
    totalPrice,
    kcal,
    protein,
    score,
    summary: `本推荐基于上财公开菜价和本地规则估算生成，公开菜单共 ${dishes.length} 个条目，适合课堂中说明“真实数据来源 + 本地智能规则”的边界。`,
    reasons: buildReasons(items, profile, budget, score),
    savedAt: new Date().toISOString()
  };
}

function getDatabaseConfig() {
  return {
    engine: 'Browser localStorage',
    namespace: 'canteen_nutrition',
    source: getDataSource(),
    tables: {
      dishes: { key: 'canteen_nutrition.dishes', fields: ['id', 'name', 'price', 'kcal', 'protein', 'tags', 'image', 'menuGroup', 'sourceUrl'] },
      preferences: { key: 'canteen_nutrition.preferences', fields: ['goal', 'budget', 'avoidTags', 'taste'] },
      plans: { key: 'canteen_nutrition.plans', fields: ['id', 'items', 'score', 'totalPrice', 'savedAt'] },
      favorites: { key: 'canteen_nutrition.favorites', fields: ['dishId', 'createdAt'] },
      feedback: { key: 'canteen_nutrition.feedback', fields: ['planId', 'value', 'createdAt'] }
    }
  };
}

const api = {
  getDishes,
  getFeaturedDishes,
  getScenePhotos,
  getMenuSections,
  recommendMeal,
  getDatabaseConfig,
  getDataSource,
  filterDishes
};

if (typeof window !== 'undefined') {
  window.CanteenCore = api;
}

if (typeof module !== 'undefined') {
  module.exports = api;
}
