"use strict";

class LoreEditor{
    editor: any;
    toolbar: any;

    constructor(editor){
        this.editor = editor;
        this.toolbar = this.editor.getUI().getToolbar();
        this.init();
    }
    
    addToolbarCommand_Dialog(){
        this.editor.eventManager.addEventType('Event_LoreCard_Dialog');
        var ctxATC_Dialog = this;
        this.editor.eventManager.listen('Event_LoreCard_Dialog', function() {
            var markdownMode = ctxATC_Dialog.editor.isMarkdownMode();
            if(markdownMode === false)
                return;
            var content = [
                '',
                '```' + 'lorecard.' + KC.Models.ModelData.Type_Dialog,
                'data: ',
                '```',
                ''
              ].join('\n');
            ctxATC_Dialog.editor.insertText(content);
        });

        this.toolbar.addButton({
            name: 'cmdDialog',
            className: 'fa fa-accessible-icon',
            event: 'Event_LoreCard_Dialog',
            tooltip: 'lore:> dialog',
            $el: $('<div class="custom-button"><i class="icon mif-chat-bubble-outline fg-orange"></i></div>') // fa fa-comments-o
        }, 1);
    }

    addToolbarCommand_Mind(){
        this.editor.eventManager.addEventType('Event_LoreCard_Mind');
        var ctxATC_Mind = this;
        this.editor.eventManager.listen('Event_LoreCard_Mind', function() {
            var markdownMode = ctxATC_Mind.editor.isMarkdownMode();
            if(markdownMode === false)
                return;
            var content = [
                '',
                '```' + 'lorecard.' + KC.Models.ModelData.Type_Mind,
                'data: ',
                '```',
                ''
              ].join('\n');
            ctxATC_Mind.editor.insertText(content);
        });

        this.toolbar.addButton({
            name: 'cmdMind',
            className: 'fa fa-accessible-icon',
            event: 'Event_LoreCard_Mind',
            tooltip: 'lore:> mind',
            $el: $('<div class="custom-button"><i class="icon mif-share fg-orange"></i></div>') // fa fa-share-alt
        }, 1);
    }

    addToolbarCommand_Section(){
        this.editor.eventManager.addEventType('Event_LoreCard_Section');
        var ctxATC_Section = this;
        this.editor.eventManager.listen('Event_LoreCard_Section', function() {
            var markdownMode = ctxATC_Section.editor.isMarkdownMode();
            if(markdownMode === false)
                return;
            var content = [
                '',
                '```' + 'lorecard.' + KC.Models.ModelData.Type_Section,
                'data: ',
                '```',
                ''
              ].join('\n');
            ctxATC_Section.editor.insertText(content);
        });

        this.toolbar.addButton({
            name: 'cmdSection',
            className: 'fa fa-accessible-icon',
            event: 'Event_LoreCard_Section',
            tooltip: 'lore:> section',
            $el: $('<div class="custom-button"><i class="icon mif-book-reference fg-orange"></i></div>') // fa fa-file-text-o
        }, 1);
    }

    addToolbarCommand_List() {
        this.editor.eventManager.addEventType('Event_LoreCard_List');
        var ctxATC_Section = this;
        this.editor.eventManager.listen('Event_LoreCard_List', function () {
            var markdownMode = ctxATC_Section.editor.isMarkdownMode();
            if (markdownMode === false)
                return;
            var content = [
                '',
                '```' + 'lorecard.' + KC.Models.ModelData.Type_List,
                'data: ',
                '```',
                ''
            ].join('\n');
            ctxATC_Section.editor.insertText(content);
        });

        this.toolbar.addButton({
            name: 'cmdSection',
            className: 'fa fa-accessible-icon',
            event: 'Event_LoreCard_List',
            tooltip: 'lore:> list',
            $el: $('<div class="custom-button"><i class="icon mif-list-numbered fg-orange"></i></div>') // fa fa-file-text-o
        }, 1);
    }

    init(){
        this.addToolbarCommand_Dialog();
        this.addToolbarCommand_Mind();
        this.addToolbarCommand_Section();
        this.addToolbarCommand_List();
    }
}