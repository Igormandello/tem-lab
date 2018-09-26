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
    let actualClasses = lab();
    console.log(actualClasses);

    let mainP = document.querySelector('p:nth-child(2)');
    if (actualClasses.some(obj => obj === '-' || obj.includes('Aula Reforço')))
      mainP.innerText = 'Tem';
    else
      mainP.innerText = 'Não tem';
  });
}