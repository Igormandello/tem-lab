const gistURL = 'https://gist.githubusercontent.com/Igormandello/a8d8d01fb9997c1120a18a2b1bdf20ad/raw/3439ce0ae2c27282182fcf15268d1266834d420d/Schedule';
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
function setup(data, callback) {
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

	callback();
}

function lab(time) {
	let weekday = weekdays[time.getDay() - 1],
			hours = time.getHours(),
			minutes = time.getMinutes();

	if (closeTime.h < hours || (closeTime.h == hours && closeTime.m <= minutes)) {
    let lastClass = [ 
      schedule[weekday].dinalva[classTimes.length - 1],
      schedule[weekday].claudio[classTimes.length - 1],
      schedule[weekday].lapa[classTimes.length - 1]
    ];

    let nextClasses;
    if (weekday === weekdays[weekdays.length - 1])
      nextClasses = [
        schedule[weekdays[0]].dinalva[0],
        schedule[weekdays[0]].claudio[0],
        schedule[weekdays[0]].lapa[0]
      ];
    else
      nextClasses = [
        schedule[weekdays[time.getDay()]].dinalva[0],
        schedule[weekdays[time.getDay()]].claudio[0],
        schedule[weekdays[time.getDay()]].lapa[0]
      ];

    return {
      lastClasses: lastClass,
      actualClasses: null,
      nextClasses: nextClasses
    }
  }

	let i = 0;
	for (; i < classTimes.length - 1; i++) {
		let actualClass = classTimes[i];

		if (actualClass.h > hours || (actualClass.h == hours && actualClass.m > minutes)) {
			i--; //The next class is i, so the actual class is i - 1 
			break;
		}
	}

	if (i < 0) {
		let lastClasses;
    if (weekday === weekdays[0])
      lastClasses = [
        schedule[weekdays[weekdays.length - 1]].dinalva[classTimes.length - 1],
        schedule[weekdays[weekdays.length - 1]].claudio[classTimes.length - 1],
        schedule[weekdays[weekdays.length - 1]].lapa[classTimes.length - 1]
      ];
    else
      lastClasses = [
        schedule[weekdays[time.getDay() - 2]].dinalva[classTimes.length - 1],
        schedule[weekdays[time.getDay() - 2]].claudio[classTimes.length - 1],
        schedule[weekdays[time.getDay() - 2]].lapa[classTimes.length - 1]
      ];

		return {
      lastClasses: lastClasses,
      actualClasses: null,
      nextClasses: [
        schedule[weekday].dinalva[0],
        schedule[weekday].claudio[0],
        schedule[weekday].lapa[0]
      ]
    };
  } else {
    let lastClasses = null;
    if (i - 0 >= 0)
      lastClasses = [
        schedule[weekday].dinalva[i - 1],
        schedule[weekday].claudio[i - 1],
        schedule[weekday].lapa[i - 1]
      ];

    let nextClasses = null;
    if (i + 1 < classTimes.length)
      nextClasses = [
        schedule[weekday].dinalva[i + 1],
        schedule[weekday].claudio[i + 1],
        schedule[weekday].lapa[i + 1]
      ];

		return {
      lastClasses: lastClasses,
      actualClasses: [
        schedule[weekday].dinalva[i],
        schedule[weekday].claudio[i],
        schedule[weekday].lapa[i]
      ],
      nextClasses: nextClasses
    };
  }
}