const express = require('express')
const chalk = require('chalk')

// Starts the file server
function start (slug, filePath, port) {
  const app = express()

  // Get the file
  app.get(`/${slug}`, (req, res) => {
    const ip = req.headers['x-forwarded-for'] || req.connection.remoteAddress
    console.log(chalk.yellow(`${ip} - Download started`))

    res.sendFile(filePath, err => {
      if (err) console.log(chalk.red(`${ip} - Download failed/cancelled`))
      else console.log(chalk.green(`${ip} - Download finished`))
    })
  })

  return app.listen(port, () => `Server started on port ${port}`)
}

module.exports = { start }
