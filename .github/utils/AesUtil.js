(function (_global) {
  var _AesUtil = function AesUtil(keySize, iterationCount) {
    this.keySize = keySize / 32;
    this.iterationCount = iterationCount;
  };

  _AesUtil.prototype.generateKey = function (salt, passPhrase) {
    var key = CryptoJS.PBKDF2(
      passPhrase,
      CryptoJS.enc.Hex.parse(salt),
      { keySize: this.keySize, iterations: this.iterationCount });
    return key;
  }

  _AesUtil.prototype.encrypt = function (salt, iv, passPhrase, plainText) {
    var key = this.generateKey(salt, passPhrase);
    var encrypted = CryptoJS.AES.encrypt(
      plainText,
      key,
      { iv: CryptoJS.enc.Hex.parse(iv) });
    return encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  }

  _AesUtil.prototype.decrypt = function (salt, iv, passPhrase, cipherText) {
    var key = this.generateKey(salt, passPhrase);
    var cipherParams = CryptoJS.lib.CipherParams.create({
      ciphertext: CryptoJS.enc.Base64.parse(cipherText)
    });
    var decrypted = CryptoJS.AES.decrypt(
      cipherParams,
      key,
      { iv: CryptoJS.enc.Hex.parse(iv) });
    return decrypted.toString(CryptoJS.enc.Utf8);
  }

  var AesUtilFactory = function AesUtilFactory(keySize, iterationCount) {
    return new _AesUtil(keySize, iterationCount);
  }

  var getDefaultConfig = function defaultConfig() {
    return {
      keySize: 128,
      iterationCount: 10000,
      iv: CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex),
      salt: CryptoJS.lib.WordArray.random(128 / 8).toString(CryptoJS.enc.Hex),
      passPhrase: "vs@123"
    };
  }

  var extractConfig = function extractConfig(encryptData) {
    var decodedString = getDecodedString(encryptData);
    var decodedStringArr = decodedString.split("::");
    return {
      keySize: decodedStringArr[0],
      iterationCount: decodedStringArr[1],
      iv: decodedStringArr[2],
      salt: decodedStringArr[3],
      passPhrase: getDefaultConfig().passPhrase,
      cipherText: decodedStringArr[4],
    };
  }

  var makeBase64String = function makeBase64String(config, cipherText) {
    return btoa(config.keySize + "::" + config.iterationCount + "::" + config.iv + "::" + config.salt + "::" + cipherText);
  }

  var getDecodedString = function makeBase64String(encodedString) {
    return atob(encodedString);
  }

  var encryptData = function encryptData(data) {
    var config = getDefaultConfig();
    return makeBase64String(config,
      AesUtil(config.keySize, config.iterationCount)
        .encrypt(config.salt, config.iv, config.passPhrase, data)
        .toString(CryptoJS.enc.Base64)
    );
  }

  var decryptData = function decryptData(encryptData) {
    var config = extractConfig(encryptData);
    return AesUtil(config.keySize, config.iterationCount).decrypt(config.salt, config.iv, config.passPhrase, config.cipherText);
  }

  _global.AesUtil = AesUtilFactory;

  _global.AesUtil.encryptData = encryptData;

  _global.AesUtil.decryptData = decryptData;

})(window || this || {});