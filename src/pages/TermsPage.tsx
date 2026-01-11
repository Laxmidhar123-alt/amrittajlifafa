import { motion } from 'framer-motion';
import { ArrowLeft, FileText, Shield } from 'lucide-react';
import BottomNav from '@/components/BottomNav';
import { Link } from 'react-router-dom';

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-6"
        >
          <Link to="/help">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-2xl font-bold">Terms & Privacy</h1>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          {/* Terms Section */}
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <FileText className="w-6 h-6 text-primary" />
              <h2 className="text-lg font-bold">Terms of Service</h2>
            </div>
            <div className="prose prose-sm text-muted-foreground space-y-3">
              <p>Welcome to Cash IN Reward. By using our app, you agree to these terms:</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>You must be 18 years or older to use this service</li>
                <li>All rewards are subject to verification before withdrawal</li>
                <li>Fraudulent activities will result in account suspension</li>
                <li>We reserve the right to modify reward amounts</li>
                <li>Withdrawal processing takes 24-48 hours</li>
                <li>Minimum withdrawal amount varies by payment method</li>
              </ul>
            </div>
          </div>

          {/* Privacy Section */}
          <div className="bg-card rounded-2xl p-6 shadow-card">
            <div className="flex items-center gap-3 mb-4">
              <Shield className="w-6 h-6 text-secondary" />
              <h2 className="text-lg font-bold">Privacy Policy</h2>
            </div>
            <div className="prose prose-sm text-muted-foreground space-y-3">
              <p>Your privacy is important to us:</p>
              <ul className="list-disc pl-4 space-y-2">
                <li>We collect only necessary information for service delivery</li>
                <li>Your data is encrypted and securely stored</li>
                <li>We never share your personal data with third parties</li>
                <li>You can request data deletion at any time</li>
                <li>Cookies are used to improve user experience</li>
              </ul>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-muted rounded-xl p-4 text-center">
            <p className="text-sm text-muted-foreground">
              For questions, contact us at{' '}
              <span className="text-primary font-medium">legal@cashinreward.in</span>
            </p>
          </div>
        </motion.div>
      </div>
      <BottomNav />
    </div>
  );
}