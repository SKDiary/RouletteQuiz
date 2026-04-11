import { useEffect, useState } from "react";
import plateMaster from "./../plate.json";
import { Link, useNavigate } from "react-router-dom";
import "./PlateQuiz.css";

function PlateQuiz({ problemList, answerList, setAnswerList }) {
	const [problemIndex, setProblemIndex] = useState(0);
	const [thisAnswer, setThisAnswer] = useState("");
	const problemSize = problemList.length;

	const navigate = useNavigate();

	useEffect(() => {
		setAnswerList(Array(problemSize).fill(""));
	}, [problemSize, setAnswerList]);

	const nextProblem = (e) => {
		e.preventDefault();

		let tmp = [...answerList];
		tmp[problemIndex] = thisAnswer;
		setAnswerList(tmp);

		setThisAnswer("");

		if (problemIndex + 1 === problemSize) {
			navigate("/plateresult");
		} else {
			setProblemIndex(problemIndex + 1);
		}
	};

	return problemList.length === 0 ? (
		<Link to={"/"} className="home-start-btn">
			予期せぬエラーが発生しました
			<br />
			タイトルに戻ります
		</Link>
	) : (
		<>
			{/* ヘッダー */}
			<div className="platequiz-header">
				<p>第{problemIndex + 1}問</p>

				{/* <p>結果：</p> */}
				<div className="platequiz-result-items">
					{problemList.map((probNum, idx) => {
						const correct =
							idx < problemIndex ? (answerList[idx] === plateMaster[probNum].name ? 1 : 0) : -1;
						return (
							<p
								key={probNum}
								className={
									"platequiz-resultcolor-" + (correct === -1 ? "white" : correct ? "yellow" : "blue")
								}
							>
								{correct === -1 ? "ー" : correct ? "○" : "×"}
							</p>
						);
					})}
				</div>
			</div>

			{/* 問題 */}
			{problemList.length !== 0 && (
				<>
					<div className="platequiz-problem">
						{/* <p>プレートの絵が入る</p> */}

						<div className="platequiz-figure-detail">
							<span style={{ backgroundColor: "dimgray", color: "lightgray" }}> コスト </span>
							{plateMaster[problemList[problemIndex]].cost}
							<br />
							<span style={{ backgroundColor: "dimgray", color: "lightgray" }}> レアリティ </span>
							{plateMaster[problemList[problemIndex]].rarity}
							<br />
							<span style={{ backgroundColor: "dimgray", color: "lightgray" }}> 効果 </span>
							<hr color="dimgray" />
							<p>{plateMaster[problemList[problemIndex]].detail}</p>
						</div>
					</div>

					<form className="platequiz-answer-form" onSubmit={nextProblem}>
						<label>
							解答：
							<input
								name="answer"
								value={thisAnswer}
								onChange={(event) => setThisAnswer(event.target.value)}
							/>
						</label>
						<button type="submit" className="platequiz-answer-submit">
							次の問題へ
						</button>
					</form>
				</>
			)}
		</>
	);
}

export default PlateQuiz;
