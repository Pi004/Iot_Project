// ======================== WebSocket Integration ========================
const socket = new WebSocket("ws://localhost:5000");

socket.onopen = () => {
    console.log("🟢 Connected to WebSocket server");

    // Fetch user data from local storage
    const userData = JSON.parse(localStorage.getItem("userData"));

    // Send request to get the last location
    socket.send(JSON.stringify({ type: "LastLocation", data: { plateNumber: userData ? userData["plateNumber"] : null } }));
};

// ======================== Load User Name ========================
document.addEventListener("DOMContentLoaded", function () {
    const userData = JSON.parse(localStorage.getItem("userData"));
    document.getElementById("user-name").innerText = userData ? userData["username"] : "User";
});

// ======================== Update Status Dynamically ========================
function updateStatus(elementId, text, statusClass) {
    const element = document.getElementById(elementId);
    element.innerText = text;
    element.className = `status ${statusClass}`;
}

// ======================== Update GPS Location ========================
function updateGPS(lat=28.7041, lon=77.1025) {
    document.getElementById("gps-frame").src = `https://maps.google.com/maps?q=${lat},${lon}&output=embed`;
}

// ======================== Handle WebSocket Messages ========================
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);

    switch (data.type) {
        case "lastLocation":
            updateGPS(data.getLast.latitude, data.getLast.longitude);
            if(data.getLast.accident === true) {
                updateStatus("accident-status", "Accident Detected", "not-safe");
                sendEmergencyMessage(data.getLast.latitude, data.getLast.longitude);
                updateStatus("message-status", "Sent", "sent");
            } else {
                updateStatus("accident-status", "No Accident", "safe");
                updateStatus("message-status", "Pending", "pending");
            }
            if(data.getLast.drowsiness === true) {
                updateStatus("drowsiness-status", "High", "high");
            } else {
                updateStatus("drowsiness-status", "Normal", "normal");
            }
            if(data.getLast.alcohol === true) {
                updateStatus("alcohol-status", "Yes", "yes");
            } else {
                updateStatus("alcohol-status", "No", "no");
            }    
            //updateStatus("accident-status", data.getLast.accident, data.getLast.accident === true ? "not-safe" : "safe");
            //updateStatus("drowsiness-status", data.getLast.drowsiness, data.getLast.drowsiness === true ? "high" : "normal");
            //updateStatus("alcohol-status", data.getLast.alcohol, data.status.alcohol === true ? "yes" : "no");
            //updateStatus("cloud-video-status", data.getLast.cloud_video, data.getLast.cloud_video === "Saved" ? "saved" : "not-saved");

            updateGPS(data.getLast.latitude, data.getLast.longitude);
            break;

        /*case "locationHistory":
            console.log("📍 Location History:", data.locations);
            break;
        */
        case "userRegistered":
            console.log("✅ User Registered:", data.user);
            break;

        case "user":
            console.log("🔓 User Login Success:", data.user);
            break;

        default:
            console.error("❌ Invalid WebSocket Response Type");
    }
};

// ======================== Send Emergency Message ========================
function sendEmergencyMessage(lat, lon) {
    const message = `🚨 Accident Detected! Location: https://maps.google.com/maps?q=${lat},${lon}`;

    socket.send(JSON.stringify({ 
        type: "SendEmergencyAlert", 
        data: { 
            primaryNumber : JSON.parse(localStorage.getItem("userData"))["primaryNumber"],
            secondaryNumber : JSON.parse(localStorage.getItem("userData"))["secondaryNumber"],
            message: message
         }
    }));
}

// ======================== Handle WebSocket Errors ========================
socket.onerror = (error) => console.error("⚠️ WebSocket Error:", error);
socket.onclose = () => console.log("❌ WebSocket Disconnected");