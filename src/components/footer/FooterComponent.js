import React from 'react';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import { Grid } from '@material-ui/core';
import { useStyles } from './styles/footerStyles';
import './styles/footer.css'

function Copyright() {
  return (
    <Typography variant="body2" color="textSecondary">
      {'Copyright © '}
      <Link color="inherit" href="/">
        sciForum
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

export default function Footer() {
  const classes = useStyles();

  return (
    <div id="footer" className={classes.root}>
      <CssBaseline/>
      <footer className={classes.footer}>
        <Grid container direction="column" alignItems="center" justify="center" spacing={2}>
          <Grid item>
            <Grid container direction="row" justify="space-between" alignItems="center" spacing={3}>
              <Grid item>
                <Typography variant="body1"><Link color="inherit" href="/">About</Link></Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1"><Link color="inherit" href="/">Contact</Link></Typography>
              </Grid>
              <Grid item>
                <Typography variant="body1"><Link color="inherit" href="/">Terms</Link></Typography>
              </Grid>
            </Grid>
          </Grid>
          <Grid item>
            <Copyright/>
          </Grid>
        </Grid>
      </footer>
    </div>
  );
}