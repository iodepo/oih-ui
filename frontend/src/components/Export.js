import React from "react";

const Export = (props) => {
    const { uri, searchType } = props;


    const onClickExport = (value, format) => {
        let URI = currentURI;
        if (URI !== "" && resultCount !== 0) {
            if (value === "all") {
                URI = URI.replace(/rows=\d+/, "rows=" + resultCount);
            } else {
                URI = URI.replace(/rows=\d+/, "rows=" + value);
            }

            fetch(URI)
                .then((response) => response.json())
                .then((json) => {
                    debugger;
                    const docs = json.docs;

                    const newJson = docs.map((d) => {
                        return { title: d.name, id: d.id };
                    });
                    console.log(newJson);
                });
        }
    };

    const createJson = (docs) => {
        switch (searchType) {
            case "Person":
                break;
            case "CreativeWork":
                break;
            case "Course":
                break;
            case "Dataset":
                break;
            case "Vehicle":
                break;
            case "ResearchProject":
                break;
            case "Organization":
                break;
            case "SpatialData":
                break;
        }
    };



    return;
};

export default Export;
