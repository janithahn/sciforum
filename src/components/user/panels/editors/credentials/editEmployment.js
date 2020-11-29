import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  ThemeProvider,
  FormControlLabel,
  Checkbox,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
} from '@material-ui/core';
import { theme, useStyles } from '../../../styles/profileStyles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserEmployment } from '../../../../../redux/ActionCreators';

export default function EditEmployment(props) {
  const classes = useStyles();
  
  const auth = useSelector(state => state.Auth);
  const dispatch = useDispatch();

  const { employment, setEmployment, handleModalClose } = props;

  const range = (min, max) => [...Array(max - min + 1).keys()].map(i => <MenuItem value={i + min}>{i + min}</MenuItem>);

  const profileSchema = Yup.object().shape({
    position: Yup.string()
        .required()
        .min(1, 'Too Short!'),
    company: Yup.string()
        .required()
        .min(1, 'Too Short!'),
    start_year: Yup.date(),
    end_year: Yup.date(),
  });

  const formik = useFormik({
    initialValues: {
      position: employment.position, 
      company: employment.company,
      start_year: employment.start_year,
      end_year: employment.end_year,
      currently_work_here: employment.currently_work_here,
    },
    onSubmit: (values) => {
        /*dispatch(updateUserEmployment(auth, {
            position: values.position, 
            company: values.company,
            start_year: values.start_year,
            end_year: values.end_year,
            currently_work_here: values.currently_work_here,
        }));*/
        setEmployment({
            position: values.position, 
            company: values.company,
            start_year: values.start_year,
            end_year: values.currently_work_here ? "": values.end_year,
            currently_work_here: values.currently_work_here,
        });
        handleModalClose();
    },
    validationSchema: profileSchema,
  });

  console.log(employment);

  return (
        <ThemeProvider theme={theme}>
                <form className={classes.root} onSubmit={formik.handleSubmit}>
                    <Card>
                        <CardHeader
                            title="Edit Employment"
                        />
                        <Divider />
                        <CardContent>
                            <TextField
                                fullWidth
                                className={classes.modalTextField}
                                error={formik.touched.position && formik.errors.position}
                                helperText={(formik.errors.position && formik.touched.position) && formik.errors.position}
                                label="Position"
                                id="position"
                                name="position"
                                onChange={formik.handleChange}
                                value={formik.values.position}
                                variant="outlined"
                            />
                            <TextField
                                fullWidth
                                className={classes.modalTextField}
                                error={formik.touched.company && formik.errors.company}
                                helperText={(formik.errors.company && formik.touched.company) && formik.errors.company}
                                id="company"
                                label="Company"
                                name="company"
                                onChange={formik.handleChange}
                                value={formik.values.company}
                                variant="outlined"
                            />
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="start_year">Start Year</InputLabel>
                                <Select
                                    labelId="start_year"
                                    id="start_year"
                                    name="start_year"
                                    value={formik.values.start_year !== undefined ? formik.values.start_year: ""}
                                    onChange={formik.handleChange}
                                    label="Start Year"
                                >
                                <MenuItem value="">
                                    <em>None</em>
                                </MenuItem>
                                {range(1970, 2050)}
                                </Select>
                            </FormControl>
                            <FormControl variant="outlined" className={classes.formControl}>
                                <InputLabel id="end_year">End Year</InputLabel>
                                <Select
                                    disabled={formik.values.currently_work_here}
                                    labelId="end_year"
                                    id="end_year"
                                    name="end_year"
                                    value={formik.values.end_year}
                                    onChange={formik.handleChange}
                                    label="End Year"
                                >
                                <MenuItem value="">
                                    None
                                </MenuItem>
                                {range(1970, 2050)}
                                </Select>
                            </FormControl>
                            <FormControlLabel
                                style={{margin: 3}}
                                control={<Checkbox checked={formik.values.currently_work_here} value="currently_work" color="primary" onChange={(event) => formik.setFieldValue('currently_work_here', event.target.checked)}/>}
                                label="Currently work here"
                            />
                        </CardContent>
                        <Divider />
                        <Box
                            display="flex"
                            justifyContent="flex-end"
                            p={0}
                        >
                            <Button
                                onClick={() => handleModalClose()}
                                size="small"
                                color="primary"
                                variant="contained"
                                className={classes.submit}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                size="small"
                                color="primary"
                                variant="contained"
                                className={classes.submit}
                            >
                                Save
                            </Button>
                        </Box>
                    </Card>
                </form>
        </ThemeProvider>
  );
};
