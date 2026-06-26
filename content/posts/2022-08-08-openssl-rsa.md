---
title: "OpenSSL RSA 加密的一个认知盲区"
date: 2022-08-08 17:09:43
author: "haoxiqiang"
tags: ["openssl", "rsa", "cryptography"]
categories: ["Security"]
ShowToc: true
TocOpen: false
---

原本对 RSA 不同加密方式的区别和使用场景还是很清楚的。今天在实现一个 RSA 加密功能时，发现公钥加密结果每次都不一样，这个现象触发了我的盲区。查阅相关资料后，记录一下背后的原理。

## 问题现象

以下代码使用 OpenSSL 的 EVP API 进行 RSA 加密，没有显式传入随机值，但每次运行结果都不相同：

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

## 原因：随机填充

**不管是 RSA 私钥签名还是公钥加密，操作中都需要对待处理数据先进行填充，再对填充后的数据进行加密运算。** 填充过程中引入了伪随机数，所以即使相同的输入和密钥，每次输出都不同。

### 填充方式详解

标准 RSA 操作中，数据长度必须小于密钥长度。在实际应用（如代码中使用的 OAEP 填充）中，填充有以下作用：

| 填充方式 | 规范 | 特点 |
|----------|------|------|
| **PKCS#1 v1.5** | RFC 2313 | 传统填充，历史最久，但存在 Bleichenbacher 填充预言攻击 |
| **OAEP** | PKCS#1 v2.0 (RFC 2437) / v2.1 (RFC 3447) | 最优非对称加密填充，推荐用于新应用，引入随机性 |
| **PSS** | PKCS#1 v2.1 | 用于签名，也是概率性的 |

OAEP（Optimal Asymmetric Encryption Padding）通过在数据前添加随机掩码，确保了加密结果每次不同。这正是代码中 `RSA_PKCS1_OAEP_PADDING` 的表现。

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

## 参考资源

- [RFC 2313 — PKCS #1: RSA Encryption Version 1.5](https://www.rfc-editor.org/rfc/rfc2313)
- [RFC 2437 — PKCS #1: RSA Cryptography Specifications Version 2.0](https://www.rfc-editor.org/rfc/rfc2437)
- [RFC 3447 — PKCS #1: RSA Cryptography Specifications Version 2.1](https://www.rfc-editor.org/rfc/rfc3447)
- [OpenSSL 官方文档 — RSA_public_encrypt](https://docs.openssl.org/1.1.1/man3/RSA_public_encrypt/)
- [OpenSSL 3.x EVP RSA 文档](https://docs.openssl.org/3.2/man7/EVP_ASYM_CIPHER-RSA/)
- [Wikipedia — Optimal Asymmetric Encryption Padding](https://en.wikipedia.org/wiki/Optimal_asymmetric_encryption_padding)
