import { useState } from 'react';

/* eslint-disable react/prop-types */

export default function App() {
  const [friends, setFriends] = useState([]);
  const [showButton, setShowButton] = useState(false);
  const friendSelected = friends.find((friend) => friend.selected) || null;

  function handleNewFriend(friend) {
    setFriends((friends) => [...friends, friend]);
    setShowButton(false);
  }

  function handleFriendSelect(id) {
    setShowButton(false); //close new friend form  if it´s open
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
    setShowButton((show) => !show);
  }

  function handleSplit(e) {
    {
      e.whoPays === 'You'
        ? updateBalance(e.id, e.otherExpense * -1)
        : updateBalance(e.id, e.yourExpense);
    }

    function updateBalance(id, value) {
      setFriends(
        friends.map((friend) =>
          friend.id === id
            ? { ...friend, balance: friend.balance + value }
            : friend
        )
      );
    }
  }

  return (
    <div className="App">
      <div className="sidebar">
        <FriendList
          friends={friends}
          onSelect={(id) => handleFriendSelect(id)}
        />
        {showButton && (
          <AddFriend onAddFriend={(friend) => handleNewFriend(friend)} />
        )}
        {
          <ButtonAddClose
            text={showButton ? 'Close' : 'Add Friend'}
            onClick={toggleShowButton}
          />
        }
      </div>
      {friendSelected === null ? (
        ''
      ) : (
        <SplitBill
          friend={friendSelected}
          onSplitBill={(e) => handleSplit(e)}
          key={friendSelected.id}
        />
      )}
    </div>
  );
}

function SplitBill({ friend, onSplitBill }) {
  const [bill, setBill] = useState('');
  const [yourExpense, setYourExpense] = useState(0);
  const otherExpense = bill ? bill - yourExpense : '';
  const [whoPays, setWhoPays] = useState('You');

  function handleSubmit(e) {
    e.preventDefault();

    if (!bill || !yourExpense) return;

    setBill('');
    setYourExpense(0);
    setWhoPays('You');

    onSplitBill({
      bill: bill,
      yourExpense: yourExpense,
      otherExpense: otherExpense,
      whoPays: whoPays,
      id: friend.id,
    });
  }

  return (
    <div className="split-bill">
      <h3>Split a bill with {friend.name}</h3>
      <form onSubmit={handleSubmit}>
        <div>
          <label>💵 Bill value</label>
          <input
            type="number"
            placeholder="Bill value ..."
            value={bill > 0 ? bill : ''}
            onChange={(e) => setBill(Number(e.target.value))}
          />
        </div>
        <div>
          <label>🧍🏻‍♂️ Your expense</label>
          <input
            type="number"
            value={bill >= yourExpense ? yourExpense : 0}
            onChange={(e) => setYourExpense(Number(e.target.value))}
          />
        </div>
        <div>
          <label>👨🏻‍🤝‍👩 {friend.name} expense</label>
          <input
            type="number"
            value={otherExpense > 0 ? otherExpense : 0}
            disabled
          />
        </div>
        <div>
          <label>Who is paying the bill</label>
          <select value={whoPays} onChange={(e) => setWhoPays(e.target.value)}>
            <option value="You">You</option>
            <option value={friend.name}>{friend.name}</option>
          </select>
        </div>
        <button
          type="submit"
          disabled={bill <= 0 || yourExpense <= 0 || otherExpense <= 0}
        >
          Split bill
        </button>
      </form>
    </div>
  );
}

function FriendList({ friends, onSelect }) {
  return (
    <table className="tb-friend-list">
      <tbody>
        {friends.map((friend) => (
          <tr key={friend.id}>
            <Friend friend={friend} onSelect={onSelect} />
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function Friend({ friend, onSelect }) {
  return (
    <td className="friend">
      <img className="friend-image" src={friend.img_url} alt="batman picture" />
      <div className="friend-txt">
        <p className="friend-name">{friend.name}</p>
        <p
          style={
            friend.balance > 0
              ? { color: 'red' }
              : friend.balance === 0
                ? { color: 'black' }
                : { color: 'green' }
          }
        >
          {friend.balance === 0
            ? `You and ${friend.name} are even`
            : friend.balance < 0
              ? `${friend.name} owes you ${Math.abs(friend.balance)}$`
              : `You owe ${friend.name} ${friend.balance}$`}
        </p>
      </div>
      <button className="friend-select-btn" onClick={() => onSelect(friend.id)}>
        {friend.selected ? 'Close' : 'Select'}
      </button>
    </td>
  );
}

function AddFriend({ onAddFriend }) {
  const [name, setName] = useState('');
  const [img_url, setImgUrl] = useState('https://i.pravatar.cc/48/');

  function handleSubmit(e) {
    e.preventDefault();

    if (!name || !img_url) return;

    const id = crypto.randomUUID();

    const newFriend = {
      id: id,
      name,
      img_url: `${img_url}?=${id}`,
      balance: 0,
      selected: false,
    };
    onAddFriend(newFriend);
    setName('');
    setImgUrl('https://i.pravatar.cc/48/');
  }

  return (
    <form className="add-form" onSubmit={(e) => handleSubmit(e)}>
      <div>
        <label>👨🏻 Friend name</label>
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
