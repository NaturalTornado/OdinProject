// userController.js - Rev.-09
const prisma = require('../prismaClient');

exports.getAllUsers = async (req, res) => {
  try {
    const users = await prisma.user.findMany();
    res.render('layout', {
      title: 'All Users',
      body: 'users/index',
      allUsers: users,
      user: req.user,
    });
  } catch (err) {
    console.error(err);
    res.status(500).send('Server Error');
  }
};

exports.getUserProfileByUsername = async (req, res) => {
  const { username } = req.params;

  try {
    // Fetch the profile for the specified username
    const profileUser = await prisma.user.findUnique({
      where: { username },
      include: { profile: true, posts: true },
    });

    if (!profileUser) {
      return res.status(404).send('User not found');
    }

    // Fetch all users for the user list
    const allUsers = await prisma.user.findMany({
      select: { id: true, username: true },
    });

    // Fetch the friend relationships for the current user
    const friends = await prisma.friend.findMany({
      where: { userId: req.user.id },
      select: { friendId: true },
    });

    const friendIds = friends.map(f => f.friendId);

    // Fetch messages between the logged-in user and the profile user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: req.user.id, receiverId: profileUser.id },
          { senderId: profileUser.id, receiverId: req.user.id },
        ],
      },
      orderBy: { timestamp: 'desc' },
    });

    // Render the profile page with all necessary data
    res.render('layout', {
      title: `${profileUser.username}'s Profile`,
      body: 'users/profile',
      user: req.user,
      profileUser,
      messages,
      allUsers, // Pass the list of all users
      friends: friendIds,
    });
  } catch (err) {
    console.error('Error in getUserProfileByUsername:', err);
    res.status(500).send('Server Error');
  }
};


exports.addFriendAjax = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.id;

  try {
    console.log(`Received friendId: ${friendId}, userId: ${userId}`);
    // Check if the friendship already exists
    const existingFriendship = await prisma.friend.findFirst({
      where: { userId, friendId: parseInt(friendId, 10) },
    });

    if (existingFriendship) {
      console.log('Friendship already exists');
      return res.status(400).json({ error: 'You are already friends.' });
    }

    // Add the friend
    await prisma.friend.create({
      data: { userId, friendId: parseInt(friendId, 10) },
    });

    console.log('Friend added successfully');
    res.status(200).json({ message: 'Friend added successfully.' });
  } catch (err) {
    console.error('Error in addFriendAjax:', err);
    res.status(500).json({ error: 'Failed to add friend.' });
  }
};


exports.removeFriendAjax = async (req, res) => {
  const { friendId } = req.body;
  const userId = req.user.id;

  try {
    await prisma.friend.deleteMany({ where: { userId, friendId: parseInt(friendId, 10) } });
    res.status(200).json({ message: 'Friend removed successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to remove friend.' });
  }
};

// Update bio
exports.updateBioAjax = async (req, res) => {
  const { bio } = req.body;
  const userId = req.user.id; // Ensure the user is authenticated

  try {
    // Update the user's bio
    await prisma.profile.upsert({
      where: { userId },
      update: { bio },
      create: { userId, bio },
    });

    res.json({ success: true, message: 'Bio updated successfully' });
  } catch (err) {
    console.error('Error updating bio:', err);
    res.status(500).json({ success: false, message: 'Failed to update bio' });
  }
};

// userController.js - Add this function
// userController.js
exports.sendMessage = async (req, res) => {
  const { title, body, receiverId } = req.body;

  if (!title || !body || !receiverId) {
    return res.status(400).json({ error: 'All fields are required.' });
  }

  try {
    const senderId = req.user.id; // Logged-in user's ID

    // Create the message in the database
    const message = await prisma.message.create({
      data: {
        title: title || null,
        body,
        senderId,
        receiverId: parseInt(receiverId, 10), // Ensure receiverId is an integer
      },
    });

    res.status(201).json({ success: true, message: 'Message sent successfully.', data: message });
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Failed to send the message.' });
  }
};



// userController.js - Add this function
exports.getMessages = async (req, res) => {
  const { username } = req.params; // Target user's username
  const userId = req.user.id; // Authenticated user's ID

  try {
    // Get messages involving the authenticated user and the target user
    const messages = await prisma.message.findMany({
      where: {
        OR: [
          { senderId: userId, receiver: { username } },
          { receiverId: userId, sender: { username } },
        ],
      },
      include: {
        sender: { select: { username: true } },
        receiver: { select: { username: true } },
      },
      orderBy: { timestamp: 'asc' },
    });

    res.status(200).json({ success: true, messages });
  } catch (err) {
    console.error('Error in getMessages:', err);
    res.status(500).json({ error: 'Failed to fetch messages' });
  }
};

