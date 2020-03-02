# tui.editor-modules

[![Greenkeeper badge](https://badges.greenkeeper.io/tunaltd/tui.editor-modules.svg)](https://greenkeeper.io/)

Some modules for tui.editor.

Source folder structure:  

    |-- apps
    |   |-- LoreCard.ts
    |   |-- LoreEditor.ts // set toolbar of tui.editor
    |-- fef.metro // Implementation based on metro
        |-- modules // cards implementation
        |-- tools // specified tools
    |-- models
        |-- ModelData.ts
    |-- tools
        |-- CommonUtility.ts
        |-- LoreService.ts
    |-- typings // typings for TypeScript

### Explaination
* the prefix `fef` means Front-end framework
* TypeScript generates js file: `./src/apps/lore-editor-tui.editor.js`
* gulp generates minimized js file: `./src/apps/lore-editor-tui.editor.min.js`

### Demo
* Write article with markdown: loggin lore.chuci.info
* View: [Hello,Article - 20191225](https://taurenshaman.github.io/articles/2019.html)

### Editor
The editor lib: [tui.editor](https://github.com/nhn/tui.editor) under [MIT License](https://github.com/nhn/tui.editor/blob/master/LICENSE)

### Common
* [Metro](https://github.com/olton/Metro-UI-CSS) under [MIT License](https://github.com/olton/Metro-UI-CSS/blob/master/LICENSE)
* [cytoscape.js](https://github.com/cytoscape/cytoscape.js) under [MIT License](https://github.com/cytoscape/cytoscape.js/blob/unstable/LICENSE)

### [archived]
Cytoscape module:  
* [demo](http://taurenshaman.github.io/tui.editor+cytoscape.html)
