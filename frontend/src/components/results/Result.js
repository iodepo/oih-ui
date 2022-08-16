import React, { Fragment, useState } from 'react';
import { sortedUniq, capitalize, upperCase, words } from "lodash";

const Keyword = ({ keyword }) => {
    const [truncated, setTruncated] = useState(true)
    return <span
                className={`bg-secondary mx-1 truncate badge`}
                style={{ maxWidth: truncated ? '12em' : undefined }}
                onClick={() => setTruncated(!truncated)}
            >
                {keyword}
            </span>
}

const Keywords = ({ result }) => {
    const [keywordsTruncated, setKeywordsTruncated] = useState(result.length > 20)
    result = [...result]
    result.sort()
    result = sortedUniq(result)
    return <>
        <br />
        {result.map(keyword => <Keyword key={keyword} keyword={keyword} />).slice(0, keywordsTruncated ? 20 : undefined)}
        {keywordsTruncated && (
            <button
                className="btn-outline-secondary text-dark mx-1 truncate btn badge"
                style={{ verticalAlign: 'super' }}
                onClick={() => setKeywordsTruncated(false)}
            >
                Show More
            </button>
        )}
    </>
}

const Id = ({ result }) => result

const Link = ({ result, Inner = Id }) => <a href={result} rel="noopener noreferrer" target="_blank"><Inner result={result}/></a>

const DocumentAttributeList = ({ result, Inner = Id }) => <>
            {result.map((item, i) =>
                <Fragment key={i}><Inner result={item} />{i != result.length - 1 ? ',' : ''} </Fragment>
            )}
        </>

const Truncate = ({ result, Inner = Id }) => {
    const [truncated, setTruncated] = useState(true)
    return <span onClick={() => setTruncated(!truncated)} className={truncated ? 'truncate' : ''}><Inner result={result} /></span>
}

const typeMap = {
    string: Id,
    list: DocumentAttributeList,
    keywords: Keywords,
    link: Link,
    truncated: Truncate
}


// Takes a component ref: a string index into `typeMap`, a function of result => content or (result, inner) => content where inner is a Component, or a list of component refs
// Components take a result param for the content and an Inner param as a wrapper of the inner content
// Falsy params are given `Id`
const componentFor = type => {
    if (!type || type.length == 0) { 
        return Id
    } else if (Array.isArray(type)) {
        const [outer, ...inner] = type
        const Outer = componentFor(outer)
        const Inner = componentFor(inner)
        return ({ result }) => <Outer Inner={Inner} result={result}/>
    } else if (typeof type == 'string') {
        if (!(type in typeMap)) {
            console.error(`Unknown type ${type}, falling back to id`)
            return Id
        }
        return typeMap[type]
    } else if (typeof type == 'function') {
        return ({ result, Inner = Id }) => type(result, Inner)
    }
    console.error(`Unknown type ${type}, falling back to Id`, type)
    return Id
}

const ResultElem = ({ result, name, children, type = undefined }) => {
    const Component = componentFor(type)

    return name in result ? (
        <p className="result-p"><b>{children}:</b> <Component result={result[name]}/></p>
    ) : null
}

const Result = spec => {
    spec = spec.map(elem => {
        if (typeof elem == 'string') { elem = { key: elem } }
        const id = elem.id ?? elem.key
        const label = elem.label ?? words(upperCase(id.replace(/^txt_/, ''))).map(capitalize).join(' ')
        return result => <ResultElem result={result} key={id} name={elem.key} type={elem.type}>{label}</ResultElem>
    })
    return ({ result }) => <div>
        {spec.map(elem => elem(result))}
    </div>
};

export default Result;