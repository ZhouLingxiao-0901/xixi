const storage = require('../../utils/storage');

Page({
  data: {
    tasks: [],
    statsCards: [],
    categoryLabel: { study: '学习', work: '工作', leisure: '休闲' },
    showModal: false,
    newTitle: '',
    newCategory: 'work',
    newDeadlineDate: '',
    newDeadlineTime: '',
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const tasks = storage.getTasks();
    const stats = storage.getStats();
    this.setData({ tasks, statsCards: [
      { key: 'total', value: stats.total, label: '全部', color: '#6C63FF' },
      { key: 'pending', value: stats.pending, label: '待完成', color: '#FF6B9D' },
      { key: 'completed', value: stats.completed, label: '已完成', color: '#4ECDC4' },
      { key: 'rate', value: stats.rate + '%', label: '完成率', color: '#FFD93D' },
    ] });
  },

  preventClose() {},

  showAdd() {
    this.setData({
      showModal: true, newTitle: '', newCategory: 'work',
      newDeadlineDate: '', newDeadlineTime: '',
    });
  },

  hideAdd() {
    this.setData({ showModal: false });
  },

  onTitleInput(e) {
    this.setData({ newTitle: e.detail.value });
  },

  setCategory(e) {
    this.setData({ newCategory: e.currentTarget.dataset.cat });
  },

  onDateChange(e) {
    this.setData({ newDeadlineDate: e.detail.value });
  },

  onTimeChange(e) {
    this.setData({ newDeadlineTime: e.detail.value });
  },

  onAdd() {
    const title = this.data.newTitle.trim();
    if (!title) {
      wx.showToast({ title: '请输入标题', icon: 'none' });
      return;
    }
    let deadline = '';
    if (this.data.newDeadlineDate) {
      deadline = this.data.newDeadlineDate;
      if (this.data.newDeadlineTime) {
        deadline += ' ' + this.data.newDeadlineTime;
      }
    }
    const result = storage.addTask({
      title: title,
      category: this.data.newCategory,
      deadline: deadline,
    });
    if (result) {
      wx.showToast({ title: '已添加', icon: 'success' });
      this.setData({ showModal: false, newTitle: '', newDeadlineDate: '', newDeadlineTime: '' });
      this.refresh();
    } else {
      wx.showToast({ title: '保存失败，请重试', icon: 'none' });
    }
  },

  onToggle(e) {
    const completed = storage.toggleComplete(e.currentTarget.dataset.id);
    wx.showToast({ title: completed ? '已完成' : '已取消', icon: 'none', duration: 800 });
    this.refresh();
  },

  onPin(e) {
    storage.togglePin(e.currentTarget.dataset.id);
    this.refresh();
  },

  onDelete(e) {
    const that = this;
    wx.showModal({
      title: '确认删除',
      content: '删除后无法恢复',
      confirmColor: '#FF6B9D',
      success(res) {
        if (res.confirm) {
          storage.deleteTask(e.currentTarget.dataset.id);
          that.refresh();
        }
      },
    });
  },
});
