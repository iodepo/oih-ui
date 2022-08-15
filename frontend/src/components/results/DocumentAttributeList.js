import React from "react";

export default function DocumentAttributeList({results}) {
    return (
        <>
            {results.map((item, i) =>
                <span key={i}>{item}{i != results.length - 1 ? ',' : ''} </span>
            )}
        </>
    )
}