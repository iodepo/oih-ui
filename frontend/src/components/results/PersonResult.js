import React from "react";

export default function PersonResult({result}) {
    return(
        <div>
            <p><b>Id:</b> {result['id']}</p>
            <p><b>Author(s):</b> {result['txt_author']}</p>
            <p><b>Identifier:</b> {result['txt_identifier']}</p>
            <p><b>Keywords:</b> {result['txt_keywords']}</p>
        </div>
    )
}