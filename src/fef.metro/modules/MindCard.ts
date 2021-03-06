/// <reference path="../../apps/LoreCard.ts" />
/// <reference path="./ModuleBase.ts" />

"use strict";

namespace FEF.Modules {
    export class MindCard extends ModuleBase {
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
            FEF.Tools.UIHelper.SetupFullScreen(wrapper, sfsCtx.tryRefreshCyAfterResize(wrapperId, width, height));

            btn.innerHTML = "<span class='mif-enlarge fg-cyan'></span>";
            btn.addEventListener("click", () => {
                FEF.Tools.UIHelper.LaunchFullScreen(wrapper);
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

            var noteLink = KC.Tools.LoreService.getUri_NoteLink(dataUri);
            const btnNote = this.createLinkButton_Note(noteLink);

            var authorLink = KC.Tools.LoreService.getUri_Author_FromNoteLink(noteLink);
            const btnAuthor = this.createLinkButton_Author(authorLink);

            // fullscreen
            //const btnFullscreen = document.createElement("button");
            //this.setupFullScreen(wrapperId, btnFullscreen);

            const divSettings = this.createDiv_Settings(btnNote, btnAuthor);
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
            let ctx = this;
            LoreCard.api.getNoteByURL(dataUri, (data) => {
                //console.log(data);
                //var j = JSON.parse(data);
                //console.log(j);
                var cy = ctx.initCytoscape(dataUri, data, wrapperId);
            });
        }

    }

    export function MindCardPlugin() {
        const { Editor } = toastui;

        var module_LoreCard_Mind: MindCard = new MindCard();

        Editor.codeBlockManager.setReplacer(module_LoreCard_Mind.ModuleName, function (data) {
            var dataUri = module_LoreCard_Mind.getDataUri(data);
            if (dataUri.length === 0 || dataUri.indexOf("http") < 0) {
                return "<p class='fg-red'>Invalid format for data uri</p>";
            }

            var uriHash = KC.Tools.CommonUtitlity.ComputeHash(dataUri);
            var wrapperId = "divLoreSection_" + uriHash;

            setTimeout(module_LoreCard_Mind.renderCytoscape.bind(module_LoreCard_Mind, wrapperId, dataUri), 0);

            return '<div id="' + wrapperId + '_wrapper">'
                + '<div id="' + wrapperId + '" class="w-100 h-100 border bd-default bg-white" style="min-height: 520px; min-width: 500px;"></div>'
                + '</div>';
        });
      }

}