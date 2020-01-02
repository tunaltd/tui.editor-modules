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
                '```' + 'lorecard.' + ModelData.Type_Dialog,
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
            tooltip: 'LoreCard: Dialog',
            $el: $('<div class="custom-button"><i class="icon mif-chat-bubble-outline"></i></div>') // fa fa-comments-o
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
                '```' + 'lorecard.' + ModelData.Type_Mind,
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
            tooltip: 'LoreCard: Mind',
            $el: $('<div class="custom-button"><i class="icon mif-share"></i></div>') // fa fa-share-alt
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
                '```' + 'lorecard.' + ModelData.Type_Section,
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
            tooltip: 'LoreCard: Section',
            $el: $('<div class="custom-button"><i class="icon mif-book-reference"></i></div>') // fa fa-file-text-o
        }, 1);
    }

    init(){
        this.addToolbarCommand_Dialog();
        this.addToolbarCommand_Mind();
        this.addToolbarCommand_Section();
    }
}