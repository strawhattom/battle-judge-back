module.exports = (err, req, res, next) => {
    console.error(err.stack)
	logger.info(err.message);
    res.status(500).send('Error !')
}