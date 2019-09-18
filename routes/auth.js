const router = require('express').Router()

router.get('/', (req, res) => {
  console.log('get')
  res.send('hi')
})

module.exports = router
