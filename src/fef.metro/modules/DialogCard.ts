/// <reference path="../../apps/LoreCard.ts" />
/// <reference path="./ModuleBase.ts" />

"use strict";

class DialogCard extends ModuleBase {
    constructor() {
        super("lorecard.dialog");
    }

    runChatFlow(wrapperId, data) {
        var chat = $("#" + wrapperId).data("chat");
        chat.clear(); // clear first

        let delay = 0;
        var items = data.items;

        for (var i = 0; i < items.length; i++) {
            (function (ind) {
                delay += (items[ind].delay * 1000);
                setTimeout(function () {
                    var _m = items[ind];
                    chat.add(_m);
                }, delay);
            })(i);
        }
    }

    initCard(dataUri, data, wrapperId) {
        var wrapper = document.getElementById(wrapperId + "_wrapper");
        wrapper.classList.add("flex-justify-center", "flex-align-center");

        // dialog: <div id="chat" data-role="chat" data-readonly="true" style="max-height:500px;"></div>
        var divDialog = document.getElementById(wrapperId);
        divDialog.id = wrapperId;
        divDialog.setAttribute("data-role", "chat");
        divDialog.setAttribute("data-readonly", "true");
        divDialog.style.maxHeight = "500px";
        //divDialog.style.overflowY = "scroll";

        var noteLink = LoreService.getUri_NoteLink(dataUri);
        const btnTitle = document.createElement("a");
        btnTitle.classList.add("button", "light", "ml-3");
        btnTitle.style.lineHeight = "100%";
        btnTitle.style.textDecoration = "none";
        btnTitle.innerText = "Lore"; //data.title;
        btnTitle.href = noteLink;
        btnTitle.target = "_blank";

        var authorLink = LoreService.getUri_Author_FromNoteLink(noteLink);
        const btnAuthor = document.createElement("a");
        //<a class="button light" href="/{{author}}"><span class="mif-user"></span> {{author}}</a>
        btnAuthor.classList.add("button", "light", "ml-3");
        btnAuthor.style.lineHeight = "100%"; // overrite [.tui-editor-contents :not(table)] in https://uicdn.toast.com/tui-editor/latest/tui-editor-contents.min.css
        btnAuthor.style.textDecoration = "none"; // overrite [.tui-editor-contents a] in https://uicdn.toast.com/tui-editor/latest/tui-editor-contents.min.css
        btnAuthor.innerHTML = '<span class="mif-user"></span> ' + LoreService.getUserName_FromAuthorLink(authorLink);
        btnAuthor.href = authorLink;
        btnAuthor.target = "_blank";

        const btnRefresh = document.createElement("button");
        //<a class="button light" href="/{{author}}"><span class="mif-user"></span> {{author}}</a>
        btnRefresh.classList.add("button", "light");
        btnRefresh.style.lineHeight = "100%"; // overrite [.tui-editor-contents :not(table)] in https://uicdn.toast.com/tui-editor/latest/tui-editor-contents.min.css
        //btnRefresh.style.textDecoration = "none"; // overrite [.tui-editor-contents a] in https://uicdn.toast.com/tui-editor/latest/tui-editor-contents.min.css
        btnRefresh.innerHTML = '<span class="mif-refresh"></span>';
        btnRefresh.onclick = (ev) => {
            module_LoreCard_Dialog.runChatFlow(wrapperId, data);
        };

        const divSettings = document.createElement("div");
        divSettings.classList.add("mt-3", "d-flex", "flex-justify-center", "flex-align-center");
        divSettings.appendChild(btnRefresh);
        divSettings.appendChild(btnAuthor);
        divSettings.appendChild(btnTitle);

        wrapper.innerHTML = "";
        wrapper.appendChild(divDialog);
        wrapper.appendChild(divSettings);

        //setTimeout(() => {
            
        //}, 100);
    }

    renderCard(wrapperId, dataUri) {
        //var ctxGetData = this;
        LoreCard.api.getNoteByURL(dataUri, (data) => {
            LoreService.fitDialog(data);
            module_LoreCard_Dialog.initCard(dataUri, data, wrapperId);
        });
    }

}


var module_LoreCard_Dialog: DialogCard = new DialogCard();

tui.Editor.defineExtension(module_LoreCard_Dialog.ModuleName, function () {
    tui.Editor.codeBlockManager.setReplacer(module_LoreCard_Dialog.ModuleName, function (data) {
        var dataUri = module_LoreCard_Dialog.getDataUri(data);
        if (dataUri.length === 0 || dataUri.indexOf("http") < 0) {
            return "<p class='fg-red'>Invalid format for data uri</p>";
        }

        var uriHash = CommonUtitlity.ComputeHash(dataUri);
        var wrapperId = "divLoreDialog_" + uriHash;

        setTimeout(module_LoreCard_Dialog.renderCard.bind(null, wrapperId, dataUri), 0);

        return '<div id="' + wrapperId + '_wrapper">'
            + '<div id="' + wrapperId + '" class="w-100 h-100 border bd-default bg-white" style="min-height: 520px; min-width: 500px;"></div>'
            + '</div>';
    });
});