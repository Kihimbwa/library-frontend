import axios from "axios";

function ReturnBook({ borrow, onReturnSuccess }) {
  const handleReturn = () => {
    const token = localStorage.getItem("token");
    
    axios.post(`http://127.0.0.1:8000/api/borrows/${borrow.id}/return_book/`, {}, {
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
