<template>
	<div class="hk-dice-text">
		<template v-for="(line, index) in splitOnRollable(input_text)">
			<template v-if="line.dice === undefined">
				{{ line.value }}
			</template>
			<hk-roll 
				v-else
				:tooltip="`Roll ${dice2str(line.dice)}`"
				:key="index"
				:roll="{
					n: line.dice.n,
					d: line.dice.d,
					m: line.dice.m,
					title: roll_title || `Roll ${dice2str(line.dice)}`,
					entity_name,
					notify: true
				}"
			>
				<strong class="rollable">
					{{ line.value }}
				</strong>
			</hk-roll>
		</template>

	</div>
</template>

<script>
	export default {
		name: 'hk-dice-text',
		props: {
			input_text: {
				type: String,
				default: undefined
			},
			roll_title: {
				type: String,
				default: undefined
			},
			entity_name: {
				type: String,
				default: undefined
			}
		},
		methods: {
			splitOnRollable(input) {
				//                   =          xDy+z             |       X to hit
				const rollable_regex = /(\d+[dD]\d+\s?[+-]?\s?\d*)|([+-]\s?\d+\sto\shit)/g;
				let output = input.split(rollable_regex)
				output = output
							.filter((val) => !!val)
							.map((line) => ({value: line, dice: this.makeDice(line)}))
				// Filter out undefined
				let ret = output.filter((val) => !!val);
				return ret
			},
			makeDice(input) {
				//              =  (Number )[dD]( Dice  )          (Modifier)
				const xdy_regex = /(?<n>\d+)[dD](?<d>\d+)\s?(?<m>[+-]?\s?\d*)/g;
				let match = xdy_regex.exec(input);
				if (match !== null) {
					let dice = { 
						n: match.groups.n,
						d: match.groups.d,
						m: parseInt(match.groups.m.replaceAll(' ','')) || 0
					}
					return dice;
				}
				//              =  (  Hit modifier  )  to  hit
				const hit_regex = /(?<hit>[+-]\s?\d+)\sto\shit/g;
				match = hit_regex.exec(input)
				if (match !== null) {
					let dice = {
						n: 1,
						d: 20,
						m: match.groups.hit
					}
					return dice
				}
				return undefined;
			},
			dice2str(dice) {
				let dice_str =  `${dice.n}d${dice.d}`;
				dice_str += dice.m ? `${dice.m}` : "";
				return dice_str
			}
		}
	}
</script>

<style lang="scss" scoped>
.hk-dice-text {
	.rollable {
		cursor: pointer;
		user-select: none;

		&:hover {
			color: $blue;
		}
	}

	.advantage .rollable:hover {
		color: $green
	}
	.disadvantage .rollable:hover {
		color:$red
	}
}
</style>