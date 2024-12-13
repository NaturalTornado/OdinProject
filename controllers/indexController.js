// indexController.js - Rev.-01
// Controller for main application logic

const prisma = require('../prismaClient');

// @desc    Render homepage
// @route   GET /
exports.getHomePage = async (req, res) => {
  try {
    const posts = await prisma.post.findMany({
      where: {
        OR: [
          { authorId: req.user.id },
          {
            author: {
              followers: {
                some: { followerId: req.user.id },
              },
            },
          },
        ],
      },
      include: {
        author: { select: { username: true } },
        likes: true,
        comments: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    res.render('posts/feed', { posts, user: req.user });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

// @desc    Render about page
// @route   GET /about
exports.getAboutPage = (req, res) => {
  res.render('about', { user: req.user });
};
