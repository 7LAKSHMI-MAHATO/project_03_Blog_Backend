const {ImageKit} = require("@imagekit/nodejs/index.js")

const imagekit = new ImageKit({
    publicKey: process.env.IMAGEKIT_PUBLIC_KEY,
    privateKey: process.env.IMAGEKIT_PRIVATEKEY,
    urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT
})



async function uploadfile(buffer){
    // console.log(buffer)

    const result = await imagekit.files.upload({
        file: buffer.toString("base64"),
        fileName: "image.jpg"
    })
    return result
    
}

module.exports = uploadfile