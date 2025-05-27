import { IScene } from "./IScene.js";
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js"

import { SceneEnum } from "../SceneEnum.js";
import { SceneManager } from "../SceneManager.js";

import { PoseTracker } from "../Objects/APIs/PoseTracker.js";

import { WIDTH } from "../G.js"
import { HEIGHT } from "../G.js"
import { ASSETS } from "../G.js"
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js";
import { PoseHandler } from "../Objects/APIs/PoseHandler.js";
import { DrawableImage } from "../Objects/DrawableObj/Game/DrawableImage.js";
export class MenuScene extends IScene{
    static instance = null

    constructor(p) {
        if (MenuScene.instance) {
            
            return MenuScene.instance
        }
        super(p);
        MenuScene.instance = this;
        MenuScene.instance.init()
    
        this.pose_handler = new PoseHandler(p)
        this.rotation_active = false;
        this.rotation_timer = 0;
        this.func_to_easy =()=>{
             this.rotation_active = false;
            SceneManager.instance.changeScene(SceneEnum.EASY_GAME)
        }

        this.func_to_hard =()=>{
            SceneManager.instance.changeScene(SceneEnum.HARD_GAME)
        }

        this.func_to_tuto =()=>{
            SceneManager.instance.changeScene(SceneEnum.TUTORIAL)
        }
    } 
    

    
    //call after constructor
    init(){
        let height = HEIGHT / 7 * 6

        const bg = new DrawableImage(this.p);
        bg.setImage(ASSETS.bg_menu);
        bg.position.set(0, 0);
        bg.width = WIDTH;
        bg.height = HEIGHT;
        this.add(bg);
        // ✅ Easy 按鈕圖片
        this.btn_easy = new DrawableImage(this.p);
        this.btn_easy.setImage(ASSETS.btn_easy); // ✅ 可替換為去背手裡劍圖
        this.btn_easy.width = 200;
        this.btn_easy.height = 133;
        this.btn_easy.position.set(190 + 100, 580 + 66.5); // 中心
        this.btn_easy.setAnchor(0.5, 0.5); // 繞中心轉
        this.add(this.btn_easy);

        // ✅ Rule 按鈕圖片
        const btn_rule = new DrawableImage(this.p);
        btn_rule.setImage(ASSETS.btn_rule);
        btn_rule.position.set(450, 580);
        btn_rule.width = 140;
        btn_rule.height = 140;
        this.add(btn_rule);
        
        // ✅ Hard 按鈕圖片
        const btn_hard = new DrawableImage(this.p);
        btn_hard.setImage(ASSETS.btn_hard);
        btn_hard.position.set(630, 580);
        btn_hard.width = 140;
        btn_hard.height = 140;
        this.add(btn_hard);
        
        


        // let scene_text = new DrawableText(this.p,"菜單介面",50)
        // scene_text.position.x = WIDTH / 2
        // scene_text.position.y = HEIGHT / 7
        // MenuScene.instance.add(scene_text)

        // let easy_game_text = new DrawableText(this.p,"簡單模式",50)
        // easy_game_text.position.x = 540 - 300
        // easy_game_text.position.y = height
        // MenuScene.instance.add(easy_game_text)

        // let hard_game_text = new DrawableText(this.p,"困難模式",50)
        // hard_game_text.position.x = 540
        // hard_game_text.position.y = height
        // MenuScene.instance.add(hard_game_text)

        // let tuto_game_text = new DrawableText(this.p,"遊戲教學",50)
        // tuto_game_text.position.x = 540 + 300
        // tuto_game_text.position.y = height
        // MenuScene.instance.add(tuto_game_text)

        this.pose_image = new DrawableImage(this.p);
        this.pose_image.position.x = WIDTH - WIDTH/4 - 20;
        this.pose_image.position.y = HEIGHT - HEIGHT/4 - 20;
        this.pose_image.width = WIDTH/4;
        this.pose_image.height = HEIGHT/4;

        MenuScene.instance.add(this.pose_image);

    }

    _on_update(_delta) {
        const tracker = PoseTracker.get_instance(this.p);
        const isLeftUp = tracker.get_is_left_hand_up();
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
        if (this.pose_handler.is_doub_counter_reached()) {
            this.func_to_tuto();
        }
    }


    _on_enter(){

    }

    _on_exit(){
        this.pose_handler.reset_all_counter()

    }
}