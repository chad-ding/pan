let url = ''

chrome.tabs.query({ currentWindow: true, active: true }, function (tabs) {
    if (!tabs || !tabs.length) {
        return
    }

    url = tabs[0].url
})

$(() => {
    let timer = undefined
    $('textarea#string').bind('input', (evt) => {
        const str = evt.target.value.trim() || url
        if (timer) {
            window.clearTimeout(timer)
        }

        timer = setTimeout(() => {
            drawQRCode(str)
        }, 600)
    })

    const drawQRCode = (string) => {
        const root = $('#monitor')

        root.empty()
        root.qrcode({
            width: 300,
            height: 300,
            text: string
        })
    }

    $('textarea#string').val(url)
    drawQRCode(url)
})
