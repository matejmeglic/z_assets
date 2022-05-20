import React from "react";
import axios from 'axios'
import "./App.css";
import background from "./assets/layered-waves-haikei_4k.svg"
import footer from "./assets/layered-waves-haikei_4k_2.svg"
import InfoModal from "./Modal"


import Button from '@mui/material/Button'
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';


const theme = createTheme({
  palette: {
    primary: {
      main: '#95b9d2'
    },
    secondary: {
      main: '#9bc6c1'
    },
    info: {
      main: '#b3ded9'
    },
    error: {
      main: '#ff0000'
    },
    background: {
      main: '#c7e4ea'
    },
    accent: {
      main: '#d6feff'
    },
    white: {
      main: '#ffffff'
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      '"Segoe UI"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    fontSize: 11,
  },
  spacing: 8,
  back: {
    backgroundImage: `url('${background}')`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "top",
    backgroundSize: "100% auto",

  },
  footer: {
    backgroundImage: `url('${footer}')`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "bottom",
    backgroundSize: "100% auto",
    height: '350px'

  },
});

function App() {
  const [inputAssetsFolder, setInputAssetsFolder] = React.useState('/Users/mmeglicoutbrain.com/Documents/20220515')
  const [inputSearchEntity, setInputSearchEntity] = React.useState('clickTag')
  const [inputSearchSuffix, setInputSearchSuffix] = React.useState('html')
  const [inputNewSearchEntity, setInputNewSearchEntity] = React.useState('var clickTag = decodeURI(window.location.hash.substring(1));')
  const [data, setData] = React.useState({
    data: '',
    loading: true,
  });
  const [errorMessage, setErrorMessage] = React.useState({
    message: 'Enter Assets Folder Path',
    messageGenerate: '',
    color: 'primary'
  });
  const [adTagData, setAdTagData] = React.useState([])
  const [showConfirmationButton, setShowConfirmationButton] = React.useState(false)
  const [showCode, setShowCode] = React.useState('adTag')
  const [flowCompleted, setFlowCompleted] = React.useState(false)

  const readData = async () => {
    setInputAssetsFolder(document.getElementById('assetsFolder').value)
    setInputSearchEntity(document.getElementById('searchEntity').value)
    setInputSearchSuffix(document.getElementById('searchSuffix').value)
    setInputNewSearchEntity(document.getElementById('newSearchEntity').value)

    const readApi = await axios.post('/api/?action=read', {
      inputAssetsFolder: inputAssetsFolder,
      inputSearchEntity: inputSearchEntity,
      inputSearchSuffix: inputSearchSuffix,
      inputNewSearchEntity: inputNewSearchEntity,
      adTagData: {}
    })
      .then(function (response) {
        console.log(response.data)
        setData({ data: response.data, loading: false });
        if (response.data.length > 0) {
          setErrorMessage({
            message: '',
            messageGenerate: 'Add width and height',
            color: 'primary'
          })
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const generateData = async (action) => {
    var tempAdTagDataArray = []
    var checkCounter = 0
    data.data.map((element, i) => {
      if (document.getElementById(`${i}-width`).value === '' || document.getElementById(`${i}-height`).value === '') { checkCounter = 1 }
    })

    if (checkCounter === 1) {
      return setErrorMessage({
        message: '',
        messageGenerate: ' Width and height fields still empty',
        color: 'error'
      })
    }
    data.data.map((element, i) => {
      tempAdTagDataArray.push({
        path: element.path,
        width: document.getElementById(`${i}-width`).value,
        height: document.getElementById(`${i}-height`).value,
      })
    })

    setAdTagData(tempAdTagDataArray)
    setInputAssetsFolder(document.getElementById('assetsFolder').value)
    setInputSearchEntity(document.getElementById('searchEntity').value)
    setInputSearchSuffix(document.getElementById('searchSuffix').value)
    setInputNewSearchEntity(document.getElementById('newSearchEntity').value)

    let apiURL = action === 'confirm' ? '/api/?action=write&confirmation=true' : '/api/?action=write'
    if (action === 'confirm') {
      setFlowCompleted(true)
    }

    const writeApi = await axios.post(apiURL, {
      inputAssetsFolder: inputAssetsFolder,
      inputSearchEntity: inputSearchEntity,
      inputSearchSuffix: inputSearchSuffix,
      inputNewSearchEntity: inputNewSearchEntity,
      adTagData: tempAdTagDataArray
    })
      .then(function (response) {
        console.log(response.data)
        setData({ data: response.data, loading: false });
        setErrorMessage({
          message: '',
          messageGenerate: '',
          color: 'primary'
        })
        setShowConfirmationButton(true)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  const openAd = async (i) => {
    const renderAd = await axios.post('/open', {
      openURL: data.data[i].adTag.path
    })
      .then(function (response) {
        console.log(response)
      })
      .catch(function (error) {
        console.log(error);
      });
  }

  React.useEffect(() => { }, [adTagData]);
  React.useEffect(() => { }, [showCode]);

  return (
    <div className="App">
      <ThemeProvider theme={theme}>
        <header className="App-header" style={theme.back}>
          <InfoModal style={{ 'display': 'inline', 'color': theme.palette.primary.main }} />
          <Box
            component="form"
            sx={{
              '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
          ><br />
            <div style={{ width: "90%" }}><TextField id="assetsFolder" style={{ width: "100%" }} defaultValue={inputAssetsFolder} color={errorMessage.color} label="Assets Folder" required variant="outlined" size="small" autoFocus /></div>
            <TextField id="searchEntity" style={{ width: "20%" }} label="Search Entity" defaultValue={inputSearchEntity} required variant="filled" size="small" />
            <TextField id="searchSuffix" style={{ width: "20%" }} label="Entity Suffix" defaultValue={inputSearchSuffix} required variant="filled" size="small" />
            <TextField id="newSearchEntity" style={{ width: "49%" }} label="Replace by" defaultValue={inputNewSearchEntity} required variant="filled" size="small" />
            <br />
            <Button variant="outlined" onClick={() => readData()} color={"primary"}>Parse data</Button>
            <p style={{ 'display': 'inline', 'color': theme.palette[errorMessage.color].main, }}>{errorMessage.message}</p>
          </Box>
          {data.loading ? '' :
            <Box
              component="form"

              noValidate
              autoComplete="off"
            >
              <br /><br />
              <Typography variant="h5">{data.data.length} files found.</Typography>
              <br />
              {data.data.length === 0 ? '' : data.data.map((element, i) =>
                <Box key={i}>
                  <Box sx={{ padding: "10px", border: 2, borderRadius: '18px', borderColor: 'secondary.main' }}>
                    <Typography variant="h5" >{element.adTagLocation}</Typography>
                    <br /><Divider /><br />
                    <Typography variant="body2" >ORIGIN: {element.line}</Typography>
                    <Typography variant="body2" >WILL CHANGE TO: {element.newLine}</Typography>
                    <br /><Divider /><br />
                    <Box>
                      <TextField id={`${i}-width`} defaultValue={300} type="number" style={{ width: "20%" }} label="Width" required variant="outlined" size="small" /><br /><br />
                      <TextField id={`${i}-height`} defaultValue={250} type="number" style={{ width: "20%" }} label="Height" required variant="outlined" size="small" />
                    </Box> <br />
                    {element.adTag !== '' ?
                      <Button variant={showCode === 'adTag' ? "contained" : "outlined"} onClick={() => setShowCode('adTag')} color={"primary"}>AdTag</Button>
                      : <Button variant={showCode === 'adTag' ? "contained" : "outlined"} disabled onClick={() => setShowCode('adTag')} color={"primary"}>AdTag</Button>
                    }&nbsp;
                    <Button variant={showCode === 'html' ? "contained" : "outlined"} onClick={() => setShowCode('html')} color={"primary"}>Html</Button>&nbsp;
                    <Button variant="outlined" onClick={() => openAd(i)} color={"primary"}>Show ad</Button>
                    <pre style={{ fontFamily: 'inherit', whiteSpace: 'pre-line' }}>{showCode === 'adTag' ? element.adTag.adTag : showCode === 'html' ?
                      element.html.split('\n').map((line, i) => <div>
                        {i === element.searchEntityLocator - 1 ? <Typography key={i} variant="body1" sx={{ fontWeight: 'bold' }}>{line}</Typography> :
                          <Typography key={i} variant="body1">{line}</Typography>}
                      </div>
                      )
                      : ''}</pre>
                  </Box><br /><br /></Box>)}
              {data.data.length === 0 ? '' :
                <Button variant="outlined" onClick={() => generateData()} color={"primary"}>Generate Preview AdTags</Button>}
              <p style={{ 'display': 'inline', 'color': theme.palette[errorMessage.color].main }}>&nbsp;&nbsp;{errorMessage.messageGenerate}</p>
              {showConfirmationButton === false ? '' : <Button variant="contained" onClick={() => generateData("confirm")} color={"primary"}>Confirm Bulk Change</Button>}
              {flowCompleted === false ? '' : <p style={{ 'display': 'inline', 'color': theme.palette.secondary.main, fontWeight: '700' }}>&nbsp;&nbsp;Changes applied, assets ready for upload.</p>}
            </Box>
          }
        </header>
        <header style={theme.footer}>
          <br /><br /><Typography variant="h2" style={{ textAlign: 'center', color: '#fff' }}>{' '}</Typography>
          <br /><br /><Typography variant="h2" style={{ textAlign: 'center', color: '#fff' }}>{' '}</Typography>
          <br /><br /><Typography variant="h2" style={{ textAlign: 'center', color: '#fff' }}>{' '}</Typography>
          <br /><br /><Typography variant="h2" style={{ textAlign: 'center', color: '#fff' }}>{' '}</Typography>
          <br /><br /><Typography variant="h2" style={{ textAlign: 'center', color: '#fff' }}>{' '}</Typography>
          <br /><br /><Typography variant="h2" style={{ textAlign: 'center', color: '#fff' }}>{' '}</Typography>
          <br /><br /><Typography variant="h2" style={{ textAlign: 'center', color: '#fff' }}>♥</Typography>
        </header>
      </ThemeProvider>
    </div >
  );
}

export default App;