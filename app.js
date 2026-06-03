App({
  globalData: {
    tasks: [],
    memos: [],
    theme: 'light',
    bgImage: '',
    bgPreset: '',
  },

  onLaunch() {
    this.loadData();
    this.initTheme();
  },

  loadData() {
    try {
      const tasks = wx.getStorageSync('tasks') || [];
      const memos = wx.getStorageSync('memos') || [];
      const bgImage = wx.getStorageSync('bgImage') || '';
      const bgPreset = wx.getStorageSync('bgPreset') || '';
      this.globalData.tasks = tasks;
      this.globalData.memos = memos;
      this.globalData.bgImage = bgImage;
      this.globalData.bgPreset = bgPreset;
    } catch (e) {
      console.error('数据加载失败', e);
    }
  },

  initTheme() {
    const systemInfo = wx.getSystemInfoSync();
    const isDark = systemInfo.theme === 'dark';
    this.globalData.theme = isDark ? 'dark' : 'light';
    this.applyTheme();
  },

  onThemeChange({ theme }) {
    this.globalData.theme = theme;
    this.applyTheme();
  },

  applyTheme() {
    const isDark = this.globalData.theme === 'dark';
    const bgColor = isDark ? '#1a1a2e' : '#f5f0ff';
    const navColor = isDark ? '#16213e' : '#ffffff';
    const tabColor = isDark ? '#16213e' : '#ffffff';
    const titleColor = isDark ? '#ffffff' : '#000000';

    wx.setBackgroundColor({
      backgroundColor: bgColor,
      backgroundColorTop: navColor,
      backgroundColorBottom: tabColor,
    });
    wx.setNavigationBarColor({
      frontColor: isDark ? '#ffffff' : '#000000',
      backgroundColor: navColor,
    });
  },

  saveData(key, value) {
    try {
      wx.setStorageSync(key, value);
      this.globalData[key] = value;
    } catch (e) {
      wx.showToast({ title: '保存失败', icon: 'none' });
    }
  },
});
