const _getApp = () => { try { return getApp(); } catch (e) { return null; } };

function getTasks() {
  const a = _getApp();
  if (!a) return [];
  return a.globalData.tasks || [];
}

function saveTasks(tasks) {
  const a = _getApp();
  if (!a) return;
  a.saveData('tasks', tasks);
}

function addTask(task) {
  const a = _getApp();
  if (!a) return null;
  task.id = Date.now().toString(36) + Math.random().toString(36).slice(2, 8);
  task.createdAt = Date.now();
  task.completed = false;
  task.pinned = false;
  task.category = task.category || 'work';
  task.deadline = task.deadline || '';
  const tasks = a.globalData.tasks || [];
  tasks.unshift(task);
  a.saveData('tasks', tasks);
  return task;
}

function updateTask(id, updates) {
  const a = _getApp();
  if (!a) return;
  const tasks = a.globalData.tasks || [];
  const idx = tasks.findIndex(t => t.id === id);
  if (idx !== -1) {
    tasks[idx] = { ...tasks[idx], ...updates };
    a.saveData('tasks', tasks);
  }
}

function deleteTask(id) {
  const a = _getApp();
  if (!a) return;
  let tasks = a.globalData.tasks || [];
  tasks = tasks.filter(t => t.id !== id);
  a.saveData('tasks', tasks);
}

function toggleComplete(id) {
  const a = _getApp();
  if (!a) return false;
  const tasks = a.globalData.tasks || [];
  const idx = tasks.findIndex(t => t.id === id);
  if (idx !== -1) {
    tasks[idx].completed = !tasks[idx].completed;
    a.saveData('tasks', tasks);
    return tasks[idx].completed;
  }
  return false;
}

function togglePin(id) {
  const a = _getApp();
  if (!a) return;
  const tasks = a.globalData.tasks || [];
  const idx = tasks.findIndex(t => t.id === id);
  if (idx !== -1) {
    tasks[idx].pinned = !tasks[idx].pinned;
    a.saveData('tasks', tasks);
  }
}

function getStats() {
  const a = _getApp();
  if (!a) return { total: 0, completed: 0, pending: 0, rate: 0, categories: {} };
  const tasks = a.globalData.tasks || [];
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const categories = {};
  tasks.forEach(t => {
    const cat = t.category || 'other';
    categories[cat] = (categories[cat] || 0) + 1;
  });
  return { total, completed, pending, rate, categories };
}

function getMemos() {
  const a = _getApp();
  if (!a) return [];
  return a.globalData.memos || [];
}

function saveMemos(memos) {
  const a = _getApp();
  if (!a) return;
  a.saveData('memos', memos);
}

function addMemo(text) {
  const a = _getApp();
  if (!a) return;
  const memos = a.globalData.memos || [];
  memos.unshift({ id: Date.now().toString(36), text, createdAt: Date.now() });
  a.saveData('memos', memos);
}

function deleteMemo(id) {
  const a = _getApp();
  if (!a) return;
  let memos = a.globalData.memos || [];
  memos = memos.filter(m => m.id !== id);
  a.saveData('memos', memos);
}

module.exports = { getTasks, saveTasks, addTask, updateTask, deleteTask, toggleComplete, togglePin, getStats, getMemos, saveMemos, addMemo, deleteMemo };
