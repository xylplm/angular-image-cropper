import { Component, ChangeDetectionStrategy, signal, computed } from '@angular/core';
import {
  CropperPosition,
  Dimensions,
  ImageCroppedEvent,
  ImageCropperComponent,
  ImageTransform
} from 'angular-image-cropper';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'lib-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    imports: [FormsModule, ImageCropperComponent],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
  // Core state signals
  showCropper = signal(false);
  loading = signal(false);
  croppedImage = signal<SafeUrl>('');

  imageChangedEvent = signal<Event | null>(null);
  imageURL = signal<string>('');
  hidden = signal(false);
  disabled = signal(false);
  alignImage = signal<'center' | 'left' | undefined>('center');
  roundCropper = signal(false);
  backgroundColor = signal('red');
  allowMoveImage = signal(false);
  hideResizeSquares = signal(false);
  canvasRotation = signal(0);
  aspectRatio = signal(4 / 3);
  containWithinAspectRatio = signal(false);
  maintainAspectRatio = signal(false);
  cropperStaticWidth = signal(0);
  cropperStaticHeight = signal(0);
  cropperMinWidth = signal(0);
  cropperMinHeight = signal(0);
  cropperMaxWidth = signal(0);
  cropperMaxHeight = signal(0);
  resizeToWidth = signal(0);
  resizeToHeight = signal(0);
  resetCropOnAspectRatioChange = signal(true);
  cropper = signal<CropperPosition | undefined>(undefined);
  transform = signal<ImageTransform>({
    translateUnit: 'px',
    scale: 1,
    rotate: 0,
    flipH: false,
    flipV: false,
    translateH: 0,
    translateV: 0
  });

  // Computed values for readability
  aspectRatioDisplay = computed(() => 
    this.aspectRatio() === 4 / 3 ? '4/3' : '16/5'
  );

  timeout: any;
  eventList = {};

  constructor(private sanitizer: DomSanitizer) {}

  fileChangeEvent(event: Event): void {
    this.loading.set(true);
    this.imageChangedEvent.set(event);
  }

  imageCropped(event: ImageCroppedEvent) {
    this.croppedImage.set(
      this.sanitizer.bypassSecurityTrustUrl(event.objectUrl || event.base64 || '')
    );
    console.log('CROPPED', event);
  }

  imageLoaded() {
    this.showCropper.set(true);
    console.log('Image loaded');
  }

  cropperReady(sourceImageDimensions: Dimensions) {
    console.log('Cropper ready', sourceImageDimensions);
    this.loading.set(false);
  }

  loadImageFailed() {
    console.error('Load image failed');
  }

  transformChange(transform: ImageTransform) {
    console.log('transform changed', transform);
  }

  rotateLeft() {
    this.loading.set(true);
    setTimeout(() => {
      this.canvasRotation.update(val => val - 1);
      this.flipAfterRotate();
    });
  }

  rotateRight() {
    this.loading.set(true);
    setTimeout(() => {
      this.canvasRotation.update(val => val + 1);
      this.flipAfterRotate();
    });
  }

  moveLeft() {
    this.updateTransform({
      ...this.transform(),
      translateH: this.transform().translateH! - 1
    });
  }

  moveRight() {
    this.updateTransform({
      ...this.transform(),
      translateH: this.transform().translateH! + 1
    });
  }

  moveDown() {
    this.updateTransform({
      ...this.transform(),
      translateV: this.transform().translateV! + 1
    });
  }

  moveUp() {
    this.updateTransform({
      ...this.transform(),
      translateV: this.transform().translateV! - 1
    });
  }

  private flipAfterRotate() {
    const current = this.transform();
    const flippedH = current.flipH;
    const flippedV = current.flipV;
    this.updateTransform({
      ...current,
      flipH: flippedV,
      flipV: flippedH,
      translateH: 0,
      translateV: 0
    });
  }

  flipHorizontal() {
    this.updateTransform({
      ...this.transform(),
      flipH: !this.transform().flipH
    });
  }

  flipVertical() {
    this.updateTransform({
      ...this.transform(),
      flipV: !this.transform().flipV
    });
  }

  resetImage() {
    this.canvasRotation.set(0);
    this.cropper.set(undefined);
    this.maintainAspectRatio.set(false);
    this.updateTransform({
      translateUnit: 'px',
      scale: 1,
      rotate: 0,
      flipH: false,
      flipV: false,
      translateH: 0,
      translateV: 0
    });
  }

  zoomOut() {
    this.updateTransform({
      ...this.transform(),
      scale: this.transform().scale! - 0.1
    });
  }

  zoomIn() {
    this.updateTransform({
      ...this.transform(),
      scale: this.transform().scale! + 0.1
    });
  }

  updateRotation(rotate: number) {
    this.updateTransform({
      ...this.transform(),
      rotate
    });
  }

  updateTransform(newTransform: ImageTransform) {
    this.transform.set(newTransform);
  }

  toggleMaintainAspectRatio() {
    this.maintainAspectRatio.update(val => !val);
  }

  toggleContainWithinAspectRatio() {
    this.containWithinAspectRatio.update(val => !val);
  }

  toggleAllowMoveImage() {
    this.allowMoveImage.update(val => !val);
  }

  toggleHidden() {
    this.hidden.update(val => !val);
  }

  toggleDisabled() {
    this.disabled.update(val => !val);
  }

  toggleHideResizeSquares() {
    this.hideResizeSquares.update(val => !val);
  }

  toggleResetCropOnAspectRatioChange() {
    this.resetCropOnAspectRatioChange.update(val => !val);
  }

  toggleAspectRatio() {
    this.aspectRatio.update(val => val === 4 / 3 ? 16 / 5 : 4 / 3);
  }

  toggleBackgroundColor() {
    this.backgroundColor.update(val => val === 'red' ? 'blue' : 'red');
  }

  debounce(event: any) {
    clearTimeout(this.timeout);
    (this.eventList as any)[event.target!.id] = event.target.value;
    this.timeout = setTimeout(() => {
      for (const [key, value] of Object.entries(this.eventList)) {
        const signal = (this as any)[key];
        if (signal && typeof signal === 'function' && typeof signal.set === 'function') {
          signal.set(Number(value));
        }
      }
      this.eventList = {};
    }, 500);
  }

  test() {
    this.canvasRotation.set(3);
    this.updateTransform({
      ...this.transform(),
      scale: 2
    });
    this.cropper.set({x1: 190, y1: 221.5, x2: 583, y2: 344.3125});
  }
}
