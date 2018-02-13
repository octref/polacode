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

function postMessage(args) {
  window.parent.postMessage(
    {
      command: 'did-click-link',
      data: `command:_extension.saveImage?${encodeURIComponent(JSON.stringify(args))}`
    },
    'file://'
  )
}

document.addEventListener('paste', function(e) {
  const innerHTML = e.clipboardData.getData('text/html')
  snippetNode.innerHTML = innerHTML

  document.addEventListener('click', (e) => {
    const width = snippetContainerNode.offsetWidth * 2
    const height = snippetContainerNode.offsetHeight * 2
    const config = {
      width,
      height,
      style: {
        transform: 'scale(2)',
        'transform-origin': 'left top'
      }
    }

    domtoimage.toBlob(snippetContainerNode, config).then(blob => {
      serializeBlob(blob, s => {
        postMessage(s)
      })
    })
  })
})
