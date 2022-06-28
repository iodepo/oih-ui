import React from "react";
import DocumentAttributeList from "./DocumentAttributeList";

export default function VesselResult({result}) {
    return(
        <div>
            <p><b>Additional Property:</b></p>
            {'txt_additionalProperty' in result && <DocumentAttributeList results={result['txt_additionalProperty']}/>}
            <p><b>Category:</b> {result['txt_category']}</p>
            <p><b>Configuration:</b> {result['txt_vehicleConfiguration']}</p>
            <p><b>Special Usage:</b> {result['txt_vehicleSpecialUsage']}</p>
        </div>
    )
}