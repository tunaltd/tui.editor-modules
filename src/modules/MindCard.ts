/// <reference path="../apps/LoreCard.ts" />
/// <reference path="./ModuleBase.ts" />

"use strict";

class MindCard extends ModuleBase {
    public static cyStyles = [ // the stylesheet for the graph
        {
            selector: "node",
            style: {
                // "width": "20px",
                // "height": "20px",
                "text-wrap": "wrap",
                "text-max-width": "200px",
                // "overlay-padding": "5px",
                // "overlay-opacity": 0,
                // "z-index": 10,
                // "border-width": 2,
                // "border-opacity": 0,
                "background-color": "#acf",
                "border-width": 1,
                "border-color": "#69c"
            }
        },
        {
            selector: "node[title]",
            style: {
                "label": "data(title)"
            }
        },

        {
            selector: "edge", // default edge style
            style: {
                "curve-style": "unbundled-bezier",
                "control-point-distance": 30,
                "control-point-weight": 0.5,
                "opacity": 0.9,
                "overlay-padding": "3px",
                "overlay-opacity": 0,
                "label": "data(title)",
                "font-family": "FreeSet,Arial,sans-serif",
                "font-size": 9,
                "font-weight": "bold",
                "text-background-opacity": 1,
                "text-background-color": "#ffffff",
                "text-background-padding": 3,
                "text-background-shape": "roundrectangle",
                "width": 1,
                "target-arrow-shape": "vee"
            }
        }
    ];

    CyCache = {};

    constructor() {
        super("lorecard.mind");
    }

    setupFullScreen(wrapperId, btn) {
        const wrapper = document.getElementById(wrapperId);
        const width = wrapper.offsetWidth;
        const height = wrapper.offsetHeight;

        var sfsCtx = this;
        UIHelper.SetupFullScreen(wrapper, sfsCtx.tryRefreshCyAfterResize(wrapperId, width, height));

        btn.innerHTML = "<span class='mif-enlarge fg-cyan'></span>";
        btn.addEventListener("click", () => {
            UIHelper.LaunchFullScreen(wrapper);
        });
    }

    tryRefreshCyAfterResize(id, width, height) {
        const wrapper = document.getElementById(id);
        wrapper.style.width = width + "px";
        wrapper.style.height = height + "px";

        var cy = this.CyCache[id];
        if (cy) {
            cy.zoom(1);
            cy.resize();
            cy.center();
        }
    }

    initCytoscape(dataUri, data, wrapperId) {
        var wrapper = document.getElementById(wrapperId + "_wrapper");

        // cy core
        var divCy = document.getElementById(wrapperId);

        var noteLink = LoreService.getUri_NoteLink(dataUri);
        const btnTitle = document.createElement("a");
        btnTitle.classList.add("button", "light", "ml-3");
        btnTitle.style.lineHeight = "100%";
        btnTitle.style.textDecoration = "none";
        btnTitle.innerText = "Lore"; //data.title;
        btnTitle.href = noteLink;
        btnTitle.target = "_blank";
        //divTitle.appendChild(btnTitle);

        var authorLink = LoreService.getUri_Author_FromNoteLink(noteLink);
        const btnAuthor = document.createElement("a");
        //<a class="button light" href="/{{author}}"><span class="mif-user"></span> {{author}}</a>
        btnAuthor.classList.add("button", "light");
        btnAuthor.style.lineHeight = "100%"; // overrite [.tui-editor-contents :not(table)] in https://uicdn.toast.com/tui-editor/latest/tui-editor-contents.min.css
        btnAuthor.style.textDecoration = "none"; // overrite [.tui-editor-contents a] in https://uicdn.toast.com/tui-editor/latest/tui-editor-contents.min.css
        btnAuthor.innerHTML = '<span class="mif-user"></span> ' + LoreService.getUserName_FromAuthorLink(authorLink);
        btnAuthor.href = authorLink;
        btnAuthor.target = "_blank";

        // fullscreen
        //const btnFullscreen = document.createElement("button");
        //this.setupFullScreen(wrapperId, btnFullscreen);

        const divSettings = document.createElement("div");
        divSettings.classList.add("mt-3", "d-flex", "flex-justify-center", "flex-align-center");
        divSettings.appendChild(btnAuthor);
        divSettings.appendChild(btnTitle);
        //divSettings.appendChild(btnFullscreen);
        
        wrapper.innerHTML = "";
        wrapper.appendChild(divCy);
        wrapper.appendChild(divSettings);
        //wrapper.classList.add("support-full-screen");

        var cy = cytoscape({
            container: divCy, //document.getElementById(elementId), // container to render in
            zoom: 1,
            elements: _.concat(data.nodes, data.edges),
            style: MindCard.cyStyles,
            layout: {
                name: "preset"
            }
        });
        this.CyCache[wrapperId] = cy;
        return cy;
    }

    renderCytoscape(wrapperId, dataUri) {
        //var ctxGetData = this;
        LoreCard.api.getNoteByURL(dataUri, (data) => {
            //console.log(data);
            //var j = JSON.parse(data);
            //console.log(j);
            var cy = module_LoreCard_Mind.initCytoscape(dataUri, data, wrapperId);
        });
    }

}

//LoreCard.inititialize();
var module_LoreCard_Mind: MindCard = new MindCard();

tui.Editor.defineExtension(module_LoreCard_Mind.ModuleName, function () {
    tui.Editor.codeBlockManager.setReplacer(module_LoreCard_Mind.ModuleName, function (data) {
        var lines = data.match(/^.*((\r\n|\n|\r)|$)/gm);
        var dataUri;
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
        else {
            return "<p class='fg-red'>Invalid format for data uri</p>";
        }

        var uriHash = CommonUtitlity.ComputeHash(dataUri);
        var wrapperId = "divLoreMind_" + uriHash;
        //var exists = document.getElementById(wrapperId + "_wrapper");
        //if (exists) {
        //    return;
        //}

        setTimeout(module_LoreCard_Mind.renderCytoscape.bind(null, wrapperId, dataUri), 0);

        return '<div id="' + wrapperId + '_wrapper">'
            + '<div id="' + wrapperId + '" class="w-100 h-100 border bd-default bg-white" style="min-height: 500px; min-width: 500px;"></div>'
            + '</div>';
    });
});