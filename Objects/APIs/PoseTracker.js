/* Project: PoseTracker
  import poseTracker from '../PoseTracker.js';




*/ 
import { WIDTH } from "../../G.js";
import { HEIGHT } from "../../G.js";
export class PoseTracker {
  static #instance;
  #pose;

  constructor(p) {
    this.p = p
    if (PoseTracker.#instance) {
      return PoseTracker.#instance;
    }
    PoseTracker.#instance = this;

    this.#pose = new Pose({
      locateFile: (file) => `https://cdn.jsdelivr.net/npm/@mediapipe/pose/${file}`,
    });

    this.setOptions({
      modelComplexity: 0,
      smoothLandmarks: true,
      enableSegmentation: false,
      smoothSegmentation: true,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5
    });

    this.detections_pose = [];
    this.#pose.onResults((results) => this.gotPose(results));
    this.OnGetPose = function (results) {};

    this._init()
  }

  _init(){
    this.video = this.p.createCapture(this.p.VIDEO)
      .size(WIDTH, HEIGHT)
      .hide();
      // this.flippedGraphics = this.p.createGraphics(WIDTH, HEIGHT);
      this.myCamera = new Camera(this.video.elt, {
          onFrame: async () => {
              // 一開始鏡向有點太卡了，先不加
              // 將翻轉後的影像畫到離屏畫布
              // this.flippedGraphics.push();
              // this.flippedGraphics.translate(WIDTH, 0);   // 移動到畫布右邊
              // this.flippedGraphics.scale(-1, 1);          // 水平翻轉
              // this.flippedGraphics.image(this.video, 0, 0, WIDTH, HEIGHT);
              // this.flippedGraphics.pop();
      
              // 把鏡像後的畫面傳送給 PoseTracker
              console.log("send video to pose tracker")
              await PoseTracker.send(this.video.elt);
          },
          width: 1080,
          height: 720
      }).start();

  }

  update(){
    console.log(WIDTH,HEIGHT)
    this.p.image(this.video, 0, 0, WIDTH, HEIGHT);
    this.send(this.video.elt);
    this.drawSkeleton(this.getFullSkeleton());
  }

  setOptions(options) {
    this.#pose.setOptions(options);
  }

  async send(image) {
    await this.#pose.send({ image });
  }

  gotPose(results) {
    this.detections_pose = results.poseLandmarks || [];
    this.OnGetPose(results);
  }
  
  getFullSkeleton() {
    return this.detections_pose;
  }


  drawSkeleton(landmarks) {
        if (!landmarks || landmarks.length === 0) return;

        this.p.stroke(0, 255, 0);
        this.p.strokeWeight(2);
        this.p.noFill();

        // 🔗 可連接的骨架關係（骨頭連線），根據 MediaPipe Pose 定義
        const connections = [
            [11, 13], [13, 15],       // 左手
            [12, 14], [14, 16],       // 右手
            [11, 12],                 // 肩膀
            [23, 24],                 // 髖部
            [11, 23], [12, 24],       // 肩膀到髖部
            [23, 25], [25, 27],       // 左腳
            [24, 26], [26, 28],       // 右腳
            [27, 31], [28, 32],       // 腳掌
        ];

        for (const [start, end] of connections) {
            const a = landmarks[start];
            const b = landmarks[end];
            if (a && b) {
            this.p.line(a.x *WIDTH , a.y *HEIGHT , b.x *WIDTH, b.y *HEIGHT);
            }
        }

        // 畫出每個關鍵點
        this.p.fill(255, 0, 0);
        this.p.noStroke();
        for (const pt of landmarks) {
            this.p.ellipse(pt.x *WIDTH, pt.y *HEIGHT, 6, 6);
        }
    }
}
