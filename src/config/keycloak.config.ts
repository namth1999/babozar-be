const session = require('express-session');
const Keycloak = require('keycloak-connect');

let keycloak : any;
const memoryStore = new session.MemoryStore();

let keycloakConfig = {
    clientId: 'BoroBazar',
    bearerOnly: true,
    serverUrl: 'https://ec2-3-65-36-66.eu-central-1.compute.amazonaws.com:8443/auth',
    realm: 'nodejs-keycloak-aws',
    realmPublicKey: 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAydajD6GvgAJ8zBfHtTg1xo5LVEZsii9SwcHpj3l85E+Ospg9Svg/Ap51lWnNSf2xiuN+5QmZBkz17JM52NMENqrR2EMLYvQY1XKFL+lrHdTgf3EKvpVLAl3WeEE64JNrZWwPeZh1gXfcO8K30H4qNeU+uDiPK5Fo+ObU2DuukyCV3DM+yq+ZSNVfew3MHMWqx5J52GJd6z/PIbU67lgTgdMLh5ZKWsNavBE9/cwP85Xhhfg1iQsc6KnzUfrk13VBP9IMtSFjyDNh+wz84tKM+vvzRkhUFWTEfTqgt5yUkPQ8Nbc7c25iuFT80pYZ32WlwY6sl40oZCMP2O9oZPNvEQIDAQAB'
};

function initKeycloak() {
    if (keycloak) {
        console.warn("Trying to init Keycloak again!");
        return keycloak;
    }
    else {
        console.log("Initializing Keycloak...");
        keycloak = new Keycloak({
            store: memoryStore
        }, keycloakConfig);
        return keycloak;
    }
}

function getKeycloak() {
    if (!keycloak){
        console.error('Keycloak has not been initialized. Please called init first.');
    }
    return keycloak;
}


module.exports = {
    initKeycloak,
    getKeycloak,
    memoryStore,
};
