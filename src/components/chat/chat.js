import React from 'react';
import { auth, db } from '../../firebase/config';

export default function ChatApp() {

  const [user, setUser] = React.useState(JSON.parse(localStorage.getItem("chatUserAuth")));
  const [chats, setChats] = React.useState([]);
  const [content, setContent] = React.useState('');
  const [readError, setReadError] = React.useState(null);
  const [writeError, setWriteError] = React.useState(null);

  console.log(user.uid);

  React.useEffect(() => {
    setReadError(null);
    try {
      db.ref("chats").on("value", snapshot => {
        let chats = [];
        snapshot.forEach((snap) => {
          chats.push(snap.val());
        });
        setChats(chats);
      });
    } catch (error) {
      setReadError(error.message)
    }
  }, [db]);

  const handleChange = (event) => {
    setContent(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setWriteError(null);
    try {
      await db.ref("chats").push({
        content: content,
        timestamp: Date.now(),
        uid: user.uid
      });
      setContent('');
    } catch (error) {
      setWriteError(error.message);
    }
  };

  return(
    <div>
      <div className="chats">
        {chats.map(chat => {
          return <p key={chat.timestamp}>{chat.content}</p>
        })}
      </div>

      <form onSubmit={handleSubmit}>
        <input onChange={handleChange} value={content}></input>
        {writeError ? <p>{writeError}</p> : null}
        <button type="submit">Send</button>
      </form>

      <div>
        Login in as: <strong>{user.email}</strong>
      </div>
    </div>
  );

}