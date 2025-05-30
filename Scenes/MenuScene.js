import { IScene } from "./IScene.js";
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js"

import { SceneEnum } from "../SceneEnum.js";
import { SceneManager } from "../SceneManager.js";

import { PoseTracker } from "../Objects/APIs/PoseTracker.js";
import { Shuriken } from "../Objects/DrawableObj/Game/Shuriken.js";
import { WIDTH } from "../G.js"
import { HEIGHT } from "../G.js"
import { ASSETS } from "../G.js"
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js";
import { PoseHandler } from "../Objects/APIs/PoseHandler.js";
import { DrawableImage } from "../Objects/DrawableObj/Game/DrawableImage.js";
import { SustainCounter } from "../Objects/Counters/SustainCounter.js";
import {BgmManager} from "../AudioController/BgmManager.js"

export class MenuScene extends IScene{
    static instance = null

    constructor(p) {
        if (MenuScene.instance) {
            
            return MenuScene.instance
        }
        super(p);
        MenuScene.instance = this;
        MenuScene.instance.init()
        this.prevLeftUp  = false;
        this.prevRightUp = false;
        this.prevBothUp  = false;
        this.pose_handler = new PoseHandler(p)
        this.rotation_active = false;
        this.rotation_timer = 0;

        this.gameType = 1;
        this.func_to_easy =()=>{
            this.rotation_active = false;
            this.gameType = 1;
            SceneManager.instance.changeScene(SceneEnum.EASY_GAME)
        }

        this.func_to_hard =()=>{
            this.gameType = 2;
            SceneManager.instance.changeScene(SceneEnum.HARD_GAME)
        }

        this.func_to_tuto =()=>{
            SceneManager.instance.changeScene(SceneEnum.TUTORIAL)
        }
        
    } 
    

    
    //call after constructor
    init(){
        console.log("ASSERACE",ASSETS.ace)

        let height = HEIGHT / 7 * 6

        this.bgmManager = BgmManager.get_instance(this.p);
        

        this.bg = new DrawableImage(this.p);
        this.bg.setImage(ASSETS.bg_menu);
        this.bg.position.set(0, 0);
        this.bg.width = WIDTH;
        this.bg.height = HEIGHT;
        this.add(this.bg);
        // ✅ Easy 按鈕圖片
        this.btn_easy = new DrawableImage(this.p);
        this.btn_easy.setImage(ASSETS.btn_easy); // ✅ 可替換為去背手裡劍圖
        this.btn_easy.width = 200;
        this.btn_easy.height = 133;
        this.btn_easy.position.set(290, 646.5); // 中心
        this.btn_easy.setAnchor(0.5, 0.5); // 設定錨點為中心
        
        this.add(this.btn_easy);

        // ✅ Rule 按鈕圖片
        this.btn_rule = new DrawableImage(this.p);
        this.btn_rule.setImage(ASSETS.btn_rule);
        this.btn_rule.position.set(450, 580);
        this.btn_rule.width = 140;
        this.btn_rule.height = 140;
        this.add(this.btn_rule);
        this.btn_open = new DrawableImage(this.p);
        this.btn_open.setImage(ASSETS.btn_open);
        this.btn_open.position.set(WIDTH / 2 - 65, 550);
        this.btn_open.width = 170;
        this.btn_open.height = 170;
        this.btn_open.isActive = false;
        this.add(this.btn_open);
        
        // ✅ Hard 按鈕圖片
        this.btn_hard = new DrawableImage(this.p);
        this.btn_hard.setImage(ASSETS.btn_hard);
        this.btn_hard.position.set(630, 580);
        this.btn_hard.width = 140;
        this.btn_hard.height = 140;
        this.add(this.btn_hard);
    
        this.btn_skeleton = new DrawableImage(this.p);
        this.btn_skeleton.setImage(ASSETS.btn_skeleton);
        this.btn_skeleton.position.set(600, 540);
        this.btn_skeleton.width = 200;
        this.btn_skeleton.height = 200;
        this.btn_skeleton.isActive = false;
        this.add(this.btn_skeleton);
        

        
        for (let i = 0; i < 10; i++) {
            const kite = new Shuriken(this.p);
            kite.position.x = this.p.random(0, WIDTH);
            kite.position.y = this.p.random(0, HEIGHT);
            this.add(kite);
        }

        this.pose_image = new DrawableImage(this.p);
        this.pose_image.position.x = WIDTH - WIDTH/4 - 20;
        this.pose_image.position.y = HEIGHT - HEIGHT/4 - 20;
        this.pose_image.width = WIDTH/4;
        this.pose_image.height = HEIGHT/4;

        this.t1 = new DrawableText(this.p, "左手舉起", 30);
        this.t1.position.set(WIDTH / 3 - 110, 590);
        this.add(this.t1);

        // 簡單模式說明
        this.t2 = new DrawableText(this.p, "雙手舉起", 30);
        this.t2.position.set(WIDTH / 2 - 50, 590);
        this.add(this.t2);

        // 困難模式說明
        this.t3 = new DrawableText(this.p, "右手舉起", 30);
        this.t3.position.set(WIDTH / 2 + 100, 590);
        this.add(this.t3);
        MenuScene.instance.add(this.pose_image);


        this.title = new DrawableText(this.p, "姿勢忍者", 150);
        this.title.position.set(WIDTH /2, 150);
        this.title.strokeWeight = 10;
        this.title.textAlign = this.p.CENTER;
        
        this.add(this.title);
        this.title2 = new DrawableText(this.p, "PoseNinja", 50);    
        this.title2.position.set(WIDTH /2, 220);
        this.title.strokeWeight = 10;
        this.title2.textAlign = this.p.CENTER;
        
        this.add(this.title2);

        // let func_to_scor =()=> {
        //     SceneManager.instance.changeScene(SceneEnum.SCORE)
        // }
        // let go_score_button = new RectButton(this.p,300,100,func_to_scor)
        // go_score_button.position.x = 800
        // go_score_button.position.y = 600
        // MenuScene.instance.add(go_score_button)



    }

    _on_update(_delta) {
        this.btn_hard.position.set(630, 600 + Math.sin(this.p.millis() * 0.001) * 10);
        this.btn_rule.position.set(WIDTH / 2 - 63, 580 + Math.sin(this.p.millis() * 0.001) * 10);
        this.btn_easy.position.set(WIDTH / 3 - 50, 646.5+ Math.sin(this.p.millis() * 0.001) * 10);
        const tracker = PoseTracker.get_instance(this.p);
        this.pose_handler.update(_delta);
        const isLeftUp   = tracker.get_is_left_hand_up();
        const isRightUp  = tracker.get_is_righ_hand_up();
        const bothUp     = tracker.get_is_doub_hand_up();
         // —— 偵測 rising edge，剛舉起就播一次音效 —— //
        if (isLeftUp && !this.prevLeftUp) {
            ASSETS.sfx_shuriken.play();
        }
        if (isRightUp && !this.prevRightUp) {
            ASSETS.sfx_knife.play();
        }
        if (bothUp && !this.prevBothUp) {
            ASSETS.sfx_openChest.play();
        }
        // 更新前一幀狀態
        this.prevLeftUp  = isLeftUp;
        this.prevRightUp = isRightUp;
        this.prevBothUp  = bothUp;
        this.btn_rule.isActive = !bothUp;
        this.btn_open.isActive =  bothUp;
        this.btn_hard.isActive = !isRightUp;
        this.btn_skeleton.isActive =  isRightUp;
        if (this.pose_handler.is_doub_counter_reached()) {
            this.func_to_tuto();
        }
        if (this.rotation_active && !isLeftUp) {
            this.rotation_active = false;
            this.btn_easy.rotation = 0;  
        }
        this.pose_image.src = tracker.getVideo();
        this.pose_handler.update(_delta / 1000);
        if (this.rotation_active) {
            
            this.btn_easy.rotation += 0.3;
            if (this.pose_handler.is_left_counter_reached()) {
                this.rotation_active = false;
                this.func_to_easy();
            }
            return; 
        }

        if (isLeftUp) {
            this.rotation_active = true;
            this.btn_easy.rotation = 0;
            return;
        }
        
        if (this.pose_handler.is_righ_counter_reached()) {
            this.func_to_hard();
        }
        
    }


    _on_enter(){
        this.bgmManager.playLoop(ASSETS.bgm_menu);
        console.log("MenuScene Entered");
        
        
    }

    _on_exit(){
        this.pose_handler.reset_all_counter()

    }
}