<template>
	<div class="shares">
		<q-scroll-area :dark="$store.getters.theme === 'dark'" :thumb-style="{ width: '5px'}">
			<h3 class="text-center">Shared rolls</h3>
			<ul class="shared">
				<template v-for="({type, encounter_id, entity_key, notification}, index) in shares">
					<!-- Only show notifications with an encounter_id in that encounter -->
					<template v-if="(!encounterId && !encounter_id) || encounterId === encounter_id">
						<!-- Rolls -->
						<li v-if="['roll', 'action_roll'].includes(type)" :key="`roll-${index}`" class="roll">
							<div>
								<h3>
									<!-- IMAGE -->
									<div class="img" v-if="entity_key && entities && Object.keys(entities).includes(entity_key)">
										<Avatar :entity="entities[entity_key]" :players="players" :npcs="npcs" />
									</div>
									<img class="img logo" alt="logo" v-else src="~assets/_img/logo/logo-icon-no-shield-cyan.svg" />

									<div class="header">
										<!-- NAME -->
										<div class="name truncate" v-if="entity_key && entities && Object.keys(entities).includes(entity_key)">
											<Name :entity="entities[entity_key]" :players="players" :npcs="npcs" :npcSettings="npcSettings" />
										</div>
										

										<!-- TITLE -->
										<div class="title truncate" :title="notification.title">
											{{ notification.title }}
										</div>
									</div>
								</h3>
								<div class="result-wrapper" :class="{ action: type === 'action_roll' }">
									<div v-if="type === 'roll'" class="result">
										<span class="roll">
											<span v-if="notification.advantage_disadvantage" v-html="advantage(notification.advantage_disadvantage)" /> 
											{{ notification.roll }}
										</span>
										<span class="total">
											{{ notification.total }}
										</span>
									</div>

									<!-- ACTION ROLLS -->
									<div v-else v-for="(action, index) of notification.actions" :key="`action-${index}`">
										<div v-if="notification.targets" class="targets">
											<template v-for="target in notification.targets">
												<div v-if="entities && Object.keys(entities).includes(target)" :key="target" class="img">
													<Avatar :entity="entities[target]" :players="players" :npcs="npcs" />
													<q-tooltip anchor="top middle" self="center middle">
														<Name :entity="entities[target]" :players="players" :npcs="npcs" :npcSettings="npcSettings" />
													</q-tooltip>
												</div>
											</template>
										</div>

										<div v-if="action.toHit" class="result toHit">
											<span class="roll">
												<span class="mr-1 neutral-2">
													<i aria-hidden="true" class="hki-sword-break" />
													<q-tooltip anchor="top middle" self="center middle">
														To hit roll
													</q-tooltip>
												</span>
												<span v-html="advantage(action.toHit.advantage_disadvantage)" /> 
												{{ action.toHit.roll }}
											</span>
											<span class="total">
												{{ action.toHit.total }}
											</span>
										</div>

										<div v-for="(roll, roll_index) in action.rolls" class="result " :key="`action-roll-${roll_index}`">
											<span class="roll">
												<i aria-hidden="true" v-if="action.type === 'healing'" class="fas fa-heart green" />
												<i aria-hidden="true" v-else-if="roll.damage_type" :class="[damage_type_icons[roll.damage_type], roll.damage_type]"/>
												{{ roll.roll }}
											</span>
											<span class="total" :class="(action.type === 'healing') ? 'green' : roll.damage_type">
												{{ roll.total }}
											</span>
										</div>
									</div>
								</div>
							</div>
						</li>

						<!-- XP AWARDS -->
						<li v-if="type === 'xp'" :key="`roll-${index}`" class="xp">
							<div class="bg-neutral-8 py-2 border-radius">
								<div v-if="notification.targets" class="targets">
									<template v-for="target in notification.targets">
										<div v-if="players && Object.keys(players).includes(target)" :key="target" class="img">
											<Avatar :entity="players[target]" :players="players" :npcs="npcs" />
											<q-tooltip anchor="top middle" self="center middle">
												{{ players[target].character_name.capitalizeEach() }}
											</q-tooltip>
										</div>
									</template>
								</div>
								{{ notification.amount > 0 ? `+${notification.amount}` : notification.amount }}
								<small>xp</small>
							</div>
						</li>
					</template>
				</template>
			</ul>
		</q-scroll-area>
	</div>
</template>

<script>
	import { trackEncounter } from 'src/mixins/trackEncounter.js';
	import { damage_types, damage_type_icons } from "src/utils/generalConstants";
	import Name from "./live/Name";
	import Avatar from "./live/Avatar";

	export default {
		name: "Shares",
		mixins: [trackEncounter],
		props: {
			shares: {
				type: Array,
				default: undefined
			},
			encounterId: {
				type: String,
				default: undefined
			},
			entities: {
				type: Object,
				default: undefined
			},
			npcs: {
				type: Object,
				default: undefined
			},
			players: {
				type: Object,
				default: undefined
			},
			npcSettings: {
				type: Object,
				default: undefined
			}
		},
		data() {
			return {
				damage_types: damage_types,
				damage_type_icons: damage_type_icons
			}
		},
		components: {
			Name,
			Avatar
		},
		methods: {
			advantage(input) {
				if(input) {
					const color = (input === "a") ? "green" : "red";
					return `<b class="${color}">${input.capitalize()}</b>`;
				}
			},
		}
	}
</script>

<style lang="scss" scoped>
	.shares {
		background-color: $neutral-6-transparent-7;
		height: 100%;
		backdrop-filter: blur(1px);
		border-left: solid 1px $neutral-11;

		.q-scrollarea {
			padding: 10px 10px 0 10px;
			height: 100%;

			ul.shared {
				padding: 0;
				list-style: none;
				margin: 0 0 20px 0;

				li {
					border-bottom: solid 1px $neutral-2;
					padding: 5px 0;

					.targets {
						display: flex;
						justify-content: center;
						height: 25px;
						margin: 10px 0;

						.img {
							width: 23px; 
							height: 23px;
							margin: 0 2px;

							.avatar {
								font-size: 16px;
							}
						}
					}
					&.roll {
						
						h3 {
							border-top-left-radius: $border-radius;
							border-top-right-radius: $border-radius;
							display: grid;
							grid-template-columns: 43px auto;
							grid-gap: 5px;
							padding-right: 8px;
							background-color: $neutral-8;
							margin: 0 !important;
							font-size: 15px;
							height: 43px;

							.img {
								width: 42px; 
								height: 42px;

								&.logo {
									background: none;
									padding: 3px;
								}

								.avatar {
									font-size: 33px;
								}
							}
							.header {
								display: flex;
								flex-flow: column wrap;

								.name {
									padding-top: 2px;
									flex: 3 1 0%;
									line-height: 18px;
									height: 16px;
									font-style: italic;
									font-size: 12px;
									width: calc(100% - 10px);
								}
								.title {
									flex: 4 1 0%;
									line-height: 18px;
									height: 20px;
									color: $neutral-1;
									width: calc(100% - 10px);

									&:only-child {
										line-height: 42px;
									}
								}
							}
						}
						.result-wrapper {
							border-bottom-left-radius: $border-radius;
							border-bottom-right-radius: $border-radius;
							padding: 8px;
							background-color: $neutral-6;

							.result {
								font-size: 18px;
								height: 35px;
								line-height: 35px;
								display: grid;
								grid-template-columns: auto min-content;

								.roll {
									white-space: nowrap; 
									overflow: hidden;
									text-overflow: ellipsis;
								}
								.total {
									text-align: right;
									white-space: nowrap;
									font-size: 25px;
								}
							}
							&.action {
								.result {
									padding: 3px 8px;
									background: $neutral-8;
									margin-bottom: 5px;
									line-height: 29px;

									&:last-child {
										margin-bottom: 0;
									}
									&.toHit {
										border-bottom: solid 1px $neutral-4;
										background: none;
										padding: 0 3px 5px 3px;
										height: 35px;
										line-height: 30px;
										
										.roll {
											display: flex;

											.icon {
												display: inline-block;
												margin-right: 8px;
												width: 30px;
												height: 30px;
											}
										}
									}
								}
							}
						}
					}
					&.xp {
						color: $neutral-1;
						text-align: center;
						font-size: 25px;
					}
				}
			}
		}
	}
	@media only screen and (max-width: 576px) {
		.shares {
			background: none;
			height: calc(100vh - 170px);
			border: none;

			.q-scrollarea {
				padding: 10px 5px 0 0;
			}
		}
	}
</style>
