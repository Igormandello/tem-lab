function load(callback) {
	let request = new XMLHttpRequest();
	request.open('GET', gistURL);
	request.send(null);

	request.onreadystatechange = function() {
		if (request.readyState == 4 && request.status == 200)
			setup(request.responseText, callback);
	}
}

window.onload = () => {
  load(() => {
    let now = new Date(Date.now());
    let classes = lab(now);
    console.log(classes);
  
    setText(document.querySelector('div.last'), classes.lastClasses);
    setText(document.querySelector('div.current'), classes.currentClasses);
    setText(document.querySelector('div.next'), classes.nextClasses);
  
    let timeRemaining = checkNext(now);
    console.log(timeRemaining / 60000);
    setTimeout(classesCycle, timeRemaining);
  });
}

function classesCycle() {
  let now = new Date(Date.now());
  //now.setHours(0);
  let classes = lab(now);
  console.log(classes);

  document.querySelector('div.before-last').remove();
  document.querySelector('div.last').classList = 'before-last';
  document.querySelector('div.current').classList = 'last';
  document.querySelector('div.next').classList = 'current';

  let afterNext = document.querySelector('div.after-next');
  setText(afterNext.querySelector('p'), classes.nextClasses);
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
  if (classes === null) {
    div.children[0].innerText = 'NÃO';
    div.children[1].innerText = 'Olha a hora wtf';
  } else {
    let available = [];
    for (let i = 0; i < classes.length; i++)
      if (classes[i] === '-' || classes[i].includes('Aula Reforço') || classes[i] === 'Interval')
        available.push(labNames[i]);
    
    if (available.length == 0) {
      div.children[0].innerText = 'Não tem';
      div.children[1].innerText = 'This is so sad';
    } else {
      div.children[0].innerText = 'Tem';
      div.children[1].innerText = available.join(', ');
    }
  }

  div.children[2].innerText = '7:30';
}

function checkNext(now) {
  let h = now.getHours(),
      m = now.getMinutes();

  let t = (closeTime.h - h) * 60 + closeTime.m - m;
  t *= 60;
  t *= 1000;

  for (let i = 0; i < classTimes.length; i++) {
    let classTime = classTimes[i];

    if (classTime.h > h || (classTime.h == h && classTime.m > m)) {
      t = (classTime.h - h) * 60 + classTime.m - m;
      t *= 60;
      t *= 1000;
      break;
    }
  }

  return t;
}