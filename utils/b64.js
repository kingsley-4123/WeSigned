const toB64 = (buf) => Buffer.from(buf).toString('base64url');  //Convert to base64URL
const fromB64 = (str) => Buffer.from(str, 'base64url');           // Convert back to Buffer
export { toB64, fromB64 };