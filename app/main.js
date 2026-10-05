/* ========== 编程竞赛学习笔记 · 共享脚本 ========== */

/* 题目练习计划：按类别筛选表格行 */
function initTopicFilter() {
  var bar = document.getElementById('topic-filter');
  var table = document.getElementById('topic-table');
  if (!bar || !table) return;

  var buttons = bar.querySelectorAll('button[data-cat]');
  var rows = Array.prototype.slice.call(table.querySelectorAll('tbody tr'));

  buttons.forEach(function (btn) {
    btn.addEventListener('click', function () {
      var cat = btn.getAttribute('data-cat');

      buttons.forEach(function (b) { b.classList.remove('active'); });
      btn.classList.add('active');

      rows.forEach(function (row) {
        var shown = (cat === '全部') || (row.getAttribute('data-cat') === cat);
        row.style.display = shown ? '' : 'none';
      });
    });
  });
}

/* 简化显示：把带反斜杠转义的字段名做展示还原（无需脚本，此处仅预留） */

/* 返回顶部悬浮按钮 */
function initBackTop() {
  var btn = document.createElement('a');
  btn.href = 'javascript:void(0)';
  btn.className = 'back-top';
  btn.innerHTML = '↑';
  btn.setAttribute('title', '返回顶部');
  document.body.appendChild(btn);

  btn.addEventListener('click', function () {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
  window.addEventListener('scroll', function () {
    btn.style.display = (window.pageYOffset > 320) ? 'flex' : 'none';
  });
  btn.style.display = 'none';
}

/* 滚动进入视口动画：卡片/步骤/提示块在滚动到可视区时淡入上移 */
function initReveal() {
  var els = document.querySelectorAll('.card, .chapter-card, .dash-card, .flow .step, .tip, .note, .table-wrap');
  if (!('IntersectionObserver' in window)) {
    els.forEach(function (e) { e.classList.add('revealed'); });
    return;
  }
  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (en) {
      if (en.isIntersecting) {
        en.target.classList.add('revealed');
        io.unobserve(en.target);
      }
    });
  }, { threshold: 0.12 });
  els.forEach(function (e) { e.classList.add('reveal'); io.observe(e); });
}

/* 苹果实况式动态图：鼠标悬停结构图才播放节点动画，移开复位 */
function initLiveStruct() {
  var structs = document.querySelectorAll('.struct');
  structs.forEach(function (s) {
    s.addEventListener('mouseenter', function () {
      s.classList.remove('play');
      void s.offsetWidth; /* 强制重排，保证每次悬停都能重新播放 */
      s.classList.add('play');
    });
    s.addEventListener('mouseleave', function () {
      s.classList.remove('play');
    });
  });
}

/* 顶部搜索框：注入 header，按页面索引模糊匹配并跳转（参照塔尖 wiki） */
var SEARCH_INDEX = [
  {f:'index.html', t:'首页 · 总览', k:'首页 总览 学习笔记'},
  {f:'day1.html', t:'day1 首页', k:'day1 核心工具 例题'},
  {f:'day1-pm.html', t:'day1 下午 · 核心工具与四道例题', k:'day1 pm map set 二分 校园打卡 机器人扫地'},
  {f:'day1-night.html', t:'day1 晚上 · 算法实现逻辑', k:'day1 night 算法实现 回溯'},
  {f:'day1-summary.html', t:'day1 总结', k:'day1 summary 总结'},
  {f:'day2.html', t:'day2 首页', k:'day2 stl 贪心 前缀和'},
  {f:'day2-stl.html', t:'day2 · STL 核心知识点', k:'day2 stl vector stack queue set map'},
  {f:'day2-greedy.html', t:'day2 · 贪心与前缀和', k:'day2 贪心 前缀和 反证法'},
  {f:'day2-night.html', t:'day2 晚上 · 习题讲评', k:'day2 night 习题 讲评'},
  {f:'day2-summary.html', t:'day2 总结', k:'day2 summary 总结'},
  {f:'day3.html', t:'day3 首页', k:'day3 差分 二分'},
  {f:'day3-pm.html', t:'day3 下午', k:'day3 pm'},
  {f:'day3-night.html', t:'day3 晚上 · 差分与二分', k:'day3 night 差分 二分'},
  {f:'topics.html', t:'day2 · 题目练习计划', k:'topics 题目 练习 计划 柱状图'},
  {f:'stl-containers.html', t:'STL 容器与字符串专题', k:'stl vector stack queue set map 字符串'},
  {f:'summary.html', t:'总结', k:'总结 方法论 练习'},
  {f:'dfs-bfs.html', t:'深搜与广搜', k:'dfs bfs 深搜 广搜 递归 队列 最短路径 方案数'},
  {f:'topics-basic.html', t:'专题 · 基础语法', k:'基础语法 数组 一维 二维 字符串 语法 蛇形方阵 环状字符串 计数 打标记'},
  {f:'topics-algo.html', t:'专题 · 基础算法', k:'基础算法 复杂度 排序 选择 冒泡 插入 计数 结构体 枚举 二进制 排列 递归 递推 模运算 前缀和'},
  {f:'topics-string.html', t:'专题 · 字符串算法', k:'字符串 哈希 滚动哈希 KMP Trie 字典树 模式匹配 失配'},
  {f:'topics-dp.html', t:'专题 · 动态规划', k:'动态规划 dp 子序列 LIS 最长上升 LCS 最长公共子串 二分优化 方案数'},
  {f:'topics-graph.html', t:'专题 · 图论', k:'图论 图的概念 度数 握手定理 图的存储 邻接矩阵 邻接表 链式前向星 DFS BFS 遍历'},
  {f:'topics-math.html', t:'专题 · 数学', k:'数学 模运算 质数 质数判定 筛法 埃氏筛 欧拉筛 质因子分解 gcd 快速幂 排列组合 二项式定理 逆元 exgcd'},
  {f:'topics-round.html', t:'专题 · 周赛题解', k:'周赛 竞赛 模拟赛 套路 策略 易错点 时间分配 调试'},
  {f:'topics-prelim.html', t:'专题 · 初赛篇', k:'初赛 CSP 进制转换 位运算 数据结构 复习 提纲'}
];
function initSearchBox() {
  var header = document.querySelector('.site-header .inner');
  if (!header || header.querySelector('.search-wrap')) return;
  var box = document.createElement('div');
  box.className = 'search-wrap';
  box.innerHTML = '<input type="text" placeholder="搜索知识点…" id="siteSearch"><div class="search-drop" id="searchDrop"></div>';
  header.appendChild(box);
  var input = box.querySelector('#siteSearch');
  var drop = box.querySelector('#searchDrop');
  function render() {
    var q = input.value.trim().toLowerCase();
    if (!q) { drop.classList.remove('show'); drop.innerHTML = ''; return; }
    var hits = SEARCH_INDEX.filter(function (e) {
      return (e.t + ' ' + e.k).toLowerCase().indexOf(q) !== -1;
    }).slice(0, 8);
    if (!hits.length) { drop.innerHTML = '<div class="noresult">未找到相关页面</div>'; drop.classList.add('show'); return; }
    drop.innerHTML = hits.map(function (e) {
      return '<a href="' + e.f + '"><span class="s-title">' + e.t + '</span><span class="s-tag">' + e.f.replace('.html', '') + '</span></a>';
    }).join('');
    drop.classList.add('show');
  }
  input.addEventListener('input', render);
  input.addEventListener('focus', render);
  document.addEventListener('click', function (ev) {
    if (!box.contains(ev.target)) drop.classList.remove('show');
  });
}

/* 代码块一键复制：为 .codebox 注入「复制」按钮 */
function initCopyBtn() {
  var boxes = document.querySelectorAll('.codebox');
  boxes.forEach(function (box) {
    if (box.querySelector('.copy-btn')) return;
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'copy-btn';
    btn.textContent = '复制';
    box.appendChild(btn);
    btn.addEventListener('click', function () {
      var code = box.querySelector('code');
      var txt = code ? code.innerText : box.innerText;
      function done() {
        btn.textContent = '已复制';
        setTimeout(function () { btn.textContent = '复制'; }, 1500);
      }
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(txt).then(done);
      } else {
        var ta = document.createElement('textarea');
        ta.value = txt;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
        done();
      }
    });
  });
}

document.addEventListener('DOMContentLoaded', function () {
  initTopicFilter();
  initBackTop();
  initReveal();
  initLiveStruct();
  initSearchBox();
  initCopyBtn();
});
