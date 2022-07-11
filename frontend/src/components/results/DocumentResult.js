import React from "react";
import DocumentAttributeList from "./DocumentAttributeList";

export default function DocumentResult({result}) {
    return(
        <div>
            <p><b>Id:</b> {result['id']}</p>
            <p><b>Author(s):</b></p>
            {'txt_author' in result && <DocumentAttributeList results={result['txt_author']}/>}
            <p><b>Identifier:</b>{result['txt_identifier']}</p>
            <p><b>Keywords:</b></p>
            {'txt_keywords' in result && <DocumentAttributeList results={result['txt_keywords']}/>}
            <p><b>Contributor(s):</b></p>
            {'txt_contributor' in result && <DocumentAttributeList results={result['txt_contributor']}/>}
        </div>
    )
}