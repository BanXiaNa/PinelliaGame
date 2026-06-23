# PinelliaGame 🎮

> 网页小游戏仓库 —— 通过 **GameMain** 导航大厅统一管理，克隆即可使用。

---

## 📦 仓库结构

```
PinelliaGame/
├── README.md                    # 本文件
├── GameMain/                    # 游戏导航大厅 ← 核心入口
│   ├── index.html               # 大厅页面
│   ├── style.css                # 大厅样式
│   └── app.js                   # 大厅逻辑（读取索引、渲染卡片）
└── games/                       # 所有小游戏放在这里
    ├── games-index.json         # 游戏清单索引（汇总所有游戏的 manifest）
    └── example-game/            # 示例：每个游戏一个文件夹
        ├── manifest.json        # 游戏注册信息
        ├── index.html           # 游戏主页面
        ├── style.css            # 游戏样式
        └── game.js              # 游戏逻辑
```

---

## 🚀 快速开始

### 克隆仓库

```bash
git clone https://github.com/BanXiaNa/PinelliaGame.git
```

### 打开游戏大厅

直接双击 `GameMain/index.html` 打开，或用任意静态服务器：

```bash
# Python
python -m http.server 8080

# Node.js (需要安装 serve)
npx serve .

# VS Code 插件 Live Server 右键打开
```

浏览器访问 `http://localhost:8080/GameMain/` 即可进入游戏大厅。

### 在其他项目中使用

将本仓库克隆到项目的子目录中：

```bash
cd your-project
git clone https://github.com/BanXiaNa/PinelliaGame.git games-repo
```

然后在页面中引用 GameMain：

```html
<a href="games-repo/GameMain/index.html">🎮 进入游戏大厅</a>
```

或通过 iframe 嵌入作为游戏菜单：

```html
<iframe src="games-repo/GameMain/index.html" width="400" height="600"></iframe>
```

---

## 🎯 添加新游戏

每个游戏独立放在 `games/` 下的一个文件夹中，结构如下：

```
games/your-game/
├── manifest.json        # 游戏注册信息（必填）
├── index.html           # 游戏主页面（必填）
├── style.css            # 游戏样式（可选）
└── game.js              # 游戏逻辑（可选）
```

### manifest.json 格式

```json
{
  "name": "游戏名称",
  "description": "简短的游戏描述",
  "icon": "🎮",
  "color": "#4CAF50",
  "path": "games/your-game",
  "tags": ["标签1", "标签2"]
}
```

### 注册到大厅

新游戏添加后，需要更新 `games/games-index.json`，将游戏的 manifest 信息加入数组：

```json
[
  {
    "name": "游戏名称",
    "description": "简短的游戏描述",
    "icon": "🎮",
    "color": "#4CAF50",
    "path": "games/your-game",
    "tags": ["标签1", "标签2"]
  }
]
```

> 提示：可直接复制 `manifest.json` 的内容到 `games-index.json` 数组中。

---

## 📋 规范要求

| 要求 | 说明 |
|---|---|
| **自包含** | 每个游戏一个独立文件夹，HTML/CSS/JS 不依赖外部资源 |
| **独立运行** | 游戏可脱离 GameMain 直接打开 `index.html` 运行 |
| **零依赖** | 纯前端技术栈，无需 Node.js / npm / 构建工具 |
| **返回按钮** | 游戏页面中建议提供「返回大厅」的链接 |
| **文件命名** | 统一使用小写英文字母和连字符（如 `snake-game`） |

---

## 🧩 技术栈

- **语言**：HTML5 + CSS3 + JavaScript (ES6+)
- **依赖**：无（纯静态，零依赖）
- **兼容**：现代浏览器（Chrome / Firefox / Edge / Safari）

---

## 📄 许可

MIT License
