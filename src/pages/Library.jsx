import "./Library.css";
import Roulette from "../Components/Roulette";
import figureMaster from "../figure.json";
import { useState } from "react";
import DetailModal from "../Components/DetailModal";
import { FixedSizeGrid } from "react-window";
import ReactModal from "react-modal";
import { typeTranslate } from "../Components/Utility";
import { useNavigate } from "react-router-dom";

function Library() {
	const [detailIndex, setDetailIndex] = useState(null);
	const [isFiltering, setIsFiltering] = useState(false);
	// filter
	const [mpFilter, setMpFilter] = useState([true, true, true, true]);
	const [rarityfilter, setRarityFilter] = useState("all");
	const [colorFilter, setColorFilter] = useState([false, false, false]);
	const [typeFilter, setTypeFilter] = useState(["all", "all"]);
	const [textFilter, setTextFilter] = useState("");
	// sort
	const [selectedSort, setSelectedSort] = useState(0);

	const navigate = useNavigate();

	const filteredFigures = (() => {
		const rarityNumber = (e) => ["C", "UC", "R", "EX", "UX"].findIndex((val) => val === e);

		return [...Array(figureMaster.length).keys()]
			.filter((e) => mpFilter[figureMaster[e].mp]) // mp
			.filter((e) => rarityfilter === "all" || rarityfilter === figureMaster[e].rarity) // rarity
			.filter((e) => !colorFilter[0] || figureMaster[e].skills.some((skill) => skill.color === "gold")) // 金技
			.filter((e) => !colorFilter[1] || figureMaster[e].skills.some((skill) => skill.color === "purple")) // 紫技
			.filter((e) => !colorFilter[2] || figureMaster[e].skills.some((skill) => skill.color === "blue")) // 青技
			.filter((e) => typeFilter[0] === "all" || figureMaster[e].types.includes(typeFilter[0])) // type1
			.filter((e) => typeFilter[1] === "all" || figureMaster[e].types.includes(typeFilter[1])) // type2
			.filter(
				(e) =>
					figureMaster[e].name.includes(textFilter) ||
					figureMaster[e].ability.includes(textFilter) ||
					figureMaster[e].abilityDetail.includes(textFilter) ||
					figureMaster[e].skills.some(
						(skill) => skill.detail.includes(textFilter) || skill.name.includes(textFilter)
					)
			) // テキスト
			.sort((a, b) => {
				let isALarge = true;
				switch (selectedSort) {
					case 0:
						isALarge = figureMaster[a].name < figureMaster[b].name;
						break;
					case 1:
						isALarge = rarityNumber(figureMaster[a].rarity) < rarityNumber(figureMaster[b].rarity);
						break;
					case 2:
						isALarge = figureMaster[a].id < figureMaster[b].id;
						break;
					default:
						break;
				}
				return isALarge ? -1 : 1;
			});
	})();

	const rowSize = Math.min(5, Math.floor(window.innerWidth / 250) + 1);

	const Cell = ({ columnIndex, rowIndex, style }) => {
		let figureIndex = columnIndex + rowIndex * rowSize;

		if (figureIndex >= filteredFigures.length) return <></>;
		else figureIndex = filteredFigures[figureIndex];

		const figure = figureMaster[figureIndex];

		return (
			<div className="library-element" style={style} key={`library-${figure.name}`}>
				<Roulette
					className="library-figure-roulette"
					data={figure.skills}
					pos_x={100}
					pos_y={80}
					radius={70}
					onClick={() => setDetailIndex(figureIndex)}
				></Roulette>
				<p
					className="library-figure-name"
					onClick={() => setDetailIndex(figureIndex)}
					style={{ textDecoration: "underline" }}
				>
					{figure.name}
				</p>
			</div>
		);
	};

	const cellWidth = Math.max(230, window.innerWidth / rowSize);

	ReactModal.setAppElement("#root");

	if (isFiltering) {
		const typesList = [
			"Normal",
			"Fire",
			"Water",
			"Electric",
			"Grass",
			"Ice",
			"Psychic",
			"Fighting",
			"Poison",
			"Ground",
			"Flying",
			"Bug",
			"Rock",
			"Ghost",
			"Dragon",
			"Dark",
			"Steel",
			"Fairy",
		];
		return (
			<>
				<p>
					{filteredFigures.length}/{figureMaster.length}
				</p>
				{/* mp */}
				<div>
					mp :
					{["0", "1", "2", "3"].map((e, index) => {
						return (
							<label key={"filter-mp-" + e}>
								<input
									type="checkbox"
									checked={mpFilter[index]}
									onChange={(e) => {
										let tmp = [...mpFilter];
										tmp[index] = e.target.checked;
										setMpFilter(tmp);
									}}
								/>
								{e}
							</label>
						);
					})}
				</div>
				{/* rarity */}
				<div>
					レアリティ：
					<select value={rarityfilter} onChange={(e) => setRarityFilter(e.target.value)}>
						{["C", "UC", "R", "EX", "UX"].map((e) => {
							return (
								<option value={e} key={"filter-rarity-" + e}>
									{e}
								</option>
							);
						})}
						<option value={"all"}>指定しない</option>
					</select>
				</div>
				{/* skill color */}
				<div>
					ワザの色 :
					{["金", "紫", "青"].map((e, index) => {
						return (
							<label key={"filter-color-" + e}>
								<input
									type="checkbox"
									checked={colorFilter[index]}
									onChange={(e) => {
										let tmp = [...colorFilter];
										tmp[index] = e.target.checked;
										setColorFilter(tmp);
									}}
								/>
								{e}
							</label>
						);
					})}
				</div>
				{/* タイプ */}
				{[0, 1].map((typeNo) => {
					return (
						<div key={"filter-type-no-" + typeNo}>
							タイプ{typeNo + 1} :
							<select
								value={typeFilter[typeNo]}
								onChange={(e) => {
									let tmp = [...typeFilter];
									tmp[typeNo] = e.target.value;
									setTypeFilter(tmp);
								}}
							>
								{typesList.map((type) => {
									return (
										<option value={type} key={"filter-type-" + type + "-no-" + typeNo}>
											{typeTranslate(type)}
										</option>
									);
								})}
								<option value={"all"}>指定しない</option>
							</select>
						</div>
					);
				})}
				<hr />
				<div>
					<label>
						<input value={textFilter} onChange={(e) => setTextFilter(e.target.value)} />
					</label>
				</div>
				<hr />
				<div>
					並び替え：
					<select value={selectedSort} onChange={(e) => setSelectedSort(parseInt(e.target.value))}>
						{["名前", "レアリティ", "ID"].map((e, index) => {
							return (
								<option value={index} key={"filter-sort-" + e}>
									{e}
								</option>
							);
						})}
					</select>
				</div>
				<hr />
				<button
					onClick={() => {
						setMpFilter([true, true, true, true]);
						setRarityFilter("all");
						setColorFilter([false, false, false]);
						setTypeFilter(["all", "all"]);
						setTextFilter("");
					}}
				>
					リセット
				</button>
				<button onClick={() => setIsFiltering(false)}>絞り込み</button>
			</>
		);
	}

	return (
		<div className="library-all">
			<DetailModal
				isOpen={detailIndex !== null}
				onClose={() => setDetailIndex(null)}
				figure={figureMaster[detailIndex]}
				onRouletteClick={() => {}}
				decreaseIndex={() => {
					const place = filteredFigures.findIndex((e) => e === detailIndex);
					if (place !== 0) setDetailIndex(filteredFigures[place - 1]);
				}}
				increaseIndex={() => {
					const place = filteredFigures.findIndex((e) => e === detailIndex);
					if (place + 1 !== filteredFigures.length) setDetailIndex(filteredFigures[place + 1]);
				}}
			/>

			<div style={{ overflow: "hidden" }}>
				<FixedSizeGrid
					columnCount={rowSize}
					height={window.innerHeight}
					rowCount={Math.ceil(filteredFigures.length / rowSize)}
					rowHeight={230}
					// rowHeight={Math.max(window.innerHeight / 2.5, 230)}
					columnWidth={cellWidth}
					width={window.innerWidth}
				>
					{Cell}
				</FixedSizeGrid>
			</div>

			<div className="library-btns">
				<button onClick={() => navigate("/")} className="library-back-btn">
					ホームに戻る
				</button>
				<button onClick={() => setIsFiltering(true)} className="library-filter-btn">
					絞り込み
				</button>
			</div>
		</div>
	);
}

export default Library;
