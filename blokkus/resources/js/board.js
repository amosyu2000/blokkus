// Retrieves all the passed parameters from the URL and puts them in a dictionary
function parseURL() {
	let urlp = [];
	let s = location.toString().split('?');
	s = s[1].split('&');
	for(let i = 0; i < s.length; i++) {
		let u = s[i].split('=');
		urlp[u[0]] = u[1];
	}
	return urlp;
}

$(document).ready(function() {
	urlp = parseURL();

	// Loop through the parameters and add them to the html
	for (p in urlp) {
		$('body').append(`<p>${p}: ${urlp[p]}`);
	}
});