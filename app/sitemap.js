const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.noblemirrorcapital.com'

export default function sitemap() {
  const pages = ['', '/about', '/platform', '/faq', '/privacy', '/terms', '/refund']
  const lastModified = new Date()

  return pages.map((page) => ({
    url: `${siteUrl}${page}`,
    lastModified,
    changeFrequency: page === '' ? 'daily' : 'weekly',
    priority: page === '' ? 1 : 0.8,
  }))
}
