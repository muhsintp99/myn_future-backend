const express = require('express');
const router = express.Router();
const countryController = require('../Controllers/countryController');
// const createUpload = require('../middlewares/upload');
const createUpload = require('../middlewares/cloudinaryUpload');

const { requireSignIn, isAdminOrLicensee } = require('../middlewares/authMiddleware');

const uploadCountryImage = createUpload.createUpload('country');

router.post('/', (req, res, next) => {
    uploadCountryImage(req, res, err => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, requireSignIn, countryController.createCountry);

router.get('/', countryController.getAllCountries);

router.get('/count', countryController.getCountryCount);


router.get('/:id', countryController.getCountryById);

router.put('/:id', (req, res, next) => {
    uploadCountryImage(req, res, err => {
        if (err) return res.status(400).json({ error: err.message });
        next();
    });
}, requireSignIn,isAdminOrLicensee, countryController.updateCountry);

router.delete('/:id', requireSignIn,isAdminOrLicensee, countryController.deleteCountry);

module.exports = router;
