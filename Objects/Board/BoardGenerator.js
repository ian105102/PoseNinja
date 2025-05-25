import { Board } from './Board.js';
/*
    type: 1 = 正常, 0 = 障礙物
    BoardGenerator 負責生成棋盤格子，並隨機產生一塊板
    generateTestBoard 用於測試，產生半個完整的棋盤

*/
export class BoardGenerator {
    constructor() {
        this.Boards = [];
        this.cols = 30;
        this.rows = 20;

        // 初始化 Board 網格
        for (let i = 0; i < this.cols; i++) {
            let row = [];
            for (let j = 0; j < this.rows; j++) {
                row.push(new Board(i,j));
            }
            this.Boards.push(row);
        }
    }

    // 隨機產生一塊板
    generateBoard() {
        let headX = Math.floor(Math.random() * (this.cols - 16)) + 8;
        let headY = Math.floor(Math.random() * (13 - 3)) + 3;
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                this.Boards[i][j].type = 0; 
            }
        }
        const isValid = (x, y) => x >= 0 && x < this.cols && y >= 0 && y < this.rows;

        if (isValid(headX, headY)) {
            this.drawCircleOnBoard(headX, headY, 7);
        }

        if (isValid(headX + 8, headY + 7) && isValid(headX - 8, headY + 7)) {
            let shoulderRightX = headX + 5;
            let shoulderRightY = headY + 7 + this.randomRangeInt(-2, 2);
            let shoulderLeftX = headX - 5;
            let shoulderLeftY = headY + 7 + this.randomRangeInt(-2, 2);
            this.drawLineOnBoard(shoulderLeftX, shoulderLeftY, shoulderRightX, shoulderRightY);
        }
    }

    // 測試用產生整個滿板
    generateTestBoard() {
        for (let i = 0; i < this.cols; i++) {
            for (let j = 0; j < this.rows; j++) {
                if( i < this.cols*4/5) {
                    this.Boards[i][j].type = 1;
                }else{
                    this.Boards[i][j].type = 0;
                }
              
            }
        }

    }

    // 在棋盤上畫圓形（預設 type = 1）
    drawCircleOnBoard(centerX, centerY, diameter, type = 1) {
        let radius = Math.floor(diameter / 2);
        for (let dx = -radius; dx <= radius; dx++) {
            for (let dy = -radius; dy <= radius; dy++) {
                if (dx * dx + dy * dy <= radius * radius + 1) {
                    let x = centerX + dx;
                    let y = centerY + dy;
                    if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
                        this.Boards[x][y].type = type;
                    }
                }
            }
        }
    }

    // 畫線並呼叫 add9Grid 塗色
    drawLineOnBoard(x0, y0, x1, y1, type = 1) {
        let dx = Math.abs(x1 - x0);
        let dy = Math.abs(y1 - y0);
        let sx = x0 < x1 ? 1 : -1;
        let sy = y0 < y1 ? 1 : -1;
        let err = dx - dy;

        while (true) {
            this.add9Grid(x0, y0, type);
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

    // 將中心點周圍 3x3 區域填上指定 type
    add9Grid(x, y, type = 1) {
        for (let dx = -1; dx <= 1; dx++) {
            for (let dy = -1; dy <= 1; dy++) {
                let nx = x + dx;
                let ny = y + dy;
                if (nx >= 0 && nx < this.cols && ny >= 0 && ny < this.rows) {
                    this.Boards[nx][ny].type = type;
                }
            }
        }
    }

    // 回傳隨機整數（含 min 與 max）
    randomRangeInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    // 取得完整的棋盤物件
    getBoard() {
        return this.Boards;
    }
}
