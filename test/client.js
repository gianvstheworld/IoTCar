const video = document.getElementById('video');
const container = document.getElementById('container');

ipadress = "34.234.79.32"
urladress = "https://" + ipadress + "/api"

// Captura de vídeo e envio contínuo para o servidor
const startVideoStreaming = async () => {
  try {
    console.log('Acessando a webcam...');
    const mediaStream = await navigator.mediaDevices.getUserMedia({ video: true });
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
const textarea = document.getElementById('keyPress');
textarea.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    const command = textarea.value.trim(); // Obter o valor do textarea e remover espaços em branco extras
    if (command) {
      socket.emit('keyPress', command); // Enviar o comando para o servidor
      textarea.value = ''; // Limpar o textarea
    }
  }
});

// Inicialização do Socket.IO no cliente
const socket = io(urladress);

// Evento para iniciar o streaming de vídeo ao clicar no botão
const startStreamingBtn = document.getElementById('start-streaming-btn');
startStreamingBtn.addEventListener('click', startVideoStreaming);