const vscode = require('vscode');
const variable = require('./signature/variable');

class Generator {
  async createDocBlock() {
    const lang = vscode.window.activeTextEditor.document.languageId;
    if (lang == "php") {
      let selection = vscode.window.activeTextEditor.selection;
      let startLine = selection.start.line;
      let selectedText = vscode.window.activeTextEditor.document.lineAt(startLine).text;

      let textToInsert = '';
      if (/\$([\w_-]+)/.exec(selectedText) != null) {
        textToInsert = await variable.comment(selectedText);
      } else {
        vscode.window.showInformationMessage('Please select a PHP signature');
        return;
      }
      this.insertDocBlock(selection, textToInsert)
    }
  }

  insertDocBlock(selection, textToInsert) {
    let startLine = selection.start.line;

    vscode.window.activeTextEditor.edit(function (editBuilder) {
      startLine--;
      if (startLine < 0) {
        startLine = 0;
        textToInsert = textToInsert + '\n';
      }

      let lastCharIndex = vscode.window.activeTextEditor.document.lineAt(startLine).text.length;
      let pos;

      if ((lastCharIndex > 0) && (startLine != 0)) {
        pos = new vscode.Position(startLine, lastCharIndex);
      } else {
        pos = new vscode.Position(startLine, 0);
      }

      textToInsert = '\n' + textToInsert;

      let line = vscode.window.activeTextEditor.document.lineAt(selection.start.line).text;
      let firstNonWhiteSpace = vscode.window.activeTextEditor.document.lineAt(selection.start.line).firstNonWhitespaceCharacterIndex;
      let stringToIndent = '';
      for (let i = 0; i < firstNonWhiteSpace; i++) {
        if (line.charAt(i) == '\t') {
          stringToIndent = stringToIndent + '\t';
        } else if (line.charAt(i) == ' ') {
          stringToIndent = stringToIndent + ' ';
        }
      }
      textToInsert = textToInsert.replace(/^/gm, stringToIndent);
      editBuilder.insert(pos, textToInsert);
    });
  }
}

module.exports = Generator;
