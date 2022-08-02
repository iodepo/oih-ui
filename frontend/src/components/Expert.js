import React from "react";
import DocumentAttributeList from "./results/DocumentAttributeList";

export default function Expert({result}) {
    return (
        <div id="expert">
            {'txt_jobTitle' in result && <p className="result-p"><b>Job Title:</b> {result['txt_jobTitle']}</p>}
            {'txt_knowsAbout' in result && <p className="result-p wrap-text"><b>Knows About:</b> <DocumentAttributeList results={result['txt_knowsAbout']}/></p>}
            {'txt_knowsLanguage' in result && <p className="result-p"><b>Language:</b> <DocumentAttributeList results={result['txt_knowsLanguage']}/></p>}
            {'txt_nationality' in result && <p className="result-p"><b>Nationality:</b> {result['txt_nationality']}</p>}
        </div>
    )
}