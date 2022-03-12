import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

import IntroPage from "./components/IntroPage";
import Question from "./components/Question";
import Button from "./components/Button";

import topBlob from "./assets/top-blob.png";
import bottomBlob from "./assets/bottom-blob.png";
import topBlobSmall from "./assets/top-blob-small.png";
import bottomBlobSmall from "./assets/bottom-blob-small.png";

import "./App.css";

function App() {
    const backgrounds = [
        {
            backgroundImage: `url(${topBlob}), url(${bottomBlob})`,
        },
        {
            backgroundImage: `url(${topBlobSmall}), url(${bottomBlobSmall})`,
        },
    ];

    const questionAnswers = [
        { user: "", correct: "" },
        { user: "", correct: "" },
        { user: "", correct: "" },
        { user: "", correct: "" },
        { user: "", correct: "" },
    ];

    const [quiz, setQuiz] = useState(false);
    const [newGame, setNewGame] = useState(true);
    const [checkButton, setCheckButton] = useState(true);
    const [questionsList, setQuestionsList] = useState([]);
    const [answers, setAnswers] = useState(questionAnswers);
    const [score, setScore] = useState(0);

    function getAnswers(index, userAnswer, correctAnswer) {
        let newAnswers = [...answers];
        let newPairAnswer = { ...newAnswers[index] };
        newPairAnswer.user = userAnswer;
        newPairAnswer.correct = correctAnswer;
        newAnswers[index] = newPairAnswer;

        setAnswers(newAnswers);
    }

    function checkScore() {
        setCheckButton((prevCheckButton) => !prevCheckButton);
        for (let i = 0; i < answers.length; i++) {
            if (answers[i].user === answers[i].correct) {
                setScore((prevScore) => prevScore + 1);
            }
        }
    }

    useEffect(() => {
        fetch("https://opentdb.com/api.php?amount=5&type=multiple")
            .then((response) => response.json())
            .then((data) => setQuestionsList(data.results))
            .catch((error) => console.log(error));
    }, [newGame]);

    function startQuiz() {
        setQuiz((prevQuiz) => !prevQuiz);
    }

    const introPage = <IntroPage startButtonHandler={startQuiz} />;
    const quizPage = (
        <div className="questions-container">
            {questionsList.map((question) => {
                return (
                    <Question
                        key={uuidv4()}
                        index={questionsList.indexOf(question)}
                        title={question.question}
                        correctOption={question.correct_answer}
                        incorrectOptions={question.incorrect_answers}
                        handleAnswers={getAnswers}
                    />
                );
            })}
            {checkButton ? (
                <Button type="check-answers" handleClick={checkScore}>
                    Check answers
                </Button>
            ) : (
                <div className="score-container">
                    <p className="score">
                        You scored {score}/5 correct answers
                    </p>
                    <Button
                        type="play-again"
                        handleClick={() => {
                            setNewGame((prevNewGame) => !prevNewGame);
                            setCheckButton(
                                (prevCheckButton) => !prevCheckButton
                            );
                            setScore(0);
                            console.log("Play again");
                        }}
                    >
                        Play again
                    </Button>
                </div>
            )}
        </div>
    );

    return (
        <div className="App" style={!quiz ? backgrounds[0] : backgrounds[1]}>
            {!quiz ? introPage : quizPage}
        </div>
    );
}

export default App;