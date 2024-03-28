const { BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require('@azure/identity');
const { v1: uuidv1 } = require("uuid");
require("dotenv").config();

export async function login() {
    console.log("Azure Blob storage Log In");
    const accountName = "anniximagestorage";
    if (!accountName) throw Error('Azure Storage not found');

    const blobServiceClient = new BlobServiceClient(
        `https://${accountName}.blob.core.windows.net`,
        new DefaultAzureCredential()
    );
    const containerClient = blobServiceClient.getContainerClient("images");
    console.log("Azure Blob storage Log In success\n" + containerClient.url);
    return containerClient;


}

export async function uploadImageToStorage(image) {
    const containerClient = await login();
    const blobName = uuidv1() + '.jpeg'; // Assuming the image is in jpeg format
    const blobClient = containerClient.getBlockBlobClient(blobName);

    console.log(
        `\nUploading image to Azure storage as blob\n\tname: ${blobName}:\n\tURL: ${blobClient.url}`
    );

    const uploadBlobResponse = await blobClient.uploadFile(image);
    console.log(
        `Image was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
    );
    console.log(`Blob URL: ${blobClient.url}`)
    return blobClient.url;

}

export async function getImageFromStorage(blobName, path) {
    const containerClient = await login();
    const blobClient = containerClient.getBlockBlobClient(blobName);
    await blobClient.downloadToFile(path);
    console.log(`download of ${blobName} success`);

}

async function main() {
    uploadImageToStorage("corn.jpg");
    getImageFromStorage("65255080-eca4-11ee-8d52-cf062308ad6c.jpeg", "./downloaded.jpg")
}

// main()
//     .then(() => console.log("Done"))
//     .catch((ex) => console.log(ex.message));