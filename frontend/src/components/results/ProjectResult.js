import React from "react";
import DocumentAttributeList from "./DocumentAttributeList";

export default function ProjectResult({result}) {
    return (
        <div>
            {'txt_identifier' in result && <p className="result-p"><b>Alternate Name:</b> {result['txt_identifier']}</p>}
            {'txt_identifier' in result && <p className="result-p"><b>Identifier:</b> {result['txt_identifier']}</p>}
            {'txt_memberOf' in result && <p className="result-p"><b>Member Of:</b>
                <DocumentAttributeList results={result['txt_memberOf']}/>
            </p>}
            {'txt_parentOrganization' in result && <p className="result-p"><b>Parent Org:</b> 
                <a href={result['txt_parentOrganization']}>{result['txt_parentOrganization']}</a>
            </p>}
        </div>
    )
}