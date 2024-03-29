import Vue from "vue";
import { spellServices } from "src/services/api/spells";

const spell_state = () => ({
	spell_services: null,
	cached_spells: {},
	cached_urls: {},
});
const spell_getters = {
	spell_services: (state) => {
		return state.spell_services;
	},
	get_api_spell: (state) => (key) => {
		const id = state.cached_urls[key] || key;
		return state.cached_spells[id];
	},
};
const spell_actions = {
	async get_spell_services({ getters, commit }) {
		if (getters.spell_services === null || !Object.keys(getters.spell_services).length) {
			commit("SET_SPELL_SERVICES", new spellServices());
		}
		return getters.spell_services;
	},

	async fetch_api_spells(
		{ dispatch },
		{ pageNumber, pageSize, query, fields, sortBy, descending }
	) {
		const services = await dispatch("get_spell_services");
		try {
			return await services.getSpells(query, pageNumber, pageSize, fields, sortBy, descending);
		} catch (error) {
			console.error(error);
		}
	},

	/**
	 * Gets a single spell from the database using and id (or kebab name)
	 * and saves the spell in de store
	 *
	 * @param {number | string} id | kebab name
	 * @returns {object} spell
	 */
	async fetch_api_spell({ commit, state, dispatch }, id) {
		const cached = state.cached_spells;
		let spell = undefined;

		// SRD Monsters
		if (isNaN(id)) {
			spell = Object.values(cached).filter((item) => {
				return item.url === id;
			})[0];
		} else {
			spell = cached[id];
		}

		// Fetch the spell from the database if it wasn't cached yet
		if (!spell) {
			const services = await dispatch("get_spell_services");
			try {
				spell = await services.getSpell(id);

				// Create meta tags
				const maxLength = 160 - 26;
				const description = spell.desc
					? `${spell.desc.join(" ").substring(0, maxLength).trim()}...`
					: "...";

				spell.meta = {
					title: `${spell.name} D&D 5e`,
					description: `D&D 5th Edition Spell: ${description}`,
				};

				commit("SET_CACHED_SPELL", spell);
				commit("SET_CACHED_URL", { url: spell.url, id: spell._id });
			} catch (error) {
				throw error;
			}
		}
		return spell;
	},
};
const spell_mutations = {
	SET_SPELL_SERVICES(state, payload) {
		Vue.set(state, "spell_services", payload);
	},
	SET_CACHED_SPELL(state, payload) {
		Vue.set(state.cached_spells, payload["_id"], payload);
	},
	SET_CACHED_URL(state, { url, id }) {
		Vue.set(state.cached_urls, url, id);
	},
};

export default {
	namespaced: true,
	state: spell_state,
	getters: spell_getters,
	actions: spell_actions,
	mutations: spell_mutations,
};
