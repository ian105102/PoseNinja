import {IScene} from "./IScene.js"
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js"
import { SceneManager } from "../SceneManager.js"
import { SceneEnum } from "../SceneEnum.js"

import { WIDTH } from "../G.js"
import { HEIGHT } from "../G.js"
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js"



export class EasyGameScene extends IScene{
    static instance = null

    constructor(p) {
        if (EasyGameScene.instance) {
            return EasyGameScene.instance
        }
        super(p);
        EasyGameScene.instance = this;
        EasyGameScene.instance.init()
        
    } 
    

    
    //call after constructor
    init(){
        
        let func_to_scor =()=>{
            SceneManager.instance.changeScene(SceneEnum.SCORE)
        }
        

        let instance = EasyGameScene.instance

        let go_score_button = new RectButton(this.p,300,100,func_to_scor)
        go_score_button.position.x = 800
        go_score_button.position.y = 600
        instance.add(go_score_button)
        
        let text = new DrawableText(this.p,"簡單遊戲介面",50)
        text.position.x = WIDTH / 2
        text.position.y = HEIGHT / 8
        instance.add(text)

  
        console.log("game scene init")

    }

    _on_update(delta){
    }



}