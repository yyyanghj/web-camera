# 技术实现方案 (Implementation Plan)

## 1. 技术栈与工具 (Tech Stack & Tools)
- **核心框架**: SvelteKit
    - 选择理由：利用其 SSR/SSG 能力和优秀的开发体验 (DX)，适合构建高性能 Web 应用。
- **语言**: TypeScript
    - 选择理由：提供全项目强类型支持，减少运行时错误，提升代码可维护性。
- **样式方案**: TailwindCSS
    - 配合工具：`clsx` 和 `tailwind-merge` 用于动态样式的合并与管理。
    - 选择理由：原子化 CSS，能快速构建现代 UI，且易于定制主题。
- **图标库**: `lucide-svelte`
    - 选择理由：轻量、风格统一、现代的 SVG 图标库。
- **状态管理**: Svelte Stores
    - 选择理由：Svelte 内置的状态管理机制，响应式性能极佳，足以处理相机参数的实时联动。
- **图像处理**:
    - **CSS Filters**: 用于基础的亮度、对比度、模糊处理（性能最好）。
    - **SVG Filters**: 用于生成高质量的动态噪点（Grain）模拟。
    - **Canvas API**: 作为备选方案，如果 CSS 滤镜在某些复杂场景下性能不足时使用。
- **包管理器**: pnpm
    - 选择理由：快速、节省磁盘空间，且与 Svelte 生态兼容。

## 2. 整体架构与 UI 设计 (Architecture & UI Design)

### UI 设计风格
- **核心理念**: 现代极简 (Modern Minimalist)，致敬 **Zed Editor**。
- **视觉特征**:
    - **主题策略**: 利用 Tailwind 的 `dark:` 修饰符支持双主题。
        - **Dark Mode**: `bg-zinc-950` text-zinc-200` (默认/系统深色)。
        - **Light Mode**: `bg-white` `text-zinc-800` `border-zinc-200` (系统浅色)。
    - **配色**: 以 Zinc/Slate 色系为主，营造专业工具的氛围。
    - **排版**: 关键参数显示使用 **等宽字体 (Monospace)**，强调数据的精确感。
    - **布局**: 严格的网格系统，使用细线条分隔区域，直角边框，无多余装饰。
- **响应式策略**:
    - **移动端**: 竖屏布局。取景器占据屏幕上方约 2/3 区域，控制区在下方 1/3，符合单手操作习惯。
    - **桌面端**: 横屏布局。取景器居中，模拟手机竖屏比例；控制面板独立位于屏幕右侧，提供更详细的参数概览。

### 架构模式
- **组件化设计**:
    1.  **原子组件 (Atoms)**: 旋钮 (Knob)、滑块 (Slider)、按钮 (Button) 等无业务逻辑的基础 UI。
    2.  **业务组件 (Molecules/Organisms)**: 曝光控制面板 (ExposureControl)、取景器 (Viewfinder)、直方图 (Histogram)。
    3.  **页面 (Pages)**: 组合业务组件，处理布局响应。
- **逻辑分离**:
    - 核心相机逻辑（如 EV 值计算、参数边界限制）抽离为纯 TypeScript 模块或 Store，不与 UI 组件强耦合，便于测试和复用。

## 3. 核心功能设计 (Core Features Design)

### 3.1 曝光模拟引擎 (Exposure Engine)
由于 Web 无法直接控制物理光圈和快门，我们将通过软件算法模拟视觉效果：
- **亮度计算**: 建立数学模型 `Brightness = f(ISO, Aperture, ShutterSpeed)`，实时计算画面亮度增益。
- **噪点模拟 (ISO)**:
    - 使用 SVG `<filter>` 生成动态噪点层，覆盖在视频流之上。
    - 噪点的透明度/强度与 ISO 值正相关（ISO 越高，噪点越明显）。
- **动态模糊/帧率 (Shutter)**:
    - **低快门模拟**: 当快门速度低于特定阈值（如 1/30s）时，通过 CSS `blur()` 模拟运动模糊，或通过人为降低视频流的渲染帧率来模拟“拖影”感。

### 3.2 焦段模拟 (Focal Length)
- **实现方式**: 利用 CSS `transform: scale()` 对视频流容器进行无损放大（即数字裁剪）。
- **预设档位**:
    - **24mm**: 1x (原始视角)
    - **35mm**: ~1.5x
    - **50mm**: ~2x
    - **85mm**: ~3.5x

### 3.3 状态管理联动
使用 Svelte 的 `derived` stores 自动计算依赖值，确保数据一致性：
- 输入源: `iso`, `aperture`, `shutterSpeed`
- 衍生计算: `exposureValue` (EV)
- UI 驱动: `exposureValue` -> `uiBrightness` (屏幕亮度), `grainOpacity` (噪点强度)

## 4. 项目目录结构 (Project Structure)

```
src/
├── lib/
│   ├── components/        # UI 组件库
│   │   ├── ui/           # 通用原子组件 (Knob, Slider, Icon, Button)
│   │   ├── camera/       # 相机业务组件 (Viewfinder, Controls, Histogram, Overlay)
│   │   └── layout/       # 布局组件 (ResponsiveContainer, Grid)
│   ├── stores/           # 状态管理
│   │   ├── camera.ts     # 核心相机参数 Store (ISO, Aperture, Shutter...)
│   │   └── settings.ts   # 全局设置 (Theme, Preferences)
│   └── utils/            # 工具函数
│       ├── simulation.ts # 曝光计算、噪点生成算法
│       └── format.ts     # 参数格式化 (e.g. "1/1000s", "f/2.8")
├── routes/
│   └── +page.svelte      # 主应用入口
└── app.html              # 全局 HTML 模板
```
