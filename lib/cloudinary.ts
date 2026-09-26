import { v2 as cloudinary } from "cloudinary";
import { env, hasCloudinary } from "@/lib/env";
if (hasCloudinary()) cloudinary.config({ cloud_name: env.CLOUDINARY_CLOUD_NAME, api_key: env.CLOUDINARY_API_KEY, api_secret: env.CLOUDINARY_API_SECRET, secure: true });
export function getCloudinary() { return hasCloudinary() ? cloudinary : null; }
export function createUploadSignature(folder: string) { const client = getCloudinary(); if (!client) return null; const timestamp = Math.floor(Date.now() / 1000); return { timestamp, folder, signature: client.utils.api_sign_request({ timestamp, folder }, env.CLOUDINARY_API_SECRET!) }; }
