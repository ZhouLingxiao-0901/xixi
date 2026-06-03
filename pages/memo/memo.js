const storage = require('../../utils/storage');

Page({
  data: {
    newMemo: '',
    memos: [],
  },

  onShow() {
    this.refresh();
  },

  refresh() {
    const memos = storage.getMemos().map(m => ({
      ...m,
      timeStr: this.fmtTime(m.createdAt),
    }));
    this.setData({ memos, newMemo: '' });
  },

  onInput(e) {
    this.setData({ newMemo: e.detail.value });
  },

  onAdd() {
    const text = this.data.newMemo.trim();
    if (!text) return;
    storage.addMemo(text);
    wx.showToast({ title: '已记录', icon: 'success' });
    this.refresh();
  },

  onDelete(e) {
    wx.showModal({
      title: '删除随笔',
      content: '确认删除这条记录？',
      confirmColor: '#FF6B9D',
      success: (res) => {
        if (res.confirm) {
          storage.deleteMemo(e.currentTarget.dataset.id);
          this.refresh();
        }
      },
    });
  },

  fmtTime(ts) {
    const d = new Date(ts);
    const now = new Date();
    const diff = now - d;
    if (diff < 60000) return '刚刚';
    if (diff < 3600000) return Math.floor(diff / 60000) + '分钟前';
    if (diff < 86400000) return Math.floor(diff / 3600000) + '小时前';
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const h = String(d.getHours()).padStart(2, '0');
    const min = String(d.getMinutes()).padStart(2, '0');
    return `${m}-${day} ${h}:${min}`;
  },
});
