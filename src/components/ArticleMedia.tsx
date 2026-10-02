import type { ComponentProps } from 'react';

export default function ArticleMedia({ src, alt }: Pick<ComponentProps<'img'>, 'src' | 'alt'>) {
    if (typeof src === 'string' && /\.mp4(?:[?#]|$)/i.test(src)) {
        return (
            <video controls playsInline preload="metadata" aria-label={alt || '旅程影片'} className="my-8 w-full max-h-[80vh] rounded-xl bg-black">
                <source src={src} type="video/mp4" />
                <a href={src}>下載影片</a>
            </video>
        );
    }

    // Markdown 照片保留原始比例，並在接近畫面時才載入。
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={src} alt={alt || ''} loading="lazy" decoding="async" />;
}
