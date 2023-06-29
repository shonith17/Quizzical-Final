import { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import './App.css';
import Question from "./components/question";
import blob1 from "./assets/blob1.svg"
import blob2 from "./assets/blob2.svg"

function App() {
  const [click, setClick] = useState(false);
  const [triviaData, setTriviaData] = useState([]);
  const [answers, setAnswers] = useState([]);
  const [checkedAnswers, setCheckedAnswers] = useState(false);
  const [score, setScore] = useState(0);
  const [newGame, setNewGame] = useState(true);
  const [loading, setLoading] = useState(false);

  function handleStartButton() {
    setClick(prevClick => !prevClick);
  }
   
  function handleNewGameButton() {
    setNewGame(prevGame => !prevGame);
    setClick(prevGame => !prevGame);
    setTriviaData([]);
    setAnswers([]);
    setCheckedAnswers(false);
    setScore(0);
  }

  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]]; // Swap elements using destructuring assignment
    }
    return array;
  }

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      try {
        const response = await fetch(
          "https://opentdb.com/api.php?amount=5&category=17"
        );
        const data = await response.json();
        setTriviaData(data.results);
      } catch (error) {
        console.error("API request error:", error);
      }

      setLoading(false);
    };
  
    fetchData();
  }, [newGame]);

  useEffect(() => {
    const dataQuestions = triviaData.map(item => {
      const answers = [
        { answer: item.correct_answer, correct: true },
        ...item.incorrect_answers.map(answer => ({ answer, correct: false }))
      ];

      const shuffledAnswers = shuffleArray(answers);

      return {
        question: item.question,
        answers: shuffledAnswers.map(answer => ({
          ...answer,
          id: nanoid(),
          on: false
        }))
      };
    });

    setAnswers(dataQuestions);
  }, [triviaData]);

  function toggle(questionIndex, answerId) {
    setAnswers(prevAnswers => {
      const updatedAnswers = [...prevAnswers];
      const answersArray = updatedAnswers[questionIndex].answers;

      for (let i = 0; i < answersArray.length; i++) {
        if (answersArray[i].id === answerId) {
          answersArray[i].on = true;
          if (answersArray[i].correct) {
            setScore(prevScore => prevScore + 1);  // Increment score if the answer is correct
          }
        } else {
          answersArray[i].on = false;
        }
      }

      return updatedAnswers;
    });
  }

  function checkAnswers() {
    setCheckedAnswers(true);
  }
  
  let questionElements = null;
  if (answers.length > 0) {
    questionElements = answers.map((item, index) => (
      <Question
        question={item.question}
        answers={item.answers}
        toggle={(answerId) => toggle(index, answerId)}
        key={index}
        checked={checkedAnswers}
      />
    ));
  }

  return (
    <>
      <div className="blob">
        <img className="blob1-svg" src={blob1} alt="" />
      </div>
      <div className="blob">
        <img className="blob2-svg" src={blob2} alt="" />
      </div>
      {newGame && !click ? (
        <div className="container">
          <h1>Quizzical</h1>
          <p>Think you can get them all correct?</p>
          <button onClick={handleStartButton}>Start Quiz</button>
        </div>
      ) : (
        <div className="container-questions">
          {loading ? (
            <div className="loading">Loading...</div>
          ) : (
            <>
              {questionElements}
              {questionElements && !checkedAnswers && (
                <button onClick={checkAnswers}>Check Answers</button>
              )}
              {checkedAnswers && (
                <div className="flex">
                  <div className="score">{`You scored ${score}/5 correct answers`}</div>
                  <button onClick={handleNewGameButton}>Play Again</button>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </>
  );
}

export default App;


