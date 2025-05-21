/* Project: PoseTracker
  import poseTracker from '../PoseTracker.js';




*/ 

class PoseTracker {
  static #instance;
  #pose;

  constructor() {
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
}

export default new PoseTracker();