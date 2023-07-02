#include <Servo.h>

const int servoPin = 6;
const int pedalPin = A0;
int angle = 0;
Servo servo;

void setup() {
  pinMode(pedalPin, INPUT);
  servo.attach(servoPin);
  Serial.begin(9600);
}

void loop() {
  if (Serial.available()) {
    // Ler a entrada do monitor serial
    String input = Serial.readStringUntil('\n');
    angle = input.toInt();
    

    Serial.flush();
    
    Serial.print("angle = ");
    Serial.println(angle);
  }

  angle = analogRead(pedalPin);
  angle = map(angle, 0, 1023, 0, 180);
    servo.write(angle);
}
