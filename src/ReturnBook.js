import axios from "axios";

function ReturnBook({ borrow, onReturnSuccess }) {
  const handleReturn = () => {
    const token = localStorage.getItem("token");
    
    axios.post(`fetch(`${process.env.REACT_APP_API_URL}/api/books/`), {}, {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => {
        const penalty = res.data.penalty;
        if (penalty > 0) {
          alert(`⚠️ Book returned but you have a penalty of ${penalty} TZS for late return!`);
        } else {
          alert("✅ Book returned successfully!");
        }
        onReturnSuccess();
      })
      .catch(err => {
        console.log(err);
        alert("Failed to return book. Please try again.");
      });
  };

  return (
    <button
      onClick={handleReturn}
      className="btn btn-danger"
      style={{ width: '100%' }}
    >
      📥 Return Book
    </button>
  );
}

export default ReturnBook;
