
const BASE_URL=`${process.env.REACT_APP_BASE_URL}/`

module.exports = global.config = {
    HOME_URL: BASE_URL,
    DASHBOARD_URL: BASE_URL + "dashboard",
    LIMITED_GRANTS_URL: BASE_URL + "limited_grants",
    LIMITED_PUBS_URL: BASE_URL + "limited_publications",
    LIMITED_EVALS_URL: BASE_URL + "limited_student_evals",
    LIMITED_EXPEN_URL: BASE_URL + "limited_expenditures",

    LOGIN_URL: BASE_URL + "login",
    LOGOUT_URL: BASE_URL + "logout",
    CHECK_AUTH_URL: BASE_URL + "check_auth",

    GRANTS_URL: BASE_URL + "grants",
    PUBS_URL: BASE_URL + "publications",
    EXPEN_URL: BASE_URL + "expenditures",

    STUDENT_EVALS_URL: BASE_URL + "student_evals",
    STUDENT_EVALS_DETAILS_URL: BASE_URL + "student_evals_details",

    COURSE_ANALYTICS_URLS: {
        getAnonData: BASE_URL + "course_analytics",
        getCourses: BASE_URL + "get_courses_for_user",
        getAllCourses: BASE_URL + "get_all_courses_in_db",
        getUsersToChoose: BASE_URL + "get_users_in_chairs_dept",
    },
    TEAM_ASSESSMENTS_URL: BASE_URL + "team_assessments",
    
    GRANT_UPLOAD_URL: BASE_URL + "grantupload",
    PUB_UPLOAD_URL: BASE_URL + "pubupload",
    EVAL_UPLOAD_URL: BASE_URL + "evalupload",
    EXPEN_UPLOAD_URL: BASE_URL + "expenupload",

    EVAL_OVERWRITE_URL: BASE_URL + "overwrite_evals",

    UPDATE_PASSWORD_URL: BASE_URL + "update_password",

    USER_CREATION_URL: BASE_URL + "signup",
    USER_DELETION_URL: BASE_URL + "delete_user",
    USER_UPDATE_URL: BASE_URL + "update_user",

    DELETE_EVALS_URL: BASE_URL + "delete_evals",
    DELETE_ALL_GRANTS_URL: BASE_URL + "delete_all_my_grants",
    DELETE_ALL_PUBS_URL: BASE_URL + "delete_all_my_pubs",
    DELETE_ALL_EXPENS_URL: BASE_URL + "delete_all_my_expens",

    DEC_PLACES: 2
}
