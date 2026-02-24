import React, { useState } from 'react';
import { Check, X, Star, Zap, Shield, ArrowRight, Loader2, CreditCard } from 'lucide-react';

interface PricingProps {
  onBack: () => void;
  onUpgradeSuccess: (tier: 'PASS' | 'PRO') => void;
}

const Pricing: React.FC<PricingProps> = ({ onBack, onUpgradeSuccess }) => {
  const [checkoutPlan, setCheckoutPlan] = useState<'pass' | 'pro' | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  const handleCheckout = (plan: 'pass' | 'pro') => {
    setCheckoutPlan(plan);
  };

  const processPayment = async () => {
    setIsProcessing(true);
    
    try {
      const amount = checkoutPlan === 'pass' ? 99 : 999;
      
      // 1. Create order on server
      const orderResponse = await fetch('/api/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency: 'INR',
          receipt: `receipt_${Date.now()}`,
        }),
      });
      
      if (!orderResponse.ok) {
        throw new Error('Failed to create order');
      }
      
      const order = await orderResponse.json();

      // 2. Initialize Razorpay Checkout
      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
        amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
        currency: order.currency,
        name: 'EventWise Planner',
        description: `Upgrade to ${checkoutPlan === 'pass' ? 'Event Pass' : 'Pro Planner'}`,
        order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
        handler: async function (response: any) {
          // 3. Verify payment on server
          try {
            const verifyResponse = await fetch('/api/verify-payment', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            
            if (verifyResponse.ok) {
              onUpgradeSuccess(checkoutPlan === 'pass' ? 'PASS' : 'PRO');
            } else {
              alert('Payment verification failed. Please contact support.');
            }
          } catch (error) {
            console.error('Verification error:', error);
            alert('Payment verification failed. Please contact support.');
          } finally {
            setIsProcessing(false);
          }
        },
        prefill: {
          name: 'John Doe',
          email: 'john.doe@example.com',
          contact: '9999999999',
        },
        theme: {
          color: '#4f46e5',
        },
        modal: {
          ondismiss: function() {
            setIsProcessing(false);
          }
        }
      };

      const rzp = new (window as any).Razorpay(options);
      rzp.on('payment.failed', function (response: any) {
        console.error(response.error);
        alert('Payment failed: ' + response.error.description);
        setIsProcessing(false);
      });
      rzp.open();
      
    } catch (error) {
      console.error('Payment error:', error);
      alert('Could not initialize payment. Please try again later.');
      setIsProcessing(false);
    }
  };

  if (checkoutPlan) {
    return (
      <div className="max-w-2xl mx-auto py-12 animate-in fade-in duration-500">
        <button onClick={() => setCheckoutPlan(null)} className="mb-8 text-slate-500 hover:text-slate-900 font-medium flex items-center gap-2">
          &larr; Back to Plans
        </button>
        
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden">
          <div className="bg-slate-50 p-8 border-b border-slate-100 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-900">Checkout</h2>
              <p className="text-slate-500 mt-1">Complete your secure payment</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Total Due</p>
              <p className="text-3xl font-black text-indigo-600">
                {checkoutPlan === 'pass' ? '₹99' : '₹999'}
              </p>
            </div>
          </div>
          
          <div className="p-8 space-y-6">
            <div className="flex items-center gap-4 p-4 bg-indigo-50 text-indigo-700 rounded-2xl border border-indigo-100">
              <Shield size={24} />
              <div>
                <p className="font-bold">Secure Payment</p>
                <p className="text-sm">You will be redirected to Razorpay to complete your purchase securely.</p>
              </div>
            </div>

            <button 
              onClick={processPayment}
              disabled={isProcessing}
              className="w-full flex items-center justify-center gap-2 py-4 bg-indigo-600 text-white rounded-xl font-black text-lg hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200 disabled:opacity-70"
            >
              {isProcessing ? (
                <>
                  <Loader2 className="animate-spin" size={24} /> Processing...
                </>
              ) : (
                `Pay ${checkoutPlan === 'pass' ? '₹99' : '₹999'}`
              )}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 animate-in fade-in duration-500">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Simple, transparent pricing
        </h1>
        <p className="text-xl text-slate-500 max-w-2xl mx-auto">
          Whether you're planning a single wedding or running an event management business, we have a plan for you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
        
        {/* Free Plan */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-2">Free Starter</h3>
            <p className="text-slate-500 text-sm h-10">Perfect for small, simple events and trying out the platform.</p>
            <div className="mt-6">
              <span className="text-4xl font-black text-slate-900">₹0</span>
              <span className="text-slate-500 font-medium">/forever</span>
            </div>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <FeatureItem text="Up to 2 Active Projects" included />
            <FeatureItem text="Unlimited Guests" included />
            <FeatureItem text="Basic Budget & Checklist" included />
            <FeatureItem text="Advanced Pro Modules" included={false} />
            <FeatureItem text="PDF Exports" included={false} />
          </ul>
          
          <button onClick={onBack} className="w-full py-3 px-6 bg-slate-100 text-slate-700 rounded-xl font-bold hover:bg-slate-200 transition-colors">
            Current Plan
          </button>
        </div>

        {/* Event Pass */}
        <div className="bg-indigo-600 p-8 rounded-[32px] border border-indigo-500 shadow-2xl shadow-indigo-200 flex flex-col relative transform md:-translate-y-4">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-amber-400 to-orange-500 text-white px-4 py-1 rounded-full text-xs font-black uppercase tracking-widest shadow-lg">
            Most Popular
          </div>
          
          <div className="mb-8 text-white">
            <h3 className="text-xl font-bold mb-2">Event Pass</h3>
            <p className="text-indigo-200 text-sm h-10">Perfect for planning a handful of events with premium tools.</p>
            <div className="mt-6">
              <span className="text-4xl font-black">₹99</span>
              <span className="text-indigo-200 font-medium">/one-time</span>
            </div>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1 text-indigo-100">
            <FeatureItem text="Up to 5 Active Projects" included light />
            <FeatureItem text="Unlimited Guests" included light />
            <FeatureItem text="Seating Mapper 👑" included light />
            <FeatureItem text="Run Sheet & Logistics 👑" included light />
            <FeatureItem text="PDF & CSV Exports 👑" included light />
            <FeatureItem text="Priority Email Support" included light />
          </ul>
          
          <button onClick={() => handleCheckout('pass')} className="w-full py-3 px-6 bg-white text-indigo-600 rounded-xl font-black hover:bg-indigo-50 transition-colors shadow-lg">
            Get Event Pass
          </button>
        </div>

        {/* Pro Planner (One-time) */}
        <div className="bg-white p-8 rounded-[32px] border border-slate-100 shadow-sm flex flex-col">
          <div className="mb-8">
            <h3 className="text-xl font-bold text-slate-900 mb-2 flex items-center gap-2">
              Pro Planner <Star size={16} className="text-amber-400 fill-amber-400" />
            </h3>
            <p className="text-slate-500 text-sm h-10">For professional planners managing unlimited events.</p>
            <div className="mt-6">
              <span className="text-4xl font-black text-slate-900">₹999</span>
              <span className="text-slate-500 font-medium">/one-time</span>
            </div>
          </div>
          
          <ul className="space-y-4 mb-8 flex-1">
            <FeatureItem text="Unlimited Projects" included />
            <FeatureItem text="All Pro Modules 👑" included />
            <FeatureItem text="White-label Exports" included />
            <FeatureItem text="Client Collaboration" included />
            <FeatureItem text="Custom Branding" included />
            <FeatureItem text="24/7 Priority Support" included />
          </ul>
          
          <button onClick={() => handleCheckout('pro')} className="w-full py-3 px-6 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg">
            Get Pro Planner
          </button>
        </div>

      </div>
    </div>
  );
};

const FeatureItem = ({ text, included, light = false }: { text: string, included: boolean, light?: boolean }) => (
  <li className="flex items-start gap-3">
    {included ? (
      <Check size={20} className={`flex-shrink-0 ${light ? 'text-indigo-300' : 'text-emerald-500'}`} />
    ) : (
      <X size={20} className="flex-shrink-0 text-slate-300" />
    )}
    <span className={`text-sm font-medium ${!included ? 'text-slate-400 line-through' : ''}`}>
      {text}
    </span>
  </li>
);

export default Pricing;
