# Single Frame Video Service

### What does it do?

This is a small web app for creating simple single framed videos from an audio file and a picture.

### What is a single frame video, and why would I need one?

Lot's of social media sites allow us to upload video, but not audio files - and we have great audio content we want to share. This service generates a video file from a single image and adds and audio file as a sound track. This way, audio files can still be shared on social networks without the need for additional effort in producing a video/mucking about with FFMPEG configurations to generate the video yourself.

### How do I use it?

You can head to [the live site](https://ftlabs-sfv-service.herokuapp.com) (behind S3O) and try it out 

_(not mobile-friendly, sorry)_

You will need:

1. An MP3 file
2. A JPEG/PNG image that...
	- is no more than 600 x 600 pixels
	- has dimensions that are divisible by two

Drag the MP3 file onto the left square in the page and then drag your JPEG/PNG onto the right square in the page. If an incorrect file type is dropped in either of the spaces, an error dialog will appear.