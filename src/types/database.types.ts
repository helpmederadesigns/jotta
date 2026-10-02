// src/types/database.types.ts

export type Json =
    | string
    | number
    | boolean
    | null
    | { [key: string]: Json | undefined }
    | Json[]

export interface Database {
    public: {
        Tables: {
            users: {
                Row: {
                    id: string
                    username: string
                    avatar_url: string | null
                    real_credits: number
                    promo_credits: number
                    bvn_verified: boolean
                    created_at: string
                }
                Insert: {
                    id: string
                    username: string
                    avatar_url?: string | null
                    real_credits?: number
                    promo_credits?: number
                    bvn_verified?: boolean
                    created_at?: string
                }
                Update: {
                    id?: string
                    username?: string
                    avatar_url?: string | null
                    real_credits?: number
                    promo_credits?: number
                    bvn_verified?: boolean
                    created_at?: string
                }
            }
            posts: {
                Row: {
                    id: string
                    author_id: string
                    title: string
                    content: string
                    excerpt: string | null
                    cover_image: string | null
                    is_premium: boolean
                    price_in_credits: number
                    word_count: number
                    status: 'pending' | 'published' | 'flagged'
                    created_at: string
                }
                Insert: {
                    id?: string
                    author_id: string
                    title: string
                    content: string
                    excerpt?: string | null
                    cover_image?: string | null
                    is_premium?: boolean
                    price_in_credits?: number
                    word_count?: number
                    status?: 'pending' | 'published' | 'flagged'
                    created_at?: string
                }
                Update: {
                    id?: string
                    author_id?: string
                    title?: string
                    content?: string
                    excerpt?: string | null
                    cover_image?: string | null
                    is_premium?: boolean
                    price_in_credits?: number
                    word_count?: number
                    status?: 'pending' | 'published' | 'flagged'
                    created_at?: string
                }
            }
        }
    }
}