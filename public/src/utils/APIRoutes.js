// Single host constant for now (user will adjust later if deploying)
export const host = "https://abhi-chat-app.onrender.com";

export const registerRoute = `${host}/api/auth/register`;
export const LoginRoute = `${host}/api/auth/login`;
export const setAvatarRoute = `${host}/api/auth/setavatar`; // backend route is lowercase
export const logoutRoute = `${host}/api/auth/logout`;
export const allUsersRoute = `${host}/api/auth/allusers`;
export const sendMessageRoute = `${host}/api/messages/addmsg`;
export const getAllMessageRoute = `${host}/api/messages/getmsg`;

