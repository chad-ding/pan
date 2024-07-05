$(() => {
    const hexInput = $('#color input#hex')
    const redInput = $('#color input#red')
    const greenInput = $('#color input#green')
    const blueInput = $('#color input#blue')
    const alphaInput = $('#color input#alpha')

    // 设置默认值
    hexInput.val('#000000')
    redInput.val(0)
    greenInput.val(0)
    blueInput.val(0)
    alphaInput.val(1)

    const _rgba_ = {
        r: 0,
        g: 0,
        b: 0,
        a: 1
    }

    const hex2Rgba = (hex) => {
        const rgba = []
        hex = hex.replace('#', '').padEnd(8, 'F')

        for (let i = 0; i < hex.length; i += 2) {
            rgba.push(parseInt(hex.slice(i, i + 2), 16))
        }

        redInput.val(rgba[0])
        greenInput.val(rgba[1])
        blueInput.val(rgba[2])
        alphaInput.val(rgba[3])
    }

    const rgba2Hex = () => {
        let hex = '#'
        const rgba = Object.values(_rgba_)

        for (const i of rgba) {
            hex += i.toString(16).padStart(2, '0')
        }

        hexInput.val(hex)
    }

    hexInput.on('change', (evt) => {
        const value = evt.target.value
        if (!/^#[0-9|a-f]{6}$/.test(value)) {
            hexInput.addClass('is-invalid')
        } else {
            hexInput.removeClass('is-invalid')

            hex2Rgba(value)
        }
    })

    const handleRgbChange = (value, type) => {
        if (isNaN(value) || value < 0 || value > 255) {
            readInput.addClass('is-invalid')

            delete _rgba_[type]
        } else {
            readInput.removeClass('is-invalid')
            _rgba_[type] = value

            if (Object.keys(_rgba_).length === 4) {
                rgba2Hex()
            }
        }
    }

    redInput.on('change', (evt) => {
        const value = evt.target.value

        handleRgbChange(value, 'r')
    })

    greenInput.on('change', (evt) => {
        const value = evt.target.value

        handleRgbChange(value, 'g')
    })

    blueInput.on('change', (evt) => {
        const value = evt.target.value

        handleRgbChange(value, 'b')
    })

    alphaInput.on('change', (evt) => {
        const value = evt.target.value

        if (isNaN(value) || value < 0 || value > 1) {
            readInput.addClass('is-invalid')

            delete _rgba_.a
        } else {
            readInput.removeClass('is-invalid')
            _rgba_.a = value

            if (Object.keys(_rgba_).length === 4) {
                rgba2Hex()
            }
        }
    })
})
