
// import { Board } from './Board.js';
import { WIDTH } from "../../G.js";
import { HEIGHT } from "../../G.js";
import { Cell } from './Cell.js';
/*
    type: 1 = 正常, 0 = 障礙物
    BoardGenerator 負責生成棋盤格子，並隨機產生一塊板
    generateTestBoard 用於測試，產生半個完整的棋盤

*/
export class BoardGenerator {
    constructor(p, keypointDataList) {
        this.p = p;
        this.cols = 60;
        this.rows = 40;
        this.pgWidth = 849.6;
        this.pgHeight = 566.4;
        
        this.offsetX = (WIDTH - this.pgWidth) / 2;
        this.offsetY = (HEIGHT - this.pgHeight) / 2;
        this.cellW = this.pgWidth / this.cols;
        this.cellH = this.pgHeight / this.rows;

        this.keypointDataList = keypointDataList;
    
        this.torso = [[11, 12], [23, 24], [11, 23], [12, 24]]
        this.leftHand = [[11, 13], [13, 15]];
        this.rightHand = [[12, 14], [14, 16]];
        this.torsoIndices = [11, 12, 24, 23];
        this.leftPalm = [17, 19, 21];
        this.rightPalm = [18, 20, 22];
        this.leftLeg = [[23, 25], [25, 27], [27, 29]];
        this.rightLeg = [[24, 26], [26, 28], [28, 30]];
        this.leftSole = [[29, 31]];
        this.rightSole = [[30, 32]];
    }

    generateBoard(){
        this.Boards = []; 
        this.points = [];
        // 初始化 Board 網格
        for (let i = 0; i < this.cols; i++) {
            let row = [];
            for (let j = 0; j < this.rows; j++) {
                row.push(new Cell(i,j));
            }
            this.Board.push(row);
        }

        // 隨機從資料中拿取一個
        this.keypoints = this.keypointDataList[this.p.floor(this.p.random(this.keypointDataList.length))];
        console.log("this.keypoints: ", this.keypoints); // 確認資料

        // 將物件轉陣列
        this.originalPts = Object.values(this.keypoints);

        if (!Array.isArray(this.originalPts)) {
            console.error("關鍵點資料格式錯誤，請確認 JSON 結構");
            return;
        }

        // 映射至板子內部（座標轉為實際像素位置）
        this.pts = this.originalPts.map(pt => {
            return {
                x: this.offsetX + pt.x * this.pgWidth,
                y: this.offsetY + pt.y * this.pgHeight
            };
        });
        
        // 脖子為1
        const head = this.pts[0];
        const leftShoulder = this.pts[11];
        const rightShoulder = this.pts[12];

        if (
        head && typeof head.x === 'number' && typeof head.y === 'number' &&
        leftShoulder && typeof leftShoulder.x === 'number' && typeof leftShoulder.y === 'number' &&
        rightShoulder && typeof rightShoulder.x === 'number' && typeof rightShoulder.y === 'number'
        ) {
            // 計算肩膀中心點
            const neckX = (leftShoulder.x + rightShoulder.x) / 2;
            const neckY = (leftShoulder.y + rightShoulder.y) / 2;

            // 將頭點與脖子點轉成網格座標
            const headGridX = Math.floor((head.x - this.offsetX) / this.cellW);
            const headGridY = Math.floor((head.y - this.offsetY) / this.cellH) - 2;

            const neckGridX = Math.floor((neckX - this.offsetX) / this.cellW);
            const neckGridY = Math.floor((neckY - this.offsetY) / this.cellH) - 2;

            // 畫脖子線（在 Boards 上標記）
            this.drawLineOnBoard(headGridX, headGridY, neckGridX, neckGridY, 1);
        }

        // 軀幹為2
        const polygon = this.torsoIndices.map(idx => {
            const pt = this.pts[idx];
            return pt ? [
                (pt.x - this.offsetX) / this.cellW,
                (pt.y - this.offsetY) / this.cellH - 2
            ] : null;
        }).filter(Boolean);

        if (polygon.length === 4) {
            for (let i = 0; i < this.cols; i++) {
                for (let j = 0; j < this.rows; j++) {
                    const cx = i + 0.5;
                    const cy = j + 0.5;
                    if (this.pointInPolygon([cx, cy], polygon)) {
                        this.Boards[i][j].type = 2;
                        this.points.push([i, j]);
                    }
                }
            }
        }
        this.drawFor(this.torso, 2);

        // 頭部為 3
        this.drawCircleMaskFromPoint(head, 9, 3); // 畫出頭部，直徑為9，值為 3

        // 左手臂為4
        this.drawFor(this.leftHand, 4);
        // 右手臂為5
        this.drawFor(this.rightHand, 5);

        // 計算手掌中心點
        const getPalmCenter = (indices) => {
            const p = indices
                .map(i => this.pts[i])
                .filter(pt => pt && typeof pt.x === 'number' && typeof pt.y === 'number');

            if (p.length === 0) return null;

            const avgX = p.reduce((sum, pt) => sum + pt.x, 0) / p.length;
            const avgY = p.reduce((sum, pt) => sum + pt.y, 0) / p.length;

            return { x: avgX, y: avgY };
        };

        const leftPalmCenter = getPalmCenter([17, 19, 21]);
        const rightPalmCenter = getPalmCenter([18, 20, 22]);
        // 左手掌為6
        this.drawCircleMaskFromPoint(leftPalmCenter, 5, 6); // 畫出左手掌，大小5，值為 6
        // 右手掌為7
        this.drawCircleMaskFromPoint(rightPalmCenter, 5, 7); // 畫出右手掌，大小5，值為 7
        
        // 左腿為8
        this.drawFor(this.leftLeg, 8);
        // 右腿為9
        this.drawFor(this.rightLeg, 9);

        // 左腳掌為10
        this.drawFor(this.leftSole, 10);
        // 右腳掌為11
        this.drawFor(this.rightSole, 11);

        for (let [x, y] of this.points) {
            if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
                if(this.Boards[x][y].type >= 12){
                    this.Boards[x][y].type = 12;
                }
            }
        }
    }

    // // 隨機產生一塊板
    // generateBoard() {
    //     let headX = Math.floor(Math.random() * (this.cols - 16)) + 8;
    //     let headY = Math.floor(Math.random() * (13 - 3)) + 3;
    //     for (let i = 0; i < this.cols; i++) {
    //         for (let j = 0; j < this.rows; j++) {
    //             this.Boards[i][j].type = 0; 
    //         }
    //     }
    //     const isValid = (x, y) => x >= 0 && x < this.cols && y >= 0 && y < this.rows;

    //     if (isValid(headX, headY)) {
    //         this.drawCircleOnBoard(headX, headY, 7);
    //     }

    //     if (isValid(headX + 8, headY + 7) && isValid(headX - 8, headY + 7)) {
    //         let shoulderRightX = headX + 5;
    //         let shoulderRightY = headY + 7 + this.randomRangeInt(-2, 2);
    //         let shoulderLeftX = headX - 5;
    //         let shoulderLeftY = headY + 7 + this.randomRangeInt(-2, 2);
    //         this.drawLineOnBoard(shoulderLeftX, shoulderLeftY, shoulderRightX, shoulderRightY);
    //     }
    // }

    // // 測試用產生整個滿板
    // generateTestBoard() {
    //     for (let i = 0; i < this.cols; i++) {
    //         for (let j = 0; j < this.rows; j++) {
    //             if( i < this.cols/2) {
    //                 this.Boards[i][j].type = 1;
    //             }else{
    //                 this.Boards[i][j].type = 0;
    //             }
    //         }
    //     }
    // }

    // 在棋盤上畫圓形（預設 type = 1）
    // drawCircleOnBoard(centerX, centerY, diameter, type = 1) {
    //     let radius = Math.floor(diameter / 2);
    //     for (let dx = -radius; dx <= radius; dx++) {
    //         for (let dy = -radius; dy <= radius; dy++) {
    //             if (dx * dx + dy * dy <= radius * radius + 1) {
    //                 let x = centerX + dx;
    //                 let y = centerY + dy;
    //                 if (x >= 0 && x < this.cols && y >= 0 && y < this.rows) {
    //                     this.Boards[x][y].type = type;
    //                 }
    //             }
    //         }
    //     }
    // }

    // 連骨架的線
    drawFor(arr, num){
        arr.forEach(([start, end]) => {
            const a = this.pts[start];
            const b = this.pts[end];
            if (a && b) {
                const x0 = this.p.floor((a.x - this.offsetX) / this.cellW);
                const y0 = this.p.floor((a.y - this.offsetY) / this.cellH) - 2;
                const x1 = this.p.floor((b.x - this.offsetX) / this.cellW);
                const y1 = this.p.floor((b.y - this.offsetY) / this.cellH) - 2;
                this.drawLineOnBoard(x0, y0, x1, y1, num);
            }
        });
    }

    // 畫圓
    drawCircleMaskFromPoint(point, size, value) {
        if (!point || typeof point.x !== 'number' || typeof point.y !== 'number') return;

        const halfSize = Math.floor(size / 2);
        const gridX = Math.floor((point.x - this.offsetX) / this.cellW);
        const gridY = Math.floor((point.y - this.offsetY) / this.cellH) - 2;

        const isValid = (x, y) => x >= 0 && x < this.cols && y >= 0 && y < this.rows;

        for (let dx = -halfSize; dx <= halfSize; dx++) {
        for (let dy = -halfSize; dy <= halfSize; dy++) {
            if (dx * dx + dy * dy <= halfSize * halfSize + 1) {
            const x = gridX + dx;
            const y = gridY + dy;
            if (isValid(x, y)) {
                this.Boards[x][y].type = value;
                this.points.push([x, y]);
            }
            }
        }
        }
    }

    // 軀幹中心也挖空判斷
    pointInPolygon(point, vs) {
        const [x, y] = point;
        let inside = false;
        for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
        const [xi, yi] = vs[i];
        const [xj, yj] = vs[j];
        const intersect = ((yi > y) !== (yj > y)) &&
            (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-5) + xi);
        if (intersect) inside = !inside;
        }
        return inside;
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
                    this.points.push([nx, ny]);
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
        return this.Board;
    }
}
