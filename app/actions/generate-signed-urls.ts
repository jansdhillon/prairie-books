"use server";

import { Storage } from "@google-cloud/storage";

const storage = new Storage();
const bucketName = "kathrins-books-images";

export const generateSignedUrl = async (filename: string) => {
  const [url] = await storage
    .bucket(bucketName)
    .file(filename)
    .getSignedUrl({ action: "read", expires: Date.now() + 15 * 60 * 1000 });

  return url;
};
