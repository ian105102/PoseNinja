export class FaceIdentify {
  static #instance = null;
  static getInstance() {
    if (!FaceIdentify.#instance) FaceIdentify.#instance = new FaceIdentify();
    return FaceIdentify.#instance;
  }

  constructor() {
    this.modelsLoaded = false;
    this.faceMatcher = null;
  }

  async loadModels(modelUrl = './models') {
    await Promise.all([
      faceapi.nets.tinyFaceDetector.loadFromUri(modelUrl),
      faceapi.nets.faceLandmark68Net.loadFromUri(modelUrl),
      faceapi.nets.faceRecognitionNet.loadFromUri(modelUrl),
    ]);
    this.modelsLoaded = true;
  }

  // 註冊單張臉作為參考
  async register(name, imageElement, threshold = 0.6) {
    if (!this.modelsLoaded) throw new Error('Models not loaded');
    const res = await faceapi
      .detectSingleFace(imageElement, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (!res) throw new Error('No face detected');
    const labeled = new faceapi.LabeledFaceDescriptors(name, [res.descriptor]);
    this.faceMatcher = new faceapi.FaceMatcher([labeled], threshold);
  }
  // 辨識輸入圖：回傳 label、distance 和是否低於閾值的布林結果
  async identify(input) {
    if (!this.modelsLoaded) throw new Error('Models not loaded');
    if (!this.faceMatcher) throw new Error('No face registered');

    const res = await faceapi
      .detectSingleFace(input, new faceapi.TinyFaceDetectorOptions())
      .withFaceLandmarks()
      .withFaceDescriptor();
    if (!res) throw new Error('No face detected');

    const bestMatch = this.faceMatcher.findBestMatch(res.descriptor);
    return {
      label: bestMatch.label,         // 參考名稱或 "unknown"
      distance: bestMatch.distance,   // descriptor 距離
      isMatch: bestMatch.label !== 'unknown'
    };
  }
}
