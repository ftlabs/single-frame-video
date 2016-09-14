const debug = require('debug')('bin:lib:check-file');
const fs = require('fs');
const mime = require('mime-sniffer');
const validFileMimes = process.env.VALID_FILE_MIMES.split(',');

module.exports = function(file){

	debug(file);

	return new Promise( (resolve, reject) => {

		fs.readFile(file.path, function(err, data){

			if(err){
				reject(err);
			} else {

				mime.lookup(data, function(err, info) {

					if(err){
						debug(err);
						reject(err);
					}

					debug(info);

					validFileMimes.forEach(validMimeType => {

						if(info.mime === validMimeType){
							resolve(info.mime);
							return;
						}

					});

					reject(`Not valid MIME type ${info.mime}`);

				});

			}

		});

	});

}