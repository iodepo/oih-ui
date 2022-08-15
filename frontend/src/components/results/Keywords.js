const Keyword = ({ keyword }) => {
    const [truncated, setTruncated] = useState(false)
    return <span
                className={`bg-secondary mx-1 truncate badge`}
                style={{ maxWidth: keywordTruncate[i] ? '12em' : undefined }}
                onClick={() => setTruncated(!truncateds)}
            >
                {keyword}
            </span>
};

export default function Keywords({ keywords }) {
    const [keywordsTruncated, setKeywordsTruncated] = useState(result['txt_keywords'].length > 20)
    return <>
        {keywords.map(keyword => <Keyword keyword={keyword} />).slice(0, keywordsTruncated ? 20 : undefined)}
        {keywordsTruncated && (
            <button
                className="bg-secondary mx-1 truncate btn badge"
                style={{ verticalAlign: 'super' }}
                onClick={() => setKeywordsTruncated(false)}
            >
                Show More
            </button>
        )}
    </>
}