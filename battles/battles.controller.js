const router = require('express').Router()
const service = require('./battles.service')

router.route('/battles')
    .get(async (req,res) => {

    })
    .post(async (req,res) => {

    })

router.route('/battles/:id')
    .get(async (req,res) => {

    })
    .patch(async (req,res) => {

    })

router.patch('/battles/:id/active', async (req,res) => {

})

router.get('/battles/:id/participants', async (req,res) => {

})

router.route('/battle/:id/leaderboard')
    .get(async (req,res) => {

    })
    .put(async (req,res) => {
        
    })

router.route('/battles/:id/challenges')
    .get(async (req,res) => {

    })
    .post(async (req,res) => {

    })

router.route('/battles/:id/challenges/:challengeId')
    .get(async (req,res) => {

    })
    .post(async (req,res) => {

    })
    .patch(async (req,res) => {

    })

router.post('/battles/:id/challenges/:challengeId/submit', async (req,res) => {

})


