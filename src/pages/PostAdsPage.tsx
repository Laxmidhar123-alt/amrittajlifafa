import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Megaphone, Check, Image, IndianRupee, Calendar, Type, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useNavigate } from 'react-router-dom';
import { useUser } from '@/contexts/UserContext';
import { toast } from '@/hooks/use-toast';
import BottomNav from '@/components/BottomNav';

type AdType = 'banner' | 'text' | 'video';

export default function PostAdsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const [isLoading, setIsLoading] = useState(false);
  const [created, setCreated] = useState(false);

  const [formData, setFormData] = useState({
    adTitle: '',
    adDescription: '',
    budget: '',
    duration: '7',
    adType: 'banner' as AdType,
    targetLink: '',
  });

  const adTypeOptions: { type: AdType; label: string; icon: React.ReactNode }[] = [
    { type: 'banner', label: 'Banner', icon: <Image className="w-5 h-5" /> },
    { type: 'text', label: 'Text', icon: <Type className="w-5 h-5" /> },
    { type: 'video', label: 'Video', icon: <FileText className="w-5 h-5" /> },
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleCreate = async () => {
    const { adTitle, budget, duration, targetLink } = formData;

    if (!adTitle.trim()) {
      toast({ title: 'Please enter ad title', variant: 'destructive' });
      return;
    }
    if (!budget || parseInt(budget) < 100) {
      toast({ title: 'Minimum budget is ₹100', variant: 'destructive' });
      return;
    }
    if (!duration || parseInt(duration) < 1) {
      toast({ title: 'Please enter duration', variant: 'destructive' });
      return;
    }
    if (!targetLink.trim()) {
      toast({ title: 'Please enter target link', variant: 'destructive' });
      return;
    }

    if (user && parseInt(budget) > user.balance) {
      toast({ title: 'Insufficient balance', variant: 'destructive' });
      return;
    }

    setIsLoading(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsLoading(false);
    setCreated(true);
    toast({ title: 'Ad posted successfully! 🎉' });
  };

  const handleReset = () => {
    setCreated(false);
    setFormData({
      adTitle: '',
      adDescription: '',
      budget: '',
      duration: '7',
      adType: 'banner',
      targetLink: '',
    });
  };

  if (!user) {
    navigate('/auth');
    return null;
  }

  return (
    <div className="min-h-screen bg-background pb-24">
      <div className="max-w-lg mx-auto px-4">
        {/* Header */}
        <div className="flex items-center gap-3 py-4">
          <button onClick={() => navigate(-1)} className="p-2 rounded-full bg-card">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-bold">Post Advertisement</h1>
        </div>

        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-500 to-pink-400 rounded-2xl p-6 mb-6 text-center"
        >
          <motion.div
            animate={{ rotate: [0, 5, -5, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-3"
          >
            <Megaphone className="w-8 h-8 text-white" />
          </motion.div>
          <h2 className="text-white font-bold text-lg">Promote Your Brand</h2>
          <p className="text-white/80 text-sm">Reach thousands of active users</p>
        </motion.div>

        {created ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card rounded-2xl p-6 shadow-card text-center"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4"
            >
              <Check className="w-8 h-8 text-secondary-foreground" />
            </motion.div>
            
            <h3 className="text-xl font-bold mb-2">Ad Posted!</h3>
            <p className="text-muted-foreground mb-6">
              Your ad is now under review and will be live within 24 hours
            </p>
            
            <div className="flex gap-3">
              <Button onClick={handleReset} variant="outline" className="flex-1">
                Post Another
              </Button>
              <Button onClick={() => navigate('/')} className="flex-1 hero-gradient">
                Go Home
              </Button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="space-y-4"
          >
            {/* Ad Type Selection */}
            <div className="bg-card rounded-2xl p-4 shadow-card">
              <Label className="mb-3 block">Ad Type</Label>
              <div className="grid grid-cols-3 gap-3">
                {adTypeOptions.map(option => (
                  <motion.button
                    key={option.type}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleInputChange('adType', option.type)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.adType === option.type
                        ? 'border-primary bg-primary/10'
                        : 'border-border bg-muted'
                    }`}
                  >
                    <div className="w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-2 text-white">
                      {option.icon}
                    </div>
                    <p className="text-sm font-medium">{option.label}</p>
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Form Fields */}
            <div className="bg-card rounded-2xl p-5 shadow-card space-y-5">
              <div>
                <Label htmlFor="adTitle" className="flex items-center gap-2 mb-2">
                  <Type className="w-4 h-4 text-primary" />
                  Ad Title
                </Label>
                <Input
                  id="adTitle"
                  placeholder="Your catchy ad headline"
                  value={formData.adTitle}
                  onChange={e => handleInputChange('adTitle', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="adDescription" className="mb-2 block">Description</Label>
                <Textarea
                  id="adDescription"
                  placeholder="Describe your offer in detail..."
                  value={formData.adDescription}
                  onChange={e => handleInputChange('adDescription', e.target.value)}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="targetLink" className="mb-2 block">Target Link</Label>
                <Input
                  id="targetLink"
                  placeholder="https://yourwebsite.com"
                  value={formData.targetLink}
                  onChange={e => handleInputChange('targetLink', e.target.value)}
                />
              </div>

              {/* Upload Banner */}
              {formData.adType === 'banner' && (
                <div>
                  <Label className="mb-2 block">Upload Banner</Label>
                  <div className="border-2 border-dashed border-border rounded-xl p-6 text-center cursor-pointer hover:bg-muted/50 transition-colors">
                    <Image className="w-10 h-10 mx-auto mb-2 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">Click to upload image</p>
                    <p className="text-xs text-muted-foreground mt-1">Recommended: 1200x628px</p>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="budget" className="flex items-center gap-2 mb-2">
                    <IndianRupee className="w-4 h-4 text-primary" />
                    Budget (₹)
                  </Label>
                  <Input
                    id="budget"
                    type="number"
                    placeholder="Min ₹100"
                    value={formData.budget}
                    onChange={e => handleInputChange('budget', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="duration" className="flex items-center gap-2 mb-2">
                    <Calendar className="w-4 h-4 text-primary" />
                    Duration (Days)
                  </Label>
                  <Input
                    id="duration"
                    type="number"
                    placeholder="7"
                    value={formData.duration}
                    onChange={e => handleInputChange('duration', e.target.value)}
                    min="1"
                  />
                </div>
              </div>
            </div>

            {/* Estimated Reach */}
            {formData.budget && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="bg-muted rounded-xl p-4"
              >
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-sm text-muted-foreground">Estimated Reach</p>
                    <p className="text-xl font-bold text-primary">
                      {Math.floor(parseInt(formData.budget) * 10).toLocaleString()}+ users
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-muted-foreground">Cost per View</p>
                    <p className="text-lg font-semibold">₹0.10</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Info Card */}
            <div className="bg-muted rounded-xl p-4">
              <h4 className="font-semibold mb-2 text-sm">Ad Guidelines:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Ads are reviewed within 24 hours</li>
                <li>• No adult or illegal content allowed</li>
                <li>• Refunds available for unused budget</li>
              </ul>
            </div>

            {/* Post Button */}
            <Button
              onClick={handleCreate}
              disabled={isLoading}
              className="w-full h-14 bg-gradient-to-r from-purple-500 to-pink-400 hover:opacity-90 text-lg font-semibold"
            >
              {isLoading ? (
                <span>Posting Ad...</span>
              ) : (
                <div className="flex items-center gap-2">
                  <Megaphone className="w-5 h-5" />
                  <span>Post Advertisement</span>
                </div>
              )}
            </Button>
          </motion.div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}
