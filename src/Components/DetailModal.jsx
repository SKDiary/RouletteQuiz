import Modal from "react-modal";
import "./DetailModal.css";
import { damageString, defaultRouletteAngle, getColorCode, intRandom, typeTranslate } from "./Utility.jsx";
import Roulette from "./Roulette.jsx";
import DisplaySkill from "./DisplaySkill.jsx";
import { useCallback, useEffect, useRef, useState } from "react";

const useAnimationFrame = (isRunning, callback = () => {}) => {
	const reqIdRef = useRef();
	const loop = useCallback(() => {
		if (isRunning) {
			reqIdRef.current = requestAnimationFrame(loop);
			callback();
		}
	}, [isRunning, callback]);

	useEffect(() => {
		reqIdRef.current = requestAnimationFrame(loop);
		return () => {
			cancelAnimationFrame(reqIdRef.current);
		};
	}, [loop]);
};

function DetailModal({ isOpen, onClose, figure, increaseIndex, decreaseIndex }) {
	const [angle, setAngle] = useState(0);
	const [startRotateTime, setStartRotateTime] = useState(null);
	const [isRotated, setIsRotated] = useState(false);

	useEffect(() => {
		if (figure) {
			setAngle(defaultRouletteAngle(figure.skills));
		}
	}, [figure]);

	const spinTime = 1000;

	useAnimationFrame(startRotateTime !== null && new Date().getTime() - startRotateTime.getTime() < spinTime, () => {
		setAngle((e) => (e + 10) % 96);
	});

	const customModalStyles = {
		content: {
			color: "white",
			backgroundColor: "#094680",
			top: "5%",
			left: "30%",
			right: "auto",
			transform: "translate(-30%, 0%)",

			display: "flex",
			justifyContent: "center",
			gap: "5px",
			overflow: "auto",
		},
	};

	const onClickFunc = () => {
		if (!startRotateTime || new Date().getTime() - startRotateTime.getTime() > spinTime) {
			setAngle(intRandom(0, 95));
			setStartRotateTime(new Date());
			setIsRotated(true);
		}
	};

	const nthSkill = (ran) => {
		let range = (ran + 24) % 96;
		let acc = 96;
		for (let i = 0; i < figure.skills.length; i++) {
			acc -= figure.skills[i].range;
			if (acc <= range) return i;
		}
		return 0;
	};

	return (
		<Modal
			isOpen={isOpen}
			shouldCloseOnOverlayClick={true}
			onRequestClose={() => {
				onClose();
				setIsRotated(false);
			}}
			style={customModalStyles}
		>
			{isOpen && (
				<div>
					<div style={{ display: "flex", justifyContent: "space-between" }}>
						<div style={{ display: "flex", gap: "3px" }}>
							<button
								style={{ height: "25px" }}
								onClick={() => {
									decreaseIndex();
									setIsRotated(false);
									setStartRotateTime(null);
								}}
							>
								{"<"}
							</button>
							<p onClick={onClickFunc} style={{ textDecoration: "underline" }}>
								&nbsp;{figure.name}&nbsp;
							</p>
							<button
								style={{ height: "25px" }}
								onClick={() => {
									increaseIndex();
									setIsRotated(false);
									setStartRotateTime(null);
								}}
							>
								{">"}
							</button>
						</div>

						{isRotated &&
							startRotateTime &&
							new Date().getTime() - startRotateTime.getTime() >= spinTime && (
								<p style={{ color: getColorCode(figure.skills[nthSkill(angle)].color) }}>
									{"["}
									{figure.skills[nthSkill(angle)].name} {damageString(figure.skills[nthSkill(angle)])}
									{"]"}
								</p>
							)}
						<button
							onClick={() => {
								onClose();
								setIsRotated(false);
							}}
							style={{ height: "25px" }}
						>
							×
						</button>
					</div>

					<div className="detail-modal-figure">
						<Roulette
							className="detail-modal-roulette"
							data={figure.skills}
							pos_x={90}
							pos_y={100}
							radius={100}
							angle={angle}
							onClick={onClickFunc}
							mp={figure.mp}
							rarity={figure.rarity}
						/>

						<div className="detail-modal-detail">
							<p>
								<span style={{ backgroundColor: "dimgray", color: "lightgray" }}> ID </span>
								{figure.id}
								<br />
								<span style={{ backgroundColor: "dimgray", color: "lightgray" }}> タイプ </span>
								{figure.types.map((e) => typeTranslate(e)).join(", ")}
								<br />
								<span style={{ backgroundColor: "dimgray", color: "lightgray" }}> 特性 </span>
								{figure.ability}
							</p>
							<hr color="dimgray" />
							<p>{figure.abilityDetail}</p>
						</div>
					</div>

					<div>
						<DisplaySkill className="detail-modal-displayskill" skills={figure.skills} />
					</div>
				</div>
			)}
		</Modal>
	);
}

export default DetailModal;
