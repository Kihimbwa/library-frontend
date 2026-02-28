import { useEffect, useState } from "react";
import axios from "axios";
import ReturnBook from "./ReturnBook";

function BorrowedBooks() {
  const [borrows, setBorrows] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBorrows = () => {
    const token = localStorage.getItem("token");
    axios.get(fetch(`${process.env.REACT_APP_API_URL}/api/books/`), {
      headers: {
        'Authorization': `Token ${token}`
      }
    })
      .then(res => {
        setBorrows(res.data);
        setLoading(false);
      })
      .catch(err => {
        console.log(err);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchBorrows();
  }, []);

  const handleReturnSuccess = () => {
    fetchBorrows(); // refresh list
  };

  // Function to get gradient based on title
  const getGradient = (title) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ];
    const index = title?.charCodeAt(0) % gradients.length || 0;
    return gradients[index];
  };

  return (
    <div className="container">
      <h1 className="page-title">📖 My Borrowed Books</h1>

      {loading ? (
        <div className="loading">Loading...</div>
      ) : borrows.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <p className="empty-state-text">You haven't borrowed any books yet.</p>
        </div>
      ) : (
        <div>
          {borrows.map(borrow => (
            <div key={borrow.id} className="borrowed-card">
              <div 
                className="borrowed-cover"
                style={{ 
                  background: borrow.book.cover_image 
                    ? `url(fetch(`${process.env.REACT_APP_API_URL}/api/books/`))`
                    : getGradient(borrow.book.title),
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              />
              
              <div className="borrowed-info">
                <h3>📖 {borrow.book.title}</h3>
                <p>✍️ {borrow.book.author}</p>
                
                <div className="borrowed-details">
                  <div className="borrowed-detail">
                    <span className="borrowed-detail-label">📅 Borrow Date:</span>
                    <span className="borrowed-detail-value"> {borrow.borrow_date}</span>
                  </div>
                  <div className="borrowed-detail">
                    <span className="borrowed-detail-label">📆 Expected Return:</span>
                    <span className="borrowed-detail-value"> {borrow.expected_return_date}</span>
                  </div>
                  <div className="borrowed-detail">
                    <span className="borrowed-detail-label">✅ Actual Return:</span>
                    <span className="borrowed-detail-value"> {borrow.actual_return_date || "Not returned yet"}</span>
                  </div>
                  <div className="borrowed-detail">
                    <span className="borrowed-detail-label">💰 Penalty:</span>
                    <span className="borrowed-detail-value" style={{ color: borrow.penalty > 0 ? '#dc2626' : '#059669' }}>
                      {" "}{borrow.penalty > 0 ? `${borrow.penalty} TZS` : 'No penalty'}
                    </span>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {borrow.actual_return_date ? (
                  <span className="status-badge status-returned">
                    ✅ Returned
                  </span>
                ) : (
                  <span className="status-badge status-pending">
                    ⏳ Pending
                  </span>
                )}
                
                {!borrow.actual_return_date && (
                  <ReturnBook borrow={borrow} onReturnSuccess={handleReturnSuccess} />
                )}
                
                {borrow.penalty > 0 && (
                  <div className="penalty-badge">
                    ⚠️ Penalty: {borrow.penalty} TZS
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BorrowedBooks;
