"use strict";

class ModuleBase {
    api: LoreService;
    ModuleName: string;

    constructor(moduleName) {
        this.api = LoreCard.inititialize();
        this.ModuleName = moduleName;
    }
}