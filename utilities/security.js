import crypto from "crypto"
const algorithm = 'aes-256-ctr';
const ENCRYPTION_KEY = "bEBZC58pWjynUxcosZR9WtSEQR2020QK3gnM2Eadbf3o19Wpz2kjiTLscr";
const IV_LENGTH = 16;

export const generatePassword = (password) => {
    const salt = crypto.randomBytes(16).toString('hex');
    return  {
        salt: salt,
        hash: crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex')
    }
};

export const validPassword =  (user, password) => {
    const hash = crypto.pbkdf2Sync(password, user.salt, 1000, 64, 'sha512').toString('hex');
    return user.hash === hash;
};

export const generateCode = (size) => {
    return crypto.randomBytes(size).toString('hex');
};

export const encrypt = (text) => {
    let iv = crypto.randomBytes(IV_LENGTH);
    let cipher = crypto.createCipheriv(algorithm, Buffer.concat([Buffer.from(ENCRYPTION_KEY), Buffer.alloc(32)], 32), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    return iv.toString('hex') + ':' + encrypted.toString('hex')
}

export const decrypt = (text) => {
    let textParts = text.split(':');
    let iv = Buffer.from(textParts.shift(), 'hex');
    let encryptedText = Buffer.from(textParts.join(':'), 'hex');
    let decipher = crypto.createDecipheriv(algorithm, Buffer.concat([Buffer.from(ENCRYPTION_KEY), Buffer.alloc(32)], 32), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString()
}