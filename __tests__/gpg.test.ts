import * as fs from 'fs';
import * as gpg from '../src/gpg';

const userInfo = {
  pgp: fs.readFileSync('test-key.pgp', {
    encoding: 'utf8',
    flag: 'r'
  }),
  pgp_base64: fs.readFileSync('test-key-base64.pgp', {
    encoding: 'utf8',
    flag: 'r'
  }),
  passphrase: fs.readFileSync('test-key.pass', {
    encoding: 'utf8',
    flag: 'r'
  }),
  name: 'Test Passphrase',
  email: 'testpassphrase@bjhargrave.com',
  keyID: 'DB1AD6BC2682797E',
  fingerprint: '747B0C511438B441F40CF54ADB1AD6BC2682797E',
  keygrip: '8DBF9B129CB24B66E12639153681FE26AF5E0E6B'
};

describe('gpg', () => {
  describe('getVersion', () => {
    it('returns GnuPG and libgcrypt version', async () => {
      await gpg.getVersion().then(version => {
        console.log(version);
        expect(version.gnupg).not.toEqual('');
        expect(version.libgcrypt).not.toEqual('');
      });
    });
  });

  describe('getDirs', () => {
    it('returns GnuPG dirs', async () => {
      await gpg.getDirs().then(dirs => {
        console.log(dirs);
        expect(dirs.libdir).not.toEqual('');
        expect(dirs.datadir).not.toEqual('');
        expect(dirs.homedir).not.toEqual('');
      });
    });
  });

  describe('importKey', () => {
    it('imports key (as armored string) to GnuPG', async () => {
      await gpg.importKey(userInfo.pgp).then(output => {
        console.log(output);
        expect(output).not.toEqual('');
      });
    });
    it('imports key (as base64 string) to GnuPG', async () => {
      await gpg.importKey(userInfo.pgp_base64).then(output => {
        console.log(output);
        expect(output).not.toEqual('');
      });
    });
  });

  describe('getKeygrip', () => {
    it('returns the keygrip', async () => {
      await gpg.importKey(userInfo.pgp);
      await gpg.getKeygrip(userInfo.fingerprint).then(keygrip => {
        console.log(keygrip);
        expect(keygrip).toEqual(userInfo.keygrip);
      });
    });
  });

  describe('configureAgent', () => {
    it('configures GnuPG agent', async () => {
      await gpg.configureAgent(gpg.agentConfig);
    });
  });

  describe('presetPassphrase', () => {
    it('presets passphrase', async () => {
      await gpg.importKey(userInfo.pgp);
      const keygrip = await gpg.getKeygrip(userInfo.fingerprint);
      await gpg.configureAgent(gpg.agentConfig);
      await gpg.presetPassphrase(keygrip, userInfo.passphrase).then(output => {
        console.log(output);
        expect(output).not.toEqual('');
      });
    });
  });

  describe('deleteKey', () => {
    it('removes key from GnuPG', async () => {
      await gpg.importKey(userInfo.pgp);
      await gpg.deleteKey(userInfo.fingerprint);
    });
  });

  describe('killAgent', () => {
    it('kills GnuPG agent', async () => {
      await gpg.killAgent();
    });
  });
});
