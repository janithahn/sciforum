import { createMuiTheme } from '@material-ui/core';

const theme = createMuiTheme({
    typography: {
        fontFamily: 'Recursive'
    },
    palette: {
        primary: {
            light: '#ffffff',
            main: '#fafafa',
            dark: '#bcbcbc',
            contrastText: '#000'
        }
    }
});

export default theme;