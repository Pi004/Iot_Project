const socket = new WebSocket("ws://192.168.4.1:81");

socket.onopen = () => {
  console.log("✅ WebSocket connected to ESP");
};

socket.onmessage = (event) => {
  const data = JSON.parse(event.data);
  if (data.type === "configSaved") {
    document.getElementById("statusMsg").innerText = "✅ Configuration saved. Closing...";
    setTimeout(() => window.close(), 3000);
  } else if (data.error) {
    document.getElementById("statusMsg").innerText = `❌ Error: ${data.error}`;
    document.getElementById("statusMsg").style.color = "red";
  }
};

socket.onerror = (err) => {
  console.error("⚠️ WebSocket error", err);
  document.getElementById("statusMsg").innerText = "❌ WebSocket connection failed";
  document.getElementById("statusMsg").style.color = "red";
};

document.getElementById("configForm").addEventListener("submit", function (e) {
  e.preventDefault();
  const ssid = document.getElementById("ssid").value.trim();
  const password = document.getElementById("password").value.trim();
  const plate = document.getElementById("plate").value.trim();

  const configData = {
    type: "SaveConfig",
    data: {
      ssid,
      password,
      plateNumber: plate
    }
  };

  socket.send(JSON.stringify(configData));
  document.getElementById("statusMsg").innerText = "📡 Sending configuration...";
});
