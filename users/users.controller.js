const router = require('express').Router();
const service = require('./users.service');
const passport = require('passport');
require('../middlewares/local.strategy');
require('../middlewares/jwt.strategy');

// authentification, autorisation, inscription

router.post('/login', 
    passport.authenticate('local', {
        session: false,
    }),
    async (req, res) => {
        const username = req.user?.username;
        const token = await service.generateJWT(username);
        return res.status(200).send({token});
});
router.post('/register', async (req, res) => {
    const { username, password, mail } = req.body;
    const user = await service.register(username, password, mail);
    if (!user) return res.status(400).send({'message': 'Could not register the user'});
    return res.status(201).send(user);
});


// Middleware !!!
// router.use('/users/')


router.get('/users', async (req, res) => {
    // Récupère tous les utilisateurs
});

router.get('/users/participants', async (req, res) => {
    // Récupère tous les participants
});

router.get('/users/judges', async (req, res) => {
    // Récupère tous les juges
});

// Pour les admins
router.route('/users/:id')
    .get(async (req, res) => {
        // Récupère les informations de :id
    })
    .patch(async (req, res) => {
        // Modifie les infomartions de :id
    })
    .delete(async (req, res) => {
        // Supprime l'utilisateur :id
    });

// Pour les utilisateurs
router.route('/users/me')
    .get(async (req, res) => {
        // Comme en TP
    })
    .patch(async (req, res) => {
        // Comme en TP
    })
    .delete(async (req, res) => {
        // Comme en TP
    });

module.exports = router;