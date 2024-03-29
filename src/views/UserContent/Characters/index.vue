<template>
	<hk-card header="Your characters">
		<div class="card-body" v-if="!loading_characters">
			<p class="neutral-2">These are the characters you play in other campaigns.</p>

			<q-table
				v-if="characters.length"
				:data="characters"
				:columns="columns"
				row-key="key"
				card-class="bg-none"
				flat
				:dark="$store.getters.theme !== 'light'"
				:loading="loading_characters"
				separator="none"
				:pagination="{ rowsPerPage: 0 }"
				wrap-cells
			>	
				<template v-slot:body="props">
					<q-tr :props="props">
						<q-td
							v-for="col in props.cols"
							:key="col.name"
							:props="props"
							:auto-width="col.name !== 'name'"
							:style="col.name === 'avatar' && avatar(props.row) ? `background-image: url('${avatar(props.row)}')` : ''"
						>
							<template v-if="col.name === 'avatar'">
								<i aria-hidden="true" v-if="!avatar(props.row)" class="hki-player" />
							</template>
							<template v-else-if="col.name !== 'actions'">
								<router-link v-if="col.name === 'name'" :to="`${$route.path}/${props.key}`">
									{{ col.value }}
								</router-link>						
								<template v-else>
									{{ col.value }}
								</template>
							</template>
							<div v-else class="d-flex justify-content-end items-end truncate">
								<router-link 
									v-if="props.row.campaign_id" 
									class="btn btn-sm bg-neutral-9"
									:to="`/user/${props.row.user_id}/${props.row.campaign_id}`"
								>
									<i aria-hidden="true" class="fas fa-dungeon neutral-2 mr-1" />
									Campaign
								</router-link>
								<router-link class="btn btn-sm bg-neutral-5 mx-2" :to="`${$route.path}/${props.key}`">
									<i aria-hidden="true" class="fas fa-pencil"></i>
									<q-tooltip anchor="top middle" self="center middle">
										Edit
									</q-tooltip>
								</router-link>
								<a class="btn btn-sm bg-neutral-5" @click="confirmDelete($event, props.key, props.row)">
									<i aria-hidden="true" class="fas fa-trash-alt"></i>
									<q-tooltip anchor="top middle" self="center middle">
										Delete
									</q-tooltip>
								</a>
							</div>
						</q-td>
					</q-tr>
				</template>
				<div slot="no-data" />
				<div slot="bottom" />
				<hk-loader slot="loading" name="characters" />
			</q-table>
			<p v-else>You have no control over other characters.</p>
		</div>
		<hk-loader v-else name="characters" />
	</hk-card>
</template>

<script>
	import { experience } from 'src/mixins/experience.js';
	import { mapGetters, mapActions } from 'vuex';

	export default {
		name: 'Characters',
		mixins: [experience],
		data() {
			return {
				userId: this.$store.getters.user.uid,
				controlledCharacters: undefined,
				loading_characters: true,
				columns: [
					{
						name: "avatar",
						label: "",
						field: "avatar",
						align: "left",
						classes: "avatar",
					},
					{
						name: "name",
						label: "Name",
						field: "character_name",
						classes: "truncate-cell",
						sortable: true,
						align: "left"
					},
					{
						name: "actions",
						label: "",
						align: "right"
					}
				]
			}
		},
		computed: {
			...mapGetters("players", ["characters"]),
		},
		async mounted() {
			await this.get_characters();
			this.loading_characters = false;
		},
		methods: {
			...mapActions("players", [
				"get_characters", 
				"remove_control"
			]),
			avatar(character) {
				return character.storage_avatar || character.avatar;
			},
			confirmDelete(e, key, player) {
				//Instantly delete when shift is held
				if(e.shiftKey) {
					this.deleteCharacter(key, player.user_id);
				} else {
					this.$snotify.error(
						`Are you sure you want give up control over ${player.character_name}?`, 
						'Give up control', {
						timeout: false,
						buttons: [
							{
								text: 'Yes', action: (toast) => { 
								this.deleteCharacter(key, player.user_id)
								this.$snotify.remove(toast.id); 
								}, 
								bold: false
							},
							{
								text: 'No', action: (toast) => { 
									this.$snotify.remove(toast.id); 
								}, 
								bold: true
							},
						]
					});
				}
			},
			deleteCharacter(id, owner_id) {
				this.remove_control({ uid: this.userId, id, owner_id });
			}
		}
	}
</script>