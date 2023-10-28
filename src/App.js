import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import QuizMain from "./pages/QuizMain.jsx";
import Result from "./pages/Result";
import { useState } from "react";
import QuizHome from "./pages/QuizHome";
import Library from "./pages/Library";

function App() {
	const [problemList, setProblemList] = useState([]);
	const [answerList, setAnswerList] = useState([]);
	const [difficulty, setDifficulty] = useState(0);

	const ROUTER_BASENAME = process.env.NODE_ENV === "development" ? "/" : "/RouletteQuiz";

	return (
		<Router basename={ROUTER_BASENAME}>
			<Routes>
				<Route
					path="/"
					element={
						<QuizHome
							difficulty={difficulty}
							setDifficulty={setDifficulty}
							setProblemList={setProblemList}
						/>
					}
				/>
				<Route
					path="/quiz"
					element={
						<QuizMain
							problemList={problemList}
							answerList={answerList}
							setAnswerList={setAnswerList}
							difficulty={difficulty}
						/>
					}
				/>
				<Route
					path="/result"
					element={<Result problemList={problemList} answerList={answerList} difficulty={difficulty} />}
				/>
				<Route path="/library" element={<Library />} />
			</Routes>
		</Router>
	);
}

export default App;
