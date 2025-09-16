const toBase64 = (str) => {
	  return Buffer.from(str).toString('base64url');
}

const fromBase64 = (b64) => {
	  return Buffer.from(b64, 'base64url');
}

export { toBase64, fromBase64 };