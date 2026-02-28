import { useState, useEffect } from "react";
import BookList from "./BookList";
import BookDetail from "./BookDetail";
import BorrowForm from "./BorrowForm";
import BorrowedBooks from "./BorrowedBooks";
import Login from "./Login";
import Register from "./Register";

function App() {
  const [selectedBook, setSelectedBook] = useState(null);
  const [borrowStep, setBorrowStep] = useState(false);
  const [viewBorrowed, setViewBorrowed] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");
    if (token && username) {
      setIsLoggedIn(true);
      setUser({ username, member_id: localStorage.getItem("member_id") });
    }
  }, []);

  const handleSelectBook = (book) => {
    setSelectedBook(book);
    setBorrowStep(true);
  };

  const handleBorrowSuccess = () => {
    setSelectedBook(null);
    setBorrowStep(false);
  };

  const handleBack = () => {
    setSelectedBook(null);
    setBorrowStep(false);
  };

  const handleLoginSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleRegisterSuccess = (userData) => {
    setIsLoggedIn(true);
    setUser(userData);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("username");
    localStorage.removeItem("member_id");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setUser(null);
    setSelectedBook(null);
    setBorrowStep(false);
    setViewBorrowed(false);
  };

  if (!isLoggedIn) {
    return (
      <>
        {showLogin ? (
          <Login 
            onLoginSuccess={handleLoginSuccess} 
            onSwitchToRegister={() => setShowLogin(false)} 
          />
        ) : (
          <Register 
            onRegisterSuccess={handleRegisterSuccess} 
            onSwitchToLogin={() => setShowLogin(true)} 
          />
        )}
      </>
    );
  }

  return (
    <div className="container">
      <div className="header">
        <div className="header-title">
          📚 Library Management System
        </div>
        <div className="header-user">
          <div className="user-info">
            <div className="user-name">👤 {user?.username}</div>
            <div className="user-id">ID: {user?.member_id}</div>
          </div>
          <button
            onClick={handleLogout}
            className="btn btn-danger"
          >
            🚪 Logout
          </button>
        </div>
      </div>

      {!viewBorrowed && !selectedBook && (
        <>
          <button
            onClick={() => setViewBorrowed(true)}
            className="btn btn-primary"
            style={{ marginBottom: '20px', marginRight: '10px' }}
          >
            📖 My Borrowed Books
          </button>
          <BookList onSelectBook={handleSelectBook} />
        </>
      )}

      {selectedBook && !borrowStep && <BookDetail book={selectedBook} onBack={handleBack} />}
      {selectedBook && borrowStep && <BorrowForm book={selectedBook} onBorrowSuccess={handleBorrowSuccess} />}
      {viewBorrowed && (
        <>
          <button
            onClick={() => setViewBorrowed(false)}
            className="btn btn-secondary"
            style={{ marginBottom: '20px' }}
          >
            ← Back to Book List
          </button>
          <BorrowedBooks />
        </>
      )}
    </div>
  );
}

export default App;
