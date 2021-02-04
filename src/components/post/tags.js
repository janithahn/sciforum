import React from 'react';
import TextField from '@material-ui/core/TextField';
import { Chip } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import axios from 'axios';
import { baseUrl } from '../../shared/baseUrl';

const tagUrl = `${baseUrl}/tag_api/tags/`;

export default function Tags({classes, value, error, helperText, setFieldValue}) {

  const [tagList, setTagList] = React.useState([]);

  const handleKeyDown = (event) => {
    console.log(value);
    switch (event.key) {
      case "Enter":
      case ",":
      case " ": {
        event.preventDefault();
        event.stopPropagation();
        if(event.target.value.length > 0) {
          if(!value.includes(event.target.value)) setFieldValue("tags", [...value, event.target.value]); else setFieldValue("tags", [...value]);
          if(!tagList.includes(event.target.value)) setTagList([...tagList, event.target.value]);
        }
        break;
      }
      default:
    }
  };

  const handleRenderTags = (value, getTagProps) => {
    return value.map((option, index) => (
      <Chip variant="outlined" label={option} {...getTagProps({ index })} size="small" color="primary"/>
    ))
  };

  const handleFocus = () => {
    fetchTags(setTagList);
  };

  return(
    <div className={classes.tags}>
      <Autocomplete
        id="tags-filled"
        multiple
        freeSolo
        filterSelectedOptions
        value={value}
        options={tagList}
        renderTags={(value, getTagProps) => handleRenderTags(value, getTagProps)}
        onChange={(event, newValue) => {
          setFieldValue("tags", newValue ? newValue: value);
        }}
        renderInput={(params) => {
          params.inputProps.onKeyDown = handleKeyDown;
          return <TextField {...params} variant="outlined" /*label="Tags"*/ name="tags-filled" placeholder="Tags" error={error} helperText={helperText}/>
        }}
        size="small"
        onFocus={() => handleFocus()}
      />
    </div>
  );
}

export function fetchTags(setTagList) {

  axios.get(tagUrl)
  .then(tags => {
    const tempTags = [];
    tags.data.map(item => 
      tempTags.push(item.name)
    );
    setTagList(tempTags);
  })
  .catch(error => {
    console.log(error);
  });
}