# Sprint2Health: Agile Development of a Voice Assistant for Seniors' Health

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
6. [Usage](#usage)
7. [Challenges & Learnings](#challenges-and-learnings)
8. [Future Enhancements](#future-enhancements)
9. [Contributing](#contributing)
10. [License](#license)
11. [Acknowledgements](#acknowledgements)

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

### Prerequisites

- **Node.js** (version 14 or higher)
- **MongoDB** (for the local database, or a MongoDB Atlas account)
- **ChatGPT API** (sign up for access)
---
