import React, { useState } from 'react';
import { queryClient } from './index';
import { trpc } from './trpc';

const App: React.FC = () => {
  const [username, setUsername] = useState('');
  const [message, setMessage] = useState('');
  const hello = trpc.useQuery(['hello-world']);
  const messages = trpc.useQuery(['fetch-messages']);
  const { mutateAsync: postMessage } = trpc.useMutation(['post-message']);

  const handlePostMessage = async () => {
    try {
      await postMessage({ username, message });
      queryClient.invalidateQueries(['fetch-messages']);
    } catch (error) {
      console.warn(error);
    }
  };

  return (
    <div className='flex flex-col w-48'>
      <div className='flex'>
        <p>First message from server: {hello.data} </p>
      </div>
      <div className='flex'>
        <label
          className='block text-sm font-medium text-gray-700'
          htmlFor='username'
        >
          Username
        </label>
        <input
          value={username}
          placeholder='username'
          onChange={(evt) => void setUsername(evt.target.value)}
          type='text'
          name='username'
        />
      </div>
      <div>
        <label
          className='block text-sm font-medium text-gray-700'
          htmlFor='message'
        >
          Message
        </label>
        <input
          placeholder='message'
          value={message}
          onChange={(evt) => void setMessage(evt.target.value)}
          type='text'
          name='message'
        />
      </div>

      <button className='rounded-md bg-slate-500' onClick={handlePostMessage}>
        Enviar
      </button>

      <div>
        {messages.data?.map((item, index) => (
          <p key={index}>
            {item.username}: {item.message}
          </p>
        ))}
      </div>
    </div>
  );
};

export default App;
