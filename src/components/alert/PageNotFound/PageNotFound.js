import React from "react";
var __html = require('./index');
var template = { __html: __html };

function PageNotFound() {
    return (
      <div className="page-not-found">
        <span dangerouslySetInnerHTML={template} />
      </div>
    );
}
export default PageNotFound;