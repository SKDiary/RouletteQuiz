import "./QuizMain.css";
import figureMaster from "./../figure.json";
import { useEffect, useState } from "react";
import Roulette from "./../Components/Roulette.jsx";
import DisplaySkill from "./../Components/DisplaySkill.jsx";
import { Link, useNavigate } from "react-router-dom";
import { intRandom, typeTranslate } from "../Components/Utility";

function QuizMain({ problemList, answerList, setProblemList, setAnswerList, difficulty }) {
	const [problemIndex, setProblemIndex] = useState(0);
	const [thisAnswer, setThisAnswer] = useState("");
	const [thisDifficulty, setThisDifficulty] = useState(difficulty);
	const problemSize = problemList.length;

	const navigate = useNavigate();

	// console.log(figureMaster[problemList[problemIndex]].name);

	const hiddenSkills = (() => {
		if (problemSize === 0) return;

		let tmpSkills = [...figureMaster[problemList[problemIndex]].skills].map((e) => ({ ...e }));
		if (thisDifficulty >= 3) {
			for (let i = 0; i < tmpSkills.length; i++) {
				tmpSkills[i].name = "????";
				tmpSkills[i].detail = "";
			}
		}
		return tmpSkills;
	})();

	useEffect(() => {
		if (difficulty === 4) {
			setThisDifficulty(intRandom(0, 3));
		}
	}, [difficulty]);

	useEffect(() => {
		setAnswerList(Array(problemSize).fill(""));
	}, [problemSize, setAnswerList]);

	const nextProblem = (e) => {
		e.preventDefault();

		let tmp = [...answerList];
		tmp[problemIndex] = thisAnswer;
		setAnswerList(tmp);

		setThisAnswer("");

		if (difficulty === 4) {
			setThisDifficulty(intRandom(0, 3));
			if (thisAnswer !== figureMaster[problemList[problemIndex]].name) {
				setProblemList(problemList.slice(0, problemIndex + 1));
				setAnswerList(answerList.slice(0, problemIndex + 1));

				navigate("/result");
			}
		}

		if (problemIndex + 1 === problemSize) {
			navigate("/result");
		} else {
			setProblemIndex(problemIndex + 1);
		}
	};

	const hideIfDifficult = (border, text, length = 4) => (thisDifficulty < border ? text : "?".repeat(length));

	return problemList.length === 0 ? (
		<Link to={"/"} className="home-start-btn">
			予期せぬエラーが発生しました
			<br />
			タイトルに戻ります
		</Link>
	) : (
		<>
			{/* ヘッダー */}
			<div className="quizmain-header">
				<p>第{problemIndex + 1}問</p>

				{/* <p>結果：</p> */}
				{difficulty !== 4 && (
					<div className="quizmain-result-items">
						{problemList.map((probNum, idx) => {
							const correct =
								idx < problemIndex ? (answerList[idx] === figureMaster[probNum].name ? 1 : 0) : -1;
							return (
								<p
									key={probNum}
									className={
										"quizmain-resultcolor-" +
										(correct === -1 ? "white" : correct ? "yellow" : "blue")
									}
								>
									{correct === -1 ? "ー" : correct ? "○" : "×"}
								</p>
							);
						})}
					</div>
				)}
			</div>

			{/* 問題 */}
			{problemList.length !== 0 && (
				<>
					<div className="quizmain-problem">
						<Roulette
							className="quizmain-roulette"
							data={hiddenSkills}
							pos_x={100}
							pos_y={100}
							radius={100}
							mp={hideIfDifficult(2, figureMaster[problemList[problemIndex]].mp, 1)}
							rarity={hideIfDifficult(2, figureMaster[problemList[problemIndex]].rarity, 2)}
						/>

						<div className="quizmain-figure-detail">
							<span style={{ backgroundColor: "dimgray", color: "lightgray" }}> タイプ </span>
							{hideIfDifficult(
								1,
								figureMaster[problemList[problemIndex]].types.map((e) => typeTranslate(e)).join(", ")
							)}
							<br />
							<span style={{ backgroundColor: "dimgray", color: "lightgray" }}> 特性 </span>
							{hideIfDifficult(2, figureMaster[problemList[problemIndex]].ability)}
							<hr color="dimgray" />
							<p>{hideIfDifficult(1, figureMaster[problemList[problemIndex]].abilityDetail, 0)}</p>
						</div>
					</div>

					<form className="quizmain-answer-form" onSubmit={nextProblem}>
						<label>
							解答：
							<input
								name="answer"
								value={thisAnswer}
								onChange={(event) =>
									setThisAnswer(
										event.target.value
											.replaceAll(" ", "")
											.replaceAll("　", "")
											.replaceAll("：", ":")
											.replaceAll("::", ":")
											.replaceAll("％", "%")
											.replaceAll("%%", "%")
									)
								}
							/>
						</label>
						<button type="submit" className="quizmain-answer-submit">
							次の問題へ
						</button>
					</form>

					<DisplaySkill className="quizmain-displayskill" skills={hiddenSkills} />
				</>
			)}
		</>
	);
}

export default QuizMain;
