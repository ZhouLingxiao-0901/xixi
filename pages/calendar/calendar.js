const storage = require('../../utils/storage');

Page({
  data: {
    view: 'month',
    currentDate: '',
    dateTitle: '',
    dayLabel: '',
    dayTasks: [],
    weekDays: [],
    monthCells: [],
    selectedDayTasks: [],
  },

  onLoad() {
    this.setData({ currentDate: new Date() });
  },

  onShow() {
    if (!this.data.currentDate) {
      this.setData({ currentDate: new Date() });
    }
    this.buildAll();
  },

  switchView(e) {
    this.setData({ view: e.currentTarget.dataset.view }, () => this.buildAll());
  },

  prev() {
    const d = new Date(this.data.currentDate);
    const view = this.data.view;
    if (view === 'day') d.setDate(d.getDate() - 1);
    else if (view === 'week') d.setDate(d.getDate() - 7);
    else d.setMonth(d.getMonth() - 1);
    this.setData({ currentDate: d }, () => this.buildAll());
  },

  next() {
    const d = new Date(this.data.currentDate);
    const view = this.data.view;
    if (view === 'day') d.setDate(d.getDate() + 1);
    else if (view === 'week') d.setDate(d.getDate() + 7);
    else d.setMonth(d.getMonth() + 1);
    this.setData({ currentDate: d }, () => this.buildAll());
  },

  buildAll() {
    const d = new Date(this.data.currentDate);
    const y = d.getFullYear();
    const m = d.getMonth() + 1;
    this.setData({ dateTitle: `${y}年${m}月` });
    this.buildDay();
    this.buildWeek();
    this.buildMonth();
  },

  buildDay() {
    const d = new Date(this.data.currentDate);
    const tasks = storage.getTasks();
    const dateStr = this.fmtDate(d);
    const dayTasks = tasks.filter(t => t.deadline && t.deadline.startsWith(dateStr));
    this.setData({
      dayLabel: `${d.getMonth() + 1}月${d.getDate()}日`,
      dayTasks,
      selectedDayTasks: dayTasks,
    });
  },

  buildWeek() {
    const today = new Date(this.data.currentDate);
    const dayOfWeek = today.getDay();
    const monday = new Date(today);
    monday.setDate(today.getDate() - (dayOfWeek === 0 ? 6 : dayOfWeek - 1));
    const tasks = storage.getTasks();
    const now = new Date();
    const weekDays = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(monday);
      date.setDate(monday.getDate() + i);
      const dateStr = this.fmtDate(date);
      weekDays.push({
        name: ['一','二','三','四','五','六','日'][i],
        date: date.getDate(),
        isToday: this.fmtDate(now) === dateStr,
        tasks: tasks.filter(t => t.deadline && t.deadline.startsWith(dateStr)),
      });
    }
    this.setData({ weekDays });
  },

  buildMonth() {
    const d = new Date(this.data.currentDate);
    const y = d.getFullYear();
    const m = d.getMonth();
    const firstDay = new Date(y, m, 1).getDay();
    const daysInMonth = new Date(y, m + 1, 0).getDate();
    const tasks = storage.getTasks();
    const now = new Date();
    const cells = [];

    for (let i = 0; i < firstDay; i++) {
      cells.push({ date: '', isCurrentMonth: false, isToday: false, count: 0 });
    }
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${y}-${String(m + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
      const count = tasks.filter(t => t.deadline && t.deadline.startsWith(dateStr)).length;
      cells.push({
        date: d,
        isCurrentMonth: true,
        isToday: this.fmtDate(now) === dateStr,
        count,
      });
    }
    this.setData({ monthCells: cells });
  },

  fmtDate(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${y}-${m}-${day}`;
  },
});
