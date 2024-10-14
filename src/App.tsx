import React, { useState, useEffect } from 'react';
import { Gift, Sparkles, Settings } from 'lucide-react';

interface Prize {
  id: string;
  name: string;
  probability: number;
}

function App() {
  const [isDrawing, setIsDrawing] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [prizes, setPrizes] = useState<Prize[]>(() => {
    const savedPrizes = localStorage.getItem('prizes');
    return savedPrizes ? JSON.parse(savedPrizes) : [
      { id: '1', name: '一等奖', probability: 0.05 },
      { id: '2', name: '二等奖', probability: 0.1 },
      { id: '3', name: '三等奖', probability: 0.15 },
      { id: '4', name: '四等奖', probability: 0.2 },
      { id: '5', name: '五等奖', probability: 0.5 },
    ];
  });

  useEffect(() => {
    localStorage.setItem('prizes', JSON.stringify(prizes));
  }, [prizes]);

  const drawPrize = () => {
    if (isDrawing) return;

    setIsDrawing(true);
    setResult(null);
    setShowResult(false);

    const randomValue = Math.random();
    let cumulativeProbability = 0;
    let selectedPrize: Prize | undefined;

    for (const prize of prizes) {
      cumulativeProbability += prize.probability;
      if (randomValue <= cumulativeProbability) {
        selectedPrize = prize;
        break;
      }
    }

    setTimeout(() => {
      setIsDrawing(false);
      setResult(selectedPrize?.name || '未中奖');
      setTimeout(() => setShowResult(true), 500);
    }, 3000);
  };

  const addPrize = () => {
    const newId = (Math.max(...prizes.map(p => parseInt(p.id))) + 1).toString();
    setPrizes([...prizes, { id: newId, name: `新奖项 ${newId}`, probability: 0.1 }]);
  };

  const updatePrize = (id: string, field: 'name' | 'probability', value: string | number) => {
    setPrizes(prizes.map(prize => 
      prize.id === id ? { ...prize, [field]: value } : prize
    ));
  };

  const deletePrize = (id: string) => {
    setPrizes(prizes.filter(prize => prize.id !== id));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-500 to-pink-500 flex flex-col items-center justify-center p-4 relative">
      <button
        onClick={() => setShowSettings(true)}
        className="absolute top-4 right-4 bg-white text-purple-600 p-2 rounded-full shadow-lg hover:bg-purple-100 transition duration-300"
      >
        <Settings />
      </button>
      <h1 className="text-4xl font-bold text-white mb-8">神秘抽奖箱</h1>
      <div className="relative w-64 h-64 mb-8">
        <div className={`w-full h-full bg-yellow-400 rounded-lg shadow-2xl flex items-center justify-center transition-all duration-500 ${isDrawing ? 'animate-shake' : ''}`}>
          {!showResult && (
            <Gift className={`text-purple-700 w-32 h-32 transition-all duration-500 ${isDrawing ? 'animate-pulse' : ''}`} />
          )}
          {showResult && (
            <div className="text-center">
              <Sparkles className="text-purple-700 w-16 h-16 mx-auto mb-4 animate-spin" />
              <p className="text-2xl font-bold text-purple-700">{result}</p>
            </div>
          )}
        </div>
      </div>
      <button
        onClick={drawPrize}
        disabled={isDrawing}
        className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300 flex items-center text-lg"
      >
        {isDrawing ? '抽奖中...' : '开始抽奖'}
      </button>
      {showResult && (
        <div className="mt-8 text-2xl font-bold text-white bg-opacity-50 bg-black p-4 rounded-lg animate-fade-in">
          恭喜您获得了 {result}！
        </div>
      )}
      {showSettings && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-96 max-h-[80vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">奖项设置</h2>
            {prizes.map(prize => (
              <div key={prize.id} className="mb-4 p-2 border rounded">
                <input
                  type="text"
                  value={prize.name}
                  onChange={(e) => updatePrize(prize.id, 'name', e.target.value)}
                  className="w-full mb-2 p-1 border rounded"
                />
                <input
                  type="number"
                  value={prize.probability}
                  min="0"
                  max="1"
                  step="0.01"
                  onChange={(e) => updatePrize(prize.id, 'probability', parseFloat(e.target.value))}
                  className="w-full mb-2 p-1 border rounded"
                />
                <button
                  onClick={() => deletePrize(prize.id)}
                  className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                >
                  删除
                </button>
              </div>
            ))}
            <button
              onClick={addPrize}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 mr-2"
            >
              添加奖项
            </button>
            <button
              onClick={() => setShowSettings(false)}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            >
              保存并关闭
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;