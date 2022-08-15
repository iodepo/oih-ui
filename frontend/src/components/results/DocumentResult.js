import React, { useState } from "react";
import DocumentAttributeList from "./DocumentAttributeList";

export default function DocumentResult({result}) {
    const [keywordsTruncated, setKeywordsTruncated] = useState(result['txt_keywords'].length > 20)
    const [keywordTruncate, setKeywordTruncate] = useState(Array(result['txt_keywords'].length).fill(true))
    const toggleKeywordTruncate = id => () => setKeywordTruncate(keywords => [...keywords.slice(0, id), !keywords[id], ...keywords.slice(id + 1)])
    const [truncateId, setTruncateId] = useState(true)
    return(
        <div>
            <p className={`result-p ${truncateId ? 'truncate' : ''}`} onClick={() => setTruncateId(!truncateId)}><b>Id:</b> <a target="_blank" href={result['id']}> {result['id']}</a></p>
            {'txt_author' in result && <p className="result-p"><b>Author(s):</b> <DocumentAttributeList results={result['txt_author']}/></p>}
            {'txt_identifier' in result && <p className="result-p"><b>Identifier:</b> {result['txt_identifier']}</p>}
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
            {'txt_contributor' in result && <p className="result-p"><b>Contributor(s):</b> <DocumentAttributeList results={result['txt_contributor']}/></p>}
        </div>
    )
}