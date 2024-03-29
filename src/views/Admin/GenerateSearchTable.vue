<template>
	<hk-card header="Generate Search Tables for Firebase">
		<div class="card-body">
			<p>
				Updates monster values to their correct types. A lot of numbers were saved as strings, but
				now need to be changed to numbers.
			</p>

			<q-select dark filled square class="select" label="Reference" v-model="ref" :options="refs" />
			<a class="btn bnt-large" @click="update()" :disabled="!ref || loading">
				<i aria-hidden="true" class="fas fa-file-edit" />
				{{ ref ? `Update ${ref}` : "Select a reference" }}
			</a>
			<span v-if="loading" class="ml-3">
				<span class="loader" />
			</span>
		</div>
	</hk-card>
</template>

<script>
import { db } from "src/firebase";
import { monsterMixin } from "src/mixins/monster";

export default {
	name: "GenerateSearchTable",
	mixins: [monsterMixin],
	data() {
		return {
			loading: false,
			ref: undefined,
			refs: ["npcs", "custom_items", "reminders", "players", "encounters", "campaigns"],
			search_ref: {
				npcs: "search_npcs",
				custom_items: "search_custom_items",
				reminders: "search_reminders",
				spells: "search_spells",
				conditions: "search_conditions",
				players: "search_players",
				encounters: "search_encounters",
				campaigns: "search_campaigns",
			},
			search_fields: {
				npcs: ["name->lower", "challenge_rating", "type", "avatar"],
				custom_items: ["name", "image"],
				reminders: ["title"],
				players: ["character_name", "campaign_id", "companions", "avatar"],
				// remove encounter:name and campaign:name after db name field conversion
				encounters: [
					"encounter:name",
					"finished",
					"name",
					"round",
					"turn",
					"entities:entity_count->count",
				],
				campaigns: [
					"campaign:name",
					"name",
					"timestamp",
					"advancement",
					"background",
					"players:player_count->count",
					"private",
				],
			},
		};
	},
	methods: {
		async update() {
			if (this.ref === undefined) {
				return;
			}
			this.loading = true;

			//Fetch the data
			const ref = db.ref(this.ref);
			await ref.once("value", async (snapshot) => {
				const users = snapshot.val();

				for (let uid in users) {
					if (this.ref === "encounters") {
						const campaigns = users[uid];
						console.group(`%cUser: ${uid}`, "color: #2c97de; font-weight: bold;");

						for (const cid in campaigns) {
							const entries = campaigns[cid];

							for (const key in entries) {
								let encounter = entries[key];

								// USE THIS TO CHANGE KEY FOR CAMPAIGN NAME FROM CAMPAING TO NAME
								if (encounter.encounter !== undefined) {
									if (encounter.name === undefined) {
										// Encounter name stored in .encounter should be in .name
										await db.ref(`encounters/${uid}/${cid}/${key}/name`).set(encounter.encounter);
										encounter.name = encounter.encounter;
									}
									// .encounter should be removed
									await db.ref(`encounters/${uid}/${cid}/${key}/encounter`).remove();
									delete encounter.encounter;
								}

								const search_entry = this.extractFields(encounter, this.search_fields[this.ref]);
								const search_ref = db.ref(
									`${this.search_ref[this.ref]}/${uid}/results/${cid}/${key}`
								);
								try {
									await search_ref.set(search_entry);
								} catch (error) {
									console.error(
										`Couldn't update ${this.search_ref[this.ref]} table`,
										key,
										encounter.name,
										error,
										search_entry
									);
								}
							}
							const count_ref = db.ref(`${this.search_ref[this.ref]}/${uid}/metadata/${cid}/count`);
							await count_ref.set(Object.keys(entries).length);
						}
						console.groupEnd();
					} else if (this.ref === "campaigns") {
						const campaigns = users[uid];
						console.group(`%cUser: ${uid}`, "color: #2c97de; font-weight: bold;");
						for (const cid in campaigns) {
							const campaign = campaigns[cid];
							console.log("camp obj", campaign);

							// USE THIS TO CHANGE KEY FOR CAMPAIGN NAME FROM CAMPAING TO NAME
							if (campaign.campaign !== undefined) {
								// A campaign key was found so db needs update
								if (campaign.name === undefined) {
									// campaign has old campaign key and NO name key. Name needs to be generated
									await db.ref(`campaigns/${uid}/${cid}/name`).set(campaign.campaign);
								}
								// campaign has old campaign key so needs to be removed
								await db.ref(`campaigns/${uid}/${cid}/campaign`).remove();
							}
							// If no campaign key found, no update needed.

							// const search_ref = db.ref(`${this.search_ref[this.ref]}/${uid}/results/${cid}`);
							// const search_entry = this.extractFields(campaign, this.search_fields[this.ref]);
							// const camp_enc_ref = db.ref(`encounters/${uid}/${cid}`)
							// const camp_encs = await camp_enc_ref.once('value');

							// // Campaign has no encounters yet
							// if (camp_encs.val() !== null) {
							// 	search_entry.encounter_count = Object.keys(camp_encs.val()).length;
							// }

							// try {
							// 	await search_ref.set(search_entry)
							// } catch(error) {
							// 	console.error(`Couldn't update ${this.search_ref[this.ref]} table`, cid, campaign.campaign, error, search_entry)
							// }

							// const count_ref = db.ref(`${this.search_ref[this.ref]}/${uid}/metadata/count`);
							// await count_ref.set(Object.keys(campaigns).length);
						}
						console.groupEnd();
						// const count_ref = db.ref(`${this.search_ref[this.ref]}/${uid}/metadata/count`);
						// await count_ref.set(Object.keys(campaigns).length);
					} else {
						const entries = users[uid];
						console.group(`%cUser: ${uid}`, "color: #2c97de; font-weight: bold;");

						for (let key in entries) {
							let entry = entries[key];
							const search_entry = this.extractFields(entry, this.search_fields[this.ref]);
							const search_ref = db.ref(`${this.search_ref[this.ref]}/${uid}/results/${key}`);
							try {
								await search_ref.set(search_entry);
							} catch (error) {
								console.error(
									`Couldn't update ${this.search_ref[this.ref]} table`,
									key,
									entry.name,
									error,
									search_entry
								);
							}
						}
						console.groupEnd();
						const count_ref = db.ref(`${this.search_ref[this.ref]}/${uid}/metadata/count`);
						await count_ref.set(Object.keys(entries).length);
					}
				}
			});

			this.loading = false;
			console.log(`%cFINISHED.`, "color: #83b547;");
		},
		extractFields(entry, fields) {
			let searchable_entry = {};
			for (const field of fields) {
				const [field_name, func] = field.split("->");
				let [og_field, s_field] = field_name.split(":");
				if (s_field === undefined) {
					s_field = og_field;
				}
				if (entry.hasOwnProperty(og_field)) {
					if (func === "count") {
						searchable_entry[s_field] = Object.keys(entry[og_field]).length;
					} else if (func === "lower") {
						searchable_entry[s_field] = entry[og_field].toLowerCase();
					} else {
						searchable_entry[s_field] = entry[og_field];
					}
				}
			}

			return searchable_entry;
		},
	},
};
</script>

<style lang="scss" scoped>
.select {
	max-width: 400px;
	margin-bottom: 20px;
}
</style>
