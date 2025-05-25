import { IObject } from "../../IObject.js"


export class DrawableImage extends IObject{
    constructor(p){
        super(p)
        this.width = 100
        this.height = 400
        this.p = p
        this.src = null; // Placeholder for image resource
       
    }


    _on_update(delta){
  
    }

    
    _on_draw(){
 
        if(this.src) {
            this.p.image(this.src, 0, 0, this.width, this.height);
            
        }

    }


    update_collider(){
        
    }
}