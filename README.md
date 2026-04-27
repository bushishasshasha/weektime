# 一周时间表

一个纯静态的一周时间表网页应用，可以直接部署到 GitHub Pages。

## 本地使用

双击打开：

```text
timetable.html
```

## 项目结构

```text
timetable.html       页面结构和弹窗骨架
timetable.css        主题、手机端适配、动画和布局样式
timetable-app.js     渲染、交互、主题切换、导入导出和本地存储逻辑
data.js              示例时间表、主题素材、彩蛋文案和分类配置
utils.js             时间解析、格式化、转义等通用工具
service-worker.js    PWA 离线缓存清单
assets/              主题背景素材
```

继续开发时，优先按这个分工放代码：视觉动效改 `timetable.css`，交互逻辑改 `timetable-app.js`，主题素材和文案改 `data.js`。

## GitHub Pages 部署

1. 在 GitHub 新建一个仓库。
2. 把本文件夹里的所有文件上传到仓库根目录。
3. 打开仓库的 `Settings > Pages`。
4. `Source` 选择 `Deploy from a branch`。
5. `Branch` 选择 `main`，目录选择 `/root`。
6. 保存后等待 GitHub Pages 构建完成。

部署完成后，打开 GitHub 给出的 Pages 地址即可使用。手机浏览器打开后，可以选择“添加到主屏幕”。
