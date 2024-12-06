const express = require('express')
const authMiddleware = require('../middlewares/authe')
const {upload,handleMulterError} = require('../config/multer.config')
const {supabase} = require('../config/supabase.config')
const fileModal = require('../models/index.modal')
const path = require('path');

const router = express.Router();

router.get('/home',authMiddleware, async(req,res)=> {
  const userFiles = await fileModal.find({
    user:req.user.userId
  })
  console.log(userFiles)
    res.render('home',{
      files:userFiles
    })
})

router.post('/upload',authMiddleware, upload.single('file'),
async(req,res,next) => {
    try {
        // Check if file exists
        console.log(req.file)
        console.log('File upload request received');
        console.log('Req file:', req.file);
        if (!req.file) {
           console.log("Error throw from /upload")
          return res.status(400).json({ error: 'No file uploaded' });
        }
  
        // Generate a unique filename
        const fileName = `${Date.now()}_${req.file.originalname}`;
  
        // Upload to Supabase storage
        const { data, error } = await supabase.storage
          .from('Drive')
          .upload(fileName, req.file.buffer, {
            cacheControl: '3600',
            upsert: false
          });
  
        if (error) {
          throw error;
        }
  
        // Get public URL
        const { data: { publicUrl } } = supabase.storage
          .from('Drive')
          .getPublicUrl(fileName);
  
        // res.json({
        //   message: 'File uploaded successfully',
        //   fileUrl: publicUrl
        // });

        //Schema update
          const newFile = await fileModal.create({
            path: publicUrl,
            originalname: req.file.originalname,
            user: req.user.userId
        })
    
        res.redirect('/home')

      } catch (error) {
        next(error);
      }

      handleMulterError
}
)

router.get('/download/:path', authMiddleware, async(req, res) => {
  const loggedInUserId = req.user.userId; // Fixed potential typo in userID
  const filePath = req.params.path;

  try {
    // First, verify the file belongs to the logged-in user
    const file = await fileModal.findOne({
      user: loggedInUserId,
      path: filePath
    });

    if (!file) {
      return res.status(401).json({
        message: 'Unauthorized'
      });
    }

    // Extract the filename from the public URL
    const filename = filePath.split('/').pop();

    // Fetch the file from Supabase storage
    const { data, error } = await supabase.storage
      .from('Drive')
      .download(filename);

    if (error) {
      console.error('Download error:', error);
      return res.status(500).json({ message: 'Error downloading file' });
    }

    // Set headers for file download
    res.setHeader('Content-Disposition', `attachment; filename="${file.originalname}"`);
    res.setHeader('Content-Type', 'application/octet-stream');

    // Send the file buffer
    res.send(data);

  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;