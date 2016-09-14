const debug = require('debug')('bin:lib:make-video');

const FfmpegJob = require('./ffmpeg-job');

const waitingJobs = [];
const maxSimulataneousJobs = process.env.MAX_JOBS || 10;
const maxJobAge = (1000 * 60) * (parseInt(process.env.MAX_JOB_AGE) || 30);
const runningJobs = [];
const completedJobs = {};

function checkJobs(){

	if(runningJobs.length < maxSimulataneousJobs){

		const nextJob = waitingJobs.shift();

		if(nextJob !== undefined){
			debug('Starting job...', nextJob.id);
			nextJob.start();
			runningJobs.push(nextJob);
		}

	}

	runningJobs.forEach( (job, idx) => {

		if(job.finished === true){
			completedJobs[job.id] = job;
			runningJobs.splice(idx, 1);
		}

	});

	Object.keys(completedJobs).forEach(id => {

		if( (new Date() * 1) - completedJobs[id].timeFinished > maxJobAge){
			debug(`Job ${id} is too old. Removing.`);
			completedJobs[id].cleanup();
			delete completedJobs[id];
		}

	});


	debug(completedJobs);

}

function getFinishedJob(id){

	if(completedJobs[id] !== undefined){
		return completedJobs[id];
	} else {
		return false;
	}

}

function checkStateOfJob(id){

	const isWaiting = waitingJobs.filter(job => {
		return job.id === id;
	});
	const isRunning = runningJobs.filter(job => {
		return job.id === id;
	});
	
	const isFinished = completedJobs[id] !== undefined;

	if(isWaiting.length > 0){
		return "waiting";
	} else if(isRunning.length > 0){
		return "running";
	} else if(isFinished){
		return "finished";
	} else {
		return "nonexistant";
	}

}

function convertImageAndAudioToVideo(image, audio, metadata){
	
	const job = new FfmpegJob(image, audio, metadata);
	waitingJobs.push(job);
	return Promise.resolve(job.id);

}

setInterval(checkJobs, 10000);

module.exports = {
	get : getFinishedJob,
	check : checkStateOfJob,
	create : convertImageAndAudioToVideo
};