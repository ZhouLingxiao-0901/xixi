# 年轻化自定义日程管家

微信原生小程序 · 本地存储 · 零后端 · 简约清新

## 功能说明

| 模块 | 功能 |
|------|------|
| 🏠 日常 | 待办列表、完成度统计（全部/待完成/已完成/完成率）、新增/完成/置顶/删除 |
| 📅 日历 | 日/周/月三视图切换、日期导航、按日期匹配展示任务 |
| 📋 计划 | 分类标签筛选（📚学习 / 💼工作 / 🎮休闲）、置顶、截止时间精确到分钟 |
| ✍️ 随笔 | 备忘录自由记录、相对时间显示、字数统计 |
| ⚙️ 设置 | 浅色/深色双主题跟随系统、6 款预设壁纸、手机相册自定义背景、数据导出/清空 |

## 技术栈

- 微信原生框架（WXML / WXSS / JS）
- 本地持久化存储（wx.Storage）
- CSS 变量实现双主题切换
- 系统深色模式自动跟随
- 按需注入（lazyCodeLoading）

## 快速开始

1. 下载安装 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)
2. 克隆本项目或导入 `D:\young_plan_app` 目录
3. 填写 AppID（测试可用测试号）
4. 编译预览 → 真机调试扫码

## 目录结构

```
young_plan_app/
├── app.js / app.json / app.wxss    # 入口、配置、主题系统
├── project.config.json             # 微信开发者工具配置
├── utils/storage.js                # 本地存储封装（CRUD + 统计）
├── pages/
│   ├── index/                      # 日常首页
│   ├── calendar/                   # 日历视图
│   ├── plan/                       # 计划管理
│   ├── memo/                       # 随笔记录
│   └── settings/                   # 主题/壁纸设置
└── images/                         # 图标资源
```

## 数据格式

```json
{
  "id": "唯一ID",
  "title": "任务标题",
  "category": "study|work|leisure",
  "deadline": "2026-06-05 14:30",
  "completed": false,
  "pinned": false,
  "createdAt": 1717430400000
}
```

## License

MIT

## 开发说明
本微信待办小程序由AI辅助编码、调试与部署
