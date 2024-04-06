
class WheelOfFortune {
  /**
   * 创建一个幸运之轮实例
   * @param {HTMLCanvasElement} canvas - 用于绘制幸运之轮的画布
   * @param {HTMLCanvasElement} pointerCanvas - 用于绘制指针的画布
   * @param {HTMLButtonElement} spinButton - 用于启动旋转的按钮
   * @param {Object} config - 幸运之轮的配置参数
   */
  constructor(canvas, pointerCanvas, spinButton, config) {
    this.canvas = canvas;
    this.pointerCanvas = pointerCanvas;
    this.spinButton = spinButton;
    this.config = config;
    this.ctx = this.canvas.getContext("2d");
    this.pointerCtx = this.pointerCanvas.getContext("2d");
    this.isSpinning = false;
    this.rotationAngle = 0;
    this.startRotationTime = 0;

    this.init();
  }

  /**
   * 初始化幸运之轮
   * 设置幸运之轮的初始状态，并绘制幸运之轮的外观。
   */
  init() {
    this.drawWheel();
    // 添加按钮点击事件监听器，点击按钮时启动旋转
    this.spinButton.addEventListener("click", () => this.startSpin());
  }

  /**
   * 绘制幸运之轮的外观
   * 清除画布并绘制圆形背景，然后绘制每个扇区的颜色和指针。
   */
  drawWheel() {
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // 绘制幸运之轮的背景
    this.ctx.beginPath();
    this.ctx.arc(250, 250, 200, 0, 2 * Math.PI);
    this.ctx.fillStyle = "lightgray";
    this.ctx.fill();
    this.ctx.closePath();

    // 绘制每个扇区
    let startAngle = 0;
    let endAngle = Math.PI / 3;
    for (let i = 0; i < this.config.sectors.length; i++) {
      this.ctx.beginPath();
      this.ctx.moveTo(250, 250);
      this.ctx.arc(250, 250, 200, startAngle, endAngle);
      this.ctx.closePath();
      this.ctx.fillStyle = this.config.sectors[i];
      this.ctx.fill();
      startAngle = endAngle;
      endAngle += Math.PI / 3;
    }

    // 绘制指针
    this.pointerCtx.clearRect(
      0,
      0,
      this.pointerCanvas.width,
      this.pointerCanvas.height
    );
    this.pointerCtx.beginPath();
    this.pointerCtx.moveTo(250, 50);
    this.pointerCtx.lineTo(230, 150);
    this.pointerCtx.lineTo(270, 150);
    this.pointerCtx.fillStyle = "black";
    this.pointerCtx.fill();
    this.pointerCtx.closePath();
  }

  /**
   * 开始旋转幸运之轮
   * 检查是否已经在旋转中，如果没有，则禁用按钮并计算旋转目标角度。
   */
  startSpin() {
    if (!this.isSpinning) {
      this.isSpinning = true;
      this.spinButton.disabled = true;
      // 计算旋转目标角度
      const targetRotation =
        this.config.targetSectorIndex * (Math.PI / 3) +
        this.config.spinCycles * 2 * Math.PI;
      this.rotateToTarget(targetRotation);
    }
  }

  /**
   * 旋转幸运之轮到目标角度
   * @param {number} targetRotation - 目标旋转角度（弧度）
   */
  rotateToTarget(targetRotation) {
    this.startRotationTime = performance.now();
    this.spinWheel(targetRotation);
  }

  /**
   * 旋转幸运之轮
   * @param {number} targetRotation - 目标旋转角度（弧度）
   */
  spinWheel(targetRotation) {
    const { totalSpinTime } = this.config;
    const currentTime = performance.now();
    const elapsedTime = currentTime - this.startRotationTime;
    const t = Math.min(1, elapsedTime / totalSpinTime);

    // 使用缓动函数计算当前旋转角度
    this.rotationAngle = this.easeOutQuad(t) * targetRotation;

    // 应用旋转并重绘幸运之轮
    this.canvas.style.transform = `rotate(${this.rotationAngle}rad)`;
    this.drawWheel();

    // 如果尚未达到目标旋转角度，则继续请求动画帧
    if (elapsedTime < totalSpinTime) {
      requestAnimationFrame(() => this.spinWheel(targetRotation));
    } else {
      // 完成旋转后启用按钮并重置状态
      this.canvas.style.transform = `rotate(${targetRotation}rad)`;
      this.isSpinning = false;
      this.spinButton.disabled = false;
    }
  }

  /**
   * 缓动函数，用于平滑动画效果
   * @param {number} t - 进度
   * @returns {number} 缓动后的值
   */
  easeOutQuad(t) {
    return t * (2 - t);
  }
}
