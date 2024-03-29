import axios from "axios";
import { range } from "lodash";

const SPELLS_REF = "/spells";

export class spellServices {
	constructor() {
		this.HK = axios.create({
			baseURL: process.env.VUE_APP_HK_API_ROOT,
		});
	}

	async getSpells(
		query,
		pageNumber = 1,
		pageSize = 15,
		fields = ["ALL"],
		sortBy = "name",
		descending = false
	) {
		const skip = (pageNumber - 1) * pageSize;
		const fieldsString = fields.join(" ");
		let params = `?skip=${skip}&limit=${pageSize}&fields=${fieldsString}`;

		if (sortBy) {
			params += `&sort=${sortBy}${descending ? ":desc" : ""}`;
		}

		if (query) {
			const queryParams = [];

			if (query.search) {
				queryParams.push(`name=${query.search}`);
			}
			if (query.schools && query.schools.length) {
				for (const school of query.schools) {
					queryParams.push(`school[]=${school}`);
				}
			}
			if (query.classes && query.classes.length) {
				for (const cls of query.classes) {
					queryParams.push(`classes[]=${cls}`);
				}
			}
			if (query.levels) {
				const levels = range(query.levels.min, query.levels.max + 1);
				for (const level of levels) {
					queryParams.push(`level[]=${level}`);
				}
			}
			params += `&${queryParams.join("&")}`;
		}

		return this.HK.get(SPELLS_REF + params)
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				throw error;
			});
	}

	async getSpell(id) {
		return this.HK.get(`${SPELLS_REF}/${id}`)
			.then((response) => {
				return response.data;
			})
			.catch((error) => {
				throw error;
			});
	}
}
