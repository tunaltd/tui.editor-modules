"use strict";

class ModuleBase {
    api: LoreService;
    ModuleName: string;

    constructor(moduleName) {
        this.api = LoreCard.inititialize();
        this.ModuleName = moduleName;
    }

    getDataUri(data) {
        var lines = data.match(/^.*((\r\n|\n|\r)|$)/gm);
        var dataUri = "";
        if (lines && lines.length > 0) {
            lines.forEach(element => {
                //console.log(element); // ok
                if (element.startsWith("dataUri:")) {
                    dataUri = _.replace(element, "dataUri:", "");
                }
                else if (element.startsWith("data:")) {
                    dataUri = _.replace(element, "data:", "");
                }
                else if (element.startsWith("uri:")) {
                    dataUri = _.replace(element, "uri:", "");
                }
            });
            dataUri = _.trim(dataUri);
        }
        return dataUri;
    }
}