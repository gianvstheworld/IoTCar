const video = document.getElementById('video');
const container = document.getElementById('container');

// Captura de vídeo e envio contínuo para o servidor
const startVideoStreaming = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
      video.srcObject = mediaStream;
  
      const mediaRecorder = new MediaRecorder(mediaStream);
      mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          socket.emit('stream', event.data);
        }
      };
      mediaRecorder.start();
    } catch (error) {
      console.error('Erro ao acessar a webcam:', error);
    }
  };

// Envia uma mensagem para o servidor
const sendMessage = async (message) => {
  try {
    const response = await fetch('https://3.92.25.156/api', {
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

// Evento para iniciar o streaming de vídeo ao clicar no botão
const startStreamingBtn = document.getElementById('start-streaming-btn');
startStreamingBtn.addEventListener('click', startVideoStreaming);
