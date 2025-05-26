import { IScene } from "./IScene.js";
import { SceneEnum } from "../SceneEnum.js";
import { SceneManager } from "../SceneManager.js";
import { ASSETS } from "../G.js";
export class AssetScene extends IScene {
    constructor(p) {
        super(p);
        this.hasChangedScene = false;
    }

    preload() {
        ASSETS.btn_easy = this.p.loadImage("assets/easy.png");
        ASSETS.btn_hard = this.p.loadImage("assets/hard.png");
        ASSETS.btn_rule = this.p.loadImage("assets/rule.png");
        ASSETS.bg_menu = this.p.loadImage("assets/Menu.png");
        }


    draw() {
        this.p.background(0);
        this.p.fill(255);
        this.p.textAlign(this.p.CENTER, this.p.CENTER);
        this.p.textSize(32);
        this.p.text("載入中...", this.p.width / 2, this.p.height / 2);

        this.p.text(`已載入 ${this.loadedCount} / ${this.totalAssets}`, this.p.width / 2, this.p.height / 2 + 50);

        // ✅ 確保只切一次場景
        if (this.loadedCount === this.totalAssets && !this.hasChangedScene) {
            this.hasChangedScene = true;
            console.log("🎉 所有圖片載入完成，切換到 MENU");
            SceneManager.instance.changeScene(SceneEnum.MENU);
        }
    }
}

