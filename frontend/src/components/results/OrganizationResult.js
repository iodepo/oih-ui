import React from "react";
import DocumentAttributeList from "./DocumentAttributeList";

export default function OrganizationResult({result}) {
    return (
        <div>
            {'txt_url' in result && <p className="result-p truncate"><b>URL:</b> {result['txt_url']}</p>}
            {'txt_telephone' in result && <p className="result-p"><b>Telephone:</b> {result['txt_telephone']}</p>}
            {'txt_memberOf' in result && <p className="result-p"><b>Member Of:</b>
                <DocumentAttributeList results={result['txt_memberOf']}/>
            </p>}
        </div>
    )
}
