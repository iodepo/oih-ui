import React from "react";
import DocumentAttributeList from "./DocumentAttributeList";

export default function VesselResult({result}) {
    return (
        <div>
            <p className="result-p"><b>Additional Property:</b> {'txt_additionalProperty' in result &&
            <DocumentAttributeList results={result['txt_additionalProperty']}/>}
            </p>
            <p className="result-p"><b>Category:</b> {result['txt_category']}</p>
            <p className="result-p"><b>Configuration:</b> {result['txt_vehicleConfiguration']}</p>
            <p className="result-p"><b>Special Usage:</b> {result['txt_vehicleSpecialUsage']}</p>
        </div>
    )
}