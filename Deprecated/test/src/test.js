const video = document.getElementById('video');
const container = document.getElementById('container');

ipadress = "50.17.88.134"
urladress = "https://" + ipadress + "/api"

// ######################### OBJECT DETECTION #######################
// ##################################################################


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
  const videoElement = document.getElementById('video');
  const fontSize = 16
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

// ##################################################################

async function startObjectDetection(videoElement, canvasElement) {
  const model = await loadModel();

  const width = videoElement.videoWidth;
  const height = videoElement.videoHeight;
  canvasElement.width = width;
  canvasElement.height = height;
  const context = canvasElement.getContext('2d');

  setInterval(async () => {
      context.drawImage(videoElement, 0, 0, width, height);
      const predictions = await detectObjects(videoElement, model);
      drawBoundingBoxes(predictions, canvasElement);
  }, 1000 / 30); // Executa a detecção a cada 30 quadros por segundo
}

async function runObjectDetection() {
  const videoElement = document.getElementById('video');
  const canvasElement = document.getElementById('canvas');
  await startObjectDetection(videoElement, canvasElement);
}

// Captura de vídeo e envio contínuo para o servidor
const startVideoStreaming = async () => {
  try {
    console.log('Acessando a webcam...');
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    const videoElement = document.getElementById('video');
    const canvasElement = document.getElementById('canvas');
    video.srcObject = mediaStream;
    const mediaRecorder = new MediaRecorder(mediaStream);
    const chunks = []; // Array para armazenar os pedaços do vídeo

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        console.log('Enviando pedaço do vídeo:', event.data);
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
        console.log('Enviando vídeo...');
        const blob = new Blob(chunks, { type: 'video/webm' });
        socket.emit('stream', blob); // Enviar o blob do vídeo pelo socket
        console.log('Vídeo enviado!');
        chunks.length = 0; // Limpar o array de pedaços do vídeo
    };

    // Iniciar o streaming de vídeo
    mediaRecorder.start();
    await startObjectDetection(videoElement, canvasElement)

    // Parar o streaming de vídeo quando o usuário fechar a página
    window.addEventListener('beforeunload', () => {
        console.log('Parando o streaming de vídeo...');
        mediaRecorder.stop();
    });
    } catch (error) {
    console.error('Erro ao acessar a webcam:', error);
  }
};

// Envia uma mensagem para o servidor
const sendMessage = async (message) => {
    try {
    const response = await fetch(urladress, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ message })
    });
    const data = await response.json();
    console.log(data.success);
  } catch (error) {
    console.error('Erro ao enviar mensagem:', error);
  }
};

// Evento para enviar mensagem ao clicar no botão
const btn = document.getElementById('btn');
btn.addEventListener('click', () => {
  const message = prompt('Digite uma mensagem:');
  if (message) {
    sendMessage(message);
  }
});

// Envia um comando para o servidor
container.addEventListener('keydown', async (event) => {
    const key = event.key.toLowerCase();
    if (key === 'w' || key === 's' || key === 'a' || key === 'd') {
        console.log('Tecla pressionada:', key);
        await sendKeyPress(key);
    }
    });

async function sendKeyPress(key) {
    try {
        const response = await fetch(urladress, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ message: key })
        });
        const data = await response.json();
        console.log('Resposta do servidor:', data);
    } catch (error) {
        console.error('Erro ao enviar comando:', error);
    }
}

// Evento limpar ao pressionar Enter no textarea
const textarea = document.getElementByClass('keyPress');
textarea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const command = textarea.value.trim(); // Obter o valor do textarea e remover espaços em branco extras
    if (command) {
      socket.emit('keyPress', command); // Enviar o comando para o servidor
      textarea.value = ''; // Limpar o textarea
    }
  }
});

// ################### OBJECT DETECTION ###################


// ########################################################


// Inicialização do Socket.IO no cliente
const socket = io(urladress);

// Evento para iniciar o streaming de vídeo ao clicar no botão
const startStreamingBtn = document.getElementById('start-streaming-btn');
startStreamingBtn.addEventListener('click', startVideoStreaming);