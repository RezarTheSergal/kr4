import { useState } from 'react';

function App() {
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState([]);

  const handleSend = () => {
    if (inputValue.trim() === '') return;

    const userMessage = { text: inputValue, sender: 'user' };
    const botMessage = { text: 'Привет, я не умею адекватно обрабатывать сообщения!', sender: 'bot' };

    setMessages(prev => [...prev, userMessage, botMessage]);
    setInputValue('');
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSend();
    }
  };

  return (
    <div>
      <div style={{ height: '80vh', overflowY: 'scroll', border: '1px solid #ccc', padding: '10px' }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.sender === 'user' ? 'right' : 'left' }}>
            <span style={{ display: 'inline-block', margin: '5px', padding: '5px 10px', backgroundColor: msg.sender === 'user' ? '#007bff' : '#e9ecef', color: msg.sender === 'user' ? 'white' : 'black' }}>
              {msg.text}
            </span>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex',  flexDirection: 'row',  margin: '50px', padding: '5px 10px',  alignItems: 'center', justifyContent: 'center' }}>
        <input
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyPress={handleKeyPress}
          placeholder="Введите сообщение..."
        />
        <button onClick={handleSend}>Отправить</button>
      </div>
    </div>
  );
}

export default App;