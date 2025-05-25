import {IScene} from "./IScene.js"
import { RectButton } from "../Objects/DrawableObj/Button/RectButton.js"
import { SceneManager } from "../SceneManager.js"
import { SceneEnum } from "../SceneEnum.js"

import { WIDTH } from "../G.js"
import { HEIGHT } from "../G.js"
import { DrawableText } from "../Objects/DrawableObj/Text/DrawableText.js"
import { EasyBoard } from "../Objects/Board/EasyBoard.js";
import { EasyBorads } from "../Objects/Board/EasyBorads.js"



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

        
        this.boardList = [];
        this.canGenerate = true;
        this.genInterval = 120; // 每60幀生成一個板子
        this.genTimer = 0;


        this.easyBoard = new EasyBorads(this.p);
        instance.add(this.easyBoard);
        this.easyBoard.add_board();

        
    }

    _on_update(delta){
        this.p.stroke(255, 0, 0, 20);
        for(let i = 0; i <= 15; i++){
            this.p.line(0, i*(HEIGHT/15), WIDTH, i*(HEIGHT/15));      // (起始x, 起始y, 終點x, 終點y)
            this.p.line(i*(WIDTH/15), 0, i*(WIDTH/15), HEIGHT);      // (起始x, 起始y, 終點x, 終點y)
        }
        
        this.easyBoard.update(delta);
        
        this.initSence();


        // this.boardList = this.boardList.filter(board => {
    
        // });

        
        // // 控制板子生成節奏
        // this.genTimer++;
        // if (this.genTimer >= this.genInterval) {
        //     this.boardList.push(new EasyBoard(this.p)); // 每個板子起始位置
        //     this.genTimer = 0;
        // }

        // 更新與繪製所有板子


        //     if ((board.baseY >= 672) && board.judgePose) {
        //     console.log("Debug1: 判斷姿勢!!");

        //     // 1. 計算偏移（假設 centered）
        //     let offsetX = (1080 - board.pg.width) / 2;
        //     let offsetY = (720 - board.pg.height) / 2;

        //     // 2. 計算相對於 board.pg 的滑鼠位置
        //     let localX = this.p.mouseX - offsetX;
        //     let localY = this.p.mouseY - offsetY;

            

        //     // 3. 檢查是否在 pg 範圍內
        //     if (localX >= 0 && localX < board.pg.width && localY >= 0 && localY < board.pg.height) {
        //         let cellW = board.pg.width / board.cols;
        //         let cellH = board.pg.height / board.rows;

        //         let gridX = this.p.floor(localX / cellW);
        //         let gridY = this.p.floor(localY / cellH)-1;

        //         console.log("Mouse Grid:", gridX, gridY);

        //         let isInPose = board.points.some(([x, y]) => x === gridX && y === gridY);
        //         console.log("Is in pose:", isInPose);

        //         if (isInPose) {
        //         board.changeColor(true);  // 命中
        //         } else {
        //         board.changeColor(false); // 沒命中
        //         }
        //     } else {
        //         console.log("滑鼠不在板子上");
        //         board.changeColor(false);
        //     }

        //     board.judgePose = false;
        //     }

        //     return board.baseY < 720;
        // });

    }
    
    initSence(){
        this.p.noStroke();
        this.p.fill(189, 224, 254);
        this.p.quad((WIDTH/2)-36, 192+48, (WIDTH/2)+36, 192+48, 921.6, 624, 158.4, 624); //(x1, y1, x2, y2, x3, y3, x4, y4);
        
        this.p.noStroke(0);
        this.p.fill(69, 123, 157);
        this.p.quad(921.6, 624, 158.4, 624, 72, 720, 1008, 720); //(x1, y1, x2, y2, x3, y3, x4, y4);

        this.p.stroke(0);
        this.p.fill(205, 180, 219);
        this.p.quad((WIDTH/2)-36, 192+48, (WIDTH/2)-36, 192+48, 0, HEIGHT, 72, HEIGHT);            // 左邊緣(x1, y1, x2, y2, x3, y3, x4, y4);
        this.p.quad((WIDTH/2)+36, 192+48, (WIDTH/2)+36, 192+48, WIDTH, HEIGHT, WIDTH-72, HEIGHT);  // 右邊緣(x1, y1, x2, y2, x3, y3, x4, y4);
        
        this.p.stroke(0, 0, 0, 50);
        this.p.line(115.2, 672, 964.8, 672);                  // (起始x, 起始y, 終點x, 終點y)

        /* 
        Line1: (x1, y1) = (504, 240), (x2, y2) = (72, 720)
        Line2: (x1, y1) = (576, 240), (x2, y2) = (1008, 720)

        y=624, 與Line1的交點為(158.4,624), 與Line2的交點為(921.6,624)
        y=672, 與Line1的交點為(115.2,672), 與Line2的交點為(964.8,672)
        
        */
        // test line
        this.p.stroke(0, 0, 0, 20);
        this.p.line(115.2, 0, 115.2, HEIGHT);
        this.p.line(158.4, 0, 158.4, HEIGHT);
        this.p.line(921.6, 0, 921.6, HEIGHT);
        this.p.line(964.8, 0, 964.8, HEIGHT);
    }

    
}


