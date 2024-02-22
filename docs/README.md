<p align="center">
<a href="https://www.npmjs.com/package/brainless-token-manager" target="_blank" rel="noopener noreferrer">
<img src="https://api.iconify.design/fluent:brain-circuit-20-filled.svg?color=%235fc059" alt="logo" style="width: 100px;"/></a>
</p>

<p align="center">
    This package help you do refresh token brainlessly. Super easy to use
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/brainless-token-manager" target="_blank" rel="noopener noreferrer"><img src="https://badge.fury.io/js/csvs-parsers.svg" alt="NPM Version" /></a>
  <a href="https://www.npmjs.com/package/brainless-token-manager" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/npm/dt/brainless-token-manager.svg?logo=npm" alt="NPM Downloads" /></a>
  <a href="https://bundlephobia.com/result?p=brainless-token-manager" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/bundlephobia/minzip/brainless-token-manager" alt="Minizip" /></a>
  <a href="https://github.com/hunghg255/brainless-token-manager/graphs/contributors" target="_blank" rel="noopener noreferrer"><img src="https://img.shields.io/badge/all_contributors-1-orange.svg" alt="Contributors" /></a>
  <a href="https://github.com/hunghg255/brainless-token-manager/blob/main/LICENSE" target="_blank" rel="noopener noreferrer"><img src="https://badgen.net/github/license/namnh240795/token-manager" alt="License" /></a>
</p>

- [Live Demo](https://reactjs-handle-refresh-token.vercel.app/)

- [Playground Stackblitz](https://stackblitz.com/edit/react-ts-mdxcmx?file=App.tsx)

## Install

:::code-group-open

```bash [npm]
 npm install brainless-token-manager@latest
```

```bash [yarn]
 yarn add brainless-token-manager@latest
```

```bash [pnpm]
 pnpm i -D brainless-token-manager@latest
```

```bash [bun]
 bun install brainless-token-manager@latest
```

:::code-group-close

## Flow

- Checking refresh token -> expired -> onInvalidRefreshToken -> clear token on your storage -> logout
- Valid token -> return token -> run as normal
- Token in valid -> refresh token -> onRefreshToken success -> save token and refresh token to storage -> perform request

![Demo](https://raw.githubusercontent.com/hunghg255/token-manager/main/img/image.png)

## API

```ts
import TokenManager from 'brainless-token-manager';

// Works fine with JWT
// if you use other tokens JWT. you need to initialize isValidToken and isValidRefreshToken
interface TokenManagerContructor {
  getAccessToken: () => Promise<string>;
  getRefreshToken: () => Promise<string>; // if you don't have refresh token use the same as getAccessToken
  executeRefreshToken?: () => Promise<{ token: string; refresh_token: string }>;
  onRefreshTokenSuccess?: ({ token, refresh_token }: { token: string; refresh_token: string }) => void;
  onInvalidRefreshToken: () => void; // will trigger when refresh token expired
  isValidToken?: (token: string) => Promise<boolean>;
  isValidRefreshToken?: (refresh_token: string) => Promise<boolean>;
  refreshTimeout?: number;
}

const tokenManagerInstance = new TokenManager(options: TokenManagerContructor);
```

## Example with `umi-request`

```ts twoslash
import { extend } from 'umi-request';
import TokenManager, { injectBearer, parseJwt } from 'brainless-token-manager';

// Can implement by umi-request, axios, fetch....
export const request = extend({
  prefix: 'APP_ENDPOINT_URL_HERE',
  headers: {
    'Content-Type': 'application/json',
  },
  errorHandler: (error) => {
    throw error?.data || error?.response;
  },
});

const tokenManager = new TokenManager({
  getAccessToken: async () => {
    const token = localStorage.getItem('accessToken');
    return `${token}`;
  },
  getRefreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    return `${refreshToken}`;
  },
  onInvalidRefreshToken: () => {
    // Logout, redirect to login
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  },
  executeRefreshToken: async () => {
    const refreshToken = localStorage.getItem('refreshToken');

    if (!refreshToken) {
      return {
        token: '',
        refresh_token: '',
      };
    }

    const r = await request.post('/auth/refresh-token', {
      data: {
        refreshToken: refreshToken,
      },
    });

    return {
      token: r?.accessToken,
      refresh_token: r?.refreshToken,
    };
  },
  onRefreshTokenSuccess: ({ token, refresh_token }) => {
    if (token && refresh_token) {
      localStorage.setItem('accessToken', token);
      localStorage.setItem('refreshToken', refresh_token);
    }
  },
});

export const privateRequest = async (request: any, suffixUrl: string, configs?: any) => {
  const token: string = (await tokenManager.getToken()) as string;

  return request(suffixUrl, injectBearer(token, configs));
};

// Use
privateRequest(request.get, '/api/example');
```

## Compare

- TokenManager

![Token manager](https://raw.githubusercontent.com/hunghg255/token-manager/main/assets/token-manager.gif)

- Axios Interceptor

![Token manager](https://raw.githubusercontent.com/hunghg255/token-manager/main/assets/axios.gif)
