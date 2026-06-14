import dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import axios from 'axios';
import { htmlToBlocks } from '@sanity/block-tools';
import { JSDOM } from 'jsdom';
import { Schema } from '@sanity/schema';

// Load environment variables
dotenv.config({ path: '.env.local' });

// Ensure required variables exist
if (!process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || !process.env.SANITY_WRITE_TOKEN || !process.env.WP_API_URL) {
  throw new Error("Missing required environment variables.");
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: 'production',
  token: process.env.SANITY_WRITE_TOKEN,
  apiVersion: '2024-06-14',
  useCdn: false,
});

// Compile a strict schema so block-tools knows exactly what a "block" is
const defaultSchema = Schema.compile({
  name: 'migrationSchema',
  types: [
    {
      type: 'object',
      name: 'blogPost',
      fields: [
        {
          name: 'content',
          type: 'array',
          of: [{ type: 'block' }, { type: 'image' }],
        },
      ],
    },
  ],
});

const blockContentType = defaultSchema
  .get('blogPost')
  .fields.find((field: any) => field.name === 'content').type;

async function uploadImage(imageUrl: string) {
  if (!imageUrl) return null;
  try {
    const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
    const buffer = Buffer.from(response.data, 'binary');
    const asset = await client.assets.upload('image', buffer, {
      filename: imageUrl.split('/').pop(),
    });
    return {
      _type: 'image',
      asset: { _type: 'reference', _ref: asset._id },
    };
  } catch (error) {
    console.error(`Failed to upload image: ${imageUrl}`);
    return null;
  }
}

async function migratePosts() {
  console.log('Fetching WordPress posts...');
  try {
    const { data: wpPosts } = await axios.get(`${process.env.WP_API_URL}/posts?_embed&per_page=100`);

    for (const wpPost of wpPosts) {
      console.log(`Migrating: ${wpPost.title.rendered}`);

      // 1. Convert HTML to Portable Text
      const portableTextContent = htmlToBlocks(wpPost.content.rendered, blockContentType, {
        parseHtml: (html) => new JSDOM(html).window.document,
      });

      // 2. Extract Featured Image
      let mainImage = null;
      if (wpPost._embedded && wpPost._embedded['wp:featuredmedia']) {
        const sourceUrl = wpPost._embedded['wp:featuredmedia'][0].source_url;
        mainImage = await uploadImage(sourceUrl);
      }

      // 3. Map to your exact post.ts Sanity schema
      const sanityDoc = {
        _type: 'post',
        title: wpPost.title.rendered,
        slug: { _type: 'slug', current: wpPost.slug },
        content: portableTextContent,
        mainImage: mainImage,
        publishedAt: wpPost.date,
      };

      // 4. Push to Sanity
      const result = await client.create(sanityDoc);
      console.log(`Successfully created Sanity Document: ${result._id}`);
    }
    
    console.log('Migration Complete!');
  } catch (error: any) {
    console.error('Migration failed:', error.message);
  }
}

migratePosts();