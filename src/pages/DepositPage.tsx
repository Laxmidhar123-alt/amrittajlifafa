import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, PlusCircle, QrCode, CreditCard, Copy, Check, Clock, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import BottomNav from '@/components/BottomNav';
import { useUser } from '@/contexts/UserContext';
import { Navigate, Link } from 'react-router-dom';
import { toast } from '@/hooks/use-toast';

const amounts = [100, 200, 500, 1000, 2000, 5000];

type Step = 'amount' | 'payment' | 'verify' | 'success';

export default function DepositPage() {
  const { isAuthenticated, addTransaction } = useUser();
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<Step>('amount');
  const [transactionId, setTransactionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const upiId = 'cashinreward@upi';

  if (!isAuthenticated) {
    return <Navigate to="/auth" replace />;
  }

  const handleProceedToPayment = () => {
    const amountNum = parseInt(amount);
    if (!amountNum || amountNum < 50) {
      toast({ title: 'Minimum deposit is ₹50', variant: 'destructive' });
      return;
    }
    setStep('payment');
  };

  const handlePaymentDone = () => {
    setStep('verify');
  };

  const handleVerifyTransaction = async () => {
    if (!transactionId.trim() || transactionId.length < 6) {
      toast({ title: 'Please enter a valid transaction ID', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 2000));

    addTransaction({
      type: 'deposit',
      amount: parseInt(amount),
      status: 'pending',
      description: `Wallet Recharge (TXN: ${transactionId})`,
    });

    setIsLoading(false);
    setStep('success');
  };

  const copyUpiId = () => {
    navigator.clipboard.writeText(upiId);
    setCopied(true);
    toast({ title: 'UPI ID copied!' });
    setTimeout(() => setCopied(false), 2000);
  };

  const resetForm = () => {
    setAmount('');
    setTransactionId('');
    setStep('amount');
  };

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <button onClick={() => step === 'amount' ? window.history.back() : setStep('amount')}>
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">
            {step === 'amount' && 'Add Money'}
            {step === 'payment' && 'Scan & Pay'}
            {step === 'verify' && 'Verify Payment'}
            {step === 'success' && 'Payment Submitted'}
          </h1>
        </motion.div>

        {/* Step 1: Amount Selection */}
        {step === 'amount' && (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="money-gradient rounded-2xl p-6 text-center">
              <PlusCircle className="w-12 h-12 mx-auto mb-3 text-secondary-foreground" />
              <h2 className="text-xl font-bold text-secondary-foreground">Add Money</h2>
              <p className="text-secondary-foreground/80 text-sm">Instant wallet recharge</p>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Enter Amount (₹)</label>
              <Input
                type="number"
                placeholder="Min ₹50"
                value={amount}
                onChange={e => setAmount(e.target.value)}
                className="h-16 text-2xl font-bold text-center rounded-xl"
              />
            </div>

            <div className="grid grid-cols-3 gap-3">
              {amounts.map(amt => (
                <button
                  key={amt}
                  onClick={() => setAmount(amt.toString())}
                  className={`py-3 rounded-xl font-semibold transition-all ${
                    amount === amt.toString()
                      ? 'hero-gradient text-primary-foreground shadow-card'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                  }`}
                >
                  ₹{amt}
                </button>
              ))}
            </div>

            <div className="bg-card rounded-xl p-4 shadow-card">
              <h3 className="font-semibold mb-3">Payment Methods</h3>
              <div className="space-y-2">
                <label className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer">
                  <input type="radio" name="method" defaultChecked className="accent-primary" />
                  <QrCode className="w-5 h-5 text-purple" />
                  <span>UPI / QR Code</span>
                </label>
                <label className="flex items-center gap-3 p-3 bg-muted rounded-lg cursor-pointer opacity-50">
                  <input type="radio" name="method" disabled className="accent-primary" />
                  <CreditCard className="w-5 h-5 text-primary" />
                  <span>Card / Net Banking (Coming Soon)</span>
                </label>
              </div>
            </div>

            <Button
              onClick={handleProceedToPayment}
              className="w-full h-14 text-lg font-bold money-gradient hover:opacity-90 rounded-xl"
            >
              Proceed to Pay
            </Button>
          </motion.div>
        )}

        {/* Step 2: QR Code Payment */}
        {step === 'payment' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl p-6 shadow-card text-center">
              <div className="bg-primary/10 text-primary font-bold text-xl py-2 px-4 rounded-lg inline-block mb-4">
                ₹{parseInt(amount).toLocaleString('en-IN')}
              </div>

              {/* Demo QR Code */}
              <div className="bg-white p-4 rounded-xl inline-block mb-4">
                <div className="w-48 h-48 bg-gradient-to-br from-gray-800 to-gray-600 rounded-lg flex items-center justify-center relative overflow-hidden">
                  {/* QR Pattern Simulation */}
                  <div className="absolute inset-2 grid grid-cols-8 gap-0.5">
                    {Array.from({ length: 64 }).map((_, i) => (
                      <div
                        key={i}
                        className={`${Math.random() > 0.5 ? 'bg-white' : 'bg-transparent'}`}
                      />
                    ))}
                  </div>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="bg-white p-2 rounded">
                      <QrCode className="w-8 h-8 text-gray-800" />
                    </div>
                  </div>
                </div>
              </div>

              <p className="text-sm text-muted-foreground mb-2">Scan QR code with any UPI app</p>
              
              {/* UPI ID */}
              <div className="bg-muted rounded-xl p-3 flex items-center justify-between gap-2">
                <div className="flex-1">
                  <p className="text-xs text-muted-foreground">UPI ID</p>
                  <p className="font-semibold">{upiId}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={copyUpiId}
                  className="shrink-0"
                >
                  {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                </Button>
              </div>
            </div>

            {/* Warning */}
            <div className="bg-amber-500/10 border border-amber-500/30 rounded-xl p-4 flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
              <div className="text-sm">
                <p className="font-semibold text-amber-600 dark:text-amber-400 mb-1">Important</p>
                <p className="text-muted-foreground">
                  After successful payment, note down your Transaction ID (UTR number) from your UPI app.
                </p>
              </div>
            </div>

            <Button
              onClick={handlePaymentDone}
              className="w-full h-14 text-lg font-bold hero-gradient hover:opacity-90 rounded-xl"
            >
              I've Made the Payment
            </Button>
          </motion.div>
        )}

        {/* Step 3: Transaction ID Verification */}
        {step === 'verify' && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl p-6 shadow-card text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <h3 className="text-lg font-bold mb-2">Verify Your Payment</h3>
              <p className="text-muted-foreground text-sm">
                Enter the Transaction ID (UTR) from your payment app to verify
              </p>
            </div>

            <div className="bg-muted rounded-xl p-4 text-center">
              <p className="text-sm text-muted-foreground">Amount Paid</p>
              <p className="text-2xl font-bold text-primary">₹{parseInt(amount).toLocaleString('en-IN')}</p>
            </div>

            <div>
              <Label htmlFor="txnId" className="mb-2 block">Transaction ID (UTR Number)</Label>
              <Input
                id="txnId"
                placeholder="e.g., 123456789012"
                value={transactionId}
                onChange={e => setTransactionId(e.target.value)}
                className="h-14 text-lg font-semibold text-center"
              />
              <p className="text-xs text-muted-foreground mt-2">
                You can find this in your UPI app under transaction details
              </p>
            </div>

            <Button
              onClick={handleVerifyTransaction}
              disabled={isLoading}
              className="w-full h-14 text-lg font-bold money-gradient hover:opacity-90 rounded-xl"
            >
              {isLoading ? (
                <div className="flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1 }}
                    className="w-5 h-5 border-2 border-white border-t-transparent rounded-full"
                  />
                  <span>Verifying...</span>
                </div>
              ) : (
                'Submit for Verification'
              )}
            </Button>
          </motion.div>
        )}

        {/* Step 4: Success */}
        {step === 'success' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="space-y-6"
          >
            <div className="bg-card rounded-2xl p-6 shadow-card text-center">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                className="w-20 h-20 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <Check className="w-10 h-10 text-white" />
              </motion.div>
              
              <h3 className="text-xl font-bold mb-2">Payment Submitted!</h3>
              <p className="text-muted-foreground mb-4">
                Your payment is under verification
              </p>

              <div className="bg-muted rounded-xl p-4 space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-semibold">₹{parseInt(amount).toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Transaction ID</span>
                  <span className="font-semibold">{transactionId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Status</span>
                  <span className="text-amber-500 font-semibold flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    Pending
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4">
              <p className="text-sm text-blue-600 dark:text-blue-400">
                💡 Your payment will be verified within 5-10 minutes. Amount will be credited to your wallet after verification.
              </p>
            </div>

            <div className="flex gap-3">
              <Button onClick={resetForm} variant="outline" className="flex-1">
                Add More Money
              </Button>
              <Link to="/" className="flex-1">
                <Button className="w-full hero-gradient">
                  Go Home
                </Button>
              </Link>
            </div>
          </motion.div>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
