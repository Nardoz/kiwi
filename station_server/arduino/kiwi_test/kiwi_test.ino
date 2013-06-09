#include <Servo.h>

Servo servo1;
Servo servo2;

int servoPos1 = 0;
int servoPos2 = 0;

boolean buttonStatus1 = HIGH;
boolean buttonStatus2 = HIGH;


String inputString = "";        
boolean stringComplete = false; 

void setup() {

  Serial.begin(9600);

  servo1.attach(3);
  servo2.attach(5);

  pinMode(12, INPUT_PULLUP);
  pinMode(13, INPUT_PULLUP); 

  delay(15);
}

void loop() {

  if (digitalRead(12) == HIGH) {
      openSlot(servo1, servoPos1);
  } else {
      closeSlot(servo1, servoPos1);
  }

  if (digitalRead(13) == HIGH) {
      openSlot(servo2, servoPos2);
  } else {
      closeSlot(servo2, servoPos2);
  }  

  boolean digitalValue1 = digitalRead(12);
  if (buttonStatus1 != digitalValue1) {
      sendButtonStatus1();
      buttonStatus1 = digitalValue1;
  }

  boolean digitalValue2 = digitalRead(13);
  if (buttonStatus2 != digitalValue2) {
      sendButtonStatus2();
      buttonStatus2 = digitalValue2;
  }
 
   if(stringComplete) {
    
    Serial.println(inputString);
    
    inputString = "";
    stringComplete = false;

  }
  
}

void serialEvent() {
  while (Serial.available()) {
    char inChar = (char) Serial.read(); 

    if (inChar == '\n') {
      stringComplete = true;
      Serial.println("inputString");
    } else {
      inputString += inChar;
    }
  }
}

void openSlot(Servo &servo, int &pos) {
  servo.write(80);
  delay(15);
}

void closeSlot(Servo &servo, int &pos) {
  servo.write(0);
  delay(15);
}

void sendButtonStatus1(){
      if (buttonStatus1 == HIGH) {
        Serial.println("011");
      } else {
        Serial.println("010");
      }
}

void sendButtonStatus2(){
      if (buttonStatus2 == HIGH) {
        Serial.println("021");
      } else {
        Serial.println("020");
      }
}
