import { IObject } from "../../Objects/IObject.js"
import { EasyBoard } from "./EasyBoard.js";


export class EasyBorads extends IObject{
    constructor(p){
        super(p);
        this.position.x = 0;
        this.position.y = 0;
        this.easyBoardList = [];
        this.reusableStack = [];

    }
    add_board(){
        let board;
        if (this.reusableStack.length > 0) {
            board = this.reusableStack.pop(); 
        } else {
            board = new EasyBoard(this.p); 
            this.easyBoardList.push(board); 
        }

    }


    _on_update(delta){

        this.easyBoardList.forEach(board => {
            console.log(delta);
            board.position.y = board.position.y + 0.05 *delta;
            board.scale.x =(board.position.y -192-48) *0.025+1;
            board.scale.y =(board.position.y -192-48) *0.025+1;

            if(board.position.y > 720){
                board.isActive = false; 
                this.reusableStack.push(board);
            }


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