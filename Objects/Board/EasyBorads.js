import { IObject } from "../../Objects/IObject.js"
import { GeneratorManager } from "../Utils/GeneratorManager.js";
import {BoardGenerator } from "./BoardGenerator.js";
import { EasyBoard } from "./EasyBoard.js";
/*
    處理多個 EasyBoard 的管理
    負責生成 EasyBoard 並管理它們的生命周期
    
*/


export class EasyBorads extends IObject{
    constructor(p){
        super(p);
        this.position.x = 0;
        this.position.y = 0;
        this.easyBoardList = [];
        this.reusableStack = [];

        this.generatorManaer = new GeneratorManager();
        this.boardGenerator = new BoardGenerator();
    }
    add_board(){
        let board;
        if (this.reusableStack.length > 0) {
            board = this.reusableStack.pop(); 
        } else {
            board = new EasyBoard(this.p); 
            this.easyBoardList.push(board); 
        }
        this.boardGenerator.generateTestBoard();
        this.generatorManaer.start(board.startRise( 
        this.boardGenerator.getBoard(),
        ()=>{
            this.reusableStack.push(board); 
            this.add_board();
        }));    
    }

    _on_update(delta){
        this.generatorManaer.update();
        this.easyBoardList.forEach(board => {
            board.update(delta);
        });
        console.log(this.generatorManaer.generators.size);
        console.log(this.easyBoardList.length);
    }

    
    _on_draw(){
        this.easyBoardList.forEach(board => {
            board.draw();
        });
        
    }


    update_collider(){
        
    }
}