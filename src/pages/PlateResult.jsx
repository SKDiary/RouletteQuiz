import "./Result.css";
import plateMaster from "./../plate.json";
import { useEffect } from "react";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { Link, useLocation } from "react-router-dom";
import { difficultyName } from "../Components/Utility";

function PlateResult({ problemList, answerList, difficulty, setProblemList, setAnswerList }) {
	const search = useLocation().search;

	// urlクエリの処理
	useEffect(() => {
		const query = new URLSearchParams(search);

		if (!query.has("ver") && !query.has("a")) return;

		const version = query.has("ver") ? parseInt(query.get("ver")) : 0;

		// version 000 or 100
		// ルーレットなのになぜかプレートに来てる
		if (version === 0 || version === 100) {
			return (
				<Link to={"/"} className="home-start-btn">
					予期せぬエラーが発生しました
					<br />
					タイトルに戻ります
				</Link>
			);
		}

		// plate追加
		else if (version === 200) {
			let tmp = [];
			let tmpAns = [];
			for (let val of query.get("prob").split("-")) {
				tmp = [...tmp, parseInt(val)];
			}
			const answerQuery = query.get("ans").split("-");
			for (let i = 0; i < answerQuery.length; i++) {
				const val = answerQuery[i];
				tmpAns = [...tmpAns, val === "1" ? plateMaster[tmp[i]].name : ""];
			}

			setProblemList(tmp);
			setAnswerList(tmpAns);
		}
	}, [search, setAnswerList, setProblemList]);

	const isCorrect = problemList.map((prob, idx) => answerList[idx] === plateMaster[prob].name);

	// urlクエリ作成
	let shareStr = "";

	// ver 2.0.0
	// プレート追加に伴いプレートの場合&type=plateをつける
	if (true) {
		shareStr += "?ver=200&type=plate";
		shareStr += "&prob=" + problemList.join("-");
		shareStr += "&ans=" + isCorrect.map((e) => (e ? 1 : 0)).join("-");
	}

	// ver 1.0.0
	if (false) {
		shareStr += "?ver=100";
		shareStr += "&prob=" + problemList.join("-");
		shareStr += "&ans=" + isCorrect.map((e) => (e ? 1 : 0)).join("-");
	}

	// ver 0.0.0
	if (false) {
		for (let i = 0; i < problemList.length; i++) {
			shareStr += i === 0 ? "?" : "&";
			shareStr += String.fromCharCode("a".charCodeAt(0) + i);
			shareStr += "=";
			shareStr += problemList[i];

			shareStr += "&";
			shareStr += String.fromCharCode("A".charCodeAt(0) + i);
			shareStr += "=";
			shareStr += isCorrect[i] ? "1" : "0";
		}
	}

	if (answerList.length === 0) {
		return (
			<Link to={"/"} className="home-start-btn">
				予期せぬエラーが発生しました
				<br />
				タイトルに戻ります
			</Link>
		);
	}

	return (
		<>
			<div style={{ textAlign: "center", fontSize: "x-large" }}>
				<p>{isCorrect.filter((e) => e).length}問正解！</p>
				{difficulty === 3 && isCorrect.every((e) => e) && <p>難易度Extreamで全問正解!!</p>}
			</div>
			<div className="result-header">
				{problemList.map((probNum, idx) => {
					return (
						<p key={probNum} className={"result-resultcolor-" + (isCorrect[idx] ? "yellow" : "red")}>
							{isCorrect[idx] ? "○" : "×"}
						</p>
					);
				})}

				<TwitterShareButton
					title={`ルーレットクイズ [${difficultyName(difficulty)}] で10問中${
						isCorrect.filter((e) => e).length
					}問正解しました！`}
					hashtags={["ルーレットクイズ"]}
					url={"https://skdiary.github.io/RouletteQuiz/result" + shareStr}
				>
					<TwitterIcon size={44} round />
				</TwitterShareButton>
			</div>

			<div className={window.innerWidth <= 900 ? "result-list-all-mobile" : "result-list-all"}>
				{problemList.map((problemFigure, problemIndex) => {
					return (
						<div key={`result-list-${problemFigure}`} className="result-list-element">
							<div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
								<p style={{ fontSize: "x-large" }}>第{problemIndex + 1}問</p>
								<p className={"result-resultcolor-" + (isCorrect[problemIndex] ? "yellow" : "red")}>
									{isCorrect[problemIndex] ? "正解！" : "不正解"}
								</p>
							</div>
							<div
								style={{
									width: Math.min(380, window.innerWidth * 0.9),
									marginLeft: Math.min(15, window.innerWidth * 0.03),
								}}
							>
								<span style={{ backgroundColor: "dimgray", color: "lightgray" }}> コスト </span>
								{plateMaster[problemFigure].cost}
								<br />
								<span style={{ backgroundColor: "dimgray", color: "lightgray" }}> レアリティ </span>
								{plateMaster[problemFigure].rarity}
								<hr color="dimgray" />
								<p>{plateMaster[problemFigure].detail}</p>
								<hr color="dimgray" />

								<p>解答：{answerList[problemIndex]}</p>
								{!isCorrect[problemIndex] && <p>正解：{plateMaster[problemFigure].name}</p>}
							</div>
						</div>
					);
				})}
			</div>

			<Link to={"/"} className="home-start-btn">
				トップへ戻る
			</Link>
		</>
	);
}

export default PlateResult;
