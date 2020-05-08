"use strict";

class LoreEditor {
    editor: any;
    toolbar: any;

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