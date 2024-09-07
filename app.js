const { useState } = React;

function AITuberApp() {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState('');
  const [conversationHistory, setConversationHistory] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const aiResponse = generateResponse(input);
      setResponse(aiResponse);
      setConversationHistory([...conversationHistory, { user: input, ai: aiResponse }]);
      setInput('');
    }
  };

  const generateResponse = (userInput) => {
    // 簡単な応答生成ロジック（実際のプロジェクトではより高度な実装が必要）
    const responses = [
      "なるほど、興味深いですね！",
      "そうなんですか？もっと詳しく教えてください。",
      "わかります。私もそう思います。",
      "それは素晴らしいアイデアですね！",
      "hmm...考えさせられますね。"
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-2xl font-bold mb-4">AITuber Text Response System</h1>
      <div className="mb-4 h-64 overflow-y-auto border p-2 rounded">
        {conversationHistory.map((entry, index) => (
          <div key={index} className="mb-2">
            <p className="font-bold">User: {entry.user}</p>
            <p className="pl-4">AITuber: {entry.ai}</p>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex flex-col">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="メッセージを入力してください..."
          className="w-full p-2 border rounded mb-2"
          rows="3"
        />
        <button 
          type="submit" 
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
          disabled={!input.trim()}
        >
          送信
        </button>
      </form>
    </div>
  );
}

ReactDOM.render(<AITuberApp />, document.getElementById('root'));