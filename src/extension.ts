import * as vscode from 'vscode'
import * as path from 'path'
import { writeFileSync } from 'fs'
import { homedir } from 'os'

const writeSerializedBlobToFile = (serializeBlob, fileName) => {
  const bytes = new Uint8Array(serializeBlob.split(','))
  writeFileSync(fileName, new Buffer(bytes))
}

export function activate(context: vscode.ExtensionContext) {
  const htmlPath = path.resolve(context.extensionPath, 'src/webview/index.html')
  const indexUri = vscode.Uri.file(htmlPath)

  let lastUsedImageUri = vscode.Uri.file(path.resolve(homedir(), 'Desktop/code.png'))
  vscode.commands.registerCommand('polacode.shoot', serializedBlob => {
    vscode.window
      .showSaveDialog({
        defaultUri: lastUsedImageUri,
        filters: {
          Images: ['png']
        }
      })
      .then(uri => {
        if (uri) {
          writeSerializedBlobToFile(serializedBlob, uri.fsPath)
          lastUsedImageUri = uri
        }
      })
  })

  vscode.commands.registerCommand('polacode.activate', () => {
    vscode.commands
      .executeCommand('vscode.previewHtml', indexUri, 2, 'Polacode 📸', {
        allowScripts: true
      })
      .then(() => {
        const fontFamily = vscode.workspace.getConfiguration('editor').fontFamily
        const bgColor = context.globalState.get('polacode.bgColor', '#2e3440')
        vscode.commands.executeCommand('_workbench.htmlPreview.postMessage', indexUri, {
          type: 'init',
          fontFamily,
          bgColor
        })
      })
  })

  vscode.commands.registerCommand('polacode._onmessage', ({ type, data }) => {
    if (type === 'updateBgColor') {
      context.globalState.update('polacode.bgColor', data.bgColor)
    } else if (type === 'invalidPasteContent') {
      vscode.window.showInformationMessage('Pasted content is invalid. Only copy from VS Code and check if your shortcuts for copy/paste have conflicts.')
    }
  })
}
