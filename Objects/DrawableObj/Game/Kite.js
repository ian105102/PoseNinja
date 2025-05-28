import { IObject } from "../../IObject.js";

export class Kite extends IObject {
  constructor(p) {
    super(p);
    this.reset(); 
  }

  reset() {
    let x = this.p.random() < 0.5 ? this.p.random(0, 500): this.p.random(600, 1080);
    this.position.set(
    x,       
    this.p.height + 400 
  );
    // 2. 隨機速度大小
    this.speed = this.p.random(1.5, 3.5);
    // 3. 隨機生成一條「斜上方」的角度：介於 -135° 到 -45°（上方偏左或偏右）
    const angle = this.p.random(-Math.PI * 3 / 4, -Math.PI / 4);
    // 4. 將角度轉成速度向量 (cos, sin)，再乘上 speed
    this.velocity = this.p.createVector(Math.cos(angle), Math.sin(angle)).mult(this.speed);

    // 顏色設定不變
    this.bodyColor = this.p.color(this.p.random([
      "#FFA500", "#00BFFF", "#FF69B4", "#32CD32", "#9370DB"
    ]));
    this.tailColor = this.p.color(this.p.random([
      "#FF6347", "#1E90FF", "#DB7093", "#228B22", "#8A2BE2"
    ]));
  }

  _on_update(delta) {
    // delta * 0.01 可依需要再調整，確保不同電腦上速度一致
    const factor = delta*30 ;
    // 以向量更新位置
    this.position.x += this.velocity.x * factor;
    this.position.y += this.velocity.y * factor;

    // 飛出畫面後重新 reset
    if (
      this.position.y < -50 ||
      this.position.x < -50 ||
      this.position.x > this.p.width + 50
    ) {
      this.reset();
    }
  }

  _on_draw() {
  // 1. 先畫風箏外框
  this.p.fill(this.bodyColor);
  this.p.stroke(0);
  this.p.beginShape();
  this.p.vertex(0, -30);   // top
  this.p.vertex(20, 0);    // right
  this.p.vertex(0, 30);    // bottom
  this.p.vertex(-20, 0);   // left
  this.p.endShape(this.p.CLOSE);

  // 2. 畫對角線（水平 + 垂直）
  this.p.stroke(0);
  this.p.strokeWeight(1);
  // 水平
  this.p.line(-20, 0, 20, 0);
  // 垂直
  this.p.line(0, -30, 0, 30);

  // 3. 再畫尾巴
  this.p.stroke(this.tailColor);
  this.p.line(0, 30, 0, 90);

  for (let i = 1; i <= 4; i++) {
    let bowY = 30 + i * 15;
    this.p.fill(this.tailColor);
    this.p.noStroke();
    this.p.triangle(-5, bowY, 0, bowY - 5, 0, bowY + 5);
    this.p.triangle(5, bowY, 0, bowY - 5, 0, bowY + 5);
  }
}

}
