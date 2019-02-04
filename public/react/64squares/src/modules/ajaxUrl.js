const BASEURL = "http://localhost:3001/";

export default {
    login : BASEURL+"user/login",
    islogin : BASEURL+"user/islogin",
    logout:BASEURL+"user/logout",
    skip:BASEURL+"pool/skip",
    signup : BASEURL+"user/signup",
    searchGame : BASEURL+"pool/search",
    joinMatch : BASEURL+'pool/match/join',
    updateMatch:BASEURL+"pool/match/update",
    matchList: BASEURL+"pool/match/list",
    matchWatch:BASEURL+"pool/match/watch",
    makeForfeit:BASEURL+"pool/match/forfeit",
    getMatchHis:BASEURL+"user/matchhistory",

}