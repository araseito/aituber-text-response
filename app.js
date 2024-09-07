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

  const handleSubmit = async (
