// Scenes/LeaderboardScene.js
import { IScene }                 from "./IScene.js";
import { DrawableText }           from "../Objects/DrawableObj/Text/DrawableText.js";
import { DrawableImage }          from "../Objects/DrawableObj/Game/DrawableImage.js";
import { LocalStorageController } from "../Data/LocalStorageController.js";
import { SceneEnum }              from "../SceneEnum.js";
import { SceneManager }           from "../SceneManager.js";
import { WIDTH, HEIGHT, ASSETS }  from "../G.js";
import { PoseTracker } from "../Objects/APIs/PoseTracker.js";
import { PoseHandler } from "../Objects/APIs/PoseHandler.js";
export class LeaderboardScene extends IScene {
  static instance = null;

  constructor(p) {
    if (LeaderboardScene.instance) return LeaderboardScene.instance;
    super(p);
    LeaderboardScene.instance = this;
    this.pose_handler = new PoseHandler(p);
      this.pose_image   = new DrawableImage(this.p);
    this.prevRightUp = false;
    this.func_to_Menu = () => {
      SceneManager.instance.changeScene(SceneEnum.MENU);
    };
    this.init();
  }

  init() {
    this.objects = [];

    // 背景
    this.bg = new DrawableImage(this.p);
    this.bg.setImage(ASSETS.leaderboardScene);
    this.bg.position.set(0, 0);
    this.bg.width  = WIDTH;
    this.bg.height = HEIGHT;
    this.add(this.bg);

    // 標題
    this.title = new DrawableText(this.p, "排行榜", 65);
    this.title.position.set(WIDTH/2, 50);
    this.title.textAlign = this.p.CENTER;
    this.add(this.title);

    // 左側：簡單模式
    this.easyTitle = new DrawableText(this.p, "簡單模式", 36);
    this.easyTitle.position.set(WIDTH*0.25 + 50, 140);
    this.easyTitle.textAlign = this.p.CENTER;
    this.add(this.easyTitle);

    // 右側：困難模式
    this.hardTitle = new DrawableText(this.p, "困難模式", 36);
    this.hardTitle.position.set(WIDTH*0.75, 140);
    this.hardTitle.textAlign = this.p.CENTER;
    this.add(this.hardTitle);

    // 各 5 列：頭像 + 文字
    this.easyRows = [];
    this.hardRows = [];
    for (let i = 0; i < 5; i++) {
      // 簡單模式
      const eImg = new DrawableImage(this.p);
      eImg.position.set(WIDTH*0.15, 200 + i*80);
      eImg.width  = eImg.height = 96;
      eImg.visible = false;
      this.add(eImg);

      const eTxt = new DrawableText(this.p, "", 24);
      eTxt.position.set(WIDTH*0.25, 200 + i*80 + 8);
      eTxt.textAlign = this.p.LEFT;
      this.add(eTxt);

      this.easyRows.push({ img: eImg, txt: eTxt });

      // 困難模式
      const hImg = new DrawableImage(this.p);
      hImg.position.set(WIDTH*0.65, 200 + i*80);
      hImg.width  = hImg.height = 96;
      hImg.visible = false;
      this.add(hImg);

      const hTxt = new DrawableText(this.p, "", 24);
      hTxt.position.set(WIDTH*0.75, 200 + i*80 + 8);
      hTxt.textAlign = this.p.LEFT;
      this.add(hTxt);

      this.hardRows.push({ img: hImg, txt: hTxt });
    }

    this.unsword = new DrawableImage(this.p);
    this.unsword.setImage(ASSETS.unsword);
    this.unsword.position.set(430, 150);
    this.unsword.width = 250;
    this.unsword.height = 375;
    this.add(this.unsword);

    this.sword = new DrawableImage(this.p);
    this.sword.setImage(ASSETS.sword);
    this.sword.position.set(430, 150);
    this.sword.width = 275;
    this.sword.height = 412;
    this.sword.visible = false;
    this.add(this.sword);

    this.t1 = new DrawableText(this.p, "右手舉起\n回到主畫面", 25);
    this.t1.position.set(WIDTH /2 - 50, 500);
    this.add(this.t1);
  }

  _on_enter() {
    const list = LocalStorageController.loadLeaderboard();

    // 分出兩組
    const easyList = list.filter(e => e.mode === 'easy');
    const hardList = list.filter(e => e.mode === 'hard');

    // 顯示簡單模式前 5 筆
    this.easyRows.forEach((row, i) => {
      const entry = easyList[i];
      if (entry) {
        row.txt.text = `${i+1}. ${entry.name} — ${entry.score}`;
        if (entry.portrait) {
          row.img.src     = this.p.loadImage(entry.portrait);
          row.img.visible = true;
        } else row.img.visible = false;
      } else {
        row.txt.text    = "";
        row.img.visible = false;
      }
    });

    // 顯示困難模式前 5 筆
    this.hardRows.forEach((row, i) => {
      const entry = hardList[i];
      if (entry) {
        row.txt.text = `${i+1}. ${entry.name} — ${entry.score}`;
        if (entry.portrait) {
          row.img.src     = this.p.loadImage(entry.portrait);
          row.img.visible = true;
        } else row.img.visible = false;
      } else {
        row.txt.text    = "";
        row.img.visible = false;
      }
    });
  }

  _on_update(_delta) {
    this.pose_handler.update(_delta)
    this.pose_image.src = PoseTracker.get_instance(this.p).getVideo();
    const tracker = PoseTracker.get_instance(this.p);
    const isRightUp  = tracker.get_is_righ_hand_up();
    if (isRightUp && !this.prevRightUp) {
      ASSETS.ace.play();
    }
    this.prevRightUp = isRightUp;
    this.unsword.visible = !isRightUp;
    this.sword.visible =  isRightUp;
    if(this.pose_handler.is_righ_counter_reached()){
      this.func_to_Menu()
    }
  }
}
