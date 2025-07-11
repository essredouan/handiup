import React from "react";
import { useNavigate } from "react-router-dom";

function PostsList({ posts, comments = {} }) {
  const navigate = useNavigate();

  const handleClick = (postId) => {
    navigate(`/posts/${postId}`);
  };

  return (
    <div className="posts-container">
      {posts.length === 0 && (
        <div className="no-posts-message">
          <div className="empty-state">
            <svg className="empty-icon" viewBox="0 0 24 24">
              <path fill="currentColor" d="M19,13H13V19H11V13H5V11H11V5H13V11H19V13Z" />
            </svg>
            <h3>No Posts Yet</h3>
            <p>Be the first to create a post!</p>
          </div>
        </div>
      )}

      {posts.map((post) => (
        <div
          key={post._id}
          className="post-card"
          onClick={() => handleClick(post._id)}
        >
          {post.image?.url && (
            <div className="post-image-container">
              <img src={post.image.url} alt={post.title} className="post-image" />
            </div>
          )}
          
          <div className="post-content">
            <h3 className="post-title">{post.title}</h3>
            <p className="post-description">{post.description}</p>
            
            <div className="post-footer">
              <span className="post-author">
                <svg className="author-icon" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />
                </svg>
                {post.user?.username || "Unknown"}
              </span>
              
              <div className="post-actions">
                <span className="like-btn">
                  <svg className="action-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12,21.35L10.55,20.03C5.4,15.36 2,12.27 2,8.5C2,5.41 4.42,3 7.5,3C9.24,3 10.91,3.81 12,5.08C13.09,3.81 14.76,3 16.5,3C19.58,3 22,5.41 22,8.5C22,12.27 18.6,15.36 13.45,20.03L12,21.35Z" />
                  </svg>
                  {post.likes.length}
                </span>
                <span className="comment-count">
                  <svg className="action-icon" viewBox="0 0 24 24">
                    <path fill="currentColor" d="M12,23A1,1 0 0,1 11,22V19H7A2,2 0 0,1 5,17V7A2,2 0 0,1 7,5H21A2,2 0 0,1 23,7V17A2,2 0 0,1 21,19H16.9L13.2,22.71C13,22.89 12.76,23 12.5,23H12M13,17V20.08L16.08,17H21V7H7V17H13M3,15H1V3A2,2 0 0,1 3,1H19V3H3V15Z" />
                  </svg>
                  {comments[post._id]?.length ?? 0}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}

      <style jsx>{`
        /* Modern Post List Styles */
        :root {
          --primary: #4361ee;
          --primary-light: #4895ef;
          --secondary: #3f37c9;
          --accent: #f72585;
          --dark: #1b263b;
          --light: #f8f9fa;
          --success: #4cc9f0;
          --error: #ef233c;
          --warning: #ff9e00;
          --border-radius: 12px;
          --box-shadow: 0 8px 20px rgba(0, 0, 0, 0.08);
          --transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }

        .posts-container {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
          gap: 2rem;
          padding: 1rem;
        }

        .post-card {
          background: white;
          border-radius: var(--border-radius);
          box-shadow: var(--box-shadow);
          overflow: hidden;
          transition: var(--transition);
          cursor: pointer;
        }

        .post-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 12px 24px rgba(0, 0, 0, 0.1);
        }

        .post-image-container {
          width: 100%;
          height: 200px;
          overflow: hidden;
        }

        .post-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          transition: transform 0.5s ease;
        }

        .post-card:hover .post-image {
          transform: scale(1.05);
        }

        .post-content {
          padding: 1.5rem;
        }

        .post-title {
          color: var(--dark);
          margin: 0 0 1rem 0;
          font-size: 1.3rem;
          font-weight: 700;
          line-height: 1.4;
        }

        .post-description {
          color: #4b5563;
          margin: 0 0 1.5rem 0;
          font-size: 0.95rem;
          line-height: 1.6;
          display: -webkit-box;
          -webkit-line-clamp: 3;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .post-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px solid #f3f4f6;
        }

        .post-author {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: #6b7280;
          font-size: 0.9rem;
        }

        .author-icon {
          width: 18px;
          height: 18px;
          color: var(--primary);
        }

        .post-actions {
          display: flex;
          gap: 1rem;
        }

        .like-btn, .comment-count {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.9rem;
          color: #6b7280;
        }

        .action-icon {
          width: 18px;
          height: 18px;
        }

        .like-btn .action-icon {
          color: var(--accent);
        }

        .comment-count .action-icon {
          color: var(--primary);
        }

        /* Empty State */
        .no-posts-message {
          grid-column: 1 / -1;
          display: flex;
          justify-content: center;
        }

        .empty-state {
          text-align: center;
          padding: 3rem 2rem;
          max-width: 400px;
        }

        .empty-icon {
          width: 48px;
          height: 48px;
          color: var(--primary-light);
          margin-bottom: 1rem;
        }

        .empty-state h3 {
          color: var(--dark);
          margin: 0 0 0.5rem 0;
          font-size: 1.5rem;
        }

        .empty-state p {
          color: #6b7280;
          margin: 0;
          font-size: 1rem;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .posts-container {
            grid-template-columns: 1fr;
          }
        }

        /* Animation */
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        .post-card {
          animation: fadeIn 0.5s ease forwards;
        }

        .post-card:nth-child(1) { animation-delay: 0.1s; }
        .post-card:nth-child(2) { animation-delay: 0.2s; }
        .post-card:nth-child(3) { animation-delay: 0.3s; }
        .post-card:nth-child(4) { animation-delay: 0.4s; }
        .post-card:nth-child(5) { animation-delay: 0.5s; }
      `}</style>
    </div>
  );
}

export default PostsList;