const express=require('express');
const multer=require('multer')
const docxtoPDF = require('docx-pdf');
const path = require('path')
const cors=require('cors')
const app=express();
const port=3030;
app.use(cors())

// setting up file storage

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, "uploads")
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname)
    }
  })
  
  const upload =  multer({ storage: storage })
  app.post('/convertFile', upload.single('file'), async (req, res, next)=> {
    try{
        if(!req.file){
            return res.status(400).json({
                message : 'no file uplaoded'
            })
        }
        let ouputPath=path.join(__dirname,'files',`${req.file.originalname}.pdf`)
         await   docxtoPDF(req.file.path,ouputPath,(err,result)=>{
            if(err){
              console.log(err);
              return res.status(500).json({
                message : 'Error converting docx to pdf'
              })
            }
            res.download(ouputPath,()=>{
                console.log('file downloaded')
            })
          });
    } catch (error) {
        console.log(error);
        res.status(500).json({
            message : 'Internal server error'
        })
    }
  })
app .listen(port,()=>{
    console.log('app is listening at port no',port);
    
})