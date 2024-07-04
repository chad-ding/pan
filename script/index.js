$(() => {
    const tabs = ['codec', 'qrcode']

    tabs.forEach((item) => {
        $(`#tab-${item}`).bind('click', () => {
            setActive(item)
        })
    })

    const setActive = (tabName) => {
        tabs.forEach((item) => {
            const tab = $(`#tab-${item}`)
            const content = $(`#${item}`)

            if (tabName === item) {
                tab.addClass('active')
                content.show()
            } else {
                tab.removeClass('active')
                content.hide()
            }
        })
    }

    setActive('qrcode')
})
