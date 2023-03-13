const navigation = () => [
  {
    title: 'Home',
    path: '/home',
    icon: 'mdi:home-outline',
  },
  {
    title: 'Second Page',
    path: '/second-page',
    icon: 'mdi:email-outline',
  },
  {
    path: '/acl',
    action: 'read',
    subject: 'acl-page',
    title: 'Access Control',
    icon: 'mdi:shield-outline',
  },
  {
    path: '/pageTeste',
    action: 'read',
    subject: 'pageTeste',
    title: 'Pagina teste',
    icon: 'mdi:shield-outline',
  },
  {
    path: '/TesteValidation',
    action: 'read',
    subject: 'TesteValidation',
    title: 'TesteValidation',
    icon: 'mdi:shield-outline',
  }
]

export default navigation
