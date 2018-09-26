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
]

const duration = 50;

const weekdays = [
	'monday',
	'tuesday',
	'wednesday',
	'thursday',
	'friday'
];

const labNames = [
	'dinalva',
	'claudio',
	'lapa'
]

var schedule;
function load(callback) {
	let request = new XMLHttpRequest();
	request.open('GET', '/js/schedule.txt');
	request.send(null);

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200)
			callback(request.responseText);
	}
}

function setup(data) {
	let classes = data.split('\n');

	schedule = {};
	for (let i = 0; i < weekdays.length; i++) {
		let actualWeekday = {};
		for (let n = 0; n < labNames.length; n++)
			actualWeekday[labNames[n]] = [];

		schedule[weekdays[i]] = actualWeekday;
		let timeIndex = 0;
		for (let n = 0; n < classTimes.length; n++)
			if (!classTimes[n].interval) {
				timeIndex++;
				schedule[weekdays[i]].dinalva.push(classes[i * (classTimes.length + 1) + timeIndex]); //6 to skip the separator between each day
			}
	}

	console.log(schedule);
	lab();
}

function lab() {
	let now = new Date(Date.now());
	now.setHours(10);
	now.setMinutes(15);

	let weekday = weekdays[now.getDay() - 1],
			hours = now.getHours(),
			minutes = now.getMinutes();

	let classIndex = 0;
	for (let i = 1; i < classTimes.length; i++) {
		let actualClass = classTimes[i];
		if (actualClass.h > hours || (actualClass.h == hours && actualClass.m > minutes)) {
			classIndex = i - 1;
			break;
		}
	}

	if (classTimes[classIndex].interval)
		console.log('Interval');
	else
		console.log(schedule[weekday].dinalva[classIndex]);
}

load(setup);