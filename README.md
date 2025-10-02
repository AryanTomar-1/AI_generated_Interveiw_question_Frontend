# Swipe AI Interview Frontend

A modern React-based frontend application for an AI-powered interview platform. This application allows candidates to upload their resumes, register for interviews, and take timed multiple-choice question (MCQ) assessments. Interviewers can manage and review interview sessions through a dedicated dashboard.

## Features

- **Resume Upload & Parsing**: Support for PDF and DOCX resume uploads with automatic parsing of candidate information (name, email, phone)
- **Timed MCQ Interviews**: Interactive, time-bound multiple-choice AI Generated question assessments
- **AI-Powered Evaluation**: Integration with AI services for intelligent scoring and feedback
- **State Management**: Redux-based state management
- **Interviewer Dashboard**: Comprehensive interface for interviewers to manage and monitor interview sessions
- **Responsive Design**: Built with Ant Design for a modern, responsive user interface

## Tech Stack

- **Frontend Framework**: React 18
- **State Management**: Redux Toolkit, Redux Persist
- **UI Library**: Ant Design
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Document Parsing**: PDF.js, Mammoth (for DOCX)
- **Build Tool**: Create React App

## Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   cd swipe_ai_interview/frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm start
   ```

The application will run on `http://localhost:3000`.

## Usage

1. **Home Page**: Navigate to the root URL to access the main landing page
2. **For Candidates**:
   - Go to `/interviewee`
   - Upload your resume (PDF or DOCX)
   - Fill in the parsed information or edit as needed
   - Click "Start Test" to begin the timed MCQ interview
3. **For Interviewers**:
   - Navigate to `/interviewer`
   - Access the dashboard to manage interview sessions

## Project Structure

```
src/
├── components/          # React components
│   ├── homePage.jsx     # Landing page component
│   ├── Interviewee.jsx  # Candidate interview interface
│   ├── Interviewer.jsx  # Interviewer dashboard
│   ├── questions.jsx    # MCQ question component
│   ├── ResumeUpload.jsx # Resume upload component
│   └── WelcomeBackModal.jsx # Welcome back modal
|
├── services/            # API services
│   ├── ai.js            # AI evaluation service
│   └── resumeParser.js  # Resume parsing service
├── store/               # Redux store configuration
│   ├── interviewSlice.js # Interview state slice
│   └── store.js         # Store setup
├── utils/               # Utility functions
│   └── questionBank.js  # Question database
└── styles.css           # Global styles
```

## Available Scripts

- `npm start`: Runs the app in development mode

## Dependencies

Key dependencies include:
- React and React DOM for the UI framework
- Redux Toolkit for state management
- Ant Design for UI components
- Axios for API calls
