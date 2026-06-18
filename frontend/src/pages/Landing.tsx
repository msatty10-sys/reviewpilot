import { Link } from 'react-router-dom';
import { Star, MessageSquare, Send, BarChart3, Shield, Zap, CheckCircle, ArrowRight, Menu, X } from 'lucide-react';
import { useState } from 'react';

export default function Landing() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 items-center">
            <div className="flex items-center gap-2">
              <Star className="h-6 w-6 text-blue-600 fill-blue-600" />
              <span className="text-xl font-bold text-gray-900">ReviewPilot</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#how-it-works" className="text-sm text-gray-600 hover:text-gray-900">How It Works</a>
              <a href="#pricing" className="text-sm text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#features" className="text-sm text-gray-600 hover:text-gray-900">Features</a>
              <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-700">Sign In</Link>
              <Link to="/register" className="text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                Get Started Free
              </Link>
            </div>
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
        {mobileMenuOpen && (
          <div className="md:hidden border-t border-gray-100 px-4 py-4 space-y-3">
            <a href="#how-it-works" className="block text-sm text-gray-600">How It Works</a>
            <a href="#pricing" className="block text-sm text-gray-600">Pricing</a>
            <a href="#features" className="block text-sm text-gray-600">Features</a>
            <Link to="/login" className="block text-sm font-medium text-blue-600">Sign In</Link>
            <Link to="/register" className="block text-sm font-medium bg-blue-600 text-white px-4 py-2 rounded-lg text-center">
              Get Started Free
            </Link>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <div className="inline-flex items-center gap-2 bg-blue-50 text-blue-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Zap className="h-4 w-4" />
              #1 Review Automation for Local Service Businesses
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight mb-6">
              Get More <span className="text-blue-600">Google Reviews</span> Automatically
            </h1>
            <p className="text-lg md:text-xl text-gray-600 mb-8 leading-relaxed">
              ReviewPilot automates sending review requests to your customers. 
              More reviews = higher local SEO rankings = more customers. Set it up once, watch reviews roll in.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Link to="/register" className="inline-flex items-center justify-center bg-blue-600 text-white px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200">
                Start Your Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
              <a href="#how-it-works" className="inline-flex items-center justify-center border-2 border-gray-200 text-gray-700 px-8 py-3 rounded-xl text-lg font-semibold hover:border-gray-300 transition-colors">
                See How It Works
              </a>
            </div>
            <div className="flex items-center gap-4 mt-8 text-sm text-gray-500">
              <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> No credit card</span>
              <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> 14-day free trial</span>
              <span className="flex items-center gap-1"><CheckCircle className="h-4 w-4 text-green-500" /> Cancel anytime</span>
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-8 shadow-lg border border-blue-100">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-semibold text-gray-900">Your Dashboard</h3>
                <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full font-medium">Live</span>
              </div>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Reviews Sent</p>
                  <p className="text-2xl font-bold text-blue-600">156</p>
                </div>
                <div className="bg-green-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Received</p>
                  <p className="text-2xl font-bold text-green-600">42</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Conversion</p>
                  <p className="text-2xl font-bold text-purple-600">26.9%</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3">
                  <p className="text-xs text-gray-500">Rating</p>
                  <p className="text-2xl font-bold text-yellow-600">4.8⭐</p>
                </div>
              </div>
              <div className="h-20 bg-gray-50 rounded-lg flex items-end gap-1 px-2">
                {[30, 45, 25, 60, 40, 55, 70].map((h, i) => (
                  <div key={i} className="flex-1 bg-blue-200 rounded-t" style={{ height: `${h}%` }}></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Three simple steps to start getting more reviews automatically.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { step: '1', icon: Send, title: 'Add Your Customers', desc: 'Import your customer list or add them one by one. Names, emails, and phone numbers — that\'s all you need.' },
              { step: '2', icon: MessageSquare, title: 'We Send Review Requests', desc: 'ReviewPilot automatically texts or emails each customer with a personalized review link. Follow-ups happen automatically.' },
              { step: '3', icon: Star, title: 'Watch Reviews Roll In', desc: 'Customers click and leave reviews on Google or Facebook. Your dashboard shows every review, trend, and conversion rate.' },
            ].map((item) => (
              <div key={item.step} className="bg-white rounded-xl p-8 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <item.icon className="h-6 w-6 text-blue-600" />
                </div>
                <div className="text-sm font-bold text-blue-600 mb-2">Step {item.step}</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Everything You Need</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Powerful features designed for local service businesses.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: Send, title: 'Automated Requests', desc: 'Set it and forget it. ReviewPilot automatically sends review requests after each job.' },
              { icon: BarChart3, title: 'Real-Time Analytics', desc: 'Track conversion rates, trends, and average ratings. Know exactly how you\'re doing.' },
              { icon: Shield, title: 'Smart Follow-ups', desc: 'Customers who don\'t respond get a friendly reminder. Never miss a review opportunity.' },
              { icon: MessageSquare, title: 'SMS & Email', desc: 'Reach customers how they prefer. Customize templates with your brand voice.' },
              { icon: Star, title: 'Google & Facebook', desc: 'Direct customers to leave reviews on the platforms that matter most for your SEO.' },
              { icon: Zap, title: 'Multi-Location', desc: 'Manage reviews across multiple business locations from one dashboard.' },
            ].map((feature, i) => (
              <div key={i} className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center mb-3">
                  <feature.icon className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-semibold text-gray-900 mb-1">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="bg-gray-50 py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Simple, Transparent Pricing</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">Start small, scale up as you grow. No hidden fees, cancel anytime.</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { name: 'Starter', price: '$29', requests: '50', features: ['Basic dashboard', 'SMS & email templates', 'Review link generator', 'Email support'], popular: false },
              { name: 'Growth', price: '$79', requests: '200', features: ['Everything in Starter', 'Review response tools', 'Analytics & trends', 'Multi-location support', 'Priority support'], popular: true },
              { name: 'Pro', price: '$149', requests: 'Unlimited', features: ['Everything in Growth', 'Team access (5 users)', 'White-label options', 'API access', 'Dedicated account manager'], popular: false },
            ].map((plan) => (
              <div key={plan.name} className={`bg-white rounded-xl shadow-sm border ${plan.popular ? 'border-blue-200 ring-2 ring-blue-500' : 'border-gray-100'} p-8 ${plan.popular ? 'relative' : ''}`}>
                {plan.popular && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-blue-600 text-white text-xs font-bold px-4 py-1 rounded-full">
                    Most Popular
                  </div>
                )}
                <h3 className="text-lg font-semibold text-gray-900 mb-1">{plan.name}</h3>
                <div className="mb-4">
                  <span className="text-3xl font-bold text-gray-900">{plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <p className="text-sm text-gray-500 mb-6">Up to {plan.requests} review requests/month</p>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-center gap-2 text-sm text-gray-700">
                      <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <Link to="/register" className={`block text-center py-3 rounded-xl font-semibold transition-colors ${plan.popular ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-lg shadow-blue-200' : 'border-2 border-gray-200 text-gray-700 hover:border-gray-300'}`}>
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-blue-600 py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Ready to Get More Reviews?</h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">Join local service businesses using ReviewPilot to grow their reputation and attract more customers.</p>
          <Link to="/register" className="inline-flex items-center bg-white text-blue-600 px-8 py-3 rounded-xl text-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg">
            Start Your Free Trial
            <ArrowRight className="ml-2 h-5 w-5" />
          </Link>
          <p className="text-blue-200 text-sm mt-4">14-day free trial. No credit card required. Cancel anytime.</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 mb-6">
            <Star className="h-5 w-5 text-blue-500 fill-blue-500" />
            <span className="text-lg font-bold text-white">ReviewPilot</span>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h4 className="text-white font-medium mb-3">Product</h4>
              <div className="space-y-2 text-sm">
                <a href="#how-it-works" className="block hover:text-white">How It Works</a>
                <a href="#features" className="block hover:text-white">Features</a>
                <a href="#pricing" className="block hover:text-white">Pricing</a>
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Company</h4>
              <div className="space-y-2 text-sm">
                <span className="block">About</span>
                <span className="block">Blog</span>
                <span className="block">Contact</span>
              </div>
            </div>
            <div>
              <h4 className="text-white font-medium mb-3">Support</h4>
              <div className="space-y-2 text-sm">
                <span className="block">Help Center</span>
                <span className="block">Documentation</span>
                <span className="block">API Reference</span>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-sm flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; 2024 ReviewPilot. All rights reserved.</p>
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Service</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}