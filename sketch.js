// sketch.js


import { SceneManager } from "./SceneManager.js"
import { ASSETS, WIDTH } from "./G.js"
import { HEIGHT } from "./G.js"
import { PoseTracker } from "./Objects/APIs/PoseTracker.js"
import { BgmManager } from "./AudioController/BgmManager.js"

const main_sketch = (p)=>{
    /// <reference types="p5" />
    //const game_scene = new GameScene(p)

    let easyKeypointDataList = [];
    let hardKeypointDataList = [];
    p.preload = () =>{


        
    }

    let scene_manager;
    let pose_tracker;
    let bgm_manager;

    let delta =0;
    let last_time = 0;
    let maxDelta = 0.1;


    p.setup = () =>{
        console.log("setup")
        // for (let i = 1; i <= 5; i++) {
        //     let data = p.loadJSON(`Data/easyPoseJson/pose_snapshot-${i}.json`);
        //     easyKeypointDataList.push(data);
        // }
        // for (let i = 1; i <= 19; i++) {
        //     let data = p.loadJSON(`Data/hardPoseJson/pose_snapshot-${i}.json`);
        //     hardKeypointDataList.push(data);
        // }
        ASSETS.btn_easy =       p.loadImage("assets/easy.png");
        ASSETS.btn_hard =       p.loadImage("assets/hard.png");
        ASSETS.btn_rule =       p.loadImage("assets/rule.png");
        ASSETS.bg_menu =        p.loadImage("assets/Menu.png");
        ASSETS.btn_open =       p.loadImage("assets/open.png");
        ASSETS.btn_skeleton =   p.loadImage("assets/Skeleton.png");
        ASSETS.how          =   p.loadImage("assets/how.png");
        ASSETS.ninja        =   p.loadImage("assets/ninja.png");
        ASSETS.back        =    p.loadImage("assets/Back.png");
        ASSETS.pose_data_1 =    p.loadImage("assets/poseData1.png");
        ASSETS.pose_data_2 =    p.loadImage("assets/poseData2.png");
        ASSETS.sfx_knife      = p.loadSound("assets/Knife.MP3");
        ASSETS.sfx_openChest  = p.loadSound("assets/open_chest.MP3");
        ASSETS.sfx_shuriken   = p.loadSound("assets/shuriken.MP3");
        ASSETS.sfx_return     = p.loadSound("assets/return.MP3");
        ASSETS.sfx_BHOME      = p.loadSound("assets/B_HOME.MP3"); 
        ASSETS.font_huninn =    p.loadFont("assets/jf-openhuninn-2.1.ttf");
        ASSETS.game_bg = p.loadImage("assets/game_bg.png");
        ASSETS.maingame_background = p.loadImage("assets/maingamebackground.png");
        ASSETS.HpIcon = p.loadImage("assets/hp.png");
        ASSETS.font = p.loadFont("assets/ttf/Bakudai-Medium.ttf");
        ASSETS.score = p.loadImage("assets/Score.png");
        ASSETS.home = p.loadImage("assets/HOME.png");
        ASSETS.pass = p.loadSound("assets/Correct.mp3");
        ASSETS.NotPass = p.loadSound("assets/Wrong.mp3");
        ASSETS.ace = p.loadSound("assets/ACE.MP3");
        ASSETS.bgm_EazyMode = p.loadSound("assets/Bgm/EazyMode.mp3");
        ASSETS.bgm_HardMode = p.loadSound("assets/Bgm/HardMode.mp3");
        ASSETS.bgm_menu = p.loadSound("assets/Bgm/MainMenu.mp3");
        ASSETS.bgm_score_view = p.loadSound("assets/Bgm/ScoreView.mp3");

        let canvas = p.createCanvas(WIDTH, HEIGHT);
        canvas.class("GameCanvas");
        pose_tracker = new PoseTracker(p)
        bgm_manager = new BgmManager(p)
        // scene_manager = new SceneManager(p, easyKeypointDataList, hardKeypointDataList)
        scene_manager = new SceneManager(p)

        p.is_left_pressing = false
        p.is_right_pressing = false

        p.is_first_left_pressing = false
        p.is_first_right_pressing = false
    



        
        p.window_width = WIDTH
        p.window_height = HEIGHT
    }
    
    p.draw = () =>{
        bgm_manager.update();
        let current_time = p.millis();
        delta = (current_time - last_time) / 1000; 
        delta = Math.min(delta, maxDelta);
        last_time = current_time;
      
        p.background(220);

        SceneManager.instance.update(delta)
        SceneManager.instance.draw()
        pose_tracker.update()

        p.handleInput()
        
    }
    p.handleInput = () => {
        p.is_first_left_pressing = false
        p.is_first_right_pressing = false
    }


    p.mousePressed = () => {
        if (p.mouseButton === p.LEFT) {
            if(!p.is_left_pressing){
                p.is_first_left_pressing = true
                console.log("first pressing!")
            }

            p.is_left_pressing = true
            
            
            


        } else if (p.mouseButton === p.RIGHT) {
            if(!p.is_right_pressing){
                p.is_first_right_pressing = true
            }else{
                p.is_first_right_pressing = false
            }
            p.is_right_pressing = true
            
            
            
        }
    }
    
    p.mouseReleased = () => {
        if (p.mouseButton === p.LEFT) {
            p.is_left_pressing = false
            p.is_first_left_pressing = false

        } else if (p.mouseButton === p.RIGHT) {
            p.is_right_pressing = false
            p.is_first_right_pressing = false
        }
    }

    //pressed function is broken so I'm not gonna use it :)
    
}

new p5(main_sketch)
