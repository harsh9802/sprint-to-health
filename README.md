# Sprint2Health: Agile Development of a Voice Assistant for Seniors' Health

**🎥 Walkthrough Video:**  
[Click here to watch the Sprint2Health Website Walkthrough!](https://youtu.be/pbw8xyw-jNU)

---


## Project Overview

**Objective:**  
Sprint2Health aims to build a health-centric voice assistant to help seniors manage their health-related tasks more easily through voice commands.

**Core Idea:**  
The voice assistant is designed to simplify health management by responding to voice commands, offering health insights, reminders for medications and appointments, and ensuring a seamless, user-friendly experience for elderly users.

**Technology Stack:**  
- **Frontend:** HTML, CSS, Handlebars
- **Backend:** Node.js, JavaScript
- **Database:** MongoDB with Mongoose
- **Voice Integration:** ChatGPT API for voice responses
- **Security:** End-to-end encryption for HIPAA compliance

**Agile Approach:**  
The development follows **Scrum** and **Kanban** methodologies, broken into 4 sprints of 2 weeks each.

---

## Table of Contents

1. [Project Vision and Introduction](#vision-and-introduction)
2. [Key Features](#key-features)
3. [Demo](#demo)
4. [Technical Details](#technical-details)
5. [Installation](#installation)
6. [Challenges & Learnings](#challenges-and-learnings)
7. [Possible Future Enhancements](#possible-future-enhancements)
8. [Acknowledgements](#acknowledgements)

---

## Vision and Introduction

**Vision:**  
To create an accessible and intuitive platform for seniors that fosters independence, improves health management, and strengthens doctor-patient connections through cutting-edge technology.

**Introduction:**  
This voice assistant is designed to cater to seniors by providing them with an intuitive tool for managing health-related activities. It bridges the gap between technology and elderly patients, following HIPAA guidelines to safeguard sensitive health information.

---

## Key Features

1. **Voice Assistant**  
   - Interacts with users via a fine-tuned LLM (Language Model) for health-related queries.
   - Provides responses in a configurable voice.

2. **Health Dashboard**  
   - Displays vital health information in a user-friendly format.
   - Summarizes daily health status through voice feedback.
   - Proactively asks follow-up questions based on health data.

3. **Appointment and Medicine Alerts**  
   - Sends notifications for upcoming appointments and medication schedules.
   - Users can manage appointments via a dedicated dashboard.

4. **Communication Logs Dashboard**  
   - Records all voice interactions securely for future analysis.
   - Allows doctors, relatives, and users to review past communications.

5. **Data Security with Encryption**  
   - Implements encryption mechanisms for HIPAA-compliant protection of health data.

---

## Demo

A prototype of the project is available, demonstrating the voice interaction, health dashboard, and notifications functionality.

- **Voice interaction** to manage health-related queries and appointments.
- **Health dashboard** displays and summarizes the user's health data.
- **Alert notifications** for health vitals, appointments, and medicine.

---

## Technical Details

- **Node.js**: Server-side logic
- **ChatGPT API**: Used for generating voice responses based on user input
- **Mongoose**: To manage data persistence in MongoDB
- **Handlebars**: Templating for dynamic frontend rendering
- **CSS/HTML**: For frontend design
- **Node.js Crypto**: For implementing end-to-end encryption to comply with HIPAA guidelines

---

## Installation
To set up the project locally, follow these steps:

### Prerequisites

- **Node.js** (version 14 or higher)
- **MongoDB** (for the local database, or a MongoDB Atlas account)
- **ChatGPT API** (sign up for access)

### Steps

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/sprint2health.git
   
2. Navigate to the project directory
   ```bash
   cd sprint2health
   
3. Install dependencies
   Install all necessary Node.js packages:
   ```bash
   npm install
   
4. Set up environment variables
   Create a .env file in the root directory of the project and add the following values:
   ```plaintext
   CHATGPT_API_KEY=your-chatgpt-api-key
   MONGODB_URI=your-mongodb-uri

   Replace your-chatgpt-api-key with your ChatGPT API key and your-mongodb-uri with your MongoDB connection string.
   
5. Start the application
   Run the following command to start the application:
   ```bash
   npm start

6. Access the application
   Open your web browser and visit:
   ```
   http://localhost:3000

You’re now ready to use Sprint2Health locally! 🎉
   


## Prerequisites

- **Node.js** (version 14 or higher)
- **MongoDB** (for the local database, or a MongoDB Atlas account)
- **ChatGPT API** (sign up for access)

---

## Challenges & Learnings
- **Challenge**: Adapting voice interfaces for elderly users required extensive user feedback and iterations to ensure simplicity and clarity in responses.
 - **Learning**: Implementing HIPAA-compliant encryption and ensuring secure data handling were essential but complex tasks, leading to a deeper understanding of health data security.

---

## Possible Future Enhancements:
1. Doctor Portal: A platform for doctors to manage patient data and appointments.
2. Personalized Care: Tailored responses based on the user’s medical history and interactions.
3. Emergency Alerts: Automatic alerts to family members and medical personnel in case of critical health changes.
4. IoT Integration: Integration with smart health devices to track real-time health vitals.
5. Multilingual Support: Expand the voice assistant to cater to users from diverse linguistic backgrounds.


---

## Acknowledgements
• Professor Zhongyuan (Annie) Yu and TAs: For their continuous support and feedback throughout the course.
• Ravi Kiran (VitaLink): For your collaboration and insights that greatly enhanced the project’s direction.
