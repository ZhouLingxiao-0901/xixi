let _app = null;
function _getApp() { if (!_app) { try { _app = getApp(); } catch (e) {} } return _app; }

Page({
  data: {
    isDark: false,
    themeLabel: '浅色模式',
    bgPreset: '',
    previewBg: '',
    presets: [
      { key: 'default', name: '默认', gradient: 'linear-gradient(135deg, #667eea, #764ba2)' },
      { key: 'ocean', name: '海洋', gradient: 'linear-gradient(135deg, #2193b0, #6dd5ed)' },
      { key: 'forest', name: '森林', gradient: 'linear-gradient(135deg, #11998e, #38ef7d)' },
      { key: 'sunset', name: '日落', gradient: 'linear-gradient(135deg, #f12711, #f5af19)' },
      { key: 'night', name: '星空', gradient: 'linear-gradient(135deg, #0f0c29, #302b63, #24243e)' },
      { key: 'pink', name: '樱花', gradient: 'linear-gradient(135deg, #ff9a9e, #fad0c4)' },
    ],
  },

  onShow() {
    const a = _getApp();
    if (!a) return;
    const g = a.globalData;
    const isDark = g.theme === 'dark';
    this.setData({
      isDark,
      themeLabel: isDark ? '深色模式' : '浅色模式',
      bgPreset: g.bgPreset || 'default',
      previewBg: g.bgImage || '',
    });
  },

  onDarkSwitch(e) {
    const a = _getApp();
    if (!a) return;
    const theme = e.detail.value ? 'dark' : 'light';
    a.globalData.theme = theme;
    a.applyTheme();
    this.setData({ isDark: e.detail.value, themeLabel: theme === 'dark' ? '深色模式' : '浅色模式' });
  },

  selectPreset(e) {
    const a = _getApp();
    if (!a) return;
    const key = e.currentTarget.dataset.key;
    a.saveData('bgPreset', key);
    a.saveData('bgImage', '');
    this.setData({ bgPreset: key, previewBg: '' });
    wx.showToast({ title: '壁纸已切换', icon: 'success' });
  },

  uploadBg() {
    const a = _getApp();
    if (!a) return;
    const that = this;
    wx.chooseMedia({
      count: 1,
      mediaType: ['image'],
      sourceType: ['album'],
      success(res) {
        const path = res.tempFiles[0].tempFilePath;
        a.saveData('bgImage', path);
        a.saveData('bgPreset', 'custom');
        that.setData({ bgPreset: 'custom', previewBg: path });
        wx.showToast({ title: '背景已更新', icon: 'success' });
      },
    });
  },

  exportData() {
    const a = _getApp();
    if (!a) return;
    const tasks = a.globalData.tasks;
    const memos = a.globalData.memos;
    wx.setClipboardData({
      data: JSON.stringify({ tasks, memos }, null, 2),
      success: () => wx.showToast({ title: '已复制到剪贴板', icon: 'success' }),
    });
  },

  clearData() {
    const that = this;
    wx.showModal({
      title: '⚠️ 危险操作',
      content: '将清空全部待办和随笔数据，不可恢复！',
      confirmText: '确认清空',
      confirmColor: '#FF6B9D',
      success(res) {
        if (res.confirm) {
          wx.clearStorageSync();
          const a = _getApp();
          if (a) { a.loadData(); }
          wx.showToast({ title: '已清空', icon: 'success' });
          that.onShow();
        }
      },
    });
  },
});
