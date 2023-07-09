#include <Servo.h>
// Definição dos pinos
const int forwardEnablePin = 12;
const int backwardEnablePin = 13;
const int forwardPWMPin = 11;
const int backwardPWMPin = 5;
const int servoPin = 6;
int forward = 0;
int backward = 0;
int left = 0;
int right = 0;
int count_left = 0;
int count_right = 0;
int speed = (255/100)*50;
int angle = 70;
int add_steer = 20;
int steer_0 = 70;
Servo servo;

void setup() {
  // Configuração dos pinos como entrada ou saída
  pinMode(forwardEnablePin, OUTPUT);
  pinMode(backwardEnablePin, OUTPUT);
  pinMode(forwardPWMPin, OUTPUT);
  pinMode(backwardPWMPin, OUTPUT);
  servo.attach(servoPin);  // Inicializa o objeto servo com o pino especificado
  Serial.begin(9600);  // Inicializa a comunicação serial
}

void loop() {
  // Ler a entrada do monitor serial
  String input = Serial.readStringUntil('\n');
    
  // Verificar se a entrada tem o formato correto
  if (input.length() == 4) {
    // Obter os valores individuais da entrada
    forward = input.charAt(0) - '0';  // Converter de caractere para inteiro
    backward = input.charAt(1) - '0';  // Converter de caractere para inteiro
    left = input.charAt(2) - '0';  // Converter de caractere para inteiro
    right = input.charAt(3) - '0';  // Converter de caractere para inteiro
      
    // Verificar se os valores estão dentro das faixas permitidas
    if ((forward == 0 || forward == 1) && (backward == 0 || backward == 1) &&
        (left == 0 || left == 1) && (right == 0 || right == 1)) {
    
      // Controle da velocidade do motor
      digitalWrite(forwardEnablePin, HIGH); // Ativa o Forward_Enable
      digitalWrite(backwardEnablePin, HIGH); // Ativa o Backward_Enable
        
      if (forward == 0 && backward == 1) {
        analogWrite(forwardPWMPin, 0); // Define a velocidade do PWM Forward
        analogWrite(backwardPWMPin, speed); // Define a velocidade do PWM Backward
      } else if (forward == 1 && backward == 0) {
        analogWrite(forwardPWMPin, speed); // Define a velocidade do PWM Forward
        analogWrite(backwardPWMPin, 0); // Define a velocidade do PWM Backward
      } else {
        analogWrite(forwardPWMPin, 0); // Define a velocidade do PWM Forward
        analogWrite(backwardPWMPin, 0); // Define a velocidade do PWM Backward
      }

      if (left == 1 && right == 0) {

        if (count_left < 2) {
          count_right--;
          count_left++;
        }
        angle = steer_0 - count_left * add_steer;
        servo.write(angle);
      } else if (left == 0 && right == 1) {
        if (count_right < 2) {
          count_left--;
          count_right++;
        }
        angle = steer_0 + count_right * add_steer;
        servo.write(angle);
      } else {
        servo.write(angle);
      }

      // Imprimir os valores definidos
      Serial.print("Forward: ");
      Serial.print(forward);
      Serial.print("\tBackward: ");
      Serial.print(backward);
      Serial.print("\tLeft: ");
      Serial.print(left);
      Serial.print("\tRight: ");
      Serial.println(right);
    } else {
      // Valores fora da faixa permitida
      Serial.println("Valores inválidos!");
    }
  } else {
    // Entrada inválida
    Serial.println("Entrada inválida!");
  }
}
