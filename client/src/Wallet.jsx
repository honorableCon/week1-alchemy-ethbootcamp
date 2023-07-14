import server from "./server";

import { secp256k1 } from "ethereum-cryptography/secp256k1";
import { toHex } from "ethereum-cryptography/utils";

function Wallet({
  publicKey,
  setPublicKey,
  balance,
  setBalance,
  privateKey,
  setPrivateKey,
}) {
  async function onChange(evt) {
    const address = evt.target.value;
    setPrivateKey(address);
    if (address) {
      const _publicKey = toHex(secp256k1.getPublicKey(address));
      setPublicKey(_publicKey);
      const {
        data: { balance },
      } = await server.get(`balance/${_publicKey}`);
      setBalance(balance);
    } else {
      setBalance(0);
    }
  }

  return (
    <div className="container wallet">
      <h1>Your Wallet</h1>

      <label>
        Private Key
        <input
          placeholder="Type an address, for example: 0x1"
          value={privateKey}
          onChange={onChange}
        ></input>
      </label>

      {publicKey?.length && (
        <div className="balance">Public Key : {publicKey.slice(1, 20)}</div>
      )}

      <div className="balance">Balance: {balance}</div>
    </div>
  );
}

export default Wallet;
