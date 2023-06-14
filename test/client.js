const socket = io('http://54.146.220.33'); // Endereço do servidor Socket.IO

const link = document.getElementById('link');
const btn = document.getElementById('btn');

btn.addEventListener('click', async () => {
    const message = prompt('Digite uma mensagem:');
    if (message) {
        const response = await fetch('http://54.146.220.33/api', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message })
        });
        const data = await response.json();
        console.log(data.people);
        link.innerHTML = data.people;
    }
});

const video = document.getElementById('video');
const container = document.getElementById('container');

container.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'w' || key === 's' || key === 'a' || key === 'd') {
        console.log('Tecla pressionada:', key);
    }
});

btn.addEventListener('click', async () => {
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
});