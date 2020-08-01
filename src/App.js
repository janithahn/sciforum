import React from 'react';
import './App.css';
import Main from './components/MainComponent';
import { ThemeProvider } from '@material-ui/core';
import theme from './theme/theme';

function App() {
  return (
    <div>
      <ThemeProvider theme={theme}>
        <Main/>
      </ThemeProvider>
    </div>
  );
}

export default App;
