<template>
	<div class="wrapper" :class="intensityClass">
		<template v-for="i in 3">
			<div class="rain a" :class="`layer${i}`" :key="`${i}-a`" />
			<div class="rain" :class="`layer${i}`" :key="i" />
		</template>
		<!-- <audio v-if="audio" :src="audio_file" autoplay loop /> -->
	</div>
</template>

<script>
export default {
	name: "Rain",
	props: {
		intensity: {
			type: Number,
			default: 1,
		},
		audio: {
			type: Boolean,
			default: false,
		},
	},
	computed: {
		intensityClass() {
			const intensities = ["light", "medium", "heavy"];
			const index = this.intensity - 1;
			return intensities[index];
		},
		// audio_file() {
		// 	return require(`src/assets/_audio/weather/rain/${this.intensity}.wav`);
		// }
	},
};
</script>

<style lang="scss" scoped>
.wrapper {
	position: absolute;
	top: 0;
	left: -50px;
	width: calc(150% + 100px);
	height: 150%;

	$s1: "";
	$s2: "";
	$s3: "";

	@for $i from 1 through 800 {
		$s1: $s1 +
			random(1000) *
			0.1vw +
			" " +
			random(1000) *
			0.1vh +
			" " +
			0 +
			" " +
			random(50) *
			-0.01rem +
			#fff;
		$s2: $s2 +
			random(1000) *
			0.1vw +
			" " +
			random(1000) *
			0.1vh +
			" " +
			0 +
			" " +
			random(50) *
			-0.01rem +
			#fff;
		$s3: $s3 +
			random(1000) *
			0.1vw +
			" " +
			random(1000) *
			0.1vh +
			" " +
			0 +
			" " +
			random(50) *
			-0.01rem +
			#fff;

		@if $i < 800 {
			$s1: $s1 + ",";
			$s2: $s2 + ",";
			$s3: $s3 + ",";
		}
	}
	.rain {
		border-radius: 50%;
		opacity: 0.9;
		position: absolute;
		top: -100vh;
		animation-name: fall;
		animation-timing-function: linear;
		animation-iteration-count: infinite;
	}

	// Light (default)
	.layer1 {
		width: 1px;
		height: 40px;
		box-shadow: #{$s1};
		animation-duration: 2s;
		opacity: 0.5;

		&.a {
			animation-delay: -1s;
		}
	}
	.layer2 {
		width: 1px;
		height: 20px;
		box-shadow: #{$s2};
		animation-duration: 3s;
		opacity: 0.4;
		z-index: -1;

		&.a {
			animation-delay: -2s;
		}
	}
	.layer3 {
		width: 1px;
		height: 10px;
		box-shadow: #{$s3};
		animation-duration: 4s;
		opacity: 0.3;
		z-index: -2;

		&.a {
			animation-delay: -3s;
		}
	}

	// Medium
	&.medium {
		.layer1 {
			height: 60px;
			animation-duration: 1s;

			&.a {
				animation-delay: -0.5s;
			}
		}
		.layer2 {
			height: 50px;
			animation-duration: 2s;

			&.a {
				animation-delay: -1.5s;
			}
		}
		.layer3 {
			height: 40px;
			animation-duration: 3s;

			&.a {
				animation-delay: -2.5s;
			}
		}
	}

	// Heavy
	&.heavy {
		.layer1 {
			height: 160px;
			animation-duration: 0.3s;

			&.a {
				animation-delay: -0.2s;
			}
		}
		.layer2 {
			height: 110px;
			animation-duration: 0.4s;

			&.a {
				animation-delay: -0.3s;
			}
		}
		.layer3 {
			height: 90px;
			animation-duration: 0.6s;

			&.a {
				animation-delay: -0.4s;
			}
		}
	}
}
@keyframes fall {
	100% {
		transform: translateY(230vh);
	}
}
</style>
