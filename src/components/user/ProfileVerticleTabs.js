import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles, withStyles } from '@material-ui/core/styles';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import LinearProgress from '@material-ui/core/LinearProgress';
import ProfilePanel from './panels/profilePanel';
import Liked from './panels/liked';
import MyAnswers from './panels/myAnswes';
import MyPostsAccount from './panels/myPosts';
import { useSelector } from 'react-redux';
import { useHistory, useParams } from 'react-router-dom';

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`scrollable-auto-tabpanel-${index}`}
      aria-labelledby={`scrollable-auto-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const TabEnhanced = withStyles((theme) => ({
  root: {
    textTransform: 'none',
    minWidth: 72,
    fontWeight: theme.typography.fontWeightRegular,
    marginRight: theme.spacing(4),
    '&:hover': {
      color: '#353535',
      opacity: 1,
    },
    '&$selected': {
      color: '#353535',
      fontWeight: theme.typography.fontWeightMedium,
    },
    '&:focus': {
      color: '#353535',
    },
  },
  selected: {},
}))((props) => (
  <Tab 
    component="a"
    onClick={(event) => {
      event.preventDefault();
    }}
    disableRipple 
    {...props} 
  />
));

function a11yProps(index) {
  return {
    id: `scrollable-auto-tab-${index}`,
    'aria-controls': `scrollable-auto-tabpanel-${index}`,
  };
}

/*const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
    display: 'flex',
    //height: '100%',
    width: '100%',
  },
  tabs: {
    borderRight: `1px solid ${theme.palette.divider}`,
  },
}));*/

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
  progressBar: {
      width: '100%',
          '& > * + *': {
          marginTop: theme.spacing(0),
      },
      background: '#00a3c1',
  },
}));

export default function ProfileTabs({ credentialsLoadingState, usernameFromTheUrl }) {
  const classes = useStyles();

  const { tabname } = useParams();
  const history = useHistory();

  const tabNameToIndex = {
    0: "index",
    1: "posts",
    2: "answers",
    3: "liked",
  };

  const indexToTabName = {
    index: 0,
    posts: 1,
    answers: 2,
    liked: 3,
  };

  const [value, setValue] = React.useState(indexToTabName[tabname]);
  const auth = useSelector(state => state.Auth);

  const handleChange = (event, newValue) => {
    history.push(`/profile/${usernameFromTheUrl}/${tabNameToIndex[newValue]}`);
    setValue(newValue);
  };

  return (
    <div className={classes.root}>
      <AppBar position="static" color="inherit" elevation={1}>
        <Tabs
          value={value}
          onChange={handleChange}
          indicatorColor="secondary"
          textColor="inherit"
          variant="scrollable"
          scrollButtons="on"
          aria-label="scrollable auto tabs"
        >
          <TabEnhanced label="Profile" {...a11yProps(0)} />
          {auth.isAuthenticated ? <TabEnhanced href="/drafts" label="Posts" {...a11yProps(1)} />: undefined}
          {auth.isAuthenticated && auth.currentUser === usernameFromTheUrl ? <TabEnhanced label="Answers" {...a11yProps(2)} />: undefined}
          {auth.isAuthenticated && auth.currentUser === usernameFromTheUrl ? <TabEnhanced label="Liked" {...a11yProps(3)} />: undefined}
        </Tabs>
        {credentialsLoadingState ? 
          <LinearProgress color="secondary" style={{height: 1}} /*className={classes.progressBar}*//>: 
        undefined}
      </AppBar>
      <TabPanel value={value} index={0}>
        <ProfilePanel/>
      </TabPanel>
      {auth.isAuthenticated ? <div>
        <TabPanel value={value} index={1}>
          <MyPostsAccount usernameFromTheUrl={usernameFromTheUrl}/>
        </TabPanel>
        {auth.currentUser === usernameFromTheUrl ? <div>
          <TabPanel value={value} index={2}>
            <MyAnswers/>
          </TabPanel>
          <TabPanel value={value} index={3}>
            <Liked/>
          </TabPanel>
        </div>: undefined}
      </div>: undefined}
    </div>
  );
}
