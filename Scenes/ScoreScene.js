import { IScene } from "./IScene.js";
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js"

import { SceneEnum } from "../SceneEnum.js";
import { SceneManager } from "../SceneManager.js";

import { WIDTH } from "../G.js"
import { HEIGHT } from "../G.js"
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js";
import { PoseHandler } from "../Objects/APIs/PoseHandler.js";
export class ScoreScene extends IScene{
    static instance = null

    constructor(p) {
        if (ScoreScene.instance) {
            
            return ScoreScene.instance
        }
        super(p);
        ScoreScene.instance = this;
        ScoreScene.instance.init()
        
    } 
    

    
    //call after constructor
    init(){
        let func =()=>{
            SceneManager.instance.changeScene(SceneEnum.MENU)
        }

        let go_menu_button = new RectButton(this.p,200,70,func)

        go_menu_button.position.x = 540
        go_menu_button.position.y = 600

        ScoreScene.instance.add(go_menu_button)

        let text = new DrawableText(this.p,"結算畫面",50)
        text.position.x = WIDTH / 2
        text.position.y = HEIGHT / 8
        ScoreScene.instance.add(text)


        this.pose_handler = new PoseHandler(this.p)
                
        this.func_to_menu = ()=>{
            SceneManager.instance.changeScene(SceneEnum.ASSET)
        } 
    }

     _on_update(_delta){
        this.pose_handler.update(_delta)
        if(this.pose_handler.is_left_counter_reached()){
            this.func_to_menu()
        }
    }
}