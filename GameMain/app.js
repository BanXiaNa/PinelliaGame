/**
 * PinelliaGame - 游戏大厅主逻辑
 *
 * 工作流程：
 *   1. 自动计算资源根路径（支持独立运行和子模块部署）
 *   2. 从 games/games-index.json 获取游戏清单
 *   3. 根据返回数据渲染游戏卡片网格
 *   4. 点击卡片跳转到对应游戏页面
 *
 * 状态管理：loading → (success → render grid) | (error → show error) | (empty → show empty)
 */

/**
 * 计算资源根路径
 * GameMain 始终位于游戏库的 GameMain/ 目录下，
 * 游戏数据（games/）是其兄弟目录。
 * 无论是独立运行还是作为子模块嵌套，只需退一级即可。
 */
const BASE = (() => {
  const path = window.location.pathname;
  // 找到 GameMain/ 的位置，取它前面的部分作为 base
  const idx = path.lastIndexOf('/GameMain/');
  if (idx !== -1) {
    return path.slice(0, idx + 1); // 指向 GameMain/ 的父级
  }
  return './';
})();

const INDEX_URL = `${BASE}games/games-index.json`;

// DOM 元素缓存
const $ = (id) => document.getElementById(id);
const el = {
  loading: $('loading'),
  error:   $('error'),
  errorText: $('error-text'),
  empty:   $('empty'),
  grid:    $('game-grid'),
};

/**
 * 加载游戏索引
 * 从 games/games-index.json 获取所有游戏信息
 */
async function loadGames() {
  try {
    const res = await fetch(INDEX_URL);

    if (!res.ok) {
      throw new Error(`HTTP ${res.status} — 无法读取游戏索引`);
    }

    const games = await res.json();

    // 校验数据格式：必须是数组
    if (!Array.isArray(games)) {
      throw new Error('游戏索引格式错误：应为数组');
    }

    return games;
  } catch (err) {
    // 区分「文件不存在」和其他错误
    if (err.message.includes('404') || err.message.includes('无法读取')) {
      throw new Error(`未找到游戏索引 (${INDEX_URL})`);
    }
    throw err;
  }
}

/**
 * 创建单个游戏卡片 DOM 元素
 */
function createCard(game) {
  const card = document.createElement('div');
  card.className = 'game-card';
  card.style.setProperty('--card-color', game.color || '#7c5cff');
  card.style.setProperty('--card-glow', game.color ? `${game.color}44` : 'rgba(124,92,255,0.3)');

  // 图标
  const icon = document.createElement('div');
  icon.className = 'card-icon';
  icon.textContent = game.icon || '🎮';

  // 标题
  const title = document.createElement('div');
  title.className = 'card-title';
  title.textContent = game.name || '未命名游戏';

  // 描述
  const desc = document.createElement('div');
  desc.className = 'card-desc';
  desc.textContent = game.description || '';

  // 标签
  const tags = document.createElement('div');
  tags.className = 'card-tags';
  if (game.tags && Array.isArray(game.tags)) {
    game.tags.forEach(tag => {
      const tagEl = document.createElement('span');
      tagEl.className = 'card-tag';
      tagEl.textContent = tag;
      tags.appendChild(tagEl);
    });
  }

  // 点击提示箭头
  const hint = document.createElement('div');
  hint.className = 'card-hint';
  hint.textContent = '→';

  card.appendChild(icon);
  card.appendChild(title);
  card.appendChild(desc);
  card.appendChild(tags);
  card.appendChild(hint);

  // 点击跳转
  card.addEventListener('click', () => {
    const path = game.path || `games/${game.name}`;
    window.location.href = `${BASE}${path}/index.html`;
  });

  return card;
}

/**
 * 渲染游戏网格
 */
function renderGames(games) {
  // 清空网格
  el.grid.innerHTML = '';

  if (games.length === 0) {
    // 空状态：索引文件存在但没有任何游戏
    showEmpty('游戏库为空');
    return;
  }

  // 逐个创建卡片并添加到网格
  games.forEach(game => {
    const card = createCard(game);
    el.grid.appendChild(card);
  });

  // 显示网格
  el.grid.classList.remove('hidden');
}

/**
 * 显示加载状态
 */
function showLoading() {
  el.loading.classList.remove('hidden');
  el.error.classList.add('hidden');
  el.empty.classList.add('hidden');
  el.grid.classList.add('hidden');
}

/**
 * 显示错误状态
 */
function showError(message) {
  el.loading.classList.add('hidden');
  el.error.classList.remove('hidden');
  el.empty.classList.add('hidden');
  el.grid.classList.add('hidden');
  el.errorText.textContent = message;
}

/**
 * 显示空状态
 */
function showEmpty() {
  el.loading.classList.add('hidden');
  el.error.classList.add('hidden');
  el.empty.classList.remove('hidden');
  el.grid.classList.add('hidden');
}

/**
 * 设置返回链接
 * 在博客集成模式下 → 返回博客首页
 * 独立运行模式下 → 返回项目根目录
 */
function setupBackLink() {
  const link = document.getElementById('back-link');
  const text = document.getElementById('back-text');
  if (!link || !text) return;

  // 判断是否在博客中（通过 URL 路径检测）
  const isBlog = window.location.pathname.includes('/games/GameMain/');

  if (isBlog) {
    link.href = '/';
    text.textContent = '返回博客';
  } else {
    link.href = '../';
    text.textContent = '返回主页';
  }

  link.classList.remove('hidden');
}

/**
 * 初始化：加载游戏并渲染
 */
async function init() {
  setupBackLink();
  showLoading();

  try {
    const games = await loadGames();
    renderGames(games);
  } catch (err) {
    console.error('[PinelliaGame]', err);
    showError(err.message);
  }
}

// 页面加载完成后启动
document.addEventListener('DOMContentLoaded', init);
