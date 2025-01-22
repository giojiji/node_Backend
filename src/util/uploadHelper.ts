import multer from "multer";
import { Request } from "express";

const profileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = new Date().toISOString().replace(/[:.]/g, "-");
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const productStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/product_images");
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = new Date().toISOString().replace(/[:.]/g, "-");
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});


const fileFilter = (req: Request, file: Express.Multer.File, cb: (error: null, acceptFile: boolean) => void) => {
  if (file.mimetype === "image/png" || file.mimetype === "image/jpeg" || file.mimetype === "image/jpg") {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

export const uploadProfilePicture = multer({ storage: profileStorage, fileFilter: fileFilter }).single("image");

export const uploadProductImages = multer({ storage: productStorage, fileFilter: fileFilter }).array("productImages", 5);
