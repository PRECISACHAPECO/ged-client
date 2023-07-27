/* eslint-disable @typescript-eslint/no-var-requires */
const path = require('path')
const withFonts = require('next-fonts');

/** @type {import('next').NextConfig} */

// Remove this if you're not using Fullcalendar features
const withTM = require('next-transpile-modules')([
    '@fullcalendar/common',
    '@fullcalendar/react',
    '@fullcalendar/daygrid',
    '@fullcalendar/list',
    '@fullcalendar/timegrid'
])

module.exports = withTM({
    trailingSlash: true,
    reactStrictMode: false,
    experimental: {
        esmExternals: false
    },
    webpack: config => {
        config.resolve.alias = {
            ...config.resolve.alias,
            apexcharts: path.resolve(__dirname, './node_modules/apexcharts-clevision')
        }

        return config
    }
<<<<<<< HEAD
})

module.exports = withFonts({
    webpack(config, options) {
        return config;
    },
});
=======
})
>>>>>>> 775e144a93fcabce34b30f3c016004f6865b09b2
