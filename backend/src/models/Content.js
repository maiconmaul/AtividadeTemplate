const mongoose = require('mongoose');

const contentSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, maxlength: 120 },
  subtitle: { type: String, trim: true, maxlength: 180, default: '' },
  category: { type: String, trim: true, maxlength: 60, default: 'Séries' },
  imageId: { type: mongoose.Schema.Types.ObjectId, default: null },
}, { timestamps: true });

contentSchema.index({ title: 'text', subtitle: 'text', category: 'text' });

module.exports = mongoose.model('Content', contentSchema);
