let fs = require('fs')
let path = require('path')
let fileInfo = require('./file-info.js')()
let argv = require('yargs').argv

let { rootPath, directories, requestDevFiles } = fileInfo

let writeFiles = projectName => {
	console.log('writeFiles() starts')
	return new Promise((resolve, reject) => {
		Promise.all(requestDevFiles()).then(val => {
			val.forEach((el, index) => {
				let elemKey = Object.keys(directories)[index]
				let valObj = directories[elemKey]

				let repType = (elemKey == 'js') ? `$1$3${projectName}` : `$1${projectName}`
				let txtReplace = el.replace(valObj['regex'], repType)

				if(elemKey == 'js') {
					let camelRep = projectName.split('-').map(el => {
						return `${el.charAt(0).toUpperCase()}${el.substring(1)}`
					}).join('')

					txtReplace = txtReplace.replace(/(import )(.*)(?= from)/, `$1${camelRep}`)
				}

				fs.writeFile(
					`${valObj['path']}`,
					txtReplace,
					err => err
				)
			})

			console.log('writeFiles() ends')
			resolve()
		})
	})
}

if (argv) {
	let newProjectName = Object.keys(argv)[1]

	writeFiles(newProjectName)
}

module.exports = writeFiles

