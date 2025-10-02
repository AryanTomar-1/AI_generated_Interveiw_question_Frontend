import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  candidateEmail: null,
  candidateName: null,
  sessionActive: false,
  questions: [],
  answers: [],
  currentIndex: 0,
  timer: 0,
  finished: false,
  summary: null,
  loading: false,
};

const interviewSlice = createSlice({
  name: "interview",
  initialState,
  reducers: {
    startSession: (state, action) => {
      const { email, name, questions, loading,sessionActive } = action.payload || {};
      if (typeof loading === "boolean") state.loading = loading;
      if (questions) {
        // New session
        state.candidateEmail = email || state.candidateEmail;
        state.candidateName = name || state.candidateName;
        state.questions = questions;
        state.answers = [];
        state.currentIndex = 0;
        state.timer = questions?.[0]?.timeLimit || 0;
        state.finished = false;
        state.summary = null;
        state.sessionActive = sessionActive;
      } else if (email && state.candidateEmail === email && state.sessionActive) {
        // Resume
        state.sessionActive = true;
      }
    },
    saveAnswer: (state, action) => {
      const { questionIndex, selected } = action.payload;
      const question = state.questions[questionIndex];
      const correctOptionIndex = ["A", "B", "C", "D"].indexOf(question.answer);
      const correct = question.options[correctOptionIndex];
      state.answers[questionIndex] = { question: question.question, selected, correct };
    },
    nextQuestion: (state) => {
      if (state.currentIndex < state.questions.length - 1) {
        state.currentIndex += 1;
        state.timer = state.questions[state.currentIndex].timeLimit;
      } else {
        state.finished = true;
      }
    },
    setTimer: (state, action) => {
      state.timer = action.payload;
    },
    setSummary: (state, action) => {
      state.summary = action.payload;
    },
    resetSession: () => initialState,
  },
});

export const {
  startSession,
  saveAnswer,
  nextQuestion,
  setTimer,
  setSummary,
  resetSession,
} = interviewSlice.actions;

export default interviewSlice.reducer;