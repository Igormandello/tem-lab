const gistURL = 'https://gist.githubusercontent.com/Igormandello/a8d8d01fb9997c1120a18a2b1bdf20ad/raw/';

const labNames = [
	'Dinalva',
	'Claudio',
	'LaPA'
]

var analyzer;
function load(callback) {
	let request = new XMLHttpRequest();
	request.open('GET', gistURL);
	request.send(null);

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200) {
      analyzer = new Analyzer(request.responseText, labNames);
      callback();
    }
	}
}

window.onload = () => {
  load(() => {
    let now = new Date(Date.now());
    
    let data = analyzer.setupData(now),
        next = analyzer.nextClasses(now);
    console.log(data, next);
  
    setText(document.querySelector('div.last'), data.lastClasses);
    setText(document.querySelector('div.current'), data.currentClasses);
    setText(document.querySelector('div.next'), next);
  
    let timeRemaining = checkNext(now);
    console.log(timeRemaining / 60000);
    setTimeout(classesCycle, timeRemaining);
  });
}

function classesCycle() {
  let now = new Date(Date.now());
  let classes = analyzer.nextClasses(now);
  console.log(classes);

  document.querySelector('div.before-last').remove();
  document.querySelector('div.last').classList = 'before-last';
  document.querySelector('div.current').classList = 'last';
  document.querySelector('div.next').classList = 'current';

  let afterNext = document.querySelector('div.after-next');
  setText(afterNext, classes);
  afterNext.classList = 'next';

  let newDiv = document.querySelector('section').appendChild(document.createElement('div'));
  newDiv.classList = 'after-next';
  newDiv.appendChild(document.createElement('p'));
  newDiv.appendChild(document.createElement('span'));
  newDiv.appendChild(document.createElement('span')).classList = 'time';

  let timeRemaining = checkNext(now);
  console.log(timeRemaining / 60000);
  setTimeout(classesCycle, timeRemaining);
}

function setText(div, classes) {
  if (classes.classrooms === null) {
    div.children[0].innerText = 'NÃO';
    div.children[1].innerText = 'Olha a hora wtf';
  } else {
    let available = classes.classrooms;
    
    if (available.length == 0) {
      div.children[0].innerText = 'Não tem';
      div.children[1].innerText = 'This is so sad';
    } else {
      div.children[0].innerText = 'Tem';
      div.children[1].innerText = available.join(', ');
    }
  }

  div.children[2].innerText = (classes.time.h < 10 ? '0' : '' ) + classes.time.h + 'h' + (classes.time.m < 10 ? '0' : '' ) + classes.time.m + 'm';
}

function checkNext(now) {
  let h = now.getHours(),
      m = now.getMinutes(),
      s = now.getSeconds();

  let t = (closeTime.h - h) * 60 + closeTime.m - m;
  t *= 60;
  t *= 1000;

  let classTime = classTimes[analyzer.currentClass(now) + 1];
  if (classTime) {
    t = (classTime.h - h) * 60 + classTime.m - m - 1;
    t *= 60;
    t += 60 - s;
    t *= 1000;

    if (classTime.h < h)
      t = 24 * 60 * 60 * 100 - t;
  }

  return t;
}