import { Auth0Client } from "@auth0/nextjs-auth0/server";

// export const GET = handleAuth({
//   login: handleLogin({
//     returnTo: "/profile",
//   }),
//   signup: handleLogin({
//     authorizationParams: {
//       screen_hint: "signup",
//     },
//     returnTo: "/profile",
//   }),
//   logout: handleLogout({
//     returnTo: "/",
//   })
// });

export const GET = new Auth0Client();