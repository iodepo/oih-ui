import React from "react";

export default function VesselResult({result}) {
    return(
        <div>
            <p><b>Additional Property:</b> {result['txt_additionalProperty']}</p>
            <p><b>Category:</b> {result['txt_category']}</p>
            <p><b>Configuration:</b> {result['txt_vehicleConfiguration']}</p>
            <p><b>Special Usage:</b> {result['txt_vehicleSpecialUsage']}</p>
        </div>
    )
}