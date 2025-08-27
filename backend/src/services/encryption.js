import crypto from "crypto"
export const DecryptBid = (password, text) => {
    const algorithm = 'aes-128-ctr'; // Change to 128-bit
    const key = Buffer.concat([Buffer.from(password), Buffer.alloc(16)], 16); // 16 bytes key
    const iv = Buffer.from(text.substring(0, 32), 'hex');
    const encryptedText = Buffer.from(text.substring(32), 'hex');
    const decipher = crypto.createDecipheriv(algorithm, key, iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
}

export const EncryptBid = (password, text) => {
    const algorithm = 'aes-128-ctr'; // Change to 128-bit
    const key = Buffer.concat([Buffer.from(password), Buffer.alloc(16)], 16); // 16 bytes key
    const iv = crypto.randomBytes(16); // IV stays 16 bytes for CTR mode
    console.log("iv",iv)
    const cipher = crypto.createCipheriv(algorithm, key, iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + encrypted.toString('hex');
}