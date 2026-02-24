import type { VercelRequest, VercelResponse } from '@vercel/node';
import crypto from 'crypto';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client
const supabaseAdmin = createClient(
  process.env.VITE_SUPABASE_URL || '',
  process.env.SUPABASE_SERVICE_ROLE_KEY || ''
);

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      user_id,
      plan_type // 'pass' or 'pro'
    } = req.body;

    if (!process.env.RAZORPAY_KEY_SECRET) {
      return res.status(500).json({ error: 'Razorpay keys not configured' });
    }

    const sign = razorpay_order_id + '|' + razorpay_payment_id;
    const expectedSign = crypto
      .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
      .update(sign.toString())
      .digest('hex');

    if (razorpay_signature === expectedSign) {
      // 1. Payment is verified successfully!
      
      // 2. Determine the exact role/access level based on the plan purchased
      let newRole = 'free';
      if (plan_type === 'pass') {
        newRole = 'event_pass'; // Grants access to specific event features
      } else if (plan_type === 'pro') {
        newRole = 'pro_planner'; // Grants access to all features / agency tools
      }

      if (user_id && newRole !== 'free') {
        // Update the user's metadata in Supabase
        const { error: updateError } = await supabaseAdmin.auth.admin.updateUserById(
          user_id,
          { 
            user_metadata: { 
              role: newRole, 
              plan: plan_type,
              upgraded_at: new Date().toISOString()
            } 
          }
        );

        if (updateError) {
          console.error('Error updating user role:', updateError);
        }
      }

      return res.status(200).json({ 
        message: 'Payment verified successfully',
        role_assigned: newRole
      });
    } else {
      return res.status(400).json({ message: 'Invalid signature sent!' });
    }
  } catch (error) {
    res.status(500).send(error);
  }
}
