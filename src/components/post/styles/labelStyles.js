import { fade, makeStyles } from '@material-ui/core/styles';

export const useStyles = makeStyles((theme) => ({
    root: {
      //width: 221,
      //fontSize: 13,
      marginTop: 9,
      marginBottom: 6,
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
      zIndex: 1,
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
  }));
  
export const labels = [
    {
      name: 'CS',
      color: '#7057ff',
      description: 'Computer Science',
      url: '/labeled/CS'
    },
    {
      name: 'STAT',
      color: '#ff8f00',
      description: 'Statistics',
      url: '/labeled/STAT'
    },
    {
      name: 'DS',
      color: '#7b1fa2',
      description: 'Data Science',
      url: '/labeled/DS'
    },
    {
      name: 'CHEMISTRY',
      color: '#002984',
      description: '',
      url: '/labeled/CHEMISTRY'
    },
    {
      name: 'PHYSICS',
      color: '#fbca04',
      description: '',
      url: '/labeled/PHYSICS'
    },
    {
      name: "MATHEMATICS",
      color: '#ba000d',
      description: '',
      url: '/labeled/MATHEMATICS'
    },
    {
      name: 'ZOOLOGY',
      color: '#006b75',
      description: '',
      url: '/labeled/ZOOLOGY'
    },
    {
      name: 'BOTANY',
      color: '#a5d6a7',
      description: '',
      url: '/labeled/BOTANY'
    },
    {
      name: 'MB',
      color: '#212121',
      description: 'Molecular Biology',
      url: '/labeled/MB'
    },
    {
      name: 'ES',
      color: '#84b6eb',
      description: 'Educational Science',
      url: '/labeled/ES'
    },
    {
      name: 'OTHER',
      color: '#795548',
      description: 'Not subject related',
      url: '/labeled/OTHER'
    },
  ];