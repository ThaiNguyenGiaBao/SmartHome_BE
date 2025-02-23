import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import storage from "../configs/firebase";

export type FileObject = {
    originalname: string; // The original name of the file
    buffer: Buffer; // The file data in a buffer
    mimetype: string; // The MIME type of the file
};

async function uploadFile(file: FileObject) {
    try {
        // Check if the file object is provided
        if (!file) {
            throw new Error("No file provided for upload.");
        }

        // Generate a unique filename using the current timestamp
        const timestamp = Date.now();
        const uniqueFilename = `${timestamp}-${file.originalname}`;
        const storageRef = ref(storage, file.originalname);

        // Upload the file to Firebase Storage
        await uploadBytes(storageRef, file.buffer, {
            contentType: file.mimetype
        });

        // Get the download URL of the uploaded file
        const downloadURL = await getDownloadURL(storageRef);

        return downloadURL; // Return the download URL
    } catch (error: any) {
        console.error("Upload error:", error.message);
        throw new Error(error.message);
    }
}

export default uploadFile;
