import Stripe from "stripe";
import express, { Request, Response } from "express";

const app = express();
const stripe = new Stripe("your_stripe_secret_key");

app.use(express.json());
// app.post("/create-stripe-session-subscription", async (req, res) => {
//   try {
//     const { userEmail, planId } = req.body; // Assuming planId is passed to identify the subscription plan

//     if (!userEmail || !planId) {
//       return res.status(400).json({ error: 'Missing required fields.' });
//     }

//     // Check if the user already exists and has an active subscription
//     let customer = await stripe.customers.list({ email: userEmail, limit: 1 });
//     if (customer.data.length > 0) {
//       customer = customer.data[0];

//       // Check if the customer already has an active subscription
//       const subscriptions = await stripe.subscriptions.list({
//         customer: customer.id,
//         status: 'active',
//         limit: 1,
//       });

//       if (subscriptions.data.length > 0) {
//         // Redirect to billing portal if the customer has an active subscription
//         const stripeSession = await stripe.billingPortal.sessions.create({
//           customer: customer.id,
//           return_url: "http://localhost:3000/",
//         });
//         return res.status(409).json({ redirectUrl: stripeSession.url });
//       }
//     } else {
//       // Create a new customer if none exists
//       customer = await stripe.customers.create({
//         email: userEmail,
//         metadata: {
//           userId: userEmail, // Use actual user ID from your auth system
//         },
//       });
//     }

//     // Create the Stripe checkout session
//     const session = await stripe.checkout.sessions.create({
//       success_url: "http://localhost:3000/success",
//       cancel_url: "http://localhost:3000/cancel",
//       payment_method_types: ["card"],
//       mode: "subscription",
//       billing_address_collection: "auto",
//       line_items: [
//         {
//           price: planId, // Use the plan ID from Stripe
//           quantity: 1,
//         },
//       ],
//       customer: customer.id, // Use the customer ID here
//     });

//     res.json({ id: session.id });
//   } catch (error) {
//     console.error('Error creating Stripe session:', error);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });


// app.post("/webhook", express.raw({ type: 'application/json' }), async (req, res) => {
//   const endpointSecret = 'your_webhook_secret'; // Replace with your Stripe webhook secret

//   const sig = req.headers['stripe-signature'];
//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//   } catch (err) {
//     console.error('Webhook Error:', err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

  
//   switch (event.type) {
//     case 'invoice.payment_succeeded':
//       const invoice = event.data.object;
//       const subscription = await stripe.subscriptions.retrieve(invoice.subscription);
//       const customer = await stripe.customers.retrieve(invoice.customer);

//       if (invoice.billing_reason === 'subscription_create') {
//         // Insert a new subscription document
//         const subscriptionDocument = {
//           userId: customer.metadata.userId,
//           subId: invoice.subscription,
//           endDate: subscription.current_period_end * 1000,
//           status: 'active',
//         };

//         const result = await subscriptionsCollection.insertOne(subscriptionDocument);
//         console.log(`New subscription created: ${result.insertedId}`);
//       } else if (invoice.billing_reason === 'subscription_cycle' || invoice.billing_reason === 'subscription_update') {
//         // Update existing subscription document
//         const filter = { userId: customer.metadata.userId };
//         const updateDoc = {
//           $set: {
//             endDate: subscription.current_period_end * 1000,
//             status: 'active',
//           },
//         };

//         const result = await subscriptionsCollection.updateOne(filter, updateDoc);
//         console.log(`Subscription updated: ${result.modifiedCount} document(s) updated`);
//       }
//       break;

//     case 'customer.subscription.updated':
//       const updatedSubscription = event.data.object;

//       if (updatedSubscription.cancel_at_period_end) {
//         console.log(`Subscription ${updatedSubscription.id} was canceled.`);
//         // Handle subscription cancellation in the database
//         const filter = { subId: updatedSubscription.id };
//         const updateDoc = { $set: { status: 'canceled' } };

//         await subscriptionsCollection.updateOne(filter, updateDoc);
//       } else {
//         console.log(`Subscription ${updatedSubscription.id} was updated.`);
//         // Handle subscription update
//       }
//       break;

//     default:
//       console.warn(`Unhandled event type ${event.type}`);
//   }

//   res.status(200).end();
// });
