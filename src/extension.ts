// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const disposable = vscode.commands.registerCommand('dollarsensejs.expandDollar', () => {
		const editor = vscode.window.activeTextEditor;
		if (!editor) return;

		const document = editor.document;
		const position = editor.selection.active;

		// Get text up to the cursor
		const textUpToCursor = document.getText(new vscode.Range(new vscode.Position(0, 0), position));
		const backtickCount = (textUpToCursor.match(/`/g) || []).length;

		// Determine whether it is in a template literal
		// Remain 1 = inside (true), Remain 0 = outside (false)
		const insideTemplate = backtickCount % 2 === 1;

		if (insideTemplate) {
			editor.edit(editBuilder => {
				editBuilder.insert(position, '${}');
			}).then(() => {
				const newPosition = position.translate(0, 2);
				editor.selection = new vscode.Selection(newPosition, newPosition);
			});
		} else {
			editor.edit(editBuilder => {
				editBuilder.insert(position, '$');
			});
		}
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
export function deactivate() {}
