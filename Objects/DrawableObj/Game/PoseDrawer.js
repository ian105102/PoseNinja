import { IObject } from "../../IObject.js"
import { WIDTH, HEIGHT } from "../../../G.js";


export class PoseDrawer extends IObject{
    constructor(p , posePoint){
        super(p)
        this.width = 100
        this.height = 400
        this.p = p
        this.posePoint = posePoint; 
       
    }


    _on_update(delta){

    }


    
    _on_draw(){
        this._Draw_Pose(this.posePoint);

    }
    connections = [
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

        this.p.stroke(0, 255, 0);
        this.p.strokeWeight(2);
        this.p.noFill();


     
        for (const [start, end] of this.connections) {
            const a = landmarks[start];
            const b = landmarks[end];
            if (a && b) {
                this.p.line(
                    (1 - a.x) * WIDTH, a.y * HEIGHT,
                    (1 - b.x) * WIDTH, b.y * HEIGHT
                );
            }
        }

        // 取得頭部與軀幹的座標
        const nose = landmarks[0];
        const leftEye = landmarks[1];
        const rightEye = landmarks[2];
        const leftWrist = landmarks[15];
        const rightWrist = landmarks[16];
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];

        // ===== 頭部 =====
        if (nose && leftEye && rightEye && leftShoulder && rightShoulder) {
            const headX = (1 - ((nose.x + leftEye.x + rightEye.x) / 3)) * WIDTH;
            const headY = ((nose.y + leftEye.y + rightEye.y) / 3) * HEIGHT;

            const neckX = (1 - ((leftShoulder.x + rightShoulder.x) / 2)) * WIDTH;
            const neckY = ((leftShoulder.y + rightShoulder.y) / 2) * HEIGHT;

            // 畫實心圓（頭）
            this.p.noStroke();
            this.p.fill(255, 255, 0);
            this.p.ellipse(headX, headY, 40, 40);

            // 畫頭部連到軀幹（脖子）
            this.p.stroke(255, 255, 0);
            this.p.strokeWeight(3);
            this.p.line(headX, headY, neckX, neckY);
        }

        // ===== 左手 =====
        if (leftWrist) {
            const x = (1 - leftWrist.x) * WIDTH;
            const y = leftWrist.y * HEIGHT;

            this.p.noStroke();
            this.p.fill(0, 0, 255);
            this.p.ellipse(x, y, 30, 30);
        }

        // ===== 右手 =====
        if (rightWrist) {
            const x = (1 - rightWrist.x) * WIDTH;
            const y = rightWrist.y * HEIGHT;

            this.p.noStroke();
            this.p.fill(0, 0, 255);
            this.p.ellipse(x, y, 30, 30);
        }
    }

}