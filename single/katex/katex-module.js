const { Editor } = toastui;

// if you wanna set options of katex, please set to variable: options_katex

function katexReplacer(code) {
    let renderedHTML;

    try {
      if (!katex) {
        throw new Error('katex dependency required');
      }
      if(typeof options_katex === "undefined"){
        options_katex = {
            throwOnError: false
        };
      }
      renderedHTML = katex.renderToString(code, options_katex);
    } catch (err) {
      renderedHTML = `Error occurred on process katex: ${err.message}`;
    }

    return renderedHTML;
}

function katexPlugin() {
  Editor.codeBlockManager.setReplacer('katex', katexReplacer);
}

//katexPlugin();