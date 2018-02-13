const snippetNode = document.getElementById('snippet')
const snippetContainerNode = document.getElementById('snippet-container')

const serializeBlob = (blob, cb) => {
  const fileReader = new FileReader()

  fileReader.onload = () => {
    const bytes = new Uint8Array(fileReader.result)
    cb(Array.from(bytes).join(','))
  }

  fileReader.readAsArrayBuffer(blob)
}

document.addEventListener('paste', function(e) {
  const innerHTML = e.clipboardData.getData('text/html')
  snippetNode.innerHTML = innerHTML

  domtoimage.toBlob(snippetContainerNode).then(blob => {
    serializeBlob(blob, s => {
      console.log(s)
    })
  })
})
