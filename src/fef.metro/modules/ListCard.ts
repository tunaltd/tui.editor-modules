/// <reference path="../../apps/LoreCard.ts" />
/// <reference path="./ModuleBase.ts" />

"use strict";

namespace FEF.Modules {
    export class ListCard extends ModuleBase {
        constructor() {
            super("lorecard.list");
        }

        //createItem2(divContainer, title: string, description: string): HTMLDivElement {
        //    const divItem = document.createElement("div");
        //    divItem.classList.add("row", "mt-2", "mb-2");

        //    const h4 = document.createElement("h4");
        //    h4.classList.add("w-100");
        //    h4.innerText = title;
        //    divItem.appendChild(h4);

        //    const p = document.createElement("p");
        //    p.classList.add("w-100");
        //    p.innerText = description;
        //    divItem.appendChild(p);

        //    divContainer.appendChild(divItem);
        //    return divItem;
        //}

        createItem(containerUL: HTMLUListElement, title: string, description: string): HTMLLIElement {
            const liItem = document.createElement("li");
            liItem.classList.add("step-list-item");

            const h4 = document.createElement("h4");
            h4.innerText = title;
            liItem.appendChild(h4);

            const p = document.createElement("p");
            p.classList.add("w-100");
            p.innerText = description;
            liItem.appendChild(p);

            containerUL.appendChild(liItem);
            return liItem;
        }

        initCard(dataUri, data, wrapperId) {
            var wrapper = document.getElementById(wrapperId + "_wrapper");
            wrapper.classList.add("flex-justify-center", "flex-align-center");

            const divList = document.getElementById(wrapperId);
            const ul = document.createElement("ul");
            ul.classList.add("step-list");

            var ctxInit = this;
            _.forEach(data.items, item => {
                ctxInit.createItem(ul, item.title, item.description);
                //ctxInit.createItem2(divList, item.title, item.description);
            });
            divList.appendChild(ul);

            var noteLink = KC.Tools.LoreService.getUri_NoteLink(dataUri);
            const btnNote = this.createLinkButton_Note(noteLink);

            var authorLink = KC.Tools.LoreService.getUri_Author_FromNoteLink(noteLink);
            const btnAuthor = this.createLinkButton_Author(authorLink);

            const divSettings = this.createDiv_Settings(btnNote, btnAuthor);

            wrapper.innerHTML = "";
            wrapper.appendChild(divList);
            wrapper.appendChild(divSettings);
        }

        renderCard(wrapperId, dataUri) {
            let ctx = this;
            LoreCard.api.getNoteByURL(dataUri, (data) => {
                ctx.initCard(dataUri, data, wrapperId);
            });
        }

    }

    export function ListCardPlugin() {
        const { Editor } = toastui;

        var module_LoreCard_List: ListCard = new ListCard();

        Editor.codeBlockManager.setReplacer(module_LoreCard_List.ModuleName, function (data) {
            var dataUri = module_LoreCard_List.getDataUri(data);
            if (dataUri.length === 0 || dataUri.indexOf("http") < 0) {
                return "<p class='fg-red'>Invalid format for data uri</p>";
            }

            var uriHash = KC.Tools.CommonUtitlity.ComputeHash(dataUri);
            var wrapperId = "divLoreSection_" + uriHash;

            setTimeout(module_LoreCard_List.renderCard.bind(module_LoreCard_List, wrapperId, dataUri), 0);

            return '<div id="' + wrapperId + '_wrapper">'
                + '<div id="' + wrapperId + '" class="w-100 h-100 border bd-default bg-white" style="min-height: 520px; min-width: 500px;"></div>'
                + '</div>';
        });
      }

}