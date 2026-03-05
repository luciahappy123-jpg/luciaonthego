import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const postsDirectory = path.join(process.cwd(), 'src/content/posts');

export interface PostData {
    slug: string;
    title: string;
    date: string;
    description: string;
    location?: string;
    content: string;
}

export function getPostBySlug(slug: string): PostData | null {
    try {
        const fullPath = path.join(postsDirectory, `${slug}.md`);
        const fileContents = fs.readFileSync(fullPath, 'utf8');

        // 用 gray-matter 解析 Frontmatter 與內文
        const { data, content } = matter(fileContents);

        return {
            slug,
            title: data.title || '無標題',
            date: data.date || '',
            description: data.description || '',
            location: data.location || '',
            content,
        };
    } catch (error) {
        console.error(`Error reading post ${slug}:`, error);
        return null;
    }
}

export function getAllPostSlugs() {
    if (!fs.existsSync(postsDirectory)) return [];
    const fileNames = fs.readdirSync(postsDirectory);
    return fileNames.map((fileName) => {
        return {
            params: {
                slug: fileName.replace(/\.md$/, ''),
            },
        };
    });
}
