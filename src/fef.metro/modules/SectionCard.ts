/// <reference path="../../apps/LoreCard.ts" />
/// <reference path="./ModuleBase.ts" />

"use strict";

class SectionCard extends ModuleBase {
    constructor() {
        super("lorecard.section");
    }

    createCardHeader(wrapperId, title) {
        const div = document.createElement("div");
        div.classList.add("card-header");
        div.innerText = title;
        return div;
    }

    createCardFooter(wrapperId) {
        // <button class="flat-button mif-arrow-right mif-2x" onclick = "$('#canvasContainer').toggleClass('active')" > </button>
        const btn = document.createElement("button");
        btn.classList.add("flat-button", "mif-arrow-right", "mif-2x", "fg-black");
        btn.onclick = (ev) => {
            $("#" + wrapperId).toggleClass("active");
        };

        const div = document.createElement("div");
        div.classList.add("card-footer");
        div.appendChild(btn);
        
        return div;
    }

    createCardContent(wrapperId, side) {
        // <div id="viewer_back" style="height: 360px; overflow-y: auto"></div>
        var divEditor = document.createElement("div");
        divEditor.id = "viewer_" + side + "_" + wrapperId;
        divEditor.style.height = "360px";
        divEditor.style.overflowY = "auto";

        // <div class="card-content p-2">
        const div = document.createElement("div");
        div.classList.add("card-content");
        div.appendChild(divEditor);

        return div;
    }

    createMetroCard(wrapperId, side, title) {
        const divHeader = this.createCardHeader(wrapperId, title);
        const divContent = this.createCardContent(wrapperId, side);
        const divFooter = this.createCardFooter(wrapperId);

        const divCard = document.createElement("div");
        divCard.classList.add("card");
        divCard.appendChild(divHeader);
        divCard.appendChild(divContent);
        divCard.appendChild(divFooter);

        return divCard;
    }

    createCardSide(wrapperId, side, title) {
        const divCard = this.createMetroCard(wrapperId, side, title);

        const divSide = document.createElement("div");
        divSide.classList.add(side);
        divSide.appendChild(divCard);

        return divSide;
    }

    initCard(dataUri, data, wrapperId) {
        var wrapper = document.getElementById(wrapperId + "_wrapper");
        wrapper.classList.add("flex-justify-center", "flex-align-center");

        // section
        var divSection = document.getElementById(wrapperId);
        divSection.classList.add("flip-card", "effect-on-active");
        divSection.style.width = "360px";
        divSection.style.height = "520px";

        var divFront = this.createCardSide(wrapperId, "front", data.title);
        var divBack = this.createCardSide(wrapperId, "back", data.title);

        divSection.appendChild(divFront);
        divSection.appendChild(divBack);

        var noteLink = LoreService.getUri_NoteLink(dataUri);
        const btnNote = this.createLinkButton_Note(noteLink);

        var authorLink = LoreService.getUri_Author_FromNoteLink(noteLink);
        const btnAuthor = this.createLinkButton_Author(authorLink);

        const divSettings = this.createDiv_Settings(btnNote, btnAuthor);

        wrapper.innerHTML = "";
        wrapper.appendChild(divSection);
        wrapper.appendChild(divSettings);

        setTimeout(() => {
            // "viewer_" + side + "_" + wrapperId
            var viewerFront = tui.Editor.factory({
                el: document.querySelector('#viewer_front_' + wrapperId),
                initialEditType: 'markdown',
                previewStyle: 'vertical',
                height: '400px',
                initialValue: data.front.content,
                viewer: true,
                exts: ['table', 'uml']
            });
            var viewerBack = tui.Editor.factory({
                el: document.querySelector('#viewer_back_' + wrapperId),
                initialEditType: 'markdown',
                previewStyle: 'vertical',
                height: '400px',
                initialValue: data.back.content,
                viewer: true,
                exts: ['table', 'uml']
            });
        }, 100);
    }

    renderCard(wrapperId, dataUri) {
        //var ctxGetData = this;
        LoreCard.api.getNoteByURL(dataUri, (data) => {
            module_LoreCard_Section.initCard(dataUri, data, wrapperId);
        });
    }

}

var module_LoreCard_Section: SectionCard = new SectionCard();

tui.Editor.defineExtension(module_LoreCard_Section.ModuleName, function () {
    tui.Editor.codeBlockManager.setReplacer(module_LoreCard_Section.ModuleName, function (data) {
        var dataUri = module_LoreCard_Section.getDataUri(data);
        if (dataUri.length === 0 || dataUri.indexOf("http") < 0) {
            return "<p class='fg-red'>Invalid format for data uri</p>";
        }

        var uriHash = CommonUtitlity.ComputeHash(dataUri);
        var wrapperId = "divLoreSection_" + uriHash;

        setTimeout(module_LoreCard_Section.renderCard.bind(null, wrapperId, dataUri), 0);

        return '<div id="' + wrapperId + '_wrapper">'
            + '<div id="' + wrapperId + '" class="w-100 h-100 border bd-default bg-white" style="min-height: 520px; min-width: 500px;"></div>'
            + '</div>';
    });
});