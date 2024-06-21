import Vue from "vue";

const tutorial_state = () => ({
	follow_tutorial: true,
	build: {
		name: "Build encounter",
		steps: [
			{
				key: "add-players",
				title: "Add players",
				description: "Let's start with adding some players to your encounter.",
				completed: false,
			},
			{
				key: "add-monsters",
				title: "Add monsters",
				description:
					"<p>Now let's give those players a challenge by adding some monsters.</p> The plus buttons adds them with average hit point, the D20 button rolls the hit points.",
				completed: false,
			},
			{
				key: "start",
				title: "Ready to go!",
				description: "If you added at least 1 player and 1 monster, you can start your encounter.",
				completed: false,
			},
		],
	},
	initiative: {
		name: "Setting initiative",
		steps: [
			{
				key: "players",
				title: "Player initiative",
				description:
					"<p>Your players will want to roll their own initiative, therefore we input it manually here.</p> Use tab to skip to the next player.",
				completed: false,
			},
			{
				key: "monsters",
				title: "Monster initiative",
				description: "Monster initiative can be rolled individually or all at once with one click.",
				completed: false,
			},
			{
				key: "start",
				title: "Start combat!",
				description: "With the turn order decided, you can start the encounter!",
				completed: false,
			},
		],
	},
	run: {
		title: "Run encounter",
		completed: false,
		steps: [
			{
				key: "target",
				title: "Target entities",
				description:
					"<p>Click on an entity to target it.</p> <strong>TIP!</strong> You can select multiple targets at once by holding shift and clicking.",
				completed: false,
			},
			{
				key: "action",
				completed: false,
				depends_on: ["monster", "player"],
				branch: {
					player: {
						completed: false,
						steps: [
							{
								key: "manual",
								title: "Input value",
								description:
									"<p>Input the amount of damage or healing you want to apply to the target(s).</p> Use the <strong>Attack</strong> [Enter] button to damage your targets or the <strong>Heal</strong> [Shift + Enter] button to heal them.",
								completed: false,
							},
						],
					},
					monster: {
						completed: false,
						steps: [
							{
								key: "roll",
								title: "Roll action",
								description:
									"Select an action you want to roll and click the <strong>D20</strong> to automatically roll the action.",
								completed: false,
							},
							{
								key: "to-hit",
								title: "Hit or Miss",
								description:
									"<p>We automatically determine if your roll was a hit or miss, based on the target's AC. You can always turn a hit into miss manually.</p>" +
									"<p>For Saving Throw actions you have to manually set it as a success or fail.</p>" +
									"This does not apply for <strong>healing</strong> actions.",
								completed: false,
							},
							{
								key: "defenses",
								title: "Defenses",
								description:
									"<p>With the <strong>V</strong>ulnerable, <strong>R</strong>esistent and <strong>I</strong>mmune buttons you can update a target's defenses for the damage type of the current attack.</p>" +
									"<p>Monsters and Players can have their defenses set before hand, but it can always be overruled for any roll you make.<p>" +
									"This does not apply for <strong>healing</strong> actions.",
								completed: false,
							},
							{
								key: "details",
								title: "Roll details",
								description:
									"<p>Click on the row to show details about the roll.</p>" +
									"<strong>TIP</strong> From the details you can  reroll any die you want.",
								completed: false,
							},
							{
								key: "apply",
								title: "Apply the value",
								description:
									"<p>Apply the total value of the roll to the target.</p>" +
									"<strong>Full</strong> Apply to total value.<br/>" +
									"<strong>Half</strong> Apply half of the total value (rounded down).<br/>" +
									"<strong>Double</strong> Apply the total value multiplied by 2.<br/>" +
									'<strong><i class="fas fa-times"></i></strong> Do not apply the value.',
								completed: false,
							},
						],
					},
					transition: {
						completed: false,
						steps: [
							{ key: "action:next", title: "Next", description: "Next Turn", completed: false },
						],
					},
				},
			},
			{
				key: "opportunity",
				title: "Opportunity attack",
				description: "When the current entity is finished, go to the next turn.",
				completed: false,
			},
		],
	},
});

const tutorial_getters = {
	follow_tutorial: (state) => {
		return state.follow_tutorial;
	},
	get_tutorial: (state) => (tutorial) => {
		return state[tutorial];
	},
	get_current_step:
		(state) =>
		(tutorial, active_branch = undefined, transition = false) => {
			const steps = state[tutorial].steps;
			// const path = `#${tutorial}`;
			const path = "";
			return get_active_step(steps, path, active_branch, transition).step;
		},
	get_current_step_path: (state) => (tutorial, active_branch) => {
		const steps = state[tutorial].steps;
		// const path = `#${tutorial}`;
		const path = "";
		return get_active_step(steps, path, active_branch).path;
	},
	get_current_step_index: (state) => (tutorial) => {
		return state[tutorial]?.steps.findIndex((step) => !step.completed);
	},
	get_step:
		(_state, getters) =>
		(tutorial, step, branch = undefined, transition = false) => {
			const current_step = getters.get_current_step(tutorial, branch, transition);
			const at_step = current_step?.key === step;
			return at_step;
		},
};
const get_active_step = (steps, path, active_branch, transition) => {
	const active_steps = steps.filter((step) => !step.completed);
	if (active_steps.length === 0) {
		return { step: undefined, path };
	}
	// Pop first active step from active steps list;
	const current_step = active_steps.shift();
	path += `.${current_step.key}`;

	// Not branching step so return step.
	if (!current_step.branch) {
		return { step: current_step, path };
	}
	// Branching
	const { branch_steps, branch_key } = get_branch_steps(
		current_step.branch,
		active_branch,
		transition
	);
	path += `<${branch_key}`;
	return get_active_step(branch_steps, path, active_branch, transition);
};

const get_branch_steps = (branches, active_branch, transition) => {
	let branch_steps = [];
	if (!branches.hasOwnProperty(active_branch)) {
		return { branch_steps, branch_key: undefined };
	}
	if (branches[active_branch].completed) {
		if (transition) {
			branch_steps = branches.transition.completed ? [] : branches.transition.steps;
			return { branch_steps, branch_key: "transition" };
		}
		return { branch_steps, branch_key: active_branch };
	}
	branch_steps = branches[active_branch].steps;
	return { branch_steps, branch_key: active_branch };
};

const tutorial_actions = {
	toggleTutorial({ state, commit }) {
		commit("SET_TUTORIAL", !state.follow_tutorial);
	},
	completeStep({ commit, getters }, { tutorial, branch }) {
		// path = run.action<player.
		const path = getters.get_current_step_path(tutorial, branch);
		// console.log("Complete step:", tutorial, branch, path);
		commit("SET_COMPLETE", { tutorial, path });
	},
};

const tutorial_mutations = {
	SET_TUTORIAL(state, payload) {
		Vue.set(state, "follow_tutorial", payload);
	},
	SET_COMPLETE(state, { tutorial, path }) {
		// console.log("SET COMPLETE", tutorial, path);
		let step_reference = state[tutorial];
		let branch_reference = {};
		let branch_root = {};
		let failsafe = 0;
		while (path.length && failsafe < 10) {
			failsafe += 1;
			const { key, type, path: next_path } = next_path_step(path);
			path = next_path;
			switch (type) {
				case "root":
					break;
				case "branch":
					branch_root = step_reference;
					branch_reference = step_reference.branch[key];
					step_reference = step_reference.branch[key];
					break;
				case "step":
					const indx = step_reference.steps.findIndex((step) => step.key === key);
					step_reference = step_reference.steps[indx];
					break;
			}
		}
		Vue.set(step_reference, "completed", true);
		if (branch_reference.completed === false && branch_completed(branch_reference)) {
			branch_reference.completed = true;
		}
		if (branch_root.completed === false && all_branches_completed(branch_root)) {
			branch_root.completed = true;
		}
	},
};

const branch_completed = (branch_reference) => {
	// if all steps are completed filter length == false
	return branch_reference.steps.filter((step) => step.completed === false).length === 0;
};

const all_branches_completed = (branch_root) => {
	return branch_root.depends_on.every((branch) => {
		return branch_root.branch[branch].completed;
	});
};

const next_path_step = (path) => {
	const reg = /^(?<type_sym>[#<.])(?<key>[\w-_]+)/;
	const match = reg.exec(path);
	if (match === null) {
		return false;
	}
	const { key, type_sym } = match.groups;
	const repl_reg = new RegExp(`${type_sym}${key}`, "g");
	const sym2type = {
		"#": "root",
		"<": "branch",
		".": "step",
	};
	path = path.replace(repl_reg, "");
	return { key, type: sym2type[type_sym], path };
};

export default {
	namespaced: true,
	state: tutorial_state,
	getters: tutorial_getters,
	actions: tutorial_actions,
	mutations: tutorial_mutations,
};