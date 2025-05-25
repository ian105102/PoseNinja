import {IScene} from "./IScene.js"
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js"
import { SceneManager } from "../SceneManager.js"
import { SceneEnum } from "../SceneEnum.js"

import { WIDTH } from "../G.js"
import { HEIGHT } from "../G.js"
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js"
import { PoseHandler } from "../Objects/APIs/PoseHandler.js"
import { PoseTracker } from "../Objects/APIs/PoseTracker.js"
import { PoseDrawer } from "../Objects/DrawableObj/Game/PoseDrawer.js"



export class HardGameScene extends IScene{
    static instance = null

    constructor(p) {
        if (HardGameScene.instance) {
            
            return HardGameScene.instance
        }
        super(p);
        HardGameScene.instance = this;
        HardGameScene.instance.init()
      

        
    } 
    

    
    //call after constructor
    init(){
        
        let func_to_scor =()=>{
            SceneManager.instance.changeScene(SceneEnum.SCORE)
        }


        let instance = HardGameScene.instance


        this.poseTracker = PoseTracker.get_instance(this.p);
   
        this.poseDrawer =new PoseDrawer(this.p); 
        this.poseDrawer.posePoint = this.poseTracker.getFullSkeleton();
    
        this.poseDrawer.position.x =0;
        this.poseDrawer.position.y = 0;
        instance.add(this.poseDrawer);


        let go_score_button = new RectButton(this.p,300,100,func_to_scor)
        go_score_button.position.x = 800
        go_score_button.position.y = 600
        instance.add(go_score_button)
        
        let text = new DrawableText(this.p,"困難遊戲介面",50)
        text.position.x = WIDTH / 2
        text.position.y = HEIGHT / 8
        instance.add(text)
        

    }


    _on_update(delta){
        this.poseDrawer.posePoint = this.poseTracker.getFullSkeleton();
    }
}