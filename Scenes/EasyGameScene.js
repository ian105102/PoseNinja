import {IScene} from "./IScene.js"
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js"
import { SceneManager } from "../SceneManager.js"
import { SceneEnum } from "../SceneEnum.js"

import { WIDTH } from "../G.js"
import { HEIGHT } from "../G.js"
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js"
import { EasyBoard } from "../Objects/Board/EasyBoard.js";
import { EasyBorads } from "../Objects/Board/EasyBorads.js"
import { DrawableImage } from "../Objects/DrawableObj/Game/DrawableImage.js"
import { PoseDrawer } from "../Objects/DrawableObj/Game/PoseDrawer.js"
import { PoseTracker } from "../Objects/APIs/PoseTracker.js"
import { GeneratorManager, WaitTimer } from "../Objects/Utils/GeneratorManager.js"



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

        this.testx = 0;
        this.testy = 0;


        this.Background = new DrawableImage(this.p);
        this.Background.width = WIDTH;
        this.Background.height = HEIGHT;
        this.bg =  this.p.createGraphics(WIDTH, HEIGHT);
        this.Background.src = this.CreateBackground(this.bg) ;
        instance.add(this.Background);


        let go_score_button = new RectButton(this.p,300,100,func_to_scor)
        go_score_button.position.x = 800
        go_score_button.position.y = 600
        instance.add(go_score_button)
        
        let text = new DrawableText(this.p,"簡單遊戲介面",50)
        text.position.x = WIDTH / 2
        text.position.y = HEIGHT / 8
        instance.add(text)

        this.easyBoard = new EasyBorads(this.p);
        instance.add(this.easyBoard);


        this.boardList = [];
        this.canGenerate = true;
        this.genInterval = 120; // 每60幀生成一個板子
        this.genTimer = 0;


        this.poseTracker = PoseTracker.get_instance(this.p);
        this.poseDrawer =new PoseDrawer(this.p); 
        this.poseDrawer.posePoint = this.poseTracker.getFullSkeleton();
        this.poseDrawer.width = 936;
        this.poseDrawer.height = 576;
        this.poseDrawer.position.x = 0;
        this.poseDrawer.position.y = 0;
        instance.add(this.poseDrawer);



        



        this.judgePoseState = new Map();
        this.generatorManager = new GeneratorManager();
        this.timer = new WaitTimer();

        this.generatorManager.start(this.GameFlow());



    }

    *GameFlow(){
        while (true) {
            console.log("生成一個板子");
            this.easyBoard.add_board(this.JudgePose.bind(this));
            yield  *this.timer.delay(3000); 
        }
        
    }

    JudgePose(boards) {
        const landmarks = this.poseTracker.getFullSkeleton();
        boards.JudgePose(landmarks);
    }
    
    TestDraw(){
        this.p.fill(255, 0, 0);
        this.p.ellipse(this.testx, this.testy, 5, 5); // 在指定位置畫一個紅色圓點
        this.p.fill(0);
        this.p.text("Test", this.testx + 10, this.testy + 10); // 在圓點旁邊顯示文字
    }

    _on_update(delta){
        this.p.stroke(255, 0, 0, 20);
        for(let i = 0; i <= 15; i++){
            this.p.line(0, i*(HEIGHT/15), WIDTH, i*(HEIGHT/15));      // (起始x, 起始y, 終點x, 終點y)
            this.p.line(i*(WIDTH/15), 0, i*(WIDTH/15), HEIGHT);      // (起始x, 起始y, 終點x, 終點y)
        }
        this.poseDrawer.posePoint = this.poseTracker.getFullSkeleton();
        this.easyBoard.update(delta);
        this.generatorManager.update(delta);


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
        bg.line(115.2, 0, 115.2, HEIGHT);
        bg.line(158.4, 0, 158.4, HEIGHT);
        bg.line(921.6, 0, 921.6, HEIGHT);
        bg.line(964.8, 0, 964.8, HEIGHT);
        return bg;
    }

}
