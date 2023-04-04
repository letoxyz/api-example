/* eslint-disable no-extend-native */

// @ts-expect-error 🚧 ETHERS 6.1.0 IS BROKEN. THIS IS A WORKAROUND
BigInt.prototype.toJSON = function () {
  return this.toString()
}
