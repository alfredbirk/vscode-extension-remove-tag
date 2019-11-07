// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
// this method is called when your extension is activated
// your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "remove-tag" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.helloWorld', function () {
		// The code you place here will be executed every time your command is executed
		console.log("lol")
		const x = require('@emmetio/html-matcher');
	
		// const content = '<div><a href="http://emmet.io">Example</a></div>';
	
		let editor = vscode.window.activeTextEditor;
		if (!editor) {
			return;
		}
		
		let selection = editor.selection;
		let active = selection.active

		const offset = editor.document.offsetAt(active)

		console.log('active', active);
		console.log('offset', offset);
		// Find tag pair at character 35
		const content = editor.document.getText();
		const tag = x.default(content, offset+1);
	
		console.log('tag', tag)

		const p1 = editor.document.positionAt(tag.open[0])
		const p2 = editor.document.positionAt(tag.open[1])
		const p3 = editor.document.positionAt(tag.close[0])
		const p4 = editor.document.positionAt(tag.close[1])
		
		console.log('p1:', p1);


		const range1 = new vscode.Range(p1,p2);
		const range2 = new vscode.Range(p3,p4);
		console.log('range1:', range1);

		const line1 = editor.document.lineAt(p1.line);
		const line2 = editor.document.lineAt(p3.line);
		console.log('line1:', line1);

		const removeLine1 = line1.firstNonWhitespaceCharacterIndex === p1.character
		const removeLine2 = line2.firstNonWhitespaceCharacterIndex === p3.character

		editor.edit(function x(editBuilder) {
			if (removeLine1) {
				editBuilder.delete(line1.rangeIncludingLineBreak);
			}
			if (removeLine2) {
				editBuilder.delete(line2.rangeIncludingLineBreak);
			}
		})


		const p4Modified = new vscode.Position(p4.line - 2, p4.character)

		const offset1 = editor.document.offsetAt(p1);
		const offset2 = editor.document.offsetAt(p4Modified)

		editor.selection = new vscode.Selection(
			editor.document.positionAt(offset1),
			editor.document.positionAt(offset2)
		);

		vscode.commands.executeCommand("editor.action.formatSelection");

		editor.selection = new vscode.Selection(
			editor.document.positionAt(offset1),
			editor.document.positionAt(offset1)
		);

		// editor.edit(function x(editBuilder) {
		// 	editBuilder.delete(range1)
		// 	editBuilder.delete(range2)
		// })

		// console.log('editor.document.getText()', editor.document.getText());
	
		// Display a message box to the user
		vscode.window.showInformationMessage(tag.name);
	});

	context.subscriptions.push(disposable);
}
exports.activate = activate;

// this method is called when your extension is deactivated
function deactivate() {}

module.exports = {
	activate,
	deactivate
}
