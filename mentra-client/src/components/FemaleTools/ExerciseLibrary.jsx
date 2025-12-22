import { useState } from 'react';
import { FaDumbbell, FaBook, FaHeart, FaBrain, FaSpa } from 'react-icons/fa';

const ExerciseLibrary = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const categories = [
    { id: 'all', name: 'All Exercises', icon: FaDumbbell, color: 'gray' },
    { id: 'relaxation', name: 'Relaxation', icon: FaSpa, color: 'blue' },
    { id: 'grounding', name: 'Grounding', icon: FaBrain, color: 'purple' },
    { id: 'journaling', name: 'Journaling', icon: FaBook, color: 'pink' },
    { id: 'physical', name: 'Physical', icon: FaDumbbell, color: 'green' },
    { id: 'mindfulness', name: 'Mindfulness', icon: FaHeart, color: 'teal' }
  ];

  const exercises = [
    {
      category: 'relaxation',
      title: 'Progressive Muscle Relaxation',
      duration: '10-15 min',
      difficulty: 'Easy',
      description: 'Systematically tense and relax different muscle groups to release physical tension.',
      steps: [
        'Find a comfortable seated or lying position',
        'Start with your toes - curl them tightly for 5 seconds',
        'Release and notice the difference for 10 seconds',
        'Move up to your calves, thighs, abdomen, arms, shoulders, neck, and face',
        'Tense each muscle group for 5 seconds, then relax for 10 seconds',
        'End by taking three deep breaths'
      ],
      benefits: ['Reduces physical tension', 'Improves body awareness', 'Promotes sleep']
    },
    {
      category: 'grounding',
      title: '5-4-3-2-1 Grounding',
      duration: '5 min',
      difficulty: 'Easy',
      description: 'Use your five senses to anchor yourself in the present moment.',
      steps: [
        'Name 5 things you can SEE around you',
        'Name 4 things you can TOUCH',
        'Name 3 things you can HEAR',
        'Name 2 things you can SMELL',
        'Name 1 thing you can TASTE'
      ],
      benefits: ['Stops panic attacks', 'Reduces anxiety', 'Brings you to present']
    },
    {
      category: 'journaling',
      title: 'Gratitude Journaling',
      duration: '5-10 min',
      difficulty: 'Easy',
      description: 'Write down things you\'re grateful for to shift focus to positive aspects of life.',
      prompts: [
        'What made you smile today?',
        'Who are you thankful for and why?',
        'What\'s one thing that went well this week?',
        'What\'s a simple pleasure you enjoyed recently?',
        'What\'s something about yourself you appreciate?',
        'What\'s a challenge that helped you grow?'
      ],
      benefits: ['Improves mood', 'Increases positivity', 'Enhances well-being']
    },
    {
      category: 'journaling',
      title: 'Emotional Release Writing',
      duration: '15-20 min',
      difficulty: 'Medium',
      description: 'Free-write about your feelings without judgment to process emotions.',
      steps: [
        'Set a timer for 15-20 minutes',
        'Write continuously without stopping to edit or judge',
        'Write whatever comes to mind - feelings, thoughts, worries',
        'Don\'t worry about grammar or making sense',
        'When time\'s up, you can keep or discard what you wrote',
        'Take a few deep breaths and notice how you feel'
      ],
      benefits: ['Processes emotions', 'Reduces stress', 'Increases clarity']
    },
    {
      category: 'physical',
      title: 'Gentle Stretching Routine',
      duration: '10 min',
      difficulty: 'Easy',
      description: 'Simple stretches to release tension and improve mood through movement.',
      steps: [
        'Neck rolls - slowly roll your head in circles',
        'Shoulder shrugs - raise shoulders to ears, then drop',
        'Arm circles - extend arms and make large circles',
        'Side stretches - reach one arm overhead and lean to the side',
        'Seated twist - sit and gently twist your torso',
        'Forward fold - sit or stand and reach toward your toes',
        'Hold each stretch for 20-30 seconds, breathe deeply'
      ],
      benefits: ['Releases physical tension', 'Boosts energy', 'Improves mood']
    },
    {
      category: 'physical',
      title: 'Walking Meditation',
      duration: '10-20 min',
      difficulty: 'Easy',
      description: 'Mindful walking that combines gentle exercise with meditation.',
      steps: [
        'Find a quiet place to walk (indoors or outdoors)',
        'Walk at a natural, comfortable pace',
        'Pay attention to the sensation of each step',
        'Notice your feet touching the ground',
        'Feel your legs moving, your arms swinging',
        'If your mind wanders, gently return focus to walking',
        'Observe your surroundings without judgment'
      ],
      benefits: ['Combines exercise and mindfulness', 'Reduces rumination', 'Calms the mind']
    },
    {
      category: 'mindfulness',
      title: 'Body Scan Meditation',
      duration: '15-20 min',
      difficulty: 'Medium',
      description: 'Systematically focus attention on different parts of your body.',
      steps: [
        'Lie down or sit comfortably',
        'Close your eyes and take three deep breaths',
        'Bring attention to your toes',
        'Notice any sensations without trying to change them',
        'Slowly move attention up through feet, legs, torso, arms, neck, head',
        'Spend 1-2 minutes on each body part',
        'If you notice tension, imagine breathing into that area'
      ],
      benefits: ['Increases body awareness', 'Promotes relaxation', 'Improves sleep']
    },
    {
      category: 'mindfulness',
      title: 'Mindful Breathing',
      duration: '5-10 min',
      difficulty: 'Easy',
      description: 'Simple meditation focusing only on the breath.',
      steps: [
        'Find a comfortable seated position',
        'Close your eyes or lower your gaze',
        'Breathe naturally - don\'t force the breath',
        'Focus on the sensation of breathing',
        'Notice air entering and leaving your nose or mouth',
        'When your mind wanders, gently return to the breath',
        'Continue for 5-10 minutes'
      ],
      benefits: ['Calms the mind', 'Reduces stress', 'Improves focus']
    },
    {
      category: 'relaxation',
      title: 'Guided Imagery',
      duration: '10-15 min',
      difficulty: 'Easy',
      description: 'Use visualization to create a calming mental escape.',
      steps: [
        'Close your eyes and take three deep breaths',
        'Imagine a peaceful place (beach, forest, mountain, etc.)',
        'Visualize it in detail - colors, sounds, smells, temperature',
        'See yourself there, feeling calm and safe',
        'Spend time exploring this peaceful place in your mind',
        'Notice how your body feels more relaxed',
        'When ready, slowly return to the present'
      ],
      benefits: ['Creates mental calm', 'Reduces anxiety', 'Provides mental break']
    },
    {
      category: 'grounding',
      title: 'Ice Cube Grounding',
      duration: '2-5 min',
      difficulty: 'Easy',
      description: 'Use cold sensation to interrupt overwhelming emotions and ground yourself.',
      steps: [
        'Hold an ice cube in your hand',
        'Focus all attention on the cold sensation',
        'Notice how it feels against your skin',
        'Move it between your hands',
        'Pay attention to the melting, the water dripping',
        'Observe how the intense feeling fades',
        'Take deep breaths as you focus on the sensation'
      ],
      benefits: ['Interrupts panic', 'Provides immediate grounding', 'Quick and effective']
    },
    {
      category: 'journaling',
      title: 'Self-Compassion Letter',
      duration: '15-20 min',
      difficulty: 'Medium',
      description: 'Write yourself a letter as if you were writing to a dear friend.',
      steps: [
        'Think about something you\'re struggling with',
        'Imagine what a loving friend would say to you',
        'Write a letter to yourself with that same kindness',
        'Acknowledge your pain and difficulties',
        'Remind yourself that struggle is part of being human',
        'Offer yourself words of comfort and encouragement',
        'Read the letter when you need self-compassion'
      ],
      benefits: ['Builds self-compassion', 'Reduces self-criticism', 'Promotes healing']
    },
    {
      category: 'relaxation',
      title: 'Aromatherapy Breathing',
      duration: '5-10 min',
      difficulty: 'Easy',
      description: 'Combine calming scents with deep breathing for enhanced relaxation.',
      steps: [
        'Choose a calming scent (lavender, chamomile, eucalyptus)',
        'Find a comfortable seated position',
        'Hold the scent near your nose',
        'Breathe in deeply through your nose for 4 counts',
        'Hold for 4 counts',
        'Exhale slowly for 6 counts',
        'Repeat for 5-10 minutes, focusing on the scent and breath'
      ],
      benefits: ['Multi-sensory relaxation', 'Calms nervous system', 'Improves mood']
    }
  ];

  const filteredExercises = selectedCategory === 'all' 
    ? exercises 
    : exercises.filter(ex => ex.category === selectedCategory);

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'green';
      case 'Medium': return 'yellow';
      case 'Hard': return 'orange';
      default: return 'gray';
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-teal-600 to-blue-600 rounded-2xl p-8 text-white mb-8 shadow-xl">
        <div className="flex items-center gap-3 mb-3">
          <FaDumbbell className="text-4xl" />
          <h1 className="text-3xl font-bold">Exercise Library</h1>
        </div>
        <p className="text-teal-100 text-lg">
          Quick relaxation exercises, journaling prompts, and grounding techniques
        </p>
      </div>

      {/* Category Filter */}
      <div className="flex flex-wrap gap-3 mb-8">
        {categories.map(cat => {
          const Icon = cat.icon;
          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all ${
                selectedCategory === cat.id
                  ? `bg-${cat.color}-600 text-white shadow-lg`
                  : 'bg-white text-gray-700 hover:bg-gray-100 shadow'
              }`}
            >
              <Icon />
              {cat.name}
              <span className={`${selectedCategory === cat.id ? 'bg-white text-gray-800' : 'bg-gray-200 text-gray-600'} px-2 py-0.5 rounded-full text-xs`}>
                {cat.id === 'all' ? exercises.length : exercises.filter(ex => ex.category === cat.id).length}
              </span>
            </button>
          );
        })}
      </div>

      {/* Exercises Grid */}
      <div className="grid md:grid-cols-2 gap-6">
        {filteredExercises.map((exercise, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all">
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-xl font-bold text-gray-800">{exercise.title}</h3>
              <div className="flex flex-col gap-2 items-end">
                <span className={`bg-${getDifficultyColor(exercise.difficulty)}-100 text-${getDifficultyColor(exercise.difficulty)}-700 px-3 py-1 rounded-full text-xs font-semibold`}>
                  {exercise.difficulty}
                </span>
                <span className="text-sm text-gray-600">⏱️ {exercise.duration}</span>
              </div>
            </div>

            <p className="text-gray-600 mb-4">{exercise.description}</p>

            {exercise.steps && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Steps:</h4>
                <ol className="space-y-2">
                  {exercise.steps.map((step, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="bg-teal-500 text-white w-6 h-6 rounded-full flex items-center justify-center font-bold flex-shrink-0 text-xs">
                        {i + 1}
                      </span>
                      <span className="pt-0.5">{step}</span>
                    </li>
                  ))}
                </ol>
              </div>
            )}

            {exercise.prompts && (
              <div className="mb-4">
                <h4 className="font-semibold text-gray-800 mb-2">Prompts:</h4>
                <ul className="space-y-1">
                  {exercise.prompts.map((prompt, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm text-gray-700">
                      <span className="text-pink-600">•</span>
                      <span>{prompt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2 text-sm">Benefits:</h4>
              <div className="flex flex-wrap gap-2">
                {exercise.benefits.map((benefit, i) => (
                  <span key={i} className="bg-white px-3 py-1 rounded-full text-xs text-gray-700">
                    ✓ {benefit}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {filteredExercises.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No exercises in this category yet.</p>
        </div>
      )}

      {/* Tips Section */}
      <div className="mt-12 bg-gradient-to-r from-blue-50 to-purple-50 border-2 border-blue-200 rounded-xl p-6">
        <h3 className="font-bold text-blue-800 text-lg mb-4">💡 Tips for Success</h3>
        <div className="grid md:grid-cols-2 gap-4 text-sm">
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">✅ Do:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Start with easy exercises</li>
              <li>• Practice regularly, even for short periods</li>
              <li>• Be patient with yourself</li>
              <li>• Try different exercises to find what works</li>
              <li>• Create a calm environment</li>
            </ul>
          </div>
          <div className="bg-white p-4 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">❌ Don't:</h4>
            <ul className="space-y-1 text-gray-700">
              <li>• Force yourself if something doesn't feel right</li>
              <li>• Expect immediate results</li>
              <li>• Judge yourself for "doing it wrong"</li>
              <li>• Skip exercises because they seem too simple</li>
              <li>• Give up after one try</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExerciseLibrary;
