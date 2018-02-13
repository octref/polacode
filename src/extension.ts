'use strict'
// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode'
import * as path from 'path';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
	const htmlPath = path.resolve(context.extensionPath, 'src/index.html');

	vscode.commands.registerCommand('extension.saveImage', e => {})

  vscode.commands.registerCommand('extension.sayHello', () => {
    vscode.commands.executeCommand(
      'vscode.previewHtml',
      vscode.Uri.file(htmlPath),
      2,
      'Clipboard',
      {
        allowScripts: true
      }
    )
  })
}

// this method is called when your extension is deactivated
export function deactivate() {}
