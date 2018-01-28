let font;
let title;
let particles = [];
let fontSize = 500;
let skipFactor = 30;
let colorAlpha = 30;
let windowLimit = 15;
let randomOn = true;
let increaseAlpha = false;
let decreaseAlpha = false;
let reverseAlpha = false;

let totalDownloadCount;
let downloadsHTMLElement;

function preload() {
	title = select("#title_animation");
	// let font_family = title.elt.style.fontFamily;
	// font = loadFont('fonts/' + font_family + '.otf');
	// font = loadFont('fonts/avenir_next_lt_pro_demi.otf');
	// fontSize = parseFloat(title.elt.style.fontSize.replace(/[^\d\.]*/g, ''));


	let links = document.getElementsByClassName('link depth-0');

	if (links.length < 1) {
		downloadsHTMLElement = select('#download_count').elt;
	} else {
		for (let i = 0; i < links.length; i++) {
			if (links[i].innerText.includes("Downloads")) {
				downloadsHTMLElement = links[i];
			}
		}
	}

	loadJSON('https://api.github.com/repos/abdalmoniem/avr4l/releases', onDataReceivedSuccessfully);
}

function setup() {
	let banner = select('#banner');
	// let canvas = createCanvas(img.width, img.height);
	// let canvas = createCanvas(displayWidth, displayHeight);
	let canvas = createCanvas(windowWidth - windowLimit, banner.height);
	canvas.position(0, 0);

	// let vehicle = new Particle(100, 100);
	// particles.push(vehicle);

	createParticles();
	// createParticlesFromText(title.elt.innerText, width / 2, height / 2);
}

function draw() {
	clear();
	for (let i = 0; i < particles.length; i++) {
		let v = particles[i];
		v.behaviors();
		v.update();
		v.show();
	}
}

function keyPressed() {
	if (key == 'A') {
		increaseAlpha = true;
		console.log('alpha up');
	} else if (key == 'S') {
		decreaseAlpha = true;
		console.log('alpha down');
	} else if (key == 'F') {
		randomOn = !randomOn;
	}
}

function keyReleased() {
	if (key == 'A') {
		increaseAlpha = false;
		console.log('alpha up stop');
	} else if (key == 'S') {
		decreaseAlpha = false;
		console.log('alpha down stop');
	}
}

function windowResized() {
	particles = [];
	let banner = select('#banner');
	resizeCanvas(windowWidth - windowLimit, banner.height);
	createParticles();

	let links = document.getElementsByClassName('link depth-0');

	if (links.length < 1) {
		downloadsHTMLElement = select('#download_count').elt;
	} else {
		for (let i = 0; i < links.length; i++) {
			if (links[i].innerText.includes("Downloads")) {
				downloadsHTMLElement = links[i];
			}
		}
	}

	downloadsHTMLElement.innerText = 'Downloads (' + totalDownloadCount + ')';
	// loadJSON('https://api.github.com/repos/abdalmoniem/avr4l/releases', onDataReceivedSuccessfully);
}

function onDataReceivedSuccessfully(data) {
	 // console.log(data);

	 totalDownloadCount = 0;
	 for (let i = 0; i < data.length; i++) {
		  let assets = data[i].assets;
		  for (let j = 0; j < assets.length; j++) {
				totalDownloadCount += assets[j].download_count;
		  }
	 }

	 console.log('data received, total count: ' + totalDownloadCount);
	 downloadsHTMLElement.innerText = 'Downloads (' + totalDownloadCount + ')';
}

function createParticles() {
	loadPixels();
	console.log('pixels loaded');

	for (y = 0; y < height; y += skipFactor) {
		for (x = 0; x < width; x += skipFactor) {
			let index = floor((x + y * width) * 4);
			let r = pixels[index + 0];
			let g = pixels[index + 1];
			let b = pixels[index + 2];
			let brightness = (r + g + b) / 3;

			let vehicle = new Particle(x, y);
			particles.push(vehicle);
		}
	}
	console.log(particles.length + ' particles created');
}

function createParticlesFromText(line, line_x, line_y) {
	fill(255);
	textAlign(CENTER, CENTER);
	textFont(font, fontSize);
	text(line, line_x, line_y);

	loadPixels();
	console.log('pixels loaded');

	let bounds = font.textBounds(line, line_x, line_y);

	for (y = 0; y < height; y += skipFactor) {
		for (x = 0; x < width; x += skipFactor) {
			if (x > bounds.x && x < bounds.x + bounds.w && y > bounds.y && y < bounds.y + bounds.h) {
				let index = floor((x + y * width) * 4);
				let r = pixels[index + 0];
				let g = pixels[index + 1];
				let b = pixels[index + 2];
				let brightness = (r + g + b) / 3;

				let vehicle = new Particle(x, y);
				particles.push(vehicle);

				if (brightness > 0) {
					let vehicle = new Particle(x, y);
					particles.push(vehicle);
				}
			}
		}
	}
	console.log(particles.length + ' particles created');
}