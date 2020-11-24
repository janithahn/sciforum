import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Nunito Sans'
    },
    palette: {
        primary: {
            light: '#ffffff',
            main: '#fafafa',
            dark: '#bcbcbc',
            contrastText: '#000'
        },
        secondary: {
            light: '#484848',
            main: '#212121',
            dark:'#000000',
        }
    }
});

export default theme;