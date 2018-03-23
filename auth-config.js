export default {
    endpoint: "auth",
    configureEndpoints: ["auth", "core", "pos"],

    loginUrl: "/authenticate",
    profileUrl: "/me",

    authTokenType:"Bearer",
    //authTokenType: "JWT",
    accessTokenProp: "data",

    storageChangedReload: true
};