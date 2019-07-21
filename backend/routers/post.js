const express = require('express');
const router = express.Router();

const CHECK_AUTH = require('../middleware/check-auth');
const extractFile = require('../middleware/file');

const PostController = require('../controllers/post');


router.post('', CHECK_AUTH, extractFile, PostController.addPost);

router.get('', PostController.getPosts);

router.put('/:id', CHECK_AUTH, extractFile, PostController.editPost);

router.get('/:id', PostController.getPostById);

router.delete('/:id', CHECK_AUTH, PostController.deletePost);

module.exports = router;
