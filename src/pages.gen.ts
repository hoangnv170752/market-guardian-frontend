// deno-fmt-ignore-file
// biome-ignore format: generated types do not need formatting
// prettier-ignore
import type { PathsForPages, GetConfigResponse } from 'waku/router';

// prettier-ignore
import type { getConfig as File_404_getConfig } from './pages/_404';
// prettier-ignore
import type { getConfig as File_About_getConfig } from './pages/about';
// prettier-ignore
import type { getConfig as File_DashboardDashboard_getConfig } from './pages/dashboard/dashboard';
// prettier-ignore
import type { getConfig as File_ForgotPassword_getConfig } from './pages/forgot-password';
// prettier-ignore
import type { getConfig as File_SignIn_getConfig } from './pages/sign-in';
// prettier-ignore
import type { getConfig as File_SignUp_getConfig } from './pages/sign-up';

// prettier-ignore
type Page =
| ({ path: '/_404' } & GetConfigResponse<typeof File_404_getConfig>)
| ({ path: '/about' } & GetConfigResponse<typeof File_About_getConfig>)
| ({ path: '/dashboard/dashboard' } & GetConfigResponse<typeof File_DashboardDashboard_getConfig>)
| ({ path: '/forgot-password' } & GetConfigResponse<typeof File_ForgotPassword_getConfig>)
| { path: '/'; render: 'dynamic' }
| ({ path: '/sign-in' } & GetConfigResponse<typeof File_SignIn_getConfig>)
| ({ path: '/sign-up' } & GetConfigResponse<typeof File_SignUp_getConfig>);

// prettier-ignore
declare module 'waku/router' {
  interface RouteConfig {
    paths: PathsForPages<Page>;
  }
  interface CreatePagesConfig {
    pages: Page;
  }
}
