import "./DisplaySkill.css";
import * as utility from "./../Components/Utility.jsx";
import { Fragment } from "react";

function DisplaySkill({ skills, className = "" }) {
	return (
		<table className={`${className}`} width={`${Math.min(800, window.innerWidth * 0.8)}px`}>
			<thead>
				<tr className="displayskill-caption">
					<th>大きさ</th>
					<th>ワザ</th>
					<th>ダメージ</th>
				</tr>
			</thead>

			<tbody>
				{skills.map((skill, index) => {
					return (
						<Fragment key={`displayskill-skill-no-${index}-${skill.name}`}>
							<tr
								className="displayskill-skill"
								style={{
									backgroundColor: utility.getColorCode(skill.color),
									borderLeft: "none",
									borderRight: "none",
								}}
							>
								<td className="displayskill-range">{skill.range}</td>
								<td className="displayskill-name">{skill.name}</td>
								<td className="displayskill-damage">{utility.damageString(skill)}</td>
							</tr>

							{skill.detail !== "" && (
								<tr>
									<td className="displayskill-detail" colSpan={3}>
										{skill.detail}
									</td>
								</tr>
							)}
						</Fragment>
					);
				})}
			</tbody>
		</table>
	);
}

export default DisplaySkill;
