import React, { useState } from "react";
import DocumentAttributeList from "./DocumentAttributeList";

export default function OrganizationResult({result}) {
    const [truncateUrl, setTruncateUrl] = useState(true)
    return (
        <div>
            {'txt_url' in result && <p className={`result-p ${truncateUrl ? 'truncate' : ''}`} onClick={() => setTruncateUrl(!truncateUrl)}><b>URL:</b> <a target="_blank" href={result['txt_url']}>{result['txt_url']}</a></p>}
            {'txt_telephone' in result && <p className="result-p"><b>Telephone:</b> {result['txt_telephone']}</p>}
            {'txt_memberOf' in result && <p className="result-p"><b>Member Of:</b>
                <DocumentAttributeList results={result['txt_memberOf']}/>
            </p>}
        </div>
    )
}
