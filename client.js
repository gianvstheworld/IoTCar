const io = require('socket.io-client');
const { SerialPort, ReadlineParser } = require('serialport')

const port = new SerialPort({path: '/dev/ttyACM0', baudRate: 9600 });
const parser = new ReadlineParser();

const socket = io('http://204.236.195.167:3000/'); 

socket.on('connect', () => {
  console.log('Conectado ao servidor');

  socket.on('comando-teclado', (comando) => {
    console.log('Comando recebido:', comando);

    let comandoSerial = '0000';

    if (comando === 'arrowup') {
      comandoSerial = '1000';
    } else if (comando === 'arrowdown') {
      comandoSerial = '0100';
    } else if (comando === 'arrowleft') {
      comandoSerial = '0010';
    } else if (comando === 'arrowright') {
      comandoSerial = '0001';
    }

    enviarComandoSerial(comandoSerial);

    port.pipe(parser);
    parser.on('data', console.log);
  });
});

socket.on('disconnect', () => {
  console.log('Desconectado do servidor');
});

function enviarComandoSerial(comando) {
    port.write(comando, (err) => {
      if (err) {
        return console.error('Erro ao enviar comando:', err.message);
      }
      console.log('Comando enviado:', comando);
    });
  }