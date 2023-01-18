const router = require('express').Router()
const service = require('./users.service')
const passport = require('passport')
// const logger = require('../utils/logger')
require('../middlewares/local.strategy')
require('../middlewares/jwt.strategy')
const authorized = require('../middlewares/authorization.middleware')

// authentification, autorisation, inscription

router.post(
  '/login',
  passport.authenticate('local', {
    session: false
  }),
  async(req, res) => {
    const username = req.user?.username
    const token = await service.generateJWT(username)
    return res.status(200).send({ token })
  }
)
router.post('/register', async (req, res) => {
  const { username, password, mail } = req.body
  const user = await service.register(username, password, mail)
  if (!user)
    return res.status(400).send({ message: 'Could not register the user' })
  return res.status(201).send(user)
})

// JWT Middleware
router.use(
  '/users',
  passport.authenticate('jwt', {
    session: false
  })
)

router.get('/users', authorized(['admin']), async (req, res) => {
  // Récupère tous les utilisateurs
  const users = await service.findAll()
  return res.status(200).send(users)
})

router.get('/users/participants', async (req, res) => {
  return res.status(200).send(await service.findAllParticipants())
})

router.get('/users/judges', async (req, res) => {
  return res.status(200).send(await service.findAllJudges())
})

// Pour les utilisateurs
router
  .route('/users/me')
  .get(async (req, res) => {
    return res.status(200).send(req.user)
  })
  .patch(async (req, res) => {
    const update = await service.update(req.user, req.body)
    if (!update)
      return res.status(400).send({ message: 'Could not update the user' })
    return res.status(200).send(update)
  })
  .delete(async (req, res) => {
    const deletedUser = await service.deleteUser(req.user.id)
    if (!deletedUser)
      return res.status(200).send({
        user: deletedUser,
        deleted: false
      })
    return res.status(200).send({
      user: deletedUser,
      deleted: true
    })
  })

router.use('/users/:id', authorized(['admin']))
router
  .route('/users/:id')
  .get(async (req, res) => {
    const user = await service.findById(req.params.id)
    if (!user) return res.status(400).send({ message: 'User not found' })
    return res.status(200).send(user)
  })
  .patch(async (req, res) => {
    const update = await service.update({ id: req.params.id }, req.body)
    if (!update)
      return res.status(400).send({ message: 'Could not update the user' })
    return res.status(200).send(update)
  })
  .delete(async (req, res) => {
    const deletedUser = await service.deleteUser(req.params.id)
    if (!deletedUser)
      return res.status(200).send({
        user: deletedUser,
        deleted: false
      })
    return res.status(200).send({
      user: deletedUser,
      deleted: true
    })
  })

module.exports = router
