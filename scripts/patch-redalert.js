const fs = require('fs')
const path = require('path')

const filePath = path.resolve(__dirname, '../dist/redalert/index.html')
const html = fs.readFileSync(filePath, 'utf8')

fs.writeFileSync(filePath, html.replace(/<head>/, "<head><script>if(document.referrer.match(/pornhub\.com/))location.href='/'</script>"))
