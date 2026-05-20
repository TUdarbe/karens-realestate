import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getPostBySlug } from "@/lib/sanity/queries";
import { urlFor } from "@/lib/sanity/image";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
}

const portableTextComponents = {
  types: {
    image: ({ value }: { value: any }) => {
      const url = urlFor(value).width(900).url();
      return (
        <div className="relative w-full h-80 my-8 rounded-xl overflow-hidden">
          <Image src={url} alt={value.alt ?? ""} fill className="object-cover" sizes="(max-width: 768px) 100vw, 800px" />
        </div>
      );
    },
  },
  block: {
    h2: ({ children }: any) => <h2 className="text-2xl font-black text-gray-900 mt-10 mb-4">{children}</h2>,
    h3: ({ children }: any) => <h3 className="text-xl font-bold text-gray-900 mt-8 mb-3">{children}</h3>,
    normal: ({ children }: any) => <p className="text-gray-700 leading-relaxed mb-5">{children}</p>,
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-steel pl-5 my-6 text-gray-600 italic">{children}</blockquote>
    ),
  },
  list: {
    bullet: ({ children }: any) => <ul className="list-disc list-outside pl-6 mb-5 space-y-2 text-gray-700">{children}</ul>,
    number: ({ children }: any) => <ol className="list-decimal list-outside pl-6 mb-5 space-y-2 text-gray-700">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
  },
  marks: {
    strong: ({ children }: any) => <strong className="font-bold text-gray-900">{children}</strong>,
    em: ({ children }: any) => <em>{children}</em>,
    link: ({ value, children }: any) => (
      <a href={value.href} className="text-navy hover:text-steel underline transition-colors" target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    ),
  },
};

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const coverUrl = post.coverImage
    ? urlFor(post.coverImage).width(1200).height(600).fit("crop").url()
    : null;

  return (
    <>
      {/* Back nav */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <Link href="/blog" className="text-sm text-navy hover:text-steel font-medium transition-colors flex items-center gap-1">
            ← Back to Blog
          </Link>
        </div>
      </div>

      {/* Cover image */}
      {coverUrl && (
        <div className="relative w-full h-64 md:h-96 bg-gray-100">
          <Image src={coverUrl} alt={post.title} fill className="object-cover" sizes="100vw" priority />
        </div>
      )}

      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <header className="mb-10">
          {post.publishedAt && (
            <p className="text-steel text-xs font-bold uppercase tracking-widest mb-3">{formatDate(post.publishedAt)}</p>
          )}
          <h1 className="text-3xl md:text-4xl font-black text-gray-900 leading-tight mb-4">{post.title}</h1>
          {post.excerpt && (
            <p className="text-xl text-gray-500 leading-relaxed border-l-4 border-navy pl-5">{post.excerpt}</p>
          )}
          <div className="flex items-center gap-3 mt-6 pt-6 border-t border-gray-100">
            <div className="w-10 h-10 rounded-full bg-navy flex items-center justify-center text-white font-bold text-sm">K</div>
            <div>
              <p className="font-bold text-gray-900 text-sm">Kay Bolesa</p>
              <p className="text-gray-400 text-xs">RE/MAX Prime Properties</p>
            </div>
          </div>
        </header>

        {post.body && (
          <div className="prose-custom">
            <PortableText value={post.body} components={portableTextComponents} />
          </div>
        )}

        <div className="mt-12 pt-8 border-t border-gray-100 bg-navy rounded-2xl p-8 text-white text-center border-t border-steel/30">
          <h3 className="text-xl font-black mb-2">Have Questions?</h3>
          <p className="text-slate-400 text-sm mb-5">I&apos;m always happy to chat about the market or help you find your next home.</p>
          <div className="flex justify-center gap-4">
            <a href="tel:+14168333825" className="bg-steel text-white px-6 py-3 rounded-lg font-bold text-sm hover:bg-steel-dark transition-colors">
              (416) 833-3825
            </a>
            <a href="mailto:kaybolesa@gmail.com" className="bg-white/10 text-white border border-white/20 px-6 py-3 rounded-lg font-bold text-sm hover:bg-white/20 transition-colors">
              Email Kay
            </a>
          </div>
        </div>
      </article>
    </>
  );
}
