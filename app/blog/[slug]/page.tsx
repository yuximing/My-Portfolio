import type { Metadata } from 'next';
import { Suspense, cache } from 'react';
import { notFound } from 'next/navigation';
import { Mdx } from 'components/mdx';
import { getTweets } from 'lib/twitter';
import { getBlogPosts } from 'app/db/blog';
import Balancer from 'react-wrap-balancer';
import ViewCounter from '../view-counter';

// export async function generateStaticParams() {
//   return allBlogs.map((post) => ({
//     slug: post.slug,
//   }));
// }

// export async function generateMetadata({
//   params,
// }): Promise<Metadata | undefined> {
//   let post = getBlogPosts().find((post) => post.slug === params.slug);
//   if (!post) {
//     return;
//   }

//   const {
//     title,
//     publishedAt: publishedTime,
//     summary: description,
//     image,
//   } = post.metadata;
//   const ogImage = image // TODO
//     ? `https://leerob.io${image}`
//     : `https://leerob.io/api/og?title=${title}`;

//   return {
//     title,
//     description,
//     openGraph: {
//       title,
//       description,
//       type: 'article',
//       publishedTime,
//       url: `https://leerob.io/blog/${slug}`,
//       images: [
//         {
//           url: ogImage,
//         },
//       ],
//     },
//     twitter: {
//       card: 'summary_large_image',
//       title,
//       description,
//       images: [ogImage],
//     },
//   };
// }

function formatDate(date: string) {
  let currentDate = new Date();
  if (!date.includes('T')) {
    date = `${date}T00:00:00`;
  }
  let targetDate = new Date(date);

  let yearsAgo = currentDate.getFullYear() - targetDate.getFullYear();
  let monthsAgo = currentDate.getMonth() - targetDate.getMonth();
  let daysAgo = currentDate.getDate() - targetDate.getDate();

  let formattedDate = '';

  if (yearsAgo > 0) {
    formattedDate = `${yearsAgo}y ago`;
  } else if (monthsAgo > 0) {
    formattedDate = `${monthsAgo}mo ago`;
  } else if (daysAgo > 0) {
    formattedDate = `${daysAgo}d ago`;
  } else {
    formattedDate = 'Today';
  }

  let fullDate = targetDate.toLocaleString('en-us', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return `${fullDate} (${formattedDate})`;
}

export default async function Blog({ params }) {
  let post = getBlogPosts().find((post) => post.slug === params.slug);

  if (!post) {
    notFound();
  }

  // const tweets = await getTweets(post.tweetIds);

  return (
    // <section>
    //   <script type="application/ld+json">
    //     {JSON.stringify(post.structuredData)}
    //   </script>
    //   <h1 className="font-bold text-3xl font-serif max-w-[650px]">
    //     <Balancer>{post.title}</Balancer>
    //   </h1>
    //   <div className="grid grid-cols-[auto_1fr_auto] items-center mt-4 mb-8 font-mono text-sm max-w-[650px]">
    //     <div className="bg-neutral-100 dark:bg-neutral-800 rounded-md px-2 py-1 tracking-tighter">
    //       {post.publishedAt}
    //     </div>
    //     <div className="h-[0.2em] bg-neutral-50 dark:bg-neutral-800 mx-2" />
    //     <ViewCounter slug={post.slug} trackView />
    //   </div>
    //   <Mdx code={post.body.code} tweets={tweets} />
    // </section>
    <section>
      <script
        type="application/ld+json"
        suppressHydrationWarning
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'BlogPosting',
            headline: post.metadata.title,
            datePublished: post.metadata.publishedAt,
            dateModified: post.metadata.publishedAt,
            description: post.metadata.summary,
            image: post.metadata.image // TODO
              ? `https://leerob.io${post.metadata.image}`
              : `https://leerob.io/og?title=${post.metadata.title}`,
            url: `https://leerob.io/blog/${post.slug}`,
            author: {
              '@type': 'Person',
              name: 'Lee Robinson',
            },
          }),
        }}
      />
      <h1 className="title font-medium text-2xl tracking-tighter max-w-[650px]">
        {post.metadata.title}
      </h1>
      <div className="flex justify-between items-center mt-2 mb-8 text-sm max-w-[650px]">
        <p className="text-sm text-neutral-600 dark:text-neutral-400">
          {formatDate(post.metadata.publishedAt)}
        </p>
        {/* <Suspense fallback={<p className="h-5" />}>
          <Views slug={post.slug} />
        </Suspense> */}
      </div>
      <article className="prose prose-quoteless prose-neutral dark:prose-invert">
        {/* <CustomMDX source={post.content} /> */}
      </article>
    </section>
  );
}
