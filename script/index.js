$(() => {
    const tabs = $('li[data-tab-key]')

    tabs.each((index, ele) => {
        ele.addEventListener('click', () => {
            const key = ele.dataset.tabKey
            setActive(key)
        })
    })

    const setActive = (tabKey) => {
        tabs.each((index, ele) => {
            const key = ele.dataset.tabKey
            const content = $(`#${key}`)
            if (tabKey === key) {
                ele.classList.remove('active')
                content.show()
            } else {
                ele.classList.remove('active')
                content.hide()
            }
        })
    }

    const key = tabs[0].dataset.tabKey

    setActive(key)
})
