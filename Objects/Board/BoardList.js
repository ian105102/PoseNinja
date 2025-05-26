import { IObject } from "../IObject.js"
import { GeneratorManager } from "../Utils/GeneratorManager.js";
import {BoardGenerator } from "./BoardGenerator.js";
import { Board } from "./Board.js";
/*
    處理多個 EasyBoard 的管理
    負責生成 EasyBoard 並管理它們的生命周期
    
*/


export class BoardList extends IObject{
    constructor(p, keypointDataList){
        super(p);
        this.position.x = 0;
        this.position.y = 0;
        this.easyBoardList = [];
        this.reusableStack = [];

        this.keypointDataList = keypointDataList;
        this.isLoop = false;


        this.generatorManaer = new GeneratorManager();
        this.boardGenerator = new BoardGenerator(this.p, this.keypointDataList);
    }
    clear(){
    
        this.easyBoardList.forEach(board => {
            board.isActive = false; 
            this.reusableStack.push(board);
        });
        this.easyBoardList = [];
        this.generatorManaer.clearAll();
    }
    add_board(onLine , onEnd){

        let board;
        if (this.reusableStack.length > 0) {
            board = this.reusableStack.pop(); 
            this.easyBoardList.push(board); 
          
        } else {
            board = new Board(this.p); 
            this.easyBoardList.push(board); 
        }
        this.boardGenerator.generateBoard();
        this.generatorManaer.start(
            board.startRise( 
                this.boardGenerator.getBoard(),
                (board)=>{
                    if(this.isLoop) {
                        this.add_board(onLine);
                    }
                    this.reusableStack.push(board);
                    this.easyBoardList = this.easyBoardList.filter(b => b !== board);
                    if(onEnd) {
                        onEnd(board);
                    }
                } ,
                (board)=>{
                    onLine(board);
                }
            )
        );    
        return board;
    }
    

    _on_update(delta){
        this.generatorManaer.update();
        this.easyBoardList.forEach(board => {
            board.update(delta);
        });
    }

    
    _on_draw(){
        this.easyBoardList.forEach(board => {
            board.draw();
        });
        
    }


    update_collider(){
        
    }
}