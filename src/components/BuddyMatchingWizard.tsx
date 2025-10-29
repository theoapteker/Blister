'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Users,
  Building2,
  Globe2,
  Heart,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Info,
} from 'lucide-react';

interface MatchCriteria {
  name: string;
  weight: number;
  description: string;
  userValue: string;
}

interface Criteria {
  department: MatchCriteria;
  timezone: MatchCriteria;
  interests: MatchCriteria;
  experience: MatchCriteria;
}

interface CompatibilityBreakdown {
  departmentMatch: number;
  timezoneMatch: number;
  interestMatch: number;
  experienceMatch: number;
}

interface BuddyMatch {
  id: string;
  name: string;
  email: string;
  avatar: string | null;
  title: string | null;
  department: string | null;
  timezone: string | null;
  interests: string[];
  startDate: Date | null;
  compatibilityScore: number;
  compatibilityBreakdown: CompatibilityBreakdown;
  activeBuddies: number;
}

interface MatchesResponse {
  matches: BuddyMatch[];
  criteria: Criteria;
}

const steps = [
  {
    id: 1,
    title: 'Welcome to Buddy Matching',
    description: 'Find your perfect workplace companion',
  },
  {
    id: 2,
    title: 'Matching Criteria',
    description: 'See how we find your ideal buddy',
  },
  {
    id: 3,
    title: 'Your Matches',
    description: 'Choose from top compatible buddies',
  },
  {
    id: 4,
    title: 'Confirm Selection',
    description: 'Review your buddy choice',
  },
  {
    id: 5,
    title: 'Success!',
    description: 'Your buddy has been matched',
  },
];

export default function BuddyMatchingWizard({ onComplete }: { onComplete?: () => void }) {
  const [currentStep, setCurrentStep] = useState(1);
  const [matches, setMatches] = useState<BuddyMatch[]>([]);
  const [criteria, setCriteria] = useState<Criteria | null>(null);
  const [selectedBuddy, setSelectedBuddy] = useState<BuddyMatch | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch matches when moving to step 3
  useEffect(() => {
    if (currentStep === 3 && matches.length === 0) {
      fetchMatches();
    }
  }, [currentStep]);

  const fetchMatches = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/buddies/matches');
      if (!response.ok) throw new Error('Failed to fetch matches');
      const data: MatchesResponse = await response.json();
      setMatches(data.matches);
      setCriteria(data.criteria);
    } catch (err) {
      setError('Failed to load buddy matches. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleBuddyRequest = async () => {
    if (!selectedBuddy) return;

    setLoading(true);
    setError(null);
    try {
      const response = await fetch('/api/buddies/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ buddyId: selectedBuddy.id }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to create buddy match');
      }

      setCurrentStep(5);
    } catch (err: any) {
      setError(err.message || 'Failed to create buddy match. Please try again.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return <Step1Welcome />;
      case 2:
        return <Step2Criteria criteria={criteria} />;
      case 3:
        return (
          <Step3Matches
            matches={matches}
            loading={loading}
            selectedBuddy={selectedBuddy}
            onSelectBuddy={setSelectedBuddy}
          />
        );
      case 4:
        return <Step4Confirm selectedBuddy={selectedBuddy} />;
      case 5:
        return <Step5Success selectedBuddy={selectedBuddy} onComplete={onComplete} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center flex-1">
                <div className="flex flex-col items-center flex-1">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-all ${
                      currentStep >= step.id
                        ? 'bg-purple-500 text-white'
                        : 'bg-gray-700 text-gray-400'
                    }`}
                  >
                    {currentStep > step.id ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      step.id
                    )}
                  </div>
                  <div className="text-center mt-2 hidden sm:block">
                    <p
                      className={`text-xs font-medium ${
                        currentStep >= step.id ? 'text-white' : 'text-gray-400'
                      }`}
                    >
                      {step.title.split(' ')[0]}
                    </p>
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`h-1 flex-1 mx-2 transition-all ${
                      currentStep > step.id ? 'bg-purple-500' : 'bg-gray-700'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStepContent()}
          </motion.div>
        </AnimatePresence>

        {/* Error Message */}
        {error && (
          <div className="mt-4 p-4 bg-red-500/20 border border-red-500 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Navigation Buttons */}
        {currentStep !== 5 && (
          <div className="flex justify-between mt-8">
            <button
              onClick={prevStep}
              disabled={currentStep === 1}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                currentStep === 1
                  ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              <ArrowLeft className="w-5 h-5" />
              Back
            </button>

            {currentStep === 4 ? (
              <button
                onClick={handleBuddyRequest}
                disabled={!selectedBuddy || loading}
                className={`flex items-center gap-2 px-8 py-3 rounded-lg font-semibold transition-all ${
                  !selectedBuddy || loading
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                {loading ? 'Creating Match...' : 'Confirm Buddy'}
                {!loading && <CheckCircle2 className="w-5 h-5" />}
              </button>
            ) : (
              <button
                onClick={nextStep}
                disabled={currentStep === 3 && !selectedBuddy}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                  currentStep === 3 && !selectedBuddy
                    ? 'bg-gray-700 text-gray-500 cursor-not-allowed'
                    : 'bg-gradient-to-r from-purple-500 to-pink-500 text-white hover:shadow-lg hover:scale-105'
                }`}
              >
                Next
                <ArrowRight className="w-5 h-5" />
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Step 1: Welcome
function Step1Welcome() {
  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="inline-block p-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full mb-6"
        >
          <Users className="w-16 h-16 text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Find Your Perfect Buddy
        </h1>
        <p className="text-xl text-gray-300 mb-6">
          Our intelligent matching system pairs you with colleagues who share your
          interests, work in compatible timezones, and can help you succeed.
        </p>
        <div className="grid grid-cols-2 gap-4 mt-8">
          <div className="bg-white/5 rounded-lg p-4">
            <Sparkles className="w-8 h-8 text-purple-400 mb-2 mx-auto" />
            <h3 className="font-semibold text-white mb-1">Smart Matching</h3>
            <p className="text-sm text-gray-400">
              AI-powered algorithm finds your best matches
            </p>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <Heart className="w-8 h-8 text-pink-400 mb-2 mx-auto" />
            <h3 className="font-semibold text-white mb-1">Build Connections</h3>
            <p className="text-sm text-gray-400">
              Form meaningful workplace relationships
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Step 2: Criteria Explanation
function Step2Criteria({ criteria }: { criteria: Criteria | null }) {
  const criteriaItems = [
    {
      icon: Building2,
      color: 'text-blue-400',
      bgColor: 'bg-blue-500/20',
      name: 'Department Match',
      weight: 30,
      description: 'Same department (30pts) or different department (10pts)',
      userValue: criteria?.department.userValue || 'Loading...',
    },
    {
      icon: Globe2,
      color: 'text-green-400',
      bgColor: 'bg-green-500/20',
      name: 'Timezone Compatibility',
      weight: 20,
      description: 'Same timezone (20pts) or different timezone (5pts)',
      userValue: criteria?.timezone.userValue || 'Loading...',
    },
    {
      icon: Heart,
      color: 'text-pink-400',
      bgColor: 'bg-pink-500/20',
      name: 'Common Interests',
      weight: 30,
      description: '10 points per shared interest (maximum 30pts)',
      userValue: criteria?.interests.userValue || 'Loading...',
    },
    {
      icon: TrendingUp,
      color: 'text-purple-400',
      bgColor: 'bg-purple-500/20',
      name: 'Experience Level',
      weight: 20,
      description: 'Buddies with 3-12 months more experience (20pts)',
      userValue: criteria?.experience.userValue || 'Loading...',
    },
  ];

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">How We Match You</h2>
        <p className="text-gray-300">
          Our algorithm considers 4 key factors to find your ideal buddy
        </p>
      </div>

      <div className="space-y-4">
        {criteriaItems.map((item, index) => (
          <motion.div
            key={item.name}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white/5 rounded-xl p-6 hover:bg-white/10 transition-all"
          >
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${item.bgColor}`}>
                <item.icon className={`w-6 h-6 ${item.color}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-white text-lg">{item.name}</h3>
                  <span className="px-3 py-1 bg-purple-500/30 rounded-full text-sm font-semibold text-purple-300">
                    {item.weight} pts max
                  </span>
                </div>
                <p className="text-gray-400 text-sm mb-2">{item.description}</p>
                <div className="flex items-center gap-2 mt-3">
                  <Info className="w-4 h-4 text-gray-500" />
                  <span className="text-sm text-gray-300">
                    Your value: <span className="font-semibold text-white">{item.userValue}</span>
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-purple-500/20 border border-purple-500/50 rounded-lg">
        <p className="text-center text-purple-200">
          <strong>Maximum Score:</strong> 100 points · Higher scores indicate better compatibility
        </p>
      </div>
    </div>
  );
}

// Step 3: View Matches
function Step3Matches({
  matches,
  loading,
  selectedBuddy,
  onSelectBuddy,
}: {
  matches: BuddyMatch[];
  loading: boolean;
  selectedBuddy: BuddyMatch | null;
  onSelectBuddy: (buddy: BuddyMatch) => void;
}) {
  if (loading) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-purple-500 mx-auto mb-4"></div>
        <p className="text-white text-lg">Finding your perfect matches...</p>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl text-center">
        <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <p className="text-white text-lg">No matches found at this time.</p>
        <p className="text-gray-400 mt-2">Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-white mb-2">Your Top Matches</h2>
        <p className="text-gray-300">
          Select a buddy to continue ({matches.length} compatible matches found)
        </p>
      </div>

      <div className="space-y-4 max-h-96 overflow-y-auto pr-2">
        {matches.map((match, index) => (
          <motion.div
            key={match.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            onClick={() => onSelectBuddy(match)}
            className={`p-5 rounded-xl cursor-pointer transition-all ${
              selectedBuddy?.id === match.id
                ? 'bg-gradient-to-r from-purple-500/30 to-pink-500/30 border-2 border-purple-400'
                : 'bg-white/5 hover:bg-white/10 border-2 border-transparent'
            }`}
          >
            <div className="flex items-start gap-4">
              <div className="relative">
                {match.avatar ? (
                  <img
                    src={match.avatar}
                    alt={match.name}
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-xl">
                    {match.name.charAt(0)}
                  </div>
                )}
                <div className="absolute -bottom-1 -right-1 bg-purple-500 rounded-full px-2 py-0.5 text-xs font-bold text-white">
                  {match.compatibilityScore}
                </div>
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <div>
                    <h3 className="font-semibold text-white text-lg">{match.name}</h3>
                    <p className="text-gray-400 text-sm">
                      {match.title || 'Team Member'} {match.department && `· ${match.department}`}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-blue-400" />
                    <span className="text-xs text-gray-300">
                      +{match.compatibilityBreakdown.departmentMatch} dept
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-green-400" />
                    <span className="text-xs text-gray-300">
                      +{match.compatibilityBreakdown.timezoneMatch} timezone
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Heart className="w-4 h-4 text-pink-400" />
                    <span className="text-xs text-gray-300">
                      +{match.compatibilityBreakdown.interestMatch} interests
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-purple-400" />
                    <span className="text-xs text-gray-300">
                      +{match.compatibilityBreakdown.experienceMatch} experience
                    </span>
                  </div>
                </div>

                {match.interests.length > 0 && (
                  <div className="mt-3 flex flex-wrap gap-2">
                    {match.interests.slice(0, 3).map((interest) => (
                      <span
                        key={interest}
                        className="px-2 py-1 bg-purple-500/20 rounded-full text-xs text-purple-300"
                      >
                        {interest}
                      </span>
                    ))}
                    {match.interests.length > 3 && (
                      <span className="px-2 py-1 bg-gray-500/20 rounded-full text-xs text-gray-400">
                        +{match.interests.length - 3} more
                      </span>
                    )}
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Step 4: Confirm Selection
function Step4Confirm({ selectedBuddy }: { selectedBuddy: BuddyMatch | null }) {
  if (!selectedBuddy) {
    return (
      <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl text-center">
        <p className="text-white text-lg">Please select a buddy first.</p>
      </div>
    );
  }

  return (
    <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Confirm Your Buddy</h2>
        <p className="text-gray-300">Review your selection before confirming</p>
      </div>

      <div className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 rounded-xl p-8 border-2 border-purple-400">
        <div className="flex items-center gap-6 mb-6">
          {selectedBuddy.avatar ? (
            <img
              src={selectedBuddy.avatar}
              alt={selectedBuddy.name}
              className="w-24 h-24 rounded-full object-cover"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold text-3xl">
              {selectedBuddy.name.charAt(0)}
            </div>
          )}
          <div>
            <h3 className="text-2xl font-bold text-white">{selectedBuddy.name}</h3>
            <p className="text-gray-300">
              {selectedBuddy.title || 'Team Member'}
              {selectedBuddy.department && ` · ${selectedBuddy.department}`}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-yellow-400" />
              <span className="text-lg font-semibold text-white">
                {selectedBuddy.compatibilityScore} / 100 Compatibility
              </span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Building2 className="w-5 h-5 text-blue-400" />
              <span className="text-sm text-gray-300">Department</span>
            </div>
            <p className="font-semibold text-white">
              {selectedBuddy.department || 'Not specified'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              +{selectedBuddy.compatibilityBreakdown.departmentMatch} points
            </p>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Globe2 className="w-5 h-5 text-green-400" />
              <span className="text-sm text-gray-300">Timezone</span>
            </div>
            <p className="font-semibold text-white">
              {selectedBuddy.timezone || 'Not specified'}
            </p>
            <p className="text-xs text-gray-400 mt-1">
              +{selectedBuddy.compatibilityBreakdown.timezoneMatch} points
            </p>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Heart className="w-5 h-5 text-pink-400" />
              <span className="text-sm text-gray-300">Common Interests</span>
            </div>
            <p className="font-semibold text-white">
              {selectedBuddy.interests.length || 0} shared
            </p>
            <p className="text-xs text-gray-400 mt-1">
              +{selectedBuddy.compatibilityBreakdown.interestMatch} points
            </p>
          </div>

          <div className="bg-white/10 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp className="w-5 h-5 text-purple-400" />
              <span className="text-sm text-gray-300">Experience</span>
            </div>
            <p className="font-semibold text-white">Great match</p>
            <p className="text-xs text-gray-400 mt-1">
              +{selectedBuddy.compatibilityBreakdown.experienceMatch} points
            </p>
          </div>
        </div>

        {selectedBuddy.interests.length > 0 && (
          <div>
            <p className="text-sm text-gray-300 mb-2">Shared Interests:</p>
            <div className="flex flex-wrap gap-2">
              {selectedBuddy.interests.map((interest) => (
                <span
                  key={interest}
                  className="px-3 py-1 bg-purple-500/30 rounded-full text-sm text-purple-200"
                >
                  {interest}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="mt-6 p-4 bg-blue-500/20 border border-blue-500/50 rounded-lg">
        <p className="text-center text-blue-200">
          Once confirmed, you'll be connected with {selectedBuddy.name} to start your buddy journey!
        </p>
      </div>
    </div>
  );
}

// Step 5: Success
function Step5Success({
  selectedBuddy,
  onComplete,
}: {
  selectedBuddy: BuddyMatch | null;
  onComplete?: () => void;
}) {
  return (
    <motion.div
      initial={{ scale: 0.9 }}
      animate={{ scale: 1 }}
      className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 shadow-2xl"
    >
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring' }}
          className="inline-block p-6 bg-gradient-to-br from-green-500 to-emerald-500 rounded-full mb-6"
        >
          <CheckCircle2 className="w-16 h-16 text-white" />
        </motion.div>
        <h1 className="text-4xl font-bold text-white mb-4">
          Buddy Match Complete!
        </h1>
        <p className="text-xl text-gray-300 mb-8">
          You've been successfully matched with{' '}
          <span className="font-semibold text-white">{selectedBuddy?.name}</span>
        </p>

        <div className="bg-white/5 rounded-xl p-6 mb-6">
          <h3 className="font-semibold text-white mb-4 text-lg">Next Steps:</h3>
          <div className="space-y-3 text-left">
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">1</span>
              </div>
              <p className="text-gray-300">
                Reach out to {selectedBuddy?.name} via email or your company chat
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">2</span>
              </div>
              <p className="text-gray-300">
                Schedule your first virtual coffee or team introduction
              </p>
            </div>
            <div className="flex items-start gap-3">
              <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                <span className="text-white text-sm font-bold">3</span>
              </div>
              <p className="text-gray-300">
                Ask questions, build connections, and learn from each other
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={onComplete}
          className="px-8 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition-all"
        >
          Return to Dashboard
        </button>
      </div>
    </motion.div>
  );
}
