import { IScene } from "./IScene.js";

import { SceneEnum } from "../SceneEnum.js";
import { SceneManager } from "../SceneManager.js";

import { WIDTH } from "../G.js"
import { HEIGHT } from "../G.js"
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js";
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js";

import { PoseHandler } from './../Objects/APIs/PoseHandler.js';
export class TutorialScene extends IScene{
    static instance = null

    constructor(p) {
        if (TutorialScene.instance) {
            
            return TutorialScene.instance
        }
        super(p);
        TutorialScene.instance = this;
        TutorialScene.instance.init()
        
    } 
    

    
    //call after constructor
    init(){
        let func =()=>{
            SceneManager.instance.changeScene(SceneEnum.MENU)
        }

        let go_game_button = new RectButton(this.p,200,100,func)
        go_game_button.position.x = 840
        go_game_button.position.y = 600
        TutorialScene.instance.add(go_game_button)
        let text = new DrawableText(this.p,"教學介面",50)
        text.position.x = WIDTH / 2
        text.position.y = HEIGHT / 9
        TutorialScene.instance.add(text)

        this.pose_handler = new PoseHandler(this.p)
        
        this.func_to_menu = ()=>{
            SceneManager.instance.changeScene(SceneEnum.MENU)
        }
    }

    _on_update(_delta){
        this.pose_handler.update(_delta)
        if(this.pose_handler.is_left_counter_reached()){
            this.func_to_menu()
        }
    }

    _on_exit(){
        this.pose_handler.reset_all_counter()

    }
}