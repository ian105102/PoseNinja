import { IScene } from "./IScene.js";
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js"

import { SceneEnum } from "../SceneEnum.js";
import { SceneManager } from "../SceneManager.js";

import { WIDTH } from "../G.js"
import { HEIGHT } from "../G.js"
import { ASSETS } from "../G.js"
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js";
import { DrawableImage } from "../Objects/DrawableObj/Game/DrawableImage.js";
import { PoseHandler } from "../Objects/APIs/PoseHandler.js";
import { PoseTracker } from "../Objects/APIs/PoseTracker.js";
export class ScoreScene extends IScene{
    static instance = null

    constructor(p) {
        if (ScoreScene.instance) {
            
            return ScoreScene.instance
        }
        super(p);
        ScoreScene.instance = this;
        ScoreScene.instance.init()
        this.pose_handler = new PoseHandler(p);
        this.prevRightUp  = false;
        this.backOffsetY = 0;
    } 
    

    
    //call after constructor
    init(){


        this.bg = new DrawableImage(this.p);
        this.bg.setImage(ASSETS.score);
        this.bg.position.set(0, 0);
        this.bg.width = WIDTH;
        this.bg.height = HEIGHT;
        this.add(this.bg);
        
        this.home = new DrawableImage(this.p);
        this.home.setImage(ASSETS.home);
        this.home.position.set(400, 500);
        this.home.width = 250;
        this.home.height = 250;
        this.add(this.home);
        
        // let go_menu_button = new RectButton(this.p,200,70,func)

        // go_menu_button.position.x = 540
        // go_menu_button.position.y = 600

        // ScoreScene.instance.add(go_menu_button)

        // let text = new DrawableText(this.p,"結算畫面",50)
        // text.position.x = WIDTH / 2
        // text.position.y = HEIGHT / 8
        // ScoreScene.instance.add(text)


        this.pose_handler = new PoseHandler(this.p)
        this.pose_image = new DrawableImage(this.p);
        this.pose_image.position.x = WIDTH/3 + 70;
        this.pose_image.position.y = HEIGHT - HEIGHT/5 -20;
        this.pose_image.width = WIDTH/4;
        this.pose_image.height = HEIGHT/5;
        this.pose_image.visible = false;
        ScoreScene.instance.add(this.pose_image)        
        this.func_to_Menu = ()=>{
            SceneManager.instance.changeScene(SceneEnum.MENU)
        } 
    }

     _on_update(_delta){
        this.pose_handler.update(_delta)
        this.pose_image.src = PoseTracker.get_instance(this.p).getVideo();
        const tracker = PoseTracker.get_instance(this.p);
        const isRightUp   = tracker.get_is_righ_hand_up();
        this.backOffsetY = this.p.lerp(this.backOffsetY, isRightUp ? -50 : 0, 0.1);
        this.home.position.y = 500 + this.backOffsetY;
        if (isRightUp && !this.prevRightUp) {
            ASSETS.sfx_BHOME.play();
        }
        this.prevRightUp  = isRightUp;
        if(this.pose_handler.is_righ_counter_reached()){
            this.func_to_Menu()
        }
    }
}