// postController.js - Rev.-03
const prisma = require('../prismaClient');

/**
 * @desc    Fetch profile, posts, and users for the feed
 * @route   GET /posts
 * @access  Authenticated Users
 */
exports.getFeed = async (req, res) => {
  try {
    // Fetch the logged-in user's profile or set default values
    const profile = await prisma.profile.findUnique({
      where: { userId: req.user.id },
    }) || { bio: '', avatarUrl: '', userId: req.user.id };

    // Fetch posts authored by the user and posts from users they follow
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { authorId: req.user.id }, // Posts authored by the logged-in user
          {
            author: {
              followers: {
                some: { followerId: req.user.id }, // Posts from users the logged-in user follows
              },
            },
          },
        ],
      },
      include: {
        author: { select: { username: true } }, // Include author info
        comments: {
          include: { author: { select: { username: true } } }, // Include comment authors
        },
        likes: true, // Include likes
      },
      orderBy: { createdAt: 'desc' }, // Order by newest first
    });

    // Fetch conversations
    const conversations = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id },
          { receiverId: req.user.id },
        ],
      },
      include: {
        sender: { select: { id: true, username: true } },
        receiver: { select: { id: true, username: true } },
      },
      orderBy: {
        timestamp: 'desc',
      },
    });

    // Format conversations to determine the "other user"
    const formattedConversations = conversations.map((conversation) => ({
      title: conversation.title,
      otherUser:
        conversation.senderId === req.user.id
          ? conversation.receiver
          : conversation.sender,
    }));

    // Fetch all users for the "Users List" section
    const users = await prisma.user.findMany({
      select: { id: true, username: true },
    });

    // Render the feed template with the data
    res.render('posts/feed', {
      user: req.user,
      profile,
      posts,
      conversations: formattedConversations, // Pass formatted conversations to the EJS template
      users, // Pass the users array to the EJS template
    });
  } catch (err) {
    console.error('Error in getFeed:', err);
    res.status(500).send('Server Error');
  }
};



/**
 * @desc    Fetch a single post
 * @route   GET /posts/:id
 * @access  Authenticated Users
 */
exports.getPostById = async (req, res) => {
  const { id } = req.params;

  try {
    const post = await prisma.post.findUnique({
      where: { id: parseInt(id, 10) },
      include: {
        author: { select: { username: true } },
        comments: {
          include: { author: { select: { username: true } } },
        },
        likes: true,
      },
    });

    if (!post) {
      return res.status(404).send('Post not found');
    }

    res.render('posts/post', { post });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Create a new post
 * @route   POST /posts
 * @access  Authenticated Users
 */
exports.createPost = async (req, res) => {
  const { content } = req.body;

  if (!content || content.trim().length === 0) {
    req.flash('error', 'Post content cannot be empty.');
    return res.redirect('/posts');
  }

  try {
    await prisma.post.create({
      data: {
        content: content.trim(), // Ensure trimmed content
        authorId: req.user.id,
      },
    });

    req.flash('success', 'Post created successfully.');
    res.redirect('/posts');
  } catch (err) {
    console.error('Error creating post:', err);
    req.flash('error', 'There was an error creating your post.');
    res.status(500).redirect('/posts');
  }
};

/**
 * @desc    Like a post
 * @route   POST /posts/:id/like
 * @access  Authenticated Users
 */
exports.likePost = async (req, res) => {
  const { id } = req.params;

  try {
    const existingLike = await prisma.like.findFirst({
      where: {
        userId: req.user.id,
        postId: parseInt(id, 10),
      },
    });

    if (existingLike) {
      req.flash('error', 'You have already liked this post.');
      return res.redirect(`/posts/${id}`);
    }

    await prisma.like.create({
      data: {
        userId: req.user.id,
        postId: parseInt(id, 10),
      },
    });

    req.flash('success', 'Post liked.');
    res.redirect(`/posts/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

/**
 * @desc    Add a comment to a post
 * @route   POST /posts/:id/comment
 * @access  Authenticated Users
 */
exports.commentOnPost = async (req, res) => {
  const { id } = req.params;
  const { content } = req.body;

  if (!content) {
    req.flash('error', 'Comment content cannot be empty.');
    return res.redirect(`/posts/${id}`);
  }

  try {
    await prisma.comment.create({
      data: {
        content,
        authorId: req.user.id,
        postId: parseInt(id, 10),
      },
    });

    req.flash('success', 'Comment added.');
    res.redirect(`/posts/${id}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};
