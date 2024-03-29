<template>
	<div class="hk-markdown" v-if="!readOnly">
		<div class="hk-markdown__header">
			<div>
				<span>
					<i class="fab fa-markdown" aria-hidden="true" />
					{{ label }}
					<q-tooltip anchor="top middle" self="center middle"> Field accepts markdown </q-tooltip>
				</span>
				<i
					class="fas fa-info-circle pointer"
					aria-hidden="true"
					@click="
						setDrawer({
							show: true,
							type: 'drawers/MarkdownInfo',
						})
					"
				/>
			</div>
			<button v-if="value" class="btn btn-sm btn-clear" @click.prevent="preview = !preview">
				<i class="fas" :class="preview ? 'fa-pencil-alt' : 'fa-eye'" aria-hidden="true" />
				<q-tooltip anchor="top middle" self="center middle">
					{{ preview ? "Edit" : "Preview" }}
				</q-tooltip>
			</button>
		</div>
		<q-input
			v-if="!preview"
			:dark="$store.getters.theme === 'dark'"
			filled
			square
			type="textarea"
			@change="change"
			v-model="input"
			autogrow
			:error="error"
			:error-message="errorMessage"
		/>
		<slot v-else>
			<div class="hk-markdown__preview" v-html="marked" />
		</slot>
	</div>
	<div v-else class="hk-markdown__read-only" v-html="marked" />
</template>

<script>
import { mapActions } from "vuex";
import sanitizeHtml from "sanitize-html";
import { marked } from "marked";

marked.setOptions({
	breaks: true,
});

export default {
	name: "hk-markdown-editor",
	props: {
		value: {
			type: String,
		},
		label: {
			type: String,
		},
		error: {
			type: Boolean,
		},
		errorMessage: {
			type: String,
		},
		readOnly: {
			type: Boolean,
			default: false,
		},
	},
	data() {
		return {
			preview: false,
		};
	},
	computed: {
		input: {
			get() {
				return this.value;
			},
			set(newVal) {
				this.$emit("input", newVal);
			},
		},
		marked() {
			return sanitizeHtml(marked.parse(this.value || ""));
		},
	},
	methods: {
		...mapActions(["setDrawer"]),
		change(value) {
			this.$emit("change", value);
		},
	},
};
</script>

<style lang="scss" scoped>
.hk-markdown {
	&__header {
		display: flex;
		justify-content: space-between;
		margin-bottom: 1px;
	}
	&__preview {
		display: inline-block;
		min-height: 56px;
		margin-bottom: 28px;
		background-color: rgba(225, 225, 225, 0.05);
		padding: 16px 12px 6px 12px;
		width: 100%;
	}
}
[data-theme="light"] {
	.hk-markdown__header {
		background-color: rgba(0, 0, 0, 0.03);
	}
}
</style>
