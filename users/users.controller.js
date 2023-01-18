const router = require('express').Router();
const service = require('./users.service');
const authorized = require('../middlewares/authorization.middleware');

router.get('/', authorized(['admin']), async (req, res) => {
  // Récupère tous les utilisateurs
  const users = await service.findAll();
  return res.status(200).send(users);
});

router.get('/participants', async (req, res) => {
  return res.status(200).send(await service.findAllParticipants());
});

router.get('/judges', async (req, res) => {
  return res.status(200).send(await service.findAllJudges());
});

// Pour les utilisateurs
router
  .route('/me')
  .get(async (req, res) => {
    return res.status(200).send(req.user);
  })
  .patch(async (req, res) => {
    const update = await service.update(req.user, req.body);
    if (!update)
      return res.status(400).send({ message: 'Could not update the user' });
    return res.status(200).send(update);
  })
  .delete(async (req, res) => {
    const deletedUser = await service.deleteUser(req.user.id);
    if (!deletedUser)
      return res.status(200).send({
        user: deletedUser,
        deleted: false
      });
    return res.status(200).send({
      user: deletedUser,
      deleted: true
    });
  });

router.use('/:id', authorized(['admin']));

router
  .route('/:id')
  .get(async (req, res) => {
    const user = await service.findById(req.params.id);
    if (!user) return res.status(400).send({ message: 'User not found' });
    return res.status(200).send(user);
  })
  .patch(async (req, res) => {
    const update = await service.update({ id: req.params.id }, req.body);
    if (!update)
      return res.status(400).send({ message: 'Could not update the user' });
    return res.status(200).send(update);
  })
  .delete(async (req, res) => {
    const deletedUser = await service.deleteUser(req.params.id);
    if (!deletedUser)
      return res.status(200).send({
        user: deletedUser,
        deleted: false
      });
    return res.status(200).send({
      user: deletedUser,
      deleted: true
    });
  });

module.exports = router;
