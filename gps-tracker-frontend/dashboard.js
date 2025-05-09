// ======================== WebSocket Integration ========================
const socket = new WebSocket("ws://10.196.36.90:5000");

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
// ======================== Camera-feed ========================
function showCameraOff() {
    document.getElementById("camera-off-overlay").classList.remove("hidden");
}
function hideCameraOff() {
    document.getElementById('camera-off-overlay').classList.add('hidden');
}
// ========================== Tabbed Interface ========================
$(document).ready(function () {
    $('.tab-btn').click(function () {
        const tabId = $(this).data('tab');

        $('.tab-btn').removeClass('active');
        $(this).addClass('active');

        $('.tab-content').removeClass('active');
        $('#' + tabId).addClass('active');
    });
});
// ======================== Handle WebSocket Messages ========================
socket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    switch (data.type) {
        case "liveLocation":
            const loc = data.getLive.data;
            updateGPS(loc.latitude, loc.longitude , loc.speed || 0);
            if(loc.accident === true) {
                updateStatus("accident-status", "Accident Detected", "not-safe");
                document.getElementById("accident-status").parentElement.classList.add("alert");
                sendEmergencyMessage(loc.latitude, loc.longitude);
                updateStatus("message-status", "Sent", "sent");
            } else {
                updateStatus("accident-status", "No Accident", "safe");
                document.getElementById("accident-status").parentElement.classList.remove("alert");
                updateStatus("message-status", "Pending", "pending");

            }
            if(loc.sleep === true) {
                updateStatus("drowsiness-status", "Drowsy", "high");
                document.getElementById("drowsiness-status").parentElement.classList.add("alert");

            } else {
                updateStatus("drowsiness-status", "Normal", "normal");
                document.getElementById("drowsiness-status").parentElement.classList.remove("alert");
            }
            if(loc.drunk === true) {
                updateStatus("alcohol-status", "Yes", "yes");
                document.getElementById("alcohol-status").parentElement.classList.add("alert");
            } else {
                updateStatus("alcohol-status", "No", "no");
                document.getElementById("alcohol-status").parentElement.classList.remove("alert");
            }    
            updateGPS(loc.latitude, loc.longitude , loc.speed || 0);
            break;

        case "streamReceived":
            const streamUrl = data.streamUrl;
            document.getElementById("live-video").src = streamUrl;
            const video = document.getElementById("live-video");

            // Temporarily hide the video while updating source
            /*video.classList.add('hidden');
            setTimeout(() => {
                video.src = streamUrl;
                video.classList.remove('hidden');
            }, 300);*/ // Add a small delay
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
            primaryNumber :"+91" + JSON.parse(localStorage.getItem("userData"))["contact"]["primary"],
            secondaryNumber :"+91" +JSON.parse(localStorage.getItem("userData"))["contact"]["secondary"],
            message: message
         }
    }));
}

// ======================== Handle WebSocket Errors ========================
socket.onerror = (error) => console.error("⚠️ WebSocket Error:", error);
socket.onclose = () => console.log("❌ WebSocket Disconnected");