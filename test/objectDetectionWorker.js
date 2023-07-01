// objectDetectionWorker.js

importScripts('https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@3.9.0/dist/tf.min.js');
importScripts('https://cdn.jsdelivr.net/npm/@tensorflow-models/coco-ssd');

let model;

async function loadModel() {
    model = await cocoSsd.load();
}

async function detectObjects(video) {
    const predictions = await model.detect(video);
    return predictions;
}

onmessage = async (event) => {
    if (event.data === 'loadModel') {
    await loadModel();
    } else {
    const video = event.data;
    const predictions = await detectObjects(video);
    postMessage(predictions);
    }
};
