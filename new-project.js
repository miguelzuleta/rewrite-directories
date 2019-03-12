let fs = require('fs')
let fileInfo = require('./file-info.js')()
let argv = require('yargs').argv

let writeFiles = require('./write-files.js')
let newProjectName = Object.keys(argv)[1]
let { rootPath, directories, requestDevFiles } = fileInfo

let getDevFiles = () => {
	console.log('getDevFiles() starts')
	return new Promise((resolve, reject) => {
		Promise.all(requestDevFiles()).then(val => {
			val.forEach((el, index) => {

				let elemKey = Object.keys(directories)[index]
				let valObj = directories[elemKey]
				let newDirPath = `${rootPath}${elemKey}/${newProjectName}`

				if(!fs.existsSync(newDirPath)) {
					let newFile = `${newDirPath}/main.${elemKey}`
					let newFileTxt = ''

					fs.mkdirSync(newDirPath)

					switch(elemKey) {
						case 'html':
							newFileTxt = `<h1>${newProjectName}</h1>`
							break;

						case 'js':
							newFileTxt = `console.log("${newProjectName.split('-').join(' ')}")`
							break;

						case 'scss':
							newFileTxt = `h1 { color: navy; }`
							break;
					}

					fs.writeFile(newFile, newFileTxt, err => err)
				}
			})

			console.log('getDevFiles() ends')

			resolve()
		})
	})
}

getDevFiles().then(() => {
	writeFiles(newProjectName)
})

