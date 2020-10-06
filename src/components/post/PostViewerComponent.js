import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

/*const MentionPlugin = ClassicEditor.builtinPlugins.find(
    plugin => plugin.pluginName == 'Mention'
);*/

export default function PostViewer(props) {
    //console.log(props.data);
    return(
            <CKEditor
                editor={ ClassicEditor }
                data={props.data}
                onInit={ editor => {
                    console.log( 'Viewer loaded!', editor );
                } }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    console.log( { event, editor, data } );
                    //props.setQuestion(data)
                } }
                onBlur={ ( event, editor ) => {
                    console.log( 'Blur.', editor );
                } }
                onFocus={ ( event, editor ) => {
                    console.log( 'Focus.', editor );
                } }
                disabled={true}
                config={editorConfig}
            />
    );
}

const editorConfig = {
    toolbar: [],
};