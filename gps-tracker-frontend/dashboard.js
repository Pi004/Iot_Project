// ======================== WebSocket Integration ========================
const socket = new WebSocket("ws://localhost:5000");

socket.onopen = () => {
    console.log("🟢 Connected to WebSocket server");

    // Fetch user data from local storage
    const userData = JSON.parse(localStorage.getItem("userData"));
    // Send request to get the last location
    socket.send(JSON.stringify({ type: "LiveLocation", data: { plateNumber: userData.vehicle["plateNumber"]} }));
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
/*function updateGPS(lat=28.7041, lon=77.1025) {
    document.getElementById("gps-frame").src = `https://maps.google.com/maps?q=${lat},${lon}&output=embed`;
}*/
let map, marker;
function initializeMap(lat = 28.7041, lon = 77.1025) {
    map = L.map("gps-map").setView([lat, lon], 15);

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors'
    }).addTo(map);

    marker = L.marker([lat, lon]).addTo(map);
}

function updateGPS(lat, lon, speed = 0) {
    if (!map) {
        initializeMap(lat, lon);
    } else {
        marker.setLatLng([lat, lon]);
        map.setView([lat, lon], 15);
    }

    // Update display panel
    document.getElementById("lat-display").innerText = `Lat: ${lat.toFixed(5)}`;
    document.getElementById("lon-display").innerText = `Lon: ${lon.toFixed(5)}`;
    document.getElementById("speed-display").innerText = `Speed: ${speed.toFixed(1)} km/h`;
}
// ======================== Handle WebSocket Messages ========================
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    const loc = data.getLive.data;
    switch (data.type) {
        case "liveLocation":
            updateGPS(loc.latitude, loc.longitude , loc.speed || 0);
            if(loc.accident === true) {
                updateStatus("accident-status", "Accident Detected", "not-safe");
                sendEmergencyMessage(data.getLast.data.latitude, data.getLast.data.longitude);
                updateStatus("message-status", "Sent", "sent");
            } else {
                updateStatus("accident-status", "No Accident", "safe");
                updateStatus("message-status", "Pending", "pending");
            }
            if(loc.sleep === true) {
                updateStatus("drowsiness-status", "High", "high");
            } else {
                updateStatus("drowsiness-status", "Normal", "normal");
            }
            if(loc.drunk === true) {
                updateStatus("alcohol-status", "Yes", "yes");
            } else {
                updateStatus("alcohol-status", "No", "no");
            }    
            //updateStatus("accident-status", data.getLast.accident, data.getLast.accident === true ? "not-safe" : "safe");
            //updateStatus("drowsiness-status", data.getLast.drowsiness, data.getLast.drowsiness === true ? "high" : "normal");
            //updateStatus("alcohol-status", data.getLast.alcohol, data.status.alcohol === true ? "yes" : "no");
            //updateStatus("cloud-video-status", data.getLast.cloud_video, data.getLast.cloud_video === "Saved" ? "saved" : "not-saved");

            updateGPS(loc.latitude, loc.longitude , loc.speed || 0);
            break;
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