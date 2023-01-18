const router = require('express').Router()
const service = require('./teams.service')

router
  .route('/teams')
  .get(async (req, res) => {})
  .post(async (req, res) => {})

router
  .route('/teams/:name')
  .get(async (req, res) => {})
  .patch(async (req, res) => {})
  .delete(async (req, res) => {})

router.post('/teams/:name/add', async (req, res) => {})

router.patch('/teams/:name/judge', async (req, res) => {})

module.exports = router
