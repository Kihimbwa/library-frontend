import { useState } from "react";
import axios from "axios";

function BorrowForm({ book, onBorrowSuccess }) {
  const [expectedReturnDate, setExpectedReturnDate] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    
    const token = localStorage.getItem("token");
    
    axios.post(`http://127.0.0.1:8000/api/borrows/`, {
      book_id: book.id,
      expected_return_date: expectedReturnDate
    }, {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
    .then(res => {
      alert("📚 Book borrowed successfully! Don't forget to return by " + expectedReturnDate);
      onBorrowSuccess();
    })
    .catch(err => {
      console.log(err);
      alert("Failed to borrow book. Please try again.");
    })
    .finally(() => {
      setLoading(false);
    });
  };

  return (
    <div className="container">
      <button 
        onClick={onBorrowSuccess}
        className="btn btn-secondary"
        style={{ marginBottom: '20px' }}
      >
        ← Back
      </button>

      <div className="borrow-form">
        <h2 className="borrow-form-title">📚 Borrow Book</h2>
        
        <div style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '20px',
          borderRadius: '12px',
          marginBottom: '24px',
          color: 'white'
        }}>
          <h3 style={{ margin: 0 }}>{book.title}</h3>
          <p style={{ margin: '8px 0 0 0', opacity: 0.9 }}>✍️ {book.author}</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">
              📅 Expected Return Date
            </label>
            <input
              type="date"
              value={expectedReturnDate}
              onChange={e => setExpectedReturnDate(e.target.value)}
              className="form-input"
              required
            />
          </div>

          <div style={{ 
            background: '#f9fafb', 
            padding: '16px', 
            borderRadius: '12px',
            marginBottom: '20px'
          }}>
            <p style={{ margin: 0, fontSize: '14px', color: '#6b7280' }}>
              ⚠️ Please return the book on or before the due date. 
              A penalty of <strong>1000 TZS</strong> will be charged for each day of delay.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn btn-success"
            style={{ width: '100%' }}
          >
            {loading ? "⏳ Processing..." : "✅ Confirm Borrow"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default BorrowForm;
