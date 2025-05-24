import { IScene } from "./IScene.js";
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js"

import { SceneEnum } from "../SceneEnum.js";
import { SceneManager } from "../SceneManager.js";

import { PoseTracker } from "../Objects/APIs/PoseTracker.js";

import { WIDTH } from "../G.js"
import { HEIGHT } from "../G.js"
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

        this.func_to_easy =()=>{
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

    
        let go_easy_game_button = new RectButton(this.p,200,100,this.func_to_easy)
        go_easy_game_button.position.x = 540 - 300
        go_easy_game_button.position.y = height
        MenuScene.instance.add(go_easy_game_button)


    
        let go_hard_game_button = new RectButton(this.p,200,100,this.func_to_hard)
        go_hard_game_button.position.x = 540
        go_hard_game_button.position.y = height
        MenuScene.instance.add(go_hard_game_button)

        
        let go_tutorial_button = new RectButton(this.p,200,100,this.func_to_tuto)
        go_tutorial_button.position.x = 540 + 300
        go_tutorial_button.position.y = height
        MenuScene.instance.add(go_tutorial_button)


        


        let scene_text = new DrawableText(this.p,"菜單介面",50)
        scene_text.position.x = WIDTH / 2
        scene_text.position.y = HEIGHT / 7
        MenuScene.instance.add(scene_text)

        let easy_game_text = new DrawableText(this.p,"簡單模式",50)
        easy_game_text.position.x = 540 - 300
        easy_game_text.position.y = height
        MenuScene.instance.add(easy_game_text)

        let hard_game_text = new DrawableText(this.p,"困難模式",50)
        hard_game_text.position.x = 540
        hard_game_text.position.y = height
        MenuScene.instance.add(hard_game_text)

        let tuto_game_text = new DrawableText(this.p,"遊戲教學",50)
        tuto_game_text.position.x = 540 + 300
        tuto_game_text.position.y = height
        MenuScene.instance.add(tuto_game_text)

        this.pose_image = new DrawableImage(this.p);
        this.pose_image.position.x = WIDTH - WIDTH/4 - 20;
        this.pose_image.position.y = HEIGHT - HEIGHT/4 - 20;
        this.pose_image.width = WIDTH/4;
        this.pose_image.height = HEIGHT/4;

        MenuScene.instance.add(this.pose_image);

    }

    _on_update(_delta){
       
        this.pose_image.src = PoseTracker.get_instance(this.p).getVideo();
        this.pose_handler.update(_delta)
        if(this.pose_handler.is_left_counter_reached()){
            this.func_to_easy()

        }
         if(this.pose_handler.is_righ_counter_reached()){
            this.func_to_hard()

        }
         if(this.pose_handler.is_doub_counter_reached()){
            this.func_to_tuto()

        }
    }

    _on_enter(){

    }

    _on_exit(){
        this.pose_handler.reset_all_counter()

    }
}