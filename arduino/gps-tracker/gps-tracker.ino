#include <SoftwareSerial.h>
#include <TinyGPS++.h>

// Define GSM module and GPS module communication
SoftwareSerial gsmSerial(7, 8); // GSM Module (RX, TX)
SoftwareSerial gpsSerial(3, 4); // GPS Module (RX, TX)

TinyGPSPlus gps;

const char* server = "http://your-server-ip:5000/update-location"; // Change this

void setup() {
    Serial.begin(115200);
    gsmSerial.begin(9600);
    gpsSerial.begin(9600);

    Serial.println("Initializing GSM...");
    sendCommand("AT");
    sendCommand("AT+CPIN?");
    sendCommand("AT+CREG?");
    sendCommand("AT+CGATT?");
    sendCommand("AT+CIPSHUT");
    sendCommand("AT+CSTT=\"your_apn\"");
    sendCommand("AT+CIICR");
    sendCommand("AT+CIFSR");
    Serial.println("GSM Initialized.");
}

void loop() {
    while (gpsSerial.available()) {
        if (gps.encode(gpsSerial.read())) {
            if (gps.location.isUpdated()) {
                float latitude = gps.location.lat();
                float longitude = gps.location.lng();
                Serial.print("Lat: "); Serial.print(latitude, 6);
                Serial.print(", Lon: "); Serial.println(longitude, 6);

                sendLocation(latitude, longitude);
            }
        }
    }
}

void sendLocation(float lat, float lon) {
    String postData = "latitude=" + String(lat, 6) + "&longitude=" + String(lon, 6);
    
    sendCommand("AT+CIPSTART=\"TCP\",\"your-server-ip\",\"5000\"");
    delay(2000);
    sendCommand("AT+CIPSEND");
    delay(2000);
    
    gsmSerial.print("POST /update-location HTTP/1.1\r\n");
    gsmSerial.print("Host: your-server-ip\r\n");
    gsmSerial.print("Content-Type: application/x-www-form-urlencoded\r\n");
    gsmSerial.print("Content-Length: " + String(postData.length()) + "\r\n\r\n");
    gsmSerial.print(postData);
    delay(1000);
    
    sendCommand("AT+CIPCLOSE");
}

void sendCommand(const char* command) {
    gsmSerial.println(command);
    delay(1000);
}
