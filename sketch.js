let video;
let facemesh;
let handpose;
let predictions = [];
let handPredictions = [];
let gesture = ""; // 儲存手勢結果

function setup() {
  createCanvas(640, 480).position(
    (windowWidth - 640) / 2,
    (windowHeight - 480) / 2
  );
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  // 初始化 FaceMesh
  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on('predict', results => {
    predictions = results;
  });

  // 初始化 Handpose
  handpose = ml5.handpose(video, () => {
    console.log("Handpose 模型已載入");
  });
  handpose.on('predict', results => {
    handPredictions = results;
    detectGesture(); // 辨識手勢
  });
}

function modelReady() {
  console.log("FaceMesh 模型已載入");
}

function draw() {
  // 翻轉影像
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  if (predictions.length > 0) {
    const keypoints = predictions[0].scaledMesh;

    // 根據手勢移動圓圈到不同位置
    if (gesture === "剪刀") {
      // 額頭（第10點）
      const [x, y] = keypoints[10];
      drawCircle(width - x, y); // 修正翻轉後的座標
    } else if (gesture === "石頭") {
      // 左右眼睛（第33點和第263點）
      const [x1, y1] = keypoints[33];
      const [x2, y2] = keypoints[263];
      drawCircle(width - x1, y1); // 修正翻轉後的座標
      drawCircle(width - x2, y2); // 修正翻轉後的座標
    } else if (gesture === "布") {
      // 左右臉頰（第234點和第454點）
      const [x1, y1] = keypoints[234];
      const [x2, y2] = keypoints[454];
      drawCircle(width - x1, y1); // 修正翻轉後的座標
      drawCircle(width - x2, y2); // 修正翻轉後的座標
    }
  } else {
    console.log("沒有臉部預測結果");
  }
}

// 繪製圓圈的函式
function drawCircle(x, y) {
  noFill();
  stroke(255, 0, 0);
  strokeWeight(4);
  ellipse(x, y, 50, 50); // 繪製圓圈
}

// 辨識手勢的函式
function detectGesture() {
  if (handPredictions.length > 0) {
    const landmarks = handPredictions[0].landmarks;

    // 簡單的手勢辨識邏輯（剪刀、石頭、布）
    const thumbTip = landmarks[4]; // 大拇指尖端
    const indexTip = landmarks[8]; // 食指尖端
    const middleTip = landmarks[12]; // 中指尖端

    const distanceThumbIndex = dist(
      thumbTip[0],
      thumbTip[1],
      indexTip[0],
      indexTip[1]
    );
    const distanceIndexMiddle = dist(
      indexTip[0],
      indexTip[1],
      middleTip[0],
      middleTip[1]
    );

    if (distanceThumbIndex < 50 && distanceIndexMiddle < 50) {
      gesture = "石頭"; // 手指靠攏
    } else if (distanceThumbIndex > 50 && distanceIndexMiddle > 50) {
      gesture = "剪刀"; // 手指分開
    } else {
      gesture = "布"; // 手掌張開
    }

    console.log("辨識到手勢:", gesture);
  }
}
