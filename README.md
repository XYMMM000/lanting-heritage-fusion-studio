# 岚亭融境 | LANTING Heritage Fusion Studio Website

这是一个可直接部署到 GitHub Pages 的静态网站模板，用于展示“岚亭非遗融创工作室”的项目背景、设计理念、技术流程、用户测试、团队成员和项目图集。

## 文件结构

```text
lanting-heritage-website/
├── index.html
├── style.css
├── script.js
└── assets/
    └── slides/
```

## 如何修改团队成员

打开 `index.html`，搜索：

```html
<section class="section" id="team">
```

然后把每个 `member-card` 里的内容替换成你们自己的信息：

```html
<h3>Member Name</h3>
<p class="role">Project Role / 项目角色</p>
<p><strong>Experience:</strong> ...</p>
<p><strong>Skills:</strong> ...</p>
<p><strong>Interests:</strong> ...</p>
```

如果要加入头像，可以把：

```html
<div class="avatar">01</div>
```

改成：

```html
<img class="avatar-img" src="assets/team/member01.jpg" alt="Member Name">
```

然后在 `style.css` 里添加：

```css
.avatar-img {
  width: 76px;
  height: 76px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid var(--red);
  box-shadow: var(--glow);
}
```

## GitHub Pages 部署方法

1. 新建一个 GitHub repository，例如：`lanting-heritage-fusion`。
2. 把本文件夹里的所有文件上传到 repository 根目录。
3. 进入 repository 的 `Settings`。
4. 点击左侧 `Pages`。
5. 在 `Build and deployment` 里选择：
   - Source: `Deploy from a branch`
   - Branch: `main`
   - Folder: `/root`
6. 保存后等待 1–3 分钟，即可得到网站链接。

## 推荐品牌名称

中文主名：岚亭融境  
英文名：LANTING Heritage Fusion Studio  
完整名：岚亭非遗融创工作室

“岚亭融境”更适合放在网站首页和视觉主标题里；完整名适合放在页脚、简介和团队介绍里。
