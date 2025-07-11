import React from "react";

function CategoriesPage() {
  const categories = [
    { 
      name: "Volunteer", 
      icon: "🤝",
      description: "Find volunteer opportunities to help others in need" 
    },
    { 
      name: "Disabled", 
      icon: "♿",
      description: "Resources and support for disabled individuals" 
    },
    { 
      name: "Organization", 
      icon: "🏢",
      description: "Connect with organizations making a difference" 
    },
    { 
      name: "Events", 
      icon: "📅",
      description: "Discover upcoming community events" 
    },
    { 
      name: "Job Opportunities", 
      icon: "💼",
      description: "Find inclusive employment opportunities" 
    },
    { 
      name: "Support Groups", 
      icon: "👥",
      description: "Join supportive communities" 
    }
  ];

  return (
    <div className="categories-container">
      <div className="categories-header">
        <h2>Explore Categories</h2>
        <p>Browse through our different community categories</p>
      </div>
      
      <div className="categories-grid">
        {categories.map((category) => (
          <div key={category.name} className="category-card">
            <div className="category-icon">{category.icon}</div>
            <h3>{category.name}</h3>
            <p>{category.description}</p>
          </div>
        ))}
      </div>

      {/* CSS Styles */}
      <style jsx>{`
        :root {
          --primary-color: #4361ee;
          --primary-dark: #3a5a8a;
          --secondary-color: #3f37c9;
          --accent-color: #4895ef;
          --light-color: #f8f9fa;
          --dark-color: #212529;
          --gray-color: #6c757d;
          --border-radius: 12px;
          --box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
          --transition: all 0.3s ease;
        }

        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
        }

        .categories-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .categories-header {
          text-align: center;
          margin-bottom: 3rem;
        }

        .categories-header h2 {
          font-size: 2rem;
          color: var(--dark-color);
          margin-bottom: 0.5rem;
          font-weight: 600;
        }

        .categories-header p {
          color: var(--gray-color);
          font-size: 1.1rem;
          max-width: 600px;
          margin: 0 auto;
        }

        .categories-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          padding: 1rem;
        }

        .category-card {
          background: white;
          border-radius: var(--border-radius);
          padding: 2rem;
          box-shadow: var(--box-shadow);
          transition: var(--transition);
          text-align: center;
          border: 1px solid rgba(0, 0, 0, 0.05);
          cursor: pointer;
        }

        .category-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
        }

        .category-icon {
          font-size: 3rem;
          margin-bottom: 1.5rem;
          display: inline-block;
          line-height: 1;
          transition: var(--transition);
        }

        .category-card:hover .category-icon {
          transform: scale(1.1);
        }

        .category-card h3 {
          font-size: 1.4rem;
          color: var(--dark-color);
          margin-bottom: 1rem;
          font-weight: 600;
        }

        .category-card p {
          color: var(--gray-color);
          font-size: 1rem;
          line-height: 1.6;
          margin: 0;
        }

        /* Responsive Design */
        @media (max-width: 768px) {
          .categories-header h2 {
            font-size: 1.8rem;
          }
          
          .categories-header p {
            font-size: 1rem;
          }
          
          .categories-grid {
            grid-template-columns: 1fr 1fr;
          }
        }

        @media (max-width: 480px) {
          .categories-container {
            padding: 1.5rem 1rem;
          }
          
          .categories-grid {
            grid-template-columns: 1fr;
          }
          
          .category-card {
            padding: 1.5rem;
          }
        }

        /* Accessibility Focus Styles */
        .category-card:focus-within {
          outline: 2px solid var(--primary-dark);
          outline-offset: 2px;
        }

        /* Reduced Motion */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>
    </div>
  );
}

export default CategoriesPage;