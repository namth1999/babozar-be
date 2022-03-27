const session = require('express-session');
const Keycloak = require('keycloak-connect');

let keycloak : any;
const memoryStore = new session.MemoryStore();

let keycloakConfig = {
    clientId: 'BoroBazar',
    bearerOnly: true,
    serverUrl: 'http://ec2-3-65-36-66.eu-central-1.compute.amazonaws.com:8080/auth',
    realm: 'nodejs-keycloak-aws',
    credentials: {
        secret: 'hfpH5YM99OBtVY71DFiCAVbyptuYgKHf'
}};

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
