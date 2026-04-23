import { Link, useLocation, useNavigate } from "react-router-dom";
import "./QuizHome.css";
import figureMaster from "./../figure.json";
import plateMaster from "./../plate.json";
import { intRandom } from "../Components/Utility";
import { useEffect } from "react";

function QuizHome({ difficulty, setDifficulty, setProblemList }) {
	const search = useLocation().search;
	const navigate = useNavigate();

	useEffect(() => {
		const query = new URLSearchParams(search);
		if (query.has("a")) {
			if (query.has("type")) {
				navigate("/plateresult" + search);
			} else {
				navigate("/result" + search);
			}
		}
	}, [search, navigate]);

	const handleQuizStart = () => {
		let problemSize = 10;
		if (difficulty === 4) {
			problemSize = 100;
		}

		let tmp = [];
		let indexList = [];

		if (difficulty === 5) {
			for (let i = 0; i < plateMaster.length; i++) {
				if (!plateMaster[i].name.includes("ナイト")) {
					indexList.push(i);
				}
			}
		} else {
			for (let i = 0; i < figureMaster.length; i++) {
				indexList.push(i);
			}
		}

		for (let i = 0; i < problemSize; i++) {
			let randomval = intRandom(0, indexList.length);
			tmp.push(indexList[randomval]);
			indexList.splice(randomval, 1);
		}
		setProblemList(tmp);
	};

	return (
		<div className="home-all">
			<p>コマスターのルーレットのクイズです。</p>
			<p>たまにはコマスターのことを思い出してあげてね。</p>
			<br />
			<p>難易度を選んでください↓</p>
			<label className="home-select-difficulty">
				<select
					name="selectDifficulty"
					value={difficulty}
					onChange={(e) => setDifficulty(parseInt(e.target.value))}
				>
					<option value="0">Easy</option>
					<option value="1">Normal</option>
					<option value="2">Hard</option>
					<option value="3">Extreme</option>
					<option value="4">エンドレス</option>
					<option value="5">プレート</option>
				</select>
			</label>

			<Link to={difficulty === 5 ? "/platequiz" : "/quiz"} className="home-start-btn" onClick={handleQuizStart}>
				始める
			</Link>

			<p>フォルム名等は空白を空けずに続けて解答してください。</p>
			<p>例: デオキシスアタックフォルム</p>
			<p>記号や英字は半角で解答してください。</p>
			<p>例: メガミュウツーX</p>

			<Link to={"/library"} className="home-start-btn">
				ライブラリ閲覧
			</Link>

			<Link to={"/libraryplate"} className="home-start-btn">
				プレート閲覧
			</Link>
		</div>
	);
}

export default QuizHome;
