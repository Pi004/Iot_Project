# Vehicle Tracking and Accident Alert System
*Empowering Safe, Smarter Vehicles Through Innovation*

![last commit](https://img.shields.io/github/last-commit/Pi004/Iot_Project?color=black)
![month](https://img.shields.io/badge/month-may-blue)
![javascript](https://img.shields.io/badge/javascript-40%25-blue)
![languages](https://img.shields.io/badge/languages-5-blue)

---

**_Built with the tools and technologies:_**

![Express](https://img.shields.io/badge/-Express-black?logo=express&logoColor=white)
![JSON](https://img.shields.io/badge/-JSON-black?logo=json&logoColor=white)
![Markdown](https://img.shields.io/badge/-Markdown-black?logo=markdown&logoColor=white)
![Socket.io](https://img.shields.io/badge/-Socket.io-black?logo=socket.io&logoColor=white)
![npm](https://img.shields.io/badge/-npm-red?logo=npm&logoColor=white)
![Mongoose](https://img.shields.io/badge/-Mongoose-d9534f?logo=mongoose&logoColor=white)
![ENV](https://img.shields.io/badge/-.ENV-yellow?logo=dotenv&logoColor=black)
![JavaScript](https://img.shields.io/badge/-JavaScript-yellow?logo=javascript&logoColor=black)
![Nodemon](https://img.shields.io/badge/-Nodemon-green?logo=nodemon&logoColor=white)
![C++](https://img.shields.io/badge/-C++-00599C?logo=c%2b%2b&logoColor=white)
![Cloudinary](https://img.shields.io/badge/-Cloudinary-3448C5?logo=cloudinary&logoColor=white)
![Twilio](https://img.shields.io/badge/-Twilio-F22F46?logo=twilio&logoColor=white)
![Canvas](https://img.shields.io/badge/-Canvas-d9534f?logo=canvas&logoColor=white)


## Overview
This project is an Arduino-based vehicle tracking and accident alert system that utilizes Node.js, Express.js, MongoDB, and WebSockets for the backend and HTML, CSS for the frontend. The system tracks vehicles based on their license number and, upon detecting an accident, sends alerts to the nearest and most relevant emergency services, including hospitals, fire departments, police stations, and relatives.

## Features
- **Real-time Vehicle Tracking**: Monitors vehicles based on their license number.
- **Accident Detection**: Uses sensors to detect accidents.
- **Automated Emergency Alerts**: Sends alerts to emergency services and relatives in case of an accident.
- **Web Dashboard**: A user-friendly interface to track vehicles and view accident reports.

## Technologies Used
### Backend:
- **Node.js**
- **Express.js**
- **MongoDB**
- **WebSockets**

### Frontend:
- **HTML**
- **CSS**
- **Javascript**

### Hardware:
- **Arduino Board**
- **GPS Module**
- **Accelerometer/Gyroscope (For Accident Detection)**
- **GSM Module (For Communication)**

## Installation
### Prerequisites
Ensure you have the following installed:
- Node.js
- MongoDB
- Arduino IDE

### Backend Setup
1. Clone the repository:
   ```sh
   git clone <repository-url>
   ```
2. Navigate to the backend directory:
   ```sh
   cd backend
   ```
3. Install dependencies:
   ```sh
   npm install
   ```
4. Start the backend server:
   ```sh
   node server.js
   ```

### Frontend Setup
1. Open `landingpage.html` in a web browser.
2. Ensure the backend is running to retrieve real-time data.

## How It Works
1. The system continuously tracks vehicle locations using GPS.
2. In the event of an accident, the accelerometer detects abnormal forces.
3. The GSM module sends data to the backend.
4. The backend processes the information and sends alerts to emergency services via WebSockets.
5. Users can monitor vehicle data through the web dashboard.

## Usage
- Track vehicles in real-time.
- Monitor accident alerts.
- View emergency contacts and notifications.

## Future Enhancements
- Mobile application for real-time tracking.
- Integration with AI-based accident severity analysis.
- Enhanced visualization via real-time video feed with automatic cloud storage for later access and analysis.

## Contributors
- **Shrushti Chouhan**
- **Abhhaa Narote**
- **Yashasvi Singh**
- **Aryan Chaudhary**
- **Tejas Kumar**
- **Piyush Shrivastaw**

## License
This project is licensed under the Apache 2.0 License.

