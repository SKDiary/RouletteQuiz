import "./Library.css";
import plateMaster from "../plate.json";
import { useState } from "react";
import ReactModal from "react-modal";
import { FixedSizeGrid } from "react-window";
import { useNavigate } from "react-router-dom";

function LibraryPlate() {
	const [selectedPlate, setSelectedPlate] = useState(null);
	const [isFiltering, setIsFiltering] = useState(false);
	// filter
	const [costFilter, setCostFilter] = useState([true, true, true, true, true]); // 0, 1, 2, 3, 4+
	const [rarityFilter, setRarityFilter] = useState("all");
	const [textFilter, setTextFilter] = useState("");
	// sort
	const [selectedSort, setSelectedSort] = useState(0);

	const navigate = useNavigate();

	const filteredPlates = (() => {
		const rarityNumber = (e) => ["C", "UC", "R", "EX", "UX"].findIndex((val) => val === e);

		return [...Array(plateMaster.length).keys()]
			.filter((e) => {
				const cost = parseInt(plateMaster[e].cost);
				if (cost >= 4) return costFilter[4];
				else return costFilter[cost];
			}) // cost
			.filter((e) => rarityFilter === "all" || rarityFilter === plateMaster[e].rarity) // rarity
			.filter(
				(e) =>
					plateMaster[e].name.includes(textFilter) ||
					plateMaster[e].detail.includes(textFilter)
			) // テキスト
			.sort((a, b) => {
				let isALarge = true;
				switch (selectedSort) {
					case 0:
						isALarge = plateMaster[a].name < plateMaster[b].name;
						break;
					case 1:
						isALarge = rarityNumber(plateMaster[a].rarity) < rarityNumber(plateMaster[b].rarity);
						break;
					case 2:
						isALarge = parseInt(plateMaster[a].cost) < parseInt(plateMaster[b].cost);
						break;
					default:
						break;
				}
				return isALarge ? -1 : 1;
			});
	})();

	const rowSize = Math.min(4, Math.floor(window.innerWidth / 300) + 1);

	const Cell = ({ columnIndex, rowIndex, style }) => {
		let plateIndex = columnIndex + rowIndex * rowSize;

		if (plateIndex >= filteredPlates.length) return <></>;
		else plateIndex = filteredPlates[plateIndex];

		const plate = plateMaster[plateIndex];

		return (
			<div className="library-element" style={style} key={`library-plate-${plate.name}`}>
				<div 
					className="library-plate-card"
					onClick={() => setSelectedPlate(plateIndex)}
					style={{
						border: "2px solid #ccc",
						borderRadius: "8px",
						padding: "10px",
						cursor: "pointer",
						height: "calc(100% - 4px)",
						width: "calc(100% - 4px)",
						overflow: "hidden",
						boxSizing: "border-box"
					}}
				>
					<h4 
						style={{ 
							margin: "0 0 10px 0", 
							color: "white",
							fontSize: "16px",
							height: "40px",
							overflow: "hidden"
						}}
					>
						{plate.name}
					</h4>
					<div style={{ fontSize: "14px", marginBottom: "5px" }}>
						<span style={{ backgroundColor: "dimgray", color: "lightgray", padding: "2px 4px" }}>
							コスト
						</span>
						{plate.cost}
					</div>
					<div style={{ fontSize: "14px", marginBottom: "10px" }}>
						<span style={{ backgroundColor: "dimgray", color: "lightgray", padding: "2px 4px" }}>
							レアリティ
						</span>
						<span style={{ 
							color: plate.rarity === "EX" || plate.rarity === "UX" ? "#FFD700" : 
								plate.rarity === "R" ? "#FF6B6B" : 
								plate.rarity === "UC" ? "#4ECDC4" : "#E8E8E8"
						}}>
							{plate.rarity}
						</span>
					</div>
					<p style={{ 
						fontSize: "13px", 
						margin: "0",
						height: "60px",
						overflow: "hidden",
						lineHeight: "1.3",
						color: "white"
					}}>
						{plate.detail}
					</p>
				</div>
			</div>
		);
	};

	const cellWidth = Math.max(280, window.innerWidth / rowSize);

	ReactModal.setAppElement("#root");

	if (isFiltering) {
		return (
			<>
				<p>
					{filteredPlates.length}/{plateMaster.length}
				</p>
				{/* cost */}
				<div>
					コスト :
					{["0", "1", "2", "3", "4+"].map((e, index) => {
						return (
							<label key={"filter-cost-" + e}>
								<input
									type="checkbox"
									checked={costFilter[index]}
									onChange={(e) => {
										let tmp = [...costFilter];
										tmp[index] = e.target.checked;
										setCostFilter(tmp);
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
					<select value={rarityFilter} onChange={(e) => setRarityFilter(e.target.value)}>
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
				<hr />
				<div>
					<label>
						<input 
							value={textFilter} 
							onChange={(e) => setTextFilter(e.target.value)} 
							placeholder="プレート名や効果で検索"
						/>
					</label>
				</div>
				<hr />
				<div>
					並び替え：
					<select value={selectedSort} onChange={(e) => setSelectedSort(parseInt(e.target.value))}>
						{["名前", "レアリティ", "コスト"].map((e, index) => {
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
						setCostFilter([true, true, true, true, true]);
						setRarityFilter("all");
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
			{/* Plate Detail Modal */}
			<ReactModal
				isOpen={selectedPlate !== null}
				onRequestClose={() => setSelectedPlate(null)}
				style={{
					content: {
						top: "50%",
						left: "50%",
						right: "auto",
						bottom: "auto",
						marginRight: "-50%",
						transform: "translate(-50%, -50%)",
						maxWidth: "500px",
						width: "90%",
						maxHeight: "80vh",
						overflow: "auto",
						backgroundColor: "#0d61af",
						border: "2px solid white"
					}
				}}
			>
				{selectedPlate !== null && (
					<div>
						<h2 style={{ color: "white" }}>{plateMaster[selectedPlate].name}</h2>
						<div style={{ marginBottom: "15px" }}>
							<span style={{ backgroundColor: "dimgray", color: "lightgray", padding: "2px 4px" }}>
								コスト
							</span>
							{plateMaster[selectedPlate].cost}
						</div>
						<div style={{ marginBottom: "15px" }}>
							<span style={{ backgroundColor: "dimgray", color: "lightgray", padding: "2px 4px" }}>
								レアリティ
							</span>
							<span style={{ 
								color: plateMaster[selectedPlate].rarity === "EX" || plateMaster[selectedPlate].rarity === "UX" ? "#FFD700" : 
									plateMaster[selectedPlate].rarity === "R" ? "#FF6B6B" : 
									plateMaster[selectedPlate].rarity === "UC" ? "#4ECDC4" : "#E8E8E8"
							}}>
								{plateMaster[selectedPlate].rarity}
							</span>
						</div>
						<hr />
						<p style={{ lineHeight: "1.6", color: "white" }}>{plateMaster[selectedPlate].detail}</p>
						<hr />
						<div style={{ display: "flex", justifyContent: "space-between", marginTop: "20px" }}>
							<button
								onClick={() => {
									const place = filteredPlates.findIndex((e) => e === selectedPlate);
									if (place !== 0) setSelectedPlate(filteredPlates[place - 1]);
								}}
								disabled={filteredPlates.findIndex((e) => e === selectedPlate) === 0}
							>
								← 前へ
							</button>
							<button onClick={() => setSelectedPlate(null)}>閉じる</button>
							<button
								onClick={() => {
									const place = filteredPlates.findIndex((e) => e === selectedPlate);
									if (place + 1 !== filteredPlates.length) setSelectedPlate(filteredPlates[place + 1]);
								}}
								disabled={filteredPlates.findIndex((e) => e === selectedPlate) === filteredPlates.length - 1}
							>
								次へ →
							</button>
						</div>
					</div>
				)}
			</ReactModal>

			<div style={{ overflow: "hidden", position: "relative" }}>
				<FixedSizeGrid
					columnCount={rowSize}
					height={window.innerHeight}
					rowCount={Math.ceil(filteredPlates.length / rowSize)}
					rowHeight={200}
					columnWidth={cellWidth}
					width={window.innerWidth}
				>
					{Cell}
				</FixedSizeGrid>
				
				<div className="library-btns">
					<button onClick={() => navigate("/")} className="library-back-btn">
						ホームに戻る
					</button>
					<button onClick={() => setIsFiltering(true)} className="library-filter-btn">
						絞り込み
					</button>
				</div>
			</div>
		</div>
	);
}

export default LibraryPlate;
