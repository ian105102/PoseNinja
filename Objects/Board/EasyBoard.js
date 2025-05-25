import { WIDTH } from "../../G.js"
import { HEIGHT } from "../../G.js"
import { IObject } from "../IObject.js";
import { GeneratorManager, WaitTimer } from "../Utils/GeneratorManager.js";
import { Board } from './Board.js';
/*
    type: 1 = 正常, 0 = 障礙物

*/
export class EasyBoard extends IObject {
    constructor(p) {
        super(p);

        this.width = 72;
        this.height = 48;
        this.riseStep = 48;

        this.scale.x = 1;
        this.scale.y = 1;

        this.position.x = WIDTH / 2;
        this.position.y = 192 + 48;

        this.waitTimer = new WaitTimer();

        this.color = this.p.color(242, 133, 0, 60);

        // 建立板子遮擋邏輯
        this.Boards = [];
        this.cols = 10;
        this.rows = 10;
        for (let i = 0; i < this.cols; i++) {
            let row = [];
            for (let j = 0; j < this.rows; j++) {
                row.push(new Board());
            }
            this.Boards.push(row);
        }

        // 離屏畫布
        this.pg = this.p.createGraphics(849.6, 566.4);
        this.drawToCanvas(this.color);
    }

    _setBoard(boards) {
    
        this.cols = boards.length;
        this.rows = boards[0].length;

        this.scale.x = 1;
        this.scale.y = 1;

        this.position.x = WIDTH / 2;
        this.position.y = 192 + 48;
        this.move = false;
        this.color = this.p.color(242, 133, 0, 60);
        this.riseStep = 48;

        this.Boards = boards;


        // 重新繪製到 buffer 畫布
        this.pg.clear();
        this.drawToCanvas(this.color);

        this.isActive = true; // 啟用狀態（方便物件池控制）
    }

    changeColor(poseCorrectWrong) {
        if (poseCorrectWrong) {
            this.color = this.p.color(42, 157, 143, 60);
        } else {
            this.color = this.p.color(255, 0, 0, 60);
        }
        this.drawToCanvas(this.color);
    }

    _on_draw() {
        this.p.image(this.pg, -this.width / 2, (-this.height + this.riseStep), this.width, (this.height - this.riseStep));
    }

    _on_update(delta) {
        console.log("EasyBoard update", this.isActive);
        if (this.move) {
            console.log(delta);
            this.position.y = this.position.y + (30* delta);
            this.scale.x = (this.position.y - 192 - 48) * 0.025 + 1;
            this.scale.y = (this.position.y - 192 - 48) * 0.025 + 1;
        }
    }

    // 可自訂的離屏繪圖內容
    drawToCanvas(c) {
        this.pg.clear();
        this.pg.noStroke();

        let cellW = this.pg.width / this.cols;
        let cellH = this.pg.height / this.rows;

        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if (this.Boards[i][j].type === 0) {
                    this.pg.fill(c);
                } else {
                    this.pg.fill(229, 229, 229, 80);
                }
                this.pg.rect(i * cellW, j * cellH, cellW, cellH);
            }
        }
    }

    getPassBoard() {
        let passBoard = [];
        for (let i = 0; i < this.cols; i++) {
            let row = [];
            for (let j = 0; j < this.rows; j++) {
                if(this.Boards[i][j].type != 0){
                    row.push(this.Boards[i][j].type);
                }
            }
            passBoard.push(row);
        }
        return passBoard;
    }

    *startRise(board,  OnEnd, OnLine) {
        this._setBoard(board );
        for (let i = this.riseStep; i > 0; i--) {
            this.riseStep -= 1;
            yield this.waitTimer.delay(10);
        }

        while (this.position.y < 720) {
            this.move = true;
            yield;
        }
        console.log(this.getPassBoard());
        this.isActive = false;
        OnEnd(this);
     
    }


}
