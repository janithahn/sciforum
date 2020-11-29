import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  Typography,
  ThemeProvider,
  Grid,
  Modal,
  Fade,
  Menu,
  MenuItem,
  Backdrop,
} from '@material-ui/core';
import { AddCircleOutline, School, Work, Language, Build } from '@material-ui/icons';
import { theme, useStyles } from '../../styles/profileStyles';
import { useSelector } from 'react-redux';

export default function EditCredentials(props) {
  const classes = useStyles();

  const auth = useSelector(state => state.Auth);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClickAddCredentials = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseAddCredentials = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const popoverId = open ? 'popover' : undefined;

  const { handleModalClose, setModalSelection, setOpenModal } = props;

  const handleEmploymentModalOpen = () => {
    setOpenModal(true);
    setModalSelection("employment");
  };

  function DropDown() {
      return(
        <Menu 
            id={popoverId}
            open={open}
            anchorEl={anchorEl}
            getContentAnchorEl={null}
            keepMounted
            onClose={() => handleCloseAddCredentials()}
            anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
            }}
            transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
            }}
        >
            <MenuItem onClick={() => handleEmploymentModalOpen()}><Work fontSize="small" style={{marginRight: 6}}/>Employment</MenuItem>
            <MenuItem><School fontSize="small" style={{marginRight: 6}}/>Education</MenuItem>
            <MenuItem><Language fontSize="small" style={{marginRight: 6}}/>Language</MenuItem>
            <MenuItem><Build fontSize="small" style={{marginRight: 6}}/>Skills</MenuItem>
        </Menu>
      );
  }

  return (
    <ThemeProvider theme={theme}>
        <Box width={600}>
            <Card>
                <CardHeader
                    title="Edit Credentials"
                />
                <Divider />
                <CardContent>
                    <Grid container direction="column" alignItems="flex-start" justify="center" spacing={2}>
                        <Grid item>
                            <Box display="flex" justifyContent="flex-end" alignItems="center">
                                <Button size="small" style={{textTransform: 'none'}} onClick={handleClickAddCredentials}>
                                    <AddCircleOutline color="primary" style={{marginRight: 6}}/>
                                    <Typography variant="subtitle1">Add a Credential</Typography>
                                </Button>
                            </Box>
                        </Grid>
                        <Grid item>
                        </Grid>
                    </Grid>
                </CardContent>
                <Divider />
                <Box
                    display="flex"
                    justifyContent="flex-end"
                    p={0}
                >
                    <Button
                        onClick={() => handleModalClose()}
                        color="primary"
                        variant="contained"
                        size="small"
                        className={classes.submit}
                    >
                        Cancel
                    </Button>
                </Box>
            </Card>
        </Box>
        <DropDown/>
    </ThemeProvider>
  );
};
