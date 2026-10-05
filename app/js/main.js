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

document.addEventListener('DOMContentLoaded', function () {
  initTopicFilter();
  initBackTop();
});
