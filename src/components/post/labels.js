/* eslint-disable no-use-before-define */
import React from 'react';
import { useTheme } from '@material-ui/core/styles';
import Popper from '@material-ui/core/Popper';
import { ArrowDropDown } from '@material-ui/icons';
import DoneIcon from '@material-ui/icons/Done';
import Autocomplete from '@material-ui/lab/Autocomplete';
import ButtonBase from '@material-ui/core/ButtonBase';
import InputBase from '@material-ui/core/InputBase';
import { FormHelperText } from '@material-ui/core';
import { labels, useStyles } from './styles/labelStyles';

export default function QuestionLabels({ value, setValue, error, helperText }) {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [pendingValue, setPendingValue] = React.useState(null);
  const theme = useTheme();

  const handleClick = (event) => {
    setPendingValue(value.length !== 0 ? value[0]: null);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = (event, reason) => {
    if (reason === 'toggleInput') {
      return;
    }
    setValue("label", pendingValue ? [pendingValue]: []);
    if (anchorEl) {
      anchorEl.focus();
    }
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? 'question-label' : undefined;

  return (
    <React.Fragment>
      <div className={classes.root}>
        <ButtonBase
          disableRipple
          className={classes.button}
          aria-describedby={id}
          onClick={handleClick}
        >
          <span>Label</span>
          <ArrowDropDown fontSize="large"/>
        </ButtonBase>
        <FormHelperText error>{helperText}</FormHelperText>
        {value.map((label) => (
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
      <Popper
        id={id}
        open={open}
        anchorEl={anchorEl}
        placement="bottom-start"
        className={classes.popper}
      >
        <div className={classes.header}>Select your question related label</div>
        <Autocomplete
          open
          onClose={handleClose}
          //multiple
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
          noOptionsText="No labels"
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
            </React.Fragment>
          )}
          options={[...labels].sort((a, b) => {
            // Display the selected labels first.
            let ai = value.indexOf(a);
            ai = ai === -1 ? value.length + labels.indexOf(a) : ai;
            let bi = value.indexOf(b);
            bi = bi === -1 ? value.length + labels.indexOf(b) : bi;
            return ai - bi;
          })}
          getOptionLabel={(option) => option.name}
          renderInput={(params) => (
            <div>
                <InputBase
                    error={error}
                    ref={params.InputProps.ref}
                    inputProps={params.inputProps}
                    autoFocus
                    className={classes.inputBase}
                />
            </div>
          )}
        />
      </Popper>
    </React.Fragment>
  );
}
