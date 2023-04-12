#include <Arduino.h>

// Motor A
int inputPin1 = 16;
int inputPin2 = 17;
int enablePin1 = 21;

// Motor B
int inputPin3 = 18;
int inputPin4 = 19;
int enablePin2 = 22;

// Propriedades do PWM 
const int freq = 3000;
const int pwmChannel = 0;
const int resolution = 0;
int duty_cycle = 200;

void setup() {
    pinMode(inputPin1, OUTPUT);
    pinMode(inputPin2, OUTPUT);
    pinMode(inputPin3, OUTPUT);
    pinMode(inputPin4, OUTPUT);

    pinMode(enablePin1, OUTPUT);
    pinMode(enablePin2, OUTPUT);

    // Configura o LED para as funcionalidades do PWM
    ledcSetup(pwmChannel, freq, resolution);

    // Liga o LED na porta 21
    ledcAttachPin(enablePin1, pwmChannel);

    Serial.begin(115200);
}

void loop() {
    Serial.println("Rotacionando motor 1 no sentido horário");
    digitalWrite(inputPin1, HIGH);
    digitalWrite(inputPin2, LOW);
    delay(2000);

    Serial.println("Motor parado");
    digitalWrite(inputPin1, LOW);
    digitalWrite(inputPin2, LOW);
    delay(1000);

    Serial.println("Rotacionando motor 1 no sentido anti-horário");
    digitalWrite(inputPin1, LOW);
    digitalWrite(inputPin2, HIGH);
    delay(2000);

    Serial.println("Motor parado");
    digitalWrite(inputPin1, LOW);
    digitalWrite(inputPin2, LOW);
    delay(1000);

    Serial.println("Movendo motor 1 para frente aumentando a velocidade");
    digitalWrite(inputPin1, HIGH);
    digitalWrite(inputPin2, LOW);
    
    while(duty_cycle < 255) {
        duty_cycle = duty_cycle + 10;
        ledcWrite(pwmChannel, duty_cycle);
        delay(500);
    }
}