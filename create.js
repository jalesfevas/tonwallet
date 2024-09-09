const TonWeb = require('tonweb');
const fs = require('fs');
const bip39 = require('bip39');
const { HDKey } = require('ethereum-cryptography/hdkey');

// Initialize TONWeb
const tonweb = new TonWeb();

function generateSeedPhrase() {
    return bip39.generateMnemonic(256); // 256 bits for 24 words
}

function generateKeyPairFromSeed(seedPhrase) {
    const seed = bip39.mnemonicToSeedSync(seedPhrase);
    const hdKey = HDKey.fromMasterSeed(seed);
    return {
        publicKey: hdKey.publicKey.toString('hex'),
        privateKey: hdKey.privateKey.toString('hex')
    };
}

async function createWallets(numWallets) {
    const wallets = [];
    
    for (let i = 0; i < numWallets; i++) {
        const seedPhrase = generateSeedPhrase();
        const keyPair = generateKeyPairFromSeed(seedPhrase);
        
        wallets.push({
            seedPhrase,
            publicKey: keyPair.publicKey,
            privateKey: keyPair.privateKey
        });
    }
    
    return wallets;
}

(async () => {
    const numWallets = 150;
    const wallets = await createWallets(numWallets);
    
    // Save the wallets to a file
    const data = wallets.map(wallet => 
        `Seed Phrase: ${wallet.seedPhrase}\nPublic Key: ${wallet.publicKey}\nPrivate Key: ${wallet.privateKey}\n`
    ).join('\n');
    
    fs.writeFileSync('data.txt', data);
    
    console.log('Generated Wallets have been saved to data.txt');
})();
