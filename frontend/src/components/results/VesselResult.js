import React from "react";
import DocumentAttributeList from "./DocumentAttributeList";

export default function VesselResult({result}) {
    return (
        <div>
            {'txt_additionalProperty' in result && <p className="result-p"><b>Additional Property:</b>
                <DocumentAttributeList results={result['txt_additionalProperty']}/>
            </p>}
            {'txt_category' in result && <p className="result-p"><b>Category:</b> {result['txt_category']}</p>}
            {'txt_vehicleConfiguration' in result && <p className="result-p"><b>Configuration:</b> {result['txt_vehicleConfiguration']}</p>}
            {'txt_vehicleSpecialUsage' in result && <p className="result-p"><b>Special Usage:</b> {result['txt_vehicleSpecialUsage']}</p>}
        </div>
    )
}