import { IObject } from "../../IObject.js"
import { WIDTH, HEIGHT } from "../../../G.js";


export class PoseDrawer extends IObject{
    constructor(p , posePoint){
        super(p)
        this.p = p
        this.posePoint = posePoint; 
       
    }


    _on_update(delta){

    }


    
    _on_draw(){
        this._Draw_Pose(this.posePoint);

    }
    static connections = [
            [11, 13], [13, 15],       // 左手
            [12, 14], [14, 16],       // 右手
            [11, 12],                 // 肩膀
            [23, 24],                 // 髖部
            [11, 23], [12, 24],       // 肩膀到髖部
            [23, 25], [25, 27],       // 左腳
            [24, 26], [26, 28],       // 右腳
            [27, 31], [28, 32],       // 腳掌
        ];
    _Draw_Pose(landmarks) {
        if (!landmarks || landmarks.length === 0) return;

        // 定義裁切區域的偏移量和尺寸
        const offsetX = 115.2;
        const offsetY = 105.6;
        const areaWidth = 849.6;
        const areaHeight = 566.4;

        // 繪製裁切區域的紅色邊框
        this.p.noFill();
        this.p.stroke(255, 0, 0);
        this.p.strokeWeight(2);
        this.p.rect(offsetX, offsetY, areaWidth, areaHeight);

        // 限制繪圖區域
        this.p.push();
        this.p.beginClip();
        this.p.rect(offsetX, offsetY, areaWidth, areaHeight);
        this.p.endClip();

        // 在裁切區域內繪製骨架
        this.p.stroke(0, 255, 0);
        this.p.strokeWeight(2);
        this.p.noFill();

        for (const [start, end] of PoseDrawer.connections) {
            const a = landmarks[start];
            const b = landmarks[end];
            if (a && b) {
                this.p.line(
                    offsetX + (1 - a.x) * areaWidth,
                    offsetY + a.y * areaHeight,
                    offsetX + (1 - b.x) * areaWidth,
                    offsetY + b.y * areaHeight
                );
            }
        }


                // ===== 頭部與肩膀位置 =====
        const nose = landmarks[0];
        const leftEye = landmarks[1];
        const rightEye = landmarks[2];
        const leftWrist = landmarks[15];
        const rightWrist = landmarks[16];
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];

        
        if (nose && leftEye && rightEye && leftShoulder && rightShoulder) {
            const headX = offsetX + (1 - ((nose.x + leftEye.x + rightEye.x) / 3)) * areaWidth;
            const headY = offsetY + ((nose.y + leftEye.y + rightEye.y) / 3) * areaHeight;

            const neckX = offsetX + (1 - ((leftShoulder.x + rightShoulder.x) / 2)) * areaWidth;
            const neckY = offsetY + ((leftShoulder.y + rightShoulder.y) / 2) * areaHeight;

            this.p.noStroke();
            this.p.fill(255, 255, 0);
            this.p.ellipse(headX, headY, 40, 40); // 頭部圓形

            this.p.stroke(255, 255, 0);
            this.p.strokeWeight(3);
            this.p.line(headX, headY, neckX, neckY); // 脖子
        }

        // ===== 左手點 =====
            if (leftWrist) {
                const x = offsetX + (1 - leftWrist.x) * areaWidth;
                const y = offsetY + leftWrist.y * areaHeight;

                this.p.noStroke();
                this.p.fill(0, 0, 255);
                this.p.ellipse(x, y, 30, 30);
            }

            // ===== 右手點 =====
            if (rightWrist) {
                const x = offsetX + (1 - rightWrist.x) * areaWidth;
                const y = offsetY + rightWrist.y * areaHeight;

                this.p.noStroke();
                this.p.fill(0, 0, 255);
                this.p.ellipse(x, y, 30, 30);
            }

    

        this.p.pop();
    }



}