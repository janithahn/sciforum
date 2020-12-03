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
  Menu,
  MenuItem,
} from '@material-ui/core';
import { AddCircleOutline, School, Work, Language, Build } from '@material-ui/icons';
import { theme, useStyles } from '../../styles/profileStyles';
import { useSelector } from 'react-redux';

export default function EditCredentials({ 
    handleModalClose, setModalSelection, setOpenModal, employment, setSelectedEmploymentItem, education, setSelectedEducationItem
}) {
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

  const handleEmploymentModalOpen = (modal, selectedItemId) => {
    employment.forEach(item => item.id === selectedItemId ? setSelectedEmploymentItem(item): null)
    setOpenModal(true);
    setModalSelection(modal);
  };

  const handleEducationModalOpen = (modal, selectedItemId) => {
    education.forEach(item => item.id === selectedItemId ? setSelectedEducationItem(item): null)
    setOpenModal(true);
    setModalSelection(modal);
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
            <MenuItem onClick={() => handleEmploymentModalOpen("employmentCreate")}><Work fontSize="small" style={{marginRight: 6, fill: "gray"}}/>Employment</MenuItem>
            <MenuItem onClick={() => handleEducationModalOpen("educationCreate")}><School fontSize="small" style={{marginRight: 6, fill: "gray"}}/>Education</MenuItem>
            <MenuItem><Language fontSize="small" style={{marginRight: 6, fill: "gray"}}/>Language</MenuItem>
            <MenuItem><Build fontSize="small" style={{marginRight: 6, fill: "gray"}}/>Skills</MenuItem>
        </Menu>
      );
  }

  const EmploymentTypo = employment ? employment.map(item => 
    <Grid item key={item.id}>
        <MenuItem onClick={() => handleEmploymentModalOpen("employmentUpdate", item.id)}>
            <Grid container direction="row" alignItems="center" justify="center" spacing={1}>
                <Grid item>
                    <Work fontSize="small" style={{fill: "gray"}}/>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle2">{item.position + " at " + item.company}</Typography>
                </Grid>
            </Grid>
        </MenuItem>
        <Divider/>
    </Grid>
  ): undefined;

  const EducationTypo = education ? education.map(item => 
    <Grid item key={item.id}>
        <MenuItem onClick={() => handleEducationModalOpen("educationUpdate", item.id)}>
            <Grid container direction="row" alignItems="center" justify="center" spacing={1}>
                <Grid item>
                    <School fontSize="small" style={{fill: "gray"}}/>
                </Grid>
                <Grid item>
                    <Typography variant="subtitle2">{item.degree + " at " + item.school}</Typography>
                </Grid>
            </Grid>
        </MenuItem>
        <Divider/>
    </Grid>
  ): undefined;

  return (
    <ThemeProvider theme={theme}>
        <Box width={600}>
            <Card>
                <CardHeader
                    title="Edit Credentials"
                />
                <Divider />
                <CardContent>
                    <Grid container direction="column" alignItems="flex-start" justify="center" spacing={1}>
                        <Grid item>
                            <Box display="flex" justifyContent="flex-end" alignItems="center">
                                <Button size="small" style={{textTransform: 'none'}} onClick={handleClickAddCredentials}>
                                    <AddCircleOutline color="primary" style={{marginRight: 6}}/>
                                    <Typography variant="subtitle1">Add a Credential</Typography>
                                </Button>
                            </Box>
                        </Grid>  
                        <Grid item>
                            <Box display="flex" justifyContent="flex-end" alignItems="center" marginLeft={1}>
                                <Grid container direction="column" alignItems="flex-start" justify="center" spacing={1}>
                                    {EmploymentTypo}
                                    {EducationTypo}
                                </Grid>
                            </Box>
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
