const time_left = document.querySelector('.display__time-left');
const time_end = document.querySelector('.display__end-time');
const btns = document.querySelectorAll('[data-time]');
let count_down = undefined;

btns.forEach((each) => {
	each.addEventListener('click', displayTime);
});
document.querySelector('#custom')
		.addEventListener('submit', function(e){
			e.preventDefault();
			timer(this.minutes.value * 60);
		});


/* 
	count down can not be done by seconds--
	will not be accurate
	should use target_time - current time
*/
function timer(seconds){

	clearInterval(count_down);
	const now = Date.now(); 
	const then = now + seconds * 1000; //get end timestamp
	time_left.textContent = formatTime(seconds);

	count_down = setInterval(() => {
		//get remain time not using seconds--
		const seconds_left = Math.round((then - Date.now()) / 1000);
		if (seconds_left <= 0){
			//clear when finished
			clearInterval(count_down);
		}

		time_left.textContent = formatTime(seconds_left);
	}, 1000);
}

function displayTime(){
	timer(this.dataset.time);
}

/* formating */
function formatTime(seconds){
	const min = parseInt(Math.floor(seconds / 60));
	const sec = parseInt(seconds % 60);
	return `${min<10?'0':''}${min}:${sec<10?'0':''}${sec}`;
}

