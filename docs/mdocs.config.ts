import { defineConfig } from 'convert-markdown-to-html';

const ogTitle = 'Brainless token manager';
const ogDescription = 'This package help you do refresh token brainlessly. Super easy to use';
const ogUrl = 'https://github.com/namnh240795/token-manager';
const ogImage = 'https://avatars.githubusercontent.com/u/20696416?v=4';

export default defineConfig({
  input: 'README.md',
  output: 'index.html',
  isTwoSlash: true,

  title: 'Brainless token manager',
  description: 'This package help you do refresh token brainlessly. Super easy to use',

  logo: 'https://avatars.githubusercontent.com/u/20696416?v=4',

  socialLinks: [
    {
      icon: 'github',
      url: 'https://github.com/namnh240795/token-manager',
    },
  ],
  footer: {
    message: 'Released under the MIT License',
    copyright: 'Copyright © 2023-present Namnh240795',
  },

  head: [
    ['link', { rel: 'icon', type: 'image/png', href: 'https://avatars.githubusercontent.com/u/20696416?v=4' }],
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:title', content: ogTitle }],
    ['meta', { property: 'og:image', content: ogImage }],
    ['meta', { property: 'og:url', content: ogUrl }],
    ['meta', { property: 'og:description', content: ogDescription }],
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'theme-color', content: '#7eaf90' }],
  ],
});
