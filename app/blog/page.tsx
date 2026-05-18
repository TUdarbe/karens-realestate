export const dynamic = 'force-dynamic';

import Image from "next/image";
import Link from "next/link";
import { getAllPosts, type Post } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

function BlogCard({ post }: { post: Post }) {
  const imgUrl = post.coverImage
    ? urlFor(post.coverImage).width(700).height(420).fit("crop").url()
    : null;

  return (
    <Link href={`/blog/${post.slug}`} className="group block bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300 border border-gray-100">
      <div className="relative h-48 bg-gray-100 overflow-hidden">
        {imgUrl ? (
          <Image src={imgUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" sizes="(max-width: 768px) 100vw, 33vw" />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-navy to-navy-deep flex items-center justify-center">
            <svg className="w-10 h-10 text-white/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10l6 6v10a2 2 0 01-2 2z" /></svg>
          </div>
        )}
      </div>
      <div className="p-6">
        {post.publishedAt && <p className="text-xs text-remax-gray mb-2">{formatDate(post.publishedAt)}</p>}
        <h2 className="font-bold text-gray-900 text-lg mb-2 leading-snug group-hover:text-navy transition-colors line-clamp-2">{post.title}</h2>
        {post.excerpt && <p className="text-sm text-gray-500 line-clamp-3 leading-relaxed">{post.excerpt}</p>}
        <p className="mt-4 text-steel text-xs font-bold uppercase tracking-wide group-hover:underline">Read more →</p>
      </div>
    </Link>
  );
}

export default async function BlogPage() {
  const posts = await getAllPosts();

  return (
    <>
      <section className="bg-navy py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-2">Insights & Advice</p>
          <h1 className="text-4xl md:text-5xl font-black text-white">Market Blog</h1>
        </div>
      </section>

      <section className="bg-sky min-h-screen py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-24 bg-white rounded-xl border border-gray-100">
              <p className="text-gray-400 font-medium">No posts yet. Check back soon!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => <BlogCard key={post._id} post={post} />)}
            </div>
          )}
        </div>
      </section>
    </>
  );
}
