import React from "react";

export default function ProjectResult({result}) {
    return(
        <div>
            <p><b>Alternate Name:</b> {result['txt_alternateName']}</p>
            <p><b>Identifier:</b> {result['txt_identifier']}</p>
            <p><b>Member Of:</b> {result['txt_memberOf']}</p>
            <p><b>Parent Org:</b> <a href={result['txt_parentOrganization']}>{result['txt_parentOrganization']}</a></p>
        </div>
    )
}