import React from 'react';

const PostBookingArtistSelection = ({ onNext, onBack, getValues, setValue }) => {
  return (
    <div className="max-w-sm md:max-w-4xl mx-auto p-4 md:p-8 glass-card">
      <h2 className="text-2xl font-bold text-gray-900 mb-8 text-left">
        Select Your Artist
      </h2>

      <p className="text-gray-600 mb-6">
        Choose your preferred makeup artist for your special day. All our artists are professionally trained and experienced.
      </p>
 
      <div className="grid md:grid-cols-2 gap-6 mb-8">
        {/* Artist 1 */}
        <div className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
          getValues('selected_artist') === 'anum'
            ? 'border-pink-500 bg-pink-50'
            : 'border-gray-200 hover:border-pink-300'
        }`} onClick={() => setValue('selected_artist', 'anum')}>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-pink-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-pink-600 font-bold text-xl">A</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Anum Khan</h3>
              <p className="text-sm text-gray-600">Lead Artist & Owner</p>
            </div>
          </div>
          <p className="text-gray-700 mb-3">
            With over 8 years of experience in bridal makeup and hair styling, Anum specializes in natural, flawless looks that enhance your beauty.
          </p>
          <div className="text-sm text-gray-600">
            <strong>Specialties:</strong> Bridal makeup, airbrush techniques, hair styling, false lashes
          </div>
        </div>

        {/* Artist 2 */}
        <div className={`border-2 rounded-lg p-6 cursor-pointer transition-all duration-200 ${
          getValues('selected_artist') === 'Team'
            ? 'border-pink-500 bg-pink-50'
            : 'border-gray-200 hover:border-pink-300'
        }`} onClick={() => setValue('selected_artist', 'Team')}>
          <div className="flex items-center mb-4">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mr-4">
              <span className="text-purple-600 font-bold text-xl">T</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-gray-900">Team Artist</h3>
              <p className="text-sm text-gray-600">Professional Makeup Artist</p>
            </div>
          </div>
          <p className="text-gray-700 mb-3">
            Our skilled team artists bring creativity and precision to every look, ensuring you look and feel amazing on your special day.
          </p>
          <div className="text-sm text-gray-600">
            <strong>Specialties:</strong> Contemporary makeup, special effects, bridal hair, team coordination
          </div>
        </div>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg mb-6 border border-yellow-200">
        <p className="text-sm text-yellow-800">
          <strong>Note:</strong> Artist availability will be confirmed during the booking process. If your preferred artist is unavailable for your date, we'll work with you to find the best alternative.
        </p>
      </div>

      <div className="flex justify-between">
        <button
          type="button"
          onClick={onBack}
          className="px-8 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors duration-200"
        >
          ← Back to Quote
        </button>
        <button
          type="button"
          onClick={onNext}
          disabled={!getValues('selected_artist')}
          className={`px-8 py-3 rounded-lg font-semibold transition-all duration-200 cursor-pointer ${
            getValues('selected_artist')
              ? 'bg-purple-600 text-white hover:bg-purple-700 focus:ring-4 focus:ring-purple-200'
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue to Date Selection →
        </button>
      </div>
    </div>
  );
};

export default PostBookingArtistSelection;