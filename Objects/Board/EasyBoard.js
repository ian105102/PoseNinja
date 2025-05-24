
import { WIDTH } from "../../G.js"
import { HEIGHT } from "../../G.js"
import { IObject } from "../IObject.js";


export class EasyBoard extends IObject{
    constructor(p) {
        super(p);
        this.p = p;
        this.position.x = (WIDTH/2);  // 504
        this.position.y = 192+48;
        this.width = 72;
        this.height = 48;

        this.color = this.p.color(242, 133,0, 60);
        this.riseSpeed = 1.2;



        // 建立板子遮擋邏輯
        this.Boards = [];
        this.points = [];
        this.cols = 30;
        this.rows = 20;
        for (let i = 0; i < this.cols; i++) {
            let row = [];
            for (let j = 0; j < this.rows; j++) {
                row.push(new Board()); 
            }
            this.Boards.push(row);
        }
        this.generateBoard();

        // 離屏畫布
        this.pg = this.p.createGraphics(849.6, 566.4);
        this.drawToCanvas(this.color); // 初始化畫面內容
    }
    init(x = WIDTH / 2, y = 192 + 48, color = this.p.color(242, 133, 0, 60)) {
        this.position.x = x;
        this.position.y = y;

        this.color = color;

        this.riseSpeed = 1.2;
        this.points = [];
        for (let i = 0; i < this.cols; i++) {
            let row = [];
            for (let j = 0; j < this.rows; j++) {
                row.push(new Board()); 
            }
            this.Boards.push(row);
        }
        this.generateBoard();

        // 重新繪製到 buffer 畫布
        this.pg.clear();
        this.drawToCanvas(this.color);

        this.isActive = true; // 啟用狀態（方便物件池控制）
    }



    generateBoard(){
        let headX = this.p.floor(this.p.random(8, this.cols - 8));
        let headY = this.p.floor(this.p.random(3, 13));
        const isValid = (x, y) => x >= 0 && x < this.cols && y >= 0 && y < this.rows;

        if(isValid(headX, headY)){
            this.drawCircleOnBoard(headX, headY, 7);
        }

        if (isValid(headX+8, headY+7) && isValid(headX-8, headY+7)){
            let shoulderRightX = headX+5;
            let shoulderRightY = headY+7+this.p.floor(this.p.random(-2, 2));
            let shoulderLeftX = headX-5;
            let shoulderLeftY = headY+7+this.p.floor(this.p.random(-2, 2));
            this.drawLineOnBoard(shoulderLeftX, shoulderLeftY, shoulderRightX, shoulderRightY);
        }

        for (let [x, y] of this.points) {
            if (isValid(x, y)) {
                this.Boards[x][y].type = 1;
            }
        }
    }

    drawCircleOnBoard(centerX, centerY, diameter){
        let radius = this.p.floor(diameter / 2);
        for(let dx = -radius; dx <= radius; dx++){
            for(let dy = -radius; dy <= radius; dy++){
                if(dx * dx + dy * dy <= radius * radius + 1){
                    let x = centerX + dx;
                    let y = centerY + dy;
                    if(x >= 0 && x < this.cols && y >= 0 && y < this.rows){
                        this.points.push([x, y]);
                    }
                }
            }
        }
    }
    // 畫線用在 easyBoard 上
    drawLineOnBoard(x0, y0, x1, y1) {
        let dx = this.p.abs(x1 - x0);
        let dy = this.p.abs(y1 - y0);
        let sx = x0 < x1 ? 1 : -1;
        let sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        while (true) {
            this.add9Grid(x0, y0); // 擴展為9宮格

            if (x0 === x1 && y0 === y1) break;
            let e2 = 2 * err;
            if (e2 > -dy) {
                err -= dy;
                x0 += sx;
            }
            if (e2 < dx) {
                err += dx;
                y0 += sy;
            }
        }
    }

    add9Grid(x, y) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                let nx = x + dx;
                let ny = y + dy;
                if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                    this.points.push([nx, ny]);
                }
            }
        }
    }


    // 可自訂的離屏繪圖內容
    drawToCanvas(c) {
        this.pg.clear();
        this.pg.noStroke();
        // this.pg.stroke(0);

        // 範例：畫格子（可自行改畫其他內容）
        let cellW = this.pg.width / this.cols;
        let cellH = this.pg.height / this.rows;

        for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
            if(this.Boards[i][j].type == 0){
            this.pg.fill(c);
            } else {
            this.pg.fill(229, 229, 229, 80); 
            }
             this.pg.rect(i * cellW, j * cellH, cellW, cellH);
        }
        }
    }

    changeColor(poseCorrectWrong){
        if(poseCorrectWrong){
        this.color = this.p.color(42, 157, 143, 60);
        } else {
        this.color = this.p.color(255, 0, 0, 60);
        }
        this.drawToCanvas(this.color); 
    }

    _on_draw(){
        this.p.image(this.pg, -this.width/2, -48, this.width,48);
    }

    _on_update(delta){
    
    }


}


class Board{
    constructor() {
        this.type =0;
        this.color = "rgba(255, 245, 245, 0.57)";
    }
}