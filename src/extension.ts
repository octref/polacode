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

  vscode.commands.registerCommand('_polacode.shutter', serializedBlob => {
    vscode.window
      .showSaveDialog({
        defaultUri: vscode.Uri.file(path.resolve(homedir(), 'Desktop/shot.png')),
        filters: {
          'Images': ['png']
        }
      })
      .then(uri => {
        if (uri) {
          writeSerializedBlobToFile(serializedBlob, uri.fsPath)
        }
      })
  })

  vscode.commands.registerCommand('polacode.activate', () => {
    vscode.commands.executeCommand('vscode.previewHtml', vscode.Uri.file(htmlPath), 2, 'Polacode 📸', {
      allowScripts: true
    })
  })
}
