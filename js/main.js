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

    let beforeP = document.querySelector('p:nth-child(1)');
    if (classes.lastClasses === null)
      beforeP.innerText = 'Claro que não';
    else if (classes.lastClasses.some(obj => obj === '-' || obj.includes('Aula Reforço')))
      beforeP.innerText = 'Tem';
    else
      beforeP.innerText = 'Não tem';

    let mainP = document.querySelector('p:nth-child(2)');
    if (classes.actualClasses === null)
      mainP.innerText = 'Claro que não';
    else if (classes.actualClasses.some(obj => obj === '-' || obj.includes('Aula Reforço')))
      mainP.innerText = 'Tem';
    else
      mainP.innerText = 'Não tem';

    let afterP = document.querySelector('p:nth-child(3)');
    if (classes.nextClasses === null)
      afterP.innerText = 'Claro que não';
    else if (classes.nextClasses.some(obj => obj === '-' || obj.includes('Aula Reforço')))
      afterP.innerText = 'Tem';
    else
      afterP.innerText = 'Não tem';
  });
}