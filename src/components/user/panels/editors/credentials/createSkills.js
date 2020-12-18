import React from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  CardHeader,
  Divider,
  TextField,
  ThemeProvider
} from '@material-ui/core';
import { theme, useStyles } from '../../../styles/profileStyles';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserSkills, createUserSkills } from '../../../../../redux/ActionCreators';
import AlertDialogSlide from '../alert/alert';

export default function CreateSkills({ skills, handleModalClose, varient, selectedSkillItem }) {

  const classes = useStyles();
  
  const auth = useSelector(state => state.Auth);
  const dispatch = useDispatch();

  const profileSchema = Yup.object().shape({
    skill: Yup.string()
        .required()
        .min(1, 'Too Short!'),
  });

  const formik = useFormik({
    initialValues: {
      skill: varient === "create" ? "": selectedSkillItem.skill,
    },
    onSubmit: (values) => {
        const submitVal = {
            user: auth.currentUserId,
            skill: values.skill
        }
        if(skills.includes(selectedSkillItem)) {
            dispatch(updateUserSkills(submitVal, selectedSkillItem.id));
        }else {
            dispatch(createUserSkills(submitVal));
        }
        handleModalClose();
    },
    validationSchema: profileSchema,
  });

  const [alertModalOpen, setAlertModalOpen] = React.useState(false);

  const handleAlertModalOpen = () => {
    setAlertModalOpen(true);
  };

  const handleAlertModalClose = () => {
    setAlertModalOpen(false);
  };

  return (
        <ThemeProvider theme={theme}>
                <form className={classes.root} onSubmit={formik.handleSubmit}>
                    <Card className={classes.cardRoot}>
                        <CardHeader
                            subheader="Edit Skills"
                        />
                        <Divider />
                        <CardContent>
                            <TextField
                                fullWidth
                                className={classes.modalTextField}
                                error={formik.touched.skill && formik.errors.skill}
                                helperText={(formik.errors.skill && formik.touched.skill) && formik.errors.skill}
                                label="Skill"
                                id="skill"
                                name="skill"
                                onChange={formik.handleChange}
                                value={formik.values.skill}
                                variant="outlined"
                                size="small"
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
                            {varient === "update" ? <Button
                                size="small"
                                color="secondary"
                                variant="contained"
                                onClick={handleAlertModalOpen}
                                className={classes.submit}
                            >
                                Delete
                            </Button>: undefined}
                        </Box>
                        <AlertDialogSlide 
                            open={alertModalOpen} 
                            id={varient === "update" ? selectedSkillItem.id: undefined} 
                            handleClose={handleAlertModalClose}
                            handleCredentialModalClose={handleModalClose}
                            type="skills"
                        />
                    </Card>
                </form>
        </ThemeProvider>
  );
};
