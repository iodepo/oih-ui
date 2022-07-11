import React from "react";
import DocumentAttributeList from "./DocumentAttributeList";

export default function OrganizationResult({result}) {
    return(
        <div>
            <p><b>URL:</b> {result['txt_url']}</p>
            <p><b>Telephone:</b> {result['txt_telephone']}</p>
            <p><b>Member Of:</b></p>
            {'txt_memberOf' in result && <DocumentAttributeList results={result['txt_memberOf']}/>}
        </div>
    )
}
