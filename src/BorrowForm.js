import { useState } from "react";
import axios from "axios";

// Fallback API URL if environment variable is not set
const API_URL = process.env.REACT_APP_API_URL || "https://my-project-5fi1.onrender.com";

function BorrowForm({ book, onBorrowSuccess }) {
  const [expectedReturnDate, setExpectedReturnDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    
    const token = localStorage.getItem("token");
    
    axios.post(`${API_URL}/api/borrows/`, {
      book_id: book.id,
      expected_return_date: expectedReturnDate
    }, {
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(res => {
      alert("📚 Book borrowed successfully! Don't forget to return by " + expectedReturnDate);
      onBorrowSuccess();
    })
    .catch(err => {
      console.log("Borrow error:", err);
      console.log("Error response:", err.response);
      console.log("Error data:", err.response?.data);
      console.log("Error status:", err.response?.status);
      
      // Try to extract the most detailed error message possible
      let errorMessage = "Failed to borrow book. Please try again.";
      
      if (err.response) {
        // Server responded with error
        const data = err.response.data;
        if (data) {
          if (typeof data === 'string') {
            errorMessage = data;
          } else if (data.error) {
            errorMessage = data.error;
          } else if (data.message) {
            errorMessage = data.message;
          } else if (data.detail) {
            errorMessage = data.detail;
          } else if (Array.isArray(data)) {
            errorMessage = data.join(', ');
          } else {
            // Try to get first key's value
            const firstKey = Object.keys(data)[0];
            if (firstKey && data[firstKey]) {
              errorMessage = Array.isArray(data[firstKey]) 
                ? data[firstKey].join(', ') 
                : String(data[firstKey]);
            }
          }
        }
      } else if (err.request) {
        // No response received - network error
        errorMessage = "Cannot connect to server. Please check your internet connection.";
      }
      
      setError(errorMessage);
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

        {error && (
          <div style={{ 
            marginTop: '16px', 
            padding: '12px', 
            background: '#fee2e2', 
            borderRadius: '8px',
            color: '#dc2626',
            textAlign: 'center'
          }}>
            ⚠️ {error}
          </div>
        )}
      </div>
    </div>
  );
}

export default BorrowForm;