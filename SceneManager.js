import { SceneEnum } from "./SceneEnum.js"

import { MenuScene } from "./Scenes/MenuScene.js";
import { TutorialScene } from "./Scenes/TutoriaScene.js";
import { EasyGameScene } from "./Scenes/EasyGameScene.js";
import { HardGameScene } from './Scenes/HardGameScene.js';
import { ScoreScene } from "./Scenes/ScoreScene.js";




export class SceneManager {
    static instance = null
    constructor(p) {
        if(SceneManager.instance){
            return SceneManager.instance
        }



      this.scenes = new Map();
      this.scenes.set(SceneEnum.MENU, new MenuScene(p));
      this.scenes.set(SceneEnum.TUTORIAL, new TutorialScene(p));
      this.scenes.set(SceneEnum.EASY_GAME, new EasyGameScene(p));
      this.scenes.set(SceneEnum.HARD_GAME, new HardGameScene(p));
      this.scenes.set(SceneEnum.SCORE, new ScoreScene(p));

      this.currentScene = this.scenes.get(SceneEnum.MENU);
      SceneManager.instance = this

    }
  
    changeScene(sceneEnum) {
      if (!this.scenes.has(sceneEnum)) {
        throw new Error(`Scene ${sceneEnum} does not exist.`);
      }
      this.currentScene = this.scenes.get(sceneEnum);
      console.log(`Changed to ${sceneEnum}`);
    }
  
    update(delta) {
      if (this.currentScene) {
        this.currentScene.update(delta);
      }
    }
  
    draw() {
      if (this.currentScene) {
        this.currentScene.draw();
      }
    }
  }
  