const { BlobServiceClient } = require("@azure/storage-blob");
const { DefaultAzureCredential } = require('@azure/identity');
const { v1: uuidv1 } = require("uuid");
require("dotenv").config();

export async function login() {
    console.log("Azure Blob storage Log In");
    const accountName = "anniximagestorage";
    if (!accountName) throw Error('Azure Storage not found');

    // const blobServiceClient = new BlobServiceClient(
    //     `https://${accountName}.blob.core.windows.net`,
    //     new DefaultAzureCredential()
    // );
    const AZURE_STORAGE_CONNECTION_STRING = "BlobEndpoint=https://anniximagestorage.blob.core.windows.net/;QueueEndpoint=https://anniximagestorage.queue.core.windows.net/;FileEndpoint=https://anniximagestorage.file.core.windows.net/;TableEndpoint=https://anniximagestorage.table.core.windows.net/;SharedAccessSignature=sv=2022-11-02&ss=bfqt&srt=sco&sp=rwdlacupiytfx&se=2024-03-31T10:35:38Z&st=2024-03-28T02:35:38Z&spr=https&sig=HtwGOMjq4h%2FkAEL6BG3McxKv5ONLgsSyFpFThWN4hW4%3D"
    console.log("connnect   " + AZURE_STORAGE_CONNECTION_STRING);
    const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
    console.log("connnect   " + blobServiceClient);
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

    const uploadBlobResponse = await blobClient.uploadBrowserData(image);
    console.log(
        `Image ${blobName} was uploaded successfully. requestId: ${uploadBlobResponse.requestId}`
    );
    console.log(`Blob URL: ${blobClient.url}`)
    return blobName;
}

export async function getImageFromStorage(blobName, path) {
    const containerClient = await login();
    const blobClient = containerClient.getBlockBlobClient(blobName);
    await blobClient.downloadToFile(path);
    console.log(`download of ${blobName} success`);
}

// async function main() {
//     uploadImageToStorage("corn.jpg");
//     getImageFromStorage("65255080-eca4-11ee-8d52-cf062308ad6c.jpeg", "./downloaded.jpg")
// }
// main()
//     .then(() => console.log("Done"))
//     .catch((ex) => console.log(ex.message));