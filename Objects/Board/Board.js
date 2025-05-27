import { WIDTH } from "../../G.js"
import { HEIGHT } from "../../G.js"
import { IObject } from "../IObject.js";
import { GeneratorManager, WaitTimer } from "../Utils/GeneratorManager.js";
import { Cell } from './Cell.js';
import { PoseDrawer } from "../DrawableObj/Game/PoseDrawer.js";
import { Square } from "./Square.js";
/*
    type: 1 = 正常, 0 = 障礙物
    負責渲染一塊板，並且處理移動動畫
*/
export class Board extends IObject {
    constructor(p) {
        super(p);

        this.width = 72;
        this.height = 48;
        this.riseStep = 47.9;

        this.scale.x = 1;
        this.scale.y = 1;

        this.speed = 10;

        this.position.x = WIDTH / 2;
        this.position.y = 192 + 48;

        this.waitTimer = new WaitTimer();

        this.color = this.p.color(242, 133, 0 ,60);
        this.WallCell = [];
        this.squares = [];
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
    }


    _set_Board(boards) {
        this.cols = boards.length;
        this.rows = boards[0].length;

        this.scale.x = 1;
        this.scale.y = 1;

        this.position.x = WIDTH / 2;
        this.position.y = 192 + 48;


        this.move = false;
        this.color = this.p.color(242, 133, 0,60);
        this.riseStep = 48;

        this.Boards = boards;

        this.WallCell = [];
        this.squares = [];
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if(this.Boards[i][j].type == 0){
                    this.WallCell.push(this.Boards[i][j]);
                }
            }
        }
        for (let i = 0; i < this.cols - 1; i++) {
            for (let j = 0; j < this.rows - 1; j++) {
                let topLeft = this.Boards[i][j];
                let topRight = this.Boards[i + 1][j];
                let bottomRight = this.Boards[i + 1][j + 1];
                let bottomLeft = this.Boards[i][j + 1];

                let square = new Square(topLeft, topRight, bottomRight, bottomLeft);
                this.squares.push(square);
            }
        }

        // 重新繪製到 buffer 畫布
        this.pg.clear();
        this.drawToCanvas(this.color);
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
        this.p.push();

        // 計算實際位置與大小
        const x = -this.width / 2;
        const y = -this.height + this.riseStep;
        const w = this.width;
        const h = this.height - this.riseStep;

        // 畫圖像
        this.p.image(this.pg, x, y, w, h);

        // 畫邊框
        this.p.noFill();          // 不填色
        this.p.stroke(0);         // 黑色邊框
        this.p.strokeWeight(1);   // 邊框粗細（可調整）
        this.p.rect(x, y, w, h);  // 畫出邊框

        this.p.pop();
    }

    _on_update(delta) {
        if (this.move) {
            this.position.y = this.position.y + (this.speed * delta *this.scale.y);
            this.scale.x = (this.position.y - 192 - 48) * 0.025 + 1;
            this.scale.y = (this.position.y - 192 - 48) * 0.025 + 1;
        }
    }
    getBoardWorldSize(){
        return this.p.createVector(this.width / this.cols*this.scale.x , this.height / this.rows*this.scale.y);
    }
    tileToWorld(tileX, tileY) {
        let cellW = this.width / this.cols;
        let cellH = this.height / this.rows;

        let worldX = tileX * (cellW*this.scale.x)   + this.position.x - (this.width*this.scale.x)/2 ;
        let worldY = tileY * (cellH*this.scale.y)   + this.position.y - (this.height*this.scale.y);

        return this.p.createVector(worldX, worldY);
    }
    // 可自訂的離屏繪圖內容
    drawToCanvas(c) {
        this.pg.clear();
        this.pg.noStroke();
        // this.pg.stroke(1);

        // const cellW = this.pg.width / this.cols;
        // const cellH = this.pg.height / this.rows;

        // for (let i = 0; i < this.cols; i++) {
        //     for (let j = 0; j < this.rows; j++) {
        //         this._Set_color(this.pg, this.Boards[i][j].type, c);
        //         this.pg.rect(i * cellW, j * cellH, cellW, cellH);
        //     }
        // }

        for (let square of this.squares) {
            this.drawMarchingSquare(square, this.pg , c);
        }
    }

    drawMarchingSquare(square, pg, color) {
        const w = pg.width / this.cols+0.1;
        const h = pg.height / this.rows+0.1;

        const X = p => p.x * w;
        const Y = p => p.y * h;
        
        pg.fill(color);

        switch (square.configuration) {
            case 0:
                break;
            case 15:
                this.draw_polygon(pg, [square.topLeft, square.topRight, square.bottomRight, square.bottomLeft], X, Y);
                break;
            case 1:
                this.draw_polygon(pg, [square.centerLeft, square.bottomLeft, square.centerBottom], X, Y);
                break;
            case 2:
                this.draw_polygon(pg, [square.centerBottom, square.bottomRight, square.centerRight], X, Y);
                break;
            case 3:
                this.draw_polygon(pg, [square.centerLeft, square.bottomLeft, square.bottomRight, square.centerRight], X, Y);
                break;
            case 4:
                this.draw_polygon(pg, [square.centerTop, square.topRight, square.centerRight], X, Y);
                break;
            case 5:
                this.draw_polygon(pg, [square.centerTop, square.topRight, square.centerRight, square.centerBottom, square.bottomLeft, square.centerLeft], X, Y);
                break;
            case 6:
                this.draw_polygon(pg, [square.centerTop, square.topRight, square.bottomRight, square.centerBottom], X, Y);
                break;
            case 7:
                this.draw_polygon(pg, [square.centerLeft, square.bottomLeft, square.bottomRight, square.topRight, square.centerTop], X, Y);
                break;
            case 8:
                this.draw_polygon(pg, [square.topLeft, square.centerTop, square.centerLeft], X, Y);
                break;
            case 9:
                this.draw_polygon(pg, [square.topLeft, square.centerTop, square.centerBottom, square.bottomLeft], X, Y);
                break;
            case 10:
                this.draw_polygon(pg, [square.topLeft, square.centerTop, square.centerRight, square.bottomRight, square.centerBottom, square.centerLeft], X, Y);
                break;

            case 11:
                this.draw_polygon(pg, [square.topLeft, square.centerTop, square.centerRight, square.bottomRight, square.bottomLeft], X, Y);
                break;

            case 12:
                this.draw_polygon(pg, [square.topLeft, square.topRight, square.centerRight, square.centerLeft], X, Y);
                break;

            case 13:
                this.draw_polygon(pg, [square.topLeft, square.topRight, square.centerRight, square.centerBottom, square.bottomLeft], X, Y);
                break;

            case 14:
                this.draw_polygon(pg, [square.topLeft, square.topRight, square.bottomRight, square.centerBottom, square.centerLeft], X, Y);
                break;
            default:
                break;
        }
    }
    draw_polygon(pg, points, X, Y) {
        pg.beginShape();
        for (let p of points) {
            pg.vertex(X(p), Y(p));
        }
        pg.endShape(pg.CLOSE);
    }
    _Set_color( pg , type, c){
        switch (type) {
            case 0:
                pg.fill(c); break;
            case 1:
                pg.fill(48, 60, 230); break;
            case 2:
                pg.fill(155, 48, 230); break;
            case 3:
                pg.fill(48, 117, 230); break;
            case 4:
                pg.fill(97, 97, 97); break;
            case 5:
                pg.fill(46, 46, 46); break;
            case 6:
                pg.fill(127, 128, 0); break;
            case 7:
                pg.fill(48, 178, 230); break;
            case 8:
                pg.fill(63, 0, 0); break;
            case 9:
                pg.fill(99, 0, 0); break;
            case 10:
                pg.fill(201, 115, 185); break;
            case 11:
                pg.fill(161, 91, 148); break;
            default:
                pg.fill(229, 229, 229);
        }
    }

    getWallCell() {
        return this.WallCell;
    }


    *startRise(board,  OnEnd , OnLine ) {
        this.isActive = true;
        this._set_Board(board);

        for (let i = this.riseStep; i > 0; i--) {
            this.riseStep -= 1;
            yield *this.waitTimer.delay(10);
        }
        while (this.position.y < 720) {
            if(this.position.y < 672+20 && this.position.y > 672-20){
                OnLine(this);
            }
        
            this.move = true;
            yield;
        }
        this.isActive = false;
        OnEnd(this);
    
    }
    JudgePose(FullSkeleton) {
        const wallCells = this.getWallCell();
        const landmarks = FullSkeleton;
        if (!landmarks || landmarks.length === 0) return;

        const boxSize = this.getBoardWorldSize();
        const boxWidth = boxSize.x;
        const boxHeight = boxSize.y;

        // === 限制區域 ===
        const offsetX = 115.2;
        const offsetY = 105.6;
        const areaWidth = 849.6;
        const areaHeight = 566.4;

        for (const board of wallCells) {
            const nose = landmarks[0];
            const leftShoulder = landmarks[11];
            const rightShoulder = landmarks[12];
            if (nose && leftShoulder && rightShoulder) {
                const headX = offsetX + (1 - nose.x) * areaWidth;
                const headY = offsetY + nose.y * areaHeight;
                const neckX = offsetX + (1 - (leftShoulder.x + rightShoulder.x) / 2) * areaWidth;
                const neckY = offsetY + ((leftShoulder.y + rightShoulder.y) / 2) * areaHeight;

                const boxPosition = this.tileToWorld(board.x, board.y);
                if (this.p.collideLineRect(headX, headY, neckX, neckY, boxPosition.x, boxPosition.y, boxWidth, boxHeight)) {
                    return true;
                }
            }

            for (const [start, end] of PoseDrawer.connections) {
                const a = landmarks[start];
                const b = landmarks[end];
                if (!a || !b) continue;

                const x1 = offsetX + (1 - a.x) * areaWidth;
                const y1 = offsetY + a.y * areaHeight;
                const x2 = offsetX + (1 - b.x) * areaWidth;
                const y2 = offsetY + b.y * areaHeight;

                const boxPosition = this.tileToWorld(board.x, board.y);
                if (this.p.collideLineRect(x1, y1, x2, y2, boxPosition.x, boxPosition.y, boxWidth, boxHeight)) {
                    return true;
                }
            }
        }
        return false;
    }

}
