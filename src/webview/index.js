const snippetNode = document.getElementById('snippet')
const snippetContainerNode = document.getElementById('snippet-container')
const obturateur = document.getElementById('save')

const getInitialHtml = fontFamily => {
  const cameraWithFlashEmoji = String.fromCodePoint(128248)
  const monoFontStack = `${fontFamily},SFMono-Regular,Consolas,DejaVu Sans Mono,Ubuntu Mono,Liberation Mono,Menlo,Courier,monospace`
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
      data: `command:polacode.shoot?${encodeURIComponent(JSON.stringify(args))}`
    },
    'file://'
  )
}

function updateEnvironment(pastedHtml) {
  const bgColor = pastedHtml.match(/background-color: (#[a-fA-F0-9]+)/)[1]

  // update snippet bg color
  document.getElementById('snippet').style.backgroundColor = bgColor

  // update backdrop color
}

function getMinIndent(code) {
  const arr = code.split('\n')

  let minIndentCount = Number.MAX_VALUE
  for (let i = 0; i < arr.length; i++) {
    const wsCount = arr[i].search(/\S/)
    if (wsCount !== -1) {
      if (wsCount < minIndentCount) {
        minIndentCount = wsCount
      }
    }
  }

  return minIndentCount
}

function stripInitialIndent(html, indent) {
  const doc = new DOMParser().parseFromString(html, 'text/html')
  const initialSpans = doc.querySelectorAll('div > div span:first-child')
  for (let i = 0; i < initialSpans.length; i++) {
    initialSpans[i].innerText = initialSpans[i].innerText.slice(indent)
  }
  return doc.body.innerHTML
}

document.addEventListener('paste', e => {
  const code = e.clipboardData.getData('text/plain')
  const minIndent = getMinIndent(code)

  const innerHTML = e.clipboardData.getData('text/html')

  updateEnvironment(innerHTML)

  if (minIndent !== 0) {
    snippetNode.innerHTML = stripInitialIndent(innerHTML, minIndent)
  } else {
    snippetNode.innerHTML = innerHTML
  }
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

window.addEventListener('message', e => {
  if (e) {
    if (e.data.type === 'initFontFamily') {
      const fontFamily = e.data.fontFamily
      const initialHtml = getInitialHtml(fontFamily)
      snippetNode.innerHTML = getInitialHtml(fontFamily)
      updateEnvironment(initialHtml)
      snippetContainerNode.style.opacity = 1
    }
  }
})
