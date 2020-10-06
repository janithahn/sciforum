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
                disabled={true}
                config={editorConfig}
            />
    );
}

const editorConfig = {
    toolbar: [],
};