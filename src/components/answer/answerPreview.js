import React from 'react';
import MarkdownPreview from '@uiw/react-markdown-preview';

export function Preview(props) {
  return (
    <MarkdownPreview key={props.key} source={props.source} />
  )
}