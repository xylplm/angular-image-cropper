# Angular 21 Zoneless + Signals 完整迁移指南

## 迁移日期
2026年1月8日

## 迁移概述
项目已完全迁移为 Angular 21 **zoneless 模式** + **Signals 响应式系统**。这是现代 Angular 应用的最佳实践组合。

---

## 第一部分：Zoneless 模式迁移

### 1. ✅ 启用 Zoneless 变更检测

**文件:** [src/main.ts](src/main.ts)

```typescript
// 旧代码
import { provideZoneChangeDetection } from "@angular/core";
providers: [provideZoneChangeDetection()]

// 新代码
import { provideZonelessChangeDetection } from "@angular/core";
providers: [provideZonelessChangeDetection()]
```

### 2. ✅ 从 angular.json 移除 zone.js polyfills

**修改位置1:** demo-app build 配置
```json
// 删除了
"polyfills": ["zone.js"]
```

**修改位置2:** angular-image-cropper 库 test 配置
```json
// 删除了
"polyfills": [
  "zone.js",
  "zone.js/testing"
]
```

### 3. ✅ 从 package.json 移除 zone.js 依赖

```json
// 删除了
"zone.js": "~0.16.0"
```

---

## 第二部分：Signals 响应式系统迁移

### 核心改进：将所有状态转换为 Signals

**文件:** [src/app/app.component.ts](src/app/app.component.ts)

#### 之前（传统属性）
```typescript
export class AppComponent {
  showCropper = false;
  loading = false;
  croppedImage: SafeUrl = '';
  imageURL?: string;
  canvasRotation = 0;
  // ... 等等
}
```

#### 之后（Signals）
```typescript
import { signal, computed } from '@angular/core';

export class AppComponent {
  // 简单状态信号
  showCropper = signal(false);
  loading = signal(false);
  croppedImage = signal<SafeUrl>('');
  imageURL = signal<string>('');
  canvasRotation = signal(0);
  
  // 复杂状态信号
  transform = signal<ImageTransform>({
    translateUnit: 'px',
    scale: 1,
    rotate: 0,
    flipH: false,
    flipV: false,
    translateH: 0,
    translateV: 0
  });

  // 计算信号
  aspectRatioDisplay = computed(() => 
    this.aspectRatio() === 4 / 3 ? '4/3' : '16/5'
  );
}
```

### 关键 Signals API

#### 设置值
```typescript
this.showCropper.set(true);
```

#### 更新值
```typescript
this.canvasRotation.update(val => val + 1);
this.backgroundColor.update(val => val === 'red' ? 'blue' : 'red');
```

#### 读取值（在模板中）
```html
<div [style.display]="showCropper() ? null : 'none'">...</div>
```

#### 读取值（在代码中）
```typescript
const current = this.transform();
```

#### 计算信号（自动跟踪依赖）
```typescript
aspectRatioDisplay = computed(() => 
  this.aspectRatio() === 4 / 3 ? '4/3' : '16/5'
);
```

---

## 第三部分：模板更新

### 文件：[src/app/app.component.html](src/app/app.component.html)

#### 属性绑定
```html
<!-- 旧 -->
<div [style.display]="showCropper ? null : 'none'">

<!-- 新 -->
<div [style.display]="showCropper() ? null : 'none'">
```

#### 双向绑定
```html
<!-- 旧 -->
<input [(ngModel)]="imageURL" />

<!-- 新 -->
<input [ngModel]="imageURL()" (ngModelChange)="imageURL.set($event)" />
```

#### 按钮事件处理
```html
<!-- 旧 -->
<button (click)="maintainAspectRatio = !maintainAspectRatio">

<!-- 新 -->
<button (click)="toggleMaintainAspectRatio()">
```

#### 条件渲染
```html
<!-- 旧 -->
@if (loading) { ... }

<!-- 新 -->
@if (loading()) { ... }
```

---

## 第四部分：组件方法更新

### 所有状态修改转换为 Signal API

```typescript
// 旧：直接赋值
rotateLeft() {
  this.canvasRotation--;
  this.loading = true;
}

// 新：使用 Signal API
rotateLeft() {
  this.loading.set(true);
  setTimeout(() => {
    this.canvasRotation.update(val => val - 1);
    this.flipAfterRotate();
  });
}
```

### 新增 Toggle 方法

为了保持模板简洁，添加了 helper 方法：

```typescript
toggleMaintainAspectRatio() {
  this.maintainAspectRatio.update(val => !val);
}

toggleHidden() {
  this.hidden.update(val => !val);
}

toggleDisabled() {
  this.disabled.update(val => !val);
}

// ... 等等
```

### 公开 updateTransform 方法

为了让模板可以访问，将其改为 public：

```typescript
public updateTransform(newTransform: ImageTransform) {
  this.transform.set(newTransform);
}
```

---

## 第五部分：组件配置

### ChangeDetectionStrategy.OnPush

**文件:** [src/app/app.component.ts](src/app/app.component.ts#L16)

```typescript
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [FormsModule, ImageCropperComponent],
    changeDetection: ChangeDetectionStrategy.OnPush  // ✅ 已配置
})
```

**库组件** 也已配置：[projects/angular-image-cropper/src/lib/component/image-cropper.component.ts#L45](projects/angular-image-cropper/src/lib/component/image-cropper.component.ts#L45)

---

## Zoneless + Signals 的完整优势

| 方面 | 优势 |
|------|------|
| **性能** | ⚡ 更精确的变更检测，无 ZoneJS 开销 |
| **包体积** | 💾 减少 ~10KB 的捆绑包大小 |
| **响应式** | 📊 Signals 自动跟踪依赖，更细粒度的更新 |
| **开发体验** | 🐛 更清晰的堆栈跟踪，更容易调试 |
| **可读性** | 📝 意图明确的状态管理和更新 |
| **内存效率** | 💪 自动垃圾回收，避免订阅泄漏 |

---

## 迁移检查清单

### Zoneless 配置
- [x] 启用 `provideZonelessChangeDetection()`
- [x] 移除所有 zone.js polyfills
- [x] 移除 zone.js npm 依赖

### Signals 实现
- [x] 所有主要状态转换为 signals
- [x] 添加 computed 信号用于派生状态
- [x] 更新所有组件方法使用 Signal API
- [x] 更新模板绑定以调用 signals（带括号）

### 变更检测
- [x] App组件使用 `ChangeDetectionStrategy.OnPush`
- [x] 库组件已使用 OnPush
- [x] 无依赖 `NgZone.onMicrotaskEmpty` 等

### 构建验证
- [x] `npm start` 成功编译
- [x] 开发服务器运行无错误
- [x] `npm run lib:build` 成功构建库

---

## 测试步骤

### 1. 运行开发服务器
```bash
npm start
```
访问 http://localhost:4293/

### 2. 测试图片裁剪功能
- 上传图片
- 测试所有变换按钮（旋转、缩放、翻转等）
- 验证信号状态更新

### 3. 测试输入字段
- 修改数值输入（宽度、高度等）
- 验证去抖（debounce）功能正常

### 4. 构建库
```bash
npm run lib:build
```

### 5. 运行测试（如果有）
```bash
npm test
```

---

## 最佳实践建议

### 1. 遵循 OnPush 模式
所有组件应使用 `ChangeDetectionStrategy.OnPush` 以充分利用 zoneless 的优势。

### 2. 优先使用 Signals
对于新的状态，始终使用 signals 而不是传统属性。

### 3. 使用 Computed
对于派生状态，使用 `computed()` 而不是订阅。

```typescript
// ✅ 好
count = signal(0);
doubled = computed(() => this.count() * 2);

// ❌ 不好
count = signal(0);
doubled = signal(0);
constructor() {
  effect(() => {
    this.doubled.set(this.count() * 2);
  });
}
```

### 4. 避免订阅
迁移离开 RxJS 订阅，改用 signals 和 effects（如需要）。

### 5. 限制 Effect 使用
仅在需要同步副作用时使用 `effect()`。大多数情况下，`computed()` 更优。

---

## 文件清单

| 文件 | 变更 |
|------|------|
| [src/main.ts](src/main.ts) | 启用 `provideZonelessChangeDetection` |
| [src/app/app.component.ts](src/app/app.component.ts) | 转换为 Signals + OnPush |
| [src/app/app.component.html](src/app/app.component.html) | 更新绑定以调用 signals |
| [angular.json](angular.json) | 移除 zone.js polyfills 配置 |
| [package.json](package.json) | 移除 zone.js 依赖 |
| [projects/angular-image-cropper/src/lib/services/load-image.service.ts](projects/angular-image-cropper/src/lib/services/load-image.service.ts) | 修复 ArrayBuffer 类型兼容性 |

---

## 参考资源

- 📚 [Angular Zoneless 官方指南](https://angular.dev/guide/zoneless)
- 📚 [Angular Signals 文档](https://angular.dev/guide/signals)
- 📚 [Change Detection 最佳实践](https://angular.dev/best-practices/skipping-subtrees)
- 📚 [Computed Signals](https://angular.dev/guide/signals#computed-signals)

---

## 常见问题

### Q: 为什么我的模板中需要括号来调用 signals？
**A:** Signals 本质上是函数。在模板中需要调用它们来获取当前值。`signal()` 返回当前值，然后 Angular 会自动跟踪该值的变化。

### Q: 我可以在代码中使用 `signal.value` 吗？
**A:** 不，Angular Signals 使用函数语法。在代码中用 `signal()`，在模板中也用 `signal()`。

### Q: zone.js 还会被包含在构建中吗？
**A:** 可能会作为依赖的依赖，但应用不会加载或使用它。

### Q: 我需要为所有状态都使用 Signals 吗？
**A:** 建议是的。Signals 在 zoneless 模式下提供最佳性能和响应性。

### Q: Signals 与 RxJS Observables 兼容吗？
**A:** 是的，可以使用 `toSignal()` 和 `toObservable()` 进行相互转换。

---

## 后续优化建议

1. **迁移输入验证器** - 如果有，转换为 signal-based 验证
2. **审查第三方库** - 确保所有库都支持 zoneless
3. **性能测试** - 使用 Chrome DevTools 测量改进
4. **单元测试** - 更新测试以使用 `TestBed` + zoneless 配置

---

## 支持

对于问题或进一步的协助，请参考官方 Angular 文档或查阅项目问题追踪器。
