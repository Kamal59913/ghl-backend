import { Request, Response, NextFunction } from "express";
import Stripe from "stripe";
import AgentModel from "../model/agent.model";

// Initialize Stripe with your test API key
const stripe = new Stripe(
  "sk_test_51PsMz3EYhmyApRK0jU4ty25sVJR7OKZzUuimaEk5abLzWup0H78WgRjCK4QXcbtt440zTo89rlyJ2c3POSysTsRo002K9QouFJ"
);

// Function to list Stripe plans
const listPlans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Fetch plans from Stripe
    const plans = await stripe.plans.list({
      limit: 3,
    });

    // Send response with plans data
    res.status(200).json(plans);
  } catch (error) {
    // Handle errors and send a response
    console.error("Error fetching plans:", error);
    res.status(500).json({ error: "Failed to fetch plans" });
  }
};

const stripeSession = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { name, email, address, city, state, country, postalCode, phone, planId } =
      req.body;

    if (!email || !planId) {
      return res.status(400).json({ error: "Missing required fields." });
    }

    // Check if the user already exists
    const existingUser = await AgentModel.findOne({ email: email });

    if (existingUser) {
      // Check if the existing user already has an active subscription
      const customers = await stripe.customers.list({ email: email, limit: 1 });
      let customer = customers.data.length > 0 ? customers.data[0] : null;

      if (customer) {
        // Check if the customer already has an active subscription
        const subscriptions = await stripe.subscriptions.list({
          customer: customer.id,
          status: "active",
          limit: 1,
        });

        if (subscriptions.data.length > 0) {
          // Redirect to billing portal if the customer has an active subscription
          const billingPortalSession = await stripe.billingPortal.sessions.create({
            customer: customer.id,
            return_url: "http://localhost:3000/",
          });
          return res.status(409).json({ redirectUrl: billingPortalSession.url });
        }
      } else {
        // Create a new customer if none exists
        customer = await stripe.customers.create({
          email: email,
          metadata: {
            userId: existingUser.id,
          },
        });
      }

      // Create the Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}&user_id=${existingUser.id}`,
        cancel_url: "http://localhost:3000/cancel",
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        line_items: [
          {
            price: planId,
            quantity: 1,
          },
        ],
        customer: customer.id,
      });

      return res.json({ id: session.id });
    } else {
      // Create a new user with inactive status if the user does not exist
      const newUser = await AgentModel.create({
        email: email,
        name: name,
        address: address,
        city: city,
        state: state,
        country: country,
        postalCode: postalCode,
        phone: phone,
        status: "inactive", 
      });

      // Create a Stripe customer for the new user
      const customer = await stripe.customers.create({
        email: email,
        metadata: {
          userId: newUser.id,
        },
      });

      // Create the Stripe checkout session
      const session = await stripe.checkout.sessions.create({
        success_url: `http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}&user_id=${newUser.id}`,
        cancel_url: "http://localhost:3000/cancel",
        payment_method_types: ["card"],
        mode: "subscription",
        billing_address_collection: "auto",
        line_items: [
          {
            price: planId,
            quantity: 1,
          },
        ],
        customer: customer.id,
      });

      return res.json({ id: session.id });
    }
  } catch (error) {
    console.error("Error creating Stripe session:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Webhook to handle Stripe events and update user status
// const stripeWebhook = async (req: Request, res: Response): Promise<Response> => {
//   const sig = req.headers["stripe-signature"] as string;

//   let event;

//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       process.env.STRIPE_WEBHOOK_SECRET
//     );
//   } catch (err) {
//     console.error("Webhook error:", err.message);
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }

//   if (event.type === "checkout.session.completed") {
//     const session = event.data.object as Stripe.Checkout.Session;

//     // Retrieve the customer details
//     const customer = await stripe.customers.retrieve(session.customer as string);

//     // Retrieve the user ID from metadata
//     const userId = customer.metadata.userId;

//     // Update the user's status to active
//     await AgentModel.findByIdAndUpdate(userId, { status: "active" }); // Update user status to active
//   }

//   return res.status(200).json({ received: true });
// };

// const webhook = async (req: Request, res: Response): Promise<void> => {
//     const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

//     if (!endpointSecret) {
//       console.error('Stripe webhook secret is not set');
//       res.status(500).send('Webhook secret not configured');
//       return;
//     }

//     const sig = req.headers['stripe-signature'] as string;
//     let event: Stripe.Event;

//     try {
//       event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//     } catch (err: any) {
//       console.error('Webhook Error:', err.message);
//       res.status(400).send(`Webhook Error: ${err.message}`);
//       return;
//     }

//     switch (event.type) {
//       case 'invoice.payment_succeeded':
//         const invoice = event.data.object as Stripe.Invoice;
//         try {
//           const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
//           const customer = await stripe.customers.retrieve(invoice.customer as string);

//           if (invoice.billing_reason === 'subscription_create') {
//             const subscriptionDocument = {
//               userId: customer.metadata.userId,
//               subId: invoice.subscription,
//               endDate: subscription.current_period_end * 1000,
//               status: 'active',
//             };

//             const result = await Subscription.create(subscriptionDocument);
//             console.log(`New subscription created: ${result._id}`);
//           } else if (
//             invoice.billing_reason === 'subscription_cycle' ||
//             invoice.billing_reason === 'subscription_update'
//           ) {
//             const filter = { userId: customer.metadata.userId };
//             const updateDoc = {
//               $set: {
//                 endDate: subscription.current_period_end * 1000,
//                 status: 'active',
//               },
//             };

//             const result = await Subscription?.updateOne(filter, updateDoc);
//             console.log(`Subscription updated: ${result.modifiedCount} document(s) updated`);
//           }
//         } catch (err: any) {
//           console.error('Error processing invoice payment succeeded event:', err.message);
//         }
//         break;

//       case 'customer.subscription.updated':
//         const updatedSubscription = event.data.object as Stripe.Subscription;

//         try {
//           if (updatedSubscription.cancel_at_period_end) {
//             console.log(`Subscription ${updatedSubscription.id} was canceled.`);
//             const filter = { subId: updatedSubscription.id };
//             const updateDoc = { $set: { status: 'canceled' } };

//             await Subscription.updateOne(filter, updateDoc);
//           } else {
//             console.log(`Subscription ${updatedSubscription.id} was updated.`);
//             // Handle subscription update if needed
//           }
//         } catch (err: any) {
//           console.error('Error processing subscription updated event:', err.message);
//         }
//         break;

//       default:
//         console.warn(`Unhandled event type ${event.type}`);
//     }

//     res.status(200).end();
//   };

export { listPlans };
