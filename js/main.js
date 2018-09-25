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

	console.log(schedule);
}
