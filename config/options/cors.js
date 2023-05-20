let localhostIP
async function getIPV4() {
  const { publicIpv4 } = await import('public-ip')
  localhostIP = await publicIpv4()
}
getIPV4()

const allowedOrigins = [
  `http://${localhostIP}:9999`,
  'https://www.yoursite.com',
  'http://localhost:3300'
]

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true)
    } else {
      callback(new Error('Not allowed by CORS'))
    }
  },
  optionsSuccessStatus: 200
}

module.exports = corsOptions
