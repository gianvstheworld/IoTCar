# SEL0373 - Projetos em IoT

Bem-vindo(a) ao nosso projeto de Projetos em IoT!

Nesta disciplina, vamos explorar as tecnologias e metodologias para desenvolver projetos em IoT (Internet das Coisas).

## Apresentação do projeto

Pretende-se com este repositório fornecer os códigos e circuitos necessários para o projeto de um servidor que streama o vídeo da câmera de um carro controlado via Web.

## Motivação

Este projeto tem como objetivo proporcionar uma solução inovadora para o controle remoto de um carro por meio da Internet das Coisas. Ao criar um servidor que transmite o vídeo da câmera do carro, é possível controlá-lo de forma remota, o que pode ser útil em diversas aplicações, como inspeção de áreas de difícil acesso, entretenimento ou até mesmo fins educacionais.

## Nossa Implementação

### Mecânica

Na mecânica, vamos usar a estrutura mecânica de um carro de rádio controle, adaptado com peças de impressão 3D de filamento ABS verde, para proteger o carro e segurar os componentes elétricos.

### Parte Elétrica

Na parte elétrica, temos os seguintes componentes:

- Duas baterias LiPo 7.4V: Uma para alimentar o motor e outra para os circuitos de controle.

- Motor de 12V: Utilizado para propulsão do carro e veio junto com o kit.

- Ponte H BTS7960: Responsável pelo controle dos motores de tração.

- Switch: Conectado entre a ponte H e a bateria, permitindo ligar/desligar a alimentação dos motores.

### Parte de Controle

Na parte de controle, temos um Arduino que gerencia os PWMs e enables da ponte H, além de controlar o servo motor responsável pelo esterçamento das rodas. O Arduino recebe comandos por meio de comunicação serial com a Raspberry Pi 3.

### Parte de IoT

A parte de IoT consiste no seguinte fluxo de comunicação:

1. O usuário envia comandos para o carro por meio de uma página web.

2. O servidor recebe esses comandos e os envia para a Raspberry Pi.

3. A Raspberry Pi envia os comandos, via cabo serial, ao Arduino para controlar os motores e o servo motor.

4. A Raspberry Pi também captura a imagem da câmera dianteira do carro.

5. A imagem é enviada de volta ao servidor, que realiza o streaming da câmera do carro na página web.


### Media MTX

- Media MTX documentação: https://github.com/aler9/mediamtx
- Media MTX installation: https://github.com/aler9/mediamtx/releases 
