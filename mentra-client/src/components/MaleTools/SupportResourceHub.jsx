import { useState } from 'react';
import { FaPhone, FaGlobe, FaMapMarkerAlt, FaBook, FaUsers, FaDollarSign, FaHandsHelping, FaGraduationCap } from 'react-icons/fa';

const SupportResourceHub = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', label: 'All Resources', icon: FaBook },
    { id: 'financial', label: 'Financial Assistance', icon: FaDollarSign },
    { id: 'counseling', label: 'Counseling Services', icon: FaUsers },
    { id: 'employment', label: 'Employment Help', icon: FaGraduationCap },
    { id: 'community', label: 'Community Support', icon: FaHandsHelping },
  ];

  const resources = [
    // Financial Assistance
    {
      category: 'financial',
      name: '211 - Community Resources',
      description: 'Free 24/7 information and referral service connecting people to local resources including financial assistance, food banks, and utility help.',
      contact: '2-1-1 or 877-644-6407',
      website: '211.org',
      type: 'phone',
      available: '24/7'
    },
    {
      category: 'financial',
      name: 'National Foundation for Credit Counseling',
      description: 'Non-profit financial counseling, debt management plans, and budget coaching.',
      contact: '800-388-2227',
      website: 'nfcc.org',
      type: 'phone',
      available: 'Business Hours'
    },
    {
      category: 'financial',
      name: 'Feeding America',
      description: 'Nationwide network of food banks providing food assistance to those in need.',
      contact: 'N/A',
      website: 'feedingamerica.org',
      type: 'web',
      available: 'Varies by location'
    },
    {
      category: 'financial',
      name: 'Modest Needs Foundation',
      description: 'Provides short-term financial assistance to individuals in temporary crisis.',
      contact: 'N/A',
      website: 'modestneeds.org',
      type: 'web',
      available: 'Online Application'
    },

    // Counseling Services
    {
      category: 'counseling',
      name: 'National Alliance on Mental Illness (NAMI)',
      description: 'Free mental health support, education, and local resources. HelpLine available for guidance.',
      contact: '800-950-NAMI (6264)',
      website: 'nami.org',
      type: 'phone',
      available: 'Mon-Fri 10am-10pm ET'
    },
    {
      category: 'counseling',
      name: 'SAMHSA National Helpline',
      description: 'Free, confidential, 24/7 treatment referral and information service for mental health and substance use disorders.',
      contact: '800-662-4357',
      website: 'samhsa.gov',
      type: 'phone',
      available: '24/7'
    },
    {
      category: 'counseling',
      name: 'BetterHelp Financial Aid',
      description: 'Online therapy with financial aid options for those who qualify.',
      contact: 'N/A',
      website: 'betterhelp.com/financial-aid',
      type: 'web',
      available: 'Online'
    },
    {
      category: 'counseling',
      name: 'Open Path Collective',
      description: 'Nationwide network of therapists offering sessions for $30-$80 (one-time $65 membership fee).',
      contact: 'N/A',
      website: 'openpathcollective.org',
      type: 'web',
      available: 'Online'
    },

    // Employment Help
    {
      category: 'employment',
      name: 'CareerOneStop',
      description: 'U.S. Department of Labor resource for job search, training, and career exploration.',
      contact: '877-872-5627',
      website: 'careeronestop.org',
      type: 'phone',
      available: 'Business Hours'
    },
    {
      category: 'employment',
      name: 'Local Workforce Development Board',
      description: 'Free job training, resume help, and employment services in your area.',
      contact: 'Find local office',
      website: 'careeronestop.org/LocalHelp',
      type: 'web',
      available: 'Varies by location'
    },
    {
      category: 'employment',
      name: 'Goodwill Career Centers',
      description: 'Free job training, resume building, and career counseling services.',
      contact: 'Find local center',
      website: 'goodwill.org',
      type: 'web',
      available: 'Varies by location'
    },

    // Community Support
    {
      category: 'community',
      name: 'United Way',
      description: 'Connects people to local resources including financial assistance, food, housing, and healthcare.',
      contact: '2-1-1',
      website: 'unitedway.org',
      type: 'phone',
      available: '24/7'
    },
    {
      category: 'community',
      name: 'The Salvation Army',
      description: 'Emergency financial assistance, food, shelter, and utility help.',
      contact: 'Find local office',
      website: 'salvationarmyusa.org',
      type: 'web',
      available: 'Varies by location'
    },
    {
      category: 'community',
      name: "Men's Support Groups (MenLiving)",
      description: 'Peer-led support groups for men across the country dealing with life transitions and stress.',
      contact: 'N/A',
      website: 'menliving.org',
      type: 'web',
      available: 'Check schedule'
    },
  ];

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(r => r.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Info Banner */}
      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
        <p className="text-sm text-gray-700">
          <strong>You don't have to handle this alone.</strong> These vetted resources provide free or low-cost support
          for financial stress, mental health, employment, and more. All services are confidential.
        </p>
      </div>

      {/* Category Filter */}
      <div className="bg-white p-4 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-3">Filter by Category</h4>
        <div className="flex flex-wrap gap-2">
          {categories.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setSelectedCategory(id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                selectedCategory === id
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <Icon />
              {label}
            </button>
          ))}
        </div>
      </div>

      {/* Resources List */}
      <div className="space-y-4">
        <h4 className="font-semibold text-gray-900">
          {selectedCategory === 'all' ? 'All Resources' : categories.find(c => c.id === selectedCategory)?.label}
          <span className="text-sm font-normal text-gray-600 ml-2">({filteredResources.length} resources)</span>
        </h4>

        {filteredResources.map((resource, index) => {
          const CategoryIcon = categories.find(c => c.id === resource.category)?.icon || FaBook;
          
          return (
            <div key={index} className="bg-white p-6 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
              <div className="flex items-start gap-4">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <CategoryIcon className="text-2xl text-blue-600" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h5 className="font-semibold text-gray-900 text-lg">{resource.name}</h5>
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                      {resource.available}
                    </span>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{resource.description}</p>
                  
                  <div className="space-y-2">
                    {resource.contact !== 'N/A' && (
                      <div className="flex items-center gap-2 text-sm">
                        <FaPhone className="text-blue-600" />
                        <span className="font-medium text-gray-900">Contact:</span>
                        <a href={`tel:${resource.contact.replace(/[^0-9]/g, '')}`} className="text-blue-600 hover:underline">
                          {resource.contact}
                        </a>
                      </div>
                    )}
                    
                    {resource.website && (
                      <div className="flex items-center gap-2 text-sm">
                        <FaGlobe className="text-blue-600" />
                        <span className="font-medium text-gray-900">Website:</span>
                        <a 
                          href={`https://${resource.website}`} 
                          target="_blank" 
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline"
                        >
                          {resource.website}
                        </a>
                      </div>
                    )}
                  </div>

                  {resource.contact !== 'N/A' && resource.contact !== 'Find local office' && resource.contact !== 'Find local center' && (
                    <a
                      href={`tel:${resource.contact.replace(/[^0-9]/g, '')}`}
                      className="inline-block mt-3 px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Call Now
                    </a>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Emergency Resources */}
      <div className="bg-red-50 p-6 rounded-lg border-2 border-red-200">
        <h4 className="font-bold text-red-900 mb-3 flex items-center gap-2">
          <FaPhone className="text-xl" />
          Crisis Resources
        </h4>
        <div className="space-y-2 text-sm">
          <div>
            <span className="font-semibold text-red-900">Suicide & Crisis Lifeline:</span>{' '}
            <a href="tel:988" className="text-red-700 hover:underline font-bold">988</a> (24/7)
          </div>
          <div>
            <span className="font-semibold text-red-900">Crisis Text Line:</span>{' '}
            <span className="text-red-700 font-bold">Text HOME to 741741</span> (24/7)
          </div>
          <div>
            <span className="font-semibold text-red-900">Veterans Crisis Line:</span>{' '}
            <a href="tel:988" className="text-red-700 hover:underline font-bold">988, then press 1</a> (24/7)
          </div>
        </div>
      </div>
    </div>
  );
};

export default SupportResourceHub;
