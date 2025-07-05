import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Profile Rumah Sakit - RS Medicare Prima',
  description: 'Pelajari lebih lanjut tentang RS Medicare Prima, visi misi, manajemen, fasilitas, dan prestasi rumah sakit swasta terdepan di Jakarta.',
  keywords: 'profile rumah sakit, tentang medicare prima, visi misi, manajemen rumah sakit, fasilitas kesehatan, prestasi rumah sakit'
}

export default function ProfileLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return children
}
