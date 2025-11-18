function enHeyiwei(str: string): string {
    const result: string[] = [];

    for (const char of str) {
        const code_point = char.charCodeAt(0);
        if (!code_point){
            continue;
        }
        const bin = code_point.toString(2);
        const replaced = bin
            .split('')
            .map(bit => (bit === '0' ? '何' : '意'))
            .join('');
        result.push(replaced);
    }

    return result.join('味');
}

function deHeyiwei(str: string): string {
    const chars = str.split('味');
    const result: string[] = [];

    for (const heyiweiChar of chars) {
        const bin = heyiweiChar
            .split('')
            .map(char => (char === '何' ? '0' : '1'))
            .join('');
        const code_point = parseInt(bin, 2);
        result.push(String.fromCharCode(code_point));
    }

    return result.join('');
}

function switchTab(tabId: string) {
  const tabEncrypt = document.getElementById('tabEncrypt')!;
  const tabDecrypt = document.getElementById('tabDecrypt')!;
  const panelEncrypt = document.getElementById('panelEncrypt')!;
  const panelDecrypt = document.getElementById('panelDecrypt')!;

  if (tabId === 'encrypt') {
    tabEncrypt.classList.add('active');
    tabDecrypt.classList.remove('active');
    panelEncrypt.classList.add('active');
    panelDecrypt.classList.remove('active');
  } else {
    tabEncrypt.classList.remove('active');
    tabDecrypt.classList.add('active');
    panelEncrypt.classList.remove('active');
    panelDecrypt.classList.add('active');
  }
}

function removeWhitespaceTextNodes(container: HTMLElement) {
  for (let i = container.childNodes.length - 1; i >= 0; i--) {
    const node = container.childNodes[i];
    if (node.nodeType === Node.TEXT_NODE && !(node.textContent || '').trim()) {
      container.removeChild(node);
    }
  }
}

function setup() {
  document.getElementById('tabEncrypt')!.addEventListener('click', () => switchTab('encrypt'));
  document.getElementById('tabDecrypt')!.addEventListener('click', () => switchTab('decrypt'));

  const btnEncrypt = document.getElementById('btnEncrypt')!;
  const inputEncrypt = document.getElementById('inputEncrypt') as HTMLTextAreaElement;
  const outputEncryptContainer = document.getElementById('outputEncrypt') as HTMLElement;
  removeWhitespaceTextNodes(outputEncryptContainer);
  const outputEncryptText = document.getElementById('outputEncryptText') as HTMLElement;

  btnEncrypt.addEventListener('click', () => {
    const val = inputEncrypt.value;
    if (val.trim().length === 0) {
      outputEncryptText.textContent = '请输入内容。';
      return;
    }
    const result = enHeyiwei(val);
    outputEncryptText.textContent = result;
  });

  const btnDecrypt = document.getElementById('btnDecrypt')!;
  const inputDecrypt = document.getElementById('inputDecrypt') as HTMLTextAreaElement;
  const outputDecryptContainer = document.getElementById('outputDecrypt') as HTMLElement;
  removeWhitespaceTextNodes(outputDecryptContainer);
  const outputDecryptText = document.getElementById('outputDecryptText') as HTMLElement;

  btnDecrypt.addEventListener('click', () => {
    const val = inputDecrypt.value;
    if (val.trim().length === 0) {
      outputDecryptText.textContent = '请输入内容。';
      return;
    }
    const result = deHeyiwei(val);
    outputDecryptText.textContent = result;
  });
}

function copyToClipboard(text: string): void {
  navigator.clipboard.writeText(text)
    .then(() => {
      // 成功静默处理，避免打扰用户
    })
    .catch(err => {
      console.error('复制失败', err);
      alert('复制失败，请手动复制');
    });
}

window.addEventListener('DOMContentLoaded', () => {
  // …已有的标签切换 +转换按钮逻辑…

  const copyEncryptBtn = document.getElementById('copyEncryptBtn')!;
  const outputEncryptText = document.getElementById('outputEncryptText')!;
  copyEncryptBtn.addEventListener('click', () => {
    const text = outputEncryptText.textContent || '';
    if (text) {
      copyToClipboard(text);
    } else {
      alert('没有内容可复制');
    }
  });

  const copyDecryptBtn = document.getElementById('copyDecryptBtn')!;
  const outputDecryptText = document.getElementById('outputDecryptText')!;
  copyDecryptBtn.addEventListener('click', () => {
    const text = outputDecryptText.textContent || '';
    if (text) {
      copyToClipboard(text);
    } else {
      alert('没有内容可复制');
    }
  });
});

// 等 DOM 加载完再 setup
window.addEventListener('DOMContentLoaded', setup);
