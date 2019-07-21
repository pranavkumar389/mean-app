
const Post = require('../models/post');

exports.addPost = (req, res, next) => {
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
}

exports.getPosts = (req, res, next) => {
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
}


exports.editPost = (req, res, next) => {
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
    if (result.n > 0) {
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
}

exports.getPostById = (req, res, next) => {
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
}

exports.deletePost = (req, res, next) => {
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
}
