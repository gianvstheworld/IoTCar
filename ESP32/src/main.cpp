#include <Arduino.h>

// Pinos conectados a ponte H
int inputPin1 = 16;
int inputPin2 = 17;
int inputPin3 = 18;
int inputPin4 = 19;

int enablePin1 = 21;
int enablePin2 = 22;

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
    // Rotaciona o motor 1 no sentido horário
    digitalWrite(inputPin1, HIGH);
    digitalWrite(inputPin2, LOW);
    digitalWrite(enablePin1, HIGH);

    // Rotaciona o motor 2 no sentido anti-horário
    digitalWrite(inputPin3, LOW);
    digitalWrite(inputPin4, HIGH);
    digitalWrite(enablePin2, HIGH);

    delay(1000);

    digitalWrite(inputPin1, HIGH);
    digitalWrite(inputPin2, LOW);
    digitalWrite(enablePin1, LOW);

    digitalWrite(inputPin3, LOW);
    digitalWrite(inputPin4, HIGH);
    digitalWrite(enablePin2, LOW);
}