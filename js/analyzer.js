const classTimes = [
	{ h: 7, m: 30 },
	{ h: 8, m: 20 },
	{ h: 9, m: 10 },
	{ h: 10, m: 00, interval: true },
	{ h: 10, m: 15 },
	{ h: 11, m: 05 },
	{ h: 11, m: 55, interval: true },
	{ h: 13, m: 00 },
	{ h: 13, m: 50 },
	{ h: 14, m: 40 },
	{ h: 15, m: 30 },
	{ h: 15, m: 45, interval: true },
	{ h: 16, m: 35 },
	{ h: 17, m: 25 },
	{ h: 18, m: 15, interval: true },
	{ h: 19, m: 00 },
	{ h: 19, m: 40 },
	{ h: 20, m: 20 },
	{ h: 21, m: 00, interval: true },
	{ h: 21, m: 10 },
	{ h: 21, m: 50 },
];

const closeTime = {
	h: 22,
	m : 30
};

const weekdays = [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday'
];

function Analyzer(data, classrooms) {

	this.schedule = {};

	this.currentClass = function(time) {
		let hours = time.getHours(),
				minutes = time.getMinutes();

		if (hours > closeTime.h || (hours == closeTime.h && minutes >= closeTime.m))
			return -1;

		let i = 0;
		for (; i < classTimes.length - 1; i++) {
			let classTime = classTimes[i];

			if (classTime.h > hours || (classTime.h == hours && classTime.m > minutes)) {
				i--; //The next class is i, so the current class is i - 1 
				break;
			}
		}

		return i;
	},

	this.setupData = function(time) {
		let weekday = weekdays[time.getDay() - 1],
				hours = time.getHours(),
				minutes = time.getMinutes();

		if (closeTime.h < hours || (closeTime.h == hours && closeTime.m <= minutes)) {
			let lastClasses = [ 
				this.schedule[weekday].Dinalva[classTimes.length - 1],
				this.schedule[weekday].Claudio[classTimes.length - 1],
				this.schedule[weekday].LaPA[classTimes.length - 1]
			];

			return {
				lastClasses: {
					time: classTimes[classTimes.length - 1],
					classes: lastClasses,
				},
				currentClasses: {
					time: closeTime,
					classes: null
				}
			};
		}

		let i = this.currentClass(time);

		if (i < 0) {
			let lastClasses;
			if (weekday === weekdays[0])
				lastClasses = [
					this.schedule[weekdays[weekdays.length - 1]].Dinalva[classTimes.length - 1],
					this.schedule[weekdays[weekdays.length - 1]].Claudio[classTimes.length - 1],
					this.schedule[weekdays[weekdays.length - 1]].LaPA[classTimes.length - 1]
				];
			else
				lastClasses = [
					this.schedule[weekdays[time.getDay() - 2]].Dinalva[classTimes.length - 1],
					this.schedule[weekdays[time.getDay() - 2]].Claudio[classTimes.length - 1],
					this.schedule[weekdays[time.getDay() - 2]].LaPA[classTimes.length - 1]
				];

			return {
				lastClasses: {
					time: classTimes[classTimes.length - 1],
					classes: lastClasses
				},
				currentClasses: {
					time: closeTime,
					classes: null
				}
			};
		} else {
			let lastClasses = null;
			if (i - 1 >= 0)
				lastClasses = [
					this.schedule[weekday].Dinalva[i - 1],
					this.schedule[weekday].Claudio[i - 1],
					this.schedule[weekday].LaPA[i - 1]
				];

			return {
				lastClasses: {
					time: (classTimes[i - 1] ? classTimes[i - 1] : closeTime),
					classes: lastClasses,
				},
				currentClasses: {
					time: classTimes[i],
					classes: [
						this.schedule[weekday].Dinalva[i],
						this.schedule[weekday].Claudio[i],
						this.schedule[weekday].LaPA[i]
					]
				}
			};
		}
	},

	this.nextClasses = function(time) {
		let weekday = weekdays[time.getDay() - 1],
				hours = time.getHours(),
				minutes = time.getMinutes();

		if (closeTime.h < hours || (closeTime.h == hours && closeTime.m <= minutes)) {
			let nextClasses;
			if (weekday === weekdays[weekdays.length - 1])
				nextClasses = [
					this.schedule[weekdays[0]].Dinalva[0],
					this.schedule[weekdays[0]].Claudio[0],
					this.schedule[weekdays[0]].LaPA[0]
				];
			else
				nextClasses = [
					this.schedule[weekdays[time.getDay()]].Dinalva[0],
					this.schedule[weekdays[time.getDay()]].Claudio[0],
					this.schedule[weekdays[time.getDay()]].LaPA[0]
				];

			return {
				time: classTimes[0],
				classes: nextClasses
			}
		}

		let i = this.currentClass(time);

		if (i < 0) {
			return {
				time: classTimes[0],
				classes: [
					this.schedule[weekday].Dinalva[0],
					this.schedule[weekday].Claudio[0],
					this.schedule[weekday].LaPA[0]
				]
			};
		} else {
			let nextClasses = null;
			if (i + 1 < classTimes.length)
				nextClasses = [
					this.schedule[weekday].Dinalva[i + 1],
					this.schedule[weekday].Claudio[i + 1],
					this.schedule[weekday].LaPA[i + 1]
				];

			return {
				time: classTimes[i + 1],
				classes: nextClasses
			};
		}
	}

	let classes = data.split('\n');
	let intervalQtty = 0;
	classTimes.forEach(obj => {
		if (obj.interval)
			intervalQtty++;
	});

	weekdays.forEach(obj => this.schedule[obj] = []);
	console.log(classes);

	let weekdayIndex = 0;
	for (let i = 0; i < classes.length; i++) {
		if (classes[i] == '&') {
			weekdayIndex = 0;
			continue;
		}
		
		if (classes[i] == '-') {
			weekdayIndex++;
			continue;
		}

		let currentDay = classes[i].split(/\t/).map(obj => obj.toUpperCase());
		
		let freeRooms = [].concat(classrooms);
		freeRooms = freeRooms.filter(obj => !currentDay.includes(obj.toUpperCase()));

		if (classTimes[this.schedule[weekdays[weekdayIndex]].length] && classTimes[this.schedule[weekdays[weekdayIndex]].length].interval)
			this.schedule[weekdays[weekdayIndex]].push(classrooms);

		this.schedule[weekdays[weekdayIndex]].push(freeRooms);
	}

	console.log(this.schedule);
}