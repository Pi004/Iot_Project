#include <ESP8266WiFi.h>

// WiFi credentials
const char* ssid = "Galaxy S20 FE 5G 83A1";
const char* password = "eiim4293";

// Motor control pins
const int pwm = D2;     // PWM pin (ENA)
const int in1 = D5;     // IN1
const int in2 = D6;     // IN2

WiFiServer server(80);

void setup() {
  Serial.begin(115200);

  // Motor pin setup
  pinMode(pwm, OUTPUT);
  pinMode(in1, OUTPUT);
  pinMode(in2, OUTPUT);
  stopMotor();

  // Connect to WiFi
  Serial.print("Connecting to WiFi");
  WiFi.begin(ssid, password);
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\nConnected!");
  Serial.print("IP Address: ");
  Serial.println(WiFi.localIP());

  server.begin(); // Start the server
}

void loop() {
  WiFiClient client = server.available();
  if (client) {
    String request = client.readStringUntil('\r');
    client.flush();

    // Simple command parsing
    if (request.indexOf("/f") != -1) {
      moveForward(255);
    } else if (request.indexOf("/b") != -1) {
      moveBackward(255);
    } else if (request.indexOf("/s") != -1) {
      stopMotor();
    }

    // Send basic HTML response
    client.println("HTTP/1.1 200 OK");
    client.println("Content-Type: text/html");
    client.println("");
    client.println("<html><body><h2>Motor Control</h2>");
    client.println("<a href=\"/f\">Forward</a><br>");
    client.println("<a href=\"/b\">Backward</a><br>");
    client.println("<a href=\"/s\">Stop</a><br>");
    client.println("</body></html>");
  }
}

// Motor control functions
void moveForward(int speed) {
  digitalWrite(in1, HIGH);
  digitalWrite(in2, LOW);
  analogWrite(pwm, speed);
}

void moveBackward(int speed) {
  digitalWrite(in1, LOW);
  digitalWrite(in2, HIGH);
  analogWrite(pwm, speed);
}

void stopMotor() {
  digitalWrite(in1, HIGH);
  digitalWrite(in2, HIGH);
  analogWrite(pwm, 0);
}