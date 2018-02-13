function ab2str(buf) {
  return String.fromCharCode.apply(null, new Uint16Array(buf));
}
function str2ab(str) {
  var buf = new ArrayBuffer(str.length*2); // 2 bytes for each char
  var bufView = new Uint16Array(buf);
  for (var i=0, strLen=str.length; i < strLen; i++) {
    bufView[i] = str.charCodeAt(i);
  }
  return buf;
}

document.addEventListener('paste', function (e) {
	let node = document.getElementById('result');
	document.getElementById('result').style.display = 'block';
	node.innerHTML = e.clipboardData.getData('text/html');
	domtoimage.toBlob(document.getElementById('output-container')).then(blob => {
		console.log(blob);
		var arrayBuffer;
		var fileReader = new FileReader();
		fileReader.onload = function() {
			arrayBuffer = this.result;
			var bytes = new Uint8Array(arrayBuffer);
			console.log(bytes);
			let ret = [];
			for (let i = 0; i < bytes.length; i++) {
				ret.push(bytes[i]);
			}
			
			console.log(ret.join(','));
		};
		fileReader.readAsArrayBuffer(blob);

	});
	// domtoimage.toSvg(node, {
	// 		quality: 1.0
	// 	})
	// 	.then(function (dataUrl) {
	// 		document.getElementById('output').src = dataUrl;
	// 		document.getElementById('result').style.display = 'none';
	// 	})
	// 	.catch(function (error) {
	// 		console.error('oops, something went wrong!', error);
	// 	});
});