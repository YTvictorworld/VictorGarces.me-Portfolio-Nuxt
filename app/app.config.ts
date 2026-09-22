export default defineAppConfig({
  global: {
    picture: {
      dark: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/49f056206375265.68b77ee9dd6a7.jpg',
      light: 'https://mir-s3-cdn-cf.behance.net/project_modules/disp/49f056206375265.68b77ee9dd6a7.jpg',
      alt: 'My profile picture'
    },
    meetingLink: 'https://www.linkedin.com/in/vgfilm07/',
    email: 'victorericksongv@gmail.com',
    available: true
  },
  ui: {
    colors: {
      // Overridden by the token bridge in tokens.css (--ui-color-primary-*); kept valid for Nuxt UI
      primary: 'teal',
      neutral: 'neutral'
    }
  },
  footer: {
    credits: `Copyright © ${new Date().getFullYear()}`,
    links: [{
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://www.linkedin.com/in/vgfilm07/',
      'target': '_blank',
      'aria-label': 'LinkedIn'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/YTvictorworld',
      'target': '_blank',
      'aria-label': 'GitHub'
    },
    {
      'icon': 'i-simple-icons-instagram',
      'to': 'https://www.instagram.com/victorg.v0/',
      'target': '_blank',
      'aria-label': 'Social Media'
    }
    ]
  }
})
