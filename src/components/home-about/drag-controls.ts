export class DragControls {
  private el: HTMLElement;
  private isDragging = false;
  private prevX = 0;
  private prevY = 0;

  // Current drag offset (applied to model)
  rotX = 0;
  rotY = 0;

  // Spring target (always 0,0 — snap back)
  private velX = 0;
  private velY = 0;

  // Constraints
  private maxPolar = Math.PI / 6;
  private maxAzimuth = Math.PI / 4;

  // Spring constants
  private tension = 0.08;
  private friction = 0.85;

  constructor(el: HTMLElement) {
    this.el = el;
    el.addEventListener("pointerdown", this.onDown);
    el.addEventListener("pointermove", this.onMove);
    el.addEventListener("pointerup", this.onUp);
    el.addEventListener("pointerleave", this.onUp);
  }

  private onDown = (e: PointerEvent) => {
    this.isDragging = true;
    this.prevX = e.clientX;
    this.prevY = e.clientY;
    this.el.style.cursor = "grabbing";
  };

  private onMove = (e: PointerEvent) => {
    if (!this.isDragging) return;
    const dx = e.clientX - this.prevX;
    const dy = e.clientY - this.prevY;
    this.prevX = e.clientX;
    this.prevY = e.clientY;

    this.rotY += dx * 0.008;
    this.rotX += dy * 0.008;

    // Clamp
    this.rotY = Math.max(-this.maxAzimuth, Math.min(this.maxAzimuth, this.rotY));
    this.rotX = Math.max(-this.maxPolar, Math.min(this.maxPolar, this.rotX));
  };

  private onUp = () => {
    this.isDragging = false;
    this.el.style.cursor = "grab";
  };

  update() {
    if (this.isDragging) return;
    // Spring back to 0
    this.velX += -this.rotX * this.tension;
    this.velY += -this.rotY * this.tension;
    this.velX *= this.friction;
    this.velY *= this.friction;
    this.rotX += this.velX;
    this.rotY += this.velY;
  }

  dispose() {
    this.el.removeEventListener("pointerdown", this.onDown);
    this.el.removeEventListener("pointermove", this.onMove);
    this.el.removeEventListener("pointerup", this.onUp);
    this.el.removeEventListener("pointerleave", this.onUp);
  }
}
