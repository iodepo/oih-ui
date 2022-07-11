import React from "react";
import DocumentAttributeList from "./DocumentAttributeList";

export default function CourseResult({result}) {
    return(
        <div>
            <p><b>Course Instance:</b></p>
            {'txt_hasCourseInstance' in result && <DocumentAttributeList results={result['txt_hasCourseInstance']}/>}
            <p><b>Location:</b> {result['txt_location']}</p>
        </div>
    )
}