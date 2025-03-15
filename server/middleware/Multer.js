import multer from 'multer'
import path from'path'
import fs from 'fs';

const imageDir = 'public/images';
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}

const storage =multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'public/images')
    },
    filename:function(req,file,cb){
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null,uniqueSuffix +path.extname(file.originalname))
    }
})
const upload= multer({storage:storage})

export default upload