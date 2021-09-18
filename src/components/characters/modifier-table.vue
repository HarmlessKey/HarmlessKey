<template>
	<div>
		<h4 class="title">
			<span>
				{{ title ? title : "Modifiers" }} 
				{{ modifiers.length > 0 ? `( ${modifiers.length} )` : `` }}

				<hk-popover v-if="info" :header="title ? title : 'Modifiers'" :content="info">
					<q-icon name="info blue" />
				</hk-popover>
			</span>
			<a @click="newModifier(origin), modal = true">
				<i class="fas fa-plus green" />
				Add Modifier
			</a>
		</h4>

		<hk-table
			v-if="modifiers.length > 0"
			:columns="columns"
			:items="modifiers"
		>
			<template slot="target" slot-scope="data">
				{{ data.row.subtarget || data.item.capitalize() }}
			</template>
			<template slot="value" slot-scope="data">
				<template v-if="data.item">{{ data.item }}</template>
				<template v-else-if="data.row.type === 'proficiency'">Proficiency</template>
				<template v-else-if="data.row.type === 'expertise'">Expertise</template>
			</template>
			<div slot="actions" slot-scope="data" class="actions">
				<a class="gray-hover mx-1" 
					@click="editModifier(data.row)">
					<i class="fas fa-pencil"></i>
					<q-tooltip anchor="top middle" self="center middle">
						Edit modifier
					</q-tooltip>
				</a>
				<a class="gray-hover" @click="deleteModifier(data.row['.key'])">
					<i class="fas fa-trash-alt"></i>
					<q-tooltip anchor="top middle" self="center middle">
						Delete modifier
					</q-tooltip>
				</a>
			</div>
		</hk-table>
	</div>
</template>

<script>
	import { mapActions } from "vuex";

	export default {
		name: 'ModifierTable',
		props: {
			modifiers: {
				type: Array,
				required: true
			},
			origin: {
				type: String,
				required: true
			},
			userId: {
				type: String,
				required: true
			},
			playerId: {
				type: String,
				required: true
			},
			title: {
				type: String,
				required: false
			},
			info: {
				type: String,
				required: false
			}
		},
		data() {
			return {
				columns: {
					name: {
						label: 'Name',
						truncate: true
					},
					target: {
						label: 'Target',
					},
					value: {
						label: 'Value',
					},
					actions: {
						label: '<i class="far fa-ellipsis-h"></i>',
						noPadding: true,
						right: true,
						maxContent: true
          }
				}
			}
		},
		methods: {
			...mapActions([
				"delete_modifier"
			]),
			newModifier(origin) {
				const modifier = {
					origin: origin,
					type: null,
					target: null,
					subtarget: null,
					ability_modifier: null,
					restrictions: []
				}
				this.$emit('edit', { modifier, origin: this.origin });
			},
			deleteModifier(key) {
				this.delete_modifier({
					userId: this.userId,
					key: this.playerId,
					modifier_key: key
				});
				this.$emit("change", "modifier.deleted");
			},
			editModifier(modifier) {
				modifier = { ...modifier};
				this.$emit('edit', { modifier, origin: this.origin });
			}
		}
	}
</script>

<style lang="scss" scoped>
	h4 {
		font-size: 16px;
		margin: 15px 0 !important;
		border-bottom: solid 1px #5c5757;
		display: flex;
		justify-content: space-between;
		line-height: 30px;
	}
</style>