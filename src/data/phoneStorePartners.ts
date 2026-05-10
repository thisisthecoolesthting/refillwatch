export const PHONE_STORE_PARTNERS = [
  {
    slug: 'phonecasesforall',
    domain: 'phonecasesforall.com',
    name: 'Phone Cases For All',
    tagline: 'Cases that match your energy.',
    cta: 'Shop the looks',
    mark: 'https://phonecasesforall.com/brand/phonecasesforall/mark.png',
  },
  {
    slug: 'galaxycaseco',
    domain: 'galaxycaseco.com',
    name: 'Galaxy Case Co.',
    tagline: 'Built for Galaxy. Ready for impact.',
    cta: 'Shop Galaxy',
    mark: 'https://galaxycaseco.com/brand/galaxycaseco/mark.png',
  },
  {
    slug: 'phonecasegift',
    domain: 'phonecasegift.shop',
    name: 'Phone Case Gift',
    tagline: 'Fun finds for every vibe.',
    cta: 'Send a gift',
    mark: 'https://phonecasegift.shop/brand/phonecasegift/mark.png',
  },
  {
    slug: 'titancase',
    domain: 'titancase.shop',
    name: 'Titan Case',
    tagline: 'Engineered restraint for iPhone.',
    cta: 'Shop iPhone',
    mark: 'https://titancase.shop/brand/titancase/mark.png',
  },
  {
    slug: 'phonecasesforher',
    domain: 'phonecasesforher.com',
    name: 'Phone Cases For Her',
    tagline: 'Cases with personal polish.',
    cta: 'Shop the look',
    mark: 'https://phonecasesforher.com/brand/phonecasesforher/mark.png',
  },
] as const

export const PHONE_STORE_DESIGNS: Record<string, { light: string[]; dark: string[] }> = {
  phonecasesforall: {
    light: ['<floral-slug-1>', '<watercolor-slug-1>', '<pastel-slug-1>'],
    dark:  ['<dark-marble-slug-1>', '<black-geometric-slug-1>', '<noir-slug-1>'],
  },
  galaxycaseco: {
    light: ['<minimal-light-slug>', '<celestial-slug>'],
    dark:  ['<carbon-slug>', '<tactical-slug>', '<black-geometric-slug>'],
  },
  phonecasegift: {
    light: ['<wedding-slug>', '<floral-gift-slug>', '<pearl-slug>'],
    dark:  ['<midnight-stars-slug>', '<elegant-noir-slug>'],
  },
  titancase: {
    light: ['<minimal-iphone-light>', '<watercolor-iphone>'],
    dark:  ['<black-iphone>', '<carbon-iphone-slug>'],
  },
  phonecasesforher: {
    light: ['<rose-floral-slug>', '<warm-pastel-slug>', '<gold-script-slug>'],
    dark:  ['<rich-rose-slug>', '<deep-burgundy-slug>'],
  },
}
