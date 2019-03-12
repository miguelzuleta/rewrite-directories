let fs = require('fs')
let path = require('path')

const fileInfo = () => {

	let rootPath = __dirname + '/components/';

	let directories = {
		html: {
			path: `${rootPath}html/index.html`,
			regex: /(include )(.*)(?=\/main)/
		},
		js: {
			path: `${rootPath}js/index.js`,
			regex: /(import )(.*)(?= from)|(\.\/)(.*)(?=\/main)/g
		},
		scss: {
			path: `${rootPath}scss/styles.scss`,
			regex: /(import \')(.*)(?=\/main)/
		}
	}

	let requestFileContents = dir => {
		return new Promise(resolve => {
			fs.readFile(dir, {encoding: 'utf-8'}, (err, data) => {
				if (!err) {
					resolve(data)
				} else {
					console.log(err)
				}
			})
		})
	}

	let requestDevFiles = () => {
		return Object.keys(directories).map(
			el => requestFileContents(directories[el]['path'])
		)
	}

	return { rootPath, directories, requestDevFiles }
}

module.exports = fileInfo
