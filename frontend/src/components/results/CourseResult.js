import React from "react";
import DocumentAttributeList from "./DocumentAttributeList";

export default function CourseResult({result}) {
    return (
        <div>
            {'txt_hasCourseInstance' in result && <p className="result-p"><b>Course Instance:</b>
                <DocumentAttributeList results={result['txt_hasCourseInstance']}/>
            </p>}
            {'txt_location' in result && <p className="result-p"><b>Location:</b> {result['txt_location']}</p>}
        </div>
    )
}