<template>
	<a
		v-if="!loading"
		class="btn btn-clear"
		@click="setDrawer({ show: true, type: 'compendium/Item', data: item })"
	>
		<i aria-hidden="true" class="far fa-link mr-1"></i>
		{{ item.name.capitalizeEach() }}
	</a>
	<span v-else class="loader pl-5" />
</template>

<script>
import { mapActions } from "vuex";

export default {
	name: "LinkedItem",
	props: {
		linkedItem: {
			type: Object,
			required: true,
		},
	},
	data() {
		return {
			user: this.$store.getters.user,
			loading: true,
			item: {},
		};
	},
	async mounted() {
		this.item = await this.getItem(this.linkedItem.key, this.linkedItem.custom);
		this.loading = false;
	},
	methods: {
		...mapActions(["setDrawer"]),
		...mapActions("items", ["get_item"]),
		...mapActions("api_items", ["fetch_api_item"]),
		async getItem(id, custom) {
			let item;
			if (custom) {
				item = await this.get_item({ uid: this.user.uid, id });
			} else {
				item = await this.fetch_api_item(id);
			}
			return item;
		},
	},
};
</script>
