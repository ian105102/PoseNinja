import { IObject } from "../../IObject.js"


export class DrawableImage extends IObject{
    constructor(p){
        super(p)
        this.width = 100
        this.height = 400
        this.p = p
        this.src = null; // Placeholder for image resource
        this.anchor = { x: 0, y: 0 }; // (0,0)=左上；(0.5,0.5)=中心
        this.rotation = 0
        this.visible  = true;
    }

    setImage(img) {
        if (!img) {
            console.warn("❌ setImage 傳入圖片為 null/undefined");
        } else {
            console.log("✅ setImage 成功");
            this.src = img;
        }
    }
    setAnchor(x, y) {
        this.anchor.x = x;
        this.anchor.y = y;
    }
    _on_update(delta){
  
    }

    
   draw() {
        if (this.visible === false) return;
        if (!this.src) {
            console.warn("⚠️ 沒有圖可以畫");
            return;
        }

        this.p.push();
        this.p.translate(this.position.x, this.position.y); // 移動到指定位置

        if (this.rotation) {
            this.p.rotate(this.rotation); // 如果有設 rotation 就旋轉
        }

        const offsetX = -this.anchor.x * this.width;
        const offsetY = -this.anchor.y * this.height;

        if (typeof this.src === "object" && this.src instanceof HTMLVideoElement) {
            this.p.image(this.src, offsetX, offsetY, this.width, this.height);
        } else {
            this.p.image(this.src, offsetX, offsetY, this.width, this.height);
        }

        this.p.pop();
    }

    update_collider(){
        
    }
}