#include <Arduino.h>

// Pinos conectados a ponte H
int inputPin1 = D2;
int inputPin2 = D3;

int enablePin1 = D0; 

int pedal = 100; //0-100%
int sentido = 1; //1: foward 0: stop -1: backward

void setup() {
  pinMode(inputPin1, OUTPUT);
  pinMode(inputPin2, OUTPUT);
  pinMode(inputPin3, OUTPUT);
  pinMode(inputPin4, OUTPUT);

  pinMode(enablePin1, OUTPUT);
  pinMode(enablePin2, OUTPUT);

  Serial.begin(9600);
}

void loop() {
  if (Serial.available() > 0) {
  float novoPedal = Serial.parseInt();
  if (novoPedal >= 0 && novoPedal <= 100) {
    pedal = novoPedal;
    //Serial.print("Pedal atualizado para ");
    //Serial.print(pedal);
    //Serial.println("%");
  }
}
//  if (pedal < 0 && sentido >= 0){sentido = -1;}
//  else if (pedal > 0 && sentido <=0){sentido = 1;}
//  else if (pedal = 0 && sentido != 0){sentido = 0;}
//  int valorenable1 = analogRead(D0);
//  int valorenable2 = analogRead(D1);
//  Serial.print(valorenable1);
//  Serial.print(",");
//  Serial.print(valorenable2);
//  Serial.println();
  if (sentido == 0){
    digitalWrite(inputPin1, LOW);
    digitalWrite(inputPin2, LOW);
    digitalWrite(enablePin1, LOW);

    // Rotaciona o motor 2 no sentido anti-horário
    digitalWrite(inputPin3, LOW);
    digitalWrite(inputPin4, LOW);
    digitalWrite(enablePin2, LOW);
  }

  else if (sentido == 1){
    digitalWrite(inputPin1, HIGH);
    digitalWrite(inputPin2, LOW);
    analogWrite(enablePin1, abs(pedal)*2.55); // converte 0-100% para 0-255

    // Rotaciona o motor 2 no sentido anti-horário
    digitalWrite(inputPin3, HIGH);
    digitalWrite(inputPin4, LOW);
    analogWrite(enablePin2, abs(pedal)*2.55); // converte 0-100% para 0-255
  }

  else{
    digitalWrite(inputPin1, HIGH);
    digitalWrite(inputPin2, LOW);
    analogWrite(enablePin1, abs(pedal)*2.55); // converte 0-100% para 0-255

    // Rotaciona o motor 2 no sentido anti-horário
    digitalWrite(inputPin3, HIGH);
    digitalWrite(inputPin4, LOW);
    analogWrite(enablePin2, abs(pedal)*2.55); // converte 0-100% para 0-255
  }

}


