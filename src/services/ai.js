// Local simulated AI: generates question objects and scores answers using keyword matching.


export async function generateQuestions() {
// import a question builder later; here you will call buildInterviewQuestions
return []; // placeholder - replaced by using utils/questionBank in components
}


export function scoreAnswer(question, answer, difficulty) {
// Simple heuristic scoring: presence of important keywords -> better score
const keywords = {
e1: ['let', 'var', 'scope', 'function'],
e2: ['props', 'component', 'immutable'],
e3: ['npm init', 'package.json', 'npm init -y'],
m1: ['virtual dom', 'diff', 'reconciliation'],
m2: ['routes', 'endpoints', 'CRUD'],
m3: ['relational', 'schema', 'document'],
h1: ['memoization', 'profiling', 'useMemo', 'shouldComponentUpdate'],
h2: ['jwt', 'refresh', 'access token', 'httpOnly'],
h3: ['heap', 'profiling', 'gc']
};
const kw = keywords[question.id] || [];
const text = (answer || '').toLowerCase();
let matches = 0;
kw.forEach(k => { if (text.includes(k.toLowerCase())) matches++; });
// base score by difficulty
const base = difficulty === 'easy' ? 50 : difficulty === 'medium' ? 60 : 70;
const score = Math.min(100, base + matches * 10 - Math.max(0, (answer || '').length < 10 ? 10 : 0));
return score;
}