const video = document.getElementById('video');
const container = document.getElementById('pedal_listener');

// ##################### LOCAL KEY LISTENER ##########################

// Envia um comando para o servidor
container.addEventListener('keydown', async (event) => {
    const key = event.key.toLowerCase();
    if (key === 'w' || key === 's' || key === 'a' || key === 'd') {
        console.log('Tecla pressionada:', key);
    }
});

// ##################### LOCAL VIDEO STREAM ##########################

// código para enviar o stream de video para a tag id="image_subscriber" class="fpv__cam" width="510" height="360"

