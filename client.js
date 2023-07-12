const io = require('socket.io-client');
const SerialPort = require('serialport');

const port = new SerialPort('/dev/ttyACM0', { baudRate:9600});
const socket = io('http://34.207.147.164:3000/'); 

socket.on('connect', () => {
  console.log('Conectado ao servidor');

  socket.on('comando-teclado', (comando) => {
    console.log('Comando recebido:', comando);

    let comandoSerial = '0000';

    if (comando === 'w') {
      comandoSerial = '1000';
    } else if (comando === 's') {
      comandoSerial = '0100';
    } else if (comando === 'a') {
      comandoSerial = '0010';
    } else if (comando === 'd') {
      comandoSerial = '0001';
    }

    enviarComandoSerial(comandoSerial);
  });
});

socket.on('disconnect', () => {
  console.log('Desconectado do servidor');
});

async function enviarComandoSerial(comando) {
  await port.open(); 
  port.write(comando, (err) => {
    if (err) {
      console.error('Erro ao enviar comando:', err);
    } else {
      console.log('Comando enviado:', comando);
    }
    port.close();
  });
}
