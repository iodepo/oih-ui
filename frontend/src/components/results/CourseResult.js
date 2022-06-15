import React from "react";

export default function CourseResult({result}) {
    return(
        <div>
            <p><b>Course Instance:</b> {result['txt_hasCourseInstance']}</p>
            <p><b>Location:</b> {result['txt_location']}</p>
        </div>
    )
}