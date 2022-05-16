const express = require("express");
const bodyParser = require('body-parser');
const fs = require('fs');
const readline = require('readline');
const path = require('path');
const open = require('open');


var apiArray = []
var counter = 0
var assetsFolder = ''

async function processLineByLine(filePath, action, confirmation, searchEntity, newSearchEntity, adTagData) {
    var newFileContent = ''
    const fileStream = fs.createReadStream(filePath);

    const rl = readline.createInterface({
        input: fileStream,
        crlfDelay: Infinity
    });

    var searchEntityLocator = 0
    for await (const line of rl) {
        searchEntityLocator = searchEntityLocator + 1
        if (action === 'read') {
            if (line.includes(searchEntity)) {
                var adTagObject = ''
                newFileContent = `${newFileContent}${newFileContent !== '' ? `\n` : ''}${line}`
                apiArray.push({ "path": filePath, 'adTagLocation': filePath.substring(assetsFolder.length - 9), "line": line, "newLine": newSearchEntity, 'adTag': adTagObject, "searchEntityLocator": searchEntityLocator })
                counter = +1
            } else {
                newFileContent = `${newFileContent}${newFileContent !== '' ? `\n` : ''}${line}`
            }
        }
        if (action === 'write') {
            if (line.includes(searchEntity)) {
                var adTagObject = {}
                newFileContent = `${newFileContent}${newFileContent !== '' ? `\n` : ''}${newSearchEntity}`
                await adTagData.forEach((element) => {
                    if (element.path === filePath) {
                        adTagObject = {
                            'path': filePath,
                            'adTagLocation': filePath.substring(assetsFolder.length - 9),
                            'width': element.width,
                            'height': element.height,
                            'adTag':
                                `\n
<script type="text/javascript">
function setUpIframe() {
// ----- ASSET HOSTING -----
// ----- SCRIPT GENERATED -----
// ----- TO BE MODIFIED -----
let hostedSrc = "https://d2w1y92u02ukg.cloudfront.net/asset_hosting/accounts/15140${filePath.substring(assetsFolder.length - 9)}";
let width = ${element.width};
let height = ${element.height};
// ----- END OF MODIFICATION -----
let iframeSrc = hostedSrc + "#" + encodeURI("{CLICK_DESTINATION}");
let iframe = document.getElementById("zem-asset-host-container");
iframe.setAttribute("width", width);
iframe.setAttribute("height", height);
iframe.setAttribute("src", iframeSrc);
}
</script>
<IFRAME id="zem-asset-host-container" SCROLLING="No" FRAMEBORDER="0" MARGINHEIGHT="0" MARGINWIDTH="0" onload="setUpIframe()">`}
                    }
                })
                apiArray.push({ "path": filePath, 'adTagLocation': filePath.substring(assetsFolder.length), "line": line, "newLine": newSearchEntity, 'adTag': adTagObject, "searchEntityLocator": searchEntityLocator })
            } else {
                newFileContent = `${newFileContent}${newFileContent !== '' ? `\n` : ''}${line}`
            }

        }
    }
    apiArray[apiArray.length - 1].html = newFileContent

    if (action === 'read' && counter === 0) {
        apiArray.push({ "path": filePath, 'adTagLocation': filePath.substring(assetsFolder.length), "line": `NO SEARCH ENTITY ${searchEntity}`, "newLine": "NO CHANGES.", 'adTag': adTagObject, "searchEntityLocator": searchEntityLocator })
    }


    if (action === 'write' && confirmation === 'true') {
        fs.writeFile(filePath, newFileContent, (err) => {
            if (err)
                console.log(err);
            else {
                console.log("File written successfully\n");
                console.log("The written has the following contents:");
                console.log(fs.readFileSync(filePath, "utf8"));
            }
        })
    }
    newFileContent = ''
}

async function crawlDirectories(dir, action, confirmation, searchEntity, searchSuffix, newSearchEntity, adTagData) {
    const fileStructure = fs.readdirSync(dir)
    for await (const file of fileStructure) {
        let filePath = path.join(dir, file);
        if (fs.lstatSync(filePath).isDirectory()) {
            await crawlDirectories(filePath, action, confirmation, searchEntity, searchSuffix, newSearchEntity, adTagData);
        } else {
            if (filePath.toLowerCase().includes(searchSuffix)) {
                await processLineByLine(filePath, action, confirmation, searchEntity, newSearchEntity, adTagData);
            }
        }
    };

}

const PORT = process.env.PORT || 3001;

const app = express();

var jsonParser = bodyParser.json();

app.use(express.static(path.resolve(__dirname, '../client/build')));

app.post('/api', jsonParser, async function (req, res) {
    counter = 0
    apiArray = []
    assetsFolder = req.body.inputAssetsFolder;
    const searchEntity = req.body.inputSearchEntity;
    const searchSuffix = req.body.inputSearchSuffix;
    const newSearchEntity = req.body.inputNewSearchEntity;
    const adTagData = req.body.adTagData;

    if (fs.existsSync(assetsFolder)) {
        ''
    } else {
        return res.end('Directory not found.');
    }

    console.log(req.query.action)
    console.log(req.query.confirmation)
    // console.log(apiArray)

    await crawlDirectories(assetsFolder, req.query.action, req.query.confirmation, searchEntity, searchSuffix, newSearchEntity, adTagData)
    res.json(apiArray)


})

app.post('/open', jsonParser, async function (req, res) {
    const assetPath = req.body.openURL
    console.log(assetPath)
    await open(assetPath)
})

app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
    console.log(`Server listening on ${PORT}`);
});


