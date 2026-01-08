# Angular 图片裁剪组件

[![npm 版本](https://img.shields.io/npm/v/@luoxiao123/angular-image-cropper.svg?style=flat-square)](https://www.npmjs.com/package/@luoxiao123/angular-image-cropper)
[![许可证](https://img.shields.io/npm/l/@luoxiao123/angular-image-cropper.svg?style=flat-square)](LICENSE)
[![下载量](https://img.shields.io/npm/dm/@luoxiao123/angular-image-cropper?style=flat-square)]()
[![GitHub Star](https://img.shields.io/github/stars/xylplm/angular-image-cropper.svg?style=flat-square)](https://github.com/xylplm/angular-image-cropper)

![示例](https://github.com/xylplm/angular-image-cropper/raw/master/cropper-example.png)

[English](https://github.com/xylplm/angular-image-cropper) | [中文](https://github.com/xylplm/angular-image-cropper/blob/master/README.zh.md)

## 📚 目录

- [项目说明](#项目说明)
- [安装](#安装)
- [快速开始](#快速开始)
  - [Standalone 组件（推荐）](#standalone-组件推荐)
  - [NgModule（传统方式）](#ngmodule传统方式)
- [使用指南](#使用指南)
  - [Standalone 组件](#standalone-组件)
  - [NgModule（传统方式）](#ngmodule传统方式-1)
- [配置](#配置)
- [API 文档](#api-文档)
  - [输入属性](#输入属性)
  - [输出事件](#输出事件)
  - [CSS 变量](#css-变量)
  - [方法](#方法)
  - [接口](#接口)
- [Angular 版本兼容性](#angular-版本兼容性)
- [替代方案](#替代方案)
- [升级说明](#升级说明)
- [贡献](#贡献)
- [许可证](#许可证)

## 项目说明

本项目是基于 [ngx-image-cropper](https://github.com/Mawi137/ngx-image-cropper) 二次开发。由于原始项目不是基于 Angular 最新标准，无法满足需求。因此对它进行了新的改造。

该包允许在 Angular 应用中使用图片裁剪功能。它提供了一个用户友好的界面来选择和裁剪图片，支持各种定制选项。

**快速链接：**
- 📦 [NPM 包](https://www.npmjs.com/package/@luoxiao123/angular-image-cropper)
- 🎨 [在线演示](https://xylplm.github.io/angular-image-cropper/)
- 📖 [原始库](https://github.com/xylplm/angular-image-cropper)

**主要特性：**
- 🎯 直观的图片裁剪界面
- 📐 可自定义的纵横比和尺寸
- 🎨 使用 CSS 变量轻松定制样式
- ♿ 无障碍访问支持
- 📦 可摇树 - 仅导入需要的内容
- ⚡ 轻量级且高性能
- 🎭 同时支持 Standalone 组件和 NgModule

## 安装

通过 npm 安装：

```sh
npm install @luoxiao123/angular-image-cropper --save
```

## 快速开始

### Standalone 组件（推荐）

```typescript
import { Component } from '@angular/core';
import { ImageCropperComponent, ImageCroppedEvent } from '@luoxiao123/angular-image-cropper';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ImageCropperComponent],
  template: `
    <input type="file" (change)="fileChangeEvent($event)" />
    
    <image-cropper
      [imageChangedEvent]="imageChangedEvent"
      [maintainAspectRatio]="true"
      [aspectRatio]="4 / 3"
      format="png"
      (imageCropped)="imageCropped($event)"
      (imageLoaded)="imageLoaded()"
      (cropperReady)="cropperReady()"
      (loadImageFailed)="loadImageFailed()"
    ></image-cropper>
    
    <img [src]="croppedImage" />
  `,
})
export class AppComponent {
  imageChangedEvent: Event | null = null;
  croppedImage: string | null = null;

  fileChangeEvent(event: Event): void {
    this.imageChangedEvent = event;
  }

  imageCropped(event: ImageCroppedEvent): void {
    this.croppedImage = event.objectUrl;
  }

  imageLoaded(): void {
    console.log('图片已加载');
  }

  cropperReady(): void {
    console.log('裁剪工具已就绪');
  }

  loadImageFailed(): void {
    console.log('图片加载失败');
  }
}
```

### NgModule（传统方式）

如果使用 NgModule 项目：

```typescript
import { NgModule } from '@angular/core';
import { ImageCropperModule } from '@luoxiao123/angular-image-cropper';

@NgModule({
  imports: [ImageCropperModule],
  exports: [ImageCropperModule],
})
export class ImagesModule {}
```

在模板中使用：

```html
<input type="file" (change)="fileChangeEvent($event)" />

<image-cropper
  [imageChangedEvent]="imageChangedEvent"
  [maintainAspectRatio]="true"
  [aspectRatio]="4 / 3"
  format="png"
  (imageCropped)="imageCropped($event)"
  (imageLoaded)="imageLoaded()"
  (cropperReady)="cropperReady()"
  (loadImageFailed)="loadImageFailed()"
></image-cropper>

<img [src]="croppedImage" />
```

## 使用指南

### Standalone 组件

推荐用于现代 Angular 应用。直接在组件 imports 中使用该组件。

### NgModule（传统方式）

用于使用 NgModule 架构的旧版 Angular 项目，在模块声明中导入 `ImageCropperModule`。

## 配置

### 样式定制

使用 CSS 变量或内联样式自定义裁剪工具的外观：

```html
<image-cropper 
  name="my-cropper"
  style="--cropper-color: #2563eb; --cropper-border: 2px solid white;"
></image-cropper>
```

```css
.my-cropper-style {
  --cropper-outline-color: rgba(255, 255, 255, 0.3);
  --cropper-overlay-color: rgba(255, 255, 255);
  --cropper-color: #53535c;
  --cropper-border: 1px solid rgba(255, 255, 255, 0.5);
}
```

**样式提示：**
- 使用 `width` 和 `height` 调整裁剪工具大小
- 使用 CSS 变量实现一致的主题
- 应用自定义样式以提高无障碍性

## API 文档

所有输入属性都是可选的。应设置 `imageChangedEvent`、`imageBase64` 或 `imageFile` 之一以将图片加载到裁剪工具中。

### 输入属性

| 名称                       | 类型                    | 默认值        | 说明                                                                                                                                                                                                                                                                                                                           |
|----------------------------|-------------------------|--------------|---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `imageChangedEvent`        | FileEvent               |              | 来自文件输入的 change 事件（设为 `null` 可重置裁剪工具）                                                                                                                                                                                                                                                            |
| `imageFile`                | Blob(File)              |              | 要裁剪的文件（设为 `null` 可重置裁剪工具）                                                                                                                                                                                                                                                                      |
| `imageBase64`              | string                  |              | 如果不想使用文件输入，可直接设置 base64 图片字符串                                                                                                                                                                                                                                     |
| `imageURL`                 | string                  |              | 如果不使用文件输入或 base64，可设置图片 URL。如果请求来自不同域的图片，请确保允许跨域资源共享（CORS），否则图片将加载失败。                                                                                                  |
| `imageAltText`             | string                  |              | 已上传图片的替代文字，用于无障碍性合规。                                                                                                                                                                                                                                                     |
| `cropperFrameAriaLabel`    | string                  | 'Crop photo' | 焦点可聚焦的裁剪框元素的 Aria-label 文字。                                                                                                                                                                                                                                                              |
| `format`                   | string                  | png          | 输出格式 (png, jpeg, webp, bmp, ico)（不是所有浏览器都支持所有类型，png 始终被支持，其他是可选的）                                                                                                                                                                                                          |
| `output`                   | string                  | blob         | 输出类型 (blob 或 base64)（blob 性能最好）                                                                                                                                                                                                                                                            |
| `aspectRatio`              | number                  | 1 / 1        | 宽度/高度比例（例如 1 / 1 表示正方形，4 / 3，16 / 9 ...）                                                                                                                                                                                                                                                                 |
| `maintainAspectRatio`      | boolean                 | true         | 保持裁剪图片的宽高比相等                                                                                                                                                                                                                                             |
| `containWithinAspectRatio` | boolean                 | false        | 设为 true 时，会在图片周围添加填充以适应纵横比                                                                                                                                                                                                                                           |
| `resizeToWidth`            | number                  | 0（禁用）    | 裁剪后的图片将被调整为最多此宽度（单位 px）                                                                                                                                                                                                                                                           |
| `resizeToHeight`           | number                  | 0（禁用）    | 裁剪后的图片将被调整为最多此高度（单位 px）                                                                                                                                                                                                                                                          |
| `cropperStaticWidth`       | number                  | 0（禁用）    | 设置裁剪工具宽度并禁用调整大小（单位 px）                                                                                                                                                                                                                                                                          |
| `cropperStaticHeight`      | number                  | 0（禁用）    | 设置裁剪工具高度并禁用调整大小（单位 px）                                                                                                                                                                                                                                                                         |
| `cropperMinWidth`          | number                  | 0（禁用）    | 裁剪工具的最小宽度（相对于原始图片尺寸）（单位 px）                                                                                                                                                                                                                                    |
| `cropperMinHeight`         | number                  | 0（禁用）    | 裁剪工具的最小高度（相对于原始图片尺寸）（单位 px）（如果设置了 `maintainAspectRatio` 将被忽略）                                                                                                                                                 |
| `cropperMaxWidth`          | number                  | 0（禁用）    | 裁剪工具的最大宽度（单位 px）                                                                                                                                                                                                                                         |
| `cropperMaxHeight`         | number                  | 0（禁用）    | 裁剪工具的最大高度（单位 px）                                                                                                                                                                                                                                        |
| `initialStepSize`          | number                  | 3（px）      | 使用键盘移动裁剪工具时的初始步长（单位 px）。之后可通过数字键盘更改步长                                                                                                                                                                             |
| `onlyScaleDown`            | boolean                 | false        | 设置 `resizeToWidth` 或 `resizeToHeight` 时，启用此选项可确保较小的图片不会放大                                                                                                                                                                                                             |
| `cropper`                  | CropperPosition         |              | 用于覆盖裁剪工具坐标。创建 `CropperPosition` 类型的新对象并分配给此输入。确保每次覆盖裁剪工具位置时都创建新对象，并等待 `cropperReady` 事件触发。                                      |
| `roundCropper`             | boolean                 | false        | 设为 true 可使用圆形裁剪工具。生成的图片仍为正方形，在结果图片上使用 `border-radius: 100%` 即可显示为圆形。                                                                                                         |
| `imageQuality`             | number                  | 92           | 仅当输出格式为 jpeg 或 webp 时适用。输入 0 到 100 之间的数字可确定输出图片的质量。                                                                                                                                                                                       |
| `autoCrop`                 | boolean                 | true         | 设为 true 时，每次改变裁剪工具位置或大小时都会发出图片。设为 false 时，可自行调用 crop 方法（使用 @ViewChild 获取裁剪工具方法）。                                                                                                           |
| `alignImage`               | 'left' 或 'center'      | 'center'     | 在裁剪工具中将图片对齐到左侧或中心。                                                                                                                                                              |
| `backgroundColor`          | string                  |              | 用于设置背景颜色，当上传带透明色的格式并转换为 'jpeg' 或 'bmp' 时很有用。透明像素将变为设置的颜色或默认值。输入任何表示 CSS 颜色的字符串。 |
| `hideResizeSquares`        | boolean                 | false        | 禁用裁剪工具边框处的调整大小方块。主要用于触摸设备，可通过双指缩放来改变裁剪工具大小。                                                                                      |
| `disabled`                 | boolean                 | false        | 禁用组件并防止改变裁剪工具位置                                                                                                                                                                     |
| `canvasRotation`           | number                  | 0            | 旋转画布（1 = 90度，2 = 180度...）                                                                                                                                                                          |
| `transform`                | ImageTransform          | {}           | 翻转、旋转和缩放图片。（如果启用了 `allowMoveImage`，请确保对 transform 输入使用双向绑定 `[(transform)]="transform"`）                                                                                                                       |
| `allowMoveImage`           | boolean                 | false        | 允许移动背景图片。启用时并使用 `transform` 输入，请确保对 transform 输入使用双向绑定 (`[(transform)]="transform"`)。                                                                                                                                          |
| `hidden`                   | boolean                 | false        | 设为 true 可隐藏图片裁剪工具                                                                                                                                                                                                                     |
| `options`                  | Partial<CropperOptions> | undefined    | 一次性提供多个选项，而不是使用单个输入。通过此输入传递的选项将作为补丁应用。如果先传递 `{canvasRotation: 3}`，再传递 `{}`，这不会重置 `canvasRotation`。要重置它，应传递 `{canvasRotation: 0}`。                                                   |


### 输出事件
| 名称              | 类型              | 说明                                                                                                                                                          |
|-------------------|-------------------|----------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| `imageCropped`    | ImageCroppedEvent | 每次裁剪图片时发出 ImageCroppedEvent                                                                                                            |
| `imageLoaded`     | LoadedImage       | 图片加载到裁剪工具中时发出 `LoadedImage`                                                                                                          |
| `cropperReady`    | Dimensions        | 裁剪工具准备好交互时发出。返回的 Dimensions 对象包含显示的图片尺寸                                           |
| `startCropImage`  | void              | 组件开始裁剪图片时发出                                                                                                                  |
| `loadImageFailed` | void              | 选择了错误的文件类型时发出（仅支持 png、gif 和 jpg）                                                                                        |
| `transformChange` | ImageTransform    | 图片变换改变时发出。可用于双向数据绑定，因为该对象可从外部和组件内部改变。 |
| `cropperChange`   | CropperPosition   | 裁剪工具位置改变时发出。可用于双向数据绑定，因为该对象可从外部和组件内部改变。      |

### CSS 变量
| 名称                                   | 类型      | 默认值                            | 说明                                                             |
|----------------------------------------|-----------|------------------------------------|-------------------------------------------------------------------------|
| `--cropper-outline-color`              | string    | rgba(255,255,255,0.3)              | 裁剪工具周围显示的背景颜色                         |
| `--cropper-overlay-color`              | string    | rgba(255,255,255)                  | 图片周围显示的背景颜色                           |
| `--cropper-color`                      | string    | #53535C                            | 裁剪选区显示的颜色                             |
| `--cropper-border`                     | string    | 1px solid rgba(255, 255, 255, 0.5) | 裁剪工具周围显示的边框                                   |
| `--cropper-hover-border`               | string    | `--cropper-border`                 | 悬停时裁剪工具周围显示的边框                 |
| `--cropper-focus-border`               | string    | 2px solid dodgerblue               | 焦点获得时裁剪工具周围显示的边框                 |
| `--cropper-resize-square-bg`           | string    | #53535C                            | 调整大小方块的背景颜色                              |
| `--cropper-resize-square-border`       | string    | 1px solid rgba(255, 255, 255, 0.5) | 调整大小方块的边框                                        |
| `--cropper-resize-square-hover-bg`     | string    | `--cropper-resize-square-bg`       | 悬停时调整大小方块的背景颜色        |
| `--cropper-resize-square-hover-border` | string    | `--cropper-resize-square-border`   | 悬停时调整大小方块的边框                  |
| `--cropper-resize-square-focus-bg`     | string    | `--cropper-resize-square-bg`       | 获得焦点时调整大小方块的背景颜色 |
| `--cropper-resize-square-focus-border` | string    | `--cropper-resize-square-border`   | 获得焦点时调整大小方块的边框           |

### 方法
使用 `@ViewChild(ImageCropperComponent) imageCropper: ImageCropperComponent;` 获取图片裁剪工具的方法

| 名称                                               | 返回值                                         | 说明                                                                                                                                                                                           |
|----------------------------------------------------|-------------------------------------------------|-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| <code>crop(output?: 'blob' &#124; 'base64')</code> | Promise<ImageCroppedEvent> 或 ImageCroppedEvent | 将源图片裁剪为当前裁剪工具位置。如果只想直接使用此函数，请确保设置 `autoCrop` 为 `false`。当 output 设为 `blob` 时，将返回 Promise。  |

### 接口
#### CropperPosition
| 属性 | 类型   | 说明                             |
|----------|--------|-----------------------------------------|
| x1       | number | 第一坐标的 X 位置（单位 px）  |
| y1       | number | 第一坐标的 Y 位置（单位 px）  |
| x2       | number | 第二坐标的 X 位置（单位 px） |
| y2       | number | 第二坐标的 Y 位置（单位 px） |

#### ImageTransform
| 属性      | 类型     | 说明                                             |
|---------------|----------|---------------------------------------------------------|
| scale         | number   | 缩放图片（1=正常，2=2倍缩放...）                    |
| rotate        | number   | 旋转度数                                     |
| flipH         | boolean  | 水平翻转                                    |
| flipV         | boolean  | 竖直翻转                                      |
| translateH    | number   | 水平移动（百分比）                                |
| translateV    | number   | 竖直移动（百分比）                                 |
| translateUnit | number   | 平移的单位（% 或 px）（默认 = %） |

#### ImageCroppedEvent
| 属性            | 类型            | 说明                                                                                                                           |
|---------------------|-----------------|---------------------------------------------------------------------------------------------------------------------------------------|
| blob                | Blob            | 裁剪后图片的 Blob（仅当 output="blob"）                                                                                     |
| objectUrl           | string          | 指向生成的 blob 的对象 URL（仅当 output="blob"）                                                                     |
| base64              | string          | 裁剪后图片的 Base64 字符串（仅当 output="base64"）                                                                          |
| width               | number          | 裁剪后图片的宽度                                                                                                            |
| height              | number          | 裁剪后图片的高度                                                                                                           |
| cropperPosition     | CropperPosition | 裁剪时裁剪工具相对于显示图片大小的位置                                                      |
| imagePosition       | CropperPosition | 裁剪时裁剪工具相对于原始图片大小的位置                                                       |
| offsetImagePosition | CropperPosition | 裁剪时裁剪工具相对于原始图片大小（不含填充）的位置（当 containWithinAspectRatio 为 true） |

#### LoadedImage
| 属性               | 类型              | 说明                                   |
|------------------------|-------------------|-----------------------------------------------|
| original.objectUrl     | string            | 指向原始图片的对象 URL     |
| original.image         | HTMLImageElement  | 原始图片的 HTMLImageElement        |
| original.size          | Dimension         | 原始图片的宽度和高度        |
| transformed.objectUrl  | string            | 指向变换后图片的对象 URL  |
| transformed.image      | HTMLImageElement  | 变换后图片的 HTMLImageElement     |
| transformed.size       | Dimension         | 变换后图片的宽度和高度     |
| exifTransform          | ExifTransform     | 从原始图片读取的 Exif 变换 |

## Angular 版本兼容性

| Angular 版本 | 支持 |
| :---: | :---: |
| 20+ | ✅ |

## 替代方案

如果 **angular-image-cropper** 无法满足您的需求，这里有一些替代方案：

### Pintura

Pintura 提供裁剪、旋转、翻转、过滤、注释以及许多其他功能，可满足移动和桌面设备上的所有图片和视频编辑需求。

[![Pintura 示例](https://github.com/xylplm/angular-image-cropper/raw/master/pintura-animation.gif)](https://pqina.nl/pintura/?aff=yMk6n8)

[了解更多关于 Pintura 图片编辑器](https://pqina.nl/pintura/?aff=yMk6n8)

## 升级说明

如需了解重大变更和升级说明，请查看 [releases](https://github.com/xylplm/angular-image-cropper/releases)。

自版本 9.0.0 以来，仅支持 Angular 17.3+。

## 贡献

欢迎贡献！如果您发现了 bug 或有功能建议，请在 [GitHub](https://github.com/xylplm/angular-image-cropper/issues) 上提出 issue。

### 开始开发

1. Fork 此仓库
2. Clone 克隆后的仓库
3. 安装依赖：`npm install`
4. 启动开发服务器：`npm run start`

## 许可证

本项目采用 MIT 许可证。详见 [LICENSE](LICENSE) 文件。
