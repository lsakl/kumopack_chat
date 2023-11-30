const StorageFile = require("../models/storage.model.js");
const authHealper = require('../helper/auth.helper');
const fileHelper  = require('../helper/file.helper');
const fs          = require('fs');
const path        = require('path');

exports.upload = (req, res) => {
  const tokenData     = authHealper.decodeToken(req);
  const timeStamp     = new Date().getTime();
  const fileName      = timeStamp+'_'+req.file.originalname;

  let typeSelect;
  if (req.file.mimetype.startsWith('image')) {
    typeSelect = '/images/';
  } else {
    typeSelect = '/files/';
  }

  const filePath = __dirname+'./../'+process.env.FILE_STORAGE+'/'+tokenData.id+typeSelect+fileName;
  if (!fs.existsSync(path.dirname(filePath))) {
    fs.mkdirSync(path.dirname(filePath), { recursive: true });
  }

  fs.writeFile(filePath, req.file.buffer, (writeErr) => {
    if (writeErr) {
      res.status(500).send({ status: 500, message: "เกิดข้อผิดพลาดในการบันทึกข้อมูล", data: writeErr });
      return;
    }

    res.status(200).send({ status: 200, message: "บันทึกข้อมูลเรียบร้อย", data: {
        url:'/'+process.env.FILE_STORAGE+'/'+tokenData.id+typeSelect+fileName,
        name: req.file.originalname,
        size: req.file.size,
        sizeText: fileHelper.convertFileSize(req.file.size),
        type: typeSelect == '/images/' ? 'image' : 'file',
        datetime:new Date()
      } 
    });
  });

};

exports.getFile = (req, res) => {
  const ext = path.extname(req.params.filename);
  const headerStream = fileHelper.headerStream(ext);

  if(headerStream === false) {
    res.status(404).send({ status: 404, message: "ไม่พบไฟล์ที่ร้องขอ" });
    return;
  }

  const filePath = path.join(__dirname, './../', process.env.FILE_STORAGE, req.params.userId, req.params.type, req.params.filename);

  fs.readFile(filePath, (err, data) => {
    if (err) {
      res.status(404).send({ status: 404, message: "ไม่พบไฟล์ที่ร้องขอ" });
      return;
    }
    
    res.writeHead(200, { 'Content-Type': headerStream });
    res.end(data);
  });
};