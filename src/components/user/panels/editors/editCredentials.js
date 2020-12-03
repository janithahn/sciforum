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
    handleModalClose, setModalSelection, setOpenModal, employment, setSelectedCredentialItem, education, skills
}) {
  const classes = useStyles();

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
    employment.forEach(item => item.id === selectedItemId ? setSelectedCredentialItem(item): null)
    setOpenModal(true);
    setModalSelection(modal);
  };

  const handleEducationModalOpen = (modal, selectedItemId) => {
    education.forEach(item => item.id === selectedItemId ? setSelectedCredentialItem(item): null)
    setOpenModal(true);
    setModalSelection(modal);
  };

  const handleSkillModalOpen = (modal, selectedItemId) => {
    skills.forEach(item => item.id === selectedItemId ? setSelectedCredentialItem(item): null)
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
            <MenuItem onClick={() => handleSkillModalOpen("skillCreate")}><Language fontSize="small" style={{marginRight: 6, fill: "gray"}}/>Skill</MenuItem>
            <MenuItem><Build fontSize="small" style={{marginRight: 6, fill: "gray"}}/>Language</MenuItem>
        </Menu>
      );
  }

  const EmploymentTypo = employment ? employment.map(item => 
    <Grid item key={item.id}>
        <MenuItem onClick={() => handleEmploymentModalOpen("employmentUpdate", item.id)}>
            <Grid container direction="row" alignItems="center" justify="center" spacing={1}>
                <Grid item>
                    <Typography variant="subtitle2" className={classes.iconWrap}>
                        <Work fontSize="small" style={{fill: "gray", marginRight: 8}}/>{item.position + " at " + item.company}
                    </Typography>
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
                    <Typography variant="subtitle2" className={classes.iconWrap}>
                        <School fontSize="small" style={{fill: "gray", marginRight: 8}}/>{item.degree + " at " + item.school}
                    </Typography>
                </Grid>
            </Grid>
        </MenuItem>
        <Divider/>
    </Grid>
  ): undefined;

  const SkillsTypo = skills ? skills.map(item => 
    <Grid item key={item.id}>
        <MenuItem onClick={() => handleSkillModalOpen("skillUpdate", item.id)}>
            <Grid container direction="row" alignItems="center" justify="center" spacing={1}>
                <Grid item>
                    <Typography variant="subtitle2">{item.skill}</Typography>
                </Grid>
            </Grid>
        </MenuItem>
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
                                    <Grid item>
                                        <Box marginLeft={2} marginBottom={0.8} marginTop={0.8}>
                                            <Grid container direction="row" alignItems="center" justify="center" spacing={1}>
                                                <Grid item>
                                                    <Build fontSize="small" style={{fill: "gray"}}/>
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant="subtitle2">Skills</Typography>
                                                </Grid>
                                            </Grid>
                                        </Box>
                                        <Divider/>
                                    </Grid>
                                    <Box marginLeft={4}>
                                        <Grid container direction="column" alignItems="baseline" justify="center" spacing={0}>
                                            {SkillsTypo}
                                        </Grid>
                                    </Box>
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
