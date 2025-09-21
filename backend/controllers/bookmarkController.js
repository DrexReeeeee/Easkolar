const Bookmark = require('../models/Bookmark');
const Scholarship = require('../models/Scholarship');

exports.addBookmark = async (req, res) => {
  const user_id = req.user.user_id;
  const { scholarship_id } = req.body;
  try {
    if (!scholarship_id) {
      return res.status(400).json({ message: 'scholarship_id is required' });
    }
    const schol = await Scholarship.findOne({ where: { scholarship_id } });
    if (!schol) {
      return res.status(404).json({ message: 'Scholarship not found' });
    }
    const existing = await Bookmark.findOne({ where: { user_id, scholarship_id } });
    if (existing) {
      return res.status(400).json({ message: 'Already bookmarked' });
    }
    const bm = await Bookmark.create({ user_id, scholarship_id });
    return res.status(201).json({ bookmark: bm });
  } catch (error) {
    console.error('AddBookmark error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.removeBookmark = async (req, res) => {
  const user_id = req.user.user_id;
  const { scholarship_id } = req.params;
  try {
    const existing = await Bookmark.findOne({ where: { user_id, scholarship_id } });
    if (!existing) {
      return res.status(404).json({ message: 'Bookmark not found' });
    }
    await existing.destroy();
    return res.status(200).json({ message: 'Bookmark removed' });
  } catch (error) {
    console.error('RemoveBookmark error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};

exports.getBookmarks = async (req, res) => {
  const user_id = req.user.user_id;
  try {
    const bookmarks = await Bookmark.findAll({
      where: { user_id },
      include: [
        {
          model: Scholarship,
          
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    return res.status(200).json({ bookmarks });
  } catch (error) {
    console.error('GetBookmarks error:', error);
    return res.status(500).json({ message: 'Server error' });
  }
};
