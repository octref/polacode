const snippetNode = document.getElementById('snippet')
const snippetContainerNode = document.getElementById('snippet-container')
const obturateur = document.getElementById('save')

const getInitialHtml = (fontFamily) => {
  const cameraWithFlashEmoji = String.fromCodePoint(128248)
  const monoFontStack = `${fontFamily},SFMono-Regular,Consolas,DejaVu Sans Mono,Ubuntu Mono,Liberation Mono,Menlo,Courier,monospace`;
  return `<meta charset="utf-8"><div style="color: #d8dee9;background-color: #2e3440; font-family: ${monoFontStack};font-weight: normal;font-size: 12px;line-height: 18px;white-space: pre;"><div><span style="color: #8fbcbb;">console</span><span style="color: #eceff4;">.</span><span style="color: #88c0d0;">log</span><span style="color: #d8dee9;">(</span><span style="color: #eceff4;">'</span><span style="color: #a3be8c;">0. Run command \`Polacode ${cameraWithFlashEmoji}\`</span><span style="color: #eceff4;">'</span><span style="color: #d8dee9;">)</span></div><div><span style="color: #8fbcbb;">console</span><span style="color: #eceff4;">.</span><span style="color: #88c0d0;">log</span><span style="color: #d8dee9;">(</span><span style="color: #eceff4;">'</span><span style="color: #a3be8c;">1. Copy some code</span><span style="color: #eceff4;">'</span><span style="color: #d8dee9;">)</span></div><div><span style="color: #8fbcbb;">console</span><span style="color: #eceff4;">.</span><span style="color: #88c0d0;">log</span><span style="color: #d8dee9;">(</span><span style="color: #eceff4;">'</span><span style="color: #a3be8c;">2. Paste into Polacode view</span><span style="color: #eceff4;">'</span><span style="color: #d8dee9;">)</span></div><div><span style="color: #8fbcbb;">console</span><span style="color: #eceff4;">.</span><span style="color: #88c0d0;">log</span><span style="color: #d8dee9;">(</span><span style="color: #eceff4;">'</span><span style="color: #a3be8c;">3. Click the button ${cameraWithFlashEmoji}</span><span style="color: #eceff4;">'</span><span style="color: #d8dee9;">)</span></div></div></div>`
}

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

window.addEventListener('message', (e) => {
  if (e) {
    if (e.data.type === 'initFontFamily') {
      const fontFamily = e.data.fontFamily
      const initialHtml = getInitialHtml(fontFamily)
      snippetNode.innerHTML = getInitialHtml(fontFamily)
      updateSnippetBgColor(initialHtml)
      snippetContainerNode.style.opacity = 1
    }
  }
})

