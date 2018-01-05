const video = document.querySelector('.player');
const canvas = document.querySelector('.photo');
const ctx = canvas.getContext('2d');
const strip = document.querySelector('.strip');
const snap = document.querySelector('.snap');


function getVedio(){
	navigator.mediaDevices.getUserMedia({
		video: true,
		audio: false
	}).then(localMediaSteam => {
		// console.log(localMediaSteam);

		//live video
		video.src = window.URL.createObjectURL(localMediaSteam);
		video.play(); 
	})
	.catch(err => {
		console.log(err);
	});
}

function paintToCanvas(){
	const width = video.videoWidth;
	const height = video.videoHeight;
	canvas.width = width;
	canvas.height = height;
	return setInterval(() => {
		ctx.drawImage(video, 0, 0, width, height);

		// take pixel out
		let pixels = ctx.getImageData(0, 0, width, height);
		// console.log(pixels);
		// debugger;

		//change it 
		// ctx.globalAlpha = 0.1;
		// pixels = redEffect(pixels);
		// pixels = rgbSplit(pixels);
		pixels = greenScreen(pixels);

		//put it back
		ctx.putImageData(pixels, 0, 0);

	}, 50);
	
}

function takePhoto(){
	//play the take photo sound
	snap.currentTime = 0;
	snap.play();

	const data = canvas.toDataURL('image/jpeg');
	// console.log(data);
	const link = document.createElement('a');
	link.href = data;
	link.setAttribute('download', 'img');

	const img = `<img src='${data}'/>`
	link.innerHTML = img;
	strip.insertBefore(link, strip.firstChild); 
}

function redEffect(pixels){
	for (let i=0; i<pixels.data.length; i+=4){
		pixels.data[i + 0] = pixels.data[i + 0] + 150;  //yellow
		pixels.data[i + 1] = pixels.data[i + 1] - 150;  //green
		pixels.data[i + 2] = pixels.data[i + 2] * 150;  //blue
 	}
 	return pixels;
}

function rgbSplit(pixels){
	for (let i=0; i<pixels.data.length; i+=4){
		pixels.data[i - 550] = pixels.data[i + 0];  //yellow
		pixels.data[i + 200] = pixels.data[i + 1];  //green
		pixels.data[i - 550] = pixels.data[i + 2];  //blue
 	}
 	return pixels;
}

function greenScreen(pixels){
	const levels = {};

	document.querySelectorAll('.rgb input').forEach((input) => {
		levels[input.name] = input.value;
	});

	for (i = 0; i < pixels.data.length; i = i + 4) {
		red = pixels.data[i + 0];
		green = pixels.data[i + 1];
		blue = pixels.data[i + 2];
		alpha = pixels.data[i + 3];

		if (red >= levels.rmin
		&& green >= levels.gmin
		&& blue >= levels.bmin
		&& red <= levels.rmax
		&& green <= levels.gmax
		&& blue <= levels.bmax) {
			// take it out!
			pixels.data[i + 3] = 0;
		}
	}
	return pixels;

}

getVedio(); 
video.addEventListener('canplay', paintToCanvas);