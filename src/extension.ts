import * as vscode from 'vscode'
import * as path from 'path'
import { writeFileSync } from 'fs'

const writeSerializedBlobToFile = (serializeBlob, fileName) => {
  const bytes = new Uint8Array(serializeBlob.split(','))
  writeFileSync(fileName, new Buffer(bytes))
}

export function activate(context: vscode.ExtensionContext) {
  const htmlPath = path.resolve(context.extensionPath, 'src/index.html')
  const outImagePath = path.resolve(context.extensionPath, 'out.png')

  vscode.commands.registerCommand('_extension.saveImage', serializedBlob => {
    writeSerializedBlobToFile(serializedBlob, outImagePath)
  })

  vscode.commands.registerCommand('extension.sayHello', () => {
    vscode.commands.executeCommand('vscode.previewHtml', vscode.Uri.file(htmlPath), 2, 'Clipboard', {
      allowScripts: true
    })
  })
}
