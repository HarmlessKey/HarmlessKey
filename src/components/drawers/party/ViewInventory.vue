<template>
	<div>
		<h2>Party Inventory</h2>
		<div class="money" v-if="currency">
			<template v-for="(coin, key) in copperToPretty(currency['.value'])">
				<div v-if="coin" :key="key">
					{{ coin }}
					<img :src="require(`src/assets/_img/currency/${currencies[key].color}.svg`)" :alt="currencies[key].name" />
				</div>
			</template>
		</div>
		<template>
			<h2 class="my-4">Items</h2>
			<hk-table 
				v-if="items"
				:items="items"
				:columns="itemColumns"
				:showHeader="false"
				:collapse="true"
				:perPage="15"
				:loading="loading"
				:search="['public_name', 'public_description']"
			>

				<!-- COLLAPSE -->
				<div slot="collapse" slot-scope="data">
					<div class="mb-2">
						<strong>{{ data.row.public_name }}</strong><br/>
						{{ data.row.public_description }}
					</div>
					<template v-if="data.row.linked_item && data.row.identified">
						<div class="linked-item">
							<span>Qualities</span>
							<a @click="showItem = !showItem" :class="{ collapsed: showItem }">
								<i aria-hidden="true" class="fas fa-chevron-down"></i>
							</a>
						</div>
						<q-slide-transition>
							<div v-if="Object.keys(data.row.full_linked_item).length" v-show="showItem" class="full-item">
								<ViewItem :data="data.row.full_linked_item"/>
							</div>
						</q-slide-transition>
					</template>
				</div>
			</hk-table>
		</template>
	</div>
</template>

<script>
	import { currencyMixin } from 'src/mixins/currency.js';
	import { db } from 'src/firebase';
	import ViewItem from 'src/components/compendium/Item.vue';

	export default {
		mixins: [currencyMixin],
		components: {
			ViewItem
		},
		data() {
			return {
				userId: this.$route.params.userid,
				campaignId: this.$route.params.campid,
				items: undefined,
				loading: true,
				allItems: undefined,
				error: undefined,
				showItem: false,
				addCurrency: false,
				itemColumns: {
					public_name: {
						label: 'Name',
						truncate: true,
					}
				}
			}
		},
		firebase() {
			return {
				currency: {
					source: db.ref(`campaigns/${this.userId}/${this.campaignId}/inventory/currency`),
					asObject: true
				}
			}
		},
		mounted() {
			const items_ref = db.ref(`campaigns/${this.userId}/${this.campaignId}/inventory/items`);
			items_ref.on('value', async (snapshot) => {
				let items = snapshot.val()

				for(let key in items) {
					let item = items[key];
					items[key].full_linked_item = {};
					items[key]['.key'] = key;

					//Get Linked item
					let linkedItem = db.ref(`items/${item.linked_item.key}`)
					await linkedItem.on('value', (result) => {
						if(result.val()) {
							items[key].full_linked_item = result.val();
						}
					});
					//Get Linked item
					let linkedCustomItem = db.ref(`custom_items/${this.userId}/${item.linked_item.key}`)
					await linkedCustomItem.on('value', (result) => {
						if(result.val()) {
							items[key].full_linked_item = result.val();
						}
					});
				}
				this.items = Object.values(items);
				this.loading = false;
			});
		}
	};
</script>

<style lang="scss" scoped>
	.money {
		display: flex;
		justify-content: center;
		cursor: pointer;
		grid-area: money;
		line-height: 15px;

		div {
			margin-right: 10px;
			font-size: 16px;

			img {
				height: 12px;
			}

			&:last-child {
				margin: none;
			}
		}
	}
	.addCurrency {
		border-top: solid 1px $neutral-4;
		margin-top: 20px; 
		padding-top: 20px;
			
		.currency {
			margin: auto;
			display: flex;
			justify-content: center;
			max-width: 400px;
			text-align: center;

			img {
				height: 25px;
				margin-bottom: 10px;
			}
			div {
				margin-right: 5px;

				&:last-child {
					margin-right: 0;
				}
			}
			input[type='number'] {
				-moz-appearance: textfield;
			}
		}
		.actions {
			margin-top: 20px;
			display: flex;
			justify-content: space-between;

			.btn {
				margin-right: 10px;
				width: 100%;

				&:last-child {
					margin-right: 0;
				}
			}
			
		}
	}
	.hk-table {
		.linked-item {
			display: grid;
			grid-template-columns: 1fr 10px;

			a.item-name {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			a {
				i {
					transition: transform .2s linear;
				}
				i.fa-chevron-down {
					&.collapsed {
					transform: rotate(-180deg);
					}
				}
			}
		}
		.full-item {
			margin-top: 15px;
			font-size: 12px;

			h3 {
				font-size: 15px;
			}
		}
	}
</style>