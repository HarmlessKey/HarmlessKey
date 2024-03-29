<template>
	<hk-card>
		<div slot="header" class="card-header">
			<h1><i aria-hidden="true" class="fas fa-wand-magic"></i> Spells</h1>
			<span class="neutral-3">
				Resource
				<a
					class="btn btn-sm btn-clear"
					href="https://media.wizards.com/2016/downloads/DND/SRD-OGL_V5.1.pdf"
					target="_blank"
					rel="noopener"
					>SRD 5.1</a
				>
			</span>
		</div>
		<div class="card-body">
			<q-input
				:dark="$store.getters.theme !== 'light'"
				v-model="search"
				borderless
				filled
				square
				debounce="300"
				clearable
				placeholder="Search"
			>
				<button slot="append" class="btn bg-neutral-5" @click="filterSpells">
					<q-icon name="search" />
				</button>
				<q-btn slot="after" color="primary" no-caps @click="filter_dialog = true">
					Filter
					<i class="fas fa-filter ml-2" aria-hidden="true" />
					<q-badge
						v-if="Object.keys(filter).length"
						floating
						rounded
						color="red"
						:label="Object.keys(filter).length"
					/>
				</q-btn>
			</q-input>
			<p v-if="!loading && pagination.rowsNumber === 0" class="red">
				Nothing found
				<template v-if="query.search"> for "{{ query.search }}" </template>
				<template v-if="schools"> with a type of {{ schools.join(" or ") }} </template>
			</p>
			<q-table
				:data="spells"
				:columns="columns"
				row-key="_id"
				card-class="bg-none"
				flat
				:dark="$store.getters.theme !== 'light'"
				:pagination.sync="pagination"
				:loading="loading"
				separator="none"
				wrap-cells
				@request="request"
			>
				<div slot="no-data" />
				<hk-loader slot="loading" name="spells" />

				<template v-slot:header="props">
					<q-tr :props="props">
						<q-th v-for="col in props.cols" :key="col.name" :props="props" :auto-width="col.name !== 'name'">
							{{ col.label }}
						</q-th>
						<q-th auto-width />
					</q-tr>
				</template>

				<!-- Body -->
				<template v-slot:body="props">
					<q-tr :props="props">
						<q-td v-for="col in props.cols" :key="col.name" :props="props" :auto-width="col.name !== 'name'">
							<router-link v-if="col.name === 'name'" :to="`${$route.path}/${props.row.url}`">
								{{ col.value }}
							</router-link>
							<template v-else>{{ col.value }}</template>
						</q-td>
						<q-td auto-width class="text-center">
							<a @click="props.expand = !props.expand" class="neutral-2">
								<i
									aria-hidden="true"
									class="fas"
									:class="props.expand ? 'fa-chevron-up' : 'fa-chevron-down'"
								/>
							</a>
						</q-td>
					</q-tr>
					<q-tr v-if="props.expand" :props="props">
						<q-td colspan="100%" auto-width>
							<ViewSpell :id="props.key" />
						</q-td>
					</q-tr>
				</template>
			</q-table>
		</div>
		<q-dialog v-model="filter_dialog">
			<hk-card header="Filter spells" :min-width="300">
				<div class="card-body">
					<hk-filter v-model="filter" type="spell" />
				</div>
				<div slot="footer" class="card-footer">
					<button class="btn bg-neutral-5" @click="clearFilter">
						<i class="fas fa-times" aria-hidden="true" />
						Clear filter
					</button>
					<button class="btn ml-2" @click="setFilter">
						<i class="fas fa-filter" aria-hidden="true" />
						Set filter
					</button>
				</div>
			</hk-card>
		</q-dialog>
	</hk-card>
</template>

<script>
import ViewSpell from "src/components/compendium/Spell.vue";
import { mapActions } from "vuex";

export default {
	name: "Spells",
	components: {
		ViewSpell,
	},
	data() {
		return {
			spells: [],
			search: "",
			query: null,
			filter_dialog: false,
			filter: {},
			pagination: {
				sortBy: "name",
				descending: false,
				page: 1,
				rowsPerPage: 15,
				rowsNumber: 0,
			},
			columns: [
				{
					name: "name",
					label: "Name",
					field: "name",
					sortable: true,
					align: "left",
					classes: "truncate-cell",
					format: (val) => val.capitalizeEach(),
				},
				{
					name: "school",
					label: "School",
					field: "school",
					sortable: true,
					align: "left",
					format: (val) => val.capitalizeEach(),
				},
				{
					name: "level",
					label: "Level",
					field: "level",
					align: "left",
					sortable: true,
					format: (val) => (val <= 0 ? "cantrip" : val),
				},
			],
			loading: true,
		};
	},
	methods: {
		...mapActions("api_spells", ["fetch_api_spells"]),
		filterSpells() {
			this.loading = true;
			this.spells = [];
			this.pagination.page = 1;
			this.query = {
				search: this.search,
				...this.filter
			};
			this.fetchSpells();
		},
		setFilter() {
			this.filter_dialog = false;
			this.filterSpells();
		},
		
		clearFilter() {
			this.filter_dialog = false;
			this.$set(this, "filter", {});
			this.filterSpells();
		},
		request(req) {
			this.pagination = req.pagination;
			this.fetchSpells();
		},
		async fetchSpells() {
			await this.fetch_api_spells({
				pageNumber: this.pagination.page,
				pageSize: this.pagination.rowsPerPage,
				query: this.query,
				fields: ["name", "school", "level", "classes", "url"],
				sortBy: this.pagination.sortBy,
				descending: this.pagination.descending,
			}).then((result) => {
				this.pagination.rowsNumber = result.meta.count;
				this.spells = result.results;
				this.loading = false;
			});
		},
	},
	async mounted() {
		await this.fetchSpells();
	},
};
</script>
