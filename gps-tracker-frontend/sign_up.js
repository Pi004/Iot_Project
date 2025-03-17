// ======================== WebSocket Integration ========================
const socket = new WebSocket("ws://localhost:3000");

socket.onopen = () => {
    console.log("✅ WebSocket connected");
};

socket.onmessage = (event) => {
    console.log("📩 Received:", event.data);
    const data = JSON.parse(event.data);

    if (data.type === "userRegistered") {
        alert("✅ Registration successful!");
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
const nameRegex = /^[A-Za-z\s]+$/;
const phoneRegex = /^[1-9][0-9]{9}$/;
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

// Function to validate phone numbers on input
function validatePhones() {
    const phone = document.getElementById("phone").value.trim();
    const secondaryPhone = document.getElementById("secondaryPhone").value.trim();
    const secondaryPhoneElement = document.getElementById("secondaryPhone");

    if (secondaryPhone && phone === secondaryPhone) {
        showError("Primary and secondary phone numbers cannot be the same.", secondaryPhoneElement);
        return false;
    } else {
        hideError();
        secondaryPhoneElement.style.borderColor = "var(--border-color)";
        return true;
    }
}

// Function to validate form input
function validateForm(name, phone, secondaryPhone, carNumber, password, confirmPassword) {
    if (!nameRegex.test(name)) {
        showError("Name must contain only letters.", document.getElementById("name"));
        return false;
    }

    if (!phoneRegex.test(phone)) {
        showError("Primary phone must be 10 digits.", document.getElementById("phone"));
        return false;
    }

    if (secondaryPhone && !phoneRegex.test(secondaryPhone)) {
        showError("Secondary phone must be 10 digits.", document.getElementById("secondaryPhone"));
        return false;
    }

    if (!validatePhones()) return false;

    if (!carNumberRegex.test(carNumber)) {
        showError("Car registration number format must be 'AA 11 A 1111'", document.getElementById("carNumber"));
        return false;
    }

    if (password !== confirmPassword) {
        showError("Passwords do not match.", document.getElementById("confirmPassword"));
        return false;
    }

    return true;
}

// ======================== Password Strength Checker ========================

document.addEventListener("DOMContentLoaded", function () {
    const password = document.getElementById("password");
    const confirmPassword = document.getElementById("confirmPassword");
    const strengthIndicator = document.querySelector(".strength-indicator");
    const strengthText = document.querySelector(".strength-text");
    const toggleButtons = document.querySelectorAll(".toggle-password");
    const phoneInput = document.getElementById("phone");
    const secondaryPhoneInput = document.getElementById("secondaryPhone");
    const errorMessage = document.getElementById("error-message");
    const inputs = document.querySelectorAll("input");

    // Toggle password visibility
    toggleButtons.forEach((button) => {
        button.addEventListener("click", function () {
            const input = this.previousElementSibling;
            const icon = this.querySelector("i");

            if (input.type === "password") {
                input.type = "text";
                icon.classList.remove("fa-eye");
                icon.classList.add("fa-eye-slash");
            } else {
                input.type = "password";
                icon.classList.remove("fa-eye-slash");
                icon.classList.add("fa-eye");
            }
        });
    });

    // Function to check password strength
    function checkPasswordStrength(password) {
        let strength = 0;
        const patterns = {
            length: password.length >= 8,
            lowercase: /[a-z]/.test(password),
            uppercase: /[A-Z]/.test(password),
            numbers: /\d/.test(password),
            special: /[!@#$%^&*(),.?":{}|<>]/.test(password),
        };

        strength += patterns.length ? 1 : 0;
        strength += patterns.lowercase ? 1 : 0;
        strength += patterns.uppercase ? 1 : 0;
        strength += patterns.numbers ? 1 : 0;
        strength += patterns.special ? 1 : 0;

        return {
            score: strength,
            patterns: patterns,
        };
    }

    // Update password strength indicator
    password.addEventListener("input", function () {
        const result = checkPasswordStrength(this.value);
        const percentage = (result.score / 5) * 100;

        strengthIndicator.style.width = `${percentage}%`;

        if (result.score === 0) {
            strengthIndicator.className = "strength-indicator";
            strengthText.textContent = "No password";
        } else if (result.score <= 2) {
            strengthIndicator.className = "strength-indicator weak";
            strengthText.textContent = "Weak";
        } else if (result.score <= 3) {
            strengthIndicator.className = "strength-indicator medium";
            strengthText.textContent = "Medium";
        } else if (result.score <= 4) {
            strengthIndicator.className = "strength-indicator strong";
            strengthText.textContent = "Strong";
        } else {
            strengthIndicator.className = "strength-indicator very-strong";
            strengthText.textContent = "Very Strong";
        }
    });

    // Validate matching passwords
    confirmPassword.addEventListener("input", function () {
        if (confirmPassword.value !== password.value) {
            confirmPassword.setCustomValidity("Passwords do not match");
        } else {
            confirmPassword.setCustomValidity("");
        }
    });

    // Validate phone numbers on input
    phoneInput.addEventListener("input", validatePhones);
    secondaryPhoneInput.addEventListener("input", validatePhones);

    // Reset border colors when user starts typing
    inputs.forEach((input) => {
        input.addEventListener("input", function () {
            if (input !== secondaryPhoneInput || !validatePhones()) {
                input.style.borderColor = "var(--border-color)";
            }
        });
    });
});

// ======================== Form Submission with WebSocket ========================

function registerUser(event) {
    event.preventDefault();

    const name = document.getElementById("name").value.trim();
    const phone = document.getElementById("phone").value.trim();
    const secondaryPhone = document.getElementById("secondaryPhone").value.trim();
    const address = document.getElementById("address").value.trim();
    const carNumber = document.getElementById("carNumber").value.trim();
    const password = document.getElementById("password").value.trim();
    const confirmPassword = document.getElementById("confirmPassword").value.trim();

    // Validate input
    if (!validateForm(name, phone, secondaryPhone, carNumber, password, confirmPassword)) {
        return false;
    }
    // Send data to WebSocket backend
    const signUpData = {
        username: name,
        primaryNumber: phone,
        secondaryNumber: secondaryPhone,
        address: address,
        plateNumber: carNumber,
        password: password
    };
    localStorage.setItem("userData" , JSON.stringify(signUpData));
    // Send sign-up data to WebSocket server
    socket.send(JSON.stringify({ type: "SignUpUser", data: signUpData }));
}
