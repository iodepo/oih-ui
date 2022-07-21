import React from "react";
import DocumentAttributeList from "./results/DocumentAttributeList";

export default function Expert({result}) {
    return (
        <div id="expert">
            <p className="result-p"><b>Job Title:</b> {result['txt_jobTitle']}</p>
            <p className="result-p wrap-text"><b>Knows About:</b> {'txt_knowsAbout' in result && <DocumentAttributeList results={result['txt_knowsAbout']}/>}</p>
            <p className="result-p"><b>Language:</b> {'txt_knowsLanguage' in result && <DocumentAttributeList results={result['txt_knowsLanguage']}/>}</p>
            <p className="result-p"><b>Nationality:</b> {result['txt_nationality']}</p>
        </div>
    )
}