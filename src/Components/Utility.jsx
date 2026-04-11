export function damageString(skill) {
	if ("altDamage" in skill) return skill.altDamage;
	else if (skill.color === "purple") return "★".repeat(skill.damage);
	else if (skill.color === "white" || skill.color === "gold") return "" + skill.damage;
	else return "";
}

export function getColorCode(color) {
	switch (color) {
		case "miss":
			return "#ea5050";
		case "blue":
			return "#56c4f2";
		case "purple":
			return "#c970e6";
		case "gold":
			return "#ead24c";
		case "white":
			return "#f9f9f9";
		default:
			return "#072e55";
	}
}

export function getDarkColorCode(color) {
	switch (color) {
		case "miss":
			return "#e44e4e";
		case "blue":
			return "#54beeb";
		case "purple":
			return "#c36de0";
		case "gold":
			return "#e4cc49";
		case "white":
			return "#f2f2f2";
		default:
			return "#072e55";
	}
}

export function intRandom(min, max) {
	return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function typeTranslate(name) {
	const typeNames = [
		{ en: "Normal", ja: "ノーマル" },
		{ en: "Fire", ja: "ほのお" },
		{ en: "Water", ja: "みず" },
		{ en: "Electric", ja: "でんき" },
		{ en: "Grass", ja: "くさ" },
		{ en: "Ice", ja: "こおり" },
		{ en: "Psychic", ja: "エスパー" },
		{ en: "Fighting", ja: "かくとう" },
		{ en: "Poison", ja: "どく" },
		{ en: "Ground", ja: "じめん" },
		{ en: "Flying", ja: "ひこう" },
		{ en: "Bug", ja: "むし" },
		{ en: "Rock", ja: "いわ" },
		{ en: "Ghost", ja: "ゴースト" },
		{ en: "Dragon", ja: "ドラゴン" },
		{ en: "Dark", ja: "あく" },
		{ en: "Steel", ja: "はがね" },
		{ en: "Fairy", ja: "フェアリー" },
	];
	for (let { en, ja } of typeNames) {
		if (en === name) return ja;
		if (ja === name) return en;
	}
	return null;
}

export function colorTranslate(name) {
	const colorNames = [
		{ en: "miss", ja: "ミス" },
		{ en: "white", ja: "白" },
		{ en: "gold", ja: "金" },
		{ en: "purple", ja: "紫" },
		{ en: "blue", ja: "青" },
	];
	for (let { en, ja } of colorNames) {
		if (en === name) return ja;
		if (ja === name) return en;
	}
	return "type-error";
}

export function difficultyName(diff) {
	switch (diff) {
		case 0:
			return "Easy";
		case 1:
			return "Normal";
		case 2:
			return "Hard";
		case 3:
			return "Extreme";
		case 4:
			return "エンドレス";
		case 5:
			return "プレート";
		default:
			return "difficulty-error";
	}
}

export function defaultRouletteAngle(skills) {
	const maxRangeIndex = (() => {
		let maxRange = -1;
		let res = 0;
		for (let i = 0; i < skills.length; i++) {
			if (skills[i].range > maxRange) {
				maxRange = skills[i].range;
				res = i;
			}
		}
		return res;
	})();
	let resultAngle = 0;
	for (let i = 0; i < maxRangeIndex; i++) {
		resultAngle += skills[i].range;
	}
	resultAngle += Math.floor(skills[maxRangeIndex].range / 2);
	resultAngle = (96 - resultAngle + 24) % 96;
	return resultAngle;
}
