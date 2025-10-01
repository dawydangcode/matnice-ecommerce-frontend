import React, { useState } from 'react';
import { Camera, Upload, User, Palette, Sparkles, Brain, Eye, Zap } from 'lucide-react';
import Header from '../components/Header';
import Navigation from '../components/Navigation';
import Footer from '../components/Footer';
import AIFaceAnalysisModal from '../components/AIFaceAnalysisModal';

const AIAnalysisPage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const features = [
    {
      icon: User,
      title: "Gender Detection",
      description: "Advanced AI algorithms analyze facial features to determine gender with high accuracy",
      color: "text-blue-600"
    },
    {
      icon: Palette,
      title: "Skin Tone Analysis",
      description: "Precise skin color classification using computer vision technology",
      color: "text-purple-600"
    },
    {
      icon: Eye,
      title: "Real-time Processing",
      description: "Instant analysis with results delivered within seconds",
      color: "text-green-600"
    },
    {
      icon: Zap,
      title: "High Accuracy",
      description: "State-of-the-art machine learning models ensure reliable results",
      color: "text-orange-600"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Header />
      <Navigation />

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <Brain className="h-12 w-12 text-blue-600 mr-4" />
            <h1 className="text-4xl font-bold text-gray-900">AI Face Analysis</h1>
          </div>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Our advanced AI technology analyzes your facial features to provide personalized recommendations
            for glasses and sunglasses that complement your unique style.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 inline-flex items-center"
          >
            <Sparkles className="mr-3 h-6 w-6" />
            Start AI Analysis
          </button>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          {features.map((feature, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow duration-300"
            >
              <div className={`inline-flex items-center justify-center w-12 h-12 rounded-lg bg-gray-50 ${feature.color} mb-4`}>
                <feature.icon className="h-6 w-6" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
              <p className="text-gray-600 text-sm">{feature.description}</p>
            </div>
          ))}
        </div>

        {/* How It Works */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16">
          <h3 className="text-2xl font-bold text-gray-900 text-center mb-8">How It Works</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-blue-100 text-blue-600 mb-4">
                <Camera className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">1. Capture or Upload</h4>
              <p className="text-gray-600">Take a photo using your camera or upload an existing image</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-purple-100 text-purple-600 mb-4">
                <Brain className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">2. AI Analysis</h4>
              <p className="text-gray-600">Our AI analyzes your facial features and skin tone</p>
            </div>
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 text-green-600 mb-4">
                <Sparkles className="h-8 w-8" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2">3. Get Results</h4>
              <p className="text-gray-600">Receive personalized recommendations instantly</p>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-12 text-white">
          <h3 className="text-3xl font-bold mb-4">Ready to Find Your Perfect Match?</h3>
          <p className="text-xl mb-8 opacity-90">
            Join thousands of satisfied customers who found their ideal eyewear with our AI technology
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-white text-blue-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-gray-100 transition-colors duration-300 shadow-lg inline-flex items-center"
          >
            <Upload className="mr-3 h-6 w-6" />
            Try AI Analysis Now
          </button>
        </div>
      </div>

      {/* AI Analysis Modal */}
      <AIFaceAnalysisModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="AI Face Analysis"
      />

      <Footer />
    </div>
  );
};

export default AIAnalysisPage;
