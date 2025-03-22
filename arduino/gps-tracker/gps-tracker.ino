#include <SoftwareSerial.h>
#include <TinyGPS++.h>

// ==================== Define GSM and GPS Communication ====================
SoftwareSerial gsmSerial(7, 8); // GSM Module (RX, TX)
SoftwareSerial gpsSerial(3, 4); // GPS Module (RX, TX)

TinyGPSPlus gps;

// ==================== User-Defined Variables ====================
String plateNumber = "ABC-1234";  // Default plate number
bool alcoholStatus = false;       // Default alcohol status
bool drowsinessStatus = false;    // Default drowsiness status
bool accidentStatus = false;      // Default accident status

// APN and Server IP initially empty, to be set via WebSocket
String APN = "jionet";
String server = "127.0.0.1";  // Default server IP
int port = 5000;                  // WebSocket Port

void setup() {
    Serial.begin(115200);
    gsmSerial.begin(9600);
    gpsSerial.begin(9600);

    Serial.println("Initializing GSM...");
    initializeGSM();         // Setup GSM and connect to WebSocket
    connectToWebSocket();    // Establish WebSocket connection
}

// ==================== Main Loop ====================
void loop() {
    while (gpsSerial.available()) {
        if (gps.encode(gpsSerial.read())) {
            if (gps.location.isUpdated()) {
                float latitude = gps.location.lat();
                float longitude = gps.location.lng();
                float speed = gps.speed.kmph();

                Serial.print("Lat: "); Serial.print(latitude, 6);
                Serial.print(", Lon: "); Serial.println(longitude, 6);

                sendLocation(latitude, longitude, speed);  // Send data to WebSocket
            }
        }
    }

    // Check for incoming WebSocket messages
    handleWebSocketMessages();
}

// ==================== GSM Initialization ====================
void initializeGSM() {
    sendCommand("AT");                // Check connectivity
    sendCommand("AT+CPIN?");          // Check SIM status
    sendCommand("AT+CREG?");          // Check network registration
    sendCommand("AT+CGATT?");         // Check GPRS status
    sendCommand("AT+CIPSHUT");        // Shut down previous connections

    // Set APN dynamically
    String apnCommand = "AT+CSTT=\"" + APN + "\"";
    sendCommand(apnCommand.c_str());
    
    sendCommand("AT+CIICR");          // Bring up wireless connection
    sendCommand("AT+CIFSR");          // Get IP address
    Serial.println("GSM Initialized.");
}

// ==================== Connect to WebSocket ====================
void connectToWebSocket() {
    String command = "AT+CIPSTART=\"TCP\",\"" + server + "\"," + String(port);
    sendCommand(command.c_str());
    delay(2000);
}

// ==================== Send GPS Location to WebSocket ====================
void sendLocation(float lat, float lon, float speed) {
    String jsonPayload = "{\"type\":\"GPSUpdate\",\"data\":{";
    jsonPayload.concat("\"latitude\":");
    jsonPayload.concat(String(lat, 6));
    jsonPayload.concat(",\"longitude\":");
    jsonPayload.concat(String(lon, 6));
    jsonPayload.concat(",\"speed\":");
    jsonPayload.concat(String(speed, 2));
    jsonPayload.concat(",\"plateNumber\":\"");
    jsonPayload.concat(plateNumber);
    jsonPayload.concat("\",\"alcoholStatus\":");
    jsonPayload.concat(alcoholStatus ? "true" : "false");
    jsonPayload.concat(",\"drowsinessStatus\":");
    jsonPayload.concat(drowsinessStatus ? "true" : "false");
    jsonPayload.concat(",\"accidentStatus\":");
    jsonPayload.concat(accidentStatus ? "true" : "false");
    jsonPayload.concat("}}");  // End of JSON
    sendCommand("AT+CIPSEND");
    delay(100);
    gsmSerial.print(jsonPayload);
    gsmSerial.write(26);  // CTRL+Z to end message
    delay(1000);
}

// ==================== Handle WebSocket Configuration Updates ====================
void handleWebSocketMessages() {
    if (gsmSerial.available()) {
        String message = gsmSerial.readString();

        // Check for "user" or "userRegistered" command in WebSocket message
        if ((message.indexOf("\"type\":\"user\"") > 0)||(message.indexOf("\"type\":\"userRegistered\"") > 0)) {
            updateConfig(message);
        }
    }
}

// ==================== Update Configuration ====================
void updateConfig(String message) {
    // Extract values from incoming WebSocket JSON message
    int apnIndex = message.indexOf("\"apn\":\"");
    int plateIndex = message.indexOf("\"plateNumber\":\"");

    // Parse new APN, server, and plate number
    if (apnIndex != -1) {
        APN = extractString(message, apnIndex + 7);
    }
    if (plateIndex != -1) {
        plateNumber = extractString(message, plateIndex + 15);
    }

    // Parse boolean values

    //alcoholStatus = (alcoholIndex != -1) ? extractBool(message, alcoholIndex + 16) : alcoholStatus;
    //drowsinessStatus = (drowsyIndex != -1) ? extractBool(message, drowsyIndex + 20) : drowsinessStatus;
    //accidentStatus = (accidentIndex != -1) ? extractBool(message, accidentIndex + 17) : accidentStatus;
    
    Serial.println("Updated Configuration:");
    Serial.println("APN: " + APN);
    Serial.println("Plate Number: " + plateNumber);

    // Reinitialize GSM and reconnect WebSocket with updated values
    initializeGSM();
    connectToWebSocket();

    // Send confirmation response back to WebSocket
    sendConfigUpdateResponse();
}

// ==================== Send Configuration Update Response ====================
void sendConfigUpdateResponse() {
    String jsonResponse = "{\"type\":\"configUpdate\",\"status\":\"success\",\"message\":\"Configuration updated successfully.\"}";
    
    sendCommand("AT+CIPSEND");
    delay(100);
    gsmSerial.print(jsonResponse);
    gsmSerial.write(26);  // CTRL+Z to end message
    delay(1000);
}

// ==================== Extract String from JSON Message ====================
String extractString(String message, int startIndex) {
    int endIndex = message.indexOf("\"", startIndex);
    return message.substring(startIndex, endIndex);
}

// ==================== Extract Boolean Value from JSON Message ====================
bool extractBool(String message, int startIndex) {
    String boolString = message.substring(startIndex, startIndex + 4);
    return (boolString == "true");
}

// ==================== Send AT Command to GSM Module ====================
void sendCommand(const char* command) {
    gsmSerial.println(command);
    delay(1000);
    while (gsmSerial.available()) {
        String response = gsmSerial.readString();
        Serial.println(response);
    }
}
