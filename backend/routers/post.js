const express = require('express');
const router = express.Router();
const multer = require('multer');

const Post = require('../models/post');
const CHECK_AUTH = require('../middleware/check-auth');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg'
}

const storage = multer.diskStorage({
  destination: (req, file, callback) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if(isValid){
      error = null;
    }
    callback(error, 'backend/images');
  },
  filename: (req, file, callback) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    callback(null, name + '-' + Date.now() + '.' + ext);
  }
})

router.post('', CHECK_AUTH, multer({storage: storage}).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: url + '/images/' + req.file.filename,
    creator: req.userData.userId
  });
  post.save().then((createdPost) => {
    res.status(201).json({
      message: 'Post added successfully',
      post: {
        ...createdPost,
        id: createdPost._id
      }
    });
  })
  .catch(err => {
    res.status(500).json({
      message: 'Creating a post failed!'
    });
  });
});

router.get('',(req, res, next) => {
  const pageSize = +req.query.pageSize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let _documents;
  if (pageSize && currentPage){
    postQuery
    .skip(pageSize * (currentPage - 1))
    .limit(pageSize);
  }
  postQuery
    .then(documents => {
      _documents = documents;
      return Post.countDocuments();
    })
    .then(count => {
      res.status(200).json({
        message: '',
        posts: _documents,
        count: count
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Fetching posts failed!'
      });
    });
});

router.put('/:id', CHECK_AUTH, multer({storage: storage}).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  if(req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/' + req.file.filename;
  }
  const post = new Post({
    _id: req.params.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post).then(result => {
    if (result.nModified > 0) {
      res.status(200).json({
        message: 'Post updated successfully'
      });
    } else {
      res.status(401).json({
        message: 'Not authorized!'
      });
    }
  })
  .catch(err => {
    res.status(500).json({
      message: 'Updating a post failed!'
    });
  });
});

router.get('/:id', (req, res, next) => {
  Post.findById(req.params.id).then(post => {
    if (post) {
      res.status(200).json(post)
    } else {
      res.status(404).json({message: 'Post not found'});
    }
  })
  .catch(err => {
    res.status(500).json({
      message: 'Fetching post faild!'
    });
  });
});

router.delete('/:id', CHECK_AUTH, (req, res, next) => {
  Post.deleteOne({_id: req.params.id, creator: req.userData.userId }).then(result => {
    if (result.n > 0) {
      res.status(200).json({message: 'Post deleted!'});
    } else {
      res.status(401).json({message: 'Not authorized!'});
    }
  })
  .catch(err => {
    res.status(500).json({
      message: 'Deleting a post failed!'
    });
  });
});

module.exports = router;
