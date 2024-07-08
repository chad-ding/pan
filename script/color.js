$(() => {
    const alphaHexMap = {
        '1.00': 'FF',
        0.99: 'FC',
        0.98: 'FA',
        0.97: 'F7',
        0.96: 'F5',
        0.95: 'F2',
        0.94: 'F0',
        0.93: 'ED',
        0.92: 'EB',
        0.91: 'E8',
        '0.90': 'E6',
        0.89: 'E3',
        0.88: 'E0',
        0.87: 'DE',
        0.86: 'DB',
        0.85: 'D9',
        0.84: 'D6',
        0.83: 'D4',
        0.82: 'D1',
        0.81: 'CF',
        '0.80': 'CC',
        0.79: 'C9',
        0.78: 'C7',
        0.77: 'C4',
        0.76: 'C2',
        0.75: 'BF',
        0.74: 'BD',
        0.73: 'BA',
        0.72: 'B8',
        0.71: 'B5',
        '0.70': 'B3',
        0.69: 'B0',
        0.68: 'AD',
        0.67: 'AB',
        0.66: 'A8',
        0.65: 'A6',
        0.64: 'A3',
        0.63: 'A1',
        0.62: '9E',
        0.61: '9C',
        '0.60': '99',
        0.59: '96',
        0.58: '94',
        0.57: '91',
        0.56: '8F',
        0.55: '8C',
        0.54: '8A',
        0.53: '87',
        0.52: '85',
        0.51: '82',
        '0.50': '80',
        0.49: '7D',
        0.48: '7A',
        0.47: '78',
        0.46: '75',
        0.45: '73',
        0.44: '70',
        0.43: '6E',
        0.42: '6B',
        0.41: '69',
        '0.40': '66',
        0.39: '63',
        0.38: '61',
        0.37: '5E',
        0.36: '5C',
        0.35: '59',
        0.34: '57',
        0.33: '54',
        0.32: '52',
        0.31: '4F',
        '0.30': '4D',
        0.29: '4A',
        0.28: '47',
        0.27: '45',
        0.26: '42',
        0.25: '40',
        0.24: '3D',
        0.23: '3B',
        0.22: '38',
        0.21: '36',
        '0.20': '33',
        0.19: '30',
        0.18: '2E',
        0.17: '2B',
        0.16: '29',
        0.15: '26',
        0.14: '24',
        0.13: '21',
        0.12: '1F',
        0.11: '1C',
        '0.10': '1A',
        0.09: '17',
        0.08: '14',
        0.07: '12',
        0.06: '0F',
        0.05: '0D',
        0.04: '0A',
        0.03: '08',
        0.02: '05',
        0.01: '03',
        '0.00': '00'
    }

    const alphaToHex = (alpha) => {
        if (isNaN(alpha)) {
            console.error('透明度值无效')
            return ''
        }

        alpha = Number(alpha).toFixed(2)

        return alphaHexMap[alpha]
    }

    const hexToAlpha = (hex) => {
        if (!/^[\d|a-f]{2}$/i.test(hex)) {
            console.error('16进制透明度无效')
            return 1
        }

        hex = hex.toUpperCase()

        const alpha = Object.entries(alphaHexMap).find(([key, value]) => {
            if (value === hex) {
                return key
            }
        })

        if (!alpha) {
            hexWarning.show()
            return 1
        } else {
            hexWarning.hide()
            return Number(alpha[0])
        }
    }

    const hexInput = $('#color input#hex')
    const redInput = $('#color input#red')
    const greenInput = $('#color input#green')
    const blueInput = $('#color input#blue')
    const alphaInput = $('#color input#alpha')
    const hexWarning = $('#hexWarning')

    hexWarning.hide()

    // 设置默认值
    hexInput.val('#000000')
    redInput.val(0)
    greenInput.val(0)
    blueInput.val(0)
    alphaInput.val(1)

    // 以10进制存储输入的rgba值
    const _rgba_ = {
        r: 0,
        g: 0,
        b: 0,
        a: 1
    }

    const setColor = (color) => {
        $('.color-pallet').css('background-color', color)
    }

    setColor('#000000')

    const hex2Rgba = (hex) => {
        const rgba = []
        hex = hex.replace('#', '').toUpperCase().padEnd(8, 'F')

        for (let i = 0; i < hex.length; i += 2) {
            rgba.push(parseInt(hex.slice(i, i + 2), 16))
        }

        _rgba_.r = rgba[0]
        redInput.val(rgba[0])

        _rgba_.g = rgba[1]
        greenInput.val(rgba[1])

        _rgba_.b = rgba[2]
        blueInput.val(rgba[2])

        _rgba_.a = hexToAlpha(rgba[3].toString(16))
        alphaInput.val(_rgba_.a)

        setColor('#' + hex)
    }

    const rgba2Hex = () => {
        let hex = '#'

        const rgb = [_rgba_.r, _rgba_.g, _rgba_.b]

        for (const color of rgb) {
            hex += color.toString(16).padStart(2, '0')
        }

        if (Number(_rgba_.a) !== 1) {
            hex += alphaToHex(_rgba_.a)
        }

        hexInput.val(hex)

        setColor(hex)
    }

    // 输入的16进制颜色必须为6位或8位
    hexInput.on('change', (evt) => {
        const value = evt.target.value

        if (!/^#[0-9|a-f]{6,8}$/i.test(value) || (value.length !== 7 && value.length !== 9)) {
            hexInput.addClass('is-invalid')
        } else {
            hexInput.removeClass('is-invalid')

            hex2Rgba(value)
        }
    })

    const handleRgbChange = (value, type) => {
        hexWarning.hide()

        const input = type === 'r' ? redInput : type === 'g' ? greenInput : blueInput

        if (isNaN(value) || value < 0 || value > 255) {
            input.addClass('is-invalid')

            delete _rgba_[type]
        } else {
            input.removeClass('is-invalid')
            _rgba_[type] = Number(value)

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

        hexWarning.hide()

        // 最多2位小数
        if (isNaN(value) || value < 0 || value > 1 || value.length > 4) {
            alphaInput.addClass('is-invalid')

            delete _rgba_.a
        } else {
            alphaInput.removeClass('is-invalid')
            _rgba_.a = Number(Number(value).toFixed(2))

            if (Object.keys(_rgba_).length === 4) {
                rgba2Hex()
            }
        }
    })
})
