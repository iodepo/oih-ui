import React from "react";
import DocumentAttributeList from "./results/DocumentAttributeList";

export default function Expert({result}) {
    return (
        <div id="expert">
            <p><b>Job Title:</b> {result['txt_jobTitle']}</p>
            <p><b>Knows About:</b></p>
            {'txt_knowsAbout' in result && <DocumentAttributeList results={result['txt_knowsAbout']}/>}
            <p><b>Language:</b></p>
            {'txt_knowsLanguage' in result && <DocumentAttributeList results={result['txt_knowsLanguage']}/>}
            <p><b>Nationality:</b> {result['txt_nationality']}</p>
        </div>
    )
}