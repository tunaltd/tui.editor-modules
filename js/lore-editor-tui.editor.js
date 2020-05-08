"use strict";
var KC;
(function (KC) {
    var Tools;
    (function (Tools) {
        class LoreService {
            constructor(appId, appSecret) {
                this.appId = appId;
                this.appSecret = appSecret;
            }
            getNoteByURL(url, callback) {
                var uri = LoreService.getUri_Api_GetNote(url);
                $.ajax({
                    url: uri,
                    dataType: "json",
                    type: "GET",
                    contentType: 'application/x-www-form-urlencoded',
                    data: "appid=" + this.appId,
                    async: true,
                    processData: false,
                    cache: false,
                    crossDomain: true,
                    success: function (data, textStatus, jqXHR) {
                        if (typeof callback === "function") {
                            callback(data);
                            return;
                        }
                    },
                    error: function (jqXHR, textStatus, errorThrown) {
                        var msgError = "��Status��" + textStatus + "��error��" + errorThrown + "��others��" + jqXHR.responseText;
                        FEF.Tools.UIHelper.ShowError("ERROR", msgError);
                    }
                });
            }
            getNote(author, domain, docId, callback) {
                var uri = "/api/" + LoreService.apiVersion + "/" + author + "/" + domain + "/" + docId;
                this.getNoteByURL(uri, callback);
            }
            static getUri_Api_GetNote(uri) {
                var apiUri = uri;
                if (uri.startsWith("https://localhost") && !uri.startsWith("https://localhost:44356/api")) {
                    LoreService.apiUriPrefix = "https://localhost:44356/api/" + LoreService.apiVersion + "/";
                    var uriPrefix_Localhost = "https://localhost:44356/";
                    apiUri = LoreService.apiUriPrefix + uri.substring(uriPrefix_Localhost.length);
                }
                else if (uri.startsWith("https://lore.chuci.info") && !uri.startsWith("https://lore.chuci.info/api")) {
                    LoreService.apiUriPrefix = "https://lore.chuci.info/api/" + LoreService.apiVersion + "/";
                    apiUri = LoreService.apiUriPrefix + uri.substring(LoreService.uriPrefix.length);
                }
                return apiUri;
            }
            static getUri_NoteLink(uri) {
                var link = uri;
                var apiString = "/api/" + LoreService.apiVersion;
                if (uri.indexOf(apiString) >= 0) {
                    link = uri.replace(apiString, "");
                }
                return link;
            }
            static getUri_Author_FromNoteLink(noteLink) {
                var tmpPrefix = LoreService.uriPrefix;
                if (noteLink.startsWith("https://localhost")) {
                    tmpPrefix = "https://localhost:44356/";
                }
                var link = noteLink.substring(tmpPrefix.length);
                var index = link.indexOf("/");
                var authorName = link.substring(0, index);
                return tmpPrefix + authorName;
            }
            static getUserName_FromAuthorLink(authorLink) {
                var index = authorLink.lastIndexOf("/");
                var name = authorLink.substring(index + 1);
                return name;
            }
            static getClassName(domain) {
                let className = "JsonDocument";
                switch (domain) {
                    case KC.Models.ModelData.Type_Document:
                        break;
                    case KC.Models.ModelData.Type_Mind:
                        className = 'MindDocument';
                        break;
                    case KC.Models.ModelData.Type_Dialog:
                        className = 'DialogDocument';
                        break;
                    case KC.Models.ModelData.Type_Section:
                        className = 'SectionDocument';
                        break;
                    case KC.Models.ModelData.Type_List:
                        className = 'ListDocument';
                        break;
                    case KC.Models.ModelData.Type_XY:
                        className = 'QuadrantAnalysisDocument';
                        break;
                    case KC.Models.ModelData.Type_5W2H1E:
                        className = '5W2H1EDocument';
                        break;
                    case KC.Models.ModelData.Type_LanguagePack:
                        className = 'LanguagePackDocument';
                        break;
                    case KC.Models.ModelData.Type_Topic:
                        className = 'TopicDocument';
                        break;
                    default:
                        break;
                }
                return className;
            }
            static getClassUri(domain) {
                let apiPrefix = "http://www.chuci.info/schema/lore-document#";
                let className = LoreService.getClassName(domain);
                return apiPrefix + className;
            }
            static fitDialog(json) {
                var agents = json.agents;
                _.forEach(json.items, (item) => {
                    var agentId = item.agentId;
                    var agent = _.find(agents, function (o) { return o.id === agentId; });
                    item.name = agent.name;
                    item.avatar = "https://robohash.org/" + agentId + ".png";
                    item.time = new Date(item.time);
                });
                return json.items;
            }
        }
        LoreService.uriPrefix = "https://lore.chuci.info/";
        LoreService.apiVersion = "v1";
        LoreService.apiUriPrefix = "https://lore.chuci.info/api/" + LoreService.apiVersion + "/";
        Tools.LoreService = LoreService;
    })(Tools = KC.Tools || (KC.Tools = {}));
})(KC || (KC = {}));
class LoreCard {
    static inititialize() {
        if (typeof LoreCard.api === "undefined") {
            LoreCard.initService("", "");
        }
        return LoreCard.api;
    }
    static initService(appId, appSecret) {
        LoreCard.api = new KC.Tools.LoreService(appId, appSecret);
        return LoreCard.api;
    }
}
class LoreEditor {
    constructor(editor) {
        this.editor = editor;
        this.toolbar = this.editor.getUI().getToolbar();
        this.init();
    }
    addToolbarCommand_Dialog() {
        this.editor.eventManager.addEventType('BtnEvent_LoreCard_Dialog');
        const ctxATC_Dialog = this;
        this.editor.eventManager.listen('BtnEvent_LoreCard_Dialog', function () {
            const markdownMode = ctxATC_Dialog.editor.isMarkdownMode();
            if (markdownMode === false)
                return;
            const content = [
                '',
                '```' + 'lorecard.' + KC.Models.ModelData.Type_Dialog,
                'data: ',
                '```',
                ''
            ].join('\n');
            ctxATC_Dialog.editor.insertText(content);
        });
        this.toolbar.addItem({
            type: 'button',
            options: {
                className: 'mif-chat-bubble-outline fg-orange',
                event: 'BtnEvent_LoreCard_Dialog',
                tooltip: 'lore:> dialog',
                style: 'background:none;'
            }
        });
    }
    addToolbarCommand_Mind() {
        this.editor.eventManager.addEventType('BtnEvent_LoreCard_Mind');
        const ctxATC_Mind = this;
        this.editor.eventManager.listen('BtnEvent_LoreCard_Mind', function () {
            let markdownMode = ctxATC_Mind.editor.isMarkdownMode();
            if (markdownMode === false)
                return;
            const content = [
                '',
                '```' + 'lorecard.' + KC.Models.ModelData.Type_Mind,
                'data: ',
                '```',
                ''
            ].join('\n');
            ctxATC_Mind.editor.insertText(content);
        });
        this.toolbar.addItem({
            type: 'button',
            options: {
                className: 'mif-share fg-orange',
                event: 'BtnEvent_LoreCard_Mind',
                tooltip: 'lore:> mind',
                style: 'background:none;'
            }
        });
    }
    addToolbarCommand_Section() {
        this.editor.eventManager.addEventType('BtnEvent_LoreCard_Section');
        const ctxATC_Section = this;
        this.editor.eventManager.listen('BtnEvent_LoreCard_Section', function () {
            const markdownMode = ctxATC_Section.editor.isMarkdownMode();
            if (markdownMode === false)
                return;
            const content = [
                '',
                '```' + 'lorecard.' + KC.Models.ModelData.Type_Section,
                'data: ',
                '```',
                ''
            ].join('\n');
            ctxATC_Section.editor.insertText(content);
        });
        this.toolbar.addItem({
            type: 'button',
            options: {
                className: 'mif-book-reference fg-orange',
                event: 'BtnEvent_LoreCard_Section',
                tooltip: 'lore:> section',
                style: 'background:none;'
            }
        });
    }
    addToolbarCommand_List() {
        this.editor.eventManager.addEventType('BtnEvent_LoreCard_List');
        const ctxATC_Section = this;
        this.editor.eventManager.listen('BtnEvent_LoreCard_List', function () {
            const markdownMode = ctxATC_Section.editor.isMarkdownMode();
            if (markdownMode === false)
                return;
            const content = [
                '',
                '```' + 'lorecard.' + KC.Models.ModelData.Type_List,
                'data: ',
                '```',
                ''
            ].join('\n');
            ctxATC_Section.editor.insertText(content);
        });
        this.toolbar.addItem({
            type: 'button',
            options: {
                className: 'mif-list-numbered fg-orange',
                event: 'BtnEvent_LoreCard_List',
                tooltip: 'lore:> list',
                style: 'background:none;'
            }
        });
    }
    init() {
        this.addToolbarCommand_Dialog();
        this.addToolbarCommand_Mind();
        this.addToolbarCommand_Section();
        this.addToolbarCommand_List();
    }
}
var FEF;
(function (FEF) {
    var Modules;
    (function (Modules) {
        class ModuleBase {
            constructor(moduleName) {
                this.api = LoreCard.inititialize();
                this.ModuleName = moduleName;
            }
            getDataUri(data) {
                var lines = data.match(/^.*((\r\n|\n|\r)|$)/gm);
                var dataUri = "";
                if (lines && lines.length > 0) {
                    lines.forEach(element => {
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
            createLinkButton_Note(noteLink) {
                const btnNote = document.createElement("a");
                btnNote.classList.add("button", "light", "ml-3");
                btnNote.style.lineHeight = "100%";
                btnNote.style.textDecoration = "none";
                btnNote.innerText = "Lore";
                btnNote.href = noteLink;
                btnNote.target = "_blank";
                return btnNote;
            }
            createLinkButton_Author(authorLink) {
                const btnAuthor = document.createElement("a");
                btnAuthor.classList.add("button", "light", "ml-3");
                btnAuthor.style.lineHeight = "100%";
                btnAuthor.style.textDecoration = "none";
                btnAuthor.innerHTML = '<span class="mif-user"></span> ' + KC.Tools.LoreService.getUserName_FromAuthorLink(authorLink);
                btnAuthor.href = authorLink;
                btnAuthor.target = "_blank";
                return btnAuthor;
            }
            createDiv_Settings(linkBtnNote, linkBtnAuthor) {
                const divSettings = document.createElement("div");
                divSettings.classList.add("mt-3", "d-flex", "flex-justify-center", "flex-align-center");
                if (linkBtnAuthor) {
                    divSettings.appendChild(linkBtnAuthor);
                }
                if (linkBtnNote) {
                    divSettings.appendChild(linkBtnNote);
                }
                return divSettings;
            }
        }
        Modules.ModuleBase = ModuleBase;
    })(Modules = FEF.Modules || (FEF.Modules = {}));
})(FEF || (FEF = {}));
var FEF;
(function (FEF) {
    var Modules;
    (function (Modules) {
        class DialogCard extends Modules.ModuleBase {
            constructor() {
                super("lorecard.dialog");
            }
            runChatFlow(wrapperId, data) {
                var chat = $("#" + wrapperId).data("chat");
                chat.clear();
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
                var divDialog = document.getElementById(wrapperId);
                divDialog.id = wrapperId;
                divDialog.setAttribute("data-role", "chat");
                divDialog.setAttribute("data-readonly", "true");
                divDialog.style.maxHeight = "500px";
                var noteLink = KC.Tools.LoreService.getUri_NoteLink(dataUri);
                const btnNote = this.createLinkButton_Note(noteLink);
                var authorLink = KC.Tools.LoreService.getUri_Author_FromNoteLink(noteLink);
                const btnAuthor = this.createLinkButton_Author(authorLink);
                const ctxInit = this;
                const btnRefresh = document.createElement("button");
                btnRefresh.classList.add("button", "light");
                btnRefresh.style.lineHeight = "100%";
                btnRefresh.innerHTML = '<span class="mif-refresh"></span>';
                btnRefresh.onclick = (ev) => {
                    ctxInit.runChatFlow(wrapperId, data);
                };
                const divSettings = this.createDiv_Settings(btnNote, btnAuthor);
                divSettings.appendChild(btnRefresh);
                wrapper.innerHTML = "";
                wrapper.appendChild(divDialog);
                wrapper.appendChild(divSettings);
            }
            renderCard(wrapperId, dataUri) {
                let ctx = this;
                LoreCard.api.getNoteByURL(dataUri, (data) => {
                    KC.Tools.LoreService.fitDialog(data);
                    ctx.initCard(dataUri, data, wrapperId);
                });
            }
        }
        Modules.DialogCard = DialogCard;
        function DialogCardPlugin() {
            const { Editor } = toastui;
            var module_LoreCard_Dialog = new DialogCard();
            Editor.codeBlockManager.setReplacer(module_LoreCard_Dialog.ModuleName, function (data) {
                var dataUri = module_LoreCard_Dialog.getDataUri(data);
                if (dataUri.length === 0 || dataUri.indexOf("http") < 0) {
                    return "<p class='fg-red'>Invalid format for data uri</p>";
                }
                var uriHash = KC.Tools.CommonUtitlity.ComputeHash(dataUri);
                var wrapperId = "divLoreSection_" + uriHash;
                setTimeout(module_LoreCard_Dialog.renderCard.bind(module_LoreCard_Dialog, wrapperId, dataUri), 0);
                return '<div id="' + wrapperId + '_wrapper">'
                    + '<div id="' + wrapperId + '" class="w-100 h-100 border bd-default bg-white" style="min-height: 520px; min-width: 500px;"></div>'
                    + '</div>';
            });
        }
        Modules.DialogCardPlugin = DialogCardPlugin;
    })(Modules = FEF.Modules || (FEF.Modules = {}));
})(FEF || (FEF = {}));
var FEF;
(function (FEF) {
    var Modules;
    (function (Modules) {
        class ListCard extends Modules.ModuleBase {
            constructor() {
                super("lorecard.list");
            }
            createItem(containerUL, title, description) {
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
        Modules.ListCard = ListCard;
        function ListCardPlugin() {
            const { Editor } = toastui;
            var module_LoreCard_List = new ListCard();
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
        Modules.ListCardPlugin = ListCardPlugin;
    })(Modules = FEF.Modules || (FEF.Modules = {}));
})(FEF || (FEF = {}));
var FEF;
(function (FEF) {
    var Modules;
    (function (Modules) {
        class MindCard extends Modules.ModuleBase {
            constructor() {
                super("lorecard.mind");
                this.CyCache = {};
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
                var divCy = document.getElementById(wrapperId);
                var noteLink = KC.Tools.LoreService.getUri_NoteLink(dataUri);
                const btnNote = this.createLinkButton_Note(noteLink);
                var authorLink = KC.Tools.LoreService.getUri_Author_FromNoteLink(noteLink);
                const btnAuthor = this.createLinkButton_Author(authorLink);
                const divSettings = this.createDiv_Settings(btnNote, btnAuthor);
                wrapper.innerHTML = "";
                wrapper.appendChild(divCy);
                wrapper.appendChild(divSettings);
                var cy = cytoscape({
                    container: divCy,
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
                    var cy = ctx.initCytoscape(dataUri, data, wrapperId);
                });
            }
        }
        MindCard.cyStyles = [
            {
                selector: "node",
                style: {
                    "text-wrap": "wrap",
                    "text-max-width": "200px",
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
                selector: "edge",
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
        Modules.MindCard = MindCard;
        function MindCardPlugin() {
            const { Editor } = toastui;
            var module_LoreCard_Mind = new MindCard();
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
        Modules.MindCardPlugin = MindCardPlugin;
    })(Modules = FEF.Modules || (FEF.Modules = {}));
})(FEF || (FEF = {}));
var FEF;
(function (FEF) {
    var Modules;
    (function (Modules) {
        class SectionCard extends Modules.ModuleBase {
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
                var divEditor = document.createElement("div");
                divEditor.id = "viewer_" + side + "_" + wrapperId;
                divEditor.style.height = "360px";
                divEditor.style.overflowY = "auto";
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
                var divSection = document.getElementById(wrapperId);
                divSection.classList.add("flip-card", "effect-on-active");
                divSection.style.width = "360px";
                divSection.style.height = "520px";
                var divFront = this.createCardSide(wrapperId, "front", data.title);
                var divBack = this.createCardSide(wrapperId, "back", data.title);
                divSection.appendChild(divFront);
                divSection.appendChild(divBack);
                var noteLink = KC.Tools.LoreService.getUri_NoteLink(dataUri);
                const btnNote = this.createLinkButton_Note(noteLink);
                var authorLink = KC.Tools.LoreService.getUri_Author_FromNoteLink(noteLink);
                const btnAuthor = this.createLinkButton_Author(authorLink);
                const divSettings = this.createDiv_Settings(btnNote, btnAuthor);
                wrapper.innerHTML = "";
                wrapper.appendChild(divSection);
                wrapper.appendChild(divSettings);
                setTimeout(() => {
                    const viewerFront = FEF.Tools.UIHelper.createTuiViewerUsingFactory('viewer_front_' + wrapperId, "", data.front ? data.front.content : "");
                    const viewerBack = FEF.Tools.UIHelper.createTuiViewerUsingFactory('viewer_back_' + wrapperId, "", data.back ? data.back.content : "");
                }, 100);
            }
            renderCard(wrapperId, dataUri) {
                let ctx = this;
                LoreCard.api.getNoteByURL(dataUri, (data) => {
                    ctx.initCard(dataUri, data, wrapperId);
                });
            }
        }
        Modules.SectionCard = SectionCard;
        function SectionCardPlugin() {
            const { Editor } = toastui;
            var module_LoreCard_Section = new SectionCard();
            Editor.codeBlockManager.setReplacer(module_LoreCard_Section.ModuleName, function (data) {
                var dataUri = module_LoreCard_Section.getDataUri(data);
                if (dataUri.length === 0 || dataUri.indexOf("http") < 0) {
                    return "<p class='fg-red'>Invalid format for data uri</p>";
                }
                var uriHash = KC.Tools.CommonUtitlity.ComputeHash(dataUri);
                var wrapperId = "divLoreSection_" + uriHash;
                setTimeout(module_LoreCard_Section.renderCard.bind(module_LoreCard_Section, wrapperId, dataUri), 0);
                return '<div id="' + wrapperId + '_wrapper">'
                    + '<div id="' + wrapperId + '" class="w-100 h-100 border bd-default bg-white" style="min-height: 520px; min-width: 500px;"></div>'
                    + '</div>';
            });
        }
        Modules.SectionCardPlugin = SectionCardPlugin;
    })(Modules = FEF.Modules || (FEF.Modules = {}));
})(FEF || (FEF = {}));
var FEF;
(function (FEF) {
    var Tools;
    (function (Tools) {
        class UIHelper {
            static ShowCharm(id) {
                var charm = $("#" + id).data("charms");
                charm.open();
            }
            static HideCharm(id) {
                var charm = $("#" + id).data("charms");
                charm.close();
            }
            static ShowOrHideCharm(id, canClose) {
                var charm = $("#" + id).data("charms");
                if (charm.element.data("opened") === true && canClose === true) {
                    charm.close();
                }
                else {
                    charm.open();
                }
            }
            static disableElement(id) {
                $("#" + id).attr('disabled', "true");
            }
            static enableElement(id) {
                $("#" + id).attr('disabled', "false");
            }
            static ShowMessage(title, message) {
                Metro.notify.create(message, title, {
                    cls: "info"
                });
            }
            static ShowError(title, error) {
                Metro.notify.create(error, title, {
                    cls: "alert"
                });
            }
            static ToastError(msg) {
                var toast = Metro.toast.create;
                toast(msg, null, 5000, "bg-red fg-white");
            }
            static ToastMessage(msg) {
                var toast = Metro.toast.create;
                toast(msg, null, 5000, "bg-green fg-white");
            }
            static LaunchFullScreen(element) {
                if (element.requestFullscreen) {
                    element.requestFullscreen();
                }
                else if (element.mozRequestFullScreen) {
                    element.mozRequestFullScreen();
                }
                else if (element.webkitRequestFullscreen) {
                    element.webkitRequestFullscreen();
                }
                else if (element.msRequestFullscreen) {
                    element.msRequestFullscreen();
                }
            }
            static SetupFullScreen(element, callbackFullScreenChange) {
                if (element.addEventListener) {
                    element.addEventListener('webkitfullscreenchange', () => {
                        if (callbackFullScreenChange) {
                            callbackFullScreenChange();
                        }
                    }, false);
                    element.addEventListener('mozfullscreenchange', () => {
                        if (callbackFullScreenChange) {
                            callbackFullScreenChange();
                        }
                    }, false);
                    element.addEventListener('fullscreenchange', () => {
                        if (callbackFullScreenChange) {
                            callbackFullScreenChange();
                        }
                    }, false);
                    element.addEventListener('MSFullscreenChange', () => {
                        if (callbackFullScreenChange) {
                            callbackFullScreenChange();
                        }
                    }, false);
                }
            }
            static getIcon(noteType) {
                var icon = "mif-embed2";
                switch (noteType) {
                    case KC.Models.ModelData.Type_Document:
                        icon = 'mif-file-code';
                        break;
                    case KC.Models.ModelData.Type_Mind:
                        icon = 'mif-share';
                        break;
                    case KC.Models.ModelData.Type_Section:
                        icon = 'mif-book-reference';
                        break;
                    case KC.Models.ModelData.Type_Dialog:
                        icon = 'mif-chat-bubble-outline';
                        break;
                    case KC.Models.ModelData.Type_XY:
                        icon = 'mif-windows';
                        break;
                    case KC.Models.ModelData.Type_5W2H1E:
                        icon = 'mif-dashboard';
                        break;
                    case KC.Models.ModelData.Type_Topic:
                        icon = 'mif-folder-special2';
                        break;
                    case KC.Models.ModelData.Type_LanguagePack:
                        icon = 'mif-language';
                        break;
                    case KC.Models.ModelData.ItemType_vocabulary:
                        icon = 'mif-language';
                        break;
                    default:
                        icon = 'mif-embed2';
                        break;
                }
                return icon;
            }
            static createTuiViewerUsingFactory(elementId, height, defaultContent) {
                const Viewer = toastui.Editor;
                const { chart, codeSyntaxHighlight, colorSyntax, tableMergedCell, uml } = Viewer.plugin;
                const chartOptions = {
                    minWidth: 100,
                    maxWidth: 600,
                    minHeight: 100,
                    maxHeight: 300
                };
                const viewer = Viewer.factory({
                    el: document.querySelector('#' + elementId),
                    height: typeof height === "undefined" || height.length <= 4 ? '400px' : height,
                    initialValue: defaultContent,
                    viewer: true,
                    usageStatistics: false,
                    plugins: [[chart, chartOptions], codeSyntaxHighlight, tableMergedCell, uml]
                });
                return viewer;
            }
        }
        Tools.UIHelper = UIHelper;
    })(Tools = FEF.Tools || (FEF.Tools = {}));
})(FEF || (FEF = {}));
var KC;
(function (KC) {
    var Models;
    (function (Models) {
        class ModelData {
        }
        ModelData.Type_Document = "document";
        ModelData.Type_Article = "article";
        ModelData.Type_Couplet = "couplet";
        ModelData.Type_Dialog = "dialog";
        ModelData.Type_Section = "section";
        ModelData.Type_List = "list";
        ModelData.Type_Tree = "tree";
        ModelData.Type_Mind = "mind";
        ModelData.Type_XY = "xy";
        ModelData.Type_5W2H1E = "5w2h1e";
        ModelData.Type_Topic = "topic";
        ModelData.Type_LanguagePack = "language-pack";
        ModelData.Type_MathPack = "math-pack";
        ModelData.Type_HistoryPack = "history-pack";
        ModelData.ItemType_vocabulary = "language:vocabulary";
        Models.ModelData = ModelData;
    })(Models = KC.Models || (KC.Models = {}));
})(KC || (KC = {}));
var KC;
(function (KC) {
    var Tools;
    (function (Tools) {
        class CommonUtitlity {
            static ComputeHash(str) {
                var hash = 0;
                if (str.length === 0) {
                    return hash;
                }
                for (var i = 0; i < str.length; i++) {
                    var char = str.charCodeAt(i);
                    hash = ((hash << 5) - hash) + char;
                    hash = hash & hash;
                }
                return hash;
            }
        }
        Tools.CommonUtitlity = CommonUtitlity;
    })(Tools = KC.Tools || (KC.Tools = {}));
})(KC || (KC = {}));
var KC;
(function (KC) {
    var Tools;
    (function (Tools) {
        class StringUtility {
            static EscapeSpecialChars(str) {
                return str.replace(/\\n/g, "\\n")
                    .replace(/\\'/g, "\\'")
                    .replace(/\\"/g, '\\"')
                    .replace(/\\&/g, "\\&")
                    .replace(/\\r/g, "\\r")
                    .replace(/\\t/g, "\\t")
                    .replace(/\\b/g, "\\b")
                    .replace(/\\f/g, "\\f");
            }
        }
        Tools.StringUtility = StringUtility;
    })(Tools = KC.Tools || (KC.Tools = {}));
})(KC || (KC = {}));
//# sourceMappingURL=lore-editor-tui.editor.js.map