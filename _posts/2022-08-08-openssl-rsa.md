# 2022-08-08-openssl-rsa
---
layout: post
title:  openssl-rsa 新的认知
date:   2022-08-08 17:09:43
author: haoxiqiang
categories: blog
tags: [openssl,rsa]
image:
  feature:
  teaser:
  credit:
  creditlink:
---

我本来很清楚不同加密方式的区别和使用,今天在写一个RSA的时候发现公钥加密出来的结果每次都不一样,这就触发了盲点,很奇怪这里的实现,去看了一下原理

我的使用代码如下

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
可以看到,没有随机值传入,但是每次的调用结果是不同的,原因是:
**不管是使用RSA私钥进行签名还是公钥进行加密，操作中都需要对待处理的数据先进行填充，然后再对填充后的数据进行加密处理。**
[RFC2313](https://www.rfc-editor.org/rfc/rfc2313.html)
[RFC2313#section-8.1](https://www.rfc-editor.org/rfc/rfc2313.html#section-8.1)
有说明 PKCS 填充有不同的方式,每次在数据被加密前都会使用伪随机数进行填充
以代码中的OAEP填充为例 [Optimal_asymmetric_encryption_padding](https://en.wikipedia.org/wiki/Optimal_asymmetric_encryption_padding)
[RSA组件之最优非对称加密填充(OAEP)的实现](https://blog.csdn.net/guyongqiangx/article/details/121055655)

以前确实没有看这里面的的实现.