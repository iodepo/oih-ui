import React from "react";
import DocumentAttributeList from "./DocumentAttributeList";

export default function CourseResult({result}) {
    return (
        <div>
            <p className="result-p"><b>Course Instance:</b> {'txt_hasCourseInstance' in result &&
            <DocumentAttributeList results={result['txt_hasCourseInstance']}/>}
            </p>
            <p className="result-p"><b>Location:</b> {result['txt_location']}</p>
        </div>
    )
}