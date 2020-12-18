import React from 'react';
import './App.css';
import Main from './components/MainComponent';
import { ThemeProvider } from '@material-ui/core';
import theme from './theme/theme';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from 'react-redux';
import { ConfigureStore } from './redux/configureStore';

const store = ConfigureStore();

function App() {
  return (
    <div>
      <Provider store={store}>
        <BrowserRouter /*history={history}*/>
          <ThemeProvider theme={theme}>
            <Main/>
          </ThemeProvider>
        </BrowserRouter>
      </Provider>
    </div>
  );
}

export default App;
