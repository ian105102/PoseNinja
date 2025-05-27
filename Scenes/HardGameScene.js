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

import { BoardList  } from "../Objects/Board/BoardList.js";
import { GeneratorManager, WaitTimer } from "../Objects/Utils/GeneratorManager.js"
import { DrawableImage } from "../Objects/DrawableObj/Game/DrawableImage.js"



export class HardGameScene extends IScene{
    static instance = null

    constructor(p, hardKeypointDataList) {
        if (HardGameScene.instance) {
            
            return HardGameScene.instance
        }
        super(p);
        this.keypointDataList = hardKeypointDataList;
        HardGameScene.instance = this;
        HardGameScene.instance.init()
        
    } 
    
    //call after constructor
    init(){
        
        let func_to_scor =()=>{
            SceneManager.instance.changeScene(SceneEnum.SCORE)
        }

        let instance = HardGameScene.instance

        this.time = 0;
        this.life = 3;

        this.judgePoseState = new Map();
        this.generatorManager = new GeneratorManager();
        this.timer = new WaitTimer();

        // let go_score_button = new RectButton(this.p,300,100,func_to_scor)
        // go_score_button.position.x = 800
        // go_score_button.position.y = 600
        // instance.add(go_score_button)
        
        // let text = new DrawableText(this.p,"困難遊戲介面",50)
        // text.position.x = WIDTH / 2
        // text.position.y = HEIGHT / 8
        // instance.add(text)

        this.Background = new DrawableImage(this.p);
        this.Background.width = WIDTH;
        this.Background.height = HEIGHT;
        this.bg =  this.p.createGraphics(WIDTH, HEIGHT);
        this.Background.src = this.CreateBackground(this.bg) ;
        instance.add(this.Background);

        this.boardList = new BoardList(this.p, this.keypointDataList);
        instance.add(this.boardList);
        this.poseTracker = PoseTracker.get_instance(this.p);
        this.poseDrawer =new PoseDrawer(this.p); 
        this.poseDrawer.posePoint = this.poseTracker.getFullSkeleton();
        this.poseDrawer.position.x =0;
        this.poseDrawer.position.y = 0;
        instance.add(this.poseDrawer);


        this.TimeText = new DrawableText(this.p,"",30)
        this.TimeText.position.x = 100  
        this.TimeText.position.y = HEIGHT / 8
        instance.add(this.TimeText)


        this.CountdownText = new DrawableText(this.p,"",100)
        this.CountdownText.position.x = WIDTH / 2 
        this.CountdownText.position.y = HEIGHT / 2
        instance.add(this.CountdownText)
    }

    *GameFlow(){
        this.CountdownText.isActive = true;
        for(let i =0; i < 3; i++){
            console.log(3-i);
            this.CountdownText.text = (3-i).toString();
            
            yield  *this.timer.delay(1000);
        }
        this.CountdownText.text = "開始!!!";
        yield  *this.timer.delay(1000);
        this.CountdownText.isActive = false;


        while (true) {
            console.log("生成板子");
            if(Math.floor(Math.random() * 3) === 0){
                yield  *this.generatorManager.start(this.BoxState(Math.floor(Math.random() * 2)+2));
            }
      
            let board = this.boardList.add_board(this.JudgePose.bind(this) , this.boardEnd.bind(this));
            this.judgePoseState.set(board, false); 
            yield  *this.timer.delay(4000 - Math.min(this.time*5 ,1000 )); 
        }
        
    }
    *BoxState(round){
        yield *this.timer.delay(2000);
        for(let i = 0; i < round; i++){
            let round = Math.floor(Math.random() * 3) + 1; // 隨機生成1到3之間的整數
            let board = this.boardList.add_board(this.JudgePose.bind(this) , this.boardEnd.bind(this) ,round ,17); 
            this.judgePoseState.set(board, false); 
            yield  *this.timer.delay(2000 - Math.min(this.time*1 ,500 )); // 每個板子間隔時間隨機減少
        }

    }
    *TimerCount() {
        while (true) {
            this.time++;
            this.boardList.setSpeed(this.time/100);
            this.TimeText.text = "time: " + this.time;
            yield *this.timer.delay(1000); // 每秒更新一次
        }
    }


    boardEnd(board) {
        if(!this.judgePoseState.has(board) || !board){
            console.log("板子已經被刪除或不存在");
            return;
        }
        console.log(this.judgePoseState);
        if(this.judgePoseState.get(board)){
            console.log("判斷成功");
        }else{
            console.log("判斷失敗");
            this.life--;
            if(this.life <= 0){
                SceneManager.instance.changeScene(SceneEnum.SCORE);
            }
        }
        this.judgePoseState.delete(board);
    }

    JudgePose(board) {

        const landmarks = this.poseTracker.getFullSkeleton();
        if(!PoseTracker.checkHeadAndWristsVisible(landmarks))return;  
        if( !this.judgePoseState.has(board) || this.judgePoseState.get(board) === true){
            board.changeColor(true);  // 命中
            return;
        }

        if(!board.JudgePose(landmarks)){
            this.judgePoseState.set(board, true);
            return ;
        }
    }
    _on_update(delta){
        this.p.stroke(255, 0, 0, 20);

        this.poseDrawer.posePoint = this.poseTracker.getFullSkeleton();
        this.boardList.update(delta);
        this.generatorManager.update(delta);
    }

    _on_enter(){
        this.generatorManager.start(this.GameFlow());
        this.generatorManager.start(this.TimerCount());
        this.time = 0;
    }
    _on_exit(){
        this.generatorManager.clearAll();
        this.judgePoseState.clear();
        this.boardList.clear();
    }

    CreateBackground(bg){
        bg.noStroke();
        bg.fill(189, 224, 254);
        bg.quad((WIDTH/2)-36, 192+48, (WIDTH/2)+36, 192+48, 921.6, 624, 158.4, 624); //(x1, y1, x2, y2, x3, y3, x4, y4);
        
        bg.noStroke(0);
        bg.fill(69, 123, 157);
        bg.quad(921.6, 624, 158.4, 624, 72, 720, 1008, 720); //(x1, y1, x2, y2, x3, y3, x4, 
        bg.stroke(0);
        bg.fill(205, 180, 219);
        bg.quad((WIDTH/2)-36, 192+48, (WIDTH/2)-36, 192+48, 0, HEIGHT, 72, HEIGHT);            // 左邊緣(x1, y1, x2, y2, x3, y3, x4, y4);
        bg.quad((WIDTH/2)+36, 192+48, (WIDTH/2)+36, 192+48, WIDTH, HEIGHT, WIDTH-72, HEIGHT);  // 右邊緣(x1, y1, x2, y2, x3, y3, x4, y4);
        
        bg.stroke(0, 0, 0, 50);
        bg.line(115.2, 672, 964.8, 672);                  // (起始x, 起始y, 終點x, 終點y)

        /* 
        Line1: (x1, y1) = (504, 240), (x2, y2) = (72, 720)
        Line2: (x1, y1) = (576, 240), (x2, y2) = (1008, 720)

        y=624, 與Line1的交點為(158.4,624), 與Line2的交點為(921.6,624)
        y=672, 與Line1的交點為(115.2,672), 與Line2的交點為(964.8,672)
        
        */
        // test line
        bg.stroke(0, 0, 0, 20);
        // bg.line(115.2, 0, 115.2, HEIGHT);
        // bg.line(158.4, 0, 158.4, HEIGHT);
        // bg.line(921.6, 0, 921.6, HEIGHT);
        // bg.line(964.8, 0, 964.8, HEIGHT);
        return bg;
    }
}