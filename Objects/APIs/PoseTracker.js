/* Project: PoseTracker
  import poseTracker from '../PoseTracker.js';


  註：
    在此一開始就初始化，要保證兩個東西載入才能進行偵測
    - 一個是Camera(createCaputre)
    - 另一個是Mediapipe首次的gotPose

*/ 
import { WIDTH } from "../../G.js";
import { HEIGHT } from "../../G.js";
export class PoseTracker {
  static #instance;
  #pose;


  static get_instance(p){
    if(PoseTracker.#instance){
      return PoseTracker.#instance
    }else{
      //will assign to singlton
      return new PoseTracker(p)
    }
  }
  constructor(p) {
    this.flag = true
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
    this.OnGetPose = function (results) {


    };
    
    this._init()
    
    this.is_left_hand_up = false
    this.is_righ_hand_up = false
    this.is_doub_hand_up = false

  }

  get_is_left_hand_up(){
    return this.is_left_hand_up
  }

  get_is_righ_hand_up(){
   return this.is_righ_hand_up
  }

  get_is_doub_hand_up(){
    return this.is_doub_hand_up
  }

  _init(){
    this.video = this.p.createCapture(this.p.VIDEO)
      .size(WIDTH, HEIGHT)
      .hide();
      // this.flippedGraphics = this.p.createGraphics(WIDTH, HEIGHT);
      this.myCamera = new Camera(this.video.elt, {
          onFrame: async () => {
              //console.log("send video to pose tracker")
              await this.send(this.video.elt);
          },
          width: 1080,
          height: 720
      }).start();

  }

  update(){
    //console.log(this.video.loadedmetadata)
    //console.log(this.video.elt.readyState)
    if(this.video.loadedmetadata && this.poseReady){
      //this.p.image(this.video, 0, 0, WIDTH, HEIGHT);
      this.send(this.video.elt);
      this.drawSkeleton(this.getFullSkeleton());
    }
  }

  setOptions(options) {
    this.#pose.setOptions(options);
  }

  async send(image) {
    await this.#pose.send({ image });
  }

  gotPose(results) {
    this.detections_pose = results.poseLandmarks || [];

    if (!this.poseReady) {
      this.poseReady = true;
      //console.log("Pose is ready!");
    }
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

            //舉左手
            let left_shou = landmarks[11]
            let left_hand = landmarks[15]
            this.is_left_hand_up = false
            if(left_shou.y > left_hand.y){  //舉左手
                this.is_left_hand_up = true
            }

            
            let righ_shou = landmarks[12]
            let righ_hand = landmarks[16]
            this.is_righ_hand_up = false
            if(righ_shou.y > righ_hand.y){  //舉右手
                this.is_righ_hand_up = true
            }



            
            this.is_doub_hand_up = false
            if(this.is_left_hand_up && this.is_righ_hand_up){
              console.log("double hand up!")
              this.is_doub_hand_up = true
              this.is_left_hand_up = false
              this.is_righ_hand_up = false
              
            }

            
            else if(this.is_left_hand_up){
              console.log("left hand up!")
            }

            else if(this.is_righ_hand_up){
              console.log("right hand up!")
            }

            


            //舉雙手



        }

        // 畫出每個關鍵點
        this.p.fill(255, 0, 0);
        this.p.noStroke();
        for (const pt of landmarks) {
            this.p.ellipse(pt.x *WIDTH, pt.y *HEIGHT, 6, 6);
        }
        this.p.fill(0, 0, 0);
    }
}
