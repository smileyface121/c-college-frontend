'use client';
import React, { useEffect, useState } from 'react';

export default function QuizApp() {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch(process.env.NEXT_PUBLIC_API_BASE_URL + '/questions')
      .then(res => {
        if (!res.ok) throw new Error('Failed to load questions');
        return res.json();
      })
      .then(data => {
        setQuestions(data);
        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setError('Could not load quiz. Please try again later.');
        setLoading(false);
      });
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
        body: JSON.stringify({ score: total, total, answers })
      });
    } catch (error) {
      console.error('Progress save failed', error);
    }
  };

  if (loading) return <p className="text-center mt-10 text-gray-500">Loading quiz...</p>;
  if (error) return <p className="text-center mt-10 text-red-500">{error}</p>;
  if (questions.length === 0) return <p className="text-center mt-10 text-gray-500">No questions available.</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-900">Thermodynamics Quiz</h1>
      {questions.map((q, i) => (
        <div key={q._id} className="mb-8 border rounded-lg p-4 bg-white shadow">
          <p className="font-semibold text-lg mb-3">{i + 1}. {q.question}</p>
          {q.options.map((opt, idx) => {
            const letter = String.fromCharCode(65 + idx); // A, B, C, D
            const isSelected = answers[q._id] === idx;
            const isCorrect = q.correctAnswerIndex === idx;
            const isWrong = submitted && isSelected && !isCorrect;

            return (
              <button
                key={idx}
                className={`block w-full text-left px-4 py-2 my-1 border rounded-md font-medium 
                  ${isSelected ? 'bg-blue-100' : ''} 
                  ${submitted && isCorrect ? 'bg-green-200' : ''} 
                  ${isWrong ? 'bg-red-200' : ''} 
                  hover:bg-blue-50`}
                onClick={() => handleSelect(q._id, idx)}
              >
                <span className="font-semibold mr-2">{letter}.</span> {opt}
              </button>
            );
          })}
          {submitted && (
            <p className="mt-2 text-sm text-gray-700">
              Correct Answer: <strong>{String.fromCharCode(65 + q.correctAnswerIndex)}. {q.options[q.correctAnswerIndex]}</strong>
            </p>
          )}
        </div>
      ))}

      {!submitted && (
        <div className="text-center">
          <button
            className="bg-green-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:bg-green-700"
            onClick={handleSubmit}
          >
            Submit Answers
          </button>
        </div>
      )}

      {submitted && (
        <div className="mt-6 text-center text-xl font-semibold text-gray-800">
          Your score: {score} / {questions.length}
        </div>
      )}
    </div>
  );
}
