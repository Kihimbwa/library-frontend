import axios from "axios";

// Fallback API URL if environment variable is not set
const API_URL = process.env.REACT_APP_API_URL || "https://my-project-5fi1.onrender.com";

function ReturnBook({ borrow, onReturnSuccess }) {
  const handleReturn = () => {
    const token = localStorage.getItem("token");
    
    axios.post(`${API_URL}/api/borrows/${borrow.id}/return_book/`, { // ✅ fixed
      borrow_id: borrow.id
    }, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
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