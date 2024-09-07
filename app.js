const { useState, useEffect } = React;

function AITuberApp() {
  const [username, setUsername] = useState('');
  const [input, setInput] = useState('');
  const [chats, setChats] = useState([]);
  const [userCharacteristics, setUserCharacteristics] = useState({});

  useEffect(() => {
    const storedUsername = localStorage.getItem('username');
    if (storedUsername) {
      setUsername(storedUsername);
      loadChats(storedUsername);
    }
  }, []);

  async function loadChats(user) {
    const userChats = await getChats(user);
    setChats(userChats);
    analyzeUserCharacteristics(userChats);
  }

  function analyzeUserCharacteristics(userChats) {
    // 簡単な特性分析の例
    const characteristics = {
      messageCount: userChats.filter(chat => !chat.isAI).length,
      averageMessageLength: userChats.filter(chat => !chat.isAI).reduce((sum, chat) => sum + chat.message.length, 0) / userChats.filter(chat => !chat.isAI).length || 0,
      // より高度な分析をここに追加
    };
    setUserCharacteristics(characteristics);
  }

  const handleLogin = async (e) => {
    e.preventDefault();
    if (username) {
      localStorage.setItem('username', username);
      await saveUser(username);
      loadChats(username);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (input.trim() && username) {
      await saveChat(username, input, false);
      const aiResponse = generateResponse(input, userCharacteristics);
      await saveChat(username, aiResponse, true);
      setInput('');
      loadChats(username);
    }
  };

  const generateResponse = (userInput, characteristics) => {
    // ユーザーの特性に基づいた応答生成ロジック
    if (characteristics.messageCount > 10) {
      return `いつもチャットしてくれてありがとう！${characteristics.averageMessageLength > 50 ? "あなたは言葉豊かですね。" : "簡潔な表現が得意なようですね。"}`;
    }
    // 基本的な応答
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
      <h1 className="text-2xl font-bold mb-4">AITuber Personalized Chat System</h1>
      {!username ? (
        <form onSubmit={handleLogin} className="mb-4">
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="ユーザー名を入力"
            className="w-full p-2 border rounded mb-2"
          />
          <button type="submit" className="w-full bg-blue-500 text-white p-2 rounded">ログイン</button>
        </form>
      ) : (
        <>
          <div className="mb-4 h-64 overflow-y-auto border p-2 rounded">
            {chats.map((chat, index) => (
              <div key={index} className={`mb-2 ${chat.isAI ? 'text-blue-600' : 'text-green-600'}`}>
                <strong>{chat.isAI ? 'AITuber' : username}:</strong> {chat.message}
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
        </>
      )}
    </div>
  );
}

ReactDOM.render(<AITuberApp />, document.getElementById('root'));
