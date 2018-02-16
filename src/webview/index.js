const snippetNode = document.getElementById('snippet')
const snippetContainerNode = document.getElementById('snippet-container')
const obturateur = document.getElementById('save')

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
      data: `command:_polacode.shutter?${encodeURIComponent(JSON.stringify(args))}`
    },
    'file://'
  )
}

function updateSnippetBgColor(pastedHtml) {
  const doc = new DOMParser().parseFromString(pastedHtml, 'text/html');
  const bgColor = doc.querySelector('div').style.backgroundColor

  document.getElementById('snippet').style.backgroundColor = bgColor
}

document.addEventListener('paste', e => {
  const innerHTML = e.clipboardData.getData('text/html')

  updateSnippetBgColor(innerHTML)

  snippetNode.innerHTML = innerHTML
})

obturateur.addEventListener('click', () => {
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

let isInAnimation = false

obturateur.addEventListener('mouseover', () => {
  if (!isInAnimation) {
    isInAnimation = true

    new Vivus(
      'save',
      {
        duration: 40,
        onReady: () => {
          obturateur.classList = 'obturateur filling'
        }
      },
      () => {
        setTimeout(() => {
          isInAnimation = false
          obturateur.classList = 'obturateur'
        }, 700)
      }
    )
  }
})
