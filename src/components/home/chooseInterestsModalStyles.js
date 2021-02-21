import { makeStyles, fade } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    modal: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
    },
    mainPaper: {
      //boxShadow: theme.shadows[5],
      //padding: theme.spacing(5),
      marginTop: theme.spacing(3),
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      padding: theme.spacing(3),
      backgroundColor: '#fafafa',
      outline: 'none',
      maxWidth: 400,
    },
    root: {
      width: 221,
      fontSize: 13,
    },
    button: {
      fontSize: 13,
      width: '100%',
      textAlign: 'left',
      paddingBottom: 8,
      color: '#586069',
      fontWeight: 600,
      '&:hover,&:focus': {
        color: '#0366d6',
      },
      '& span': {
        width: '100%',
      },
      '& svg': {
        width: 16,
        height: 16,
      },
    },
    tag: {
      marginTop: 3,
      height: 20,
      padding: '.15em 4px',
      fontWeight: 600,
      lineHeight: '15px',
      borderRadius: 2,
    },
    popper: {
      border: '1px solid rgba(27,31,35,.15)',
      boxShadow: '0 3px 12px rgba(27,31,35,.15)',
      borderRadius: 3,
      width: 300,
      zIndex: theme.zIndex.modal + 1,
      fontSize: 13,
      color: '#586069',
      backgroundColor: '#f6f8fa',
    },
    header: {
      borderBottom: '1px solid #e1e4e8',
      padding: '8px 10px',
      fontWeight: 600,
    },
    inputBase: {
      padding: 10,
      width: '100%',
      borderBottom: '1px solid #dfe2e5',
      '& input': {
        borderRadius: 4,
        backgroundColor: theme.palette.common.white,
        padding: 8,
        transition: theme.transitions.create(['border-color', 'box-shadow']),
        border: '1px solid #ced4da',
        fontSize: 14,
        '&:focus': {
          boxShadow: `${fade(theme.palette.primary.main, 0.25)} 0 0 0 0.2rem`,
          borderColor: theme.palette.primary.main,
        },
      },
    },
    paper: {
      boxShadow: 'none',
      margin: 0,
      color: '#586069',
      fontSize: 13,
    },
    option: {
      minHeight: 'auto',
      alignItems: 'flex-start',
      padding: 8,
      '&[aria-selected="true"]': {
        backgroundColor: 'transparent',
      },
      '&[data-focus="true"]': {
        backgroundColor: theme.palette.action.hover,
      },
    },
    popperDisablePortal: {
      position: 'relative',
    },
    iconSelected: {
      width: 17,
      height: 17,
      marginRight: 5,
      marginLeft: -2,
    },
    color: {
      width: 14,
      height: 14,
      flexShrink: 0,
      borderRadius: 3,
      marginRight: 8,
      marginTop: 2,
    },
    text: {
      flexGrow: 1,
    },
    close: {
      opacity: 0.6,
      width: 18,
      height: 18,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
      paddingLeft: theme.spacing(3),
      paddingTop: theme.spacing(10),
      [theme.breakpoints.up('md')]: {
          paddingLeft: theme.spacing(3),
          paddingTop: theme.spacing(10),
      },
    },
    menuButtonPaper: {
        paddingTop: 8,
        paddingLeft: 4,
        paddingRight: 4,
        paddingBottom: 1,
    },
  }));