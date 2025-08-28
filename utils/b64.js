import { isoBase64URL } from "@simplewebauthn/server/helpers";

const toB64 = (buf) => isoBase64URL.encode(Buffer.from(buf));
const fromB64 = (str) => Buffer.from(isoBase64URL.toBuffer(str));   

export { toB64, fromB64 };
