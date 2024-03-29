<template>
	<div>
		<q-select
			v-if="subclass.class === 'custom'"
			:dark="$store.getters.theme === 'dark'"
			filled
			square
			label="Ability Score Improvements"
			v-model="subclass.asi"
			:options="levels"
			multiple
			@input="save(valid)"
		/>
		<q-list
			:dark="$store.getters.theme === 'dark'"
			square
			class="accordion"
			v-for="level in 20"
			:key="`features-${classIndex}-${level}`"
		>
			<template v-if="subclass.level >= level">
				<h4 class="feature-title">
					Level {{ level }}
					<a @click="addFeature(level, valid)" class="btn btn-sm bg-neutral-5">
						<i class="fas fa-plus green mr-1" aria-hidden="true" />
						Add feature
					</a>
				</h4>
				<q-expansion-item
					v-for="(feature, index) in character.level_features(classIndex, level)"
					:key="`feature-${level}-${index}`"
					:dark="$store.getters.theme === 'dark'"
					switch-toggle-side
					:group="`features-${level}`"
				>
					<template v-slot:header>
						<q-item-section avatar>
							<q-icon size="small" :name="feature.display ? 'fas fa-eye' : 'fas fa-eye-slash'">
								<q-tooltip anchor="top middle" self="center middle">
									{{ feature.display ? "Displayed on Sheet" : "Hidden on Sheet" }}
								</q-tooltip>
							</q-icon>
						</q-item-section>
						<q-item-section>
							{{ feature.name }}
						</q-item-section>
						<q-item-section avatar>
							<div class="actions" v-if="!isNaN(feature.index)">
								<a
									class="btn btn-sm bg-neutral-5"
									@click.stop="confirmDeleteFeature(level, feature.index, feature.name, valid)"
								>
									<i class="fas fa-trash-alt" aria-hidden="true" />
								</a>
							</div>
							<span v-else class="neutral-2">{{ feature.source }}</span>
						</q-item-section>
					</template>

					<div class="accordion-body">
						<!-- ASI / FEAT -->
						<template v-if="feature.asi">
							<p>{{ asi_text }} <span class="neutral-2">(phb 15)</span></p>
							<p>
								Using the optional feats rule, you can forgo taking this feature to take a feat of
								your choice instead.
								<span class="neutral-2">(phb 165)</span>
							</p>

							<q-select
								:dark="$store.getters.theme === 'dark'"
								filled
								square
								class="mb-3"
								placeholder="ASI or Feat"
								emit-value
								map-options
								:options="[
									{ value: 'asi', label: 'Ability Score Improvement' },
									{ value: 'feat', label: 'Feat' },
								]"
								@input="saveFeatureType(level, $event)"
								:value="asiOrFeat(level)"
							/>
						</template>

						<!-- ASI -->
						<div v-if="feature.asi">
							<p>Choose 2 abilities to increase with 1 point</p>
							<div v-for="i in [0, 1]" :key="`asi-${level}-${i}`" class="asi mb-1">
								<q-select
									:dark="$store.getters.theme === 'dark'"
									filled
									square
									:label="`Ability ${i + 1}`"
									:options="abilities"
									:value="asi_modifiers(level)[i]"
									name="asi"
									@input="saveASI($event, level, i, valid)"
								/>
							</div>
						</div>

						<!-- CUSTOM FEATURE -->
						<template v-else>
							<template v-if="!isNaN(feature.index)">
								<q-checkbox
									:dark="$store.getters.theme === 'dark'"
									v-model="character.class.classes[classIndex].features[feature.index].display"
									label="Display on character sheet"
									:false-value="null"
									indeterminate-value="something-else"
									@input="save(valid)"
								/>
								<ValidationProvider
									rules="required|max:30"
									name="Feature name"
									v-slot="{ errors, invalid, validated }"
								>
									<q-input
										:dark="$store.getters.theme === 'dark'"
										filled
										square
										@change="save(valid)"
										autocomplete="off"
										type="text"
										v-model="character.class.classes[classIndex].features[feature.index].name"
										:placeholder="index === 'asi' ? 'Feat name' : 'Feature name'"
										:error="invalid && validated"
										:error-message="errors[0]"
									/>
								</ValidationProvider>

								<ValidationProvider
									rules="max:2000"
									name="Description"
									v-slot="{ errors, invalid, validated }"
								>
									<hk-markdown-editor
										v-model="
											character.class.classes[classIndex].features[feature.index].description
										"
										@change="save(valid)"
										:error="invalid && validated"
										:error-message="errors[0]"
										label="Description"
									>
										<character-descriptions
											class="description-preview"
											v-model="feature.description"
										/>
									</hk-markdown-editor>
								</ValidationProvider>
							</template>
							<character-descriptions v-else v-model="feature.description" />

							<!-- Charges -->
							<div class="my-3" v-if="feature.charges">
								You have <strong>{{ charges(feature.charges, level) }}</strong> charges on level
								{{ classLevel }}.
							</div>

							<!-- Modifiers -->
							<Modifier-table
								v-if="!isNaN(feature.index)"
								:modifiers="character.filtered_modifiers_feature(classIndex, level, feature.index)"
								:origin="`class.${classIndex}.${level}.${feature.index}`"
								:userId="userId"
								:characterId="characterId"
								:info="featureModInfo"
								@edit="editModifier"
							/>
						</template>
					</div>
				</q-expansion-item>
			</template>
		</q-list>

		<!-- MODIFIER MODAL -->
		<q-dialog v-model="modifier_modal">
			<Modifier
				:value="modifier"
				:userId="userId"
				:characterId="characterId"
				@save="modifierSaved"
			/>
		</q-dialog>
	</div>
</template>

<script>
import numeral from "numeral";
import { abilities } from "src/utils/generalConstants";
import { mapActions } from "vuex";
import Modifier from "src/components/characters/modifier.vue";
import ModifierTable from "src/components/characters/modifier-table.vue";
import CharacterDescriptions from "src/components/characters/character-descriptions";

export default {
	name: "CharacterClassFeatures",
	props: ["characterId", "userId", "classIndex", "valid"],
	components: {
		Modifier,
		ModifierTable,
		CharacterDescriptions,
	},
	data() {
		return {
			abilities: abilities,
			modifier_modal: false,
			modifier: {},
			featureModInfo:
				"These modifiers only apply to your character if it meets the level requirement for this class.",
		};
	},
	inject: ["characterState"],
	computed: {
		character() {
			return this.characterState.character;
		},
		classLevel() {
			return this.character.class.classes[this.classIndex].level;
		},
		subclass() {
			return this.character.classes[this.classIndex];
		},
		modifiers() {
			return this.character.filtered_modifiers_origin("class");
		},
		levels() {
			return Array.from({ length: 20 }, (_, i) => i + 1);
		},
		asi_text() {
			const levels = this.subclass.asi || [];
			let text = "When you reach ";
			levels.forEach((level, index) => {
				if (index === 0) {
					text += `${numeral(level).format("0o")} level, `;
					if (levels.length > 1) text += "and again at ";
				} else if (index > 0 && index !== levels.length - 1) {
					text += `${numeral(level).format("0o")}, `;
				} else {
					text += `and ${numeral(level).format("0o")} level, `;
				}
			});
			text +=
				"you can increase one ability score of your choice by 2, " +
				"or you can increase two ability scores of your choice by 1.\n" +
				"You can't increase an ability score above 20.";
			return text;
		},
	},
	methods: {
		...mapActions(["setDrawer"]),
		save(valid) {
			this.$emit("save", valid);
		},
		charges(charges, starting_level) {
			let count = charges.value;
			if (charges.scaling) {
				if (charges.scaling.type === "scale") {
					const increase = parseInt(
						Math.floor((this.classLevel - starting_level) / charges.scaling.scale.size)
					);
					count = charges.value + increase;
				} else if (charges.scaling.type === "steps") {
					const values = charges.scaling.steps.filter((item) => {
						return this.classLevel >= item.level;
					});
					count = values[values.length - 1].value;
				}
			}
			return count === Infinity ? "unlimited" : count;
		},
		asi_modifiers(level) {
			const modifier = this.character.single_modifier_origin(
				`class.${this.classIndex}.${level}.asi`
			);
			return modifier ? modifier.subtarget : [];
		},
		addFeature(level, valid) {
			this.character.add_feature(this.classIndex, level);
			this.$forceUpdate();
			this.save(valid);
		},

		confirmDeleteFeature(level, index, name, valid) {
			this.$snotify.error(
				'Are you sure you want to delete the the feature "' + name + '"?',
				"Delete feature",
				{
					buttons: [
						{
							text: "Yes",
							action: (toast) => {
								this.deleteFeature(level, index, valid);
								this.$snotify.remove(toast.id);
							},
							bold: false,
						},
						{
							text: "No",
							action: (toast) => {
								this.$snotify.remove(toast.id);
							},
							bold: true,
						},
					],
				}
			);
		},
		deleteFeature(level, index, valid) {
			this.character.delete_feature(this.classIndex, level, index);
			this.$forceUpdate();
			this.save(valid, "class.delete_feature");
		},

		/**
		 * Save the type of feature that is chosen
		 * Either 'Ability Score Improvement' or 'Feat'
		 **/
		saveFeatureType(level, value) {
			const linked_modifiers = this.character.filtered_modifiers_feature(level, "asi");

			//Delete linked modifiers when changing type
			for (const modifier of linked_modifiers) {
				this.character.delete_modifier(modifier.index);
			}

			// this.set_feature({
			// 	userId: this.userId,
			// 	key: this.characterId,
			// 	classIndex: this.classIndex,
			// 	level,
			// 	feature: { type: value },
			// 	feature_key: "--asi"
			// });

			this.$emit("change", `class.edit_feature_level_${level}`);
		},

		asiOrFeat(level) {
			return "asi";
		},

		saveASI(value, level, index, valid) {
			this.character.save_asi(value, this.classIndex, level, index);
			this.$forceUpdate();
			this.save(valid, `class.set_asi`);
		},

		editModifier(e) {
			this.modifier_modal = true;
			this.modifier = e.modifier;
		},
		modifierSaved() {
			this.modifier_modal = false;
			this.save(true, `class.modifier.saved`);
		},
	},
};
</script>

<style lang="scss" scoped>
h4.feature-title {
	margin-top: 20px;
	display: flex;
	justify-content: space-between;
	font-size: 18px;
	line-height: 25px;
	padding-bottom: 5px;
	margin-bottom: 1px;
	border-bottom: solid 1px #5c5757;
}
.description-preview {
	display: inline-block;
	min-height: 56px;
	margin-bottom: 20px;
	background-color: rgba(225, 225, 225, 0.05);
	padding: 16px 12px 6px 12px;
	width: 100%;
}
[data-theme="light"] {
	.description-preview {
		background-color: rgba(0, 0, 0, 0.03);
	}
}
</style>
