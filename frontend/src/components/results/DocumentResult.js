import React from "react";
import DocumentAttributeList from "./DocumentAttributeList";

export default function DocumentResult({result}) {
    return(
        <div>
            <p className="result-p truncate"><b>Id:</b> {result['id']}</p>
            <p className="result-p"><b>Author(s):</b> {'txt_author' in result && <DocumentAttributeList results={result['txt_author']}/>}</p>
            <p className="result-p"><b>Identifier:</b>{result['txt_identifier']}</p>
            <p className="result-p"><b>Keywords:</b> {'txt_keywords' in result && <DocumentAttributeList results={result['txt_keywords']}/>}</p>
            <p className="result-p"><b>Contributor(s):</b> {'txt_contributor' in result && <DocumentAttributeList results={result['txt_contributor']}/>}</p>
        </div>
    )
}