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

	let intervalQtty = 0;
	classTimes.forEach(obj => {
		if (obj.interval)
			intervalQtty++;
	});

	schedule = {};
	for (let i = 0; i < weekdays.length; i++) {
		let actualWeekday = {};
		for (let n = 0; n < labNames.length; n++)
			actualWeekday[labNames[n]] = [];

		schedule[weekdays[i]] = actualWeekday;
		let timeIndex = 0;
		for (let n = 0; n < classTimes.length; n++)
			if (!classTimes[n].interval) {
				//+1 to skip the separator between each day
				let actualClass = classes[i * (classTimes.length - intervalQtty + 1) + timeIndex];

				schedule[weekdays[i]].dinalva.push(actualClass); 
				timeIndex++;
			} else
				schedule[weekdays[i]].dinalva.push('Interval'); 
	}

	console.log(schedule);
	lab();
}

function lab() {
	let now = new Date(Date.now());
	now.setHours(20);
	now.setMinutes(29);

	let weekday = weekdays[4],
			hours = now.getHours(),
			minutes = now.getMinutes();

	let i = 0;
	for (; i < classTimes.length - 1; i++) {
		let actualClass = classTimes[i];

		if (actualClass.h > hours || (actualClass.h == hours && actualClass.m > minutes)) {
			i--; //The next class is i, so the actual class is i - 1 
			break;
		}
	}

	if (i < 0 || i > classTimes.length)
		console.log('what are you doing in the school?');
	else
		console.log(schedule[weekday].dinalva[i]);
}

load(setup);