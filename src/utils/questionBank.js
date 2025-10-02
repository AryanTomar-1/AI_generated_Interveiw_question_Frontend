// A simple question bank by difficulty for Full-stack (React/Node). Replace or extend as needed.
export const QUESTION_BANK = {
easy: [
{ id: 'e1', text: 'What is the difference between let and var in JavaScript?' },
{ id: 'e2', text: 'Explain what React props are.' },
{ id: 'e3', text: 'How do you create a new Node.js project?' }
],
medium: [
{ id: 'm1', text: 'Explain the virtual DOM and how React updates the UI.' },
{ id: 'm2', text: 'How would you structure REST APIs for a simple e-commerce cart?' },
{ id: 'm3', text: 'Explain differences between SQL and NoSQL and when to use each.' }
],
hard: [
{ id: 'h1', text: 'Explain how you would optimize a slow React app.' },
{ id: 'h2', text: 'Design a token-based authentication flow with refresh tokens.' },
{ id: 'h3', text: 'How would you debug and resolve memory leaks in a Node.js server?' }
]
};


export function buildInterviewQuestions() {
// 2 easy, 2 medium, 2 hard in order
const pick = (arr, n) => arr.slice(0).sort(() => 0.5 - Math.random()).slice(0, n);
return [...pick(QUESTION_BANK.easy, 2), ...pick(QUESTION_BANK.medium, 2), ...pick(QUESTION_BANK.hard, 2)].map((q, idx) => ({ ...q, index: idx }));
}