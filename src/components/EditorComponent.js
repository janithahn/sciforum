import React from 'react';
import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from '@ckeditor/ckeditor5-build-classic';

const MentionPlugin = ClassicEditor.builtinPlugins.find(
    plugin => plugin.pluginName == 'Mention'
);

export default function Editor(props) {
    return(
        <div class="editor">
            <CKEditor id="editor"
                editor={ ClassicEditor }
                data={props.data}
                onInit={ editor => {
                    console.log( 'Editor is ready to use!', editor );
                } }
                onChange={ ( event, editor ) => {
                    const data = editor.getData();
                    console.log( { event, editor, data } );
                    props.setQuestion(data)
                } }
                onBlur={ ( event, editor ) => {
                    console.log( 'Blur.', editor );
                } }
                onFocus={ ( event, editor ) => {
                    console.log( 'Focus.', editor );
                } }
                disabled={false}
                config={{height: 800}}
            />
        </div>
    );
}

const editorConfig = {
    toolbar: [ 'heading', '|', 'bold', 'italic', 'link', 'bulletedList', 'numberedList', 'blockQuote', 'Link' ],
    heading: {
        options: [
            { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
            { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
            { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' }
        ]
    },
    removePlugins: ['Heading', 'Link'],
};