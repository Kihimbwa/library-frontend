import { useEffect, useState } from "react";
import axios from "axios";

function BookList({ onSelectBook }) {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    axios.get("fetch(`${process.env.REACT_APP_API_URL}/api/books/`)")
      .then(res => setBooks(res.data))
      .catch(err => console.log(err));
  }, []);

  // Filter books based on search query and genre
  const filteredBooks = books.filter(book => {
    const matchesSearch = book.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         book.author.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesGenre = selectedGenre === "" || book.genre.toLowerCase() === selectedGenre.toLowerCase();
    return matchesSearch && matchesGenre;
  });

  // Get unique genres from books
  const genres = [...new Set(books.map(book => book.genre))];

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

  return (
    <div className="container">
      <h1 className="page-title">📚 Available Books</h1>
      
      {/* Search and Filter Section */}
      <div style={{ 
        display: 'flex', 
        gap: '16px', 
        marginBottom: '24px',
        flexWrap: 'wrap'
      }}>
        <div style={{ flex: 1, minWidth: '200px' }}>
          <input
            type="text"
            placeholder="🔍 Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="form-input"
            style={{ width: '100%' }}
          />
        </div>
        <div style={{ minWidth: '150px' }}>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="form-input"
            style={{ width: '100%' }}
          >
            <option value="">All Genres</option>
            {genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>
        </div>
      </div>
      
      {filteredBooks.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">📚</div>
          <p className="empty-state-text">
            {books.length === 0 ? "No books available in the library yet." : "No books match your search criteria."}
          </p>
        </div>
      ) : (
        <div className="book-grid">
          {filteredBooks.map(book => (
            <div key={book.id} className="book-card">
              <div 
                className="book-cover" 
                style={{ 
                  background: book.cover_image 
                    ? `url(fetch(`${process.env.REACT_APP_API_URL}/api/books/)`
                    : getGradient(book.title),
                  backgroundSize: 'cover',
                  backgroundPosition: 'center'
                }}
              >
                {!book.cover_image && (
                  <span style={{ fontSize: '64px' }}>{getGenreEmoji(book.genre)}</span>
                )}
              </div>
              <div className="book-info">
                <h3 className="book-title">{book.title}</h3>
                <p className="book-author">✍️ {book.author}</p>
                <div className="book-meta">
                  <span className="book-genre">{book.genre}</span>
                  <span className={book.available_copies > 0 ? "book-available" : "book-unavailable"}>
                    {book.available_copies > 0 ? `✅ ${book.available_copies} copies` : '❌ Not available'}
                  </span>
                </div>
                <button
                  onClick={() => onSelectBook(book)}
                  className="btn btn-success"
                  style={{ width: '100%', marginTop: '16px' }}
                  disabled={book.available_copies === 0}
                >
                  {book.available_copies > 0 ? "📚 Borrow Book" : "⛔ No Copies"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default BookList;
