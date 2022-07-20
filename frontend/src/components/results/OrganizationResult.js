import React from "react";
import DocumentAttributeList from "./DocumentAttributeList";

export default function OrganizationResult({result}) {
    return (
        <div>
            <p className="result-p truncate"><b>URL:</b> {result['txt_url']}</p>
            <p className="result-p"><b>Telephone:</b> {result['txt_telephone']}</p>
            <p className="result-p"><b>Member Of:</b> {'txt_memberOf' in result &&
            <DocumentAttributeList results={result['txt_memberOf']}/>}
            </p>
        </div>
    )
}
