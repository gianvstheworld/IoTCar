const socket = io();

function enviarComandoTeclado(comando) {
  socket.emit('comando-teclado', comando);
}
    
// document.addEventListener('keydown', (event) => {
//   const tecla = event.key.toLowerCase();
//   if (tecla === 'a' || tecla === 'w' || tecla === 's' || tecla === 'd') {
//     enviarComandoTeclado(tecla);
//   }
// });

// ##################### LOCAL KEY LISTENER ##########################
const container = document.getElementById('pedal_listener');

// Envia um comando para o servidor
container.addEventListener('keydown', (event) => {
    const key = event.key.toLowerCase();
    if (key === 'arrowup' || key === 'arrowdown' || key === 'arrowleft' || key === 'arrowright'){
        console.log('Tecla pressionada:', key);
        enviarComandoTeclado(key);
    }
});