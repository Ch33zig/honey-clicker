import { useState, useEffect } from 'react';

function App() {
  const [honey, setHoney] = useState(0);
  const [bees, setBees] = useState(0);
  const [flowers, setFlowers] = useState({
    forgetMeNot: 0,
    marigold: 0,
    daisy: 0,
    dandelion: 0,
    knapweed: 0,
    muskMallow: 0
  });

  const [unlockedFlowers, setUnlockedFlowers] = useState({
    forgetMeNot: true, // Initially, only Forget-me-not is unlocked
    marigold: false,
    daisy: false,
    dandelion: false,
    knapweed: false,
    muskMallow: false
  });

  const BEE_COST = 50; // Bee cost lowered a bit for accessibility, still a worthwhile investment
const FLOWER_COSTS = {
  forgetMeNot: 150, // Increased initial flower cost to make it harder
  marigold: 300,
  daisy: 600,
  dandelion: 1200,
  knapweed: 2400,
  muskMallow: 4800
};

const BEE_PRODUCTION = 1; // Bees now produce significantly more honey (value for money)
const FLOWER_PRODUCTION = {
  forgetMeNot: 3, // Lowered flower production to slow down progression
  marigold: 7,
  daisy: 14,
  dandelion: 30,
  knapweed: 48,
  muskMallow: 96
};

const [environmentLevel, setEnvironmentLevel] = useState(0);
const [environmentCost, setEnvironmentCost] = useState(1000); // Increased environment cost for each upgrade
const environmentNames = ['City', 'Town', 'Village', 'Farm', 'Forest', 'Garden'];
const environmentMultipliers = [1, 2, 4, 8, 16, 32]; // Same multipliers but with higher environment cost


  // Popup states
  const [showEasterEggPopup, setShowEasterEggPopup] = useState(false);
  const [showWinPopup, setShowWinPopup] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      const beeProduction = bees * BEE_PRODUCTION;
      const flowerProduction = Object.entries(flowers).reduce((total, [type, count]) => {
        return total + (count * FLOWER_PRODUCTION[type]);
      }, 0);
      const totalProduction = (beeProduction + flowerProduction) * environmentMultipliers[environmentLevel];
      setHoney(prev => prev + totalProduction);
    }, 1000);

    return () => clearInterval(interval);
  }, [bees, flowers, environmentLevel, FLOWER_PRODUCTION, environmentMultipliers]); // Added missing dependencies

  useEffect(() => {
    // Check if player reached 1 million honey
    if (honey >= 1000000) {
      setShowWinPopup(true);
    }
  }, [honey]);

  const handleClick = () => {
    setHoney(prev => prev + 1 * environmentMultipliers[environmentLevel]);
  };

  const [isPressed, setIsPressed] = useState(false);
  const handleMouseDown = () => setIsPressed(true);
  const handleMouseUp = () => setIsPressed(false);

  const buyBee = () => {
    if (honey >= BEE_COST) {
      setHoney(prev => prev - BEE_COST);
      setBees(prev => prev + 1);
    }
  };

  const buyFlower = (type) => {
    if (honey >= FLOWER_COSTS[type] && unlockedFlowers[type]) {
      setHoney(prev => prev - FLOWER_COSTS[type]);
      setFlowers(prev => ({
        ...prev,
        [type]: prev[type] + 1
      }));
    }
  };

  const unlockFlower = (type) => {
    if (honey >= FLOWER_COSTS[type] && !unlockedFlowers[type]) {
      setHoney(prev => prev - FLOWER_COSTS[type]);
      setUnlockedFlowers(prev => ({
        ...prev,
        [type]: true
      }));
    }
  };

  const upgradeEnvironment = () => {
    if (honey >= environmentCost && environmentLevel < environmentNames.length - 1) {
      setHoney(prev => prev - environmentCost);
      setEnvironmentLevel(prev => prev + 1);
      setEnvironmentCost(prev => prev * 2);
    }
  };

  // Easter egg for Terms & Conditions
  const handleTermsClick = () => {
    setHoney(prev => prev + 100000);
    setShowEasterEggPopup(true);
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-yellow-100">
      <div className="flex h-screen">
        <div className="w-1/2 p-8 flex justify-center items-center flex-col">
          <h1 className="text-4xl font-bold text-yellow-300 text-center mb-8">Honey Clicker</h1>
          <div className="text-center mb-24">
            <p className="text-2xl select-none">Honey: {honey}</p>
          </div>
          <div className="flex justify-center relative">
            <div
              onClick={handleClick}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              className="mb-8 justify-center flex rounded-full transition-transform duration-150 ease-in-out relative"
              style={{
                transform: isPressed ? "scale(0.8)" : "scale(1)",
              }}
            >
              <img
                src="/honey.png"
                className="h-32 w-auto select-none animate-spin"
                alt="Honey Jar"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                {Array.from({ length: bees }).map((_, index) => {
                  const angle = (360 / bees) * index;
                  return (
                    <img
                      key={index}
                      src="/bee.png"
                      alt={`Bee ${index}`}
                      className="absolute w-8 h-8 select-none transform animate-[rotateBees_10s_linear_infinite]"
                      style={{
                        transform: `rotate(${angle}deg) translateX(120px) rotate(-${angle}deg)`,
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>

        <div className="w-1/2 bg-neutral-800 p-8 overflow-y-auto">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-xl font-bold mb-4">Shop</h2>

            <div className="flex justify-between items-center mb-4 p-2 bg-neutral-700 rounded">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-neutral-600 flex items-center justify-center rounded mr-4">
                  <img src="/bee.png" className="w-1/2 h-auto object-cover rounded" alt="Bee" />
                </div>
                <div>
                  <h3 className="font-bold">Bee</h3>
                  <p className="text-sm text-neutral-400">Produces {BEE_PRODUCTION} honey/s</p>
                  <p>Owned: {bees}</p>
                </div>
              </div>
              <button
                onClick={buyBee}
                className={`px-4 py-2 rounded ${honey >= BEE_COST
                  ? 'bg-yellow-600 hover:bg-yellow-500'
                  : 'bg-neutral-600 cursor-not-allowed'}`}
              >
                Buy ({BEE_COST} honey)
              </button>
            </div>

            <div className="flex justify-between items-center mb-4 p-2 bg-neutral-700 rounded">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-neutral-600 flex items-center justify-center rounded mr-4">
                  <img src="/leaf.png" className="w-1/2 h-auto object-cover rounded" alt="Leaf Icon" />
                </div>
                <div>
                  <h3 className="font-bold">Environment</h3>
                  <p>Current Environment: {environmentNames[environmentLevel]}</p>
                  <p>Upgrade Cost: {environmentCost} honey</p>
                  <p>Effect: +{environmentMultipliers[environmentLevel]}</p>
                </div>
              </div>
              <button
  onClick={upgradeEnvironment}
  disabled={environmentLevel >= environmentNames.length - 1 || honey < environmentCost}
  className={`px-4 py-2 rounded ${environmentLevel >= environmentNames.length - 1 || honey < environmentCost
    ? 'bg-neutral-600 cursor-not-allowed'
    : 'bg-green-600 hover:bg-green-500'}`}
>
  Upgrade
</button>
            </div>

            <h3 className="font-bold mb-2">Flowers</h3>
            {[
  { type: 'forgetMeNot', name: 'Forget-me-not' },
  { type: 'marigold', name: 'Marigold' },
  { type: 'daisy', name: 'Daisy' },
  { type: 'dandelion', name: 'Dandelion' },
  { type: 'knapweed', name: 'Knapweed' },
  { type: 'muskMallow', name: 'Musk Mallow' }
].map(({ type, name }) => (
  <div key={type} className="flex justify-between items-center mb-4 p-2 bg-neutral-700 rounded">
    <div className="flex items-center">
      <div className="w-12 h-12 bg-neutral-600 flex items-center justify-center rounded mr-4">
        <img
          src={unlockedFlowers[type] ? `/${type}.png` : '/questionmark.png'}
          className="w-1/2 h-auto object-cover rounded"
          alt={unlockedFlowers[type] ? name : 'Locked'}
        />
      </div>
      <div>
        <h3 className="font-bold">
          {unlockedFlowers[type] ? name : '???'}
        </h3>
        <p className="text-sm text-neutral-400">
          {unlockedFlowers[type]
            ? `Produces ${FLOWER_PRODUCTION[type]} honey/s`
            : 'Item is locked'}
        </p>
        <p>Owned: {flowers[type]}</p>
      </div>
    </div>
    <div>
      <button
        onClick={() => buyFlower(type)}
        className={`px-4 py-2 rounded ${honey >= FLOWER_COSTS[type] && unlockedFlowers[type]
          ? 'bg-yellow-600 hover:bg-yellow-500'
          : 'bg-neutral-600 cursor-not-allowed'}`}
      >
        Buy ({FLOWER_COSTS[type]} honey)
      </button>
      {!unlockedFlowers[type] && (
        <button
          onClick={() => unlockFlower(type)}
          className={`ml-2 px-4 py-2 rounded ${honey >= FLOWER_COSTS[type]
            ? 'bg-blue-600 hover:bg-blue-500'
            : 'bg-neutral-600 cursor-not-allowed'}`}
        >
          Unlock
        </button>
      )}
    </div>
  </div>
))}

          </div>
        </div>
      </div>

      {/* Easter Egg Popup */}
      {showEasterEggPopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-lg text-center text-black">
            <h2 className="font-bold text-2xl">Easter Egg Activated!</h2>
            <p>You got 100,000 honey!</p>
            <button onClick={() => setShowEasterEggPopup(false)} className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded">Close</button>
          </div>
        </div>
      )}

      {/* Win Popup */}
      {showWinPopup && (
        <div className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-8 rounded shadow-lg text-center text-black">
            <h2 className="font-bold text-2xl">You Win!</h2>
            <p>Congratulations! You reached 1 million honey!</p>
            <button onClick={() => setShowWinPopup(false)} className="mt-4 px-4 py-2 bg-yellow-500 text-black rounded">Close</button>
          </div>
        </div>
      )}
      
      {/* Terms & Conditions Link */}
      <div 
        onClick={handleTermsClick} 
        className="absolute bottom-4 left-4 text-white text-xs cursor-pointer hover:underline"
      >
        Terms & Conditions
      </div>
    </div>
  );
}

export default App;
