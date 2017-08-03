# Single Frame Video Service

### What does it do?

This is a small web app for creating simple single framed videos from an audio file and a picture.

### What is a single frame video, and why would I need one?

Lot's of social media sites allow us to upload video, but not audio files - and we have great audio content we want to share. This service generates a video file from a single image and adds and audio file as a sound track. This way, audio files can still be shared on social networks without the need for additional effort in producing a video/mucking about with FFMPEG configurations to generate the video yourself.

### How do I use it?

**THIS SERVICE IS NO LONGER AVAILABLE, BUT IF IT WERE, THIS IS HOW YOU WOULD USE IT**

_(not mobile-friendly, sorry)_

You will need:

1. An MP3 file
2. A JPEG/PNG image that...
	- is no more than 600 x 600 pixels
	- has dimensions that are divisible by two

Drag the MP3 file onto the left square in the page and then drag your JPEG/PNG onto the right square in the page.

![labs-sfv-upload-demo](https://cloud.githubusercontent.com/assets/913687/23856225/e0e00468-07f0-11e7-9ee8-be36e6e15f93.gif)

If an incorrect file type is dropped in either of the spaces, an error dialog will appear.

Once an image file and an audio file have been selected, an upload button will appear. Clicking it will send both files to the server and will create a 'job' that's added to a queue for processing. A dialog will appear in the center of the screen that will update with progress as it happens.

Once the MP4 creation process has completed, a download button will appear. This link will be valid for **30 minutes**, after which, the file will be deleted from the system.

You now have an MP4 file that you can upload to your social media sites.

#### Metadata

It's also possible to add metadata to the generated mp4 file. Any metadata passed with the provided form will be saved as a query string in the 'description' field of the MP4 files ID3 tags.

### Environment Variables

#### TMP_FOLDER
The destination to store files while they await processing. Defaults to `/tmp/`

#### MAX_JOB_AGE
The number of minutes that a completed job will be stored for.

#### DEBUG
`*` for everything.

#### VALID_FILE_MIMES
The file types that the server will accept for combinations. Recommended value `image/jpeg,image/png,audio/mpeg,audio/mp3`.

### Deploying (on Heroku)

To run your own version of the service, follow these steps.

1. Clone this repo
2. Create a Heroku app 
	- With the CLI tools: `heroku create [NEW_APP_NAME]`
3. Set the appropriate environment variables
4. Deploy with `git push heroku master`
5. View your new service at `https://NEW_APP_NAME.herokuapp.com`