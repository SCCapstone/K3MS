
const BASE_URL="http://localhost:8000/"

module.exports = global.config = {
    HOME_URL: BASE_URL,
    DASHBOARD_URL: BASE_URL + "dashboard",
    LOGIN_URL: BASE_URL + "login",
    LOGOUT_URL: BASE_URL + "logout",
    GRANTS_URL: BASE_URL + "tmp_get_grants",
    PUBS_URL: BASE_URL + "tmp_get_pubs",
    EXPEN_URL: BASE_URL + "tmp_get_expen"
}
