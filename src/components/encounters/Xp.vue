<template>
	<div>
		<h2>Experience Points</h2>

		<p>
			The amount of XP your encounter is worth. 
			You can either choose to use the calculated amount based on the monsters in your encounter 
			or overwrite it with whatever you think the encounter should be worth.
		</p>
		
		<div class="d-flex justify-content-start">
			<span class="xp" :class="{ strikeTrough: xp.overwrite }">{{ xp.calculated }}</span>
			<a @click="setOverwrite = !setOverwrite" class="ml-2" v-if="!xp.overwrite"><i aria-hidden="true" class="fas fa-edit"></i></a>
			<template v-if="xp.overwrite">
				<span class="xp ml-3">{{ xp.overwrite }}</span>
				<a @click="clearOverwrite" class="ml-2 red"><i aria-hidden="true" class="fas fa-times"></i></a>
			</template>
		</div>
		
		<div class="d-flex justify-content-between" v-if="setOverwrite">
			<div class="input-group mb-3">
				<q-input 
					:dark="$store.getters.theme === 'dark'" filled square dense
					type="number" 
					autocomplete="off" 
					v-model="overwriteAmount" 
					@change="setOverwriteAmount" 
					label="Amount of XP" 
					class="mb-2"
				/>
				<div class="input-group-append">
					<button class="btn">Overwrite XP</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapActions } from "vuex";
 
	export default {
		name: 'XP',
		props: {
			encounter: {
				type: Object,
				required: true
			}
		},
		data() {
			return {
				campaignId: this.$route.params.campid,
				encounterId: this.$route.params.encid,
				user: this.$store.getters.user,
				setOverwrite: false,
				overwriteAmount: undefined,
				xp: this.encounter.xp
			} 
		},
		methods: {
			...mapActions("encounters", [
				"set_xp", 
			]),
			setOverwriteAmount() {
				this.set_xp({
					campaignId: this.campaignId,
					encounterId: this.encounterId,
					type: "overwrite",
					value: this.overwriteAmount
				});
				this.setOverwrite = false;
				this.overwriteAmount = undefined;
			},
			clearOverwrite() {
				this.set_xp({
					campaignId: this.campaignId,
					encounterId: this.encounterId,
					type: "overwrite",
					value: null
				});
			}	
		}
	}
</script>

<style lang="scss" scoped>
	.xp {
		font-size: 40px;
		font-weight: bold;

		&.strikeTrough {
			text-decoration: line-through;
			color: $neutral-3;
		}
	}
	.fas {
		line-height: 70px;
	}
</style>