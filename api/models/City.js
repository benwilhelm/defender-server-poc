module.exports = {

    attributes: {

        name: {
            type: 'string',
            required: true
        },

        country: {
            type: 'string',
            in: ['usa', 'ussr']
        },

        lat: {
            type: 'float',
            required: true,
            min: -90,
            max: 90
        },

        lon: {
            type: 'float',
            required: true,
            min: -180,
            max: 180
        }
    }
}
