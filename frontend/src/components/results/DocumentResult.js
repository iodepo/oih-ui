import React from "react";
import DocumentAttributeList from "./DocumentAttributeList";

export default function DocumentResult({result}) {
    return(
        <div>
            <p className="result-p truncate"><b>Id:</b> <a target="_blank" href={result['id']}> {result['id']}</a></p>
            {'txt_author' in result && <p className="result-p"><b>Author(s):</b> <DocumentAttributeList results={result['txt_author']}/></p>}
            {'txt_identifier' in result && <p className="result-p"><b>Identifier:</b> {result['txt_identifier']}</p>}
            {'txt_keywords' in result && <p className="result-p"><b>Keywords:</b> <DocumentAttributeList results={result['txt_keywords']}/></p>}
            {'txt_contributor' in result && <p className="result-p"><b>Contributor(s):</b> <DocumentAttributeList results={result['txt_contributor']}/></p>}
        </div>
    )
}