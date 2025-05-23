
import { WIDTH } from "../../G.js"
import { HEIGHT } from "../../G.js"


export class EasyBoard{
    constructor(p) {
        this.p = p;
        this.x = (WIDTH/2)-36;  // 504
        this.y = 192;
        this.width = 72;
        this.height = 0;
        this.color = this.p.color(229, 229, 229, 80);
        this.baseY = this.y + 48;

        this.riseSpeed = 1.2;
        this.moveSpeed = 1;
        
        this.judgePose = true;

        // 向量方向：P1 → P2
        let dx = 72 - 504;
        let dy = 720 - 240;
        let len = Math.sqrt(dx * dx + dy * dy);

        this.dirX = dx / len;
        this.dirY = dy / len;
    }

    changeColor(poseCorrectWrong){
        if(poseCorrectWrong){
            this.color = this.p.color(42, 157, 143, 80);
        } else {
            this.color = this.p.color(255, 0, 0, 80);
        }
    }

    update(){
        if(this.height < 48){
            this.height += this.riseSpeed;
        }else {
            // 沿著方向移動
            this.x += this.dirX * this.moveSpeed;
            this.y += this.dirY * this.moveSpeed;
            this.width += 72 * 0.01855 * this.moveSpeed;
            this.height += 48 * 0.01855 * this.moveSpeed;
        }
    }

    display() {
    this.p.fill(this.color);
    this.p.rect(this.x, this.baseY - this.height, this.width, this.height);
    this.baseY = this.y + 48;
    }
}


