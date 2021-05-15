// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
var variable = require('./variable');

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {
	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('php-docblock-generator.createDocBlock', async function () {
		// The code you place here will be executed every time your command is executed
		var lang = vscode.window.activeTextEditor.document.languageId;
		if (lang == "php") {
			var selection = vscode.window.activeTextEditor.selection;
			var startLine = selection.start.line;
			var selectedText = vscode.window.activeTextEditor.document.lineAt(startLine).text;

			var textToInsert = '';
			if (/\$([\w_-]+)/.exec(selectedText) != null) {
				textToInsert = await variable.comment(selectedText);
			} else {
				vscode.window.showInformationMessage('Please select a PHP signature');
				return;
			}

			vscode.window.activeTextEditor.edit(function (editBuilder) {
				startLine--;
				if (startLine < 0) {
					startLine = 0;
					textToInsert = textToInsert + '\n';
				}

				var lastCharIndex = vscode.window.activeTextEditor.document.lineAt(startLine).text.length;
				var pos;

				if ((lastCharIndex > 0) && (startLine != 0)) {
					pos = new vscode.Position(startLine, lastCharIndex);
				} else {
					pos = new vscode.Position(startLine, 0);
				}

				textToInsert = '\n' + textToInsert;

				var line = vscode.window.activeTextEditor.document.lineAt(selection.start.line).text;
				var firstNonWhiteSpace = vscode.window.activeTextEditor.document.lineAt(selection.start.line).firstNonWhitespaceCharacterIndex;
				var stringToIndent = '';
				for (var i = 0; i < firstNonWhiteSpace; i++) {
					if (line.charAt(i) == '\t') {
						stringToIndent = stringToIndent + '\t';
					} else if (line.charAt(i) == ' ') {
						stringToIndent = stringToIndent + ' ';
					}
				}
				textToInsert = textToInsert.replace(/^/gm, stringToIndent);
				editBuilder.insert(pos, textToInsert);
			}).then(function () {
			});
		}
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
