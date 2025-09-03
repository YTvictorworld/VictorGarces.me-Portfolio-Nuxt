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
      primary: 'blue',
      neutral: 'neutral'
    }
  },
  uiPro: {
    pageHero: {
      slots: {
        container: 'py-18 sm:py-24 lg:py-32',
        title: 'mx-auto max-w-xl text-pretty text-3xl sm:text-4xl lg:text-5xl',
        description: 'mt-2 text-md mx-auto max-w-2xl text-pretty sm:text-md text-muted'
      }
    }
  },
  footer: {
    credits: `Copyright © ${new Date().getFullYear()}`,
    colorMode: false,
    links: [ {
      'icon': 'i-simple-icons-linkedin',
      'to': 'https://www.linkedin.com/in/vgfilm07/',
      'target': '_blank',
      'aria-label': 'LinkedIn'
    }, {
      'icon': 'i-simple-icons-github',
      'to': 'https://github.com/YTvictorworld',
      'target': '_blank',
      'aria-label': 'Nuxt UI on GitHub'
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
