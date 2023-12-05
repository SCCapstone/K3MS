
const BASE_URL="http://localhost:8000/"

module.exports = global.config = {
    HOME_URL: BASE_URL,
    DASHBOARD_URL: BASE_URL + "dashboard",
    LOGIN_URL: BASE_URL + "login",
    LOGOUT_URL: BASE_URL + "logout",
    GRANTS_URL: BASE_URL + "grants",
    PUBS_URL: BASE_URL + "publications",
    EXPEN_URL: BASE_URL + "tmp_get_expen",
    STUDENT_EVALS_URL: BASE_URL + "student_evals",
    GRANT_UPLOAD_URL: BASE_URL + "grantupload",
    PUB_UPLOAD_URL: BASE_URL + "pubupload",
    EVAL_UPLOAD_URL: BASE_URL + "evalupload",
}
