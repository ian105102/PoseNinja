import { WIDTH } from "../../G.js"
import { HEIGHT } from "../../G.js"
import { IObject } from "../IObject.js";
import { GeneratorManager, WaitTimer } from "../Utils/GeneratorManager.js";
import { Board } from './Board.js';
/*
    type: 1 = 正常, 0 = 障礙物
    負責渲染一塊板，並且處理移動動畫
*/
export class HardBoard extends IObject {
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
        this.passBoard = [];
        // 建立板子遮擋邏輯
        // this.Boards = [];
        // this.cols = 60;
        // this.rows = 40;
        // for (let i = 0; i < this.cols; i++) {
        //     let row = [];
        //     for (let j = 0; j < this.rows; j++) {
        //         row.push(new Board(i,j));
        //     }
        //     this.Boards.push(row);
        // }

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
                switch (this.Boards[i][j].type) {
                case 0:
                    this.pg.fill(c); break;
                case 1:
                    this.pg.fill(48, 60, 230, 80); break;
                case 2:
                    this.pg.fill(155, 48, 230, 80); break;
                case 3:
                    this.pg.fill(48, 117, 230, 80); break;
                case 4:
                    this.pg.fill(97, 97, 97, 80); break;
                case 5:
                    this.pg.fill(46, 46, 46, 80); break;
                case 6:
                    this.pg.fill(127, 128, 0, 80); break;
                case 7:
                    this.pg.fill(48, 178, 230, 80); break;
                case 8:
                    this.pg.fill(63, 0, 0, 80); break;
                case 9:
                    this.pg.fill(99, 0, 0, 80); break;
                case 10:
                    this.pg.fill(201, 115, 185, 80); break;
                case 11:
                    this.pg.fill(161, 91, 148, 80); break;
                default:
                    this.pg.fill(229, 229, 229, 80);
                }
                this.pg.rect(i * cellW, j * cellH, cellW, cellH);
            }
        }
    }

    getPassBoard() {
        this.passBoard = [];
        for (let i = 0; i < this.cols; i++) {
            let row = [];
            for (let j = 0; j < this.rows; j++) {
                console.log(this.Boards[i][j].type);
                if(this.Boards[i][j].type != 0){
                    this.passBoard.push(this.Boards[i][j]);
                }
            }
        }
        return this.passBoard;
    }

    *startRise(board,  OnEnd, OnLine) {
        this._setBoard(board);
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
