import React from "react";

export default function DocumentAttributeList({results}) {
    return (
        <ul>
            {results.map((item, i) =>
                <li key={i}>{item}</li>
            )}
        </ul>
    )
}