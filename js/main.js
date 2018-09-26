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
    //now.setHours(0);
    let classes = lab(now);
    console.log(classes);

    let beforeP = document.querySelector('p.last');
    setText(beforeP, classes.lastClasses);

    let mainP = document.querySelector('p.actual');
    setText(mainP, classes.actualClasses);

    let afterP = document.querySelector('p.next');
    setText(afterP, classes.nextClasses);

    let timeRemaining = checkNext(now);
    console.log(timeRemaining / 60000);
    setTimeout(classesCycle, timeRemaining);
  });
}

function classesCycle() {
  console.log('To Do');
}

function setText(element, classes) {
  if (classes === null)
    element.innerText = 'Claro que não';
  else if (classes.some(obj => obj === '-' || obj.includes('Aula Reforço')))
    element.innerText = 'Tem';
  else
    element.innerText = 'Não tem';
}

function checkNext(now) {
  let h = now.getHours(),
      m = now.getMinutes();

  let t = 0;
  for (let i = 0; i < classTimes.length - 1; i++) {
    let actualClass = classTimes[i];

    if (actualClass.h > h || (actualClass.h == h && actualClass.m > m)) {
      t = (actualClass.h - h) * 60 + actualClass.m - m;
      t *= 60;
      t *= 1000;
      break;
    }
  }

  return t;
}