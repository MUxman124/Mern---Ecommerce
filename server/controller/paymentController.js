import stripe from "stripe";

const stripeInstance = stripe(process.env.STRIPE_SECRET_KEY);

export const createPaymentIntent = async (req, res) => {
    const { amount } = req.body;

    const paymentIntent = await stripeInstance.paymentIntents.create({
      amount,
      currency: "usd",
      automatic_payment_methods: {
        enabled: true,
      },
    });

    res.json({ clientSecret: paymentIntent.client_secret });
};

export const confirmPayment = async (req, res) => {
    const { paymentIntentId } = req.body;

    const paymentIntent = await stripeInstance.paymentIntents.retrieve(paymentIntentId);

    if (paymentIntent.status === "succeeded") {
      res.json({ success: true, paid: true });
    } else {
      res.json({ success: true, paid: false });
    }
};
