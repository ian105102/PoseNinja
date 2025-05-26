import { WIDTH } from "../../G.js"
import { HEIGHT } from "../../G.js"
import { IObject } from "../IObject.js";
import { GeneratorManager, WaitTimer } from "../Utils/GeneratorManager.js";
import { Cell } from './Cell.js';
import { PoseDrawer } from "../DrawableObj/Game/PoseDrawer.js";
/*
    type: 1 = 正常, 0 = 障礙物
    負責渲染一塊板，並且處理移動動畫
*/
export class EasyBoard extends IObject {
    constructor(p) {
        super(p);

        this.width = 72;
        this.height = 48;
        this.riseStep = 47.9;

        this.scale.x = 1;
        this.scale.y = 1;

        this.position.x = WIDTH / 2;
        this.position.y = 192 + 48;

        this.waitTimer = new WaitTimer();

        this.color = this.p.color(242, 133, 0, 60);
        this.WallCell = [];
        // 建立板子遮擋邏輯
        this.Boards = [];
        this.cols = 10;
        this.rows = 10;
        for (let i = 0; i < this.cols; i++) {
            let row = [];
            for (let j = 0; j < this.rows; j++) {
                row.push(new Cell(i,j));
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

        this.WallCell = [];
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if(this.Boards[i][j].type == 0){
                    this.WallCell.push(this.Boards[i][j]);
                }
            }
        }
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
        if (this.move) {
            this.position.y = this.position.y + (15 * delta *this.scale.y);
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

    getWallCell() {
        return this.WallCell;
    }

    *startRise(board,  OnEnd , OnLine ) {
        this._setBoard(board );
       
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
