const express = require('express');
const router = express.Router();
const passport = require('passport')

const commentController = require('../controllers/comments_controller')

// router.post('/create', postController.create)
router.post('/create', passport.checkAuthentication, commentController.create)
router.get('/destroy/:id', passport.checkAuthentication, commentController.destroy)
// router.delete('/destroy/:id', passport.checkAuthentication, commentController.destroy)


module.exports = router;