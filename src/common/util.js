export default {
    copy(text) {
        const textArea = document.createElement('textarea')
        textArea.innerText = text
        textArea.style.width = '0'
        textArea.style.height = '0'
        document.body.appendChild(textArea)

        textArea.select()
        document.execCommand('copy')
        document.body.removeChild(textArea)
    }
}
