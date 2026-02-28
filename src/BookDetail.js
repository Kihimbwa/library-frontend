import React, { useState } from "react";
import BorrowForm from "./BorrowForm";

function BookDetail({ book, onBack }) {
  const [showBorrowForm, setShowBorrowForm] = useState(false);
  // Function to get gradient based on title
  const getGradient = (title) => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
      'linear-gradient(135deg, #a8edea 0%, #fed6e3 100%)',
      'linear-gradient(135deg, #d299c2 0%, #fef9d7 100%)',
      'linear-gradient(135deg, #89f7fe 0%, #66a6ff 100%)',
    ];
    const index = title?.charCodeAt(0) % gradients.length || 0;
    return gradients[index];
  };

  // Function to get placeholder image based on genre
  const getGenreEmoji = (genre) => {
    const genreEmojis = {
      'fiction': '📖',
      'science': '🔬',
      'math': '📐',
      'history': '🏛️',
      'biography': '👤',
      'technology': '💻',
      'art': '🎨',
      'music': '🎵',
      'sports': '⚽',
      'religion': '📿',
      'romance': '💕',
      'mystery': '🔍',
      'horror': '👻',
      'default': '📚'
    };
    const genreLower = genre?.toLowerCase() || '';
    for (const [key, emoji] of Object.entries(genreEmojis)) {
      if (genreLower.includes(key)) {
        return emoji;
      }
    }
    return genreEmojis.default;
  };

  return (
    <div className="container">
      <button 
        onClick={onBack}
        className="btn btn-secondary"
        style={{ marginBottom: '20px' }}
      >
        ← Back to Books
      </button>

      <div className="book-detail-container">
        <div className="book-detail-header">
          <div 
            className="book-detail-cover"
            style={{ 
              background: book.cover_image 
                ? `url(fetch(`${process.env.REACT_APP_API_URL}/api/books/`))`
                : getGradient(book.title),
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {!book.cover_image && (
              <span style={{ fontSize: '80px' }}>{getGenreEmoji(book.genre)}</span>
            )}
          </div>
          
          <div className="book-detail-info">
            <h1 className="book-detail-title">{book.title}</h1>
            <p className="book-detail-author">✍️ By {book.author}</p>
            
            <div className="book-detail-meta">
              <div className="book-detail-meta-item">
                <div className="book-detail-meta-label">📚 Genre</div>
                <div className="book-detail-meta-value">{book.genre}</div>
              </div>
              <div className="book-detail-meta-item">
                <div className="book-detail-meta-label">📅 Publication</div>
                <div className="book-detail-meta-value">{book.publication_date}</div>
              </div>
              <div className="book-detail-meta-item">
                <div className="book-detail-meta-label">🔢 ISBN</div>
                <div className="book-detail-meta-value">{book.isbn}</div>
              </div>
              <div className="book-detail-meta-item">
                <div className="book-detail-meta-label">📦 Available</div>
                <div className="book-detail-meta-value">
                  <span className={book.available_copies > 0 ? "book-available" : "book-unavailable"}>
                    {book.available_copies > 0 ? `✅ ${book.available_copies} copies` : '❌ Not available'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {book.description && (
          <div className="book-detail-description">
            <h4>📝 Description</h4>
            <p>{book.description}</p>
          </div>
        )}

        {!showBorrowForm && (
          <div style={{ padding: '0 40px 40px' }}>
            {book.available_copies > 0 ? (
              <button
                onClick={() => setShowBorrowForm(true)}
                className="btn btn-success"
                style={{ width: '100%', padding: '16px' }}
              >
                📚 Borrow This Book
              </button>
            ) : (
              <button
                className="btn btn-secondary"
                style={{ width: '100%', padding: '16px' }}
                disabled
              >
                ⛔ No Copies Available
              </button>
            )}
          </div>
        )}

        {showBorrowForm && (
          <BorrowForm 
            book={book} 
            onBorrowSuccess={() => setShowBorrowForm(false)} 
          />
        )}
      </div>
    </div>
  );
}

export default BookDetail;
