const express = require('express');
const multer = require('multer');
const mongoose = require('mongoose');
const Content = require('../models/Content');
const requireAuth = require('../middleware/auth');

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 8 * 1024 * 1024 }, fileFilter: (req, file, cb) => {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype)) return cb(new Error('Use uma imagem JPG, PNG ou WEBP.'));
  cb(null, true);
} });

function bucket() { return new mongoose.mongo.GridFSBucket(mongoose.connection.db, { bucketName: 'images' }); }

function publicContent(item) {
  const value = item.toObject ? item.toObject() : item;
  return { ...value, imageUrl: value.imageId ? `/api/content/${value._id}/image` : null };
}

async function removeImage(imageId) {
  if (imageId) await bucket().delete(new mongoose.Types.ObjectId(imageId)).catch(() => {});
}

async function saveImage(file) {
  if (!file) return null;
  const id = new mongoose.Types.ObjectId();
  await new Promise((resolve, reject) => {
    const stream = bucket().openUploadStreamWithId(id, file.originalname, { contentType: file.mimetype });
    stream.on('error', reject);
    stream.on('finish', resolve);
    stream.end(file.buffer);
  });
  return id;
}

router.get('/', async (req, res, next) => {
  try {
    const filter = {};
    if (req.query.category) filter.category = req.query.category;
    if (req.query.q?.trim()) {
      const escaped = req.query.q.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.$or = ['title', 'subtitle', 'category'].map(field => ({ [field]: { $regex: escaped, $options: 'i' } }));
    }
    const items = await Content.find(filter).sort({ createdAt: -1 });
    return res.json({ items: items.map(publicContent) });
  } catch (error) { return next(error); }
});

router.get('/:id/image', async (req, res, next) => {
  try {
    const item = await Content.findById(req.params.id).select('imageId');
    if (!item?.imageId) return res.status(404).json({ message: 'Imagem não encontrada.' });
    const files = await bucket().find({ _id: item.imageId }).toArray();
    if (!files.length) return res.status(404).json({ message: 'Imagem não encontrada.' });
    res.set('Content-Type', files[0].contentType || 'application/octet-stream');
    res.set('Cache-Control', 'public, max-age=3600');
    return bucket().openDownloadStream(item.imageId).pipe(res);
  } catch (error) { return next(error); }
});

router.post('/', requireAuth, upload.single('image'), async (req, res, next) => {
  try {
    const { title, subtitle = '', category = 'Séries' } = req.body;
    if (!title?.trim()) return res.status(400).json({ message: 'O título é obrigatório.' });
    const imageId = await saveImage(req.file);
    let item;
    try { item = await Content.create({ title, subtitle, category, imageId }); }
    catch (error) { await removeImage(imageId); throw error; }
    return res.status(201).json({ item: publicContent(item) });
  } catch (error) { return next(error); }
});

router.put('/:id', requireAuth, upload.single('image'), async (req, res, next) => {
  let newImageId;
  try {
    const item = await Content.findById(req.params.id);
    if (!item) return res.status(404).json({ message: 'Conteúdo não encontrado.' });
    const { title, subtitle, category, removeImage: shouldRemoveImage } = req.body;
    if (title !== undefined) item.title = title.trim();
    if (subtitle !== undefined) item.subtitle = subtitle.trim();
    if (category !== undefined) item.category = category.trim();
    if (req.file) {
      newImageId = await saveImage(req.file);
      const oldImageId = item.imageId;
      item.imageId = newImageId;
      await item.save();
      await removeImage(oldImageId);
      newImageId = null;
      return res.json({ item: publicContent(item) });
    } else if (shouldRemoveImage === 'true') {
      const oldImageId = item.imageId;
      item.imageId = null;
      await item.save();
      await removeImage(oldImageId);
      return res.json({ item: publicContent(item) });
    }
    await item.save();
    return res.json({ item: publicContent(item) });
  } catch (error) {
    if (newImageId) await removeImage(newImageId);
    return next(error);
  }
});

router.delete('/:id', requireAuth, async (req, res, next) => {
  try {
    const item = await Content.findByIdAndDelete(req.params.id);
    if (!item) return res.status(404).json({ message: 'Conteúdo não encontrado.' });
    await removeImage(item.imageId);
    return res.json({ message: 'Conteúdo removido.' });
  } catch (error) { return next(error); }
});

module.exports = router;
