// ======================== WebSocket Integration ========================
const socket = new WebSocket("ws://localhost:5000");

socket.onopen = () => {
    console.log("✅ WebSocket connected");
};

socket.onmessage = (event) => {
    console.log("📩 Received:", event.data);
    const data = JSON.parse(event.data);

    if (data.type === "user") {
        localStorage.setItem("userData", JSON.stringify(data.User.data));
        alert("✅ Login successful!");
        window.location.href = "dashboard.html";
    } else if (data.error) {
        showError(data.error);
    }
};

socket.onerror = (error) => {
    console.error("⚠️ WebSocket error:", error);
};

socket.onclose = () => {
    console.log("❌ WebSocket disconnected");
};

// ======================== Validation Functions ========================

// Regex patterns
const carNumberRegex = /^[A-Z]{2} \d{2} [A-Z]{1} \d{4}$/;

// Function to show error messages
function showError(message, element = null) {
    const errorMessage = document.getElementById("error-message");
    errorMessage.innerText = message;
    errorMessage.style.display = "block";

    if (element) {
        element.style.borderColor = "var(--error-color)";
    }
}

// Function to hide error messages
function hideError() {
    const errorMessage = document.getElementById("error-message");
    errorMessage.innerText = "";
    errorMessage.style.display = "none";
}

// Function to validate form input
function validateForm(carNumber , password) {

    if (!carNumberRegex.test(carNumber)) {
        showError("Car registration number format must be 'AA 11 A 1111'", document.getElementById("carNumber"));
        return false;
    }

    if (password === "") {
        showError("Password cannot be empty", document.getElementById("password"));
        return false;
    }
    return true;
}
// ======================== // Redirect to sign-up page ========================
function toggleForm(event){
    event.preventDefault();
    window.location.href = "sign_up.html";
}

document.getElementById("togglePassword").addEventListener("click", function () {
    const passwordInput = document.getElementById("password");
    const type = passwordInput.getAttribute("type") === "password" ? "text" : "password";
    passwordInput.setAttribute("type", type);
    this.classList.toggle("fa-eye");
    this.classList.toggle("fa-eye-slash");
});
// ======================== Form Submission with WebSocket ========================

function loginUser(event) {
    event.preventDefault();

    const carNumber = document.getElementById("carNumber").value.trim();
    const password = document.getElementById("password").value.trim();

    // Validate input
    if (!validateForm(carNumber , password)) {
        return false;
    }
    // Send data to WebSocket backend
    const loginData = {
        plateNumber: carNumber,
        password: password
    };
    // Send sign-up data to WebSocket server
    socket.send(JSON.stringify({ type: "LoginUser", data: loginData }));
}
