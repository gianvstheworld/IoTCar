const video = document.getElementById('video');
const container = document.getElementById('container');

ipadress = "54.174.214.53"
urladress = "https://" + ipadress + "/api"


// Captura de vídeo e envio contínuo para o servidor
const startVideoStreaming = async () => {
  try {
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = mediaStream;
    const mediaRecorder = new MediaRecorder(mediaStream);
    const chunks = []; // Array para armazenar os pedaços do vídeo

    mediaRecorder.ondataavailable = (event) => {
      if (event.data && event.data.size > 0) {
        chunks.push(event.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunks, { type: 'video/webm' });
      socket.emit('stream', blob); // Enviar o blob do vídeo pelo socket
      chunks.length = 0; // Limpar o array de pedaços do vídeo
    };

    mediaRecorder.start();

    // Parar o streaming de vídeo quando o usuário fechar a página
    window.addEventListener('beforeunload', () => {
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

container.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  if (key === 'w' || key === 's' || key === 'a' || key === 'd') {
    console.log('Tecla pressionada:', key);
  }
});

// Evento para enviar mensagem ao clicar no botão
const btn = document.getElementById('btn');
btn.addEventListener('click', () => {
  const message = prompt('Digite uma mensagem:');
  if (message) {
    sendMessage(message);
  }
});

// Inicialização do Socket.IO no cliente
const socket = io(urladress);

// Evento para iniciar o streaming de vídeo ao clicar no botão
const startStreamingBtn = document.getElementById('start-streaming-btn');
startStreamingBtn.addEventListener('click', startVideoStreaming);
