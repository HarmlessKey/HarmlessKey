import { abilities, damage_types, skills } from "src/utils/generalConstants";
import { general } from "./general";

export const monsterMixin = {
	mixins: [general],
	data() {
		return {
			abilities: abilities,
			monster_challenge_rating: {
				0: { proficiency: 2, xp: 10 },
				0.125: { proficiency: 2, xp: 25 },
				0.25: { proficiency: 2, xp: 50 },
				0.5: { proficiency: 2, xp: 100 },
				1: { proficiency: 2, xp: 200 },
				2: { proficiency: 2, xp: 450 },
				3: { proficiency: 2, xp: 700 },
				4: { proficiency: 2, xp: 1100 },
				5: { proficiency: 3, xp: 1800 },
				6: { proficiency: 3, xp: 2300 },
				7: { proficiency: 3, xp: 2900 },
				8: { proficiency: 3, xp: 3900 },
				9: { proficiency: 4, xp: 5000 },
				10: { proficiency: 4, xp: 5900 },
				11: { proficiency: 4, xp: 7200 },
				12: { proficiency: 4, xp: 8400 },
				13: { proficiency: 5, xp: 10000 },
				14: { proficiency: 5, xp: 11500 },
				15: { proficiency: 5, xp: 13000 },
				16: { proficiency: 5, xp: 15000 },
				17: { proficiency: 6, xp: 18000 },
				18: { proficiency: 6, xp: 20000 },
				19: { proficiency: 6, xp: 22000 },
				20: { proficiency: 6, xp: 25000 },
				21: { proficiency: 7, xp: 33000 },
				22: { proficiency: 7, xp: 41000 },
				23: { proficiency: 7, xp: 50000 },
				24: { proficiency: 7, xp: 62000 },
				25: { proficiency: 8, xp: 75000 },
				26: { proficiency: 8, xp: 90000 },
				27: { proficiency: 8, xp: 105000 },
				28: { proficiency: 8, xp: 120000 },
				29: { proficiency: 9, xp: 135000 },
				30: { proficiency: 9, xp: 155000 },
			},
			monster_sizes: ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"],
			monster_environments: ["arctic", "coastal", "desert", "forest", "grassland", "hill", "mountain", "swamp", "underdark", "underwater", "urban"],
			monster_subtypes: {
				Fiend: ["Demon", "Devil", "Shapechanger"],
				Humanoid: [
					"Any race",
					"Dwarf",
					"Elf",
					"Gnoll",
					"Gnome",
					"Goblinoid",
					"Grimlock",
					"Human",
					"Shapechanger",
					"Kobold",
					"Lizardfolk",
					"Merfolk",
					"Orc",
					"Sahuagin",
				],
				Monstrosity: ["Shapechanger", "Titan"],
				Undead: ["Shapechanger"],
			},
			monster_types: [
				"Aberration",
				"Beast",
				"Celestial",
				"Construct",
				"Dragon",
				"Elemental",
				"Fey",
				"Fiend",
				"Giant",
				"Humanoid",
				"Monstrosity",
				"Ooze",
				"Plant",
				"Swarm of tiny beasts",
				"Undead",
			],
			monster_alignment: [
				"Any alignment",
				"Unaligned",
				"Lawful good",
				"Neutral good",
				"Chaotic good",
				"Lawful neutral",
				"Neutral",
				"Chaotic neutral",
				"Lawful evil",
				"Neutral evil",
				"Chaotic evil",
			],
			monster_senses: ["blindsight", "darkvision", "tremorsense", "truesight"],
			conditions: [
				"blinded",
				"charmed",
				"deafened",
				"exhaustion",
				"frightened",
				"grappled",
				"incapacitated",
				"invisible",
				"paralyzed",
				"petrified",
				"poisoned",
				"prone",
				"restrained",
				"stunned",
				"unconscious",
			],
		};
	},
	methods: {
		defensesDisplay(defenses) {
			defenses.forEach((defense, i) => {
				defense = defense.split("_");
				defenses[i] = defense.join(" ").capitalizeEach();
			});
			return defenses;
		},
		/**
		 * Parse an old monster to the new format
		 * @param {object} monster The old monster object
		 * @returns {object} The new monster object
		 */
		parseMonster(monster, uid, key) {
			let new_monster = {};
			new_monster.name = monster.name ? monster.name.toLowerCase() : "monster name"; // required
			new_monster.challenge_rating =
				Number(monster.challenge_rating) && !isNaN(monster.challenge_rating)
					? monster.challenge_rating
					: 1; // required
			if (monster.size) new_monster.size = monster.size.toLowerCase().capitalize(); // required
			if (monster.type) new_monster.type = monster.type.toLowerCase().capitalize(); // required
			if (monster.subtype) new_monster.subtype = monster.subtype.toLowerCase().capitalize();
			if (monster.alignment) new_monster.alignment = monster.alignment.toLowerCase().capitalize();
			if (monster.avatar) new_monster.avatar = monster.avatar;

			new_monster.armor_class = monster.ac ? parseInt(monster.ac) : 1; // required
			new_monster.armor_class = Math.min(new_monster.armor_class, 99); // limit AC to max 99
			new_monster.armor_class = Math.max(new_monster.armor_class, 1); // limit AC to min 1

			new_monster.hit_points = monster.maxHp ? parseInt(monster.maxHp) : 1; // required
			new_monster.hit_points = Math.min(new_monster.hit_points, 9999); // limit HP to max 9999
			new_monster.hit_points = Math.max(new_monster.hit_points, 1); // limit HP to min 1

			if (monster.hit_dice) new_monster.hit_dice = monster.hit_dice;
			if (monster.friendly) new_monster.friendly = true;

			let proficiency = 0;
			if (this.monster_challenge_rating[new_monster.challenge_rating].proficiency) {
				proficiency = this.monster_challenge_rating[new_monster.challenge_rating].proficiency;
			}

			if (!new_monster.size || !this.monster_sizes.includes(new_monster.size)) {
				new_monster.size = "Medium";
			}
			if (!new_monster.type || !this.monster_types.includes(new_monster.type)) {
				new_monster.type = "Beast";
			}

			// Abilities & Saving Throws
			new_monster.saving_throws = [];
			for (const ability of this.abilities) {
				new_monster[ability] = monster[ability] || 10;
				new_monster[ability] = Math.min(new_monster[ability], 99);
				new_monster[ability] = Math.max(new_monster[ability], 0);

				if (monster[`${ability}_save`]) {
					new_monster.saving_throws.push(ability);
				}
			}
			if (new_monster.saving_throws.length === 0) delete new_monster.saving_throws;

			// Skills
			new_monster.skills = [];
			new_monster.skills_expertise = [];
			for (const skill of Object.values(skills)) {
				const modifier = monster[skill.value];

				// Save proficiency
				if (modifier) {
					new_monster.skills.push(skill.value);

					// Check for expertise
					// If the modifier in old_monster is higher than the ability_mod + proficiency
					// that means there is expertise
					if (modifier > proficiency + this.calcMod(new_monster[skill.ability])) {
						new_monster.skills_expertise.push(skill.value);
					}
				}
			}
			if (new_monster.skills.length === 0) delete new_monster.skills;
			if (new_monster.skills_expertise.length === 0) delete new_monster.skills_expertise;

			// Speed
			if (monster.speed) {
				const speed_types = ["swim", "fly", "burrow", "climb"];
				let match = [];
				let max = 10;
				const reg = /(\d+)\D*/g;
				while (max > 0 && (match = reg.exec(monster.speed))) {
					max--; // FAILSAFE
					const string = match[0];
					const value = match[1];
					let found = false;
					for (const type of speed_types) {
						if (string.toLowerCase().includes(type)) {
							new_monster[`${type}_speed`] = value;
							found = true;
							break;
						}
					}
					if (!found) new_monster.walk_speed = value;
				}
			} else {
				new_monster.walk_speed = 0;
			}

			// Languages
			const languages = monster.languages ? monster.languages.split(",") : null;

			if (languages) {
				new_monster.languages = [];
				for (const language of languages) {
					new_monster.languages.push(language.toLowerCase().trim().capitalize());
				}
			}

			// Senses
			const senses = monster.senses ? monster.senses.split(",") : null;
			if (senses) {
				new_monster.senses = {};
				for (const sense of senses) {
					for (const monster_sense of this.monster_senses) {
						if (sense.trim().includes(monster_sense)) {
							let new_sense = {};
							new_sense[monster_sense] = true;

							if (sense.match(/(\d)+/g)) {
								new_sense.range = parseInt(sense.match(/(\d)+/g)[0]);
							}
							new_monster.senses[monster_sense] = new_sense;
						}
					}
				}
			}

			// Defenses
			let defenses = {
				damage_resistances: monster.damage_resistances,
				damage_vulnerabilities: monster.damage_vulnerabilities,
				damage_immunities: monster.damage_immunities,
			};

			const resistances = ["damage_resistances", "damage_vulnerabilities", "damage_immunities"];

			for (const resistance_type of resistances) {
				new_monster[resistance_type] = [];

				if (defenses[resistance_type]) {
					for (const type of damage_types) {
						if (
							defenses[resistance_type].toLowerCase().search(type) > -1 &&
							!new_monster[resistance_type].includes(type)
						) {
							new_monster[resistance_type].push(type);
						}
					}
				}
				if (new_monster[resistance_type].length === 0) delete new_monster[resistance_type];
			}

			const condition_immunities = monster.condition_immunities
				? monster.condition_immunities.split(",")
				: null;

			if (condition_immunities) {
				new_monster.condition_immunities = [];
				for (let immunity of condition_immunities) {
					if (immunity) {
						const trimmed_immunity = immunity.trim().toLowerCase();
						if (this.conditions.includes(trimmed_immunity)) {
							new_monster.condition_immunities.push(trimmed_immunity);
						}
					}
				}
			}

			// Abilities
			for (const action_type of [
				"special_abilities",
				"actions",
				"legendary_actions",
				"reactions",
			]) {
				if (monster[action_type]) {
					new_monster[action_type] = [];

					for (const ability of monster[action_type]) {
						// Store a list of actions in the list
						// We will use only 1 action now, for damage or healing
						// But later we might want to add conditions and reminders
						// These might be applied in a different way, so with a different action
						if (!ability) {
							continue;
						}
						const newAbility = {
							name: ability.name || "Unnamed Ability",
							desc: ability.desc || null,
							action_list: [
								{
									type: "other",
								},
							],
						};
						let fail_miss = "";

						if (action_type === "legendary_actions") newAbility.legendary_cost = 1;

						// Find recharge, limit and legendary cost
						if (ability.name && ability.name.match(/\((.*?)\)/g)) {
							const type = ability.name.match(/\((.*?)\)/g)[0];

							if (type.toLowerCase().includes("recharge")) {
								if (type.match(/\d+(-\d+)*/)) {
									newAbility.recharge = type.match(/\d+(-\d+)*/)[0];
								} else {
									newAbility.recharge = "rest";
								}
							}
							if (type.toLowerCase().includes("day")) {
								newAbility.limit = type.match(/(\d)+/g) ? type.match(/(\d)+/g)[0] : 1;
								newAbility.limit_type = "day";
							}
							if (type.toLowerCase().includes("turn")) {
								newAbility.limit = type.match(/(\d)+/g) ? type.match(/(\d)+/g)[0] : 1;
								newAbility.limit_type = "turn";
							}
							if (action_type === "legendary_actions" && type.toLowerCase().includes("costs")) {
								newAbility.legendary_cost = type.match(/(\d)+/g) ? type.match(/(\d)+/g)[0] : 1;
							}
							newAbility.name = newAbility.name.replace(type, "").trim();
						}

						if (
							ability.damage_dice ||
							(ability.desc && ability.desc.toLowerCase().match(/(saving throw)/g))
						) {
							// Find the range
							const reach = ability.desc
								? ability.desc.toLowerCase().match(/reach\s?(\d+(?:\/\d+)?)/)
								: null;
							const range = ability.desc
								? ability.desc.toLowerCase().match(/range\s?(\d+(?:\/\d+)?)/)
								: null;

							if (reach) newAbility.reach = parseInt(reach[1]);
							if (range) newAbility.range = range[1];

							// Check if it's a targeted action or saving throw
							if (ability.attack_bonus && ability.attack_bonus !== 0) {
								if (ability.desc && ability.desc.toLowerCase().match(/(melee weapon)/g))
									newAbility.action_list[0].type = "melee_weapon";
								else if (ability.desc && ability.desc.toLowerCase().match(/(ranged weapon)/g))
									newAbility.action_list[0].type = "ranged_weapon";
								else newAbility.action_list[0].type = "melee_weapon";

								newAbility.action_list[0].attack_bonus = ability.attack_bonus;
								fail_miss = "miss_mod";
							} else {
								newAbility.action_list[0].type = "save";
								fail_miss = "save_fail_mod";

								const save_dc = ability.desc ? ability.desc.match(/DC\s?(\d+)/) : null;
								if (save_dc) {
									newAbility.action_list[0].save_dc = parseInt(save_dc[1]);
								}

								// Find the ability
								for (const ab of this.abilities) {
									if (ability.desc && ability.desc.toLowerCase().search(ab) > -1) {
										newAbility.action_list[0].save_ability = ab;
									}
								}
							}

							// Create an array of damage types found in the description
							let types = [];
							for (const type of damage_types) {
								const position = ability.desc ? ability.desc.toLowerCase().search(type) : -1;
								if (position > -1 && !types.includes(type)) {
									// Make sure they're in the correct order
									if (types[0] && position > ability.desc.toLowerCase().search(types[0])) {
										types.push(type);
									} else {
										types.unshift(type);
									}
								}
							}

							newAbility.action_list[0].rolls = [];
							let actually_fixed = null;
							if (ability.damage_dice) {
								ability.damage_dice.split("+").forEach((damage, index) => {
									const damage_type = types[index] ? types[index] : "slashing";
									let newRoll = {
										damage_type,
									};

									const input = damage.split("d");
									if (input.length == 2) {
										newRoll.dice_count = parseInt(input[0]);
										newRoll.dice_type = parseInt(input[1]);
										if (isNaN(newRoll.dice_count)) {
											console.log(damage);
										}
									} else {
										actually_fixed = parseInt(input[0]) || null;
									}

									newRoll[fail_miss] = fail_miss === "miss_mod" ? 0 : 0.5;

									newAbility.action_list[0].rolls.push(newRoll);
								});

								// Check if there is a damage bonus
								// Add it only once (to the first roll by default, this might be wrong in some cases)
								if (ability.damage_bonus && newAbility.action_list[0].rolls.length > 0) {
									newAbility.action_list[0].rolls[0].fixed_val = parseInt(ability.damage_bonus);
								} else if (actually_fixed) {
									newAbility.action_list[0].rolls[0].fixed_val = parseInt(actually_fixed);
								}
							}
						}
						new_monster[action_type].push(newAbility);
					}
				}
			}
			// Legendary action count
			if (new_monster.legendary_actions && new_monster.legendary_actions.length > 0) {
				new_monster.legendary_count = 3;
			}
			return new_monster;
		},
	},
};
