;(function() {
  const vscode = acquireVsCodeApi()

  let target = 'container'
  let transparentBackground = false
  let backgroundColor = '#f2f2f2'

  vscode.postMessage({
    type: 'getAndUpdateCacheAndSettings'
  })

  const snippetNode = document.getElementById('snippet')
  const snippetContainerNode = document.getElementById('snippet-container')
  const obturateur = document.getElementById('save')

  snippetContainerNode.style.opacity = '1'
  const oldState = vscode.getState();
  if (oldState && oldState.innerHTML) {
    snippetNode.innerHTML = oldState.innerHTML
  }

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
    function getBrightness(color) {
      const rgb = this.toRgb()
      return (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000
    }

    fileReader.readAsArrayBuffer(blob)
  }

  function shoot(serializedBlob) {
    vscode.postMessage({
      type: 'shoot',
      data: {
        serializedBlob
      }
    })
  }

  function getBrightness(hexColor) {
    const rgb = parseInt(hexColor.slice(1), 16)
    const r = (rgb >> 16) & 0xff
    const g = (rgb >> 8) & 0xff
    const b = (rgb >> 0) & 0xff
    return (r * 299 + g * 587 + b * 114) / 1000
  }
  function isDark(hexColor) {
    return getBrightness(hexColor) < 128
  }
  function getSnippetBgColor(html) {
    const match = html.match(/background-color: (#[a-fA-F0-9]+)/)
    return match ? match[1] : undefined;
  }

  function updateEnvironment(snippetBgColor) {
    // update snippet bg color
    document.getElementById('snippet').style.backgroundColor = snippetBgColor

    // update backdrop color
    if (isDark(snippetBgColor)) {
      snippetContainerNode.style.backgroundColor = '#f2f2f2'
    } else {
      snippetContainerNode.style.background = 'none'
    }
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
      initialSpans[i].textContent = initialSpans[i].textContent.slice(indent)
    }
    return doc.body.innerHTML
  }

  document.addEventListener('paste', e => {
    const innerHTML = e.clipboardData.getData('text/html')

    const code = e.clipboardData.getData('text/plain')
    const minIndent = getMinIndent(code)

    const snippetBgColor = getSnippetBgColor(innerHTML)
    if (snippetBgColor) {
      vscode.postMessage({
        type: 'updateBgColor',
        data: {
          bgColor: snippetBgColor
        }
      })
      updateEnvironment(snippetBgColor)
    }

    if (minIndent !== 0) {
      snippetNode.innerHTML = stripInitialIndent(innerHTML, minIndent)
    } else {
      snippetNode.innerHTML = innerHTML
    }

    vscode.setState({ innerHTML })
  })

  obturateur.addEventListener('click', () => {
    if (target === 'container') {
      shootAll() 
    } else {
      shootSnippet()
    }
  })

  function shootAll() {
    const width = snippetContainerNode.offsetWidth * 2
    const height = snippetContainerNode.offsetHeight * 2
    const config = {
      width,
      height,
      style: {
        transform: 'scale(2)',
        'transform-origin': 'center',
        background: getRgba(backgroundColor, transparentBackground)
      }
    }

    // Hide resizer before capture
    snippetNode.style.resize = 'none'
    snippetContainerNode.style.resize = 'none'

    domtoimage.toBlob(snippetContainerNode, config).then(blob => {
      snippetNode.style.resize = ''
      snippetContainerNode.style.resize = ''
      serializeBlob(blob, serializedBlob => {
        shoot(serializedBlob)
      })
    })
  }

  function shootSnippet() {
    const width = snippetNode.offsetWidth * 2
    const height = snippetNode.offsetHeight * 2
    const config = {
      width,
      height,
      style: {
        transform: 'scale(2)',
        'transform-origin': 'center',
        padding: 0,
        background: 'none'
      }
    }

    // Hide resizer before capture
    snippetNode.style.resize = 'none'
    snippetContainerNode.style.resize = 'none'

    domtoimage.toBlob(snippetContainerNode, config).then(blob => {
      snippetNode.style.resize = ''
      snippetContainerNode.style.resize = ''
      serializeBlob(blob, serializedBlob => {
        shoot(serializedBlob)
      })
    })
  }

  let isInAnimation = false

  obturateur.addEventListener('mouseover', () => {
    if (!isInAnimation) {
      isInAnimation = true

      new Vivus(
        'save',
        {
          duration: 40,
          onReady: () => {
            obturateur.className = 'obturateur filling'
          }
        },
        () => {
          setTimeout(() => {
            isInAnimation = false
            obturateur.className = 'obturateur'
          }, 700)
        }
      )
    }
  })

  window.addEventListener('message', e => {
    if (e) {
      if (e.data.type === 'init') {
        const { fontFamily, bgColor } = e.data

        const initialHtml = getInitialHtml(fontFamily)
        snippetNode.innerHTML = initialHtml
        vscode.setState({ innerHTML: initialHtml })

        // update backdrop color, using bgColor from last pasted snippet
        // cannot deduce from initialHtml since it's always using Nord color
        if (isDark(bgColor)) {
          snippetContainerNode.style.backgroundColor = '#f2f2f2'
        } else {
          snippetContainerNode.style.background = 'none'
        }

      } else if (e.data.type === 'update') {
        document.execCommand('paste')
      } else if (e.data.type === 'restore') {
        snippetNode.innerHTML = e.data.innerHTML
        updateEnvironment(e.data.bgColor)
      } else if (e.data.type === 'restoreBgColor') {
        updateEnvironment(e.data.bgColor)
      } else if (e.data.type === 'updateSettings') {
        snippetNode.style.boxShadow = e.data.shadow
        target = e.data.target
        transparentBackground = e.data.transparentBackground
        snippetContainerNode.style.backgroundColor = e.data.backgroundColor
        backgroundColor = e.data.backgroundColor
        if (e.data.ligature) {
          snippetNode.style.fontVariantLigatures = 'normal'
        } else {
          snippetNode.style.fontVariantLigatures = 'none'
        }
      }
    }
  })
})()

function getRgba(hex, transparentBackground) {
  const bigint = parseInt(hex.slice(1), 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  const a = transparentBackground ? 0 : 1
  return `rgba(${r}, ${g}, ${b}, ${a})`
}