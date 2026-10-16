import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import ArticleMedia from './ArticleMedia';
import ArticleGallery, { type GalleryData } from './ArticleGallery';
import zanzibarGalleries from '@/content/galleries/zanzibar-2026.json';

export default function ArticleContent({ content, slug }: { content: string; slug: string }) {
    const galleries: Record<string, GalleryData> = slug === 'tanzania-zanzibar-2026' ? zanzibarGalleries : {};
    const sections = content.split(/<!--\s*gallery:([\w-]+)\s*-->/g);

    return sections.map((section, index) => {
        if (index % 2 === 1) {
            const gallery = galleries[section];
            return gallery ? <ArticleGallery key={section} {...gallery} /> : null;
        }
        return <ReactMarkdown key={index} remarkPlugins={[remarkGfm]} components={{ img: ArticleMedia }}>{section}</ReactMarkdown>;
    });
}
