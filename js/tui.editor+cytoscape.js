var editor = new tui.Editor({
    el: document.querySelector('#editorContainer'),
    initialEditType: 'markdown',
    previewStyle: 'vertical',
    height: '500px',
    exts: ['scrollSync', 'cytoscape']
});
editor.setMarkdown(`
\`\`\`cytoscape
data: https://raw.githubusercontent.com/taurenshaman/taurenshaman.github.io/master/data/cytoscape-0.json
layout: grid
\`\`\`
`);