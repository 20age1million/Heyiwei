function enHeyiwei(str) {
    var result = [];
    for (var _i = 0, str_1 = str; _i < str_1.length; _i++) {
        var char = str_1[_i];
        var code_point = char.charCodeAt(0);
        if (!code_point) {
            continue;
        }
        var bin = code_point.toString(2);
        var replaced = bin
            .split('')
            .map(function (bit) { return (bit === '0' ? '何' : '意'); })
            .join('');
        result.push(replaced);
    }
    return result.join('味');
}
function deHeyiwei(str) {
    for (const char of str) {
        if (char !== '何' && char !== '意' && char !== '味') {
            return '输入包含非何意味字符，无法解码';
        }
    }

    var chars = str.split('味');
    var result = [];
    for (var _i = 0, chars_1 = chars; _i < chars_1.length; _i++) {
        var heyiweiChar = chars_1[_i];
        var bin = heyiweiChar
            .split('')
            .map(function (char) { return (char === '何' ? '0' : '1'); })
            .join('');
        var code_point = parseInt(bin, 2);
        result.push(String.fromCharCode(code_point));
    }
    return result.join('');
}
function switchTab(tabId) {
    var tabEncrypt = document.getElementById('tabEncrypt');
    var tabDecrypt = document.getElementById('tabDecrypt');
    var panelEncrypt = document.getElementById('panelEncrypt');
    var panelDecrypt = document.getElementById('panelDecrypt');
    if (tabId === 'encrypt') {
        tabEncrypt.classList.add('active');
        tabDecrypt.classList.remove('active');
        panelEncrypt.classList.add('active');
        panelDecrypt.classList.remove('active');
    }
    else {
        tabEncrypt.classList.remove('active');
        tabDecrypt.classList.add('active');
        panelEncrypt.classList.remove('active');
        panelDecrypt.classList.add('active');
    }
}
function removeWhitespaceTextNodes(container) {
    for (var i = container.childNodes.length - 1; i >= 0; i--) {
        var node = container.childNodes[i];
        if (node.nodeType === Node.TEXT_NODE && !(node.textContent || '').trim()) {
            container.removeChild(node);
        }
    }
}
function setup() {
    document.getElementById('tabEncrypt').addEventListener('click', function () { return switchTab('encrypt'); });
    document.getElementById('tabDecrypt').addEventListener('click', function () { return switchTab('decrypt'); });
    var btnEncrypt = document.getElementById('btnEncrypt');
    var inputEncrypt = document.getElementById('inputEncrypt');
    var outputEncryptContainer = document.getElementById('outputEncrypt');
    removeWhitespaceTextNodes(outputEncryptContainer);
    var outputEncryptText = document.getElementById('outputEncryptText');
    btnEncrypt.addEventListener('click', function () {
        var val = inputEncrypt.value;
        if (val.trim().length === 0) {
            outputEncryptText.textContent = '请输入内容。';
            return;
        }
        var result = enHeyiwei(val);
        outputEncryptText.textContent = result;
    });
    var btnDecrypt = document.getElementById('btnDecrypt');
    var inputDecrypt = document.getElementById('inputDecrypt');
    var outputDecryptContainer = document.getElementById('outputDecrypt');
    removeWhitespaceTextNodes(outputDecryptContainer);
    var outputDecryptText = document.getElementById('outputDecryptText');
    btnDecrypt.addEventListener('click', function () {
        var val = inputDecrypt.value;
        if (val.trim().length === 0) {
            outputDecryptText.textContent = '请输入内容。';
            return;
        }
        var result = deHeyiwei(val);
        outputDecryptText.textContent = result;
    });
}
function copyToClipboard(text) {
    navigator.clipboard.writeText(text)
        .then(function () {
        // 成功静默处理，避免打扰用户
    })
        .catch(function (err) {
        console.error('复制失败', err);
        alert('复制失败，请手动复制');
    });
}
window.addEventListener('DOMContentLoaded', function () {
    // …已有的标签切换 +转换按钮逻辑…
    var copyEncryptBtn = document.getElementById('copyEncryptBtn');
    var outputEncryptText = document.getElementById('outputEncryptText');
    copyEncryptBtn.addEventListener('click', function () {
        var text = outputEncryptText.textContent || '';
        if (text) {
            copyToClipboard(text);
        }
        else {
            alert('没有内容可复制');
        }
    });
    var copyDecryptBtn = document.getElementById('copyDecryptBtn');
    var outputDecryptText = document.getElementById('outputDecryptText');
    copyDecryptBtn.addEventListener('click', function () {
        var text = outputDecryptText.textContent || '';
        if (text) {
            copyToClipboard(text);
        }
        else {
            alert('没有内容可复制');
        }
    });
});
// 等 DOM 加载完再 setup
window.addEventListener('DOMContentLoaded', setup);
