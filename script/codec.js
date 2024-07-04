$(() => {
    const textarea = $('textarea#url')
    const info = $('p.info')

    // action:(1、编码)(2、解码)
    const copy = (text, action = 1) => {
        const textArea = document.createElement('textarea')
        textArea.innerText = text
        textArea.style.width = '0'
        textArea.style.height = '0'
        document.body.appendChild(textArea)

        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)

        $.toast({
            text: `${action === 1 ? '编码' : '解码'}复制成功`,
            showHideTransition: 'slide', // It can be plain, fade or slide
            bgColor: 'blue', // Background color for toast
            textColor: '#eee', // text color
            allowToastClose: false, // Show the close button or not
            hideAfter: 1200, // `false` to make it sticky or time in miliseconds to hide after
            stack: 5, // `fakse` to show one stack at a time count showing the number of toasts that can be shown at once
            textAlign: 'left', // Alignment of text i.e. left, right, center
            position: 'top-center' // bottom-left or bottom-right or bottom-center or top-left or top-right or top-center or mid-center or an object representing the left, right, top, bottom values to position the toast on page
        })
    }

    $('.btn.btn-primary').bind('click', () => {
        const text = textarea.val().trim()
        if (!text) {
            return
        }

        const encoded = encodeURIComponent(text)
        info.text(encoded)
        copy(encoded, 1)
    })

    $('.btn.btn-success').bind('click', () => {
        const text = textarea.val().trim()
        if (!text) {
            return
        }

        const decoded = decodeURIComponent(text)
        info.text(decoded)
        copy(decoded, 2)
    })
})
