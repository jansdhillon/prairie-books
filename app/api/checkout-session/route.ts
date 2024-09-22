import { stripe } from "@/utils/stripe/config";


export async function POST() {
  // if (req.method === 'POST') {
  //   const body = await req.body;
  //   try {
  //     const session = await stripe.checkout.sessions.create({
  //       line_items: [
  //         {
  //           price: priceId,
  //           quantity: quantity,
  //         },
  //       ],
  //       mode: 'payment',
  //       success_url: `${req.headers.origin}/?success=true`,
  //       cancel_url: `${req.headers.origin}/?canceled=true`,
  //     });
  //     res.redirect(303, session.url);
  //   } catch (err: any) {
  //     res.status(err.statusCode || 500).json(err.message);
  //   }
  // } else {
  //   res.setHeader('Allow', 'POST');
  //   res.status(405).end('Method Not Allowed');
  // }
  return;

}
