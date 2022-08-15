import DocumentAttributeList from "./DocumentAttributeList";
import React, { useState } from "react";

export default function Dataset({result}) {
    const [keywordsTruncated, setKeywordsTruncated] = useState(result['txt_keywords'].length > 20)
    const [keywordTruncate, setKeywordTruncate] = useState(Array(result['txt_keywords'].length).fill(true))
    const toggleKeywordTruncate = id => () => setKeywordTruncate(keywords => [...keywords.slice(0, id), !keywords[id], ...keywords.slice(id + 1)])
    return(
        <div>
            {'name' in result && <p className="result-p"><b>Name:</b> {result['name']}</p>}
            {'txt_sameAs' in result && <p className="result-p"><b>Same as:</b> <a target="_blank" href={result['txt_sameAs']}>{result['txt_sameAs']}</a></p>}
            {'txt_license' in result && <p className="result-p"><b>License:</b> {result['txt_license']}</p>}
            {'txt_citation' in result && <p className="result-p"><b>Citation:</b> {result['txt_citation']}</p>}
            {'txt_version' in result && <p className="result-p"><b>Version:</b> {result['txt_version']}</p>}
            {'txt_keywords' in result && <p className="result-p"><b>Keywords:</b> <br />
                {result['txt_keywords'].map((keyword, i) => {
                    return <span key={keyword} className={`bg-secondary mx-1 truncate badge`} style={{
                        maxWidth: keywordTruncate[i] ? '12em' : undefined
                    }} onClick={toggleKeywordTruncate(i)}>{keyword}</span>
                }).slice(0, keywordsTruncated ? 20 : undefined)}
                {keywordsTruncated  && (
                    <button className="bg-secondary mx-1 truncate btn badge" style={{
                        verticalAlign: 'super'
                    }} onClick={() => setKeywordsTruncated(false)}>Show More</button>
                )}
            </p>}
            {'id_includedInDataCatalog' in result && <p className="result-p"><b>Data catalog:</b> <a target="_blank" href={result['id_includedInDataCatalog']}>{result['id_includedInDataCatalog']}</a></p>}
            {'txt_temporalCoverage' in result && <p className="result-p"><b>Temporal Coverage:</b> {result['txt_temporalCoverage']}</p>}
            {'txt_distribution' in result && <p className="result-p"><b>Distribution:</b> <a target="_blank" href={result['txt_distribution']}>{result['txt_distribution']}</a></p>}
            {'txt_region' in result && <p className="result-p"><b>Region:</b> <DocumentAttributeList results={result['txt_region']}/></p>}
            {'id_provider' in result && <p className="result-p"><b>Provider ID:</b> <a target="_blank" href={result['id_provider']}><DocumentAttributeList results={result['id_provider']}/></a></p>}
            {'txt_provider' in result && <p className="result-p"><b>Provider:</b> <DocumentAttributeList results={result['txt_provider']}/></p>}
        </div>
    )
}