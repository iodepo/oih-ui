import DocumentAttributeList from "./DocumentAttributeList";
import React from "react";

export default function Dataset({result}) {
    return(
        <div>
            <p className="result-p truncate"><b>Id:</b> {result['id']}</p>
            <p className="result-p"><b>Name:</b>{result['name']}</p>
            <p className="result-p"><b>Same as:</b>{result['txt_sameAs']}</p>
            <p className="result-p"><b>License:</b>{result['txt_license']}</p>
            <p className="result-p"><b>Citation:</b>{result['txt_citation']}</p>
            <p className="result-p"><b>Version:</b>{result['txt_version']}</p>
            <p className="result-p"><b>Keywords:</b>{result['txt_keywords']}</p>
            <p className="result-p"><b>Data catalog:</b>{result['id_includedInDataCatalog']}</p>
            <p className="result-p"><b>Temporal Coverage:</b>{result['txt_temporalCoverage']}</p>
            <p className="result-p"><b>Distribution:</b>{result['txt_distribution']}</p>
            <p className="result-p"><b>Region:</b>{'txt_region' in result && <DocumentAttributeList results={result['txt_region']}/>}</p>
            <p className="result-p"><b>Provider ID:</b>{'id_provider' in result && <DocumentAttributeList results={result['id_provider']}/>}</p>
            <p className="result-p"><b>Provider:</b>{'txt_provider' in result && <DocumentAttributeList results={result['id_provider']}/>}</p>
        </div>
    )
}