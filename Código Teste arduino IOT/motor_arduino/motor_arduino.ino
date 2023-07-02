#include <Servo.h>
// Definição dos pinos
const int pedalPin = A0;
const int directionPin = A1;
const int forwardEnablePin = 13;
const int backwardEnablePin = 12;
const int forwardPWMPin = 11;
const int backwardPWMPin = 10;
const int servoPin = 6;
Servo servo;

void setup() {
  // Configuração dos pinos como entrada ou saída
  pinMode(pedalPin, INPUT);
  pinMode(directionPin, INPUT);
  pinMode(forwardEnablePin, OUTPUT);
  pinMode(backwardEnablePin, OUTPUT);
  pinMode(forwardPWMPin, OUTPUT);
  pinMode(backwardPWMPin, OUTPUT);
  servo.attach(servoPin);  // Inicializa o objeto servo com o pino especificado
  Serial.begin(9600);  // Inicializa a comunicação serial
}

void loop() {
  // Leitura do potenciômetro (pedal)
  int pedalValue = analogRead(pedalPin); 

  int angle = map(pedalValue, 0, 1023, 0, 180);
  servo.write(angle);  // Define o ângulo do servo


  // Leitura da direção (Foward ou Backward)
  int speed = map(pedalValue, 0, 1023, 0, 255); // Mapeia o valor do potenciômetro para a faixa de 0 a 255

  // Leitura da direção (Sentido 0 ou 1)
  int direction = 0;//digitalRead(directionPin);
  
  // Controle da direção do motor
  if (direction == 0) {
    analogWrite(forwardPWMPin, speed); // Define a velocidade do PWM Foward
    analogWrite(backwardPWMPin, 0); // Define a velocidade do PWM Backward
  } 
  
  else {
    analogWrite(forwardPWMPin, 0); // Define a velocidade do PWM Foward
    analogWrite(backwardPWMPin, speed); // Define a velocidade do PWM Backward
  }
  
  // Controle da velocidade do motor
  digitalWrite(forwardEnablePin, HIGH); // Ativa o Forward_Enable
  digitalWrite(backwardEnablePin, HIGH); // Ativa o Backward_Enable
  
  //Print do potênciômetro

  Serial.print("Valor do potenciômetro: ");
  Serial.println(pedalValue);
  Serial.flush();  // Limpa o monitor serial antes de imprimir algo novo
}
