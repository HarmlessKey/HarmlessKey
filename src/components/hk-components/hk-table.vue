<template>
	<div>
		<!-- FILTERS -->
		<div class="filters" v-if="search !== undefined">
            <div class="input-group mb-3">
                <input type="text" autocomplete="off" v-model="searched" @keyup="searchData()" placeholder="Search" class="form-control"/>
                <div class="input-group-append">
                    <button class="btn" @click="searchData()"><i class="fas fa-search"></i></button>
                </div>
            </div>
			<div v-if="searched !== undefined && searched !== ''" class="green result-count" :class="{'red': Object.keys(dataItems).length === 0}">{{ Object.keys(dataItems).length }} results for {{ searched }}</div>
        </div>

		<!-- TABLE -->
		<div 
			v-if="!loading"
			class="hk-table" 
			:style="{ 'grid-template-columns': templateColumns }"
		>	
			<!-- By default, show a header -->
			<template v-if="showHeader">
				<template v-for="(column, key) in columns">
					<div 
						v-if="!column.sortable"
						:key="'header-'+key"
						class="hk-table-column hk-table-header"
						:class="[{
							truncate: column.truncate,
							center: column.center,
							right: column.right
						}, column.classes]"
						v-html="column.label"
					>
					</div>
					<div 
						v-else 
						:key="'header-'+key"
						class="hk-table-column hk-table-header hk-table-column-sortable"
						:class="[{
							truncate: column.truncate,
							center: column.center,
							right: column.right
						}, column.classes]"
						@click="sort(key)"
					>
						<span v-html="column.label"></span>
						<span class="sort">
							<i class="fas fa-sort-up" :class="{ blue: !reverse && sortedBy === key }"></i>
							<i class="fas fa-sort-down" :class="{ blue: reverse && sortedBy === key }"></i>
						</span>
					</div>
				</template>
			</template>

			<!-- TABLE BODY -->
			<template v-for="(row, index) in paginatedData">
				<div 
					class="hk-table-column"
					v-for="(column, key) in columns"
					:key="key+'-'+index"
					:class="[{
						truncate: column.truncate,
						'no-padding': column.noPadding,
						center: column.center,
						right: column.right
					}, column.classes]"
				>
					<slot :name="key" :item="row[key]" :row="row" :index="index">
						{{ row[key] }}
					</slot>
				</div>
			</template>
		</div>
		<div v-else class="loader">
			<slot name="table-loading">
				Loading data...
			</slot>
		</div>

		<b-pagination 
			class="pagination"
			v-if="!loading && Object.keys(dataItems).length > perPage" 
			align="center" 
			:total-rows="Object.keys(dataItems).length" 
			v-model="currentPage" 
			:per-page="perPage"
		/>
	</div>
</template>

<script>
	import _ from 'lodash';

	export default {
		name: 'hk-table',
		props: {
			items: {
				type: Array,
				default: undefined
			},
			columns: {
				type: Object,
				default: undefined
			},
			showHeader: {
				type: Boolean,
				default: true
			},
			perPage: {
				type: Number,
				default: undefined
			},
			loading: {
				type: Boolean,
				default: false
			},
			search: {
				type: Array,
				default: undefined
			}
		},
		data() {
			return {
				reverse: true,
				sortedBy: undefined,
				data: undefined,
				searched: undefined,
				currentPage: 1
			}
		},
		computed: {
			templateColumns() {
				let templateColumns = '';
				let columns = this.columns;

				for(let index in columns) {
					let column = columns[index];
					let width = ' auto'; // By default, columns have an auto width

					// Overwrite the width if the column is tagged with maxContent
					if(column.maxContent) {
						width = ' max-content';
					}
					// Overwrite the width if the column has a width specified
					if(column.width) {
						width = ' ' + column.width + 'px'
					}
					// Overwrite if there is a min and max width
					// Ignored if only min or only max is provided
					if(column.min && column.max) {
						width = ' minmax(' + column.min + ' ' + column.max + ')';
					}
					templateColumns = templateColumns.concat(width);
				}
				return templateColumns;
			},
			dataItems: {
				// Data items must be stored in a computed variable
				// The sort function manipulates the data
				// Props should not be manipulated directly
				get() {		
					return (this.data) ? this.data : this.items;
				},
				set(newValue) {
					this.data = newValue;
					return newValue;
				}
			},
			paginatedData() {
				if(this.perPage === undefined) {
					return this.dataItems;
				} else {
					let end = this.perPage * this.currentPage;
					let start = end - this.perPage;

					return this.dataItems.slice(start, end);
				}
			}
		},
		methods: {
			sort(column) {
				this.reverse = !this.reverse;
				this.sortedBy = column;

				if(this.reverse) {
					this.dataItems = _.sortBy(this.dataItems, column).reverse();
				} else {
					this.dataItems = _.sortBy(this.dataItems, column);
				}
			},
			searchData() {
				this.currentPage = 1
				const vm = this;
				let searchTerm = this.searched.toLowerCase();
				
				let results = this.items.filter( function(row) {
					for (let i in vm.search) {
						let key = vm.search[i];
						// If field is undefined don't return row
						if (row[key] == undefined) {
							return
						}
						if (row[key].toLowerCase().includes(searchTerm)){
							return row;
						}
					}
				});
				this.dataItems = results;
			}
		}
	}
</script>

<style lang="scss" scoped>
	.hk-table {
		display: grid;
		grid-auto-rows: minmax(46px auto);
		row-gap: 1px;

		.hk-table-column {
			min-height: 35px;
			padding: 12px 10px;

			&.no-padding {
				padding: 0;
			}
			&.truncate {
				white-space: nowrap;
				overflow: hidden;
				text-overflow: ellipsis;
			}
			&.center {
				text-align: center;
			}
			&.right {
				text-align: right;
			}
			&.hk-table-column-sortable {
				cursor: pointer;
				display: flex;
				justify-content: flex-start;

				.sort {
					width: 25px;
					position: relative;
					color: #494747;


					.fas {
						position: absolute;
						right: 0;

						&.fa-sort-up {
							top: 3px;
						}
						&.fa-sort-down {
							top: 6px;
						}
					}
				}
			}
		}
	}
	.result-count {
		margin-bottom: 10px;
	}
	.pagination {
		margin-top: 20px;
	}
</style>