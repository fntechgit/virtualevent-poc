import ReduxWrapper from "./src/state/ReduxWrapper"
import Colors from './src/content/colors.json'

export const wrapRootElement = ReduxWrapper

window.IDP_BASE_URL = process.env.GATSBY_IDP_BASE_URL;
window.SUMMIT_API_BASE_URL = process.env.GATSBY_SUMMIT_API_BASE_URL;
window.SUMMIT_ID = process.env.GATSBY_SUMMIT_ID;
window.OAUTH2_CLIENT_ID = process.env.GATSBY_OAUTH2_CLIENT_ID;
window.SCOPES = process.env.GATSBY_SCOPES;
window.MARKETING_API_BASE_URL = process.env.GATSBY_MARKETING_API_BASE_URL;
window.REGISTRATION_BASE_URL = process.env.GATSBY_REGISTRATION_BASE_URL;
window.AUTHZ_USER_GROUPS = process.env.GATSBY_AUTHZ_USER_GROUPS;
window.AUTHZ_SESSION_BADGE = process.env.GATSBY_AUTHZ_SESSION_BADGE;
window.AUTHORIZED_DEFAULT_PATH = process.env.GATSBY_AUTHORIZED_DEFAULT_PATH;
window.STREAM_IO_API_KEY = process.env.GATSBY_STREAM_IO_API_KEY;
window.STREAM_IO_SSO_SLUG = process.env.GATSBY_STREAM_IO_SSO_SLUG;
window.MUX_ENV_KEY = process.env.GATSBY_MUX_ENV_KEY;

export const onClientEntry = () => {
  // var set at document level
  // preventa widget color flashing from defaults to fetched by widget from marketing api
  Object.entries(Colors.colors).map(color => {
    document.documentElement.style.setProperty(`--${color[0]}`, color[1]);
    document.documentElement.style.setProperty(`--${color[0]}50`, `${color[1]}50`);
  });
}