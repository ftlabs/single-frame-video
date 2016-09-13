const fs = require('fs');
const spawn = require('child_process').spawn;
const shortid = require('shortid');
const ffmpeg = require('ffmpeg-static');

function Job(image, audio){
	this.id = shortid.generate();
	this.audio = audio;
	this.image = image;
	this.processing = false;
	this._process = undefined;
	this.finished = false;
	this.destination = undefined;
}

Job.prototype.start = function(){
	console.log(`Starting job: ${this.id}...`);	

	const args = [
		'-loop', 
		'1',
		'-i',
		`${this.image.path}`,
		'-i',
		`${this.audio.path}`,
		'-c:v',
		'libx264',
		'-tune',
		'stillimage',
		'-c:a',
		'aac',
		'-strict',
		'experimental',
		'-threads',
		'16',
		'-b:a',
		'192k',
		'-pix_fmt',
		'yuv420p',
		'-shortest',
		`${process.env.TMP_FOLDER}/${this.id}.mp4`
	];

	this._process = spawn(ffmpeg.path, args);

	this._process.stdout.on('data', (data) => {
		console.log(`stdout: ${data}`);
	});

	this._process.stderr.on('data', (data) => {
		console.log(`stderr: ${data}`);
	});

	this._process.on('close', (code) => {
		
		const outputDestination = `${process.env.TMP_FOLDER}/${this.id}.mp4`;
		
		console.log(outputDestination);
		
		this.destination = outputDestination;
		this.processing = false;
		this.finished = true;
		this.timeFinished = new Date() * 1;
		this._process = undefined;

		if(code === 1){
			console.log('FFMPEG exited with 1');
		} else if(code === 0){
			console.log("FFMPEG closed and was happy");
			console.log(this);
		}
	
	});

}

Job.prototype.cleanup = function(){
	console.log(`Cleaning up: ${this.id}`);
	fs.unlink(`${this.audio.path}`);
	fs.unlink(`${this.image.path}`);
	fs.unlink(`${this.destination}`);
};

module.exports = Job;