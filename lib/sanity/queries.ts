import { client } from "./client";

export type Listing = {
  _id: string;
  title: string;
  slug: string;
  status: string;
  price: number;
  address: string;
  city: string;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  description?: string;
  featuredPhoto?: any;
  photos?: any[];
};

export type Post = {
  _id: string;
  title: string;
  slug: string;
  publishedAt: string;
  coverImage?: any;
  excerpt?: string;
  body?: any[];
};

export async function getFeaturedListings(): Promise<Listing[]> {
  return client.fetch(
    `*[_type == "listing" && status == "Active"] | order(_createdAt desc) [0...6] {
      _id, title, "slug": slug.current, status, price, address, city,
      bedrooms, bathrooms, sqft, featuredPhoto
    }`
  );
}

export async function getAllListings(): Promise<Listing[]> {
  return client.fetch(
    `*[_type == "listing"] | order(_createdAt desc) {
      _id, title, "slug": slug.current, status, price, address, city,
      bedrooms, bathrooms, sqft, featuredPhoto
    }`
  );
}

export async function getListingBySlug(slug: string): Promise<Listing | null> {
  return client.fetch(
    `*[_type == "listing" && slug.current == $slug][0] {
      _id, title, "slug": slug.current, status, price, address, city,
      bedrooms, bathrooms, sqft, description, photos, featuredPhoto
    }`,
    { slug }
  );
}

export async function getFeaturedPosts(): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc) [0...3] {
      _id, title, "slug": slug.current, publishedAt, coverImage, excerpt
    }`
  );
}

export async function getAllPosts(): Promise<Post[]> {
  return client.fetch(
    `*[_type == "post"] | order(publishedAt desc) {
      _id, title, "slug": slug.current, publishedAt, coverImage, excerpt
    }`
  );
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  return client.fetch(
    `*[_type == "post" && slug.current == $slug][0] {
      _id, title, "slug": slug.current, publishedAt, coverImage, excerpt, body
    }`,
    { slug }
  );
}
