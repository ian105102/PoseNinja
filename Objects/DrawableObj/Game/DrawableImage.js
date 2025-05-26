import { IObject } from "../../IObject.js"


export class DrawableImage extends IObject{
    constructor(p){
        super(p)
        this.width = 100
        this.height = 400
        this.p = p
        this.src = null; // Placeholder for image resource
       
    }

    setImage(img) {
    if (!img) {
        console.warn("❌ setImage 傳入圖片為 null/undefined");
    } else {
        console.log("✅ setImage 成功");
        this.src = img;
    }
    }

    _on_update(delta){
  
    }

    
    draw() {
        if (this.src) {
            if (typeof this.src === "object" && this.src instanceof HTMLVideoElement) {
                // ✅ src 是攝影機 video
                this.p.image(this.src, this.position.x, this.position.y, this.width, this.height);
            } else {
                // ✅ src 是圖片
                this.p.image(this.src, this.position.x, this.position.y, this.width, this.height);
            }
        } else {
            console.warn("⚠️ 沒有圖可以畫");
        }
    }



    update_collider(){
        
    }
}