"use client";

import { useRouter } from "next/navigation"; 
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";

type Article = {
  id: string;
  date: string;
  title: string;
  description: string;
  tags: string[];
  image: string;
};

type Props = {
  article: Article;
};

export default function ArticleCard({ article }: Props) {
  const router = useRouter();
  const imageSrc = article.image || "/images/gambar.jpg";
  const tags = Array.isArray(article.tags) ? article.tags : [];

  const handleClick = () => {
    router.push(`/articles/${article.id}`);
  };

  return (
    <Card
      onClick={handleClick}
      className="w-full hover:shadow-lg transition-shadow duration-300 cursor-pointer overflow-hidden"
    >
      <div className="relative w-full h-48">
        {imageSrc && (
          <Image
            src={imageSrc}
            alt={article.title || "Article image"}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 33vw"
            priority={false}
          />
        )}
      </div>
      <CardContent className="p-4">
        <p className="text-sm text-gray-500">{article.date}</p>
        <h3 className="text-lg font-semibold mt-2">{article.title}</h3>
        <p className="text-sm text-gray-600 mt-2">{article.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {tags.map((tag, i) => (
            <Badge key={i} variant="secondary">
              {tag}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
