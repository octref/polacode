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
  vscode.commands.registerCommand('_polacode.shutter', serializedBlob => {
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
        vscode.commands.executeCommand('_workbench.htmlPreview.postMessage', indexUri, {
          type: 'initFontFamily',
          fontFamily
        })
      })
  })
}
