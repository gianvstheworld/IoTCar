const container = document.getElementById('pedal_listener');

// ##################### LOCAL KEY LISTENER ##########################

// Envia um comando para o servidor
container.addEventListener('keydown', async (event) => {
    const key = event.key.toLowerCase();
    if (key === 'w' || key === 's' || key === 'a' || key === 'd') {
        console.log('Tecla pressionada:', key);
    }
});

// ##################### OBJECT DETECTION ##########################
const videoElement = document.getElementById('video');
const canvasElement = document.getElementById('canvas');
const toggleDetectionCheckbox = document.getElementById('toggleDetection');
let isDetectionActive = false; // Define a detecção como ativa inicialmente

// Função para carregar o modelo COCO-SSD
async function loadModel() {
const model = await cocoSsd.load();
return model;
}

// Função para detectar objetos em um quadro de vídeo
async function detectObjects(video, model) {
const predictions = await model.detect(video);
return predictions;
}

// Função para desenhar as detecções no canvas
function drawBoundingBoxes(predictions, canvas) {
const context = canvas.getContext('2d');
const fontSize = 16;
const font = `${fontSize}px Arial`;
// Define uma matriz de cores
const colors = ['red', 'blue', 'green', 'orange', 'purple', 'pink'];
// Mapeia os objetos detectados para um ID único
const objectMap = new Map();
context.clearRect(0, 0, canvas.width, canvas.height);
// Desenha a imagem da câmera
context.drawImage(videoElement, 0, 0, canvas.width, canvas.height);
predictions.forEach((prediction, index) => {
    const objectId = prediction.class;
    // Verifica se o objeto já foi mapeado
    if (!objectMap.has(objectId)) {
    // Obtém a cor correspondente ao próximo índice disponível
    const color = colors[objectMap.size % colors.length];
    // Mapeia o objeto ao seu ID e à cor correspondente
    objectMap.set(objectId, color);
    }
    const color = objectMap.get(objectId);
    context.beginPath();
    context.lineWidth = '3';
    context.strokeStyle = color;
    context.fillStyle = color;
    context.rect(
    prediction.bbox[0],
    prediction.bbox[1],
    prediction.bbox[2],
    prediction.bbox[3]
    );
    context.font = font;
    // Desenha a caixa de fundo para o texto
    const textWidth = context.measureText(prediction.class).width;
    const textHeight = fontSize + 10;
    context.fillRect(
    prediction.bbox[0],
    prediction.bbox[1] > textHeight ? prediction.bbox[1] - textHeight : prediction.bbox[1] - 2 * textHeight,
    textWidth + 10,
    textHeight
    );
    // Define a cor do texto como branco
    context.fillStyle = 'white';
    context.fillText(
    `${prediction.class} (${Math.round(prediction.score * 100)}%)`,
    prediction.bbox[0],
    prediction.bbox[1] > fontSize ? prediction.bbox[1] - 5 : fontSize
    );
    context.stroke();
    context.closePath();
});
}

// Função principal para executar a detecção de objetos em tempo real
async function runObjectDetection() {
const model = await loadModel();

if (navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices.getUserMedia({ video: true })
    .then(stream => {
        videoElement.srcObject = stream;
        videoElement.onloadedmetadata = async () => {
        videoElement.play();
        const width = videoElement.videoWidth;
        const height = videoElement.videoHeight;
        canvasElement.width = width;
        canvasElement.height = height;
        const context = canvasElement.getContext('2d');
        const toggleDetectionHandler = () => {
            isDetectionActive = !isDetectionActive; // Inverte o estado da detecção
        };
    
        // Adiciona um event listener para detectar quando o checkbox for alterado
        toggleDetectionCheckbox.addEventListener('change', toggleDetectionHandler);
    
        const detectObjectsLoop = async () => {
            context.drawImage(videoElement, 0, 0, width, height);
            if (isDetectionActive) {
            const predictions = await detectObjects(videoElement, model);
            drawBoundingBoxes(predictions, canvasElement);
            }
            requestAnimationFrame(detectObjectsLoop); // Executa recursivamente a função para criar um loop contínuo
        };
    
        detectObjectsLoop(); // Inicia o loop de detecção de objetos
        };
    })
    .catch(error => {
        console.error('Erro ao acessar a câmera:', error);
        });
    } else {
        console.error('O getUserMedia não é suportado neste navegador.');
        }
    }

    // async function runObjectDetection() {
    //     const model = await loadModel();
    
    //     const videoUrl = 'https://34.230.31.207/index.html'; // URL do vídeo
    //     const videoElement = document.createElement('video');
    //     videoElement.src = videoUrl;
    //     videoElement.crossOrigin = 'anonymous'; // Define a propriedade crossOrigin para contornar as restrições de segurança do navegador, se necessário
    //     videoElement.autoplay = true;
    //     videoElement.muted = true;
    //     videoElement.style.display = 'none'; // Define o elemento de vídeo como oculto
    
    //     // Espera o evento 'loadeddata' ser disparado quando o vídeo estiver pronto para ser reproduzido
    //     await new Promise((resolve) => {
    //     videoElement.addEventListener('loadeddata', resolve);
    //     });
    
    //     const width = videoElement.videoWidth;
    //     const height = videoElement.videoHeight;
    //     canvasElement.width = width;
    //     canvasElement.height = height;
    //     const context = canvasElement.getContext('2d');
    
    //     const toggleDetectionHandler = () => {
    //     isDetectionActive = !isDetectionActive; // Inverte o estado da detecção
    //     };
    
    //     // Adiciona um event listener para detectar quando o checkbox for alterado
    //     toggleDetectionCheckbox.addEventListener('change', toggleDetectionHandler);
    
    //     const detectObjectsLoop = async () => {
    //     context.drawImage(videoElement, 0, 0, width, height);
    //     if (isDetectionActive) {
    //         const predictions = await detectObjects(videoElement, model);
    //         drawBoundingBoxes(predictions, canvasElement);
    //     }
    //     requestAnimationFrame(detectObjectsLoop); // Executa recursivamente a função para criar um loop contínuo
    //     };
    
    //     detectObjectsLoop(); // Inicia o loop de detecção de objetos
    // }




// Executa a função principal ao carregar a página
document.addEventListener('DOMContentLoaded', runObjectDetection);