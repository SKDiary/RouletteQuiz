import "./Result.css";
import figureMaster from "./../figure.json";
import Roulette from "../Components/Roulette";
import { useEffect, useState } from "react";
import { TwitterIcon, TwitterShareButton } from "react-share";
import { Link, useLocation, useNavigate } from "react-router-dom";
import DetailModal from "../Components/DetailModal";
import ReactModal from "react-modal";
import { difficultyName } from "../Components/Utility";

function Result({ problemList, answerList, difficulty, setProblemList, setAnswerList }) {
	const [detailFigure, setDetailFigure] = useState(null);
	const [endlessScore, setEndlessScore] = useState(-1);
	const navigate = useNavigate();

	const search = useLocation().search;

	// urlクエリの処理
	useEffect(() => {
		const query = new URLSearchParams(search);

		if (!query.has("ver") && !query.has("a")) return;

		const version = query.has("ver") ? parseInt(query.get("ver")) : 0;

		// version 0
		// a-kに問題, A-Kに正誤
		if (version === 0) {
			let tmp = [];
			let tmpAns = [];
			for (let i = 0; i < 26; i++) {
				const char = String.fromCharCode("a".charCodeAt(0) + i);
				if (!query.has(char)) break;
				tmp = [...tmp, parseInt(query.get(char))];
				tmpAns = [
					...tmpAns,
					query.get(String.fromCharCode("A".charCodeAt(0) + i)) === "1"
						? figureMaster[parseInt(query.get(char))].name
						: "",
				];
			}

			setProblemList(tmp);
			setAnswerList(tmpAns);
		}

		// probに問題, ansに正誤, ハイフンで繋ぐ
		else if (version === 100) {
			let tmp = [];
			let tmpAns = [];
			for (let val of query.get("prob").split("-")) {
				tmp = [...tmp, parseInt(val)];
			}
			const answerQuery = query.get("ans").split("-");
			for (let i = 0; i < answerQuery.length; i++) {
				const val = answerQuery[i];
				tmpAns = [...tmpAns, val === "1" ? figureMaster[tmp[i]].name : ""];
			}

			setProblemList(tmp);
			setAnswerList(tmpAns);
		}

		// plate対応
		else if (version === 200) {
			if (query.has("type")) {
				navigate("/plateresult" + search);
			} else {
				let tmp = [];
				let tmpAns = [];
				for (let val of query.get("prob").split("-")) {
					tmp = [...tmp, parseInt(val)];
				}
				const answerQuery = query.get("ans").split("-");
				for (let i = 0; i < answerQuery.length; i++) {
					const val = answerQuery[i];
					tmpAns = [...tmpAns, val === "1" ? figureMaster[tmp[i]].name : ""];
				}

				setProblemList(tmp);
				setAnswerList(tmpAns);

				if (query.has("score")) {
					setEndlessScore(parseInt(query.get("score")));
				}
			}
		}
	}, [search, setAnswerList, setProblemList]);

	const isCorrect = problemList.map(
		(prob, idx) => idx < answerList.length && answerList[idx] === figureMaster[prob].name
	);

	// urlクエリ作成
	let shareStr = "";

	// ver 2.0.0
	if (true) {
		shareStr += "?ver=200";
		if (difficulty !== 4) {
			shareStr += "&prob=" + problemList.join("-");
			shareStr += "&ans=" + isCorrect.map((e) => (e ? 1 : 0)).join("-");
		} else {
			shareStr += "&prob=" + problemList.slice(0, 10).join("-");
			shareStr +=
				"&ans=" +
				isCorrect
					.slice(0, 10)
					.map((e) => (e ? 1 : 0))
					.join("-");
			shareStr += "&score=" + isCorrect.filter((e) => e).length;
		}
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

	ReactModal.setAppElement("#root");

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
				<p>
					{difficulty === 4 || endlessScore !== -1 ? "エンドレスで" : ""}
					{isCorrect.filter((e) => e).length}問正解！
				</p>
				{difficulty === 3 && isCorrect.every((e) => e) && <p>難易度Extreamで全問正解!!</p>}
			</div>
			<div className="result-header">
				{difficulty !== 4 &&
					endlessScore === -1 &&
					problemList.map((probNum, idx) => {
						return (
							<p key={probNum} className={"result-resultcolor-" + (isCorrect[idx] ? "yellow" : "red")}>
								{isCorrect[idx] ? "○" : "×"}
							</p>
						);
					})}

				<TwitterShareButton
					url={"https://skdiary.github.io/RouletteQuiz/result" + shareStr}
					title={`ルーレットクイズ [${difficultyName(difficulty)}] で${difficulty !== 4 ? "10問中" : ""}${
						isCorrect.filter((e) => e).length
					}問正解しました！`}
					hashtags={["ルーレットクイズ"]}
				>
					<TwitterIcon size={44} round />
				</TwitterShareButton>
			</div>

			<DetailModal
				isOpen={detailFigure !== null}
				onClose={() => setDetailFigure(null)}
				figure={figureMaster[problemList[detailFigure]]}
				decreaseIndex={() => {
					if (detailFigure !== 0) setDetailFigure(detailFigure - 1);
				}}
				increaseIndex={() => {
					if (detailFigure + 1 !== problemList.length) setDetailFigure(detailFigure + 1);
				}}
			/>

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
							<div className="result-list-flex">
								<Roulette
									data={figureMaster[problemFigure].skills}
									pos_x={90}
									pos_y={80}
									radius={80}
								></Roulette>
								<div>
									<p>解答：{answerList[problemIndex]}</p>
									{!isCorrect[problemIndex] && <p>正解：{figureMaster[problemFigure].name}</p>}

									<button
										onClick={() => {
											setDetailFigure(problemIndex);
										}}
									>
										詳細を見る
									</button>
								</div>
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

export default Result;
