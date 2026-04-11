import { Arc, Circle, Group, Layer, Stage, Text } from "react-konva";
import "./Roulette.css";
import * as utility from "./Utility.jsx";

function RarityColor(rarity) {
	switch (rarity) {
		case "C":
			return "sienna";
		case "UC":
			return "silver";
		case "R":
			return "goldenrod";
		case "EX":
			return "lightskyblue";
		case "UX":
			return "darkmagenta";
		default:
			return "yellowgreen";
	}
}

function Roulette({
	data,
	pos_x,
	pos_y,
	radius,
	angle = utility.defaultRouletteAngle(data),
	onClick = () => {},
	className = "",
	mp = null,
	rarity = null,
}) {
	// データを長さ96に変形
	let skillPiece = [];

	for (let i = 0; i < data.length; i++) {
		for (let j = 0; j < data[i].range; j++) {
			skillPiece.push(i);
		}
	}

	let rangeAcc = [0];
	for (const skill of data) {
		rangeAcc.push(skill.range + rangeAcc[rangeAcc.length - 1]);
	}
	rangeAcc.shift();

	const textR = ((radius * 3) / 4) * 1.1;
	const damageR = ((radius * 3) / 4) * 0.7;
	const mpRarityR = radius * 0.2;

	const rangeToRadian = (range) => ((Math.PI * 2) / 96) * ((range + 96) % 96);

	pos_x += mpRarityR;

	return (
		<>
			<Stage
				className={className}
				width={pos_x + radius + 1 + mpRarityR}
				height={pos_y + radius + 1 + mpRarityR}
				key={data[0].name}
				onClick={onClick}
			>
				<Layer>
					{/* ワザ */}
					{skillPiece.map((piece, idx) => {
						return (
							<Arc
								key={`roulette-arc1-${idx}`}
								x={pos_x}
								y={pos_y}
								innerRadius={radius / 4}
								outerRadius={radius}
								angle={360 / 96 + 0.9}
								fill={
									idx % 2 === 0
										? utility.getColorCode(data[piece].color)
										: utility.getDarkColorCode(data[piece].color)
								}
								rotation={(360 / 96) * ((idx + angle) % 96)}
							></Arc>
						);
					})}

					{/* 周囲を囲む */}
					{data.map((skill, idx) => {
						return (
							<Arc
								key={`roulette-arc-border-${skill.name}${idx}`}
								x={pos_x}
								y={pos_y}
								innerRadius={radius / 4}
								outerRadius={radius}
								angle={(360 / 96) * skill.range}
								rotation={(360 / 96) * ((rangeAcc[idx] - skill.range + angle) % 96)}
								stroke="black" //枠線の色
								strokeWidth={1}
							/>
						);
					})}

					<Circle x={pos_x} y={pos_y} radius={radius / 4} fill={"black"} />

					<Circle x={pos_x} y={pos_y} radius={radius} stroke={"black"} strokeWidth={3} />

					{/* 技名を入れる */}
					{data.map((skill, skillidx) => {
						let marginRange = (skill.range / skill.name.length) * 1.0;
						marginRange = Math.min(marginRange, 3);

						let sideRange = (skill.range - skill.name.length * marginRange) / 2;
						if (sideRange < 0) sideRange = 0;

						return (
							<Group key={`roulette-skillname-${skill.name}-${skillidx}`}>
								{skill.name.split("").map((char, charidx) => (
									<Group key={"roulette-char-" + charidx + skill.name + char + skillidx}>
										<Text
											x={
												pos_x +
												textR *
													Math.cos(
														rangeToRadian(
															angle +
																rangeAcc[skillidx] -
																sideRange -
																charidx * marginRange
														)
													)
											}
											y={
												pos_y +
												textR *
													Math.sin(
														rangeToRadian(
															angle +
																rangeAcc[skillidx] -
																sideRange -
																charidx * marginRange
														)
													)
											}
											fill="black"
											fontSize={radius / 10}
											fontFamily="Arial"
											fontStyle="bold"
											text={char}
											rotation={
												270 +
												(90 *
													(angle + rangeAcc[skillidx] - sideRange - charidx * marginRange)) /
													24
											}
										/>
									</Group>
								))}

								{(skill.color === "white" || skill.color === "gold" || skill.color === "purple") && (
									<Text
										x={
											pos_x +
											damageR *
												Math.cos(
													rangeToRadian(angle + rangeAcc[skillidx] - skill.range / 2 + 7)
												)
										}
										y={
											pos_y +
											damageR *
												Math.sin(
													rangeToRadian(angle + rangeAcc[skillidx] - skill.range / 2 + 7)
												)
										}
										fill="black"
										fontSize={radius / 4 + (skill.color === "purple" ? -2 : 0)}
										fontFamily="Arial"
										fontStyle="bold"
										text={utility.damageString(skill)}
										rotation={270 + (90 * (angle + rangeAcc[skillidx] - skill.range / 2)) / 24}
									/>
								)}
							</Group>
						);
					})}

					{/* mp */}
					{mp !== null && (
						<>
							<Circle
								x={pos_x + Math.sin(Math.PI / 4) * (radius + mpRarityR * 1.3)}
								y={pos_y + Math.cos(Math.PI / 4) * (radius + mpRarityR * 1.3)}
								radius={mpRarityR}
								fill={"crimson"}
							/>
							<Text
								x={pos_x + Math.sin(Math.PI / 4) * (radius + mpRarityR)}
								y={pos_y + Math.cos(Math.PI / 4) * (radius + mpRarityR)}
								fill="white"
								fontSize={mpRarityR}
								fontFamily="Arial"
								fontStyle="bold"
								text={mp ? String(mp) : "0"}
							/>
						</>
					)}

					{/* Rarity */}
					{rarity !== null && (
						<>
							<Circle
								x={pos_x - Math.sin(Math.PI / 4) * (radius + mpRarityR * 1.3)}
								y={pos_y + Math.cos(Math.PI / 4) * (radius + mpRarityR * 1.3)}
								radius={mpRarityR}
								fill={RarityColor(rarity)}
							/>
							<Text
								x={
									pos_x -
									Math.sin(Math.PI / 4) *
										(radius + mpRarityR * (1.8 + (rarity.length >= 2 ? 0.3 : 0)))
								}
								y={pos_y + Math.cos(Math.PI / 4) * (radius + mpRarityR)}
								fill="white"
								fontSize={mpRarityR}
								fontFamily="Arial"
								fontStyle="bold"
								text={rarity}
							/>
						</>
					)}
				</Layer>
			</Stage>
		</>
	);
}

export default Roulette;
