
const Sitemap = () => import("src/views/Pages/Sitemap.vue");
const Privacy = () => import("src/views/Pages/Privacy.vue");
const Documentation = () => import("src/views/Pages/Documentation.vue");
const SignIn = () => import("src/views/Pages/SignIn.vue");
const SignUp = () => import("src/views/Pages/SignUp.vue");
const ResetPassword = () => import("src/views/Pages/ResetPassword.vue");
const Patreon = () => import("src/views/Pages/Patreon.vue");
const WeatherDemo = () => import("src/views/Pages/WeatherDemo.vue");

const Profile = () => import("src/views/profile/Profile.vue");
const Username = () => import("src/views/profile/SetUsername.vue");
const DeleteAccount = () => import("src/views/profile/DeleteAccount.vue");
const Offline = () => import("src/views/Pages/Offline.vue");
const RunEncounter = () => import("src/views/RunEncounter.vue");
const User = () => import("src/views/User.vue");

// This is where you add all your site routes
// Each route is set as an object in the array
// For a the most basic route just set
// the path & component to load

const routes = [
	{
		path: "",
		name: "home",
		component: () => import("src/views/Home.vue"),
		meta: {
			sidebar: false,
			offline: true,
			description: "Harmless Key, a combat tracker for D&D 5e. The online tool, for offline play.",
			title: "D&D Combat Tracker",
		},
	},
	{ path: "/home", redirect: "/" },

	// CONTENT
	{
		path: "/content",
		component: () => import("src/layouts/authenticated"),
		meta: {
			requiresAuth: true,
			title: "Content",
		},
		children: [
			{
				path: "",
				name: "Content",
				component: () => import("src/views/UserContent"),
				meta: {
					description: "Your custom content on Harmless Key.",
					title: "Content",
				},
			},
			{
				path: "manage",
				name: "Manage content",
				component: () => import("src/views/UserContent/ManageContent"),
				meta: {
					description: "Manage your content on Harmless Key.",
					title: "Manage content",
				},
			},

			{
				path: "import",
				name: "Import content",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Import content",
				},
				children: [
					{
						path: "",
						component: () => import("src/views/UserContent/ImportContent"),
						meta: {
							description: "Import content to Harmless Key",
							title: "Import Harmless Key  Content",
						},
					},
					{
						path: "hk_import",
						name: "Import HK Content",
						component: () => import("src/views/UserContent/ImportContent/ImportHKContent"),
						meta: {
							description: "Import User Content from an HK export",
							title: "Import Harmless Key Content",
						},
					},
				],
			},

			// Campaigns
			{
				path: "campaigns",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Campaigns",
				},
				children: [
					{
						path: "",
						name: "Campaigns",
						component: () => import("src/views/UserContent/Campaigns/Campaigns.vue"),
						meta: {
							description: "Your campaigns on Harmless Key.",
							title: "Campaigns",
						},
					},
				],
			},

			// Players
			{
				path: "players",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Players",
				},
				children: [
					{
						path: "",
						name: "Players",
						component: () => import("src/views/UserContent/Players"),
						meta: {
							description: "Your players Harmless Key.",
							title: "Players",
						},
					},
					{
						path: "add-player",
						name: "Add player",
						component: () => import("src/views/UserContent/Players/EditPlayer.vue"),
						meta: {
							title: "Add player",
							description: "Create a new player on Harmless Key.",
						},
					},
					{
						path: ":id",
						name: "Edit player",
						component: () => import("src/views/UserContent/Players/EditPlayer.vue"),
						meta: {
							title: "Edit player",
							description: "Edit an existing player on Harmless Key.",
						},
					},
				],
			},

			// Character builder
			{
				path: "character-builder",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Character builder",
				},
				children: [
					{
						path: "",
						name: "CharacterBuilder",
						component: () => import("src/views/UserContent/CharacterBuilder"),
						meta: {
							description: "Your Characters on Harmless Key.",
							title: "Character builder",
						},
					},
					{
						path: ":id",
						component: () => import("src/layouts/character-builder"),
						meta: {
							title: "Edit character",
							description: "Edit an existing character on Harmless Key.",
							side: false,
						},
						children: [
							{
								path: "",
								name: "EditCharacterGeneral",
								component: () =>
									import("src/views/UserContent/CharacterBuilder/EditCharacter/general"),
								meta: {
									description: "Edit your character's general information",
									title: "General",
									side: false,
								},
							},
							{
								path: "info",
								name: "EditCharacterInfoTab",
								component: () =>
									import("src/views/UserContent/CharacterBuilder/EditCharacter/info"),
								meta: {
									description: "Character builder information",
									title: "Info",
									side: false,
								},
							},
							{
								path: "general",
								name: "EditCharacterGeneralTab",
								component: () =>
									import("src/views/UserContent/CharacterBuilder/EditCharacter/general"),
								meta: {
									description: "Edit your character's general information",
									title: "General",
									side: false,
								},
							},
							{
								path: "race",
								name: "EditRace",
								component: () =>
									import("src/views/UserContent/CharacterBuilder/EditCharacter/race"),
								meta: {
									title: "Race",
									description: "Edit your character's race",
									side: false,
								},
							},
							{
								path: "class",
								name: "EditClass",
								component: () =>
									import("src/views/UserContent/CharacterBuilder/EditCharacter/class"),
								meta: {
									title: "Class",
									description: "Edit your character's classes",
									side: false,
								},
							},
							{
								path: "abilities",
								name: "EditAbilities",
								component: () =>
									import("src/views/UserContent/CharacterBuilder/EditCharacter/abilities"),
								meta: {
									title: "Abilities",
									description: "Edit your character's abilities",
									side: false,
								},
							},
							{
								path: "equipment",
								name: "EditEquipment",
								component: () =>
									import("src/views/UserContent/CharacterBuilder/EditCharacter/equipment"),
								meta: {
									title: "Equipment",
									description: "Edit your character's equipment",
									side: false,
								},
							},
						],
					},
				],
			},
			// NPCs
			{
				path: "npcs",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "NPCs",
				},
				children: [
					{
						path: "",
						name: "NPCs",
						component: () => import("src/views/UserContent/Npcs/Npcs.vue"),
						meta: {
							title: "NPCs",
							description: "Your custom non-player characters on Harmless Key.",
						},
					},
					{
						path: "add-npc",
						name: "Add NPC",
						component: () => import("src/views/UserContent/Npcs/EditNpc.vue"),
						meta: {
							title: "Add NPC",
							description: "Create a new NPC on Harmless Key.",
						},
					},
					{
						path: ":id",
						name: "Edit NPC",
						component: () => import("src/views/UserContent/Npcs/EditNpc.vue"),
						meta: {
							title: "Edit NPC",
							description: "Edit an existing NPC on Harmless Key.",
						},
					},
				],
			},
			{
				path: "companions",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Companions",
				},
				children: [
					{
						path: "",
						name: "Companions",
						component: () => import("src/views/UserContent/Npcs/Npcs.vue"),
						meta: {
							title: "Companions",
							description: "Your custom companions Harmless Key.",
						},
					},
					{
						path: ":id",
						name: "Edit Companion",
						component: () => import("src/views/UserContent/Npcs/EditNpc.vue"),
						meta: {
							title: "Edit Companion",
							description: "Edit an existing companion on Harmless Key.",
						},
					},
					{
						path: ":userid/:id",
						name: "Edit companion",
						component: () => import("src/views/UserContent/Npcs/EditNpc.vue"),
						meta: {
							title: "Edit companion",
							description: "Edit an existing companion on Harmless Key.",
						},
					},
				],
			},

			// Spells
			{
				path: "spells",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Spells",
				},
				children: [
					{
						path: "",
						name: "Spells",
						component: () => import("src/views/UserContent/Spells/Spells.vue"),
						meta: {
							title: "Spells",
							description: "Your custom spells on Harmless Key.",
						},
					},
					{
						path: "add-spell",
						name: "Add spell",
						component: () => import("src/views/UserContent/Spells/EditSpell.vue"),
						meta: {
							title: "Add spell",
							description: "Create a new spell on Harmless Key.",
						},
					},
					{
						path: ":id",
						name: "Edit spell",
						component: () => import("src/views/UserContent/Spells/EditSpell.vue"),
						meta: {
							title: "Edit spell",
							description: "Edit an existing spell on Harmless Key.",
						},
					},
				],
			},

			// Reminders
			{
				path: "reminders",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Reminders",
				},
				children: [
					{
						path: "",
						name: "Reminders",
						component: () => import("src/views/UserContent/Reminders"),
						meta: {
							title: "Reminders",
							description: "Your custom reminders Harmless Key.",
						},
					},
					{
						path: "add-reminder",
						name: "Add reminder",
						component: () => import("src/views/UserContent/Reminders/EditReminder.vue"),
						meta: {
							title: "Add reminder",
							description: "Add a new reminder on Harmless Key.",
						},
					},
					{
						path: ":id",
						name: "Edit reminder",
						component: () => import("src/views/UserContent/Reminders/EditReminder.vue"),
						meta: {
							title: "Edit reminder",
							description: "Edit an existing reminder Harmless Key.",
						},
					},
				],
			},

			// Items
			{
				path: "items",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Items",
				},
				children: [
					{
						path: "",
						name: "Items",
						component: () => import("src/views/UserContent/Items/Items.vue"),
						meta: {
							title: "Items",
							description: "Your custom items Harmless Key.",
						},
					},
					{
						path: "add-item",
						name: "Add item",
						component: () => import("src/views/UserContent/Items/EditItem.vue"),
						meta: {
							title: "Add item",
							description: "Add an existing item on Harmless Key.",
						},
					},
					{
						path: ":id",
						name: "Edit item",
						component: () => import("src/views/UserContent/Items/EditItem.vue"),
						meta: {
							title: "Edit item",
							description: "Edit an existing item on Harmless Key.",
						},
					},
				],
			},

			// Characters
			{
				path: "characters",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Characters",
				},
				children: [
					{
						path: "",
						name: "Characters",
						component: () => import("src/views/UserContent/Characters"),
						meta: {
							title: "Characters",
							description: "Your player characters on Harmless Key.",
						},
					},
					{
						path: ":id",
						name: "Edit character",
						component: () => import("src/views/UserContent/Players/EditPlayer.vue"),
						meta: {
							title: "Edit character",
							description: "Edit an existing character on Harmless Key.",
						},
					},
				],
			},

			// Followed users
			{
				path: "followed",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Followed users",
				},
				children: [
					{
						path: "",
						name: "Followed users",
						component: () => import("src/views/UserContent/Followed.vue"),
						meta: {
							title: "Followed users",
							description: "Other users you're following on Harmless Key.",
						},
					},
				],
			},

			// Settings
			{
				path: "settings",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Settings",
				},
				children: [
					{
						path: "",
						name: "Settings",
						component: () => import("src/views/UserContent/Settings.vue"),
						meta: {
							title: "Settings",
							description: "Your custom settings for Harmless Key.",
						},
					},
				],
			},
		],
	},

	// DM SCREEN
	{
		path: "/content/campaigns/:campid",
		component: () => import("src/layouts/run-campaign"),
		meta: {
			requiresAuth: true,
			title: "Run campaign",
		},
		children: [
			{
				path: "",
				name: "Run campaign",
				component: () => import("src/views/UserContent/Campaigns/RunCampaign"),
				meta: {
					description: "Run your campaign on Harmless Key.",
					title: "Run campaign",
				},
			},
			{
				path: ":encid",
				name: "EditEncounter",
				component: () => import("src/views/UserContent/Encounters/EditEncounter"),
				meta: {
					title: "Edit encounter",
					description: "Edit your Harmless Key encounter.",
					side: false,
				},
			},
		],
	},

	// TOOLS
	{
		path: "/tools",
		component: () => import("src/layouts/default"),
		meta: {
			title: "Tools",
		},
		children: [
			{
				path: "",
				name: "Tools",
				component: () => import("src/views/Tools"),
				meta: {
					title: "D&D 5e Tools",
					description:
						"Online tools for D&D 5e. \nCombat Tracker \nEncounter Builder \nDM Screen \nMonster builder \nSpell creator \nCharacter Builder \nCharacter Sync \nCompendium",
				},
			},
			{
				path: "combat-tracker",
				name: "ToolsCombatTracker",
				component: () => import("src/views/Tools/CombatTracker"),
				meta: {
					title: "D&D 5e Combat Tracker",
					description: "An advanced initiative tracker for Dungeons and Dragons 5th edition.",
				},
			},
			{
				path: "encounter-builder",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "D&D 5e Encounter Builder",
					description:
						"An encounter builder for D&D 5e. It calculates the difficulty of your encounter and you can directly run it in our Combat Tracker.",
				},
				children: [
					{
						path: "",
						name: "ToolsEncounterBuilder",
						component: () => import("src/views/Tools/EncounterBuilder"),
						meta: {
							title: "D&D 5e Encounter Builder",
							description:
								"An encounter builder for D&D 5e. It calculates the difficulty of your encounter and you can directly run it in our Combat Tracker.",
						},
					},
					{
						path: "build-encounter",
						name: "ToolsBuildEncounter",
						component: () => import("src/components/encounters"),
						meta: {
							title: "Build encounter for D&D 5e",
							description:
								"Create an encounter for D&D 5e and find out its difficulty. Once you're finished you can run it in our Combat Tracker.",
							side: false,
						},
					},
				],
			},
			{
				path: "dm-screen",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "D&D 5e DM Screen",
					description:
						"A DM Screen for D&D 5e. Quickly reference rules and directly run encounters.",
				},
				children: [
					{
						path: "",
						name: "ToolsDmScreen",
						component: () => import("src/views/Tools/DmScreen"),
						meta: {
							title: "D&D 5e DM Screen",
							description:
							"A Dungeon Master Screen for D&D 5e. Quickly reference rules and directly run encounters.",
						},
					}
				],
			},
			{
				path: "monster-creator",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "D&D 5e Monster creator",
					description:
						"An advanced monster creator for D&D 5e. Create a stat block with easy to roll actions.",
				},
				children: [
					{
						path: "",
						name: "ToolsMonsterCreator",
						component: () => import("src/views/Tools/MonsterCreator"),
						meta: {
							title: "Dungeons & Dragons Monster Creator",
							description:
								"An advanced monster creator for D&D 5e. Create a stat block with easy to roll actions.",
						},
					},
					{
						path: "create-monster",
						name: "ToolsCreateMonster",
						component: () => import("src/views/UserContent/Npcs/EditNpc"),
						meta: {
							title: "Create monster",
							description: "Create your custom D&D 5e monster.",
						},
					},
				],
			},
			{
				path: "spell-creator",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "D&D 5e Spell creator",
					description:
						"Create spells for D&D 5e to roll directly or use in your custom spellcaster monsters.",
				},
				children: [
					{
						path: "",
						name: "ToolsSpellCreator",
						component: () => import("src/views/Tools/SpellCreator"),
						meta: {
							title: "Dungeons & Dragons Spell Creator",
							description:
								"Create spells for D&D 5e to roll directly or use in your custom spellcaster monsters.",
						},
					},
					{
						path: "create-spell",
						name: "ToolsCreateSpell",
						component: () => import("src/views/UserContent/Spells/EditSpell"),
						meta: {
							title: "Create spell",
							description:
								"Create your custom D&D 5e spell to roll directly or use in your custom spellcaster monsters.",
						},
					},
				],
			},
			{
				path: "character-sync",
				name: "ToolsCharacterSync",
				component: () => import("src/views/Tools/CharacterSync"),
				meta: {
					title: "Character Sync",
					description:
						"Sync the D&D 5e characters of your players in Harmless Key. Update the stats of your players characters with one click.",
				},
			},
			{
				path: "character-builder",
				name: "ToolsCharacterBuilder",
				component: () => import("src/views/Tools/CharacterBuilder"),
				meta: {
					title: "Character Builder",
					description:
						"An advanced character builder for D&D 5e. Create a character sheet for you character.",
				},
			},
			{
				path: "homebrew-creation",
				name: "ToolsHomebrewCreation",
				component: () => import("src/views/Tools/HomebrewCreation"),
				meta: {
					title: "Homebrew Creation",
					description:
						"Homebrew Creation. Because the secret of D&D is: you can create everything yourself",
				},
			},
		],
	},

	//COMPENDIUM
	{
		path: "/compendium",
		component: () => import("src/layouts/default"),
		meta: {
			title: "Compendium",
		},
		children: [
			{
				path: "",
				name: "Compendium",
				component: () => import("src/views/Compendium"),
				meta: {
					title: "Compendium D&D 5e",
					description: "Conditions, items, monsters and spells for Dungeons & Dragons 5th edition.",
				},
			},
			{
				path: "monsters",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Monsters D&D 5e",
					description: "Dungeons & Dragons 5th edition monsters. All monsters from the SRD 5.1",
				},
				children: [
					{
						path: "",
						name: "Monsters",
						component: () => import("src/views/Compendium/Monsters"),
						meta: {
							title: "Monsters D&D 5e",
							description: "Dungeons & Dragons 5th edition monsters. All monsters from the SRD 5.1",
						},
					},
					{
						path: ":id",
						name: "Monster",
						component: () => import("src/views/Compendium/view/Monster"),
						meta: {
							title: "Monster D&D 5e",
							description: "D&D 5th Edition monster.",
						},
					},
				],
			},
			{
				path: "spells",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Spells D&D 5e",
				},
				children: [
					{
						path: "",
						name: "Spells D&D 5e",
						component: () => import("src/views/Compendium/Spells"),
						meta: {
							title: "Spells D&D 5e",
							description: "Dungeons & Dragons 5th edition spells. All spells from the SRD 5.1",
						},
					},
					{
						path: ":id",
						name: "Spell",
						component: () => import("src/views/Compendium/view/Spell"),
						meta: {
							title: "Spell",
						},
					},
				],
			},
			{
				path: "conditions",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Conditions",
				},
				children: [
					{
						path: "",
						name: "Conditions",
						component: () => import("src/views/Compendium/Conditions"),
						meta: {
							title: "Conditions D&D 5e",
							description: "Dungeons & Dragons 5th edition spells. All conditions from the SRD 5.1",
						},
					},
					{
						path: ":id",
						name: "Condition",
						component: () => import("src/views/Compendium/view/Condition"),
						meta: {
							title: "Condition",
						},
					},
				],
			},
			{
				path: "items",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Items",
				},
				children: [
					{
						path: "",
						name: "CompendiumItems",
						component: () => import("src/views/Compendium/Items"),
						meta: {
							title: "Items D&D 5e",
							description: "Dungeons & Dragons 5th edition items. All items from the SRD 5.1",
						},
					},
					{
						path: ":id",
						name: "Item",
						component: () => import("src/views/Compendium/view/Item"),
						meta: {
							title: "Item",
						},
					},
				],
			},
			{
				path: "rules",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Rules",
				},
				children: [
					{
						path: "",
						name: "CompendiumRules",
						component: () => import("src/views/Compendium/Rules"),
						meta: {
							title: "Rules D&D 5e",
							description: "Dungeons & Dragons 5th edition rules. Rules for playing D&D 5e.",
						},
					},
					{
						path: ":id",
						name: "Rule",
						component: () => import("src/views/Compendium/view/Rule"),
						meta: {
							title: "Rule",
						},
					},
				],
			},
		],
	},

	// ADMIN
	{
		path: "/admin",
		component: () => import("src/layouts/admin"),
		meta: {
			requiresAuth: true,
			requiresAdmin: true,
			title: "Admin",
		},
		children: [
			{
				path: "",
				name: "Admin",
				component: () => import("src/views/Admin"),
			},
			{
				path: "users",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Users",
				},
				children: [
					{
						path: "",
						name: "Users",
						component: () => import("src/views/Admin/Users.vue"),
					},
					{
						path: ":id",
						name: "User",
						component: () => import("src/views/Admin/Users.vue"),
						meta: {
							title: "User",
						},
					},
				],
			},
			{
				path: "patrons",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Patrons",
				},
				children: [
					{
						path: "",
						name: "Patrons",
						component: () => import("src/views/Admin/Patrons"),
					},
					{
						path: "new",
						name: "New patron",
						component: () => import("src/views/Admin/Patrons/New"),
						meta: {
							title: "New patron",
						},
					},
					{
						path: ":id",
						name: "Patron",
						component: () => import("src/views/Admin/Patrons"),
						meta: {
							title: "Patron",
						},
					},
				],
			},
			{
				path: "vouchers",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Vouchers",
				},
				children: [
					{
						path: "",
						name: "Vouchers",
						component: () => import("src/views/Admin/Vouchers.vue"),
					},
				],
			},
			{
				path: "export",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Export",
				},
				children: [
					{
						path: "",
						name: "Export datases",
						component: () => import("src/views/Admin/ExportDatabase.vue"),
					},
				],
			},
			{
				path: "xml",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Generate XML",
				},
				children: [
					{
						path: "",
						name: "Generate XML",
						component: () => import("src/views/Admin/GenerateXML.vue"),
					},
				],
			},
			{
				path: "prerender",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Generete prerender paths JSON",
				},
				children: [
					{
						path: "",
						name: "Generate JSON",
						component: () => import("src/views/Admin/GeneratePrerenderPaths.vue"),
					},
				],
			},
			{
				path: "monster-update",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Update monsters",
				},
				children: [
					{
						path: "",
						name: "Update monsters",
						component: () => import("src/views/Admin/MonsterUpdate.vue"),
					},
				],
			},
			{
				path: "search-table",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Generate search table",
				},
				children: [
					{
						path: "",
						name: "Generate search table",
						component: () => import("src/views/Admin/GenerateSearchTable.vue"),
					},
				],
			},
			{
				path: "update-db-keys",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Update db keys",
				},
				children: [
					{
						path: "",
						name: "Update db keys",
						component: () => import("src/views/Admin/UpdateDBkeys.vue"),
					},
				],
			},
			{
				path: "restruct-db",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Restructure Database",
				},
				children: [
					{
						path: "",
						name: "Restructure Database",
						component: () => import("src/views/Admin/RestructDatabase.vue"),
					},
				],
			},
		],
	},

	// DEMO ENCOUNTER
	{
		path: "/demo",
		name: "Demo",
		component: RunEncounter,
		meta: {
			sidebar: false,
			offline: true,
			title: "Encounter demo",
			description:
				"Try running an encounter with Harmless Key, a Combat Tracker for Dungeons & Dragons 5th Edition.",
		},
	},
	{
		path: "/weather-demo",
		name: "Weather demo",
		component: WeatherDemo,
		meta: {
			sidebar: false,
			offline: true,
			title: "Weather effects.",
			description:
				"Add weather effects to your encounters with Harmless Key, a Dungeons & Dragons Combat Tracker.",
		},
	},

	// CONTRIBUTE
	{
		path: "/contribute",
		component: () => import("src/layouts/contribute"),
		meta: {
			requiresAuth: true,
			title: "Contribute",
		},
		children: [
			{
				path: "",
				name: "Contribute",
				component: () => import("src/views/Contribute"),
			},
			{
				path: "spells",
				component: {
					render(c) {
						return c("router-view");
					},
				},
				meta: {
					title: "Spells",
				},
				children: [
					{
						path: "",
						name: "ContributeSpells",
						component: () => import("src/views/Contribute/Spells.vue"),
					},
					{
						path: ":id",
						component: {
							render(c) {
								return c("router-view");
							},
						},
						meta: {
							title: "Spell contribute",
						},
						children: [
							{
								path: "",
								name: "Spell contribute",
								component: () => import("src/components/contribute/spell"),
							},
							{
								path: "edit",
								name: "Edit contribute spell",
								component: () => import("src/components/contribute/spell/edit.vue"),
							},
						],
					},
				],
			},
		],
	},

	//STAND ALONE PAGES
	{
		path: "/sitemap",
		name: "Sitemap",
		component: Sitemap,
		meta: {
			title: "Sitemap",
			description: "Sitemap of Harmless Key, a Combat Tracker for D&D.",
		},
	},
	{
		path: "/privacy-policy",
		name: "Privacy Policy",
		component: Privacy,
		meta: {
			title: "Privacy policy",
			description: "Privacy policy for Harmless Key, a Combat Tracker for D&D.",
		},
	},
	{
		path: "/about-us",
		component: () => import("src/layouts/default"),
		meta: {
			offline: true,
			title: "About us",
		},
		children: [
			{
				path: "",
				name: "About us",
				component: () => import("src/views/Pages/AboutUs"),
				meta: {
					title: "About us",
					description:
						"Harmless Key is a Combat Tracker for Dungeon and Dragons, created by 2 experienced D&D players who were missing an initiative tracker that met their needs.",
				},
			},
		],
	},
	{
		path: "/documentation",
		name: "Documentation",
		component: Documentation,
		meta: {
			offline: true,
			title: "Documentation",
			description: "Documentation for Harmless Key, a Combat Tracker for D&D.",
		},
	},
	{
		path: "/support",
		component: () => import("src/layouts/default"),
		meta: {
			offline: true,
			title: "Support",
		},
		children: [
			{
				path: "",
				name: "Support",
				component: () => import("src/views/Pages/Support"),
				meta: {
					title: "Support",
					description: "Get support with Harmless Key issues.",
				},
			},
		],
	},
	{
		path: "/feedback",
		component: () => import("src/layouts/default"),
		meta: {
			offline: true,
			title: "Feedback",
		},
		children: [
			{
				path: "",
				name: "Feedback",
				component: () => import("src/views/Pages/Feedback"),
				meta: {
					title: "Feedback",
					description: "Leave feedback for Harmless Key, a Combat Tracker for D&D.",
				},
			},
		],
	},
	{
		path: "/changelog",
		component: () => import("src/layouts/default"),
		meta: {
			title: "Changelog",
		},
		children: [
			{
				path: "",
				name: "Changelog",
				component: () => import("src/views/Pages/Changelog"),
				meta: {
					title: "Changelog",
					description: "Changelog of D&D 5e Combat Tracker Harmless Key.",
				},
			},
		],
	},
	{
		path: "/cookies",
		component: () => import("src/layouts/default"),
		meta: {
			title: "Cookies",
		},
		children: [
			{
				path: "",
				name: "Cookies",
				component: () => import("src/views/Pages/Cookies"),
				meta: {
					title: "Cookies",
					description: "Cookie information for Harmless Key.",
				},
			},
		],
	},
	{
		path: "/sign-in",
		name: "signIn",
		component: SignIn,
		meta: {
			sidebar: false,
			description: "Sign in to your account on Harmless Key, a Combat Tracker for D&D.",
		},
	},
	{
		path: "/sign-up",
		name: "signUp",
		component: SignUp,
		meta: {
			sidebar: false,
			title: "Sign up",
			description: "Create an account for Harmless Key, a Combat Tracker for D&D",
		},
	},
	{
		path: "/forgot-password",
		name: "resetPassword",
		component: ResetPassword,
		meta: {
			sidebar: false,
			title: "Forgot password",
			description: "Request to reset your Harmless Key password.",
		},
	},
	{
		path: "/patreon",
		name: "Patreon",
		component: Patreon,
		meta: {
			title: "Patreon support",
			description:
				"Support Harmless Key on Patreon for more content slots and help our D&D Combat Tracker improve.",
		},
	},
	{
		path: "/poster",
		name: "poster",
		component: () => import("src/views/Home.vue"),
	},

	//PROFILE
	{
		path: "/profile",
		name: "profile",
		component: Profile,
		meta: {
			requiresAuth: true,
			title: "Profile",
			description: "Your Harmless Key profile page.",
		},
	},
	{
		path: "/profile/delete-account",
		name: "deleteAccount",
		component: DeleteAccount,
		meta: {
			requiresAuth: true,
		},
	},
	{
		path: "/set-username",
		name: "Username",
		component: Username,
		meta: {
			sidebar: false,
			title: "Set username",
			description: "Set your username for Harmless Key.",
		},
	},
	{
		path: "/run-encounter/:campid/:encid",
		name: "RunEncounter",
		component: RunEncounter,
		meta: {
			title: "Run encounter",
			requiresAuth: true,
			sidebar: false,
			description: "Run your encounter in Harmless Key, a Combat Tracker for D&D 5e.",
		},
	},
	{
		path: "/test-encounter/:campid/:encid",
		name: "TestEncounter",
		component: RunEncounter,
		meta: {
			title: "Test encounter",
			requiresAuth: true,
			sidebar: false,
			description: "Test your encounter in Harmless Key, a Combat Tracker for D&D 5e.",
		},
	},
	{
		path: "/user/:userid",
		name: "Follow user",
		component: User,
		meta: {
			basePath: "/user",
			title: "User page",
			description:
				"Follow the live initiative lists of your DM with Harmless Key, a Dungeons & Dragons Initiative Tracker.",
		},
	},
	{
		path: "/user/:userid/:campid",
		name: "Follow campaign",
		component: () => import("src/components/trackCampaign"),
		meta: {
			basePath: "/user",
			title: "Campaign",
			sidebar: false,
			description:
				"Campaign with live initiative list of the encounters with Harmless Key, a Dungeons & Dragons Initiative Tracker.",
		},
	},
	{ path: "/track-encounter/:userid", redirect: "/user/:userid" },
	{
		path: "/offline",
		name: "Offline",
		component: Offline,
	},

	// REDIRECT OLD PATHS
	{ path: "/campaigns", redirect: "/content/campaigns" },
	{ path: "/players", redirect: "/content/players" },
	{ path: "/characters", redirect: "/content/characters" },
	{ path: "/npcs", redirect: "/content/npcs" },
	{ path: "/reminders", redirect: "/content/reminders" },
	{ path: "/items", redirect: "/content/items" },
	{ path: "/encounters/*", redirect: "/content/campaigns" },
	{ path: "/followed", redirect: "/content/followed" },
	{ path: "/settings", redirect: "/content/settings" },

	{ path: "/updates", redirect: "/changelog" },
	{ path: "/combat-tracker", redirect: "/demo" },
	{ path: "/monster-creator", redirect: "/tools/monster-creator/create-monster" },
	{ path: "/encounter-builder", redirect: "/tools/encounter-builder/build-encounter" },

	{
		path: "*",
		component: () => import("src/views/Pages/Error404.vue"),
	},
];

export default routes;
