import { db } from '@/firebase'
import { mapActions, mapGetters } from 'vuex'

export const setHP = {
	created() {
		
	},
	data() {
		return {
			
		}
	},
	computed: {
		...mapGetters([
			'encounter',
		]),
	},
	methods: {
		...mapActions([
			'set_save',
			'set_stable',
			'set_hp',
			'set_dead',
		]),
		setHP(amount, key, target, current, type) {
			amount = parseInt(amount);

			if(type == 'damage') {
				this.isDamage(key, target, current, amount)
			}
			else {
				this.isHealing(key, target, current, amount)
			}
		},
		isDamage(key, target, current, amount) {
			var maxHp = parseInt(target.maxHp);
			var curHp = parseInt(target.curHp);
			var tempHp = parseInt(target.tempHp);
			var transCurHp = parseInt(target.transformedCurHp);
			var type = 'damage';
			var over = 0;
			var rest_amount = amount;

			//Death saves at 0 hp
			if(curHp == 0) {
				var n = parseInt(Object.keys(target.saves).length)
				
				this.set_save({
				 key: key,
				 check: 'fail',
				 number: n
				})
				if(this.crit) {
					n = parseInt(Object.keys(target.saves).length)

					this.set_save({
					key: key,
					check: 'fail',
					number: n
					})
				}
			}

			//First check if there is tempHp and put damage in there first.
			if(tempHp) {
				var newtemp = parseInt(tempHp - amount);

				//Adjust the rest amount
				rest_amount = 0;
				if(newtemp <= 0) {
					rest_amount = parseInt(amount - tempHp);
				}

				//Set the new HP
				this.set_hp({
					key: key,
					pool: 'temp',
					newHp: newtemp,
				});
			}
			//Then check if the target is transformed and put rest damage in the transformation
			if(target.transformed == true) {
				var newtrans = parseInt(transCurHp - rest_amount);

				//Adjust the rest amount
				rest_amount = 0;
				if(newtrans <= 0) {
					rest_amount = parseInt(amount - transCurHp);
				}

				//Set the new HP
				this.set_hp({
					key: key,
					pool: 'transformed',
					newHp: newtrans,
				});
			}
			//If there is damage left after taking it from the tempHp and/or the transformation
			if(rest_amount > 0) {
				var newhp = parseInt(curHp - rest_amount);

				if(newhp <= 0) {
					this.set_stable({
						key: target.key,
						action: 'unset',
					});
				}
			
				//When there is an overkill
				if(newhp < 0) { 
					newhp = 0;

					if(tempHp) {
						over = parseInt(rest_amount + tempHp - curHp); //overkill
						amount = parseInt(curHp + tempHp);
					}
					else {
						over = parseInt(rest_amount - curHp); //overkill
						amount = curHp;
					}
					//Character dies if the overkill is >= maxHp
					if(over >= maxHp && target.entityType == 'player') {
						this.set_dead({
							key: key,
							action: 'set',
						})
					}
				}
				this.set_hp({
					key: key,
					newHp: newhp,
				})
			}

			//Notification
			this.$snotify.error(
				current.name + ' did ' + amount + ' ' + type + ' to ' + target.name,
				'Damage done!', 
				{
					position: "centerTop"
				}
			);
			//Add to log
			this.addLog(type, target.name, current.name, amount, over);

			//Add to damagemeters
			this.damageMeters(type, amount, over);
		},
		isHealing(key, target, current, amount) {
			if(target.transformed == true) {
				var maxHp = parseInt(target.transformedMaxHp);
				var curHp = parseInt(target.transformedCurHp);
				var pool = 'transformed';
			}
			else {
				var maxHp = parseInt(target.maxHp);
				var curHp = parseInt(target.curHp);
				var pool = '';
			}
			var newhp = parseInt(curHp + amount);
			var type = 'healing'
			var over = 0

			//If the target is a player and the curHp was 0, saves need to be reset
			if(target.entityType == 'player' && curHp == 0) {
				this.set_save({
					key: key,
					check: 'reset'
				})
				this.set_dead({
					key: key,
					action: 'unset',
				})
			}

			if(newhp > maxHp) { 
				newhp = maxHp;
				over = amount - maxHp + curHp; //overhealing
				amount = maxHp - curHp;
			}
			
			//Heal the target
			this.set_hp({
				key: key,
				pool: pool,
				newHp: newhp,
			})

			//Notification
			this.$snotify.success(
				current.name + ' did ' + amount + ' ' + type + ' to ' + target.name, 
				'Healing done!', 
				{
					position: "centerTop",
				}
			);
			//Add to log
			this.addLog(type, target.name, current.name, amount, over)
			
			//Add to damagemeters
			this.damageMeters(type, amount, current.name, over);
		},
		addLog(type, target, current, amount, over) {
			var d = new Date();
			var time = d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds();

			if(localStorage.getItem(this.encounterId)) {
				this.log = JSON.parse(localStorage.getItem(this.encounterId));
			}
			// if(this.$cookies.isKey(this.encounterId) == true) {
			// 	this.log = JSON.parse(this.$cookies.get(this.encounterId));
			// }
			else {
				this.log = []
			}
			this.log.unshift({
				round: this.encounter.round,
				turn: this.encounter.turn + 1,
				by: current,
				time: time,
				type: type,
				damageType: this.damageType,
				target: target,
				amount: amount,
				over: over
			})
			
			const parsed = JSON.stringify(this.log);
			localStorage.setItem(this.encounterId, parsed);
			// this.$cookies.set(this.encounterId, JSON.stringify(this.log), "2m");
			// this.$emit("log", this.log)
		},
		damageMeters(type, amount, over) {
			// if(amount > 0) {
			// 	db.ref(`meters/${this.userId}/${this.encounterId}/${type}/${this.current.key}`).push({
			// 		amount: amount,
			// 		round: this.encounter.round,
			// 		target: this.targeted,
			// 		damageType: this.damageType,
			// 		over: over,
			// 	});
			// }
		},
	}
}