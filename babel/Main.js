import React from 'react';
import {deepOrange500} from 'material-ui/styles/colors';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import TopBar from './my/TopBar';
import CountGraph from './my/CountGraph';
import ItemBox from './my/ItemBox';

const muiTheme = getMuiTheme({
  palette: {
    accent1Color: deepOrange500,
  },
});

class Main extends React.Component {
  constructor(props, context) {
    super(props, context);
  }

  openPocket() {
    window.open("https://getpocket.com");
  }

  exitApp() {
    window.location = "/disconnect";
  }

  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div>
          <TopBar />
          <div>
            <CountGraph />
            <ItemBox />
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

export default Main;
