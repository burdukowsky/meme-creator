function downloadURI(uri, name) {
    const link = document.createElement('a');
    link.download = name;
    link.href = uri;
    link.click();
    link.remove();
}

function doWithCanvas(div, fun) {
    return html2canvas(div)
        .then(fun)
        .catch(e => console.error(e));
}

function copyToClipboard(div) {
    doWithCanvas(div, canvas => {
        canvas.toBlob(blob => {
            if (blob == null) {
                console.error('blob is null');
                return;
            }
            try {
                navigator.clipboard
                    .write([new ClipboardItem({'image/png': blob})])
                    .catch(e => console.error(e));
            } catch (e) {
                console.error(e);
            }
        });
    });
}

function printToFile(div) {
    doWithCanvas(div, canvas => {
        const image = canvas.toDataURL('image/png');
        downloadURI('data:' + image, 'meme.png');
    });
}

function isFirefox() {
    return window.navigator.userAgent.toLowerCase().indexOf('firefox') > -1;
}

function checkFirefox() {
    const messageEl = document.getElementById('firefox-message');
    if (messageEl != null && isFirefox() && window.ClipboardItem == null) {
        messageEl.style.display = 'block';
    }
}

document.addEventListener('DOMContentLoaded', () => {
    checkFirefox();

    const memeContainer = document.getElementById('meme-container');

    if (memeContainer == null) {
        return;
    }

    const copyButton = document.getElementById('copy-button');

    if (copyButton != null) {
        copyButton.addEventListener('click', () => {
            copyToClipboard(memeContainer);
        });
    }

    const downloadButton = document.getElementById('download-button');

    if (downloadButton != null) {
        downloadButton.addEventListener('click', () => {
            printToFile(memeContainer);
        });
    }
});
