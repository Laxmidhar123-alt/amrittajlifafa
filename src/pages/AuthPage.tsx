import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate, Link } from 'react-router-dom';
import { Phone, Lock, Eye, EyeOff, User, ArrowRight, Gift } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { login, signup } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!mobile || mobile.length !== 10) {
      toast({ title: 'Please enter valid 10-digit mobile number', variant: 'destructive' });
      return;
    }
    
    if (!password || password.length < 6) {
      toast({ title: 'Password must be at least 6 characters', variant: 'destructive' });
      return;
    }

    if (!isLogin && !name.trim()) {
      toast({ title: 'Please enter your name', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    
    try {
      let success;
      if (isLogin) {
        success = await login(mobile, password);
      } else {
        success = await signup(mobile, password, name);
      }

      if (success) {
        toast({ title: isLogin ? 'Welcome back!' : 'Account created! 🎉 ₹100 bonus added!' });
        navigate('/');
      } else {
        toast({ title: 'Invalid credentials', variant: 'destructive' });
      }
    } catch (error) {
      toast({ title: 'Something went wrong', variant: 'destructive' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header Section */}
      <div className="hero-gradient pt-12 pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-10 left-10 w-20 h-20 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute bottom-10 right-10 w-32 h-32 bg-white/5 rounded-full blur-3xl" />
        </div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative text-center"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className="w-20 h-20 mx-auto mb-4 bg-white/20 rounded-2xl flex items-center justify-center backdrop-blur-sm"
          >
            <Gift className="w-10 h-10 text-primary-foreground" />
          </motion.div>
          <h1 className="text-3xl font-bold text-primary-foreground mb-2">
            Cash IN Reward
          </h1>
          <p className="text-primary-foreground/80">
            Earn rewards, share Lifafa, get rich!
          </p>
        </motion.div>
      </div>

      {/* Form Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex-1 -mt-10 bg-card rounded-t-3xl px-6 pt-8 pb-6"
      >
        {/* Tab Switcher */}
        <div className="flex bg-muted rounded-xl p-1 mb-8">
          <button
            onClick={() => setIsLogin(true)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              isLogin ? 'hero-gradient text-primary-foreground shadow-card' : 'text-muted-foreground'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => setIsLogin(false)}
            className={`flex-1 py-3 rounded-lg font-semibold transition-all ${
              !isLogin ? 'hero-gradient text-primary-foreground shadow-card' : 'text-muted-foreground'
            }`}
          >
            Sign Up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <label className="text-sm font-medium mb-2 block">Full Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  type="text"
                  placeholder="Enter your name"
                  value={name}
                  onChange={e => setName(e.target.value)}
                  className="pl-12 h-14 text-base rounded-xl"
                />
              </div>
            </motion.div>
          )}

          <div>
            <label className="text-sm font-medium mb-2 block">Mobile Number</label>
            <div className="relative">
              <Phone className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <span className="absolute left-12 top-1/2 -translate-y-1/2 text-foreground font-medium">+91</span>
              <Input
                type="tel"
                placeholder="10 digit number"
                value={mobile}
                onChange={e => setMobile(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="pl-24 h-14 text-base rounded-xl"
                maxLength={10}
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
              <Input
                type={showPassword ? 'text' : 'password'}
                placeholder="Enter password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="pl-12 pr-12 h-14 text-base rounded-xl"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5 text-muted-foreground" />
                ) : (
                  <Eye className="w-5 h-5 text-muted-foreground" />
                )}
              </button>
            </div>
          </div>

          {!isLogin && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-emerald/10 border border-emerald/20 rounded-xl p-4"
            >
              <p className="text-sm text-secondary font-medium flex items-center gap-2">
                🎁 Sign up now and get ₹100 welcome bonus!
              </p>
            </motion.div>
          )}

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-14 text-lg font-semibold hero-gradient hover:opacity-90 rounded-xl"
          >
            {isLoading ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ repeat: Infinity, duration: 1 }}
                className="w-6 h-6 border-2 border-primary-foreground border-t-transparent rounded-full"
              />
            ) : (
              <>
                {isLogin ? 'Login' : 'Create Account'}
                <ArrowRight className="w-5 h-5 ml-2" />
              </>
            )}
          </Button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/terms" className="text-sm text-muted-foreground">
            By continuing, you agree to our{' '}
            <span className="text-primary font-medium">Terms & Privacy Policy</span>
          </Link>
        </div>
      </motion.div>
    </div>
  );
}