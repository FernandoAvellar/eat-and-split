import { useState } from 'react';

/* eslint-disable react/prop-types */

export default function App() {
  const [friends, setFriends] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const friendSelected = friends.find((friend) => friend.selected) || null;

  function handleNewFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    toggleShowButton();
  }

  function handleFriendSelect(id) {
    setFriends((friends) => {
      const updatedFriend = friends.find((friend) => friend.id === id);
      // Se o amigo já estiver selecionado, desativa todos
      if (updatedFriend.selected) {
        return friends.map((friend) => ({ ...friend, selected: false }));
      }
      // Caso contrário, ativa o amigo selecionado e desativa os demais
      return friends.map((friend) => ({
        ...friend,
        selected: friend.id === updatedFriend.id,
      }));
    });
  }

  function toggleShowButton() {
    setShowButton((showButton) => setShowButton(!showButton));
  }

  return (
    <div className="App">
      <div className="user-and-split-view">
        <FriendList
          friends={friends}
          onSelect={(id) => handleFriendSelect(id)}
        />
        {friendSelected === null ? '' : <SplitBill friend={friendSelected} />}
      </div>
      {!showButton && (
        <ButtonAddClose text="Add Friend" onClick={toggleShowButton} />
      )}
      {showButton && (
        <AddFriend onAddFriend={(friend) => handleNewFriend(friend)} />
      )}
      {showButton && <ButtonAddClose text="Close" onClick={toggleShowButton} />}
    </div>
  );
}

function SplitBill({ friend }) {
  const [bill, setBill] = useState(0);
  const [yourExpense, setYourExpense] = useState(0);
  const [otherExpense, setOtherExpense] = useState(0);
  const [whoPays, setWhoPays] = useState('You');

  return (
    <div className="split-bill">
      <h3>Split a bill with {friend.name}</h3>
      <form>
        <div>
          <label>💵 Bill value</label>
          <input
            type="number"
            value={bill}
            onChange={(e) => setBill(Number(e.target.value))}
          />
        </div>
        <div>
          <label>🧍🏻‍♂️ Your expense</label>
          <input
            type="number"
            value={yourExpense}
            onChange={(e) => setYourExpense(Number(e.target.value))}
          />
        </div>
        <div>
          <label>👨🏻‍🤝‍👩 {friend.name} expense</label>
          <input
            type="number"
            value={otherExpense}
            onChange={(e) => setOtherExpense(Number(e.target.value))}
          />
        </div>
        <div>
          <label>Who is paying the bill</label>
          <select value={whoPays} onChange={(e) => setWhoPays(e.target.value)}>
            <option value="You"></option>
            <option value={friend.name}></option>
          </select>
        </div>
      </form>
      <button type="submit">Split bill</button>
    </div>
  );
}

function FriendList({ friends, onSelect }) {
  return (
    <table className="tb-friend-list">
      <tbody>
        {friends.map((friend) => (
          <tr key={friend.id}>
            <Friend
              id={friend.id}
              name={friend.name}
              img_url={friend.img_url}
              balance={friend.balance}
              selected={friend.selected}
              onSelect={onSelect}
            />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Friend({ id, name, img_url, balance, selected, onSelect }) {
  return (
    <td className="friend">
      <img className="friend-image" src={img_url} alt="batman picture" />
      <div className="friend-txt">
        <p className="friend-name">{name}</p>
        <p>
          {name} owes you ${balance}
        </p>
      </div>
      <button className="friend-select-btn" onClick={() => onSelect(id)}>
        {selected ? 'Close' : 'Select'}
      </button>
    </td>
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
      <button disabled={!name || !img_url} type="submit">
        Add
      </button>
    </form>
  );
}

function ButtonAddClose({ text, onClick }) {
  return (
    <div>
      <button className="btn-add-close-friend" onClick={onClick}>
        {text}
      </button>
    </div>
  );
}
