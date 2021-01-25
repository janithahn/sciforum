import { makeStyles } from '@material-ui/core';

export const useStyles = makeStyles((theme) => ({
    headerButton: {
    },
    progressBar: {
        width: '100%',
            '& > * + *': {
            marginTop: theme.spacing(0),
        },
        background: '#00a3c1',
    },
    badge: {
        color: '#00a3c1',
    },
}));