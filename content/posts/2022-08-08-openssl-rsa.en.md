---
title: "A Blind Spot in RSA Encryption with OpenSSL"
date: 2022-08-08 17:09:43
slug: "openssl-rsa"
author: "haoxiqiang"
tags: ["openssl", "rsa", "cryptography"]
categories: ["Security"]
ShowToc: true
TocOpen: false
---

I thought I had a solid understanding of the differences between RSA encryption schemes and their use cases. But while implementing RSA encryption today, I noticed something puzzling: the ciphertext was different every time, even with the same plaintext and public key. This was a blind spot for me. After researching the internals, here is what I found.

## The Issue

The following code uses OpenSSL's EVP API for RSA encryption. No random value is explicitly provided, yet the output differs on every call:

```c
unsigned char *encode_by_rsa(const char *public_key, unsigned const char *input) {

    int key_len = (int) strlen(public_key);
    BIO *bio = BIO_new_mem_buf(public_key, key_len);
    EVP_PKEY *pKey = PEM_read_bio_PUBKEY(bio, NULL, NULL, NULL);
    BIO_free_all(bio);

    EVP_PKEY_CTX *ctx = EVP_PKEY_CTX_new(pKey, NULL);
    EVP_PKEY_encrypt_init(ctx);
    EVP_PKEY_CTX_set_rsa_padding(ctx, RSA_PKCS1_OAEP_PADDING);
    EVP_PKEY_CTX_set_rsa_oaep_md(ctx, EVP_sha256());
    EVP_PKEY_CTX_set_rsa_mgf1_md(ctx, EVP_sha256());

    size_t rsa_len = (int) RSA_LENGTH;

    unsigned char *encrypted_data = malloc(rsa_len + 1);
    memset(encrypted_data, 0, rsa_len + 1);
    if (encrypted_data == NULL) {
        return NULL;
    }

    int input_len = (int) strlen((const char *) input);
    EVP_PKEY_encrypt(ctx, encrypted_data, &rsa_len, input, input_len);

    encrypted_data[rsa_len] = '\0';

    EVP_PKEY_CTX_free(ctx);
    EVP_PKEY_free(pKey);

    return encrypted_data;
}
```

## The Root Cause: Randomized Padding

**Whether using an RSA private key for signing or a public key for encryption, the data must first be padded before the cryptographic operation. The padding process introduces pseudo-randomness.** This is why the same input with the same key produces different output each time.

### Padding Schemes

In standard RSA operations, the data length must be less than the key length. Modern padding schemes (such as OAEP used in the code) serve dual purposes:

| Padding Scheme | Standard | Characteristics |
|----------------|----------|-----------------|
| **PKCS#1 v1.5** | RFC 2313 | Legacy padding, widely used historically, but vulnerable to Bleichenbacher padding oracle attacks |
| **OAEP** | PKCS#1 v2.0 (RFC 2437) / v2.1 (RFC 3447) | Optimal Asymmetric Encryption Padding, recommended for new applications, introduces randomness |
| **PSS** | PKCS#1 v2.1 | For signatures only, also probabilistic |

OAEP works by prepending a random mask to the data before encryption. This mask is generated using cryptographic primitives (MGF1 in the code) and ensures the ciphertext is different each time — exactly what `RSA_PKCS1_OAEP_PADDING` triggers in the example.

## Python Sample

```python
import base64

from Crypto import Random
from Crypto.Cipher import PKCS1_v1_5
from Crypto.PublicKey import RSA

random_generator = Random.new().read
private_key = RSA.generate(2048)
public_key = private_key.publickey()


def rsa_encrypt(data):
    key = RSA.importKey(public_key.exportKey())
    cipher = PKCS1_v1_5.new(key)
    cipher_text = base64.b64encode(cipher.encrypt(data))
    return cipher_text


def rsa_decode(encrypt_text):
    key = RSA.importKey(private_key.exportKey())
    cipher = PKCS1_v1_5.new(key)
    text = cipher.decrypt(base64.b64decode(encrypt_text), random_generator)
    return text


def main():
    data = "Hello, world!"
    encrypt_text = rsa_encrypt(data.encode())
    print("encrypt_text", encrypt_text)
    decrypt_text = rsa_decode(encrypt_text)
    print("decrypt_text", decrypt_text.decode())


if __name__ == "__main__":
    main()
```

## References

- [RFC 2313 — PKCS #1: RSA Encryption Version 1.5](https://www.rfc-editor.org/rfc/rfc2313)
- [RFC 2437 — PKCS #1: RSA Cryptography Specifications Version 2.0](https://www.rfc-editor.org/rfc/rfc2437)
- [RFC 3447 — PKCS #1: RSA Cryptography Specifications Version 2.1](https://www.rfc-editor.org/rfc/rfc3447)
- [OpenSSL Documentation — RSA_public_encrypt](https://docs.openssl.org/1.1.1/man3/RSA_public_encrypt/)
- [OpenSSL 3.x EVP RSA Documentation](https://docs.openssl.org/3.2/man7/EVP_ASYM_CIPHER-RSA/)
- [Wikipedia — Optimal Asymmetric Encryption Padding](https://en.wikipedia.org/wiki/Optimal_asymmetric_encryption_padding)
