# 岚亭融境 | LANTING Heritage Fusion Studio

这是岚亭非遗融创工作室的官方静态官网，采用 HTML、CSS 和 JavaScript 构建，面向 GitHub Pages 部署。

## 项目说明

网站展示工作室品牌、项目背景、XR 概念、技术栈、用户测试、团队成员、图集、商业应用与未来规划。

当前版本已接入：

- 4 分 20 秒融合 XR 项目实录（压缩为适合网页播放的 H.264 版本）
- 12 组项目原始 FBX 榫卯结构
- 基于 Three.js 的实时三维旋转、缩放与模型切换
- 面向桌面端与移动端的沉浸式响应布局

## 文件结构

```text
lanting-heritage-fusion-studio/
├── index.html
├── style.css
├── script.js
├── model-gallery.js
├── assets/
│   ├── models/
│   ├── video/
│   └── vendor/
└── README.md
```

## 本地运行

1. 在项目目录中打开终端。
2. 使用任意简单本地服务器打开网站，例如：

```powershell
python -m http.server 8000
```

3. 在浏览器中访问 `http://localhost:8000`。

> 三维模型使用 ES Modules 和 FBXLoader，必须通过本地服务器或线上地址访问，不建议直接双击 `index.html`。

## 编辑内容

### 修改团队成员

打开 `index.html`，找到 `id="team"` 的部分。

替换每个团队卡片中的内容：

```html
<h3>Member Name</h3>
<p class="role">Project Role</p>
<p><strong>Experience:</strong> ...</p>
<p><strong>Skills:</strong> ...</p>
<p><strong>Interests:</strong> ...</p>
```

### 替换图集与占位图

目前网站使用样式占位图卡片。你可以直接替换 `gallery-card` 内容为真实图片：

```html
<div class="gallery-card">
  <img src="assets/gallery/your-image.jpg" alt="描述" />
  <span>图集说明</span>
</div>
```

并补充对应 `style.css` 样式。

### 修改联系方式

在 `id="contact"` 的节中，替换 Email、GitHub 与 Portfolio 链接为实际地址。

## GitHub Pages 部署

1. 将仓库代码推送到 GitHub。
2. 打开仓库页面，进入 `Settings`。
3. 选择 `Pages`。
4. `Build and deployment` 选择 `Deploy from a branch`。
5. 设置分支为 `main`，文件夹选择 `/root`。
6. 保存并等待部署完成。

部署后，你的网站将通过 GitHub Pages 提供静态访问链接。

## 编辑建议

- 所有主要文本内容都可在 `index.html` 中直接编辑。
- 设计风格使用深色、红色高亮与现代卡片布局，可根据需要自定义颜色变量。
- 如需添加真实图片，请创建 `assets/gallery/` 或 `assets/team/` 文件夹，并在 HTML 中替换占位内容。
URL: https://xymmm000.github.io/lanting-heritage-fusion-studio/
