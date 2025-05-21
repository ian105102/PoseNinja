import {IScene} from "./IScene.js"
import {Ball} from "../Objects/DrawableObj/Ball/Ball.js"
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js"
import { SceneManager } from "../SceneManager.js"
import { SceneEnum } from "../SceneEnum.js"

import { WIDTH } from "../G.js"
import { HEIGHT } from "../G.js"
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js"
import { Bat } from "../Objects/DrawableObj/Game/Bat.js"
import PoseTracker from "../PoseTracker.js"


export class GameScene extends IScene{
    static instance = null

    constructor(p) {
        if (GameScene.instance) {
            
            return GameScene.instance
        }
        super(p);
        GameScene.instance = this;
        GameScene.instance.init()
        
    } 
    

    
    //call after constructor
    init(){
        
        let func =()=>{
            SceneManager.instance.changeScene(SceneEnum.SCORE)
        }
        let go_score_button = new RectButton(this.p,300,100,func)
        go_score_button.position.x = 800
        go_score_button.position.y = 600

        let instance = GameScene.instance

        

        instance.add(go_score_button)
        
        let text = new DrawableText(this.p,"遊戲介面",50)
        text.position.x = WIDTH / 2
        text.position.y = HEIGHT / 8
        instance.add(text)

        this.bat = new Bat(this.p)
        this.ball = new Ball(this.p)

        instance.add(this.bat)
        instance.add(this.ball)

        console.log("game scene init")
        this.video = this.p.createCapture(this.p.VIDEO)
        .size(WIDTH, HEIGHT)
        .hide();
        // this.flippedGraphics = this.p.createGraphics(WIDTH, HEIGHT);
        this.myCamera = new Camera(this.video.elt, {
            onFrame: async () => {
                // 一開始鏡向有點太卡了，先不加
                // 將翻轉後的影像畫到離屏畫布
                // this.flippedGraphics.push();
                // this.flippedGraphics.translate(WIDTH, 0);   // 移動到畫布右邊
                // this.flippedGraphics.scale(-1, 1);          // 水平翻轉
                // this.flippedGraphics.image(this.video, 0, 0, WIDTH, HEIGHT);
                // this.flippedGraphics.pop();
        
                // 把鏡像後的畫面傳送給 PoseTracker
                console.log("send video to pose tracker")
                await PoseTracker.send(this.video.elt);
            },
            width: 1080,
            height: 720
        }).start();
    }

    _on_update(delta){
        let hit = this.bat.collider.checkCollisionWithCircle(this.ball.collider)
     
        if(hit && this.p.is_first_left_pressing){
            console.log("bat hit ball!")
            this.ball.stop_shoot()

        }
        this.p.image(this.video, 0, 0, WIDTH, HEIGHT);
        this.send(this.video.elt);
        this.drawSkeleton(this.getFullSkeleton());

    }


    drawSkeleton(landmarks) {
        if (!landmarks || landmarks.length === 0) return;

        this.p.stroke(0, 255, 0);
        this.p.strokeWeight(2);
        this.p.noFill();

        // 🔗 可連接的骨架關係（骨頭連線），根據 MediaPipe Pose 定義
        const connections = [
            [11, 13], [13, 15],       // 左手
            [12, 14], [14, 16],       // 右手
            [11, 12],                 // 肩膀
            [23, 24],                 // 髖部
            [11, 23], [12, 24],       // 肩膀到髖部
            [23, 25], [25, 27],       // 左腳
            [24, 26], [26, 28],       // 右腳
            [27, 31], [28, 32],       // 腳掌
        ];

        for (const [start, end] of connections) {
            const a = landmarks[start];
            const b = landmarks[end];
            if (a && b) {
            this.p.line(a.x *WIDTH , a.y *HEIGHT , b.x *WIDTH, b.y *HEIGHT);
            }
        }

        // 畫出每個關鍵點
        this.p.fill(255, 0, 0);
        this.p.noStroke();
        for (const pt of landmarks) {
            this.p.ellipse(pt.x *WIDTH, pt.y *HEIGHT, 6, 6);
        }
    }
}