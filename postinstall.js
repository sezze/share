const path = require('path')

const isAdmin = require('is-admin')
const regedit = require('regedit')

console.log('Adding "Share on Discord" to Windows context menu')

isAdmin().then(admin => {
  if (!admin) {
    console.error(new Error('Missing admin privileges! Setup failed.'))
    process.exit(1)
  }

  regedit.createKey([
    'HKCR\\*\\shell\\share',
    'HKCR\\*\\shell\\share\\command'
  ], console.error)

  regedit.putValue({
    'HKCR\\*\\shell\\share': {
      default: {
        value: 'Share on Discord',
        type: 'REG_DEFAULT'
      }
    },
    'HKCR\\*\\shell\\share\\command': {
      default: {
        value: `"${process.execPath}" "${path.join(__dirname, 'app.js')}" "%1"`,
        type: 'REG_DEFAULT'
      }
    }
  }, err => {
    if (err) {
      console.error(err)
      process.exit(1)
    }
  })
})
