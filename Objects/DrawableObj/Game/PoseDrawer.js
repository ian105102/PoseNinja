import { IObject } from "../../IObject.js"
import { WIDTH, HEIGHT } from "../../../G.js";
import { SpringTail } from "./SpringTail.js";


export class PoseDrawer extends IObject{
    constructor(p , posePoint){
        super(p)
        this.p = p
        this.posePoint = posePoint; 
        this.springTail = new SpringTail(p ,5 ,2);
        
        this.offsetX = 115.2;
        this.offsetY = 105.6;
        this.areaWidth = 849.6;
        this.areaHeight = 566.4;

        this.size =0;

    }


    _on_update(delta){

    }


    
    _on_draw(){
        
        this.size = this.calculateHeadSize3DFromTorso(this.posePoint, this.areaHeight);
        
        this._Draw_Pose(this.posePoint ,this.size);
      

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
    _Draw_Pose(landmarks , size ) {
        if (!landmarks || landmarks.length === 0) return;


        // 繪製紅色邊框與限制區域
        this._drawClippingRect(this.offsetX, this.offsetY, this.areaWidth, this.areaHeight);
       
        this.p.push();
        this.p.beginClip();
        this.p.rect(this.offsetX, this.offsetY, this.areaWidth, this.areaHeight);
        this.p.endClip();

        this._drawSkeleton(landmarks, this.offsetX, this.offsetY, this.areaWidth, this.areaHeight ,size/5.5);
        this._drawHeadAndNeck(landmarks, this.offsetX, this.offsetY, this.areaWidth, this.areaHeight ,size/1.5);
        this._drawWrist(landmarks[15], this.offsetX, this.offsetY, this.areaWidth, this.areaHeight ,size/4.5); // 左手
        this._drawWrist(landmarks[16], this.offsetX, this.offsetY, this.areaWidth, this.areaHeight ,size/4.5); // 右手

        this.p.pop();
    }

// ==== 以下是整理出來的 function ====

    _drawClippingRect(offsetX, offsetY, areaWidth, areaHeight) {
        this.p.noFill();
        this.p.stroke("rgb(56, 58, 73)");
        this.p.strokeWeight(2);
        this.p.rect(offsetX, offsetY, areaWidth, areaHeight);
    }

    _drawSkeleton(landmarks, offsetX, offsetY, areaWidth, areaHeight ,size) {
        this.p.stroke("rgb(0, 0, 0)");
        this.p.strokeWeight(8);
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
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];
        const shoulderRadius = size;

        this.p.noStroke();
        this.p.fill("rgb(0, 0, 0)");

        if (leftShoulder) {
            const lx = offsetX + (1 - leftShoulder.x) * areaWidth;
            const ly = offsetY + leftShoulder.y * areaHeight;
            this.p.ellipse(lx, ly, shoulderRadius, shoulderRadius);
        }

        if (rightShoulder) {
            const rx = offsetX + (1 - rightShoulder.x) * areaWidth;
            const ry = offsetY + rightShoulder.y * areaHeight;
            this.p.ellipse(rx, ry, shoulderRadius, shoulderRadius);
        }
    }

    _drawHeadAndNeck(landmarks, offsetX, offsetY, areaWidth, areaHeight , size) {
        const leftEye = landmarks[1];
        const rightEye = landmarks[2];
        const nose = landmarks[0];
        const leftShoulder = landmarks[11];
        const rightShoulder = landmarks[12];

        if (!nose || !leftEye || !rightEye || !leftShoulder || !rightShoulder) return;

        const headX = offsetX + (1 - ((nose.x + leftEye.x + rightEye.x) / 3)) * areaWidth;
        const headY = offsetY + ((nose.y + leftEye.y + rightEye.y) / 3) * areaHeight;

        const neckX = offsetX + (1 - ((leftShoulder.x + rightShoulder.x) / 2)) * areaWidth;
        const neckY = offsetY + ((leftShoulder.y + rightShoulder.y) / 2) * areaHeight;

        this.p.stroke("rgb(0, 0, 0)");
        this.p.strokeWeight(10);
        this.p.line(headX, headY, neckX, neckY); 

        this.p.noStroke();
        this.p.fill("rgb(0, 0, 0)");
        this.p.ellipse(headX, headY, size, size); 

        // 畫紅色綁帶（橫向）
        const bandHeight = size * 0.2;
        const bandWidth = size;
        const bandYOffset = size * 0.25;
        this.p.fill("rgb(255, 0, 0)");
        this.p.rect(headX - bandWidth / 2, headY - bandHeight / 2 - bandYOffset, bandWidth, bandHeight, bandHeight / 3);
        this.springTail.draw( this.p.createVector(headX  ,  headY - bandHeight / 2 - bandYOffset) ,size/5 );


    }
    _drawWrist( wrist, offsetX, offsetY, areaWidth, areaHeight  , size) {
        if (!wrist) return;
        const x = offsetX + (1 - wrist.x) * areaWidth;
        const y = offsetY + wrist.y * areaHeight;

        this.p.noStroke();
        this.p.fill("rgb(0, 0, 0)");
        this.p.ellipse(x, y, size, size);
    }

    calculateHeadSize3DFromTorso(landmarks, areaHeight, ratio = 2.5) {
        if (!landmarks || landmarks.length < 25) return null;

        const nose = landmarks[0];
        const leftEye = landmarks[1];
        const rightEye = landmarks[2];
        const leftHip = landmarks[23];
        const rightHip = landmarks[24];

        if (!nose || !leftEye || !rightEye || !leftHip || !rightHip) return null;

        const head = {
            x: (nose.x + leftEye.x + rightEye.x) / 3,
            y: (nose.y + leftEye.y + rightEye.y) / 3,
            z: (nose.z + leftEye.z + rightEye.z) / 3,
        };
        const hips = {
            x: (leftHip.x + rightHip.x) / 2,
            y: (leftHip.y + rightHip.y) / 2,
            z: (leftHip.z + rightHip.z) / 2,
        };

        const dx = hips.x - head.x;
        const dy = hips.y - head.y;
        const dz = hips.z - head.z;
        const torsoLength3D = Math.sqrt(dx * dx + dy * dy + dz * dz);

        const estimatedHeightPx = torsoLength3D * areaHeight;

        return estimatedHeightPx / ratio;
    }

}