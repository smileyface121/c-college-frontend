'use client';
import React, { useEffect, useState } from 'react';

export default function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/questions')
      .then(res => res.json())
      .then(data => setQuestions(data));
  }, []);

  const handleSelect = (qId, index) => {
    if (!submitted) {
      setAnswers(prev => ({ ...prev, [qId]: index }));
    }
  };

  const handleSubmit = async () => {
    let total = 0;
    questions.forEach(q => {
      if (answers[q._id] === q.correctAnswerIndex) {
        total++;
      }
    });
    setScore(total);
    setSubmitted(true);

    try {
      await fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/progress', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ score, total, answers })
      });
    } catch (error) {
      console.error('Progress save failed', error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thermodynamics Quiz</h1>
      {questions.map((q, i) => (
        <div key={q._id} className="mb-6 border p-4 rounded">
          <p className="font-semibold mb-2">{i + 1}. {q.question}</p>
          {q.options.map((opt, idx) => {
            const isSelected = answers[q._id] === idx;
            const isCorrect = q.correctAnswerIndex === idx;
            const isSubmittedWrong = submitted && isSelected && !isCorrect;

            return (
              <button
                key={idx}
                className={`block w-full text-left px-4 py-2 my-1 border rounded 
                  ${isSelected ? 'bg-blue-200' : ''} 
                  ${submitted && isCorrect ? 'bg-green-200' : ''} 
                  ${isSubmittedWrong ? 'bg-red-200' : ''} 
                  hover:bg-blue-100`}
                onClick={() => handleSelect(q._id, idx)}
              >
                {opt}
              </button>
            );
          })}
          {submitted && (
            <p className="mt-2 text-sm">
              Correct Answer: <strong>{q.options[q.correctAnswerIndex]}</strong>
            </p>
          )}
        </div>
      ))}

      {!submitted && (
        <button
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
          onClick={handleSubmit}
        >
          Submit Answers
        </button>
      )}

      {submitted && (
        <div className="mt-6 text-xl font-semibold">
          Your score: {score} / {questions.length}
        </div>
      )}
    </div>
  );
}
