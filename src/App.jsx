import { useState } from 'react';

/* eslint-disable react/prop-types */

export default function App() {
  const [friends, setFriends] = useState([]);

  function handleNewFriend(friend) {
    setFriends((friends) => [...friends, friend]);
  }

  return (
    <div>
      <FriendList friends={friends} />
      <AddFriend onAddFriend={(friend) => handleNewFriend(friend)} />
    </div>
  );
}

function AddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [img_url, setImgUrl] = useState('../public/images/batman.jpg');

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !img_url) return;

    const newFriend = {
      id: Date.now(),
      name,
      img_url,
      balance: 0,
      selected: false,
    };
    onAddFriend(newFriend);
    setName('');
  }

  return (
    <form className="add-form" onSubmit={(e) => handleSubmit(e)}>
      <div>
        <label>👨🏻‍🤝‍👩 Friend name</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
      <div>
        <label>🖼️ Image URL</label>
        <input
          type="text"
          value={img_url}
          onChange={(e) => setImgUrl(e.target.value)}
        />
      </div>
      <button type="submit">Add</button>
    </form>
  );
}

function FriendList({ friends }) {
  return (
    <table className="tb-friend-list">
      <tbody>
        {friends.map((friend) => (
          <tr key={friend.id}>
            <Friend
              name={friend.name}
              img_url={friend.img_url}
              balance={friend.balance}
              selected={friend.selected}
            />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Friend({ name, img_url, balance, selected }) {
  return (
    <td className="friend">
      <img className="friend-image" src={img_url} alt="batman picture" />
      <div className="friend-txt">
        <p className="friend-name">{name}</p>
        <p>
          {name} owes you ${balance}
        </p>
      </div>
      <button className="friend-btn">{selected ? 'Close' : 'Select'}</button>
    </td>
  );
}
