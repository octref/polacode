import * as vscode from 'vscode'
import * as path from 'path'
import { writeFileSync } from 'fs'
import { homedir } from 'os'

const writeSerializedBlobToFile = (serializeBlob, fileName) => {
  const bytes = new Uint8Array(serializeBlob.split(','))
  writeFileSync(fileName, new Buffer(bytes))
}

export function activate(context: vscode.ExtensionContext) {
  const htmlPath = path.resolve(context.extensionPath, 'src/index.html')

  vscode.commands.registerCommand('_extension.saveImage', serializedBlob => {
    vscode.window
      .showSaveDialog({
        defaultUri: vscode.Uri.file(path.resolve(homedir(), 'Desktop/codesnap.png')),
        filters: {
          'Images': ['png']
        }
      })
      .then(uri => {
        writeSerializedBlobToFile(serializedBlob, uri.path)
      })
  })

  vscode.commands.registerCommand('extension.sayHello', () => {
    vscode.commands.executeCommand('vscode.previewHtml', vscode.Uri.file(htmlPath), 2, 'Clipboard', {
      allowScripts: true
    })
  })
}
