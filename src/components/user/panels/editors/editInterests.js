import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import CloseIcon from '@material-ui/icons/Close';
import DoneIcon from '@material-ui/icons/Done';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ButtonBase from '@material-ui/core/ButtonBase';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import { useStyles } from '../../../home/chooseInterestsModalStyles';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { Grid, Button, FormHelperText, Divider, Card, CardHeader, ThemeProvider, Box, CardContent } from '@material-ui/core';
import { labels } from '../../../post/styles/labelStyles';
import { useSelector, useDispatch } from 'react-redux';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { theme as profileTheme, useStyles as useProfileStyles } from '../../styles/profileStyles';
import { updateInterests } from '../../../home/actions';

export default function ChooseInterests({ interests, handleModalClose }) {
  const classes = useStyles();
  const profileClasses = useProfileStyles();
  const auth = useSelector(state => state.Auth);
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = React.useState(null);
  const [pendingValue, setPendingValue] = React.useState([]);
  const theme = useTheme();

  //formik
  const schema = Yup.object().shape({
    value: Yup.array()
      .min(1, 'Please at least choose one subject area')
      .required('Please at least choose one subject area'),
  });

  const formik = useFormik({
    initialValues: {
      value: interests,
    },
    onSubmit: (values) => {
        let submitVal = []
        for(let value of values.value) {
            let tempVal = {interest: value.name}
            submitVal.push(tempVal);
        }
        dispatch(updateInterests(auth.currentUser, submitVal));
        console.log(submitVal);
    },
    validationSchema: schema,
  });
  //end formik

  const handleClick = (event) => {
    setPendingValue(formik.values.value);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event, reason) => {
    if (reason === 'toggleInput') {
      return;
    }
    formik.setFieldValue("value", pendingValue);
    if (anchorEl) {
      anchorEl.focus();
    }
    setAnchorEl(null);
  };

  const openList = Boolean(anchorEl);
  const id = openList ? 'interests-list' : undefined;

  return (
    <div>
        <ThemeProvider theme={profileTheme}>
            <form onSubmit={formik.handleSubmit}>
                <Card className={profileClasses.cardRoot}>
                    <CardHeader
                        subheader="Edit Interests"
                    />
                    <Divider />
                    <CardContent>
                        <div className={classes.mainPaperProfilePanel}>
                            <Grid container direction="column" alignItems="center" justify="center" spacing={2}>
                                <Grid item>
                                    <Paper variant="outlined" className={classes.menuButtonPaper}>
                                        <div className={classes.root}>
                                            <ButtonBase
                                                disableRipple
                                                className={classes.button}
                                                aria-describedby={id}
                                                onClick={handleClick}
                                            >
                                            <span>Select here</span>
                                            <ArrowDropDownIcon/>
                                            </ButtonBase>
                                            {formik.values.value.map((label) => (
                                            <div
                                                key={label.name}
                                                className={classes.tag}
                                                style={{
                                                backgroundColor: label.color,
                                                color: theme.palette.getContrastText(label.color),
                                                }}
                                            >
                                                {label.name}
                                            </div>
                                            ))}
                                        </div>
                                    </Paper>
                                    <Popper
                                        id={id}
                                        open={openList}
                                        anchorEl={anchorEl}
                                        placement="bottom-start"
                                        className={classes.popper}
                                    >
                                        <div className={classes.header}>Select your favourite subjects</div>
                                        <Autocomplete
                                            open
                                            fullWidth
                                            onClose={handleClose}
                                            multiple
                                            classes={{
                                                paper: classes.paper,
                                                option: classes.option,
                                                popperDisablePortal: classes.popperDisablePortal,
                                            }}
                                            value={pendingValue}
                                            onChange={(event, newValue) => {
                                                setPendingValue(newValue);
                                            }}
                                            disableCloseOnSelect
                                            disablePortal
                                            renderTags={() => null}
                                            noOptionsText="No Subjects"
                                            renderOption={(option, { selected }) => (
                                                <React.Fragment>
                                                    <DoneIcon
                                                        className={classes.iconSelected}
                                                        style={{ visibility: selected ? 'visible' : 'hidden' }}
                                                    />
                                                    <span className={classes.color} style={{ backgroundColor: option.color }} />
                                                    <div className={classes.text}>
                                                        {option.name}
                                                        <br />
                                                        {option.description}
                                                    </div>
                                                    <CloseIcon
                                                        className={classes.close}
                                                        style={{ visibility: selected ? 'visible' : 'hidden' }}
                                                    />
                                                </React.Fragment>
                                            )}
                                            options={[...labels].sort((a, b) => {
                                                // Display the selected labels first.
                                                let ai = formik.values.value.indexOf(a);
                                                ai = ai === -1 ? formik.values.value.length + labels.indexOf(a) : ai;
                                                let bi = formik.values.value.indexOf(b);
                                                bi = bi === -1 ? formik.values.value.length + labels.indexOf(b) : bi;
                                                return ai - bi;
                                            })}
                                            getOptionLabel={(option) => option.name}
                                            renderInput={(params) => (
                                                <InputBase
                                                    ref={params.InputProps.ref}
                                                    inputProps={params.inputProps}
                                                    autoFocus
                                                    className={classes.inputBase}
                                                />
                                            )}
                                        />
                                    </Popper>
                                </Grid>
                                <Grid item>
                                    <FormHelperText error={formik.errors.value && formik.touched.value}>
                                        {(formik.errors.value && formik.touched.value) && formik.errors.value}
                                    </FormHelperText>
                                </Grid>
                            </Grid>
                        </div>
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
                            className={profileClasses.submit}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            color="primary"
                            size="small"
                            variant="contained"
                            className={profileClasses.submit}
                        >
                            Save
                        </Button>
                    </Box>
                </Card>
            </form>
        </ThemeProvider>
    </div>
  );
}