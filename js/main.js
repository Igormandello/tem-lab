const excel = `Aula Reforço
2o. INFO - Marcia
2o. INFO - Marcia
2o. INFO - André
2o. INFO - André

Aula Reforço
2o. INFO -  Patricia
2o. INFO -  Patricia
2o. INFO -  Patricia
2o. INFO -  Patricia

2o. INFO - Samuel
2o. INFO - Samuel
2o. INFO - Simone
2o. INFO - Simone
2o. INFO - Simone

Aula Reforço
2o. INFO -  Sérgio
2o. INFO -  Sérgio
2o. INFO -  André
2o. INFO -  André

Aula Reforço
Aula Reforço
Aula Reforço
2o. INFO -  André
2o. INFO -  André`;

const classTimes = [
	{ h: 7, m: 30 },
	{ h: 8, m: 20 },
	{ h: 9, m: 10 },
	{ h: 10, m: 00, interval: true },
	{ h: 10, m: 15 },
	{ h: 11, m: 05 },
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
function setup() {
	let classes = excel.split('\n');

	schedule = {};
	for (let i = 0; i < weekdays.length; i++) {
		let actualWeekday = {};
		for (let n = 0; n < labNames.length; n++)
			actualWeekday[labNames[n]] = [];

		schedule[weekdays[i]] = actualWeekday;
		for (let n = 0; n < 5; n++)
			schedule[weekdays[i]].dinalva.push(classes[i * 6 + n]); //6 to skip the separator between each day
	}

	lab();
}

function lab() {
	let now = new Date(Date.now());
	now.setHours(8);
	now.setMinutes(30);

	let weekday = weekdays[now.getDay()],
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

	console.log(schedule[weekday].dinalva[classIndex]);
}

setup();