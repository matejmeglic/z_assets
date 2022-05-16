
const fs = require('fs');
const readline = require('readline');
const path = require('path')

const testFolder = './Assets/';
const searchEntity = 'clickTag';
const searchSuffix = 'html';
const newClickTag = 'var clickTag = decodeURI(window.location.hash.substring(1));';
var filesToChange = [];


async function processLineByLine(filePath, action, confirmation) {
  var newFileContent = ''
  const fileStream = fs.createReadStream(filePath);

  const rl = readline.createInterface({
    input: fileStream,
    crlfDelay: Infinity
  });

  for await (const line of rl) {

    if (action == 'read') {
      if (line.includes(searchEntity)) {
        renderPath(filePath, line)
      }
    }


    if (action === 'write') {
      if (line.includes(searchEntity)) {
        newFileContent = `${newFileContent}${newFileContent !== '' ? `\n` : ''}${newClickTag}`
        console.log(`\n\n${filePath}\n${line}\nwas replaced by\n${newClickTag}`)
      } else {
        newFileContent = `${newFileContent}${newFileContent !== '' ? `\n` : ''}${line}`
      }

    }
  }

  if (action === 'write' && confirmation === true) {
    fs.writeFile(`./${filePath}`, newFileContent, function () { })
  }
  newFileContent = ''
}

function renderPath(filePath, line) {
  console.log(filePath)
  console.log(line);
  filesToChange.push(filePath)
  console.log(filesToChange)
}



function traverseDir(dir, action) {
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.lstatSync(fullPath).isDirectory()) {
      traverseDir(fullPath, action);
    } else {
      if (fullPath.toLowerCase().includes(searchSuffix)) {
        processLineByLine(fullPath, action);
      }
    }
  });
}




traverseDir(testFolder, 'write')


