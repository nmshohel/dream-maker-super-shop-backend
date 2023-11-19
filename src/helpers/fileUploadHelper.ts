import { v2 as cloudinary } from 'cloudinary';
          
cloudinary.config({ 
  cloud_name: 'dd9s9rahp', 
  api_key: '874434914241258', 
  api_secret: '9UoyJR-indDrfUIzDPMGLsf0XzY' 
});

const uploadToCloudinary=async()=>{
    cloudinary.uploader.upload("https://upload.wikimedia.org/wikipedia/commons/a/ae/Olympic_flag.jpg",
    { public_id: "olympic_flag" }, 
    function(error, result) {console.log(result); });
}

export const FileUploadHelper={
    uploadToCloudinary
}