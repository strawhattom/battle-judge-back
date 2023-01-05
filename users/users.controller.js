const router = require('express').Router()
const service = require('./users.service')


// authentification, autorisation, inscription

router.post('/token', async (req, res) => {

});
router.post('/login', async (req, res) => {
    
});
router.post('/register', async (req, res) => {
    
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