const { useState, useEffect, Fragment } = React;

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
    const characteristics = {
      messageCount: userChats.filter(chat => !chat.isAI).length,
      averageMessageLength: userChats.filter(chat => !chat.isAI).reduce((sum, chat) => sum + chat.message.length, 0) / userChats.filter(chat => !chat.isAI).length || 0,
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
    if (characteristics.messageCount > 10) {
      return `いつもチャットしてくれてありがとう！${characteristics.averageMessageLength > 50 ? "あなたは言葉豊かですね。" : "簡潔な表現が得意なようですね。"}`;
    }
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
      {!username ?
