import React from "react";
import DocumentAttributeList from "./DocumentAttributeList";

export default function ProjectResult({result}) {
    return (
        <div>
            <p className="result-p"><b>Alternate Name:</b> {result['txt_alternateName']}</p>
            <p className="result-p"><b>Identifier:</b> {result['txt_identifier']}</p>
            <p className="result-p"><b>Member Of:</b> {'txt_memberOf' in result &&
            <DocumentAttributeList results={result['txt_memberOf']}/>}
            </p>
            <p className="result-p"><b>Parent Org:</b> <a
                href={result['txt_parentOrganization']}>{result['txt_parentOrganization']}</a></p>
        </div>
    )
}