#include <Servo.h>

Servo servo1;
Servo servo2;

int servoPos1 = 0;
int servoPos2 = 0;

void setup() {

  Serial.begin(9600);

  servo1.attach(9);
  servo2.attach(10);

  servo1.write(0);
  servo2.write(0);

  delay(15);
}

void loop() {

  openSlot(servo1, servoPos1);
  openSlot(servo2, servoPos2);
  delay(1000);

  closeSlot(servo1, servoPos1);
  closeSlot(servo2, servoPos2);

  delay(1000);

  // Do crazy shit here
  while(Serial.available()) {

    int servo = Serial.read();

    if(Serial.read() == '\n') {

    }
  }

}

void openSlot(Servo &servo, int &pos) {
  servo.write(128);
  delay(15);
}

void closeSlot(Servo &servo, int &pos) {
  servo.write(0);
  delay(15);
}

