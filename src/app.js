(function initCanteenApp(global) {
  const core = global.CanteenCore;
  if (!core) return;

  const keys = {
    plans: 'canteen_nutrition.plans',
    favorites: 'canteen_nutrition.favorites',
    feedback: 'canteen_nutrition.feedback',
    preferences: 'canteen_nutrition.preferences'
  };

  let currentPlan = null;

  function byId(id) {
    return global.document.getElementById(id);
  }

  function safeSetHtml(id, html) {
    const node = byId(id);
    if (node) node.innerHTML = html;
  }

  function safeSetText(id, text) {
    const node = byId(id);
    if (node) node.textContent = text;
  }

  function readJson(key, fallback) {
    try {
      return JSON.parse(global.localStorage.getItem(key)) ?? fallback;
    } catch {
      return fallback;
    }
  }

  function writeJson(key, value) {
    global.localStorage.setItem(key, JSON.stringify(value, null, 2));
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  function createId(prefix) {
    if (global.crypto?.randomUUID) {
      return `${prefix}-${global.crypto.randomUUID()}`;
    }
    return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
  }

  function getSelectedGoal() {
    return global.document.querySelector('input[name="goal"]:checked')?.value || 'balanced';
  }

  function collectPreferences() {
    const avoidTags = byId('avoidSpicy')?.checked ? ['spicy'] : [];
    return {
      goal: getSelectedGoal(),
      budget: Number(byId('budget')?.value) || 22,
      taste: byId('taste')?.value || 'balanced',
      avoidTags
    };
  }

  function applyStoredPreferences() {
    const saved = readJson(keys.preferences, null);
    if (!saved) return;

    const goalInput = global.document.querySelector(`input[name="goal"][value="${saved.goal}"]`);
    if (goalInput) goalInput.checked = true;
    if (Number.isFinite(Number(saved.budget)) && byId('budget')) byId('budget').value = String(saved.budget);
    if (saved.taste && byId('taste')) byId('taste').value = saved.taste;
    if (byId('avoidSpicy')) byId('avoidSpicy').checked = Array.isArray(saved.avoidTags) && saved.avoidTags.includes('spicy');
  }

  function updateBudgetLabel() {
    const budget = byId('budget');
    if (!budget) return;
    safeSetText('budgetValue', `${budget.value} 元`);
  }

  function dishMeta(dish) {
    return `${dish.window} · ${dish.price} 元 · ${dish.kcal} kcal · 蛋白质 ${dish.protein}g`;
  }

  function renderSceneGallery() {
    safeSetHtml('sceneGallery', core.getScenePhotos().map(photo => `
      <article class="scene-card">
        <img src="${escapeHtml(photo.image)}" alt="${escapeHtml(photo.title)}">
        <div>
          <h3>${escapeHtml(photo.title)}</h3>
          <p>${escapeHtml(photo.caption)}</p>
          <a href="${escapeHtml(photo.sourceUrl)}" target="_blank" rel="noreferrer">查看原始来源</a>
        </div>
      </article>
    `).join(''));
  }

  function renderDishGallery() {
    const favorites = new Set(readJson(keys.favorites, []).map(item => item.dishId));
    safeSetHtml('dishGallery', core.getFeaturedDishes().map(dish => {
      const isFavorite = favorites.has(dish.id);
      return `
        <article class="dish-card">
          <img src="${escapeHtml(dish.image)}" alt="${escapeHtml(dish.name)}">
          <div>
            <span class="dish-group">${escapeHtml(dish.menuGroup)}</span>
            <h3>${escapeHtml(dish.name)}</h3>
            <p>${escapeHtml(dishMeta(dish))}</p>
            <div class="tag-row">${dish.tags.slice(0, 3).map(tag => `<span>${escapeHtml(tag)}</span>`).join('')}</div>
            <button type="button" data-favorite-dish="${escapeHtml(dish.id)}">${isFavorite ? '已收藏' : '收藏菜品'}</button>
          </div>
        </article>
      `;
    }).join(''));
  }

  function renderMenuBoard() {
    safeSetHtml('menuBoard', core.getMenuSections().map(section => `
      <section class="menu-table">
        <div class="menu-head">
          <h3>${escapeHtml(section.title)}</h3>
          <span>${section.items.length} 道公开条目</span>
        </div>
        <div class="menu-rows">
          ${section.items.map(item => `
            <article class="menu-row">
              <div>
                <strong>${escapeHtml(item.name)}</strong>
                <p>${escapeHtml(item.window)} · ${escapeHtml(item.tags.slice(0, 2).join(' / '))}</p>
              </div>
              <span>${escapeHtml(item.price)} 元</span>
            </article>
          `).join('')}
        </div>
      </section>
    `).join(''));
  }

  function renderPlan(plan) {
    currentPlan = plan;
    safeSetText('planTitle', `${plan.goalLabel} · ${plan.totalPrice} 元`);
    safeSetText('scoreBadge', `${plan.score} 分`);
    safeSetHtml('mealCards', plan.items.map(item => `
      <article class="meal-card">
        <img src="${escapeHtml(item.image)}" alt="${escapeHtml(item.name)}">
        <div>
          <span class="dish-group">${escapeHtml(item.menuGroup)}</span>
          <h3>${escapeHtml(item.name)}</h3>
          <p>${escapeHtml(dishMeta(item))}</p>
        </div>
      </article>
    `).join(''));
    safeSetHtml('mealSummary', `
      <div class="summary-line"><span>预算使用</span><strong>${plan.totalPrice} 元</strong></div>
      <div class="summary-line"><span>热量估算</span><strong>${plan.kcal} kcal</strong></div>
      <div class="summary-line"><span>蛋白质</span><strong>${plan.protein}g</strong></div>
      <p class="summary-copy">${escapeHtml(plan.summary)}</p>
      <ul class="reason-list" aria-label="推荐理由">
        ${plan.reasons.map(reason => `<li>${escapeHtml(reason)}</li>`).join('')}
      </ul>
    `);

    const panel = global.document.querySelector('.recommendation');
    if (panel && global.requestAnimationFrame) {
      panel.classList.remove('is-updated');
      global.requestAnimationFrame(() => panel.classList.add('is-updated'));
    }
  }

  function renderDataState() {
    const schema = core.getDatabaseConfig();
    const source = core.getDataSource();
    const plans = readJson(keys.plans, []);
    const favorites = readJson(keys.favorites, []);
    const feedback = readJson(keys.feedback, []);
    const dishes = core.getDishes();

    safeSetHtml('dataState', [
      ['来源学校', source.university],
      ['公开菜品', dishes.length],
      ['快餐保障菜', dishes.filter(item => item.window === '快餐保障菜').length],
      ['点心保障型', dishes.filter(item => item.window === '点心（保障型）').length],
      ['套餐记录', plans.length],
      ['收藏菜品', favorites.length],
      ['反馈条数', feedback.length],
      ['数据表', Object.keys(schema.tables).length]
    ].map(([label, value]) => `
      <div class="data-item">
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(value)}</strong>
      </div>
    `).join(''));
  }

  function renderHistory() {
    const recent = readJson(keys.plans, []).slice(-4).reverse();
    if (!recent.length) {
      safeSetHtml('historyList', '<p class="empty-state">暂无收藏套餐。生成后点击收藏，这里会保留最近展示记录。</p>');
      return;
    }

    safeSetHtml('historyList', recent.map(plan => {
      const first = plan.items?.[0];
      return `
        <article class="history-item">
          <img src="${escapeHtml(first?.image || 'assets/sufe-scene-buffet.jpg')}" alt="${escapeHtml(first?.name || '套餐记录')}">
          <div>
            <strong>${escapeHtml(plan.goalLabel || '推荐套餐')} · ${escapeHtml(plan.totalPrice)} 元</strong>
            <p>${escapeHtml((plan.items || []).map(item => item.name).join(' / '))}</p>
          </div>
        </article>
      `;
    }).join(''));
  }

  function updateStorageViews() {
    renderDataState();
    renderHistory();
  }

  function generatePlan() {
    const preferences = collectPreferences();
    const plan = core.recommendMeal(preferences);
    writeJson(keys.preferences, preferences);
    renderPlan(plan);
    updateStorageViews();
  }

  function saveCurrentPlan() {
    if (!currentPlan) return;
    const plans = readJson(keys.plans, []);
    plans.push({
      ...currentPlan,
      id: createId('plan'),
      savedAt: new Date().toISOString()
    });
    writeJson(keys.plans, plans.slice(-12));
    updateStorageViews();
  }

  function saveFeedback(value) {
    if (!currentPlan) return;
    const feedback = readJson(keys.feedback, []);
    feedback.push({
      id: createId('feedback'),
      planId: currentPlan.id || currentPlan.savedAt,
      value,
      createdAt: new Date().toISOString()
    });
    writeJson(keys.feedback, feedback.slice(-40));
    updateStorageViews();
  }

  function toggleDishFavorite(dishId) {
    const favorites = readJson(keys.favorites, []);
    const exists = favorites.some(item => item.dishId === dishId);
    const next = exists
      ? favorites.filter(item => item.dishId !== dishId)
      : [...favorites, { dishId, createdAt: new Date().toISOString() }];
    writeJson(keys.favorites, next);
    renderDishGallery();
    updateStorageViews();
  }

  function bindEvents() {
    byId('budget')?.addEventListener('input', updateBudgetLabel);
    byId('mealForm')?.addEventListener('submit', event => {
      event.preventDefault();
      generatePlan();
    });
    byId('savePlan')?.addEventListener('click', saveCurrentPlan);
    byId('likePlan')?.addEventListener('click', () => saveFeedback('like'));
    byId('dislikePlan')?.addEventListener('click', () => saveFeedback('dislike'));
    byId('dishGallery')?.addEventListener('click', event => {
      const button = event.target.closest('[data-favorite-dish]');
      if (button) toggleDishFavorite(button.dataset.favoriteDish);
    });
  }

  function init() {
    applyStoredPreferences();
    updateBudgetLabel();
    renderSceneGallery();
    renderDishGallery();
    renderMenuBoard();
    bindEvents();
    generatePlan();
  }

  init();

  global.CanteenApp = {
    collectPreferences,
    generatePlan,
    saveCurrentPlan,
    saveFeedback,
    toggleDishFavorite
  };
})(typeof window !== 'undefined' ? window : globalThis);
