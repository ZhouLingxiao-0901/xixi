const storage = require('../../utils/storage');

Page({
  data: {
    activeCat: 'all',
    pinnedTasks: [],
    filteredTasks: [],
    catLabel: { study: '学习', work: '工作', leisure: '休闲' },
    catColor: { study: '#4CAF50', work: '#2196F3', leisure: '#FF9800' },
    showModal: false,
    newTitle: '',
    newCat: 'work',
    newDeadlineDate: '',
    newDeadlineTime: '',
  },

  onShow() { this.refresh(); },

  refresh() {
    const tasks = storage.getTasks();
    const pinned = tasks.filter(t => t.pinned).sort((a, b) => b.createdAt - a.createdAt);
    let filtered = tasks;
    if (this.data.activeCat !== 'all') {
      filtered = tasks.filter(t => t.category === this.data.activeCat);
    }
    filtered.sort((a, b) => b.createdAt - a.createdAt);
    this.setData({ pinnedTasks: pinned, filteredTasks: filtered, showModal: false });
  },

  filterCat(e) { this.setData({ activeCat: e.currentTarget.dataset.cat }, () => this.refresh()); },

  preventClose() {},

  showAdd() { this.setData({ showModal: true, newTitle: '', newCat: 'work', newDeadlineDate: '', newDeadlineTime: '' }); },
  hideAdd() { this.setData({ showModal: false }); },
  onTitleInput(e) { this.setData({ newTitle: e.detail.value }); },
  pickCat(e) { this.setData({ newCat: e.currentTarget.dataset.cat }); },
  onDateChange(e) { this.setData({ newDeadlineDate: e.detail.value }); },
  onTimeChange(e) { this.setData({ newDeadlineTime: e.detail.value }); },

  onAdd() {
    const title = this.data.newTitle.trim();
    if (!title) { wx.showToast({ title: '请输入标题', icon: 'none' }); return; }
    let deadline = '';
    if (this.data.newDeadlineDate) {
      deadline = this.data.newDeadlineDate;
      if (this.data.newDeadlineTime) deadline += ' ' + this.data.newDeadlineTime;
    }
    const result = storage.addTask({ title: title, category: this.data.newCat, deadline: deadline });
    if (result) {
      wx.showToast({ title: '已添加', icon: 'success' });
      this.setData({ showModal: false, newTitle: '', newDeadlineDate: '', newDeadlineTime: '' });
      this.refresh();
    } else {
      wx.showToast({ title: '保存失败，请重试', icon: 'none' });
    }
  },

  onToggle(e) { storage.toggleComplete(e.currentTarget.dataset.id); this.refresh(); },
  onPin(e) { storage.togglePin(e.currentTarget.dataset.id); this.refresh(); },
  onUnpin(e) { storage.togglePin(e.currentTarget.dataset.id); this.refresh(); },

  onDelete(e) {
    const that = this;
    wx.showModal({
      title: '删除计划', content: '确认删除该计划？', confirmColor: '#FF6B9D',
      success(res) { if (res.confirm) { storage.deleteTask(e.currentTarget.dataset.id); that.refresh(); } },
    });
  },
});
