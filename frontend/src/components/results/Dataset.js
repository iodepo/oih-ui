import DocumentAttributeList from "./DocumentAttributeList";
import Keywords from "./Keywords";
import React from "react";

export default function Dataset({result}) {
    return(
        <div>
            {'name' in result && <p className="result-p"><b>Name:</b> {result['name']}</p>}
            {'txt_sameAs' in result && <p className="result-p"><b>Same as:</b> <a target="_blank" href={result['txt_sameAs']}>{result['txt_sameAs']}</a></p>}
            {'txt_license' in result && <p className="result-p"><b>License:</b> {result['txt_license']}</p>}
            {'txt_citation' in result && <p className="result-p"><b>Citation:</b> {result['txt_citation']}</p>}
            {'txt_version' in result && <p className="result-p"><b>Version:</b> {result['txt_version']}</p>}
            {'txt_keywords' in result && <p className="result-p"><b>Keywords:</b><br /><Keywords keywords={result['txt_keywords']}></p>}
            {'id_includedInDataCatalog' in result && <p className="result-p"><b>Data catalog:</b> <a target="_blank" href={result['id_includedInDataCatalog']}>{result['id_includedInDataCatalog']}</a></p>}
            {'txt_temporalCoverage' in result && <p className="result-p"><b>Temporal Coverage:</b> {result['txt_temporalCoverage']}</p>}
            {'txt_distribution' in result && <p className="result-p"><b>Distribution:</b> <a target="_blank" href={result['txt_distribution']}>{result['txt_distribution']}</a></p>}
            {'txt_region' in result && <p className="result-p"><b>Region:</b> <DocumentAttributeList results={result['txt_region']}/></p>}
            {'id_provider' in result && <p className="result-p"><b>Provider ID:</b> <a target="_blank" href={result['id_provider']}><DocumentAttributeList results={result['id_provider']}/></a></p>}
            {'txt_provider' in result && <p className="result-p"><b>Provider:</b> <DocumentAttributeList results={result['txt_provider']}/></p>}
        </div>
    )
}