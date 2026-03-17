const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

module.exports = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const sig = req.headers['stripe-signature'];
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  let event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
  } catch (err) {
    console.error('Webhook signature verification failed:', err.message);
    return res.status(400).json({ error: `Webhook Error: ${err.message}` });
  }

  // Handle the event
  try {
    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object;
        await handleCheckoutCompleted(session);
        break;
      }

      case 'customer.subscription.updated': {
        const subscription = event.data.object;
        await handleSubscriptionUpdated(subscription);
        break;
      }

      case 'customer.subscription.deleted': {
        const subscription = event.data.object;
        await handleSubscriptionDeleted(subscription);
        break;
      }

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Error handling webhook:', error);
    res.status(500).json({ error: 'Webhook handler failed' });
  }
};

async function handleCheckoutCompleted(session) {
  const email = session.customer_email || session.customer_details?.email;
  const customerId = session.customer;
  const subscriptionId = session.subscription;

  if (!email) {
    console.error('No email found in checkout session');
    return;
  }

  // Find user by email
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();

  if (userError) {
    console.error('Error fetching users:', userError);
    return;
  }

  const user = users.users.find(u => u.email === email);

  if (!user) {
    console.error(`No Supabase user found for email: ${email}`);
    return;
  }

  // Update user metadata with Stripe info
  const { error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    {
      user_metadata: {
        stripe_customer_id: customerId,
        stripe_subscription_id: subscriptionId,
        subscription_status: 'active',
        subscription_tier: 'supporter'
      }
    }
  );

  if (updateError) {
    console.error('Error updating user metadata:', updateError);
  } else {
    console.log(`Linked Stripe customer ${customerId} to user ${user.id}`);
  }
}

async function handleSubscriptionUpdated(subscription) {
  const customerId = subscription.customer;

  // Find user by customer ID
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();

  if (userError) {
    console.error('Error fetching users:', userError);
    return;
  }

  const user = users.users.find(u =>
    u.user_metadata?.stripe_customer_id === customerId
  );

  if (!user) {
    console.error(`No user found for customer: ${customerId}`);
    return;
  }

  // Update subscription status
  const { error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    {
      user_metadata: {
        ...user.user_metadata,
        stripe_subscription_id: subscription.id,
        subscription_status: subscription.status,
        subscription_tier: subscription.status === 'active' ? 'supporter' : 'free'
      }
    }
  );

  if (updateError) {
    console.error('Error updating subscription status:', updateError);
  } else {
    console.log(`Updated subscription status for user ${user.id}: ${subscription.status}`);
  }
}

async function handleSubscriptionDeleted(subscription) {
  const customerId = subscription.customer;

  // Find user by customer ID
  const { data: users, error: userError } = await supabase.auth.admin.listUsers();

  if (userError) {
    console.error('Error fetching users:', userError);
    return;
  }

  const user = users.users.find(u =>
    u.user_metadata?.stripe_customer_id === customerId
  );

  if (!user) {
    console.error(`No user found for customer: ${customerId}`);
    return;
  }

  // Downgrade to free
  const { error: updateError } = await supabase.auth.admin.updateUserById(
    user.id,
    {
      user_metadata: {
        ...user.user_metadata,
        subscription_status: 'canceled',
        subscription_tier: 'free'
      }
    }
  );

  if (updateError) {
    console.error('Error downgrading user:', updateError);
  } else {
    console.log(`Downgraded user ${user.id} to free tier`);
  }
}
