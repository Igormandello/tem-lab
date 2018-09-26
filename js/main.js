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
		for (let n = 0; n < labNames.length; n++) {
			//actualWeekday[labNames[n]] = [];
			let actualLab = [];

			let timeIndex = 0;
			for (let j = 0; j < classTimes.length; j++)
				if (!classTimes[j].interval) {
					//+1 to skip the separator between each day
					let actualClass = classes[(i * 3 + n) * (classTimes.length - intervalQtty + 1) + timeIndex];

					actualLab.push(actualClass); 
					timeIndex++;
				} else
					actualLab.push('Interval'); 

			actualWeekday[labNames[n]] = actualLab;
			schedule[weekdays[i]] = actualWeekday;
		}
	}

	lab();
}

function lab() {
	let now = new Date(Date.now());

	let weekday = weekdays[now.getDay() - 1],
			hours = now.getHours(),
			minutes = now.getMinutes();

	if (closeTime.h < hours || (closeTime.h == hours && closeTime.m <= minutes)) {
		console.log('what are you doing in the school?');
		return;
	}

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