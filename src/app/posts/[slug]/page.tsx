import { getPostBySlug, getAllPostSlugs } from '@/lib/posts';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

export async function generateStaticParams() {
    const posts = getAllPostSlugs();
    return posts.map((post) => ({
        slug: post.params.slug,
    }));
}

export default async function Post({ params }: { params: Promise<{ slug: string }> }) {
    // await params 解決 Next.js 15 的非同步 params 警告
    const resolvedParams = await params;
    const post = getPostBySlug(resolvedParams.slug);

    if (!post) {
        notFound();
    }

    return (
        <main className="min-h-screen bg-earth-ocean/30 py-24 px-6 md:px-12 text-earth-text selection:bg-earth-accent/30 selection:text-earth-text">
            <article className="max-w-3xl mx-auto bg-[#F4F1EA] p-8 md:p-12 shadow-[0_8px_30px_rgb(0,0,0,0.04)] rounded-2xl">
                <header className="mb-12 text-center">
                    <p className="text-earth-accent font-sans text-sm tracking-widest font-semibold uppercase mb-4">
                        {post.location} ‧ {post.date}
                    </p>
                    <h1 className="text-3xl md:text-5xl font-serif font-bold text-earth-text mb-6 leading-tight !leading-normal">
                        {post.title}
                    </h1>
                    {post.description && (
                        <p className="text-lg text-earth-text/80 font-sans font-light italic mt-4 max-w-2xl mx-auto leading-relaxed">
                            {post.description}
                        </p>
                    )}
                </header>

                <div className="prose prose-lg md:prose-xl prose-stone max-w-none text-earth-text/90 font-sans font-light
              prose-headings:font-serif prose-headings:font-semibold prose-headings:text-earth-text
              prose-a:text-earth-accent hover:prose-a:text-earth-text prose-a:transition-colors
              prose-img:rounded-xl prose-img:shadow-md
              prose-hr:border-earth-text/20">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        {post.content}
                    </ReactMarkdown>
                </div>
            </article>

            <div className="max-w-3xl mx-auto mt-12 text-center">
                <a href="/" className="inline-block text-sm font-sans tracking-widest uppercase border border-earth-text/20 rounded-full px-6 py-3 hover:bg-earth-text hover:text-earth-ocean transition-all duration-300">
                    ← 返回地圖探索
                </a>
            </div>
        </main>
    );
}
