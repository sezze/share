const path = require('path')

const axios = require('axios')
const slugify = require('slugify')
const publicIp = require('public-ip')
const chalk = require('chalk')
const serverApp = require('./server')
const Confirm = require('prompt-confirm')

const { url, port } = require('./config.json')
const filePath = process.argv[2]
const fileName = path.basename(filePath)
const slug = slugify(fileName)

console.log(chalk.yellowBright.bgBlueBright(`\n  Share ${fileName}  \n`))

new Confirm(`Do you want to share ${fileName}?`)
  .ask(async answer => {
    if (!answer) return

    // Server
    console.log('Starting server')
    const server = serverApp.start(slug, filePath, port)

    // Fetch public IP
    console.log('Fetching public IP')
    const ip = await publicIp.v4()
    const link = `http://${ip}:${port}/${slug}`

    // Share
    console.log(chalk.green(`File available at ${link}, sharing link...`))
    axios.post(url, { content: `[${fileName}](${link})` })
      .then(() => console.log('Link sent'))

    // On exit, close server
    process.on('SIGINT', () => {
      server.close()
      process.exit(1)
    })
  })
