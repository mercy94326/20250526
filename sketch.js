let video;
let facemesh;
let predictions = [];

function setup() {
  createCanvas(640, 480).position(
    (windowWidth - 640) / 2,
    (windowHeight - 480) / 2
  );
  video = createCapture(VIDEO);
  video.size(width, height);
  video.hide();

  facemesh = ml5.facemesh(video, modelReady);
  facemesh.on('predict', results => {
    predictions = results;
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

    // 列印所有點位資訊（用於確認鼻尖位置）
    console.log(keypoints);

    // 在鼻尖（第168點）畫紅色圓，大小為50x50
    const [x, y] = keypoints[168];
    noFill();
    stroke(255, 0, 0);
    strokeWeight(4);
    ellipse(width - x, y, 50, 50); // 修正翻轉後的座標
  } else {
    console.log("沒有預測結果");
  }
}
