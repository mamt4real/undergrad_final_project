# Design And Implementation of A generic web-based Invoicing and Zakat Tracking System

## Author

- Mahadi Abuhuraira (U17CS1070)
- &copy; September 2023.

## Description

A project submitted to the department of Computer Science Ahmadu Bello University, Zaria In partial Fulfillment for the award of Bachelor of Science Computer Science.

---

## Abstract

_The "Design and Implementation of a Generic Web-Based Invoicing and Zakat Tracking System" project addresses the dual challenge faced by small-scale businesses - efficient financial management and religious compliance, particularly in zakat calculation. This project creates a versatile web-based system that empowers users to manage their financial operations seamlessly while adhering to religious obligations. It explores the project's rationale, objectives, scope, and leverages a thorough review of existing literature and systems to establish a robust foundation. The methodology emphasizes system design, technical architecture, and Agile methodologies, resulting in a technically sound structure. A client-server architecture, component breakdown, and use case diagrams form the core of the system's design, brought to life using React and Google Firestore. This project successfully harmonizes user-centric design, technical excellence, and religious adherence to provide a comprehensive solution for users of diverse backgrounds. The project not only met its objectives but also raised the bar for future endeavours. The recommendations extend an invitation to further development, integration, and exploration, while the suggestions for further research beckon the curious minds to explore the ever-evolving intersections of technology, finance, and faith._

---

## Entity relationship Diagram

![E-R Diagram](/ER-Diagram.png)

---

## Technologies and Tools

- ReactJs
- Firebase (Hosting, Authentication, Firestore, Storage etc)
- Mui Styling Library
- [GoldApi](https://www.goldapi.io) & [XEapi](https://xecdapi.xe.com)
- etc.

---

#### [Live Url](https://zakat-invoice-tacking.web.app)

---

## Setting Up and Running the Project

These steps will guide you through the process of setting up and running the "Design and Implementation of a Generic Web-Based Invoicing and Zakat Tracking System" project on your local development environment.

### Prerequisites

Before you begin, ensure that you have the following prerequisites installed on your system:

- **Node.js:** Download and install Node.js from [nodejs.org](https://nodejs.org/).
- **Firebase CLI:** Install Firebase Command Line Tools using npm with the following command:
  ```bash
  npm install -g firebase-tools
  ```
- **Git:** Download and install Git from [git-scm.com](https://git-scm.com/).

### Setup

1. **Clone The repository:**

```bash
git clone https://github.com/mamt4real/undergrad_final_project
```

2. **Navigate to the Poject Directory:**

   ```bash
   cd project-directory
   ```

   3. **Install Dependencies:**

   ```bash
   npm install
   ```

3. **Firebase Configuration:**

   - Create a Firebase project on the Firebase Console.
   - Configure Firebase for the project by running:

   ```bash
   firebase init
   ```

   - Follow the prompts and select Firebase Hosting as the deployment option.
   - Connect your project to the Firebase project you created earlier.

4. **Environment Variables:**

   - Create a `_config.js` file in the project [firebase directory](./src/firebase/) of your local project.
   - Add the necessary environment variables, including Firebase configuration (Firebase API keys, etc.) in the file using the [example](./src/firebase/_config.example.js).

### Running the Application

1. **Development Mode:**
   To run the application in development mode, use the following command:

```bash
npm start
```

This will start the development server, and you can access the application in your web browser at http://localhost:3000.

2. **Building for Production:**

   - change the variable `devEnv` in the `_config.js` file to false
   - run the following command:

   ```bash
   npm run build
   ```

3. **Firebase Hosting:**
   Deploy the built application to Firebase Hosting:

```bash
firebase deploy
```

After successful deployment, you can access the application using the provided Firebase Hosting URL.

---
