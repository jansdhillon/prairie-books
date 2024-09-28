"use server";
import { getProductAndPriceByBookId } from "@/utils/supabase/queries";
import { createClient } from "@/utils/supabase/server";

const getProductByBookId = async (bookId: string) => {
  const supabase = createClient();

  const { data: product, error: productError } = await getProductAndPriceByBookId(supabase, bookId);

    if (productError) {
        console.error("Error fetching product:", productError.message);
    }

    if (!product) {
        console.error("Product not found.");
    }

    return product;

};

export { getProductByBookId };
