<template>
	<div class="menu bg-neutral-9">
		<div
			v-if="targeted.length === 0"
			class="no-target red"
			@click="
				setDrawer({
					show: true,
					type: 'drawers/encounter/TargetingInfo',
					data: { key: targeted[0] },
				})
			"
		>
			Select a target.
		</div>
		<q-tabs v-else :dark="$store.getters.theme === 'dark'" no-caps indicator-color="transparent">
			<q-tab
				v-for="({ name, icon, drawer }, index) in tabs"
				:key="`tab-${index}`"
				:name="name"
				:icon="icon"
				@click="
					drawer
						? setDrawer({
								show: true,
								type: drawer.type,
								data: drawer.data,
						  })
						: (dialog[name] = !dialog[name])
				"
			/>
		</q-tabs>

		<!-- DAMAGE / HEALING -->
		<q-dialog v-model="dialog.damage" :dark="$store.getters.theme === 'dark'">
			<div class="bg-neutral-7 px-3 py-3">
				<Actions :current="current" :settings="settings" :select-entity="true" />
			</div>
		</q-dialog>

		<!-- DAMAGE / HEALING -->
		<q-dialog v-model="dialog.options" :dark="$store.getters.theme === 'dark'">
			<div class="bg-neutral-7">
				<q-list>
					<q-item>
						<q-item-section>
							<b>{{
								targeted.length === 1
									? entities[targeted[0]].name.capitalize()
									: `${targeted.length} targets`
							}}</b>
						</q-item-section>
					</q-item>
					<q-separator />
					<q-item
						v-if="
							targeted.length === 1 &&
							entities[targeted[0]].curHp === 0 &&
							!entities[targeted[0]].stable &&
							entities[targeted[0]].entityType === 'player'
						"
						clickable
						v-close-popup
						@click="set_stable({ key: entities[targeted[0]].key, action: 'set' })"
					>
						<q-item-section avatar
							><i aria-hidden="true" class="fas fa-heartbeat"></i
						></q-item-section>
						<q-item-section>Stabilize</q-item-section>
					</q-item>
					<q-item
						v-if="targeted.length === 1"
						clickable
						v-close-popup
						@click="setDrawer({ show: true, type: 'drawers/encounter/EditEntity' })"
					>
						<q-item-section avatar><i aria-hidden="true" class="fas fa-pencil"></i></q-item-section>
						<q-item-section>Edit</q-item-section>
					</q-item>
					<q-item
						clickable
						v-close-popup
						@click="setDrawer({ show: true, type: 'drawers/encounter/reminders/TargetReminders' })"
					>
						<q-item-section avatar
							><i aria-hidden="true" class="fas fa-stopwatch"></i
						></q-item-section>
						<q-item-section>Reminders</q-item-section>
					</q-item>
					<q-item
						v-if="targeted.length === 1"
						clickable
						v-close-popup
						@click="
							setDrawer({ show: true, type: 'drawers/Transform', data: entities[targeted[0]] })
						"
					>
						<q-item-section avatar
							><i aria-hidden="true" class="fas fa-paw-claws"></i
						></q-item-section>
						<q-item-section>Transform</q-item-section>
					</q-item>
					<q-item
						v-if="targeted.length === 1"
						clickable
						v-close-popup
						@click="setHidden(entities[targeted[0]].key, !entities[targeted[0]].hidden)"
					>
						<q-item-section avatar
							><i
								aria-hidden="true"
								:class="entities[targeted[0]].hidden ? 'fas fa-eye' : 'fas fa-eye-slash'"
							></i
						></q-item-section>
						<q-item-section>{{ entities[targeted[0]].hidden ? "Show" : "Hide" }}</q-item-section>
					</q-item>
					<q-item
						clickable
						v-close-popup
						@click="
							setDrawer({
								show: true,
								type: 'drawers/encounter/Conditions',
								data: entities[targeted[0]],
							})
						"
					>
						<q-item-section avatar><i aria-hidden="true" class="fas fa-flame"></i></q-item-section>
						<q-item-section>Conditions</q-item-section>
					</q-item>
					<q-separator />
					<q-item
						v-if="targeted.length === 1"
						clickable
						@click="remove(entities[targeted[0]].key, entities[targeted[0]].name)"
					>
						<q-item-section avatar
							><i aria-hidden="true" class="fas fa-trash-alt red"></i
						></q-item-section>
						<q-item-section>Remove</q-item-section>
					</q-item>
				</q-list>
			</div>
		</q-dialog>
	</div>
</template>

<script>
import { mapActions, mapGetters } from "vuex";
import Actions from "src/components/combat/actions/Actions.vue";

export default {
	name: "Menu",
	components: {
		Actions,
	},
	props: ["entities", "settings", "current"],
	data() {
		return {
			dialog: {
				damage: false,
				options: false,
			},
		};
	},
	computed: {
		...mapGetters(["targeted"]),
		tabs() {
			let tabs = [];

			if (this.targeted.length) {
				tabs.push(
					{
						name: "damage",
						label: "Actions",
						icon: "fas fa-swords",
					},
					{
						name: "edit",
						label: "Edit",
						icon: "fas fa-pencil-alt",
						drawer: {
							type: "drawers/encounter/EditEntity",
							data: {},
						},
					},
					{
						name: "options",
						label: "Options",
						icon: "fas fa-ellipsis-h",
					}
				);
			}
			if (this.targeted.length === 1) {
				tabs.push({
					name: "info",
					label: "Info",
					icon: "info",
					drawer: {
						type: "combat/TargetInfo",
						data: { key: this.targeted[0] },
					},
				});
			}
			return tabs;
		},
	},
	methods: {
		...mapActions(["setDrawer", "set_hidden", "remove_entity"]),
		remove(key, name) {
			this.$snotify.error(
				'Are you sure you want to remove "' + name + '" from this encounter?',
				"Delete character",
				{
					buttons: [
						{
							text: "Yes",
							action: (toast) => {
								this.remove_entity(key);
								this.dialog.options = false;
								this.$snotify.remove(toast.id);
							},
							bold: true,
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
		setHidden(key, hidden) {
			if (key) {
				this.set_hidden({
					key: key,
					hidden: hidden,
				});
			} else {
				this.$snotify.error("Select a target", "Hide entity", {});
			}
		},
	},
};
</script>

<style lang="scss" scoped>
.menu {
	position: fixed;
	width: 100%;
	bottom: 0;
	height: 60px;

	.no-target {
		line-height: 60px;
		text-align: center;
		user-select: none;
	}
	.q-tabs {
		height: 100%;
	}
}
</style>
