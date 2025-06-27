const Gallery = require('../models/gallery');

// // CREATE
// exports.createGallery = async (req, res) => {
//     try {
//         const { title, from, link } = req.body;
//         const image = req.file ? `/public/gallery/${req.file.filename}` : null;

//         if (!image) return res.status(400).json({ message: "Image is required." });

//         const service = new Gallery({
//             image,
//             title,
//             from,
//             link,
//             createdBy: 'admin', // Optional: fetch from req.user
//         });

//         const saved = await service.save();

//         res.status(201).json({ message: "Gallery item created", data: saved });
//     } catch (error) {
//         res.status(500).json({ message: "Error creating gallery item", error });
//     }
// };


// // GET ALL (not deleted)
// exports.getAllGallery = async (req, res) => {
//     try {
//         const items = await Gallery.find({ isDeleted: false }).sort({ createdAt: -1 });
//         const total = await Gallery.countDocuments({ isDeleted: false });
//         res.json({
//             total,
//             data: items
//         });
//     } catch (error) {
//         res.status(500).json({ message: "Error retrieving gallery", error });
//     }
// };

// // GET BY ID
// exports.getGalleryById = async (req, res) => {
//     try {
//         const item = await Gallery.findById(req.params.id);

//         if (!item || item.isDeleted) {
//             return res.status(404).json({ message: "Gallery item not found" });
//         }
//         res.json(item);
//     } catch (error) {
//         res.status(500).json({ message: "Error fetching gallery item", error });
//     }
// };

// // UPDATE
// exports.updateGallery = async (req, res) => {
//     try {
//         const { title, from, link } = req.body;
//         const updateData = { title, from, link, updatedBy: 'admin' };

//         if (req.file?.filename) {
//             updateData.image = req.file.filename;
//         }

//         const updatedItem = await Gallery.findByIdAndUpdate(req.params.id, updateData, {
//             new: true,
//         });

//         if (!updatedItem) {
//             return res.status(404).json({ message: "Gallery item not found" });
//         }

//         res.json({ message: "Gallery item updated", data: updatedItem });
//     } catch (error) {
//         res.status(500).json({ message: "Error updating gallery item", error });
//     }
// };

// // SOFT DELETE
// exports.deleteGallery = async (req, res) => {
//     try {
//         const deleted = await Gallery.findByIdAndUpdate(req.params.id, {
//             isDeleted: true,
//             updatedBy: 'admin',
//         }, { new: true });

//         if (!deleted) {
//             return res.status(404).json({ message: "Gallery item not found" });
//         }

//         res.json({ message: "Gallery item deleted (soft)", data: deleted });
//     } catch (error) {
//         res.status(500).json({ message: "Error deleting gallery item", error });
//     }
// };

// // HARD DELETE
// exports.hardDeleteGallery = async (req, res) => {
//     try {
//         const deleted = await Gallery.findByIdAndDelete(req.params.id);

//         if (!deleted) {
//             return res.status(404).json({ message: "Gallery item not found" });
//         }

//         res.json({ message: "Gallery item permanently deleted", data: deleted });
//     } catch (error) {
//         res.status(500).json({ message: "Error permanently deleting gallery item", error });
//     }
// };


// CREATE
exports.createGallery = async (req, res) => {
    try {
        const { title, from, link, date } = req.body;
        // const image = req.file ? `/public/gallery/${req.file.filename}` : null;
        const image = req.file ? req.file.path : null;


        if (!image) return res.status(400).json({ error: "Image is required." });

        const service = new Gallery({
            image,
            title,
            from,
            date: date ? new Date(date) : new Date(),
            link,
            createdBy: 'admin',
        });

        const saved = await service.save();

        res.status(201).json({ data: saved }); // Standardized response
    } catch (error) {
        res.status(500).json({ error: error.message || "Error creating gallery item" });
    }
};

// GET ALL (not deleted)
exports.getAllGallery = async (req, res) => {
    try {
        const items = await Gallery.find({ isDeleted: false }).sort({ createdAt: -1 });
        const total = await Gallery.countDocuments({ isDeleted: false });
        res.json({ data: items, total }); // Already consistent
    } catch (error) {
        res.status(500).json({ error: error.message || "Error retrieving gallery" });
    }
};

exports.getGalleryById = async (req, res) => {
    try {
        const item = await Gallery.findById(req.params.id);
        if (!item || item.isDeleted) {
            return res.status(404).json({ error: "Gallery item not found" });
        }
        res.json({ data: item });
    } catch (error) {
        res.status(500).json({ error: error.message || "Error fetching gallery item" });
    }
};



// UPDATE
exports.updateGallery = async (req, res) => {
    try {
        const { title, from, link, date } = req.body;
        const updateData = { title, from, link, date, updatedBy: 'admin' };

        // if (req.file?.filename) {
        //     updateData.image = `/public/gallery/${req.file.filename}`; // Ensure path consistency
        // }
        if (req.file?.path) {
            updateData.image = req.file.path;
        }

        const updatedItem = await Gallery.findByIdAndUpdate(req.params.id, updateData, {
            new: true,
        });

        if (!updatedItem) {
            return res.status(404).json({ error: "Gallery item not found" });
        }

        res.json({ data: updatedItem }); // Standardized response
    } catch (error) {
        res.status(500).json({ error: error.message || "Error updating gallery item" });
    }
};

// SOFT DELETE
exports.deleteGallery = async (req, res) => {
    try {
        const deleted = await Gallery.findByIdAndUpdate(req.params.id, {
            isDeleted: true,
            updatedBy: 'admin',
        }, { new: true });

        if (!deleted) {
            return res.status(404).json({ error: "Gallery item not found" });
        }

        res.json({ data: deleted }); // Standardized response
    } catch (error) {
        res.status(500).json({ error: error.message || "Error deleting gallery item" });
    }
};

// HARD DELETE
exports.hardDeleteGallery = async (req, res) => {
    try {
        const deleted = await Gallery.findByIdAndDelete(req.params.id);

        if (!deleted) {
            return res.status(404).json({ error: "Gallery item not found" });
        }

        res.json({ data: deleted }); // Standardized response
    } catch (error) {
        res.status(500).json({ error: error.message || "Error permanently deleting gallery item" });
    }
};