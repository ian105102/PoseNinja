
import { WIDTH } from "../../G.js"
import { HEIGHT } from "../../G.js"


export class EasyBoard{
    constructor(p) {
        this.p = p;
        this.x = (WIDTH/2)-36;  // 504
        this.y = 192;
        this.width = 72;
        this.height = 0;
        // this.color = this.color(229, 229, 229, 80);
        this.color = this.p.color(242, 133,0, 60);
        this.baseY = this.y + 48;

        this.riseSpeed = 1.2;
        this.moveSpeed = 1;
        
        this.judgePose = true;

        // 向量方向：P1 → P2
        let dx = 72 - 504;
        let dy = 720 - 240;
        let len = Math.sqrt(dx * dx + dy * dy);

        this.dirX = dx / len;
        this.dirY = dy / len;

        // 建立板子遮擋邏輯
        this.easyBoard = [];
        this.points = [];
        this.cols = 30;
        this.rows = 20;

        this.generateBoard();

        // 離屏畫布
        this.pg = this.p.createGraphics(849.6, 566.4);
        this.drawToCanvas(this.color); // 初始化畫面內容
    }

    generateBoard(){
        // 初始化矩陣
        for (let i = 0; i < this.cols; i++) {
            let row = [];
            for (let j = 0; j < this.rows; j++) {
                row.push(0);
            }
            this.easyBoard.push(row);
        }

        let headX = this.p.floor(this.p.random(8, this.cols - 8)); // 避免邊緣
        let headY = this.p.floor(this.p.random(3, 13));             // 限制高度在前半段
        console.log("headX: ", headX, ", headY: ", headY);

        // 安全性邊界檢查
        const isValid = (x, y) => x >= 0 && x < this.cols && y >= 0 && y < this.rows;

        console.log("head is valid: ", isValid(headX, headY));
        if(isValid(headX, headY)){
        let headSize = 7;
        let halfHeadSize = this.p.floor(headSize / 2);
        for (let dx = -halfHeadSize; dx <= halfHeadSize; dx++) {
            for (let dy = -halfHeadSize; dy <= halfHeadSize; dy++) {
                if (dx * dx + dy * dy <= halfHeadSize * halfHeadSize + 1) {
                    let x = headX + dx;
                    let y = headY + dy;
                    if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
                        // this.easyBoard[x][y] = 1;
                        this.points.push([x, y]);
                    }
                }
            }
        }
        } 

        if (isValid(headX+8, headY+7) && isValid(headX-8, headY+7)){
            console.log("OK");
            let shoulderRightX = headX+5;
            let shoulderRightY = headY+7+this.p.floor(this.p.random(-2, 2));
            let shoulderLeftX = headX-5;
            let shoulderLeftY = headY+7+this.p.floor(this.p.random(-2, 2));
            this.drawLineOnBoard(shoulderLeftX, shoulderLeftY, shoulderRightX, shoulderRightY);
        }


        for (let [x, y] of this.points) {
            if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
                this.easyBoard[x][y] = 1;
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
        // this.pg.noStroke();
        this.pg.stroke(0);

        // 範例：畫格子（可自行改畫其他內容）
        let cellW = this.pg.width / this.cols;
        let cellH = this.pg.height / this.rows;

        for (let i = 0; i < this.cols; i++) {
        for (let j = 0; j < this.rows; j++) {
            if(this.easyBoard[i][j] == 0){
            this.pg.fill(c); // 遮擋區域
            this.pg.rect(i * cellW, j * cellH, cellW, cellH);
            } else {
            this.pg.fill(229, 229, 229, 80); // 非遮擋格線
            this.pg.rect(i * cellW, j * cellH, cellW, cellH);
            }
        }
        }
    }

    changeColor(poseCorrectWrong){
        if(poseCorrectWrong){
        this.color = this.p.color(42, 157, 143, 60);
        } else {
        this.color = this.p.color(255, 0, 0, 60);
        }
        this.drawToCanvas(this.color); // 更新顏色後重畫
    }

    update(){
        if(this.height < 48){
            this.height += this.riseSpeed;
        }else {
            // 沿著方向移動
            this.x += this.dirX * this.moveSpeed;
            this.y += this.dirY * this.moveSpeed;
            this.width += 72 * 0.01855 * this.moveSpeed;
            this.height += 48 * 0.01855 * this.moveSpeed;
        }
    }

    display() {
        // 把畫布畫出來，按照當前位置與尺寸縮放
        this.p.image(this.pg, this.x, this.baseY - this.height, this.width, this.height);
        this.baseY = this.y + 48;
    }
}


