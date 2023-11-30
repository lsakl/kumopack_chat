module.exports = app => {
  const StorageFile = require("../controllers/storage.controller.js");
  const dotenv      = require('dotenv');
  const authHealper = require('../helper/auth.helper');
  const multer      = require('multer');
  const storage     = multer.memoryStorage();
  const upload      = multer({ storage: storage });
  
  dotenv.config();
    
  app.post("/api/storage", authHealper.checkToken, upload.single('file'), StorageFile.upload);
  app.get( "/api/storage/:userId/:type/:filename",                        StorageFile.getFile);
};